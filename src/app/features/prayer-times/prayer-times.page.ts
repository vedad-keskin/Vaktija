import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
  effect,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CitySelectorComponent } from './components/city-selector/city-selector.component';
import { PrayerCardComponent } from './components/prayer-card/prayer-card.component';
import { PrayerTimesLoadingPanelComponent } from './components/prayer-times-loading-panel/prayer-times-loading-panel.component';
import { PrayerTimesErrorPanelComponent } from './components/prayer-times-error-panel/prayer-times-error-panel.component';
import { PrayerTimeService } from '../../core/services/prayer-time.service';
import { PrayerTimesCacheService } from '../../core/services/prayer-times-cache.service';
import { LocationService } from '../../core/services/location.service';
import { LanguageService, type LangCode } from '../../core/services/language.service';
import { CalculationMethodService } from '../../core/services/calculation-method.service';
import { PrayerTimeData, PrayerTime } from '../../core/models/prayer-time.model';
import { Location } from '../../core/models/location.model';
import { sarajevoDayKey } from '../../core/utils/sarajevo-date';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [
    HeaderComponent,
    CitySelectorComponent,
    PrayerCardComponent,
    PrayerTimesLoadingPanelComponent,
    PrayerTimesErrorPanelComponent,
  ],
  templateUrl: './prayer-times.page.html',
  styleUrl: './prayer-times.page.css',
  host: { '(document:keydown.escape)': 'exitFullscreen()' },
})
export class PrayerTimesPage implements OnInit, OnDestroy {
  private readonly prayerTimeService = inject(PrayerTimeService);
  private readonly prayerTimesCache = inject(PrayerTimesCacheService);
  private readonly locationService = inject(LocationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly page = viewChild.required<ElementRef<HTMLElement>>('page');
  private readonly countdownCard = viewChild<ElementRef<HTMLElement>>('countdownCard');
  protected readonly langService = inject(LanguageService);
  private readonly methodService = inject(CalculationMethodService);
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private loadedDay = sarajevoDayKey();
  private regularScroll = 0;
  private fullscreenMotion: Animation[] = [];
  private readonly movingIllustrations = new Map<HTMLImageElement, HTMLImageElement>();
  /** Cancels an in-flight load when a newer one starts (avoids stacked concurrent requests). */
  private prayerLoadSub: Subscription | null = null;

  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedLocation = signal<Location | null>(null);
  protected readonly rawTimes = signal<PrayerTimeData[]>([]);
  protected readonly dateLabel = signal('');
  protected readonly hijriDate = signal('');
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly now = signal(new Date());
  protected readonly fullscreen = signal(false);

  /** Reactive labels shortcut */
  protected readonly labels = this.langService.labels;

  /** One elapsed-time calculation drives both the horizon and the stepped schedule trail. */
  private readonly currentInterval = computed(() => {
    const times = this.rawTimes();
    const current = this.now();
    const currentMin = current.getHours() * 60 + current.getMinutes();
    const currentTotalSec =
      current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds();

    if (!times.length) return null;

    // Find the index of the next prayer (first whose minutes > currentMin)
    let nextIdx = times.findIndex((t) => t.minutes > currentMin);
    // If all have passed, next is first prayer (tomorrow)
    if (nextIdx === -1) nextIdx = 0;
    // Current prayer is the one just before the next
    const currentIdx = nextIdx === 0 ? times.length - 1 : nextIdx - 1;

    // Calculate progress for the current prayer window
    const currentPrayer = times[currentIdx];
    const nextPrayer = times[nextIdx];

    let windowDurationSec: number;
    let elapsedSec: number;

    if (nextIdx > currentIdx) {
      // Normal case: both prayers are on the same day
      windowDurationSec = (nextPrayer.minutes - currentPrayer.minutes) * 60;
      elapsedSec = currentTotalSec - currentPrayer.minutes * 60;
    } else {
      // Wrap around midnight: current is last prayer of day, next is first of tomorrow
      windowDurationSec = ((24 * 60 - currentPrayer.minutes) + nextPrayer.minutes) * 60;
      const secSinceCurrent = currentTotalSec - currentPrayer.minutes * 60;
      elapsedSec = secSinceCurrent >= 0
        ? secSinceCurrent
        : currentTotalSec + (24 * 60 - currentPrayer.minutes) * 60;
    }

    const rawProgress = windowDurationSec > 0 ? (elapsedSec / windowDurationSec) * 100 : 0;
    return { currentIdx, nextIdx, currentMin, progress: Math.min(100, Math.max(0, rawProgress)) };
  });

  /** All 8 prayer times with dynamic isPassed/isActive/isCurrent/isNext/progress/relativeText */
  protected readonly displayTimes = computed<PrayerTime[]>(() => {
    const times = this.rawTimes();
    const interval = this.currentInterval();
    if (!interval) return [];
    const { currentIdx, nextIdx, currentMin } = interval;
    // Quantize to 2% steps for a clean visual
    const progress = Math.round(interval.progress / 2) * 2;

    return times.map((t, i) => {
      const isCurrent = i === currentIdx;
      const isNext = i === nextIdx;
      const isPassed = !isCurrent && !isNext && t.minutes <= currentMin;

      return {
        ...t,
        isPassed: isPassed && nextIdx !== 0, // If all passed (wrap), don't dim everything
        isActive: isNext,
        isCurrent,
        isNext,
        progress: isCurrent ? progress : 0,
        relativeText: this.formatRelative(
          t.minutes - currentMin + (isNext && t.minutes <= currentMin ? 24 * 60 : 0)
            - (isCurrent && t.minutes > currentMin ? 24 * 60 : 0),
        ),
      };
    });
  });

  /**
   * Time elapsed from the listed current time toward the next (wraps at midnight).
   */
  protected readonly countdownWindowProgress = computed(() => this.currentInterval()?.progress ?? 0);

  /** The trail uses the same live interval as the countdown, including the midnight return. */
  protected readonly trailInterval = computed(() => {
    const times = this.displayTimes();
    const from = times.find((time) => time.isCurrent);
    const to = times.find((time) => time.isNext);
    if (!from || !to) return null;
    return {
      from, to,
      wraps: times[0] === to,
      nowMinutes: this.now().getHours() * 60 + this.now().getMinutes(),
    };
  });

  /** Countdown to the next upcoming prayer */
  protected readonly countdown = computed(() => {
    const times = this.rawTimes();
    const current = this.now();
    if (!times.length) return null;

    const currentTotalSec =
      current.getHours() * 3600 + current.getMinutes() * 60 + current.getSeconds();

    // Find next prayer (first whose minutes > current minutes)
    const currentMin = Math.floor(currentTotalSec / 60);
    let next = times.find((t) => t.minutes > currentMin);
    let diffSec: number;

    if (next) {
      diffSec = next.minutes * 60 - currentTotalSec;
    } else {
      // All passed — next is first prayer tomorrow
      next = times[0];
      diffSec = (next.minutes + 24 * 60) * 60 - currentTotalSec;
    }

    if (diffSec < 0) diffSec += 24 * 3600;

    return {
      name: next.name,
      hours: Math.floor(diffSec / 3600),
      minutes: Math.floor((diffSec % 3600) / 60),
      seconds: diffSec % 60,
    };
  });

  constructor() {
    // Re-fetch prayer times whenever language changes so names update
    effect(() => {
      const _lang = this.langService.lang();
      const _method = this.methodService.method();
      const hasChosen = this.methodService.hasChosen();
      const loc = this.selectedLocation();
      if (!loc || !hasChosen) return;
      untracked(() => this.loadPrayerTimes(loc));
    });

    effect(() => {
      const loc = this.selectedLocation();
      this.titleService.setTitle(loc?.name ? `Vaktija — ${loc.name}` : 'Vaktija');
    });

    effect((onCleanup) => {
      const card = this.fullscreen() ? this.countdownCard()?.nativeElement : null;
      if (!card || typeof ResizeObserver === 'undefined') return;
      const page = this.page().nativeElement;
      const updatePinning = () => {
        // Leave room for a legible row below the fixed-size card.
        page.toggleAttribute('data-pin-countdown', page.clientHeight - card.offsetHeight >= 112);
      };
      const observer = new ResizeObserver(updatePinning);
      observer.observe(page);
      observer.observe(card);
      onCleanup(() => {
        observer.disconnect();
        page.removeAttribute('data-pin-countdown');
      });
    });
  }

  ngOnInit(): void {
    this.prayerTimesCache.pruneStale();
    this.loadLocations();
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.fullscreen()) {
        this.cancelFullscreenMotion();
        this.fullscreen.set(false);
      }
      this.selectedLocation.set(this.locationService.getSelectedLocation());
    });
    // Prayer load is driven by the constructor effect when `selectedLocation` / lang / method change.

    // Tick every second for countdown + relative times
    this.tickInterval = setInterval(() => {
      const now = new Date();
      this.now.set(now);
      const day = sarajevoDayKey(now);
      if (day !== this.loadedDay) {
        this.loadedDay = day;
        this.prayerTimesCache.pruneStale();
        const location = this.selectedLocation();
        if (location) this.loadPrayerTimes(location);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.prayerLoadSub?.unsubscribe();
    this.cancelFullscreenMotion();
  }

  protected onCityChange(location: Location): void {
    this.selectedLocation.set(location);
    this.locationService.setSelectedLocation(location);
    void this.router.navigateByUrl(`/${this.locationService.citySlug(location)}`);
    // Reload via effect (tracks selectedLocation).
  }

  /** Refetch prayer times for the current city (error panel Retry). */
  protected retryLoad(): void {
    const loc = this.selectedLocation();
    if (loc) this.loadPrayerTimes(loc);
  }

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  protected exitFullscreen(): void {
    if (this.fullscreen()) this.toggleFullscreen();
  }

  protected toggleFullscreen(): void {
    const page = this.page().nativeElement;
    const card = this.countdownCard()?.nativeElement;
    const entering = !this.fullscreen();
    const animate =
      typeof card?.animate === 'function' &&
      !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const toolbar = page.querySelector<HTMLElement>('.page-toolbar')!;
    const grid = animate ? page.querySelector<HTMLElement>('.prayer-grid') : null;
    const rows = grid ? [...grid.querySelectorAll<HTMLElement>('.prayer-stop')] : [];
    const illustrations = grid
      ? [...grid.querySelectorAll<HTMLImageElement>('.prayer-symbol img')].filter(
          (image) => image.complete && image.naturalWidth > 0,
        )
      : [];

    // Capture current visual positions before cancelling a transition that is in flight.
    const startCard = animate ? card.getBoundingClientRect() : null;
    const startRows = rows.map((row) => row.getBoundingClientRect());
    const startIllustrations = illustrations.map((image) =>
      (this.movingIllustrations.get(image) ?? image).getBoundingClientRect(),
    );
    const toolbarOpacity = animate ? getComputedStyle(toolbar).opacity : '';
    const toolbarTop = animate ? toolbar.getBoundingClientRect().top : 0;
    this.cancelFullscreenMotion();
    if (entering) this.regularScroll = window.scrollY;
    this.fullscreen.set(entering);
    this.changeDetector.detectChanges();
    if (entering) {
      page.scrollTop = 0;
    } else if (window.scrollY !== this.regularScroll) {
      window.scrollTo({ top: this.regularScroll, behavior: 'instant' });
    }
    if (!card || !startCard) return;

    // Read the new layout as one batch. Everything after this runs as transforms or opacity.
    const cardOffset = startCard.top - card.getBoundingClientRect().top;
    const endRows = rows.map((row) => row.getBoundingClientRect());
    const endIllustrations = illustrations.map((image) => image.getBoundingClientRect());
    const gridBounds = grid?.getBoundingClientRect();
    const toolbarOffset = toolbarTop - toolbar.getBoundingClientRect().top;
    const slide = 310;
    const compress = 210;
    const easing = 'ease-in-out';
    const translate = (y: number) => `translateY(${y}px)`;
    const animateRowPart = (element: HTMLElement, start: string, middle: string) => {
      const animation = element.animate(
        [
          { transform: start, easing },
          { transform: middle, offset: (entering ? slide : compress) / (slide + compress), easing },
          { transform: 'none' },
        ],
        { duration: slide + compress },
      );
      this.fullscreenMotion.push(animation);
      return animation;
    };
    const slideOptions: KeyframeAnimationOptions = {
      duration: slide,
      delay: entering ? 0 : compress,
      easing,
      fill: 'backwards',
    };
    this.fullscreenMotion.push(
      card.animate([{ transform: translate(cardOffset) }, { transform: 'none' }], slideOptions),
      toolbar.animate(
        [
          { opacity: toolbarOpacity, visibility: 'visible', transform: translate(entering ? toolbarOffset : -12) },
          { opacity: entering ? 0 : 1, visibility: 'visible', transform: translate(entering ? toolbarOffset - 12 : 0) },
        ],
        slideOptions,
      ),
    );

    for (const [i, row] of rows.entries()) {
      const start = startRows[i];
      const end = endRows[i];
      if (!end.width || !end.height) continue;
      const x = start.left - end.left;
      const y = start.top - end.top;
      const scale = `scale(${start.width / end.width}, ${start.height / end.height})`;
      animateRowPart(
        row,
        `translate(${x}px, ${y}px) ${scale}`,
        entering ? `translate(${x}px, ${y - cardOffset}px) ${scale}` : translate(cardOffset),
      );
    }

    if (!grid || !gridBounds) return;
    for (const [i, image] of illustrations.entries()) {
      const start = startIllustrations[i];
      const end = endIllustrations[i];
      if (!start.width || !end.width) continue;

      // Let the art travel with the scrollable grid, outside the row's vertical scale.
      const layer = image.cloneNode() as HTMLImageElement;
      layer.setAttribute('aria-hidden', 'true');
      layer.setAttribute('data-prayer-illustration-motion', '');
      Object.assign(layer.style, {
        position: 'absolute',
        pointerEvents: 'none',
        left: `${end.left - gridBounds.left}px`,
        top: `${end.top - gridBounds.top}px`,
        width: `${end.width}px`,
        height: `${end.height}px`,
      });
      grid.append(layer);
      image.style.visibility = 'hidden';
      this.movingIllustrations.set(image, layer);

      const x = start.left - end.left + (start.width - end.width) / 2;
      const y = start.top - end.top + (start.height - end.height) / 2;
      const scale = start.width / end.width;
      const from = (offset: number) => `translate(${x}px, ${offset}px) scale(${scale})`;
      const motion = animateRowPart(
        layer,
        from(y),
        entering ? from(y - cardOffset) : translate(cardOffset),
      );
      motion.onfinish = () => {
        if (this.movingIllustrations.get(image) !== layer) return;
        this.restoreIllustration(image);
        this.fullscreenMotion = this.fullscreenMotion.filter((animation) => animation !== motion);
      };
    }
  }

  private cancelFullscreenMotion(): void {
    for (const animation of this.fullscreenMotion) animation.cancel();
    this.fullscreenMotion = [];
    for (const image of this.movingIllustrations.keys()) this.restoreIllustration(image);
  }

  private restoreIllustration(image: HTMLImageElement): void {
    this.movingIllustrations.get(image)?.remove();
    this.movingIllustrations.delete(image);
    image.style.removeProperty('visibility');
  }

  private loadLocations(): void {
    this.locationService.getLocations().subscribe({
      next: (locs) => this.locations.set(locs),
      error: (err) => console.error('Failed to load locations:', err),
    });
  }

  private loadPrayerTimes(location: Location): void {
    this.prayerLoadSub?.unsubscribe();

    const method = this.methodService.method();
    const lang = this.langService.lang();

    const cached = method === '14.6'
      ? this.prayerTimesCache.read(location, method, lang)
      : null;
    if (
      method === '14.6' &&
      this.prayerTimesCache.hasFetchedToday(location, method, lang) &&
      !cached
    ) {
      this.prayerTimesCache.clearFetchGate(location, method, lang);
    }

    if (cached) {
      this.rawTimes.set(cached.prayerTimes);
      this.dateLabel.set(cached.dateLabel);
      this.hijriDate.set(cached.hijriDate);
      this.error.set(null);
      this.isLoading.set(false);
      /* Valid snapshot for today → at most one fetch/day per key; no duplicate HTTP. */
      return;
    }

    this.error.set(null);

    if (method === '14.6' && !navigator.onLine) {
      this.error.set(this.langService.labels().errorGeneric);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    this.prayerLoadSub = this.prayerTimeService.getTodayPrayerTimes(location).subscribe({
      next: ({ snapshots }) => {
        if (method === '14.6') {
          const codes: LangCode[] = ['bs', 'en'];
          const primary = this.langService.lang();
          const writeOrder = [primary, ...codes.filter((c) => c !== primary)];
          for (const code of writeOrder) {
            const snap = snapshots[code];
            this.prayerTimesCache.write(location, method, code, {
              prayerTimes: snap.prayerTimes,
              locationName: snap.locationName,
              dateLabel: snap.dateLabel,
              hijriDate: snap.hijriDate,
            });
          }
        }

        const active = snapshots[this.langService.lang()];
        this.rawTimes.set(active.prayerTimes);
        this.dateLabel.set(active.dateLabel);
        this.hijriDate.set(active.hijriDate);
        this.isLoading.set(false);
        this.error.set(null);
      },
      error: () => {
        this.error.set(this.langService.labels().errorGeneric);
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Formats a minute-difference as relative time using active language labels.
   * Negative = in the past, positive = in the future.
   */
  private formatRelative(diffMinutes: number): string {
    const labels = this.langService.labels();
    const abs = Math.abs(diffMinutes);

    if (abs < 1) return labels.relativeNow;

    const lang = this.langService.lang();
    const h = Math.floor(abs / 60);
    const m = abs % 60;

    if (lang === 'en') {
      // English: "in 2 hours" / "5 minutes ago"
      const prefix = diffMinutes <= 0 ? '' : labels.relativeFuture + ' ';
      const suffix = diffMinutes <= 0 ? ' ' + labels.relativePast : '';
      if (h === 0) return `${prefix}${m} ${this.minPluralEn(m)}${suffix}`;
      if (m === 0) return `${prefix}${h} ${this.hrPluralEn(h)}${suffix}`;
      return `${prefix}${h}h ${m}min${suffix}`;
    }

    // Bosnian: "prije 2 sata" / "za 5 minuta"
    const prefix = diffMinutes <= 0 ? labels.relativePast : labels.relativeFuture;
    if (h === 0) return `${prefix} ${m} ${this.minPluralBs(m)}`;
    if (m === 0) return `${prefix} ${h} ${this.hrPluralBs(h)}`;
    return `${prefix} ${h}h ${m}min`;
  }

  private hrPluralBs(n: number): string {
    const labels = this.langService.labels();
    if (n === 1) return labels.hrSingular;
    if (n >= 2 && n <= 4) return labels.hrFew;
    return labels.hrPlural;
  }

  private minPluralBs(n: number): string {
    const labels = this.langService.labels();
    if (n === 1) return labels.minSingular;
    if (n >= 2 && n <= 4) return labels.minFew;
    return labels.minPlural;
  }

  private hrPluralEn(n: number): string {
    return n === 1 ? 'hour' : 'hours';
  }

  private minPluralEn(n: number): string {
    return n === 1 ? 'minute' : 'minutes';
  }
}
