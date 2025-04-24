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
    return this.http.post(
      `${environment.apiUrl}/asset/addDT`,
      model      
    );
  }
  getDTByFeeder(feeder: string) {    
    this.ownerdata.feederName = feeder;
    return this.http.post(
      `${environment.apiUrl}/asset/getDtTrans`,
      this.ownerdata
      
    );
  }

  getDtData() {
    this.data.levelName = localStorage.getItem('levelName');
    this.data.levelValue = localStorage.getItem('levelValue'); 
    return this.http.post(
      `${environment.apiUrl}/asset/getDtTransList`,
      this.data
      
    );
  }
  // deleteDTData(data: DT) {   
  //   return this.http.post(
  //     `${environment.apiUrl}/asset/deleteDT`,
  //     data
      
  //   );
  // }
  deleteDTData(data: DT) {   
    return this.http.request('DELETE',
      `${environment.apiUrl}/asset/deleteDT`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: data
      }
    );
  }

}
