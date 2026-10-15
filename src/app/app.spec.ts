import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  const showModal = HTMLDialogElement.prototype.showModal;
  const close = HTMLDialogElement.prototype.close;

  beforeEach(async () => {
    localStorage.clear();
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    HTMLDialogElement.prototype.close = function () { this.open = false; };
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
    if (showModal) HTMLDialogElement.prototype.showModal = showModal;
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    if (close) HTMLDialogElement.prototype.close = close;
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the router outlet shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('asks once for a method and saves the choice', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.open).toBe(true);
    const options = dialog.querySelectorAll<HTMLButtonElement>('.method-intro-options button');
    expect(options[0].getAttribute('aria-pressed')).toBe('true');
    options[1].click();
    await fixture.whenStable();
    expect(options[1].getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('vaktija_method')).toBeNull();
    expect(dialog.open).toBe(true);
    dialog.querySelector<HTMLButtonElement>('.method-intro-confirm')!.click();
    await fixture.whenStable();
    expect(localStorage.getItem('vaktija_method')).toBe('iz');
    expect(dialog.open).toBe(false);
    fixture.destroy();

    const nextVisit = TestBed.createComponent(App);
    await nextVisit.whenStable();
    expect((nextVisit.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBe(false);
    nextVisit.destroy();
  });

  it('skips the dialog when a method was already saved', async () => {
    localStorage.setItem('vaktija_method', '14.6');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBe(false);
    fixture.destroy();
  });

  it('uses the device theme until the user saves a theme choice', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    fixture.destroy();
  });

  it('keeps the saved theme over the device preference', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    localStorage.setItem('vaktija_theme', 'dark');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    fixture.destroy();
  });
});
