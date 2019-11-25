import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
const apiUrl = "http://localhost:3000/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

    registerUser(firstname: string, lastname: string, birthdate: string, role: string, email: string, password: string ): Observable<any> {
    let body = {
      'firstName': firstname,
      'lastName': lastname,
      'email': email,
      'role': role,
      'birthdate': birthdate,
      'password': password
    };
    return this.http.post(apiUrl, body, {headers}).pipe(this.extractData, catchError(this.handleError))
    }

    updateUserInfo(firstname: string, lastname: string, birthdate: string): Observable<any> {
        let body = {
            'firstname': firstname,
            'lastname': lastname,
            'birthdate': birthdate
        };
        return this.http.post(apiUrl + '/update', body, {headers}).pipe(this.extractData, catchError(this.handleError))
    }

    getLoggedUserInfo(): Observable<any> {
        return this.http.get(apiUrl, {headers}).pipe(this.extractData, catchError(this.handleError));
    }

    getAllUsersInfo(): Observable<any> {
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
