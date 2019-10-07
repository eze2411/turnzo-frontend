import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';

export interface DialogData {

}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  createEventDialog(): void {
    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      width: '500px'
    });

    console.log('The dialog was opened');

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
