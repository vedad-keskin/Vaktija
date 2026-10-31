import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CitySelectorComponent } from '../city-selector/city-selector.component';
import { HeaderComponent } from './header.component';

@Component({
  imports: [HeaderComponent, CitySelectorComponent],
  template: '<app-header><app-city-selector /></app-header>',
})
class HeaderHostComponent {}

it('closes the mobile menu when the city selector opens', async () => {
  await TestBed.configureTestingModule({
    imports: [HeaderHostComponent],
    providers: [provideRouter([])],
  }).compileComponents();
  const fixture = TestBed.createComponent(HeaderHostComponent);
  await fixture.whenStable();
  const element: HTMLElement = fixture.nativeElement;

  element.querySelector<HTMLButtonElement>('.hamburger')!.click();
  await fixture.whenStable();
  expect(element.querySelector('.mobile-dropdown')?.classList).toContain('open');

  element.querySelector<HTMLButtonElement>('#city-selector-trigger')!.click();
  await fixture.whenStable();
  expect(element.querySelector('.mobile-dropdown')?.classList).not.toContain('open');
  expect(element.querySelector('.selector-dropdown')).toBeTruthy();
});
