import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Circle } from '../Models/circle';
import { environment } from 'src/environments/environment';
import { Levls } from '../Models/levls';
import { Zone } from '../Models/zone';

@Injectable({
  providedIn: 'root'
})
export class CircleService {
 
  levels: Levls = new Levls();
  zone: Zone = new Zone();
  constructor(private http: HttpClient) {
  }

  addCircle(formdata: Circle) {
    formdata.ownerName = localStorage.getItem('UserID');
    return this.http.post(
      `${environment.apiUrl}/asset/addCircle`,
      formdata);
  }

  getCircleData() {
    this.levels = {
      levelName: localStorage.getItem('levelName'),
      levelValue: localStorage.getItem('levelValue'),
    };
  
    return this.http.post(
      `${environment.apiUrl}/asset/getCircleList`,
      this.levels);
  }
  getCircleByZone(name: string) {
    this.zone.zoneName = name; 
    return this.http.post(
      `${environment.apiUrl}/asset/getCircle`,
      this.zone);
  }
  // deleteSubstationData(formdata: SubStation) {
  //   formdata.ownerName = localStorage.getItem('UserID');
  //   return this.http.post(
  //     `${environment.apiUrl}/asset/deleteSubStation`,
  //     formdata);
  // }
  // deleteSubstationData(formdata: SubStation) {
  //   return this.http.delete(
  //     `${environment.apiUrl}/asset/deleteSubStation/${formdata.subStationName}`
  //   );
  // }
  deleteCircleData(formdata: Circle) {
    formdata.ownerName = localStorage.getItem('UserID');
    return this.http.request('DELETE',
      `${environment.apiUrl}/asset/deleteCircle`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: formdata
      }
    );
  }
}