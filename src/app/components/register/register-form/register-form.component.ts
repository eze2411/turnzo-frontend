import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {last} from "rxjs/operators";

@Component({
	selector: 'app-register-form',
	templateUrl: './register-form.component.html',
	styleUrls: ['./register-form.component.scss']

})

export class RegisterFormComponent implements OnInit {
	message: any;
	@ViewChild('terms', { static: false }) terms;
	hide = true;
	registerForm: FormGroup;
	isInvalidTerms: Boolean;
    requestingRegistration = false;

    @Output()goTo = new EventEmitter();
    @Output()adminToActivate  = new EventEmitter();

	constructor(private fb: FormBuilder,
                private userService: UserService,
                private _snackBar: MatSnackBar,
                public router: Router) { }

	ngOnInit() {
        this.registerForm = this.fb.group({
            firstname: new FormControl('', [Validators.required]),
            lastname: new FormControl('', [Validators.required]),
            birthdate: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
            terms: new FormControl('', [Validators.required])
        });
		this.isInvalidTerms = null;
	}

	validateForm() {
		if (this.registerForm.valid) {
            this.requestingRegistration = true;
			let firstname = this.registerForm.get('firstname').value;
			let lastname = this.registerForm.get('lastname').value;
			let birthdate = this.registerForm.get('birthdate').value;
			let role = history.state.role == 'ADMIN' ? 'ADMIN' : 'USER';
			let email = this.registerForm.get('email').value;
			let password = this.registerForm.get('password').value;
			console.log(role);
			if (role === 'ADMIN') {
                this.goTo.emit('activate');
                let admin = {
                    'firstname': firstname,
                    'lastname': lastname,
                    'email': email,
                    'birthdate': birthdate,
                    'password': password
                };
                this.adminToActivate.emit(admin);
            } else {
                this.postUserDataToApi(firstname, lastname, birthdate, role ,email, password);
            }
		} else {
			if(this.registerForm.get('terms').hasError) {
				this.isInvalidTerms = true;
			}
			Object.keys(this.registerForm.controls).forEach(field => this.registerForm.get(field).markAsTouched({ onlySelf: true }));
		}
	}

	postUserDataToApi(firstname, lastname, birthdate, role, email, password) {
		this.userService.postCreateUser(firstname, lastname, birthdate, role, email, password)
		.subscribe(
			data => {
				this.message = data;
                this.goTo.emit('success');
			},
			error => {
				//console.log("status --"  + JSON.parse(error).status);
				//console.log("message --" + JSON.parse(error).message);
                this.requestingRegistration = false;
				this._snackBar.open("There was a problem with your request, try again later", "Cancel", {
					duration: 3000,
				  });
				// mandar a pantalla de error?
			},
			() => {
                //console.log('isValid: ' + this.message.status);
                this.requestingRegistration = false;
            }
			);
	}

	changeTermsStatus() {
		if (this.isInvalidTerms == null) {
			this.isInvalidTerms = false;
		} else {
			this.isInvalidTerms = !this.isInvalidTerms;
		}
	}

}
