import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Models/user';
import { Token } from '../Models/token';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { ChangePassword, ILogout } from '../Models/change-password';
import { Levls } from '../Models/levls';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'apikey';
  datalevel: Levls = new Levls();
  constructor(private http: HttpClient) {

  }
  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  changePassword(data: ChangePassword) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/authentication/updatePassword`,
      data,
      httpOptions
    );
  }
  logout(data: ILogout) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/authentication/appLogout`,
      data,
      httpOptions
    );
  }

  getDashboard() {
    this.datalevel.levelName = localStorage.getItem('levelName');
    this.datalevel.levelValue = localStorage.getItem('levelValue');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getDashboard/`,
      this.datalevel,
      httpOptions
    );
  }

  doLoginUser(tokens: string) {
    localStorage.setItem(this.JWT_TOKEN, tokens);
  }


 // Old Api
  login(formdata: User) {
    return this.http.post(
      `${environment.apiUrl}/authentication/appLogin`,
      formdata
    );
  }

  //New Api with captcha

  newlogin(formdata: User, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        token: token,
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/authentication/captchaAppLogin`,
      formdata, httpOptions
    );
  }

}
