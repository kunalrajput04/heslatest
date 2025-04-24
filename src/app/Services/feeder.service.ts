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
    formdata.ownerName = localStorage.getItem('UserID');  
    return this.http.post(
      `${environment.apiUrl}/asset/addFeeder`,
      formdata  
    );
  }


  getFeederList() {
    this.data.levelName = localStorage.getItem('levelName');
    this.data.levelValue = localStorage.getItem('levelValue');
    return this.http.post(
      `${environment.apiUrl}/asset/getFeederList`,
      this.data      
    );
  }

  // deleteFeeder(data: Feeder) {
  //   return this.http.post(
  //     `${environment.apiUrl}/asset/deleteFeeder`,
  //     data,
      
  //   );
  // }
  deleteFeeder(data: Feeder) {
    return this.http.request('DELETE',
      `${environment.apiUrl}/asset/deleteFeeder`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: data
      }
    );
  }
  getFeederInfo(feerderId: any) {
    return this.http.get(
      `${environment.apiUrl}/asset/deleteFeeder` + feerderId + ``,
      
    );
  }

  getFeederBySubstation(name: string) {    
    this.substationdata.subStationName = name; 

    return this.http.post(
      `${environment.apiUrl}/asset/getFeeder`,
      this.substationdata
      
    );
  }
}
