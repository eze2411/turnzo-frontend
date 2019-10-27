import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HelloWorldComponent } from './components/hello-world/hello-world.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CreateEventDialogComponent } from './components/dialogs/create-event-dialog/create-event-dialog.component';

import { FullCalendarModule } from '@fullcalendar/angular';


import { RegisterComponent } from './components/register/register.component';
import { RegisterFormComponent } from './components/register/register-form/register-form.component';
import { RegisterSuccessComponent } from './components/register/register-success/register-success.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent,
    LoginComponent,
    RegisterComponent,
    RegisterFormComponent,
    RegisterSuccessComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    CalendarComponent,
    CreateEventDialogComponent
  ],
  entryComponents: [
    CreateEventDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: 'hello-world',  component: HelloWorldComponent},
      {path: 'login',  component: LoginComponent},
      {path: 'register',  component: RegisterComponent},
      {path: 'home', component: HomeComponent}
    ]),
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    NgbModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatCheckboxModule,
    MatSnackBarModule

  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
