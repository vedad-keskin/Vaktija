import { afterNextRender, Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalculationMethod, CalculationMethodService } from './core/services/calculation-method.service';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inject early so the theme is applied before first paint
  private readonly themeService = inject(ThemeService);
  private readonly methods = inject(CalculationMethodService);
  protected readonly language = inject(LanguageService);
  protected readonly labels = this.language.labels;
  private readonly methodIntro = viewChild<ElementRef<HTMLDialogElement>>('methodIntro');

  constructor() {
    afterNextRender(() => {
      if (!this.methods.hasChosen()) this.methodIntro()?.nativeElement.showModal();
    });
  }

  protected chooseMethod(method: CalculationMethod): void {
    this.methods.setMethod(method);
    this.methodIntro()?.nativeElement.close();
  }

  protected keepMethodIntroOpen(event: Event): void {
    event.preventDefault();
  }
}
