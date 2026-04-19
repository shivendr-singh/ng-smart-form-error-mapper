import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppErrorDirective } from './app-error.directive';
import { provideFormErrors } from './provide-form-errors';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, AppErrorDirective],
  template: `
    <div>
      <input id="test-input" [formControl]="ctrl" appError />
    </div>
  `,
})
class TestHostComponent {
  ctrl = new FormControl('', [Validators.required, Validators.minLength(3)]);
}

describe('AppErrorDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideFormErrors({
          required:  () => 'Field is required.',
          minlength: (p) => `Min ${p.requiredLength} chars.`,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(host).toBeTruthy();
  });

  it('should inject a sibling error span', () => {
    const span = fixture.debugElement.query(By.css('.form-error'));
    expect(span).toBeTruthy();
  });

  it('should set aria-describedby on the input', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-describedby')).toContain('error');
  });

  it('should NOT show error before touch', () => {
    const span = fixture.debugElement.query(By.css('.form-error'));
    expect(span.nativeElement.textContent.trim()).toBe('');
  });

  it('should show error after markAsTouched', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.form-error'));
    expect(span.nativeElement.textContent.trim()).toBe('Field is required.');
  });

  it('should clear error when control becomes valid', () => {
    host.ctrl.markAsTouched();
    host.ctrl.setValue('hello');
    fixture.detectChanges();
    const span = fixture.debugElement.query(By.css('.form-error'));
    expect(span.nativeElement.textContent.trim()).toBe('');
  });

  it('should add ng-error-active class on invalid + touched', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.classList.contains('ng-error-active')).toBeTrue();
  });

  it('should set aria-invalid="true" when error is shown', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
  });
});
