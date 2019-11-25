import {Component, OnInit, Inject, Output, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CreateEventDialogComponent} from '../dialogs/create-event-dialog/create-event-dialog.component';
import {AppStorageService} from "../../services/app-storage.service";
import {FormControl} from "@angular/forms";
import {AdminService} from "../../services/admin.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    adminsData: any;
    userData: any;
    searchInput = new FormControl('');
    selectedAdmin: string;

    @Output()goTo  = new EventEmitter();
    @Output()searchValue  = new EventEmitter();
    @Output()adminCalendar  = new EventEmitter();

    constructor(public dialog: MatDialog,
                private adminService: AdminService,
                private storage: AppStorageService,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.userData = this.storage.getStoredUser();
        this.getAdminsInfoFromApi();
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

    getAdminsInfoFromApi() {
        this.adminService.getAllAdminsInfo()
            .subscribe(
                data => {
                    this.adminsData = data.results;
                    //console.log(this.adminsData);
                },
                error => {
                    //console.log("status --"  + JSON.parse(error).status);
                    //console.log("message --" + JSON.parse(error).message);
                    this._snackBar.open("There was a problem while fetching admins, try again later", "Cancel", {
                        duration: 3000,
                    });
                    // mandar a pantalla de error?
                },
                () => {
                    //console.log('isValid: ' + this.message.status);
                }
            );
    }

    onAdminChipClick(admin) {
        this.selectedAdmin = admin.email;
        this.adminCalendar.emit(this.selectedAdmin);
    }
}
