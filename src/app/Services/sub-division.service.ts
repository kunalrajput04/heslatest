import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Dropdown } from '../Models/dropdown';
import { GetSubdivision } from '../Models/get-subdivision';
import { SubDivision,SubDivision1 } from '../Models/sub-division';
import { UserKey1 } from '../Models/user-key';

@Injectable({
  providedIn: 'root',
})
export class SubDivisionService {
  data: UserKey1 = new UserKey1();
  ownerdata: GetSubdivision = new GetSubdivision();
  constructor(private http: HttpClient) {}

  addSubdivision(formdata: SubDivision) {
    formdata.ownerName = localStorage.getItem('UserID');
    return this.http.post(
      `${environment.apiUrl}/asset/addSubDivision`,
      formdata
    );
  }

  getSubdivision() {
    this.ownerdata = {
        ownerName: localStorage.getItem('UserID'),    
    };
    return this.http.post(
      `${environment.apiUrl}/asset/getSubDivision`,
      this.ownerdata
    );
  }
  getSubdivisionForRegistration(data: string) {
    this.ownerdata.ownerName = data; 
    return this.http.post(
      `${environment.apiUrl}/asset/getSubDivision`,
      this.ownerdata      
    );
  }

  getUtility() {
    return this.http.get(`${environment.apiUrl}/Evit/getOwnerList/XXXXX`);
  }

  //#region oldListingapi

  //#endregion

  getAllSubDivisioin() {
    this.data = {
      ownerName: localStorage.getItem('UserID'), 
    }; 
    return this.http.post(
      `${environment.apiUrl}/asset/getSubDivisionList`,
      this.data
    );
  }

  getSubDivisionById(username: any, deviceid: any) {
    return this.http.get(
      `${environment.apiUrl}/asset/getSubDivision` +
        username +
        `/` +
        deviceid +
        ``
    );
  }

  // deleteSubDivion(data: SubDivision) {
  //   return this.http.post(
  //     `${environment.apiUrl}/asset/deleteSubDivision`,
  //     data
      
  //   );
  // }
  // deleteSubDivion(data: SubDivision1) {

  //   return this.http.delete(
  //     `${environment.apiUrl}/asset/deleteSubDivision`,
  //     data
      
  //   );
  // }
  
  deleteSubDivion(data: SubDivision1) {
    return this.http.request('DELETE',
      `${environment.apiUrl}/asset/deleteSubDivision`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: data
      }
    );
  }
}
