import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EventService} from "../../services/event.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges {
    message: any;
    currentValue: string;
    @Input() searchString: string;

  constructor(private eventService: EventService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.searchString.currentValue) {
          console.log(changes.searchString.currentValue)
      }
  }

}
