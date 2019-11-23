import { Component, OnInit } from '@angular/core';
import {AppStorageService} from "../../services/app-storage.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentData: string;
    userData: any;
    showView: string;

  constructor(private storage: AppStorageService) { }

  ngOnInit() {
      this.userData = this.storage.getStoredUser();
      this.showView = 'calendar';
  }

}
