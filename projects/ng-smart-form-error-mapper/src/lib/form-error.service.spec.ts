import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { FormErrorService } from './form-error.service';
import { provideFormErrors } from './provide-form-errors';

describe('FormErrorService', () => {
  let service: FormErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFormErrors({
          required:  () => 'Required.',
          minlength: (p) => `Min ${p.requiredLength} chars.`,
          email:     () => 'Invalid email.',
        }),
      ],
    });
    service = TestBed.inject(FormErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getError()', () => {
    it('returns null for a valid control', () => {
      const ctrl = new FormControl('hello', Validators.required);
      ctrl.markAsTouched();
      expect(service.getError(ctrl)).toBeNull();
    });

    it('returns null when control is untouched (default behaviour)', () => {
      const ctrl = new FormControl('', Validators.required);
      expect(service.getError(ctrl)).toBeNull();
    });

    it('returns message when control is touched and invalid', () => {
      const ctrl = new FormControl('', Validators.required);
      ctrl.markAsTouched();
      expect(service.getError(ctrl)).toBe('Required.');
    });

    it('returns message regardless of touch when onlyWhenTouched=false', () => {
      const ctrl = new FormControl('', Validators.required);
      expect(service.getError(ctrl, false)).toBe('Required.');
    });

    it('resolves dynamic params for minlength', () => {
      const ctrl = new FormControl('ab', Validators.minLength(5));
      ctrl.markAsTouched();
      expect(service.getError(ctrl)).toBe('Min 5 chars.');
    });

    it('falls back gracefully for unmapped validator keys', () => {
      const ctrl = new FormControl(null, () => ({ customKey: true }));
      ctrl.markAsTouched();
      expect(service.getError(ctrl)).toContain('customKey');
    });
  });

  describe('getAllErrors()', () => {
    it('returns empty array for valid control', () => {
      const ctrl = new FormControl('test@test.com', [Validators.required, Validators.email]);
      ctrl.markAsTouched();
      expect(service.getAllErrors(ctrl)).toEqual([]);
    });

    it('returns all active error messages', () => {
      const ctrl = new FormControl('', [Validators.required, Validators.email]);
      ctrl.markAsTouched();
      const errors = service.getAllErrors(ctrl);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Required.');
    });
  });
});
