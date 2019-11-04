import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog} from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../../dialogs/create-event-dialog/create-event-dialog.component';
import interactionPlugin from '@fullcalendar/interaction';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { AppStorageService } from "../../../services/app-storage.service";
import { ConfirmEventDialogComponent } from "../../dialogs/confirm-event-dialog/confirm-event-dialog.component";
import { EventService } from "../../../services/event.service";

export interface DialogData {
    date: any
}

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    userData: any;
    calendarData: any;

    constructor(public dialog: MatDialog, private storage: AppStorageService, private eventService: EventService) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
        this.renderAllEvents();
    }

    renderAllEvents() {
        this.eventService.getAllEvents()
            .subscribe(
                data => {
                    this.calendarData = {
                        plugins: [dayGridPlugin, timeGrigPlugin, interactionPlugin],
                        header: {left: '', center: 'title', right: 'prev,next, today'},
                        editable: false,
                        eventLimit: true,
                        height: 'auto',
                        allDaySlot: false,
                        minTime: '09:00:00',
                        maxTime: '20:00:00',
                        defaultView: this.userData.role == 'ADMIN' ? 'dayGridMonth' : 'timeGridWeek',
                        events: data.events[0]
                    };
                },
                error => {
                    console.log(JSON.parse(error).status);
                    console.log(JSON.parse(error).message);
                    // mandar a pantalla de error
                }//,
                //() => console.log(this.calendarData.events)
            );
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

        //console.log('The dialog was opened');

        dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed');
        });
    }

}
