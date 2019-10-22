import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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

	@Output() onSuccess: EventEmitter<Boolean> = new EventEmitter<Boolean>();
	@Output() onError: EventEmitter<Boolean> = new EventEmitter<Boolean>();

	constructor(private fb: FormBuilder, private userService:UserService, private _snackBar: MatSnackBar) {
		this.registerForm = this.fb.group({
			firstname: new FormControl('', [Validators.required]),
			lastname: new FormControl('', [Validators.required]),
			birthdate: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required]),
			terms: new FormControl('', [Validators.required])
		})
	}

	ngOnInit() {
		this.isInvalidTerms = null;
	}

	validateForm() {
		if (this.registerForm.valid) {
			let firstname = this.registerForm.get('firstname').value;
			let lastname = this.registerForm.get('lastname').value;
			let birthdate = this.registerForm.get('birthdate').value;
			let role = "ADMIN";
			let email = this.registerForm.get('email').value;
			let password = this.registerForm.get('password').value;
			this.postUserDataToApi(firstname, lastname, birthdate, role ,email, password);
		} else {
			if(this.registerForm.get('terms').hasError) {
				this.isInvalidTerms = true;
			}
			Object.keys(this.registerForm.controls).forEach(field => this.registerForm.get(field).markAsTouched({ onlySelf: true }));
		}
	}

	postUserDataToApi(firstname, lastname, birthdate, role, email, password) {
		this.userService.registerUser(firstname, lastname, birthdate, role, email, password)
		.subscribe(
			data => {
				this.message = data;
				this.onSuccess.emit();
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

	changeTermsStatus() {
		if (this.isInvalidTerms == null) {
			this.isInvalidTerms = false;
		} else {
			this.isInvalidTerms = !this.isInvalidTerms;
		}
	}

}
