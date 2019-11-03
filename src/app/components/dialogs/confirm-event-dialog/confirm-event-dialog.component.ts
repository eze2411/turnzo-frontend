import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../sidebar/sidebar.component";

@Component({
    selector: 'app-confirm-event-dialog',
    templateUrl: './confirm-event-dialog.component.html',
    styleUrls: ['./confirm-event-dialog.component.scss']
})
export class ConfirmEventDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ConfirmEventDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
    }

    closeCreateEventDialog(): void {
        this.dialogRef.close();
    }

}
