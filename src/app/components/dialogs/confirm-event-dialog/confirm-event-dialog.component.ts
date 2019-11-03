import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CalendarComponent, DialogData } from "../../home/calendar/calendar.component";
import * as moment from 'moment';
import { EventService } from "../../../services/event.service";

@Component({
    selector: 'app-confirm-event-dialog',
    templateUrl: './confirm-event-dialog.component.html',
    styleUrls: ['./confirm-event-dialog.component.scss']
})
export class ConfirmEventDialogComponent implements OnInit {
    message: any;

    constructor(public dialogRef: MatDialogRef<ConfirmEventDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private eventService: EventService) {
    }

    ngOnInit() {
    }

    closeCreateEventDialog(): void {
        this.dialogRef.close();
    }

    formatDate(data) {
        return moment(data.date.dateStr).format('DD/MM/YYYY HH:mm');
    }

    sendUserEvent(description, start, end, destiny) {
        this.eventService.postUserEvent(description, start, end, destiny)
            .subscribe(
                data => {
                    this.message = data;
                },
                error => {
                    console.log(JSON.parse(error).status);
                    console.log(JSON.parse(error).message);
                    // mandar a pantalla de error
                },
                () => console.log('isValid: ' + this.message.status)
            );
    }

}
