import {Component, OnInit} from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import {LoginService} from 'src/app/services/login.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    message: any;
    hide = true;
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private loginService: LoginService, private _snackBar: MatSnackBar, private router: Router) {
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
            Object.keys(this.loginForm.controls).forEach(field => this.loginForm.get(field).markAsTouched({onlySelf: true}));
        }
    }

    goRegister() {
        this.router.navigate(['/register']);
    }

    displayError(err) {
        if (err.message) {
            return this._snackBar.open(err.message, 'OK', {duration: 2000});
        }

        this._snackBar.open('There was a problem with your request.', 'OK', {duration: 2000})
    }

    postUserLoginToApi(email: string, password: string) {
        this.loginService.loginUser(email, password)
            .then((res) => {
                this.router.navigate([''])
            })
            .catch((err) => {
                this.displayError(err);
            })
    }
}
