import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {throwError as observableThrowError, Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {User} from "../models/User.model";
import {AppStorageService} from "./app-storage.service";

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000/"

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private storage: AppStorageService) { }

  loginUser(email: string, password: string): Observable<any> {
    let body = {
      'email': email,
      'password': password
    };
    return this.http.post(apiUrl, body, {headers}).pipe(this.extractData, catchError(this.handleError))
  }

  loginUser2(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const res = this.http.post<any>(apiUrl + 'login', { 'email': email, 'password': password }, { headers: headers })
        .pipe(catchError(this.handleError))

      if (res) {
        res.subscribe(
          (result) => {
            if (!result.token) {
              reject(false);
            }
            this.setSession(result);
            resolve(true);
          },
          (error) => { reject(error) });
      }
    })
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  private handleError(error: any) {
      return observableThrowError(JSON.stringify(error))
  }

  private setSession(res: any) {
    localStorage.setItem('token', res.token);
    this.storage.storeUserOnLocalStorage(res.user as User);
  }
}
