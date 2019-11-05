import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {User} from "../models/User.model";
import {AppStorageService} from "./app-storage.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import {Router} from "@angular/router";

const headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000/login"

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient, private storage: AppStorageService, public jwtHelper: JwtHelperService,
                private router: Router) {
    }

    loginUser(email: string, password: string) {
        return new Promise((resolve, reject) => {
            const res = this.http.post<any>(apiUrl, {
                'email': email,
                'password': password
            }, {headers: headers})
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
                    (error) => {
                        reject(error)
                    });
            }
        })
    }

    logoutUser() {
        localStorage.removeItem('token');
        this.storage.removeUserOnLocalStorage();
        this.router.navigate(['login']);
    }

    private handleError(error: any) {
        return observableThrowError(JSON.stringify(error))
    }

    private setSession(res: any) {
        localStorage.setItem('token', res.token);
        this.storage.storeUserOnLocalStorage(res.user as User);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        if (!token) return false;
        return !this.jwtHelper.isTokenExpired(token);
    }

}
