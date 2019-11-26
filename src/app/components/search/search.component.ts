import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EventService} from "../../services/event.service";
import {AppStorageService} from "../../services/app-storage.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges {
    message: any;
    currentValue: string;
    userData: any;
    eventsData: any;
    @Input() searchString: string;
    @Input() adminCalendarShowView: string;
    filteredEventsData: any;

  constructor(private eventService: EventService,
              private storage: AppStorageService) { }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.searchString.currentValue) {
            this.currentValue = changes.searchString.currentValue;
            this.userData = this.storage.getStoredUser();
            this.getEvents();
        }
    }

    getEvents() {
        if(this.userData) {
            if (this.userData.role == 'ADMIN') {
                this.getAdminEvents();
            } else {
                this.getUserEvents();
            }
        }
    }

    getAdminEvents() {
        this.eventService.getAdminEvents()
            .subscribe(
                data => {
                    this.eventsData = data.events[0];
                    this.filterEventsData();
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    // toHacer abrir snackbar ocurrio un error
                }//,
                //() => console.log(this.calendarData.events)
            );
    }

    getUserEvents() {
        this.eventService.getUserEventsByAdmin(this.adminCalendarShowView, this.userData.email)
            .subscribe(
                data => {
                    this.eventsData = data.events[0];
                    this.filterEventsData();
                },
                error => {
                    //console.log(JSON.parse(error).status);
                    //console.log(JSON.parse(error).message);
                    // toHacer abrir snackbar ocurrio un error
                }//,
                //() => console.log(this.calendarData.events)
            );
    }


    private filterEventsData() {
        let current = this.currentValue.toLowerCase();
        this.filteredEventsData = this.eventsData.filter(event => (event.title.toLowerCase().indexOf(current) > -1 || event.event_description.toLowerCase().indexOf(current) > -1));
    }
}
