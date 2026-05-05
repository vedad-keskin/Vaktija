import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-prayer-times-error-panel',
  standalone: true,
  templateUrl: './prayer-times-error-panel.component.html',
  styleUrls: ['../state-panel-shared.css', './prayer-times-error-panel.component.css'],
})
export class PrayerTimesErrorPanelComponent {
  readonly titleText = input.required<string>();
  readonly messageText = input.required<string>();
  readonly hintText = input.required<string>();
  readonly retryLabel = input.required<string>();

  readonly retry = output<void>();

  protected onRetry(): void {
    this.retry.emit();
  }
}
