import { Component, input, output, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '../../../../core/models/location.model';

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './city-selector.component.html',
  styleUrl: './city-selector.component.css',
})
export class CitySelectorComponent implements OnInit {
  readonly locations = input<Location[]>([]);
  readonly selected = input<Location | null>(null);
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

  ngOnInit(): void {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.city-selector')) {
        this.isOpen.set(false);
      }
    });
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
