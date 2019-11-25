import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from "moment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventService} from "../../../services/event.service";
import {AppStorageService} from "../../../services/app-storage.service";
import {ConfirmEventDialogComponent} from "../confirm-event-dialog/confirm-event-dialog.component";
import {UserService} from "../../../services/user.service";
import {Observable} from "rxjs";
import { startWith, map } from "rxjs/operators";

export interface CreateEventData {
    events?: any;
    event?: any;
    isNewEvent?: boolean;
}

@Component({
	selector: 'app-create-event-dialog',
	templateUrl: './create-event-dialog.component.html',
	styleUrls: ['./create-event-dialog.component.scss']
})
export class CreateEventDialogComponent implements OnInit {
    isNewEvent: boolean;
	eventForm: FormGroup;
	fullCalendarEvent: any;
	apiEvent: any;
	hoursList: number[];
	minutesList: number[];
    eventType: string;
    eventHour: number;
    eventId: string;
    eventDescription: string;
    eventMinute: number;
    message: any;
    userData: any;
    usersData: any;
    startDate: any;
    filteredUsers: Observable<any>;
    requestingCreateEvent = false;


	constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                public dialogRef: MatDialogRef<CreateEventDialogComponent>,
                private _snackBar: MatSnackBar,
                private eventService: EventService,
                private userService: UserService,
                private storage: AppStorageService,
		@Inject(MAT_DIALOG_DATA) public data: CreateEventData) { }

	ngOnInit() {
        this.userData = this.storage.getStoredUser();
	    this.hoursList = [];
        this.minutesList = [0, 30];
        for (let i = 9; i < 20 ; i++)
            this.hoursList.push(i);

	    this.isNewEvent = this.data.isNewEvent;

	    // busca turno en el listado para pintar los datos en el modal
	    if (!this.isNewEvent) {
            this.fullCalendarEvent = this.data;
            //aca
            this.matchFullCalendarApiEvent();
        }

        this.eventForm = this.fb.group({
            type: new FormControl('', [Validators.required]),
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            startTime: new FormControl('', [Validators.required]),
            endTime: new FormControl('', [Validators.required]),
            patient: new FormControl(''),
            description: new FormControl('')
        });
	}

	matchFullCalendarApiEvent() {
        this.fullCalendarEvent.events.forEach(value => {
            if(moment(value.start).format('YYYY-MM-DDTHH:mm:ss') == moment(this.fullCalendarEvent.event.start).format('YYYY-MM-DDTHH:mm:ss')) {
                this.apiEvent = value;
                this.eventHour = moment(this.apiEvent.start).hour();
                this.eventId = this.apiEvent.event_id;
                this.eventMinute = moment(this.apiEvent.start).minute();
                this.eventDescription = this.apiEvent.event_description;
                this.eventType = this.apiEvent.event_type;
            }
        });
    }

	closeCreateEventDialog(): void {
		this.dialogRef.close();
	}

    setEventType(type: string) {
	    if (type === 'TURNZO') {
            this.eventForm.get('patient').setValidators([Validators.required]);
            this.getAllUsersInfo();
        } else if (type === 'LOCK') {
	        this.eventForm.get('patient').clearValidators();
        }
        this.eventType = type;
    }

    validateForm() {
        if(this.eventForm.valid) {
            let type = this.eventForm.value.type;
            let startDate = this.eventForm.value.startDate;
            let endDate = this.eventForm.value.endDate;
            let startTime = this.eventForm.value.startTime;
            let endTime = this.eventForm.value.endTime;
            let patient = this.eventForm.value.patient;
            let description = this.eventForm.value.description ? this.eventForm.value.description : "Automatic description";
            let shiftStart = new Date (moment(startDate).year(), moment(startDate).month(), moment(startDate).date(), startTime);
            let shiftEnd = new Date (moment(endDate).year(), moment(endDate).month(), moment(endDate).date(), endTime);
            let start = moment(shiftStart).format('YYYY-MM-DDTHH:mm:ss');
            let end = moment(shiftEnd).format('YYYY-MM-DDTHH:mm:ss');

            if (moment(shiftEnd).isBefore(shiftStart)) {
                this._snackBar.open("Event end cannot be before event start", "Cancel", {
                    duration: 3000,
                });
                return false;
            }

            if (type === 'TURNZO') {
                this.createUserEvent(description, start, end, patient);
            } else if (type === 'LOCK') {
                this.createAdminLock(description, start, end, this.userData.email);
            }
        } else  {
            Object.keys(this.eventForm.controls).forEach(field => this.eventForm.get(field).markAsTouched({onlySelf: true}));
        }
    }

    createAdminLock(description, start, end, destiny) {
	    this.requestingCreateEvent = true;
        this.eventService.postAdminLock(description, start, end, destiny)
            .subscribe(
                data => {
                    this.message = data;
                    this._snackBar.open("The event was successfully created", "OK", {
                        duration: 3000,
                    });
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    this.requestingCreateEvent = false;
                    this._snackBar.open("There was a problem while creating the event, try again later", "Cancel", {
                        duration: 3000,
                    });
                },
                () => {
                    this.requestingCreateEvent = false;
                    this.dialogRef.close();
                }
            );
    }

    createUserEvent(description, start, end, origin) {
        this.requestingCreateEvent = true;
        this.eventService.postManualUserEvent(description, start, end, origin)
            .subscribe(
                data => {
                    this.message = data;
                    this._snackBar.open("The event was successfully created", "OK", {
                        duration: 3000,
                    });
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    this.requestingCreateEvent = false;
                    this._snackBar.open("There was a problem while creating the event, try again later", "Cancel", {
                        duration: 3000,
                    });
                },
                () => {
                    this.requestingCreateEvent = false;
                    this.dialogRef.close();
                }
            );
    }

    onDeleteClick() {
        this.dialogRef.close();
        const dialogRef = this.dialog.open(ConfirmEventDialogComponent, {
            width: '500px',
            data: {
                action: 'delete',
                event: this.apiEvent
            }
        });
        //console.log('The dialog was opened');
        dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed');
        });
    }

    getAllUsersInfo() {
        this.userService.getAllUsersInfo()
            .subscribe(
                data => {
                    this.usersData = data.results;
                    console.log(this.eventForm);
                    this.filteredUsers = this.eventForm.get('patient').valueChanges
                        .pipe(
                            startWith(''),
                            map(value => this._filter(value))
                        );
                    console.log(this.usersData);
                },
                error => {
                    console.log("status --"  + JSON.parse(error).status);
                    console.log("message --" + JSON.parse(error).message);
                    this._snackBar.open("There was a problem while fetching users, try again later", "Cancel", {
                        duration: 3000,
                    });
                },
                () => {
                    //console.log('isValid: ' + this.message.status);
                }
            );
    }

    private _filter(value: string): any[] {
        if (value && value.length > 0) {
            const filterValue = value.toLowerCase();
            console.log(this.usersData.filter(user => user.firstname.toLowerCase().includes(filterValue) || user.lastname.toLowerCase().includes(filterValue)));
            return this.usersData.filter(user => user.firstname.toLowerCase().includes(filterValue) || user.lastname.toLowerCase().includes(filterValue));
        }
        return this.usersData;
    }

    onStartDateChange(event) {
        this.startDate = event.value;
        this.eventForm.get('endDate').patchValue(this.startDate);
    }
}
