import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEventDialogComponent } from './confirm-event-dialog.component';

describe('ConfirmEventDialogComponent', () => {
  let component: ConfirmEventDialogComponent;
  let fixture: ComponentFixture<ConfirmEventDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmEventDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
