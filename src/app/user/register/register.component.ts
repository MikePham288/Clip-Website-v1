import { RegisterValidators } from './../validators/register-validators';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13),
  ]);
  showAlert = false;
  alertMessage = 'Please wait! Your account is being created.';
  alertColor = 'blue';
  isSubmitting = false;

  registerForm = new FormGroup(
    {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phoneNumber: this.phoneNumber,
    },
    [RegisterValidators.match(this.password.value, this.confirmPassword.value)]
  );

  async register() {
    this.isSubmitting = true;
    this.showAlert = true;
    this.alertMessage = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    try {
      await this.auth.createUser(this.registerForm.value);
      this.alertMessage = 'Success! Your account has been created';
      this.alertColor = 'emerald';
    } catch (error) {
      console.log('error: ', error);
      this.alertMessage =
        'Error while trying to signup your account! Please try again later';
      this.alertColor = 'red';
      this.isSubmitting = false;
    }
  }
}
