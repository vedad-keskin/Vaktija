import { Component, inject, output } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
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

  readonly picked = output<void>();

  /** Any click on the control flips light ↔ dark (including the active segment). */
  protected toggleTheme(): void {
    this.themes.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
    this.picked.emit();
  }
}
