import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'dialog[appVaktijaDialog]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.aria-labelledby]': 'titleId()' },
  template: `
    <div class="dialog-panel">
      <div class="dialog-body" tabindex="0" [attr.aria-labelledby]="titleId()">
        <img
          class="dialog-rosette"
          src="/assets/ornaments/dua-crescent-rosette.webp"
          alt=""
          width="47"
          height="47"
        />
        <h2 [id]="titleId()"><ng-content select="[dialog-title]" /></h2>
        <span class="dialog-divider" aria-hidden="true"></span>
        <ng-content />
      </div>
      <div class="dialog-actions"><ng-content select="[dialog-action]" /></div>
    </div>
  `,
  styleUrl: './vaktija-dialog.css',
})
export class VaktijaDialog {
  readonly titleId = input.required<string>();
}
