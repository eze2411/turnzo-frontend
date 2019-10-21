import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { UserService } from 'src/app/services/user.service';


@Component({
	selector: 'app-register-form',
	templateUrl: './register-form.component.html',
	styleUrls: ['./register-form.component.scss']

})

export class RegisterFormComponent implements OnInit {
	message: string;
	@ViewChild('terms', { static: false }) terms;
	hide = true;
	registerForm: FormGroup;
	isInvalidTerms: Boolean;

	constructor(private fb: FormBuilder, private userService:UserService) {
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
			this.userService.registerUser(firstname, lastname, birthdate, role, email, password).subscribe(data=>this.message = data);
			return console.log('isValid: ' + this.message);
		} else {
			if(this.registerForm.get('terms').hasError) {
				this.isInvalidTerms = true;
			}
			Object.keys(this.registerForm.controls).forEach(field => this.registerForm.get(field).markAsTouched({ onlySelf: true }));
			return console.log('invalid');
		}
	}

	changeTermsStatus() {
		if (this.isInvalidTerms == null) {
			this.isInvalidTerms = false;
		} else {
			this.isInvalidTerms = !this.isInvalidTerms;
		}
	}

}
