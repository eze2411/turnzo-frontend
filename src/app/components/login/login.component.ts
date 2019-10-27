import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  message: any;
  hide = true;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private _snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
  }

  validateForm() {
    if (this.loginForm.valid) {
      let email = this.loginForm.get('email').value;
      let password = this.loginForm.get('password').value;
      this.postUserLoginToApi(email, password);
    } else {
      Object.keys(this.loginForm.controls).forEach(field => this.loginForm.get(field).markAsTouched({ onlySelf: true }));
    }
  }

  postUserLoginToApi(email, password) {
    this.loginService.loginUser(email, password)
      .subscribe(
        data => {
          this.message = data;
        },
        error => {
          console.log(JSON.parse(error).status);
          console.log(JSON.parse(error).message);

          this._snackBar.open("There was a problem with your request, try again later", "Cancel", {
            duration: 3000,
          });
          // mandar a pantalla de error
        },
        () => console.log('isValid: ' + this.message.status)
      );
  }

}
