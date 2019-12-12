import {Component, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
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
export class CalendarComponent implements OnInit, OnDestroy {
    userData: any;
    eventsData: any;
    calendarData: any;
    eventId: string;
    interval: any;

    @Input() adminCalendarShowView: string;

    constructor(public dialog: MatDialog,
                private storage: AppStorageService,
                private eventService: EventService) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
        this.initCalendarData();
        this.renderEvents();
        this.interval = setInterval(() => {
            this.renderEvents();
        }, 2000);

    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.adminCalendarShowView.currentValue) {
            this.renderEvents();
        }
    }

    renderEvents() {
        if(this.userData) {
            if (this.userData.role == 'ADMIN') {
                this.renderAdminEvents();
            } else {
                this.renderUserEvents();
            }
        }
    }

    renderAdminEvents() {
        this.eventService.getAdminEvents()
            .subscribe(
                data => {
                    this.eventsData = data.events[0];
                    //console.log(this.eventsData);
                    this.calendarData.events = this.eventsData;
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    // toHacer abrir snackbar ocurrio un error
                }//,
                //() => console.log(this.calendarData.events)
            );
    }

    renderUserEvents() {
        this.eventService.getUserEventsByAdmin(this.adminCalendarShowView, this.userData.email)
            .subscribe(
                data => {
                    this.eventsData = data.events[0];
                    //console.log(this.eventsData);
                    this.calendarData.events = this.eventsData;
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    // toHacer abrir snackbar ocurrio un error
                }//,
                //() => console.log(this.calendarData.events)
            );
    }

    initCalendarData() {
        let calendarData = {
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
            events: {},
            defaultView: 'timeGridWeek'
        };
        this.calendarData = calendarData;
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
            this.renderEvents();
        });
    }

    onDateClick(event) {
        if (this.userData.role == 'USER') {
            if (!this.adminCalendarShowView)
                return false;
            else
                event.admin = this.adminCalendarShowView;
        }
            const dialogRef = this.dialog.open(ConfirmEventDialogComponent, {
                width: '500px',
                data: {
                    action: 'confirm',
                    event: event
                }
            });

            //console.log('The dialog was opened');
            dialogRef.afterClosed().subscribe(result => {
                this.renderEvents();
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
        this.renderUserEvents();
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
        this.renderUserEvents();
    }

    updateEvent(start ,end) {
        this.eventService.postUpdateEvent("asd", start, end, this.eventId)
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
