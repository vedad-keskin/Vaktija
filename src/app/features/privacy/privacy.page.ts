import { Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LanguageService, type LangCode } from '../../core/services/language.service';
import { ThemeSwitcherComponent } from '../prayer-times/components/theme-switcher/theme-switcher.component';

interface PrivacySection {
  id: string;
  heading: string;
  paragraphs: string[];
  links?: { label: string; href: string }[];
}

interface PrivacyCopy {
  title: string;
  updated: string;
  home: string;
  intro: string;
  language: string;
  summaryLabel: string;
  summary: { heading: string; text: string }[];
  contactHeading: string;
  contactText: string;
  contactNote: string;
  sections: PrivacySection[];
}

const en: PrivacyCopy = {
  title: 'Privacy policy',
  updated: 'Last updated 23 November 2026',
  home: 'Back to Vaktija',
  intro: 'What stays on your device, when Vaktija connects, and the choices you control.',
  language: 'Language',
  summaryLabel: 'Privacy at a glance',
  summary: [
    { heading: 'No account', text: 'Use Vaktija without signing in.' },
    { heading: 'No ads', text: 'No ads or usage analytics.' },
    { heading: 'Your choice', text: 'Location is optional for Qibla.' },
  ],
  contactHeading: 'Questions about your privacy?',
  contactText:
    'Nightfall Studio is responsible for Vaktija. Contact us about this policy, your choices, or a request to delete correspondence.',
  contactNote:
    'If you email us, we receive your email address and the information you include. We use it to answer your request and keep it only as long as needed to resolve it and meet applicable legal obligations.',
  sections: [
    {
      id: 'about',
      heading: 'About this policy',
      paragraphs: [
        'Vaktija is made by Nightfall Studio. This policy covers the Vaktija Android app distributed through Google Play and the website at vaktija.life. Vaktija provides prayer times, duas, dhikr, and the direction of the Qibla.',
      ],
    },
    {
      id: 'device',
      heading: 'Saved on your device',
      paragraphs: [
        'The app saves your selected city, prayer-time method, language, theme, fullscreen preference, and dua and dhikr bookmarks in local app storage. It also caches prayer times fetched from Aladhan so they can be shown again without another request.',
        'These settings and bookmarks are not uploaded to Nightfall Studio. The Islamic Community timetable, duas, dhikr, and app fonts are bundled with the app and can be read offline.',
      ],
    },
    {
      id: 'location',
      heading: 'Location and compass',
      paragraphs: [
        'Qibla works using your selected city without location permission. When you tap My location, the Android app requests location permission and obtains a location reading. Depending on your permission choice, Android may provide an approximate or precise location.',
        'The app uses that reading in memory to calculate the Qibla direction on your device. It does not save it to app storage or send it to Nightfall Studio or Aladhan. It does not track your location in the background. You can return to the selected city or revoke location permission in Android settings.',
        'When you start the compass, Vaktija reads the phone’s orientation and motion sensors to show its heading and whether it is held flat. Those readings are processed on the device and are not uploaded. Android location services operate according to your device settings.',
      ],
    },
    {
      id: 'prayer-times',
      heading: 'Prayer times and Aladhan',
      paragraphs: [
        'The Islamic Community (IZ) method uses the timetable bundled with the app. When the 14.6° angle method needs an uncached timetable, Vaktija makes an HTTPS request to Aladhan (api.aladhan.com). The request contains the selected city’s coordinates, the date, time zone, and calculation settings. It does not contain the location reading used for Qibla or your bookmarks.',
        'Aladhan also receives your IP address and standard connection details as part of the request. Aladhan operates this external service and controls any server logs and their retention; clearing Vaktija’s storage does not delete those logs.',
      ],
      links: [{ label: 'About the Aladhan API', href: 'https://aladhan.com/prayer-times-api' }],
    },
    {
      id: 'accounts',
      heading: 'Accounts, ads, and tracking',
      paragraphs: [
        'Vaktija does not require an account and has no ads, advertising SDKs, analytics SDKs, or crash-reporting SDKs. Nightfall Studio does not sell your information or build an advertising profile from your use of Vaktija.',
      ],
    },
    {
      id: 'links',
      heading: 'Links to other websites',
      paragraphs: [
        'If you open a dua or dhikr source, the app opens that website in your browser. The website then receives a normal browser request and handles it under its own privacy policy. Vaktija does not attach your bookmarks or Qibla location to these links.',
      ],
    },
    {
      id: 'website',
      heading: 'Using this website',
      paragraphs: [
        'The website saves preferences, bookmarks, and cached timetables in your browser. Its 14.6° method also requests prayer times from Aladhan using the selected city’s coordinates.',
        'If you enable My location for Qibla on the website, your browser can supply location updates while that option is active. Vaktija calculates the direction locally and does not send those coordinates to Nightfall Studio or Aladhan. You can switch back to your city, leave the Qibla page, or revoke the site’s location permission in your browser.',
        'The website is hosted on Vercel and requests fonts from Google Fonts. These providers receive connection details such as your IP address and browser information to serve the site and fonts. The Android app bundles its fonts and does not request them from Google Fonts. Provider-managed logs and retention are outside Vaktija’s local storage.',
      ],
      links: [
        { label: 'Vercel privacy notice', href: 'https://vercel.com/legal/privacy-notice' },
        { label: 'Google privacy policy', href: 'https://policies.google.com/privacy' },
      ],
    },
    {
      id: 'deletion',
      heading: 'Keeping and removing data',
      paragraphs: [
        'Your app preferences and bookmarks remain until you change them, clear app storage in Android settings, or uninstall the app. Cached Aladhan results are pruned as the app loads timetables, keeping results around the current day. To remove the website’s saved information and offline cache, clear its site data in your browser.',
        'Android may back up app settings and bookmarks or transfer them to another device, depending on your system settings. Uninstalling the app does not necessarily remove a system backup. Manage backups through your device or Google account settings. Nightfall Studio does not operate an account or cloud-sync service for your bookmarks.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      paragraphs: [
        'We will update this page when Vaktija’s features or data handling change. The date above shows when the policy was last revised.',
      ],
    },
  ],
};

const bs: PrivacyCopy = {
  title: 'Politika privatnosti',
  updated: 'Posljednje ažuriranje: 23. novembra 2026.',
  home: 'Nazad na Vaktiju',
  intro: 'Šta ostaje na tvom uređaju, kada se Vaktija povezuje i kojim izborima upravljaš.',
  language: 'Jezik',
  summaryLabel: 'Privatnost ukratko',
  summary: [
    { heading: 'Bez računa', text: 'Koristi Vaktiju bez prijave.' },
    { heading: 'Bez reklama', text: 'Bez oglasa i analitike korištenja.' },
    { heading: 'Tvoj izbor', text: 'Lokacija za kiblu nije obavezna.' },
  ],
  contactHeading: 'Imaš pitanje o privatnosti?',
  contactText:
    'Nightfall Studio je odgovoran za Vaktiju. Piši nam o ovoj politici, svojim izborima ili ako želiš zatražiti brisanje prepiske.',
  contactNote:
    'Ako nam pošalješ email, primamo tvoju email adresu i informacije koje navedeš. Koristimo ih za odgovor na tvoj zahtjev i čuvamo samo dok je potrebno da ga riješimo i ispunimo primjenjive zakonske obaveze.',
  sections: [
    {
      id: 'about',
      heading: 'O ovoj politici',
      paragraphs: [
        'Vaktiju razvija Nightfall Studio. Ova politika obuhvata Android aplikaciju Vaktija dostupnu putem Google Playa i web-stranicu vaktija.life. Vaktija prikazuje namaska vremena, dove, zikrove i smjer kible.',
      ],
    },
    {
      id: 'device',
      heading: 'Sačuvano na tvom uređaju',
      paragraphs: [
        'Aplikacija u lokalnoj pohrani čuva odabrani grad, metodu računanja namaskih vremena, jezik, temu, postavku cijelog ekrana te sačuvane dove i zikrove. Privremeno čuva i namaska vremena preuzeta od Aladhana kako bi ih ponovo prikazala bez novog zahtjeva.',
        'Ove postavke i sačuvane dove i zikrovi ne šalju se studiju Nightfall Studio. Raspored Islamske zajednice, dove, zikrovi i fontovi dio su aplikacije i dostupni su bez interneta.',
      ],
    },
    {
      id: 'location',
      heading: 'Lokacija i kompas',
      paragraphs: [
        'Kibla koristi odabrani grad i bez dozvole za lokaciju. Kada dodirneš Moja lokacija, Android aplikacija traži dozvolu i očitava lokaciju. Zavisno od dozvole koju odabereš, Android može dati približnu ili tačnu lokaciju.',
        'Aplikacija koristi to očitanje u memoriji za računanje smjera kible na tvom uređaju. Ne sprema ga u pohranu aplikacije niti šalje studiju Nightfall Studio ili Aladhanu. Ne prati tvoju lokaciju u pozadini. Možeš se vratiti na odabrani grad ili ukinuti dozvolu za lokaciju u postavkama Androida.',
        'Kada pokreneš kompas, Vaktija čita senzore orijentacije i kretanja telefona kako bi prikazala smjer i provjerila držiš li telefon ravno. Ova očitanja obrađuju se na uređaju i ne šalju se na server. Androidove lokacijske usluge rade u skladu s postavkama tvog uređaja.',
      ],
    },
    {
      id: 'prayer-times',
      heading: 'Namaska vremena i Aladhan',
      paragraphs: [
        'Metoda Islamske zajednice (IZ) koristi raspored koji je dio aplikacije. Kada metodi ugla 14,6° treba raspored koji nije lokalno sačuvan, Vaktija šalje HTTPS zahtjev Aladhanu (api.aladhan.com). Zahtjev sadrži koordinate odabranog grada, datum, vremensku zonu i postavke računanja. Ne sadrži očitanje lokacije za kiblu niti tvoje sačuvane dove i zikrove.',
        'Aladhan uz zahtjev prima i tvoju IP adresu i uobičajene podatke o vezi. Aladhan upravlja ovom vanjskom uslugom, mogućim serverskim zapisima i njihovim čuvanjem. Brisanje Vaktijine pohrane ne briše te zapise.',
      ],
      links: [{ label: 'O Aladhanovom API-ju', href: 'https://aladhan.com/prayer-times-api' }],
    },
    {
      id: 'accounts',
      heading: 'Računi, reklame i praćenje',
      paragraphs: [
        'Vaktija ne zahtijeva račun i nema reklame niti SDK-ove za oglašavanje, analitiku ili prijavljivanje rušenja aplikacije. Nightfall Studio ne prodaje tvoje podatke niti na osnovu korištenja Vaktije pravi profil za oglašavanje.',
      ],
    },
    {
      id: 'links',
      heading: 'Linkovi na druge stranice',
      paragraphs: [
        'Ako otvoriš izvor dove ili zikra, aplikacija otvara tu stranicu u tvom pregledniku. Stranica tada prima uobičajen zahtjev preglednika i obrađuje ga prema svojoj politici privatnosti. Vaktija ovim linkovima ne dodaje tvoje sačuvane dove i zikrove niti lokaciju za kiblu.',
      ],
    },
    {
      id: 'website',
      heading: 'Korištenje ove web-stranice',
      paragraphs: [
        'Web-stranica u tvom pregledniku čuva postavke, sačuvane dove i zikrove te privremene rasporede. Njena metoda ugla 14,6° također traži namaska vremena od Aladhana koristeći koordinate odabranog grada.',
        'Ako na web-stranici uključiš Moja lokacija za kiblu, preglednik može dostavljati ažuriranja lokacije dok je ta opcija aktivna. Vaktija smjer računa lokalno i ne šalje te koordinate studiju Nightfall Studio ili Aladhanu. Možeš se vratiti na svoj grad, napustiti stranicu kible ili ukinuti dozvolu za lokaciju u pregledniku.',
        'Web-stranica je smještena na Vercelu i učitava fontove putem Google Fontsa. Ovi pružaoci primaju podatke o vezi, poput tvoje IP adrese i podataka o pregledniku, kako bi isporučili stranicu i fontove. Android aplikacija sadrži fontove i ne preuzima ih putem Google Fontsa. Zapisi kojima upravljaju ovi pružaoci i njihovo čuvanje odvojeni su od Vaktijine lokalne pohrane.',
      ],
      links: [
        {
          label: 'Vercelova obavijest o privatnosti',
          href: 'https://vercel.com/legal/privacy-notice',
        },
        { label: 'Googleova politika privatnosti', href: 'https://policies.google.com/privacy' },
      ],
    },
    {
      id: 'deletion',
      heading: 'Čuvanje i brisanje podataka',
      paragraphs: [
        'Postavke i sačuvane dove i zikrovi ostaju dok ih ne promijeniš, obrišeš pohranu aplikacije u postavkama Androida ili deinstaliraš aplikaciju. Privremeno sačuvani Aladhanovi rezultati čiste se pri učitavanju rasporeda, uz zadržavanje rezultata oko tekućeg dana. Za uklanjanje sačuvanih podataka web-stranice i sadržaja za rad bez interneta obriši podatke ove stranice u pregledniku.',
        'Android može napraviti sigurnosnu kopiju postavki i sačuvanih dova i zikrova ili ih prenijeti na drugi uređaj, zavisno od sistemskih postavki. Deinstalacija aplikacije ne mora ukloniti sistemsku sigurnosnu kopiju. Njome upravljaš kroz postavke uređaja ili Google računa. Nightfall Studio nema korisničke račune ni uslugu sinhronizacije sačuvanih dova i zikrova u oblaku.',
      ],
    },
    {
      id: 'changes',
      heading: 'Izmjene ove politike',
      paragraphs: [
        'Ovu stranicu ćemo ažurirati kada se promijene Vaktijine funkcije ili način obrade podataka. Datum iznad pokazuje kada je politika posljednji put izmijenjena.',
      ],
    },
  ],
};

@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink, ThemeSwitcherComponent],
  templateUrl: './privacy.page.html',
  styleUrl: './privacy.page.css',
})
export class PrivacyPage {
  protected readonly contactEmail = 'vedad.keskin98@gmail.com';
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
