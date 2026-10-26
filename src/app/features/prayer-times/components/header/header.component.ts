import { afterNextRender, Component, computed, inject, input, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../../../core/services/language.service';
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { MethodSwitcherComponent } from '../method-switcher/method-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeSwitcherComponent, MethodSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly city = input<Location | null>(null);
  private readonly locations = inject(LocationService);
  protected readonly timesPath = computed(() =>
    this.city() ? `/${this.locations.citySlug(this.city()!)}` : '/',
  );
  protected readonly qiblaPath = computed(() =>
    this.city() ? `/qibla/${this.locations.citySlug(this.city()!)}` : '/qibla',
  );
  protected readonly langService = inject(LanguageService);
  protected readonly labels = this.langService.labels;
  protected readonly currentLang = this.langService.lang;
  protected readonly menuOpen = signal(false);
  protected readonly logoFilename = 'logo.png';
  /** Hover and slider motion start only after the saved state is already painted. */
  protected readonly motion = signal(false);

  private drawerTouchStartY = 0;

  constructor() {
    afterNextRender(() => {
      requestAnimationFrame(() => this.motion.set(true));
    });
  }

  /** Selects the language on the button that was clicked. */
  protected setLang(code: 'bs' | 'en'): void {
    this.langService.setLanguage(code);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeMenuOnEscape(): void {
    this.closeMenu();
  }

  protected onDrawerTouchStart(event: TouchEvent): void {
    if (!this.menuOpen()) return;
    this.drawerTouchStartY = event.touches[0].clientY;
  }

  /** Swipe downward on the dropdown to collapse (in addition to hamburger / outside tap). */
  protected onDrawerTouchEnd(event: TouchEvent): void {
    if (!this.menuOpen()) return;
    const y = event.changedTouches[0].clientY;
    if (y - this.drawerTouchStartY > 56) this.closeMenu();
  }

  /** Close menu when clicking outside the header chrome */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.menuOpen()) return;
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('.app-header')) return;
    this.menuOpen.set(false);
  }
}
