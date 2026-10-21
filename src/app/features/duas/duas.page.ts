import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/location.model';
import { HeaderComponent } from '../prayer-times/components/header/header.component';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { DUA_CATEGORIES, DUAS } from './duas.data';
import { DHIKR } from './dhikr.data';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-duas-page',
  imports: [HeaderComponent, CitySelectorComponent, RouterLink],
  templateUrl: './duas.page.html',
  styleUrl: './duas.page.css',
})
export class DuasPage {
  protected readonly language = inject(LanguageService);
  protected readonly labels = this.language.labels;
  private readonly locationService = inject(LocationService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly isDhikr = this.route.snapshot.data['collection'] === 'dhikr';
  private readonly items = this.isDhikr ? DHIKR : DUAS;
  protected readonly categories = computed(() =>
    this.isDhikr
      ? []
      : [...DUA_CATEGORIES].sort((a, b) =>
          a.label[this.language.lang()].localeCompare(
            b.label[this.language.lang()],
            this.language.lang(),
          ),
        ),
  );
  private readonly storageKey = this.isDhikr ? 'vaktija_saved_dhikr' : 'vaktija_saved_duas';
  protected readonly collectionPath = this.isDhikr ? '/dhikr' : '/duas';
  protected readonly copy = computed(() => {
    const labels = this.labels();
    return this.isDhikr
      ? {
          title: labels.dhikrTitle,
          subtitle: labels.dhikrSubtitle,
          docTitle: labels.dhikrDocTitle,
          collectionLabel: labels.dhikrCollectionLabel,
          all: labels.dhikrAll,
          saved: labels.dhikrSaved,
          save: labels.dhikrSave,
          unsave: labels.dhikrUnsave,
          emptyTitle: labels.dhikrEmptyTitle,
          emptyBody: labels.dhikrEmptyBody,
          browse: labels.dhikrBrowse,
          storageError: labels.duasStorageError,
        }
      : {
          title: labels.duasTitle,
          subtitle: labels.duasSubtitle,
          docTitle: labels.duasDocTitle,
          collectionLabel: labels.duasCollectionLabel,
          all: labels.duasAll,
          saved: labels.duasSaved,
          save: labels.duasSave,
          unsave: labels.duasUnsave,
          emptyTitle: labels.duasEmptyTitle,
          emptyBody: labels.duasEmptyBody,
          browse: labels.duasBrowse,
          storageError: labels.duasStorageError,
        };
  });
  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedCity = signal(this.locationService.getSelectedLocation());
  protected readonly savedIds = signal(this.readSavedIds());
  protected readonly storageError = signal(false);
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly visibleCount = signal(PAGE_SIZE);
  protected readonly savedOnly = computed(() => this.queryParams().get('view') === 'saved');
  protected readonly activeCategory = computed(() =>
    this.categories().find((category) => category.id === this.queryParams().get('category')),
  );
  private readonly filteredDuas = computed(() =>
    this.savedOnly()
      ? this.items.filter((dua) => this.savedIds().includes(dua.id))
      : (this.activeCategory()?.items ?? this.items),
  );
  protected readonly visibleDuas = computed(() =>
    this.filteredDuas().slice(0, this.visibleCount()),
  );
  protected readonly hasMore = computed(() => this.visibleCount() < this.filteredDuas().length);
  protected readonly listLabel = computed(() =>
    this.savedOnly()
      ? this.copy().saved
      : (this.activeCategory()?.label[this.language.lang()] ?? this.copy().all),
  );

  constructor() {
    this.locationService.getLocations().subscribe((cities) => this.locations.set(cities));
    effect(() => this.title.setTitle(this.copy().docTitle));
    effect(() => {
      this.queryParams();
      this.visibleCount.set(PAGE_SIZE);
    });
  }

  protected showMore(): void {
    const nextIndex = this.visibleCount();
    this.visibleCount.update((count) => count + PAGE_SIZE);
    afterNextRender(
      () =>
        (this.host.nativeElement as HTMLElement)
          .querySelectorAll<HTMLElement>('.dua-card h2')
          [nextIndex]?.focus(),
      { injector: this.injector },
    );
  }

  protected onCityChange(city: Location): void {
    this.selectedCity.set(city);
    this.locationService.setSelectedLocation(city);
  }

  private readSavedIds(): string[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      if (!Array.isArray(stored)) return [];
      return [...new Set(stored.filter((id) => this.items.some((dua) => dua.id === id)))];
    } catch {
      return [];
    }
  }

  protected toggleSaved(id: string): void {
    this.savedIds.update((ids) =>
      ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id],
    );
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.savedIds()));
      this.storageError.set(false);
    } catch {
      this.storageError.set(true);
    }
  }
}
