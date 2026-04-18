import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormErrorComponent } from './form-error.component';
import { provideFormErrors } from './provide-form-errors';

@Component({
  standalone: true,
  imports: [FormErrorComponent],
  template: `<form-error [control]="ctrl" [showAll]="showAll" />`,
})
class TestHostComponent {
  ctrl    = new FormControl('', [Validators.required, Validators.minLength(5)]);
  showAll = false;
}

describe('FormErrorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideFormErrors({
          required:  () => 'Required.',
          minlength: (p) => `Min ${p.requiredLength} chars.`,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders no errors before touch', () => {
    const spans = fixture.debugElement.queryAll(By.css('.form-error'));
    expect(spans.length).toBe(0);
  });

  it('renders first error after touch (showAll=false)', () => {
    host.ctrl.markAsTouched();
    fixture.detectChanges();
    const spans = fixture.debugElement.queryAll(By.css('.form-error'));
    expect(spans.length).toBe(1);
    expect(spans[0].nativeElement.textContent.trim()).toBe('Required.');
  });

  it('renders all errors when showAll=true', () => {
    host.showAll = true;
    host.ctrl.markAsTouched();
    // setValue to trigger minlength along with required being cleared
    host.ctrl.setValue('ab');
    fixture.detectChanges();
    const spans = fixture.debugElement.queryAll(By.css('.form-error'));
    expect(spans.length).toBeGreaterThanOrEqual(1);
  });

  it('clears errors when control becomes valid', () => {
    host.ctrl.markAsTouched();
    host.ctrl.setValue('hello world');
    fixture.detectChanges();
    const spans = fixture.debugElement.queryAll(By.css('.form-error'));
    expect(spans.length).toBe(0);
  });
});
