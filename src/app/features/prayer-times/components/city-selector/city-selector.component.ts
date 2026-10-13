import { Component, input, output, signal, computed, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '../../../../core/models/location.model';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './city-selector.component.html',
  styleUrl: './city-selector.component.css',
})
export class CitySelectorComponent {
  protected readonly labels = inject(LanguageService).labels;
  readonly locations = input<Location[]>([]);
  readonly selected = input<Location | null>(null);
  readonly compact = input(false);
  readonly selectionChange = output<Location>();

  protected readonly searchTerm = signal('');
  protected readonly isOpen = signal(false);

  protected readonly filteredLocations = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.locations();
    return this.locations().filter((loc) =>
      loc.name.toLowerCase().includes(term)
    );
  });

  @HostListener('document:click', ['$event'])
  protected closeFromOutside(event: Event): void {
    if (event.target instanceof Element && !event.target.closest('.city-selector')) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown.escape')
  protected closeOnEscape(): void {
    this.isOpen.set(false);
  }

  protected toggleDropdown(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.searchTerm.set('');
    }
  }

  protected selectCity(location: Location): void {
    this.selectionChange.emit(location);
    this.isOpen.set(false);
    this.searchTerm.set('');
  }
}
