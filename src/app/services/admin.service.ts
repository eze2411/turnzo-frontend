import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
const apiUrl = "http://ec2-18-189-16-252.us-east-2.compute.amazonaws.com:3000/admin";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private http: HttpClient) { }

    getAllAdminsInfo(): Observable<any> {
        return this.http.get(apiUrl + '/all', {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    private extractData(res: any) {
        let body = res;
        return body || {};
    }

    private handleError(error: any) {
        return observableThrowError(JSON.stringify(error))
    }
}
