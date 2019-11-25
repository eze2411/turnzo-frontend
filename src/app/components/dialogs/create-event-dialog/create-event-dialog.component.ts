import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from "moment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventService} from "../../../services/event.service";
import {AppStorageService} from "../../../services/app-storage.service";
import {ConfirmEventDialogComponent} from "../confirm-event-dialog/confirm-event-dialog.component";
import {UserService} from "../../../services/user.service";

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

        this.getAllUsersInfo();

	    this.isNewEvent = this.data.isNewEvent;

	    // busca turno en el listado para pintar los datos en el modal
	    if (!this.isNewEvent) {
            this.fullCalendarEvent = this.data;
            //aca
            this.matchFullCalendarApiEvent();
        }

	    if(this.eventType === 'TURNZO') {
            this.eventForm = this.fb.group({
                type: new FormControl('', [Validators.required]),
                startDate: new FormControl('', [Validators.required]),
                endDate: new FormControl('', [Validators.required]),
                startTime: new FormControl('', [Validators.required]),
                endTime: new FormControl('', [Validators.required]),
                patient: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required])
            });
        } else {
            this.eventForm = this.fb.group({
                type: new FormControl('', [Validators.required]),
                startDate: new FormControl('', [Validators.required]),
                endDate: new FormControl('', [Validators.required]),
                startTime: new FormControl('', [Validators.required]),
                endTime: new FormControl('', [Validators.required]),
                description: new FormControl('')
            });
        }
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
        this.eventType = type;
    }

    validateForm() {
        if(this.eventForm.valid) {
            let type = this.eventForm.get('type').value;
            let startDate = this.eventForm.get('startDate').value;
            let endDate = this.eventForm.get('endDate').value;
            let startTime = this.eventForm.get('startTime').value;
            let endTime = this.eventForm.get('endTime').value;
            let description = this.eventForm.get('description').value;
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
                //aca registro el evento
            } else {
                this.createAdminLock(description, start, end, this.userData.email);
            }
        }
    }

    createAdminLock(description, start, end, destiny) {
        this.eventService.postAdminLock(description, start, end, destiny)
            .subscribe(
                data => {
                    this.message = data;
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    // mandar a pantalla de error
                },
                () => {
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
                    console.log(this.usersData);
                },
                error => {
                    console.log("status --"  + JSON.parse(error).status);
                    console.log("message --" + JSON.parse(error).message);
                    this._snackBar.open("There was a problem while fetching users, try again later", "Cancel", {
                        duration: 3000,
                    });
                    // mandar a pantalla de error?
                },
                () => {
                    //console.log('isValid: ' + this.message.status);
                }
            );
    }

    onStartDateChange(event) {
        this.startDate = event.value;
    }
}
