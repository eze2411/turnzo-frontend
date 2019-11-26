import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as moment from 'moment';
import { EventService } from "../../../services/event.service";
import {AppStorageService} from "../../../services/app-storage.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    requestingCreateEvent = false;

    constructor(public dialogRef: MatDialogRef<ConfirmEventDialogComponent>,
                private _snackBar: MatSnackBar,
                private storage: AppStorageService,
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
        this.eventService.postDeleteEvent(this.data.event.event_id)
            .subscribe(
                data => {
                    //console.log(data);
                    this._snackBar.open("The event was successfully deleted", "OK", {
                        duration: 3000,
                    });
                },
                error => {
                    console.log(JSON.parse(error).status);
                    console.log(JSON.parse(error).message);
                    // mandar a pantalla de error
                    this._snackBar.open("There was a problem while creating the event, try again later", "Cancel", {
                        duration: 3000,
                    });
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
        this.requestingCreateEvent = true;
        this.eventService.postUserEvent(description, start, end, destiny)
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
                    //this.requestingCreateEvent = false;
                    this._snackBar.open("There was a problem while creating the event, try again later", "Cancel", {
                        duration: 3000,
                    });
                },
                () => {
                    //this.requestingCreateEvent = false;
                }
            );
    }

    createAdminLock(start, end, destiny) {
        this.requestingCreateEvent = true;
        this.eventService.postAdminLock("Automatic description", start, end, destiny)
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
                    //this.requestingCreateEvent = false;
                    this._snackBar.open("There was a problem while creating the event, try again later", "Cancel", {
                        duration: 3000,
                    });
                },
                () => {
                    //this.requestingCreateEvent = false;
                }
            );
    }
}
