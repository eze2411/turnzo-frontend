import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppStorageService} from "../../services/app-storage.service";
import {UserService} from "../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {CreateEventDialogComponent} from "../dialogs/create-event-dialog/create-event-dialog.component";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog/confirm-dialog.component";
import * as moment from "moment";
import {User} from "../../models/User.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    message: any;
    userData: any;
    updateForm: FormGroup;
    passwordForm: FormGroup;
    requestingUpdate = false;
    requestingPasswordReset = false;
    hidePassActual = true;
    hidePassNew1 = true;
    hidePassNew2 = true;


  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private storage: AppStorageService,
              private userService: UserService,
              private _snackBar: MatSnackBar) { }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
        this.updateForm = this.fb.group({
            firstname: new FormControl(this.userData.firstname, [Validators.required]),
            lastname: new FormControl(this.userData.lastname, [Validators.required]),
            birthdate: new FormControl(this.userData.birthdate, [Validators.required])
        });

        this.passwordForm = this.fb.group({
            passActual: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)]),
            passNew1: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)]),
            passNew2: new FormControl('', [Validators.required])
        });
    }

    validateUpdateForm() {
      if (this.updateForm.valid) {
          // valid form
          this.requestingUpdate = true;
          let firstname = this.updateForm.get('firstname').value;
          let lastname = this.updateForm.get('lastname').value;
          let birthdate = this.updateForm.get('birthdate').value;
          this.postPersonalInfoToApi(firstname, lastname, moment(birthdate).format('YYYY-MM-DDTHH:mm:ss'));
      } else {
          // invalid form
          Object.keys(this.updateForm.controls).forEach(field => this.updateForm.get(field).markAsTouched({ onlySelf: true }));
      }
    }

    validatePasswordForm() {
        this.requestingPasswordReset = true;
        if (this.passwordForm.valid) {
            this._snackBar.open("There was a problem with your request, try again later", "Cancel", {
                duration: 3000,
        });
            this.requestingPasswordReset = false;
        } else {
            Object.keys(this.passwordForm.controls).forEach(field => this.passwordForm.get(field).markAsTouched({ onlySelf: true }));
            this.requestingPasswordReset = false;
        }
    }


    postPersonalInfoToApi(firstname, lastname, birthdate) {
        this.userService.updateUserInfo(firstname, lastname, birthdate)
            .subscribe(
                data => {
                    this.message = data;
                    console.log(this.message);
                    this.onUpdateSuccess();
                },
                error => {
                    console.log("status --"  + JSON.parse(error).status);
                    console.log("message --" + JSON.parse(error).message);
                    this.requestingUpdate = false;
                    this._snackBar.open("There was a problem with your request, try again later", "Cancel", {
                        duration: 3000,
                    });
                    // mandar a pantalla de error?
                },
                () => {
                    //console.log('isValid: ' + this.message.status);
                    this.requestingUpdate = false;
                    this.getPersonalInfoFromApi();
                }
            );
    }

    getPersonalInfoFromApi() {
        this.userService.getLoggedUserInfo()
            .subscribe(
                data => {
                    this.message = data;
                    console.log(this.message);
                    this.setSessionUserData(this.message.user);
                },
                error => {
                    console.log("status --"  + JSON.parse(error).status);
                    console.log("message --" + JSON.parse(error).message);
                    this._snackBar.open("There was a problem with your request, try again later", "Cancel", {
                        duration: 3000,
                    });
                    // mandar a pantalla de error?
                },
                () => {
                    //console.log('isValid: ' + this.message.status);
                }
            );
    }

    onUpdateSuccess() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
        });

        //console.log('The dialog was opened');
        dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed');
        });
    }

    setPassNew2Validation() {
        this.passwordForm.controls['passNew2'].setValidators([Validators.required, Validators.pattern(`^${this.passwordForm.value.passNew1}$`)]);
    }

    setSessionUserData(user) {
        this.storage.storeUserOnLocalStorage(user as User);
    }
}
