import {Component, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {MatDialog} from '@angular/material/dialog';
import {CreateEventDialogComponent} from '../../dialogs/create-event-dialog/create-event-dialog.component';
import interactionPlugin from '@fullcalendar/interaction';
import timeGrigPlugin from '@fullcalendar/timegrid';
import {AppStorageService} from "../../../services/app-storage.service";
import {ConfirmEventDialogComponent} from "../../dialogs/confirm-event-dialog/confirm-event-dialog.component";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    userData: any;

    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    calendarEvents: any;
    calendarDefaultView: string;

    calendarHeader: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    };


    constructor(public dialog: MatDialog, private storage: AppStorageService) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
        this.calendarDefaultView = this.userData.role == 'ADMIN' ? 'dayGridMonth' : 'timeGridWeek';
        this.calendarEvents = [
            {
                title: 'The Title',
                start: '2019-11-04T16:00:00',
                end: '2019-11-04T17:00:00',
                allDay: false
            }
        ];
    }

    onEventClick(event) {
        //console.log(event.event);
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
            width: '500px',
            data: {
                date: event.event
            }
        });

        console.log('The dialog was opened');

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    onDateClick(event) {
        //console.log(event);
        const dialogRef = this.dialog.open(ConfirmEventDialogComponent, {
            width: '500px',
            data: {
                date: event
            }
        });

        console.log('The dialog was opened');

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

}
