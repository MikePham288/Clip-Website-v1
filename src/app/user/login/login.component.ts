import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };
  showAlert = false;
  alertMessage = 'Logging in';
  alertColor = 'blue';
  isSubmitting = false;

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}
  login = async () => {
    this.isSubmitting = true;
    this.showAlert = true;
    // this.alertMessage = 'Please wait! Your account is being created.';
    // this.alertColor = 'blue';
    console.log('login object: ', this.credentials);
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
      this.showAlert = true;
      this.alertMessage = 'Login Successfully!';
      this.alertColor = 'emerald';
    } catch (error) {
      console.error('ERROR: ', error);
      this.showAlert = true;
      this.alertMessage = 'Error while trying to login! Please try again later';
      this.alertColor = 'red';
      this.isSubmitting = false;
    }
  };
}
