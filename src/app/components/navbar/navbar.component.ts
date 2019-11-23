import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppStorageService} from "../../services/app-storage.service";
import {LoginService} from "../../services/login.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    userData: any;
    @Output()goTo  = new EventEmitter();

    constructor(private storage: AppStorageService, private login: LoginService) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
    }

    logout() {
        this.login.logoutUser();
    }

}
