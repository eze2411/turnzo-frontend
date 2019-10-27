import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SidebarComponent, DialogData } from '../../sidebar/sidebar.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-create-event-dialog',
	templateUrl: './create-event-dialog.component.html',
	styleUrls: ['./create-event-dialog.component.scss']
})
export class CreateEventDialogComponent implements OnInit {
	eventForm: FormGroup;

	constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateEventDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

	ngOnInit() {
		console.log(this.data);
		this.eventForm = this.fb.group({
			title: new FormControl('', [Validators.required]),
			type: new FormControl('', [Validators.required]),
			start: new FormControl('', [Validators.required]),
			end: new FormControl('', [Validators.required]),
			patient: new FormControl('', [Validators.required]),
			description: new FormControl('', [Validators.required])
		})
	}

	closeCreateEventDialog(): void {
		this.dialogRef.close();
	}

}
