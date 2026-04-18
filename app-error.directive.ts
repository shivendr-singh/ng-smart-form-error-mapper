import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { FormErrorService } from './form-error.service';

/**
 * Structural directive that auto-injects an error message element beneath
 * any form control that carries it.
 *
 * Basic usage:
 *   <input formControlName="email" appError />
 *
 * Custom element id / aria link:
 *   <input formControlName="email" appError errorId="email-err" />
 *
 * Show errors immediately (not just on blur):
 *   <input formControlName="email" appError [errorOnDirty]="true" />
 */
@Directive({
  selector: '[appError]',
  standalone: true,
})
export class AppErrorDirective implements OnInit, OnDestroy {
  /** Custom id written onto the generated <span>; wired to aria-describedby automatically */
  @Input() errorId?: string;

  /** When true, shows errors as soon as the control is dirty (not only on touch) */
  @Input() errorOnDirty = false;

  /** Optional extra CSS class(es) on the error span */
  @Input() errorClass = 'form-error';

  private readonly svc   = inject(FormErrorService);
  private readonly ngCtrl = inject(NgControl, { optional: true, self: true });
  private readonly el    = inject(ElementRef);
  private readonly r2    = inject(Renderer2);

  private span!: HTMLSpanElement;
  private mutationObs!: MutationObserver;

  get control(): AbstractControl | null {
    return this.ngCtrl?.control ?? null;
  }

  ngOnInit(): void {
    if (!this.ngCtrl) {
      console.warn('[appError] No NgControl found on host element. Did you add formControlName / ngModel?');
      return;
    }

    // Create sibling error span
    this.span = this.r2.createElement('span');
    const id  = this.errorId ?? `${this.el.nativeElement.id || this.ngCtrl.name}-error`;
    this.r2.setAttribute(this.span, 'id', id);
    this.r2.setAttribute(this.span, 'aria-live', 'polite');
    this.r2.setAttribute(this.span, 'role', 'alert');
    this.r2.addClass(this.span, this.errorClass);

    // Wire aria-describedby on the input
    this.r2.setAttribute(this.el.nativeElement, 'aria-describedby', id);

    // Insert after the host input
    const parent = this.r2.parentNode(this.el.nativeElement);
    const next   = this.el.nativeElement.nextSibling;
    next
      ? this.r2.insertBefore(parent, this.span, next)
      : this.r2.appendChild(parent, this.span);

    // Watch for programmatic status changes (e.g. form.reset(), markAllAsTouched)
    this.mutationObs = new MutationObserver(() => this.updateMessage());
    this.watchControlStatus();
  }

  ngOnDestroy(): void {
    this.mutationObs?.disconnect();
    this.span?.remove();
  }

  @HostListener('blur')
  onBlur(): void {
    this.control?.markAsTouched();
    this.updateMessage();
  }

  @HostListener('input')
  onInput(): void {
    if (this.errorOnDirty) this.updateMessage();
  }

  private watchControlStatus(): void {
    // Poll via MutationObserver is too heavy; use Angular's statusChanges instead.
    // Re-rendered each time status or value changes.
    this.control?.statusChanges?.subscribe(() => this.updateMessage());
    this.control?.valueChanges?.subscribe(() => this.updateMessage());
  }

  private updateMessage(): void {
    if (!this.control) return;
    const onlyTouched = !this.errorOnDirty;
    const msg = this.svc.getError(this.control, onlyTouched);
    this.r2.setProperty(this.span, 'textContent', msg ?? '');

    // Toggle invalid styling on the input itself
    if (msg) {
      this.r2.addClass(this.el.nativeElement, 'ng-error-active');
      this.r2.setAttribute(this.el.nativeElement, 'aria-invalid', 'true');
    } else {
      this.r2.removeClass(this.el.nativeElement, 'ng-error-active');
      this.r2.setAttribute(this.el.nativeElement, 'aria-invalid', 'false');
    }
  }
}
