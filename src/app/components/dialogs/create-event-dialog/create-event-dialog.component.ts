import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from "moment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventService} from "../../../services/event.service";
import {AppStorageService} from "../../../services/app-storage.service";
import {ConfirmEventDialogComponent} from "../confirm-event-dialog/confirm-event-dialog.component";

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


	constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                public dialogRef: MatDialogRef<CreateEventDialogComponent>,
                private _snackBar: MatSnackBar,
                private eventService: EventService,
                private storage: AppStorageService,
		@Inject(MAT_DIALOG_DATA) public data: CreateEventData) { }

	ngOnInit() {
        this.userData = this.storage.getStoredUser();
	    this.hoursList = [];
        this.minutesList = [0, 30];
        for (let i = 0; i < 24 ; i++)
            this.hoursList.push(i);


	    this.isNewEvent = this.data.isNewEvent;
	    //console.log(this.data);


	    // busca turno en el listado para pintar los datos en el modal
	    if (!this.isNewEvent) {
            this.fullCalendarEvent = this.data;
            this.fullCalendarEvent.events.forEach(value => {
                if(moment(value.start).format('YYYY-MM-DDTHH:mm:ss') == moment(this.fullCalendarEvent.event.start).format('YYYY-MM-DDTHH:mm:ss')) {
                    this.apiEvent = value;
                    this.eventHour = moment(this.apiEvent.start).hour();
                    this.eventId = this.apiEvent.event_id;
                    console.log(this.eventId);
                    this.eventMinute = moment(this.apiEvent.start).minute();
                    this.eventDescription = this.apiEvent.event_description;
                    this.eventType = this.apiEvent.event_type;
                }
            });
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

	closeCreateEventDialog(): void {
		this.dialogRef.close();
	}

    setEventType(type: string) {
        this.eventType = type;
    }

    validateForm() {
        if(this.eventForm.valid) {
            //console.log("entro aca");
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
                this.createAdminLock(start, end, this.userData.email);
            }
        }
    }

    createAdminLock(start, end, destiny) {
        this.eventService.postAdminLock(start, end, destiny)
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
        //console.log(event);
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
}
