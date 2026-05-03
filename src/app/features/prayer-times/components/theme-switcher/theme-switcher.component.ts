import { Component, inject, input, output } from '@angular/core';
import { ThemeService, ThemeMode } from '../../../../core/services/theme.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css',
})
export class ThemeSwitcherComponent {
  private readonly themes = inject(ThemeService);
  protected readonly labels = inject(LanguageService).labels;
  protected readonly theme = this.themes.theme;

  /**
   * When true, individual buttons select their specific value (mobile dropdown).
   * When false, clicking anywhere on the control toggles (desktop).
   */
  readonly directSelect = input(false);

  readonly picked = output<void>();

  /** Desktop: click anywhere toggles */
  protected onContainerClick(): void {
    if (!this.directSelect()) {
      this.themes.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
      this.picked.emit();
    }
  }

  /** Mobile: click specific button to select that theme */
  protected onBtnClick(mode: ThemeMode, event: Event): void {
    if (this.directSelect()) {
      event.stopPropagation();
      this.themes.setTheme(mode);
      this.picked.emit();
    }
  }
}
