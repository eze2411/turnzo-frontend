import {Component, OnInit} from '@angular/core';
import {AppStorageService} from "../../services/app-storage.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    userData: any;

    constructor(private storage: AppStorageService) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
    }

}
