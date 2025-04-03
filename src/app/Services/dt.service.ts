import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DT } from '../Models/dt';
import { GetDT } from '../Models/get-dt';
import { Levls } from '../Models/levls';

@Injectable({
  providedIn: 'root',
})
export class DTService {
  data: Levls = new Levls();
  ownerdata: GetDT = new GetDT();
  constructor(private http: HttpClient) {
   
  }
  addDT(model: DT) {
    model.ownerName = localStorage.getItem('UserID');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addDT/`,
      model,

      httpOptions
    );
  }
  getDTByFeeder(feeder: string) {
    this.ownerdata.feederName = feeder;
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getDT`,
      this.ownerdata,
      httpOptions
    );
  }

  getDtData() {
    this.data.levelName = localStorage.getItem('levelName');
    this.data.levelValue = localStorage.getItem('levelValue');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getDtTransList/`,
      this.data,
      httpOptions
    );
  }
  deleteDTData(data: DT) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/deleteDT/`,
      data,
      httpOptions
    );
  }
}
