import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AppStorageService} from "./app-storage.service";

const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8', 'auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0MywiZW1haWwiOiJ1c2VyQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkOHRZZmoxZmpFYmJ2dVMwQ2JNTERYT3ZQcW01ano4Qmx4MkJiaHR1NWlPTmdBY0tBZ0RYT3UiLCJmaXJzdE5hbWUiOiJ1c2VyIiwibGFzdE5hbWUiOiJtYWlsIiwiYmlydGhkYXRlIjoiMjAxOS0xMS0wM1QwMzowMDowMC4wMDBaIiwicm9sZSI6IlVTRVIifSwiaWF0IjoxNTcyODE1OTE3LCJleHAiOjE1NzI5ODg3MTd9.CFdH5SEZuGgLjup2Sj94cR7Q_uCXkILgKx9ohZh1H-k'});
const apiUrl = "http://localhost:3000/event";

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(private http: HttpClient, private storage: AppStorageService) {
    }

    getAllEvents(): Observable<any> {
        return this.http.get(apiUrl + '/all', {headers}).pipe(this.extractData, catchError(this.handleError))
    }

    postUserEvent(description: string, start: string, end: string, destiny: string): Observable<any> {
        let body = {
            'description': description,
            'start': start,
            'end': end,
            'destiny': destiny
        };
        return this.http.post(apiUrl + '/turnzo', body, {headers}).pipe(this.extractData, catchError(this.handleError))
    }

    private extractData(res: any) {
        let body = res;
        return body || {};
    }

    private handleError(error: any) {
        return observableThrowError(JSON.stringify(error))
    }
}
