import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dropdown } from '../Models/dropdown';
import { GetSubdivision } from '../Models/get-subdivision';
import { SubDivision } from '../Models/sub-division';
import { UserKey } from '../Models/user-key';

@Injectable({
  providedIn: 'root',
})
export class SubDivisionService {
  data: UserKey = new UserKey();
  ownerdata: GetSubdivision = new GetSubdivision();
  constructor(private http: HttpClient) {
  
  
  }

  addSubdivision(formdata: SubDivision) {
    formdata.user_id = localStorage.getItem('UserID');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addSubdevision`,
      formdata,
      httpOptions
    );
  }

  getSubdivision() {
    this.ownerdata = {
      ownerName: localStorage.getItem('UserID'),
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getSubdivision`,
      this.ownerdata,
      httpOptions
    );
  }
  getSubdivisionForRegistration(data: string) {
    
    this.ownerdata.ownerName = data;
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getSubdivision`,
      this.ownerdata,
      httpOptions
    );
  }

  getUtility() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.get(
      `${environment.apiUrl}/Evit/getOwnerList/XXXXX`,
      httpOptions
    );
  }

  //#region oldListingapi

  //#endregion

  getAllSubDivisioin() {
    this.data = {
      user_id: localStorage.getItem('UserID'),
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getSubdivisionList`,
      this.data,
      httpOptions
    );
  }

  getSubDivisionById(username: any, deviceid: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getSubdevision/` +
        username +
        `/` +
        deviceid +
        ``,
      httpOptions
    );
  }

  deleteSubDivion(data: SubDivision) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/deleteSubdevision/`,
      data,
      httpOptions
    );
  }
}
