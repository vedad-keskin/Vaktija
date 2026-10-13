import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/location.model';
import { HeaderComponent } from '../prayer-times/components/header/header.component';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { DUAS } from './duas.data';
import { DHIKR } from './dhikr.data';

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
  private readonly isDhikr = this.route.snapshot.data['collection'] === 'dhikr';
  private readonly items = this.isDhikr ? DHIKR : DUAS;
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
  protected readonly savedOnly = computed(() => this.queryParams().get('view') === 'saved');
  protected readonly visibleDuas = computed(() =>
    this.savedOnly() ? this.items.filter((dua) => this.savedIds().includes(dua.id)) : this.items,
  );

  constructor() {
    this.locationService.getLocations().subscribe((cities) => this.locations.set(cities));
    effect(() => this.title.setTitle(this.copy().docTitle));
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
