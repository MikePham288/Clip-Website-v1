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
  // showAlert = false;
  // alertMessage = 'Please wait! Your account is being created.';
  // alertColor = 'blue';

  constructor() {}

  ngOnInit(): void {}
  login = () => {
    // this.showAlert = true;
    // this.alertMessage = 'Please wait! Your account is being created.';
    // this.alertColor = 'blue';
    console.log('login object: ', this.credentials);
  };
}
