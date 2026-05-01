import { Component, inject } from '@angular/core';
import { LanguageService, LangCode } from '../../../../core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected readonly langService = inject(LanguageService);
  protected readonly currentLang = this.langService.lang;

  protected switchLang(code: LangCode): void {
    this.langService.setLanguage(code);
  }
}
