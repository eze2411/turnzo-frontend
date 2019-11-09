import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from "moment";

export interface CreateEventData {
    events: any;
    event: any;
    date: any;
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
    eventMinute: number;


	constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateEventDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: CreateEventData) { }

	ngOnInit() {
	    this.hoursList = [];
        this.minutesList = [0, 30];
        for (let i = 0; i < 24 ; i++)
            this.hoursList.push(i);


	    this.isNewEvent = this.data.isNewEvent;
	    console.log(this.data);


	    // busca turno en el listado para pintar los datos en el modal
	    if (!this.isNewEvent) {
            this.fullCalendarEvent = this.data;
            this.fullCalendarEvent.events.forEach(value => {
                if(moment(value.start).format('YYYY-MM-DDTHH:mm:ss') == moment(this.fullCalendarEvent.event.start).format('YYYY-MM-DDTHH:mm:ss')) {
                    this.apiEvent = value;
                    this.eventHour = moment(this.apiEvent.start).hour();
                    console.log(this.eventHour);
                    this.eventMinute = moment(this.apiEvent.start).minute();
                    this.eventType = this.apiEvent.event_type;
                }
            });
        }

	    // FORM BUILDER builds form
	    if(this.isNewEvent) {
            this.eventForm = this.fb.group({
                type: new FormControl('', [Validators.required]),
                start: new FormControl('', [Validators.required]),
                end: new FormControl('', [Validators.required]),
                patient: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required])
            });
        } else {
            this.eventForm = this.fb.group({
                title: new FormControl('', [Validators.required]),
                type: new FormControl('', [Validators.required]),
                start: new FormControl('', [Validators.required]),
                end: new FormControl('', [Validators.required]),
                patient: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required])
            });
        }
	}

	closeCreateEventDialog(): void {
		this.dialogRef.close();
	}

    setEventType(type: string) {
        this.eventType = type;
    }
}
