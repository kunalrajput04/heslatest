import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  deleteDevice,
  DeviceInformation,
  getDevice,
} from '../Models/device-information';
import { GetDT } from '../Models/get-dt';
import { GetFeeder } from '../Models/get-feeder';
import { Levls } from '../Models/levls';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  data: Levls = new Levls();
  deviceNo: getDevice = new getDevice();
  delDevice: deleteDevice = new deleteDevice();
  constructor(private http: HttpClient) {

  }
  AddDevice(model: DeviceInformation) {
    model.ownerName = localStorage.getItem('UserID');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addDevice/`,
      model,
      httpOptions
    );
  }

  getDeviceInfo(deviceno: getDevice) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Devices/getMeterInfo/`,
      deviceno,
      httpOptions
    );
  }

  getDeviceList(meterNo: string) {
    if (meterNo != '') {
      this.data.levelName = 'METER';
      this.data.levelValue = meterNo;

    }
    else {
      this.data.levelName = localStorage.getItem('levelName');
      this.data.levelValue = localStorage.getItem('levelValue');

    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.slaiNfoNEW}/Evit/getDevice`,
      this.data,
      httpOptions
    );
  }
  getRenderDeviceList(data: any) {

    this.data.levelName = localStorage.getItem('levelName');
    this.data.levelValue = localStorage.getItem('levelValue');

    let datasend = {
      levelName: this.data.levelName,
      levelValue: this.data.levelValue,
      start: data.start,
      length: data.length,
      order: {
        dir: data.order[0].dir,
        column: data.order[0].column
      },
      search: data.search
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),

      }),

    };

    return this.http.post(
      `${environment.apiRenderUrl}/devices/getList`,
      datasend,
      httpOptions
    );
  }
  getRenderDeviceCount() {
    this.data.levelName = localStorage.getItem('levelName');
    this.data.levelValue = localStorage.getItem('levelValue');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiRenderUrl}/devices/count`,
      this.data,
      httpOptions
    );
  }
  deleteDevice(meterno: string, reason: string) {
    this.delDevice.deviceSerialNo = meterno;
    this.delDevice.reason = reason;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/deleteDevice/`,
      this.delDevice,
      httpOptions
    );
  }
}
