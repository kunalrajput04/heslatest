import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Feeder } from '../Models/feeder';
import { Levls } from '../Models/levls';
import { SubstationNameKey } from '../Models/substation-name-key';

@Injectable({
  providedIn: 'root',
})
export class FeederService {
  data: Levls = new Levls();
  substationdata: SubstationNameKey = new SubstationNameKey();
  constructor(private http: HttpClient) {
  
  }

  addFeeder(formdata: Feeder) {
    formdata.user_id = localStorage.getItem('UserID');

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/addFeeder`,
      formdata,
      httpOptions
    );
  }

  //#region  OldApi
  getFeederList() {
    this.data.levelName = localStorage.getItem('levelName');
    this.data.levelValue = localStorage.getItem('levelValue');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getFeederList/`,
      this.data,
      httpOptions
    );
  }

  deleteFeeder(data: Feeder) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/deleteFeeder/`,
      data,
      httpOptions
    );
  }

  getFeederInfo(feerderId: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/deleteFeeder/` + feerderId + ``,
      httpOptions
    );
  }

  getFeederBySubstation(name: string) {
    this.substationdata.substationName = name;
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getFeeders/`,
      this.substationdata,
      httpOptions
    );
  }
}
