import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  title = 'easyfullcalendar';

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      $("#calendar").fullCalendar({
        height: 600,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        navLinks: true,
        editable: true,
        eventLimit: true,
        events: [
          {
            title: 'This is your',
            start: '2019-10-03T12:30:00',
            color: '#d2a8ff' // override!
          },
          {
            title: 'This is your 2',
            start: '2019-10-03T16:30:00',
            color: '#d2a8ff' // override!
          },
          {
            title: 'This is your 3',
            start: '2019-10-03T18:30:00',
            color: '#d2a8ff' // override!
          },
          {
            title: 'Your meeting with john',
            start: '2019-10-07T12:30:00',
            end: '2019-03-09',
            color: "#d2a8ff"
          },
          {
            title: 'This is Today',
            start: '2019-10-12T12:30:00',
            allDay: false, // will make the time show,
            color: "#d2a8ff"
          }
        ],  // request to load current events
      });
    }, 100);
  }

}
