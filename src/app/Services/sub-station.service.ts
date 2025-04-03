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
    formdata.user_id = localStorage.getItem('UserID');

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addSubstation`,
      formdata,
      httpOptions
    );
  }

  getSubstationData() {
    this.levels = {
      levelName: localStorage.getItem('levelName'),
      levelValue: localStorage.getItem('levelValue'),
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getSubstationList/`,
      this.levels,
      httpOptions
    );
  }
  getSubstationBySubdivision(name: string) {
    this.subdivision.subdivisionName = name;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getSubstation`,
      this.subdivision,
      httpOptions
    );
  }
  deleteSubstationData(formdata: SubStation) {
    formdata.user_id = localStorage.getItem('UserID');

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/deleteSubstation`,
      formdata,
      httpOptions
    );
  }
}
