import { TestBed } from '@angular/core/testing';
import { CitySelectorComponent } from './city-selector.component';

it('focuses the city search when opened on desktop', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  try {
    await TestBed.configureTestingModule({ imports: [CitySelectorComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CitySelectorComponent);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('.selector-trigger')!.click();
    await fixture.whenStable();
    expect(document.activeElement).toBe(element.querySelector('.search-input'));
    fixture.destroy();
  } finally {
    vi.unstubAllGlobals();
  }
});

it('selects the first matching city with Enter and ignores an empty result', async () => {
  await TestBed.configureTestingModule({ imports: [CitySelectorComponent] }).compileComponents();
  const fixture = TestBed.createComponent(CitySelectorComponent);
  const selection = vi.fn();
  fixture.componentInstance.selectionChange.subscribe(selection);
  fixture.componentRef.setInput('locations', [
    { name: 'Sarajevo', lat: 0, lng: 0 },
    { name: 'Jablanica', lat: 1, lng: 1 },
  ]);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;

  const search = async (term: string) => {
    element.querySelector<HTMLButtonElement>('.selector-trigger')!.click();
    await fixture.whenStable();
    const input = element.querySelector<HTMLInputElement>('.search-input')!;
    input.value = term;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();
  };

  await search('jab');
  expect(selection).toHaveBeenCalledWith({ name: 'Jablanica', lat: 1, lng: 1 });
  expect(element.querySelector('.selector-dropdown')).toBeNull();

  await search('missing');
  expect(selection).toHaveBeenCalledOnce();
  expect(element.querySelector('.selector-dropdown')).not.toBeNull();
});
