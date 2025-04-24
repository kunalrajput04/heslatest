import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SubdivisionNameKey } from '../Model/subdivision-name-key';
import { GetSubdivision } from '../Models/get-subdivision';
import { Levls } from '../Models/levls';
import { SubDivision } from '../Models/sub-division';
import { SubStation } from '../Models/sub-station';
import { UserKey } from '../Models/user-key';

@Injectable({
  providedIn: 'root',
})
export class SubStationService {
 
  levels: Levls = new Levls();
  subdivision: SubdivisionNameKey = new SubdivisionNameKey();
  constructor(private http: HttpClient) {
  }

  addSubStation(formdata: SubStation) {
    formdata.ownerName = localStorage.getItem('UserID');
    return this.http.post(
      `${environment.apiUrl}/asset/addSubStation`,
      formdata);
  }

  getSubstationData() {
    this.levels = {
      levelName: localStorage.getItem('levelName'),
      levelValue: localStorage.getItem('levelValue'),
    };
  
    return this.http.post(
      `${environment.apiUrl}/asset/getSubStationList`,
      this.levels);
  }
  getSubstationBySubdivision(name: string) {
    this.subdivision.subDivisionName = name; 
    return this.http.post(
      `${environment.apiUrl}/asset/getSubStation`,
      this.subdivision);
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
  deleteSubstationData(formdata: SubStation) {
    formdata.ownerName = localStorage.getItem('UserID');
    return this.http.request('DELETE',
      `${environment.apiUrl}/asset/deleteSubStation`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: formdata
      }
    );
  }
}
