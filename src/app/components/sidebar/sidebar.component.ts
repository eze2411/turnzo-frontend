import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CreateEventDialogComponent} from '../dialogs/create-event-dialog/create-event-dialog.component';
import {AppStorageService} from "../../services/app-storage.service";
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    userData: any;
    searchInput = new FormControl('');

    @Output()goTo  = new EventEmitter();
    @Output()searchValue  = new EventEmitter();

    constructor(public dialog: MatDialog, private storage: AppStorageService) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
    }

    createEventDialog(): void {
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
            width: '500px',
            data: {
                isNewEvent: true
            }
        });
        //console.log('The dialog was opened');
        dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed');
        });
    }

    onDoSearch(str) {
        this.goTo.emit('search');
        let strLower = str.toLowerCase();
        this.searchValue.emit(strLower);
        this.searchInput.reset();
    }
}
