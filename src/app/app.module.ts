import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterFormComponent } from './components/register/register-form/register-form.component';
import { RegisterSuccessComponent } from './components/register/register-success/register-success.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CreateEventDialogComponent} from './components/dialogs/create-event-dialog/create-event-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { AppStorageService } from './services/app-storage.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ConfirmEventDialogComponent } from './components/dialogs/confirm-event-dialog/confirm-event-dialog.component';
import { JwtModule } from "@auth0/angular-jwt";
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { SearchComponent } from './components/search/search.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

export function tokenGetter() {
    return localStorage.getItem("access_token");
}

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
        CreateEventDialogComponent,
        ConfirmEventDialogComponent,
        ProfileComponent,
        SettingsComponent,
        ConfirmDialogComponent,
        SearchComponent
    ],
    entryComponents: [
        CreateEventDialogComponent,
        ConfirmEventDialogComponent,
        ConfirmDialogComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule.forRoot([
            {path: 'hello-world', component: HelloWorldComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'login', component: LoginComponent},
            {path: '', component: HomeComponent, canActivate: [AuthGuardService]}
        ]),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ["example.com"],
                blacklistedRoutes: ["example.com/examplebadroute/"]
            }
        }),
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
        MatMenuModule,
        MatDividerModule,
        MatChipsModule,
        MatExpansionModule,
        FormsModule,
        ReactiveFormsModule,
        FullCalendarModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        StorageServiceModule
    ],
    providers: [AppStorageService,
        MatDatepickerModule,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
