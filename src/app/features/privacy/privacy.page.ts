import { Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LanguageService, type LangCode } from '../../core/services/language.service';

interface PrivacySection {
  heading: string;
  paragraphs: string[];
}

interface PrivacyCopy {
  title: string;
  updated: string;
  home: string;
  sections: PrivacySection[];
}

const en: PrivacyCopy = {
  title: 'Privacy policy',
  updated: 'Last updated 23 November 2026',
  home: 'Vaktija',
  sections: [
    {
      heading: 'Who this covers',
      paragraphs: [
        'Vaktija shows prayer times. This page describes the Vaktija phone app and this website.',
      ],
    },
    {
      heading: 'Location for Qibla',
      paragraphs: [
        'If you ask for the Qibla from where you are, Vaktija reads your precise location. That reading stays on your device. It is used only to calculate the direction, and it is not used in the background.',
      ],
    },
    {
      heading: 'Prayer times',
      paragraphs: [
        'When you use the 14.6° angle method, the coordinates of the city you selected are sent to Aladhan (api.aladhan.com) so the timetable can be calculated.',
        'The Islamic Community timetable is stored in the app and stays on your device.',
      ],
    },
    {
      heading: 'Reminders',
      paragraphs: [
        'Prayer reminders, when you turn them on, are scheduled on your device. They are not sent to a push service.',
      ],
    },
    {
      heading: 'Home screen',
      paragraphs: [
        'The home-screen widget, when you add it, reads the timetable already on your device.',
      ],
    },
    {
      heading: 'What we do not do',
      paragraphs: [
        'There is no account. There are no ads. We do not sell your information. Uninstall the app, or clear this site’s data in the browser, to remove what Vaktija stored on the device.',
      ],
    },
  ],
};

const bs: PrivacyCopy = {
  title: 'Politika privatnosti',
  updated: 'Posljednje ažuriranje 23. novembar 2026.',
  home: 'Vaktija',
  sections: [
    {
      heading: 'Na koga se odnosi',
      paragraphs: [
        'Vaktija prikazuje vremena namaza. Ova stranica opisuje aplikaciju Vaktija za telefon i ovu stranicu.',
      ],
    },
    {
      heading: 'Lokacija za kiblu',
      paragraphs: [
        'Ako zatražiš kiblu s mjesta na kojem jesteš, Vaktija očita tvoju tačnu lokaciju. To očitanje ostaje na tvom uređaju. Služi samo za računanje smjera i ne koristi se u pozadini.',
      ],
    },
    {
      heading: 'Vremena namaza',
      paragraphs: [
        'Kad koristiš metodu ugla 14,6°, koordinate grada koji si odabrao šalju se Aladhanu (api.aladhan.com) da se raspored izračuna.',
        'Raspored Islamske zajednice je u aplikaciji i ostaje na tvom uređaju.',
      ],
    },
    {
      heading: 'Podsjetnici',
      paragraphs: [
        'Podsjetnici za namaz, kad ih uključiš, zakazuju se na tvom uređaju. Ne šalju se servisu za obavijesti.',
      ],
    },
    {
      heading: 'Početni ekran',
      paragraphs: [
        'Widget na početnom ekranu, kad ga dodaš, čita raspored koji je već na tvom uređaju.',
      ],
    },
    {
      heading: 'Šta ne radimo',
      paragraphs: [
        'Nema računa. Nema reklama. Tvoje podatke ne prodajemo. Deinstaliraj aplikaciju ili obriši podatke ove stranice u pregledniku da ukloniš ono što je Vaktija sačuvala na uređaju.',
      ],
    },
  ],
};

@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink],
  templateUrl: './privacy.page.html',
  styleUrl: './privacy.page.css',
})
export class PrivacyPage {
  private readonly language = inject(LanguageService);
  private readonly title = inject(Title);
  protected readonly lang = this.language.lang;
  protected readonly copy = computed(() => (this.lang() === 'bs' ? bs : en));

  constructor() {
    effect(() => this.title.setTitle(`${this.copy().title} — Vaktija`));
  }

  protected setLang(code: LangCode): void {
    this.language.setLanguage(code);
  }
}
