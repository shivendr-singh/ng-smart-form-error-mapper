import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AppErrorDirective, FormErrorComponent } from 'ng-smart-form-error-mapper';
import { NgIf } from '@angular/common';

/** Custom validator — the key 'passwordStrength' must be registered in app.config.ts */
function passwordStrength(control: AbstractControl): ValidationErrors | null {
  const v = control.value as string;
  if (!v) return null;
  const ok = /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^a-zA-Z0-9]/.test(v);
  return ok ? null : { passwordStrength: true };
}

/** Cross-field validator for the FormGroup */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass  = group.get('password')?.value;
  const pass2 = group.get('confirm')?.value;
  if (!pass2) return null;
  return pass === pass2 ? null : { passwordMatch: true };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, AppErrorDirective, FormErrorComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        name:     ['', [Validators.required]],
        email:    ['', [Validators.required, Validators.email]],
        age:      [null, [Validators.required, Validators.min(18), Validators.max(99)]],
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
        password: ['', [Validators.required, Validators.minLength(8), passwordStrength]],
        confirm:  ['', [Validators.required]],
        bio:      ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      },
      { validators: passwordsMatch },
    );
  }

  get confirmCtrl() {
    // Expose a synthetic control that carries the group-level passwordMatch error
    return this.form.get('confirm')!;
  }

  touchAll(): void { this.form.markAllAsTouched(); }
  reset(): void    { this.form.reset(); this.submitted = false; }

  submit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
  }
}
