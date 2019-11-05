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
