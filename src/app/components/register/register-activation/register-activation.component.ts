import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../../services/user.service";

@Component({
    selector: 'app-register-activation',
    templateUrl: './register-activation.component.html',
    styleUrls: ['./register-activation.component.scss']
})
export class RegisterActivationComponent implements OnInit {
    activationForm: FormGroup;
    requestingActivation = false;
    @Input() admin: any;
    message: any;
    @Output()goTo = new EventEmitter();

    constructor(private fb: FormBuilder,
                private _snackBar: MatSnackBar,
                private userService: UserService) { }

    ngOnInit() {
        // este es el admin, registrarlo
        this.activationForm = this.fb.group({
            cardNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
            cardExpiration: new FormControl('', [Validators.required]),
            cardSecurityNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
        });
    }

    validateForm() {
        this.requestingActivation = true;
        if(this.activationForm.valid) {
            if(this.activationForm.value.cardNumber % 2 === 0) {
                console.log("true");
                this.postUserDataToApi(this.admin.firstname, this.admin.lastname, this.admin.birthdate, 'ADMIN', this.admin.email, this.admin.password);
            }
            else {
                this._snackBar.open("There was a problem with your activation, try again later", "Cancel", {
                    duration: 3000,
                });
                this.requestingActivation = false;
            }
        } else {
            Object.keys(this.activationForm.controls).forEach(field => this.activationForm.get(field).markAsTouched({ onlySelf: true }));
            this.requestingActivation = false;
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
                    console.log("status --"  + JSON.parse(error).status);
                    console.log("message --" + JSON.parse(error).message);
                    this.requestingActivation = false;
                    this._snackBar.open("There was a problem with your request, try again later", "Cancel", {
                        duration: 3000,
                    });
                    // mandar a pantalla de error?
                },
                () => {
                    //console.log('isValid: ' + this.message.status);
                    this.requestingActivation = false;
                }
            );
    }

}
