import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match = (
    controlName: string,
    matchingControlName: string
  ): ValidatorFn => {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get('password');
      const matchingControl = group.get('confirmPassword');
      if (!control || !matchingControl) {
        console.error('form control not found in formgroup');
        return { controlNotFound: false };
      }

      const error =
        control.value == matchingControl.value
          ? null
          : {
              noMatch: true,
            };
      matchingControl.setErrors(error);
      return error;
    };
  };
}

// new registervalidators.match() <~ without static
// registervalidators.match() <- with static
