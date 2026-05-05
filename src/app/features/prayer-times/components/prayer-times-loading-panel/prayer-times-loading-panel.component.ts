import { Component, input } from '@angular/core';

@Component({
  selector: 'app-prayer-times-loading-panel',
  standalone: true,
  templateUrl: './prayer-times-loading-panel.component.html',
  styleUrls: ['../state-panel-shared.css', './prayer-times-loading-panel.component.css'],
})
export class PrayerTimesLoadingPanelComponent {
  readonly titleText = input.required<string>();
  readonly subtitleText = input.required<string>();
}
