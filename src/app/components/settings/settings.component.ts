import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppStorageService} from "../../services/app-storage.service";
import * as moment from "moment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "../../services/user.service";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    userData: any;
    requestingUpdate = false;
    requestingRule = false;
    updateForm: FormGroup;
    rulesForm: FormGroup;
    startHourList: number[];
    startMinuteList: [0, 30];
    dayWeekList: string[];
    message: any;

    constructor(private fb: FormBuilder,
                private storage: AppStorageService,
                private _snackBar: MatSnackBar,
                private adminService: AdminService,) {
    }

  ngOnInit() {
      this.userData = this.storage.getStoredUser();
      this.startHourList = [];
      this.dayWeekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      this.getSettingsFromApi();

      this.updateForm = this.fb.group({
          startTime: new FormControl('', [Validators.required]),
          endTime: new FormControl('', [Validators.required]),
          weekends: new FormControl('', [Validators.required])
      });

      this.rulesForm = this.fb.group({
          dayWeek: new FormControl('', [Validators.required]),
          startTime: new FormControl('', [Validators.required]),
          endTime: new FormControl('', [Validators.required])
      });

      for (let i = 0; i < 24; i++)
          this.startHourList.push(i);

  }

    addNewRule() {
        if (this.rulesForm.valid) {
            this.requestingRule = true;
            let ruleDay = this.rulesForm.value.dayWeek;
            let ruleStart = this.rulesForm.value.startTime;
            let ruleEnd = this.rulesForm.value.endTime;
            if (parseInt(ruleEnd) <= parseInt(ruleStart)) {
                this._snackBar.open("Rule end must be after rule start", "Cancel", {
                    duration: 3000,
                });
                this.requestingRule = false;
                return false;
            }
            console.log(moment(moment().set('hour', ruleStart)).format('HH:mm:ss'));
            //this.postSettingToApi();
        } else {
            // invalid form
            Object.keys(this.rulesForm.controls).forEach(field => this.rulesForm.get(field).markAsTouched({onlySelf: true}));
        }
    }

    postSettingToApi(name, value) {
        this.adminService.postAdminSetting(name, value)
            .subscribe(
                data => {
                    this.message = data;
                    console.log(this.message);
                },
                error => {
                    console.log("status --" + JSON.parse(error).status);
                    console.log("message --" + JSON.parse(error).message);
                    this.requestingRule = false;
                    this._snackBar.open("There was a problem with your request, try again later", "Cancel", {
                        duration: 3000,
                    });
                    // mandar a pantalla de error?
                },
                () => {
                    //console.log('isValid: ' + this.message.status);
                    this.requestingRule = false;
                }
            );
    }

    getSettingsFromApi() {
        this.adminService.getAdminSettings()
            .subscribe(
                data => {
                    console.log(data.results);
                },
                error => {
                    console.log("status --" + JSON.parse(error).status);
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
}
