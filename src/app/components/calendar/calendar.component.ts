import {Component, OnInit} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {MatDialog} from '@angular/material/dialog';
import {CreateEventDialogComponent} from '../dialogs/create-event-dialog/create-event-dialog.component';
import interactionPlugin from '@fullcalendar/interaction';
import timeGrigPlugin from '@fullcalendar/timegrid';
import {AppStorageService} from "../../services/app-storage.service";
import {ConfirmEventDialogComponent} from "../dialogs/confirm-event-dialog/confirm-event-dialog.component";
import {EventService} from "../../services/event.service";
import * as moment from "moment";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    userData: any;
    eventsData: any;
    calendarData: any;
    fullCalendarEvent: any;
    apiEvent: any;
    eventId: string;
    constructor(public dialog: MatDialog, private storage: AppStorageService, private eventService: EventService) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
        this.renderAllEvents();
        setInterval(()=> {
            //this.renderAllEvents();
        }, 2000)

    }

    renderAllEvents() {
        this.eventService.getAllEvents()
            .subscribe(
                data => {
                    this.eventsData = data.events[0];
                    this.calendarData = {
                        plugins: [dayGridPlugin, timeGrigPlugin, interactionPlugin],
                        header: this.userData.role == 'ADMIN' ? {
                            left: "prev,next, today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay"
                        } : {left: "", center: "title", right: "prev,next, today"},
                        editable: this.userData.role == 'ADMIN' ? true : false,
                        eventLimit: true,
                        height: 'auto',
                        allDaySlot: false,
                        slotDuration: '01:00:00',
                        minTime: '09:00:00',
                        maxTime: '20:00:00',
                        events: this.eventsData,
                        defaultView: 'timeGridWeek'
                    };
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    // toHacer abrir snackbar ocurrio un error
                }//,
                //() => console.log(this.calendarData.events)
            );
    }

    onEventClick(event) {

        if (this.userData.role == 'ADMIN') {

        } else {
            if(event.event.title == '#N/A')
                return false;
        }

        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
            width: '500px',
            data: {
                events: this.eventsData,
                event: event.event
            }
        });

        //console.log('The dialog was opened');
        dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed');
            this.renderAllEvents();
        });
    }

    onDateClick(event) {
        console.log(event);
        const dialogRef = this.dialog.open(ConfirmEventDialogComponent, {
            width: '500px',
            data: {
                action: 'confirm',
                event: event
            }
        });

        //console.log('The dialog was opened');
        dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed');
            this.renderAllEvents();
        });
    }

    eventDragStart(event) {
        //console.log(event.event.start);
        this.eventsData.forEach(value => {
            if(moment(value.start).format('YYYY-MM-DDTHH:mm:ss') == moment(event.event.start).format('YYYY-MM-DDTHH:mm:ss')) {
                this.eventId = value.event_id;
            }
        });
    }

    eventDragStop(event) {
        //console.log(event.event.start);
        let eventStart = moment(event.event.start).format('YYYY-MM-DDTHH:mm:ss');
        let eventEnd = moment(event.event.end).format('YYYY-MM-DDTHH:mm:ss');
        this.updateEvent(eventStart, eventEnd);
    }

    eventResizeStart(event) {
        this.eventsData.forEach(value => {
            if(moment(value.start).format('YYYY-MM-DDTHH:mm:ss') == moment(event.event.start).format('YYYY-MM-DDTHH:mm:ss')) {
                this.eventId = value.event_id;
            }
        });
    }

    eventResizeStop(event) {
        //console.log(event.event.start);
        let eventStart = moment(event.event.start).format('YYYY-MM-DDTHH:mm:ss');
        let eventEnd = moment(event.event.end).format('YYYY-MM-DDTHH:mm:ss');
        this.updateEvent(eventStart, eventEnd);
    }

    updateEvent(start ,end) {
        this.eventService.putEvent("asd", start, end, this.eventId)
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
                    //console.log("complete");
                }
            );
    }
}
