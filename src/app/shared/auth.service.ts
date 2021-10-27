import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { User } from './user';
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  endpoint_api: string = "http://localhost:8000";
  endpoint: string = "http://localhost:4200";
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  login(user: User) {
    return this.http.post<any>(`${this.endpoint_api}/api/login/`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.access);
        // this.getDashboard().subscribe((res) => {
        //   console.log("hola 01");
        //   this.currentUser = res;
        //   console.log("hola 02");
        //   this.router.navigate(['home']);
        // })
        this.router.navigate(['home']);
      })
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  getDashboard(): Observable<any> {
    let api = `${this.endpoint}/home`;
    console.log(api);
    return this.http.get(api, { headers: this.headers }).pipe( map((res) => { return res }), catchError(this.handleError) )
  }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

}
