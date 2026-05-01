import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly locationName = input<string>('');
  readonly dateLabel = input<string>('');
  readonly hijriDate = input<string>('');
}
