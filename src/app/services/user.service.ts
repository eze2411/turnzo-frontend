import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {throwError as observableThrowError, Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000/user"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registerUser(firstname: string, lastname: string, birthdate: string, role: string, email: string, password: string ): Observable<any> {
    let user = {
      'firstName': firstname,
      'lastName': lastname,
      'email': email,
      'role': role,
      'birthdate': birthdate,
      'password': password
    };
    return this.http.post(apiUrl, user, {headers}).pipe(this.extractData, catchError(this.handleError))
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  private handleError(error: any) {
      return observableThrowError(JSON.stringify(error))
  }
}
