import { Directive, ElementRef, inject, input } from '@angular/core';

const HOLD_MS = 500;
const SLOP = 10;

@Directive({
  selector: '[copyOnHold]',
  host: {
    '(pointerdown)': 'start($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'finish($event)',
    '(pointercancel)': 'cancel()',
    '(contextmenu)': 'menu($event)',
    '(click)': 'onClick($event)',
  },
})
export class CopyOnHold {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly copyOnHold = input.required<string>();

  private pointerId = -1;
  private originX = 0;
  private originY = 0;
  private started = 0;
  private holding = false;
  private moved = false;
  private copied = false;
  private suppressClick = false;

  start(event: PointerEvent): void {
    if (event.button !== 0 || !this.copyOnHold()) return;
    this.suppressClick = false;
    this.holding = true;
    this.moved = false;
    this.copied = false;
    this.pointerId = event.pointerId;
    this.originX = event.clientX;
    this.originY = event.clientY;
    this.started = performance.now();
  }

  move(event: PointerEvent): void {
    if (!this.holding || event.pointerId !== this.pointerId || this.moved) return;
    if (Math.hypot(event.clientX - this.originX, event.clientY - this.originY) > SLOP) {
      this.moved = true;
    }
  }

  finish(event: PointerEvent): void {
    if (!this.holding || event.pointerId !== this.pointerId) return;
    const held = !this.moved && performance.now() - this.started >= HOLD_MS;
    this.holding = false;
    if (held) this.write();
  }

  cancel(): void {
    this.holding = false;
  }

  menu(event: Event): void {
    if (!this.holding || this.moved) return;
    event.preventDefault();
    this.write();
  }

  onClick(event: Event): void {
    if (!this.suppressClick) return;
    this.suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }

  private write(): void {
    if (this.copied) return;
    this.copied = true;
    this.suppressClick = true;
    void this.copy().catch(() => {
      this.host.nativeElement.dispatchEvent(new CustomEvent('dua-copy-failed', { bubbles: true }));
    });
  }

  private async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.copyOnHold());
    getSelection()?.removeAllRanges();
    try {
      navigator.vibrate?.(10);
    } catch {
      // vibrate is missing or blocked; the text is already copied
    }
  }
}
