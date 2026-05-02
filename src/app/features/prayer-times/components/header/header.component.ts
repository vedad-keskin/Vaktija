import { Component, inject, signal, HostListener } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected readonly langService = inject(LanguageService);
  protected readonly currentLang = this.langService.lang;
  protected readonly menuOpen = signal(false);

  private drawerTouchStartY = 0;

  /** Any click on the language control flips BS ↔ EN (including tapping the active side again). */
  protected toggleLang(): void {
    this.langService.setLanguage(this.currentLang() === 'bs' ? 'en' : 'bs');
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
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
