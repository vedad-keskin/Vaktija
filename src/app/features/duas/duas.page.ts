import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/location.model';
import { HeaderComponent } from '../prayer-times/components/header/header.component';
import { CitySelectorComponent } from '../prayer-times/components/city-selector/city-selector.component';
import { DUAS, Dua } from './duas.data';

const STORAGE_KEY = 'vaktija_saved_duas';

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
  protected readonly locations = signal<Location[]>([]);
  protected readonly selectedCity = signal(this.locationService.getSelectedLocation());
  protected readonly savedIds = signal(this.readSavedIds());
  protected readonly storageError = signal(false);
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  protected readonly savedOnly = computed(() => this.queryParams().get('view') === 'saved');
  protected readonly visibleDuas = computed(() =>
    this.savedOnly() ? DUAS.filter((dua) => this.savedIds().includes(dua.id)) : DUAS,
  );

  // ponytail: device voices only; add licensed reciter recordings when available.
  private readonly speech =
    typeof window.speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined'
      ? window.speechSynthesis
      : null;
  private readonly arabicVoice = signal<SpeechSynthesisVoice | null>(null);
  protected readonly audioAvailable = computed(() => this.arabicVoice() !== null);
  protected readonly playingId = signal<string | null>(null);
  protected readonly audioError = signal(false);
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.locationService.getLocations().subscribe((cities) => this.locations.set(cities));
    effect(() => this.title.setTitle(this.labels().duasDocTitle));
    effect(() => {
      const playing = this.playingId();
      if (playing && !this.visibleDuas().some((dua) => dua.id === playing)) this.stopAudio();
    });
    this.updateVoices();
    this.speech?.addEventListener('voiceschanged', this.updateVoices);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    inject(DestroyRef).onDestroy(() => {
      this.stopAudio();
      this.speech?.removeEventListener('voiceschanged', this.updateVoices);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    });
  }

  protected onCityChange(city: Location): void {
    this.selectedCity.set(city);
    this.locationService.setSelectedLocation(city);
  }

  private readSavedIds(): string[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      if (!Array.isArray(stored)) return [];
      return [...new Set(stored.filter((id) => DUAS.some((dua) => dua.id === id)))];
    } catch {
      return [];
    }
  }

  protected toggleSaved(id: string): void {
    this.savedIds.update((ids) =>
      ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id],
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedIds()));
      this.storageError.set(false);
    } catch {
      this.storageError.set(true);
    }
  }

  private readonly updateVoices = (): void => {
    try {
      const voices = this.speech?.getVoices().filter((voice) => /^ar(?:[-_]|$)/i.test(voice.lang));
      this.arabicVoice.set(voices?.find((voice) => voice.localService) ?? voices?.[0] ?? null);
    } catch {
      this.arabicVoice.set(null);
    }
    if (!this.arabicVoice()) this.stopAudio();
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) this.stopAudio();
  };

  protected toggleAudio(dua: Dua): void {
    if (this.playingId() === dua.id) {
      this.stopAudio();
      return;
    }
    const voice = this.arabicVoice();
    if (!this.speech || !voice) return;
    this.stopAudio();
    this.audioError.set(false);
    const utterance = new SpeechSynthesisUtterance(dua.arabic);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.85;
    this.utterance = utterance;
    this.playingId.set(dua.id);
    utterance.onend = () => {
      if (this.utterance !== utterance) return;
      this.utterance = null;
      this.playingId.set(null);
    };
    utterance.onerror = () => {
      if (this.utterance !== utterance) return;
      this.utterance = null;
      this.playingId.set(null);
      this.audioError.set(true);
    };
    try {
      this.speech.speak(utterance);
    } catch {
      this.stopAudio();
      this.audioError.set(true);
    }
  }

  private stopAudio(): void {
    const wasPlaying = this.utterance !== null;
    // Clear ownership first: cancel may dispatch callbacks from a replaced utterance.
    this.utterance = null;
    this.playingId.set(null);
    if (wasPlaying) this.speech?.cancel();
  }
}
