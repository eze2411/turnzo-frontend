import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventDialogComponent } from '../dialogs/create-event-dialog/create-event-dialog.component';
import interactionPlugin from '@fullcalendar/interaction';
import timeGrigPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {

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
    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
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
