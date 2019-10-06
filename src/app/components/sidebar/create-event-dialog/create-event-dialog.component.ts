import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SidebarComponent, DialogData } from '../sidebar.component';

@Component({
  selector: 'app-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss']
})
export class CreateEventDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  closeCreateEventDialog(): void {
    this.dialogRef.close();
  }


}
