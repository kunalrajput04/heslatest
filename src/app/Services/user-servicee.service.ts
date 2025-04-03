import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserCreate } from '../Models/user-create';
export interface UserEmail {
  email: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserServiceeService {
  data: UserEmail = {
    email: '',
  };
  constructor(private http: HttpClient) {}
  adduser(formdata: UserCreate) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/authentication/CreateUser`,
      formdata,
      httpOptions
    );
  }
  getuserbyemail(email: string) {
    this.data.email = email;
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/authentication/getUserByEmail`,
      this.data,
      httpOptions
    );
  }
}
