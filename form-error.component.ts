import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormErrorService } from './form-error.service';
import { NgIf } from '@angular/common';

/**
 * Optional component alternative to the directive.
 * Use when you need more control over placement / styling.
 *
 * Usage:
 *   <form-error [control]="form.get('email')" />
 *   <form-error [control]="form.get('email')" [showAll]="true" />
 */
@Component({
  selector: 'form-error',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="messages.length">
      <span
        *ngFor="let msg of messages"
        class="form-error"
        role="alert"
        aria-live="polite"
      >{{ msg }}</span>
    </ng-container>
  `,
  styles: [`
    :host { display: contents; }
    .form-error {
      display: block;
      font-size: 0.8rem;
      color: var(--fe-error-color, #e53e3e);
      margin-top: 0.25rem;
    }
  `],
})
export class FormErrorComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) control!: AbstractControl | null;

  /** Show all errors at once instead of just the first */
  @Input() showAll = false;

  /** Only show errors when touched (default true) */
  @Input() onlyWhenTouched = true;

  messages: string[] = [];

  private readonly svc = inject(FormErrorService);
  private readonly cdr = inject(ChangeDetectorRef);
  private subs = new Subscription();

  ngOnInit(): void {
    this.subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      this.subs.unsubscribe();
      this.subs = new Subscription();
      this.subscribe();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private subscribe(): void {
    if (!this.control) return;
    const update = () => {
      this.messages = this.showAll
        ? this.svc.getAllErrors(this.control!, this.onlyWhenTouched)
        : (() => {
            const m = this.svc.getError(this.control!, this.onlyWhenTouched);
            return m ? [m] : [];
          })();
      this.cdr.markForCheck();
    };
    this.subs.add(this.control.statusChanges?.subscribe(update));
    this.subs.add(this.control.valueChanges?.subscribe(update));
    update();
  }
}
