import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetZone } from '../Models/get-zone';
import { UserKey1 } from '../Models/user-key';
import { Zone } from '../Models/zone';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  data: UserKey1 = new UserKey1();
  ownerdata: GetZone = new GetZone();
  constructor(private http: HttpClient) {}

  addZone(formdata: Zone) {
    formdata.ownerName = localStorage.getItem('UserID');
    return this.http.post(
      `${environment.apiUrl}/asset/addZone`,
      formdata
    );
  }

  getZone() {
    this.ownerdata = {
        ownerName: localStorage.getItem('UserID'),    
    };
    return this.http.post(
      `${environment.apiUrl}/asset/getZone`,
      this.ownerdata
    );
  }
  getZoneForRegistration(data: string) {
    this.ownerdata.ownerName = data; 
    return this.http.post(
      `${environment.apiUrl}/asset/getZone`,
      this.ownerdata      
    );
  }

  getUtility() {
    return this.http.get(`${environment.apiUrl}/Evit/getOwnerList/XXXXX`);
  }

  //#region oldListingapi

  //#endregion

  getAllZone() {
    this.data = {
      ownerName: localStorage.getItem('UserID'), 
    }; 
    return this.http.post(
      `${environment.apiUrl}/asset/getZoneList`,
      this.data
    );
  }

  getZoneById(username: any, deviceid: any) {
    return this.http.get(
      `${environment.apiUrl}/asset/getZone` +
        username +
        `/` +
        deviceid +
        ``
    );
  }

  deleteZone(data: Zone) {
    return this.http.post(
      `${environment.apiUrl}/asset/deleteZone`,
      data
      
    );
  }
  // deleteSubDivion(data: SubDivision1) {

  //   return this.http.delete(
  //     `${environment.apiUrl}/asset/deleteSubDivision`,
  //     data
      
  //   );
  // }
  
  // deleteSubDivion(data: SubDivision1) {
  //   return this.http.request('DELETE',
  //     `${environment.apiUrl}/asset/deleteSubDivision`,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       }),
  //       body: data
  //     }
  //   );
  // }
}
