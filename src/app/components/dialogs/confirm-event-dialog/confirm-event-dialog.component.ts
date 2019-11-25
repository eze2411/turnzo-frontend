import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as moment from 'moment';
import { EventService } from "../../../services/event.service";
import {AppStorageService} from "../../../services/app-storage.service";

export interface ConfirmEventData {
    action: string,
    event: any;
}

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
    action: string;
    requestingDeleteEvent = false;

    constructor(public dialogRef: MatDialogRef<ConfirmEventDialogComponent>, private storage: AppStorageService,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmEventData, private eventService: EventService) {
    }

    ngOnInit() {
        this.action = this.data.action;

        if (this.action == 'confirm') {
            this.eventStart = moment(this.data.event.dateStr).format('YYYY-MM-DDTHH:mm:ss');
            this.eventEnd = moment(this.data.event.dateStr).add(1, 'h').format('YYYY-MM-DDTHH:mm:ss');
        }
        this.userData = this.storage.getStoredUser();
    }

    doConfirmEventDialog(): void {
        if(this.action == 'confirm') {
            if(this.userData.role == 'ADMIN')
                this.createAdminLock(this.eventStart, this.eventEnd, this.userData.email);
            else
                this.createUserEvent('Temporal description', this.eventStart, this.eventEnd, this.data.event.admin);
            this.dialogRef.close();
            //window.location.reload();
        } else {
            this.deleteEvent();
        }
    }

    deleteEvent(): void {
        this.requestingDeleteEvent = true;
        this.eventService.cancelEvent(this.data.event.event_id)
            .subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    console.log(JSON.parse(error).status);
                    console.log(JSON.parse(error).message);
                    // mandar a pantalla de error
                },
                () => {
                    this.dialogRef.close();
                }
            );
    }

    closeConfirmEventDialog(): void {
        this.dialogRef.close();
    }

    formatDate(data) {
        if(this.data.action == 'confirm')
            return moment(data.event.dateStr).format('DD/MM/YYYY HH:mm');
        else
            return moment(data.event.start).format('DD/MM/YYYY HH:mm');
    }

    createUserEvent(description, start, end, destiny) {
        this.eventService.postUserEvent(description, start, end, destiny)
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
                    //console.log(this.message);
                }
            );
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
                    //console.log("aca: " + this.message);
                }
            );
    }
}
