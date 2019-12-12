import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AppStorageService} from "./app-storage.service";

const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
const apiUrl = "http://localhost:3000/event";

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(private http: HttpClient, private storage: AppStorageService) {
    }

    getAdminEvents(): Observable<any> {
        return this.http.get(apiUrl + '/admin', {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    getUserEventsByAdmin(admin: string, user: string): Observable<any> {
        return this.http.get(apiUrl + '/user/' + admin, {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    postUserEvent(description: string, start: string, end: string, destiny: string): Observable<any> {
        let body = {
            'description': description,
            'start': start,
            'end': end,
            'destiny': destiny
        };
        return this.http.post(apiUrl + '/turnzo', body, {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    postManualUserEvent(description: string, start: string, end: string, origin: string): Observable<any> {
        let body = {
            'description': description,
            'start': start,
            'end': end,
            'origin': origin
        };
        return this.http.post(apiUrl + '/turnzo/manual', body, {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    postAdminLock(description: string, start: string, end: string, destiny: string): Observable<any> {
        let body = {
            'description': description,
            'start': start,
            'end': end,
            'destiny': destiny
        };
        return this.http.post(apiUrl + '/lock', body, {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    postDeleteEvent(eventId: string): Observable<any> {
        let body = { 'id': eventId };
        return this.http.post(apiUrl + '/delete', body , {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    postUpdateEvent(description: string, start: string, end: string, id: string): Observable<any> {
        let body = {
            'description' : description,
            'start' : start,
            'end' : end,
            'id' : id
        };
        return this.http.post(apiUrl + '/update', body, {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    private extractData(res: any) {
        let body = res;
        return body || {};
    }

    private handleError(error: any) {
        return observableThrowError(JSON.stringify(error))
    }
}
