import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';


@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']

})

export class RegisterComponent implements OnInit {

	hide = true;
	registerForm: FormGroup;

	constructor(private fb: FormBuilder) {
		this.registerForm = this.fb.group({
			firstname: new FormControl('', [Validators.required]),
			lastname: new FormControl('', [Validators.required]),
			birthdate: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
			terms: new FormControl('', [Validators.required])
		  })
	 }

	ngOnInit() {

	}

}
