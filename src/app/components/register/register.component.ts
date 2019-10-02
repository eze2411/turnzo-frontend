import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
  
})

export class RegisterComponent implements OnInit {
  hide = true;
  firstname = new FormControl('', [Validators.required]);
  lastname = new FormControl('', [Validators.required]);
  birthday = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  terms = new FormControl('', [Validators.required]);
  chkTerms = new FormControl('', [Validators.required]);
  constructor() { }

  ngOnInit() {
  }

}
