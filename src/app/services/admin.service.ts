import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from "moment";

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
const apiUrl = "http://localhost:3000/admin";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private http: HttpClient) { }

    getAllAdminsInfo(): Observable<any> {
        return this.http.get(apiUrl + '/all', {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    postAdminSetting(settingName: string, settingValue: string): Observable<any> {
        let body = {
            'settingName': settingName,
            'settingValue': settingValue
        };
        return this.http.post(apiUrl + '/setting', body, {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    getAdminSettings(): Observable<any> {
        return this.http.get(apiUrl + '/settings', {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    private extractData(res: any) {
        let body = res;
        return body || {};
    }

    private handleError(error: any) {
        return observableThrowError(JSON.stringify(error))
    }
}
