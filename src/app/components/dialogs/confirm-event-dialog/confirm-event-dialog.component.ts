import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CalendarComponent, DialogData } from "../../home/calendar/calendar.component";
import * as moment from 'moment';
import { EventService } from "../../../services/event.service";
import {AppStorageService} from "../../../services/app-storage.service";

@Component({
    selector: 'app-confirm-event-dialog',
    templateUrl: './confirm-event-dialog.component.html',
    styleUrls: ['./confirm-event-dialog.component.scss']
})
export class ConfirmEventDialogComponent implements OnInit {
    userData: any;
    message: any;
    eventStart: string;
    eventEnd: string;

    constructor(public dialogRef: MatDialogRef<ConfirmEventDialogComponent>, private storage: AppStorageService,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private eventService: EventService) {
    }

    ngOnInit() {
        this.eventStart = moment(this.data.date.dateStr).format('YYYY-MM-DDTHH:mm:ss');
        this.eventEnd = moment(this.data.date.dateStr).add(1, 'h').format('YYYY-MM-DDTHH:mm:ss');
        this.userData = this.storage.getStoredUser();
    }

    doConfirmEventDialog(): void {
        if(this.userData.role == 'ADMIN')
            this.createAdminLock(this.eventStart, this.eventEnd, this.userData.email);
        else
            this.createUserEvent('asdasd', this.eventStart, this.eventEnd, 'emartinez@tupaca.com');
        this.dialogRef.close();
        window.location.reload();
    }

    closeConfirmEventDialog(): void {
        this.dialogRef.close();
    }

    formatDate(data) {
        return moment(data.date.dateStr).format('DD/MM/YYYY HH:mm');
    }

    createUserEvent(description, start, end, destiny) {
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
                () => console.log(this.message)
            );
    }

    private createAdminLock(start, end, destiny) {
        this.eventService.postAdminLock(start, end, destiny)
            .subscribe(
                data => {
                    this.message = data;
                },
                error => {
                    console.log(JSON.parse(error).status);
                    console.log(JSON.parse(error).message);
                    // mandar a pantalla de error
                },
                () => console.log("aca: " + this.message)
            );
    }
}
