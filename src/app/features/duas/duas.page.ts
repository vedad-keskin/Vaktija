import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/location.model';
import { HeaderComponent } from '../prayer-times/components/header/header.component';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { DUA_CATEGORIES, DUAS } from './duas.data';
import { DHIKR } from './dhikr.data';
import { createDuaSearch, normalizeDuaQuery } from './duas-search';

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
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly isDhikr = this.route.snapshot.data['collection'] === 'dhikr';
  private readonly items = this.isDhikr ? DHIKR : DUAS;
  private readonly search = createDuaSearch(this.items);
  private readonly allItems = this.isDhikr
    ? this.items
    : [
        ...DUA_CATEGORIES.filter((category) => category.id === 'general'),
        ...DUA_CATEGORIES.filter((category) => category.id !== 'general'),
      ].flatMap((category) => category.items);
  protected readonly categories = computed(() =>
    this.isDhikr
      ? []
      : [...DUA_CATEGORIES].sort((a, b) =>
          a.id === 'general'
            ? b.id === 'general'
              ? 0
              : -1
            : b.id === 'general'
              ? 1
              : a.label[this.language.lang()].localeCompare(
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
          search: labels.dhikrSearch,
          searchAll: labels.dhikrSearchAll,
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
          search: labels.duasSearch,
          searchAll: labels.duasSearchAll,
        };
  });
  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedCity = signal(this.locationService.getSelectedLocation());
  protected readonly timesPath = computed(
    () => `/${this.locationService.citySlug(this.selectedCity())}`,
  );
  protected readonly savedIds = signal(this.readSavedIds());
  protected readonly storageError = signal(false);
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly visibleCount = signal(PAGE_SIZE);
  protected readonly searchQuery = signal(this.route.snapshot.queryParamMap.get('q') ?? '');
  protected readonly categoriesOpen = signal(false);
  protected readonly hasQuery = computed(() => !!normalizeDuaQuery(this.searchQuery()));
  protected readonly savedOnly = computed(() => this.queryParams().get('view') === 'saved');
  protected readonly activeCategory = computed(() =>
    this.savedOnly()
      ? undefined
      : this.categories().find((category) => category.id === this.queryParams().get('category')),
  );
  private readonly scopedDuas = computed(() =>
    this.savedOnly()
      ? this.items.filter((dua) => this.savedIds().includes(dua.id))
      : (this.activeCategory()?.items ?? this.allItems),
  );
  private readonly filteredDuas = computed(() =>
    this.search(this.scopedDuas(), this.searchQuery()),
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
  protected readonly categoryLabel = computed(
    () => this.activeCategory()?.label[this.language.lang()] ?? this.labels().duasCategories,
  );

  constructor() {
    this.locationService.getLocations().subscribe((cities) => this.locations.set(cities));
    effect(() => this.title.setTitle(this.copy().docTitle));
    effect(() => {
      this.searchQuery.set(this.queryParams().get('q') ?? '');
      this.visibleCount.set(PAGE_SIZE);
    });
  }

  protected toggleCategories(event: Event): void {
    event.stopPropagation();
    this.categoriesOpen.update((open) => !open);
  }

  protected closeCategories(): void {
    this.categoriesOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.categoriesOpen()) return;
    const root = this.host.nativeElement as HTMLElement;
    const target = event.target as Node;
    if (root.querySelector('.duas-category')?.contains(target)) return;
    if (root.querySelector('#dua-categories')?.contains(target)) return;
    this.categoriesOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeCategories();
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
    this.visibleCount.set(PAGE_SIZE);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: query || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected clearSearch(): void {
    this.onSearch('');
    (this.host.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#dua-search')?.focus();
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
