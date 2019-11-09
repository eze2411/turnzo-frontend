import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SidebarComponent, DialogData } from '../../sidebar/sidebar.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from "moment";

@Component({
	selector: 'app-create-event-dialog',
	templateUrl: './create-event-dialog.component.html',
	styleUrls: ['./create-event-dialog.component.scss']
})
export class CreateEventDialogComponent implements OnInit {
    isNewEvent: boolean;
    isTurnzo: boolean;
	eventForm: FormGroup;
	fullCalendarEvent: any;
	apiEvent: any;
	hoursList: number[];
	minutesList: number[];
    eventType: string;
    eventHour: number;
    eventMinute: number;


	constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateEventDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

	ngOnInit() {
	    this.hoursList = [];
        this.minutesList = [0, 30];
        for (let i = 0; i < 24 ; i++)
            this.hoursList.push(i);

	    this.isNewEvent = this.data == null;


	    // busca turno en el listado para pintar los datos en el modal
	    if (!this.isNewEvent) {
            this.fullCalendarEvent = this.data;
            this.fullCalendarEvent.events.forEach(value => {
                if(moment(value.start).format('YYYY-MM-DDTHH:mm:ss') == moment(this.fullCalendarEvent.event.start).format('YYYY-MM-DDTHH:mm:ss')) {
                    this.apiEvent = value;
                    this.eventHour = moment(this.apiEvent.start).hour();
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

}
