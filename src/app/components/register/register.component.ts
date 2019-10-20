import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']

})

export class RegisterComponent implements OnInit {

	@ViewChild('terms', { static: false }) terms;

	hide = true;
	registerForm: FormGroup;
	isInvalidTerms: Boolean;



	constructor(private fb: FormBuilder) {
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
		this.isInvalidTerms = false;
	}

	validateForm() {
		if (this.registerForm.valid) {
			return console.log('isValid');
		} else {
			if (this.registerForm.get('terms').hasError) {
				this.isInvalidTerms = true;
			}
			Object.keys(this.registerForm.controls).forEach(field => this.registerForm.get(field).markAsTouched({ onlySelf: true }));
			return console.log('invalid');
		}
	}

	changeStatus() {
		this.isInvalidTerms = !this.isInvalidTerms;
	}

}
