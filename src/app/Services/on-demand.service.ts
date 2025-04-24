import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConnectDisconnect } from '../Models/connect-disconnect';
import { HesSetting } from '../Models/hes-setting';
import { IHesSetting } from '../Models/ihes-setting';
import { MeterDatas } from '../Models/meter-data';
import { catchError, tap } from 'rxjs/operators';
export interface Command {
  commandName: string;
  device;
}

export class ConfigCommand {
  levelName: string = '';
  levelValue: string = '';
  command: string = '';
  commandsVal: string = '';
}

@Injectable({
  providedIn: 'root',
})
export class OnDemandService {
  apikey: any;
  data: Command = {
    commandName: '',
    device: '',
  };
  getdata: MeterDatas = new MeterDatas();
  configData: ConfigCommand = new ConfigCommand();
  constructor(private http: HttpClient) { }

  // getConnectDisconnectDevice(): Observable<any> {
  //   let levelValue = localStorage.getItem('levelValue');
  //   let levelName = localStorage.getItem('levelName');
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       apiKey: localStorage.getItem('apikey'),
  //     }),
  //   };

  //   return this.http.get(
  //     `${environment.apiUrl}/Evit/getDevice1/` + levelName + `/` + levelValue,
  //     httpOptions
  //   );
  // }
  getConnectDisconnectDevice(): Observable<any> { 
    const requestBody = {
      levelName: localStorage.getItem('levelName'),
      levelValue: localStorage.getItem('levelValue')
    };
  
    return this.http.post(
      `${environment.apiUrl}/devices/getDevice1`,
      requestBody
      
    );
  }
  
  getDeviceForDT(levelValue: string) {


    return this.http.get(
      `${environment.apiUrl}/Evit/getDevice1/DT/` + levelValue
    );
  }
  getRTCList(levelValue: string, levelName: string) {

    let data = {
      levelName: levelName,
      levelValue: levelValue
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getClockData`, data
    );
  }
  getTODList(levelValue: string, levelName: string) {

    let data = {
      levelName: levelName,
      levelValue: levelValue
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getTODData`, data
    );
  }

  addCommand(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };


    return this.http.post(
      `${environment.apiUrl}/cmd/sync`,
      this.data
    );
  }

  connectDisconnect(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };
  

    return this.http.post(
      `${environment.apiUrl}/cmd/sync`,
      this.data
      
    );
  }
  connectDisconnectAsync(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };
  

    return this.http.post(
      `${environment.apiUrl}/cmd/async`,
      this.data
      
    );
  }
  connectDisconnectForAllLevel(Command: string, levelname: string, levelvalue: string) {
    let body = {
      commandName: Command,
      levelName: levelname,
      levelValue: levelvalue
    }
      return this.http.post(
      `${environment.apiUrl}/cmd/sync`,
      body
      
    );
  }
  connectDisconnectForAllLevelAsync(Command: string, levelname: string, levelvalue: string) {
    let body = {
      commandName: Command,
      levelName: levelname,
      levelValue: levelvalue
    }
      return this.http.post(
      `${environment.apiUrl}/cmd/async`,
      body
      
    );
  }
  OnDemandStatus(Command: string, levelname: string, levelvalue: string) {
    let body = {
      commandName: "MeterStatus",
      levelName: levelname,
      levelValue: levelvalue,
      obisCodeList: [
        Command
      ]
    }
  

    return this.http.post(
      `${environment.apiUrl}/cmd/sync`,
      body
      
    );
  }
  connectDisconnectFullData(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };


    return this.http.post(
      `${environment.apiUrl}/cmd/sync`,
      this.data
    );
  }
  connectDisconnectFullDataAsync(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };


    return this.http.post(
      `${environment.apiUrl}/cmd/async`,
      this.data
    );
  }
  RTCFullDataRead(levelName: string, levelValue: string) {
    let data = {
      levelName: levelName,
      levelValue: levelValue,
      command: "InstantaneousRead",
      commandsVal: ""
    };


    return this.http.post(
      `${environment.apiUrl}/cmd/sync`,
      data
    );
  }

  addCommandForInstantRead(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };


    return this.http.post(
      `${environment.apiUrl}/cmd/sync`,
      this.data
    );
  }
  
  executeCommandForConfiguration(
    command: string,
    commandvalue: string,
    levelname: string,
    levelvalue: string
  ) {

    this.configData.command = command;
    this.configData.commandsVal = commandvalue;
    this.configData.levelName = levelname;
    this.configData.levelValue = levelvalue;


    return this.http.post(
      `${environment.apiUrl}/cfg/config/sync`,
      this.configData
    );
  }
  executeCommandForConfigurationAsync(
    command: string,
    commandvalue: string,
    levelname: string,
    levelvalue: string
  ) {

    this.configData.command = command;
    this.configData.commandsVal = commandvalue;
    this.configData.levelName = levelname;
    this.configData.levelValue = levelvalue;


    return this.http.post(
      `${environment.apiUrl}/cfg/config/async`,
      this.configData
    );
  }

  executeOnDemandConfig(
    command: string,
    commandvalue: string,
    levelname: string,
    levelvalue: string
  ) {

    let body = {
      configVals: {
        [command]: commandvalue
      },
      levelName: levelname,
      levelValue: levelvalue
    }


    return this.http.post(
      `${environment.apiUrl}/Evit/meters/onDemandConfig`,
      body
    );
  }
  executeOnDemandConfigAsync(
    command: string,
    commandvalue: string,
    levelname: string,
    levelvalue: string
  ) {

    let body = {
      configVals: {
        [command]: commandvalue
      },
      levelName: levelname,
      levelValue: levelvalue
    }


    return this.http.post(
      `${environment.apiUrl}/Evit/meters/onDemandConfig`,
      body
    );
  }
  executeMultipleCommandForConfiguration(
    commands: any,
    levelname: string,
    levelvalue: string,
  ) {


    const body = {
      levelName: levelname,
      levelValue: levelvalue,
      configVals: commands
    }


    return this.http.post(
      `${environment.apiUrl}/cfg/mutiple/sync`,
      body
    );
  }
  executeCommandForHESsettings(data: HesSetting) {


    return this.http.post(
      `${environment.apiUrl}/cfg/changeHESSetting`,
      data
    );
  }

  addHesScheduling(data: IHesSetting) {
    let hesData = {
      ownerName: localStorage.getItem('UserID'),
      "dataFrequency": {
        "Instant Data": data.FInstantData,
        "Daily Load Profile": data.FDailyLoadProfile,
        "Load Profile": data.FLoadProfile,
        "Billing": data.FBilling,
        "Events": data.FEvents,
        "RTC Synchronization": data.FRTCSynchronization,
        "Configuration": data.FConfiguration
      },
      "retry": {
        "Instant Data": data.RInstantData,
        "Daily Load Profile": data.RDailyLoadProfile,
        "Load Profile": data.RLoadProfile,
        "Billing": data.RBilling,
        "Events": data.REvents,
        "RTC Synchronization": data.RRTCSynchronization,
        "Configuration": data.RConfiguration
      },
      "startTime": {
        "Instant Data": data.SInstantData,
        "Daily Load Profile": data.SDailyLoadProfile,
        "Load Profile": data.SLoadProfile,
        "Billing": data.SBilling,
        "Events": data.SEvents,
        "RTC Synchronization": data.SRTCSynchronization,
        "Configuration": data.SConfiguration
      },
      "updatedDatetime": data.updatedDatetime
    }

    return this.http.post(
      `${environment.apiUrl}/cfg/addHesScheduling`,
      hesData
    );
  }

  getHesScheduling() {

    let data = {
      ownerName: localStorage.getItem('UserID')
    }
    return this.http.post(
      `${environment.apiUrl}/cfg/getHesScheduling`,
      data
    );
  }

  // addFirmware(postedFile: File, status: string, version: string, manufacturer: string) {
  //   let data = {
  //     owner: localStorage.getItem("UserID"),
  //     fileName: postedFile.name.replace(/\.[^/.]+$/, ""),
  //     status: status,
  //     version: version,
  //     manufacturer: manufacturer,
  //     imageIdentifier: postedFile.name.replace(/\.[^/.]+$/, ""),
  //   }

  //   const formData = new FormData();
  //   formData.append('firmwareFile', postedFile);
  //   formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));


  //   return this.http.post(
  //     `${environment.apiUrl}/firmware/uploadFile`,
  //     formData
  //   );
  // }
  addFirmware(postedFile: File, status: string, version: string, manufacturer: string) {
    let data = {
        owner: localStorage.getItem("UserID"),
        fileName: postedFile.name.replace(/\.[^/.]+$/, ""),
        status: status,
        version: version,
        manufacturer: manufacturer,
        imageIdentifier: postedFile.name.replace(/\.[^/.]+$/, ""),
    }
    const formData = new FormData();    
    formData.append('data', JSON.stringify(data));    
    formData.append('firmwareFile', postedFile);
    return this.http.post(
        `${environment.apiUrl}/firmware/uploadFile`,
        formData,
        {
            headers: {                
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
}
  addConfigs(levelName: string, levelValue: string, configVals: any, skipOtherManufacturer: boolean) {

    let data = {
      levelName: levelName,
      levelValue: levelValue,
      configVals: configVals,
      skipOtherManufacturer: skipOtherManufacturer
    }
    return this.http.post(
      `${environment.apiUrl}/firmware/configs/add`,
      data
    );
  }
  getFirmwareList() {
    let data = {
      owner: localStorage.getItem("UserID")
    }
    return this.http.post(
      `${environment.apiUrl}/firmware/list`,
      data
    );
  }
 getFirmwareLogs(fromdate: any, todate: any, meterNo: string) {
      if (meterNo != '') {
        this.getdata.levelName = 'METER';
        this.getdata.levelValue = meterNo;
      } else {
        this.getdata.levelName = localStorage.getItem('levelName');
        this.getdata.levelValue = localStorage.getItem('levelValue');
      }
      this.getdata.startDate = fromdate;
      this.getdata.endDate = todate; 
      return this.http.post(
        `${environment.apiUrl}/cfg/getFirmwareLogs`,
        this.getdata,
        
      );
    }

  // deleteFirmwareList(data: any) {

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       apiKey: localStorage.getItem('apikey'),
  //     }),
  //     body: data
  //   };
  //   return this.http.delete(
  //     `${environment.apiUrl}/cfg/firmware/list`
  //   );
  // }

deleteFirmwareList(data: any) {

  const token = localStorage.getItem('apikey');
  const ownerName = localStorage.getItem('UserID');   
  if (!token) {
      return throwError(() => new Error('Authentication token is missing'));
  }
  if (!ownerName) {
      return throwError(() => new Error('Owner name is missing'));
  }
  const requestData =[{
      owner: ownerName,  
      fileName: data.fileName
  }];
return this.http.request('DELETE', 
      `${environment.apiUrl}/firmware/list`, 
      {
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/plain, */*',
              'Authorization': `Bearer ${token}`
          }),
          body: requestData
      }
  );
}

  // updateFirmwareList(data: any) {
  //   let dataList = [
  //     {
  //       owner: data.owner,
  //       status: data.status,
  //       version: data.version,
  //       manufacturer: data.manufacturer,
  //       fileName: data.fileName,
  //       imageIdentifier: data.imageIdentifier
  //     }
  //   ]

  //   return this.http.put(
  //     `${environment.apiUrl}/firmware/list`,
  //     dataList
  //   );

  // }
//   updateFirmwareList(data: any) {
//     const token = localStorage.getItem('apikey');
    
//     if (!token) {
//         console.error('No token found');
//         return throwError(() => new Error('Authentication token is missing'));
//     }

//     // Format data to match the expected payload
//     const requestData = [{
//         status: data.status,
//         version: data.version,
//         manufacturer: data.manufacturer,
//         fileName: data.fileName,
//         imageIdentifier: data.fileName // Using same as fileName as per your example
//     }];

//     console.log('Update request data:', requestData);

//     return this.http.put(
//         `${environment.apiUrl}/cfg/firmware/list`,
//         requestData,
//         {
//             headers: new HttpHeaders({
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json, text/plain, */*',
//                 'Authorization': `Bearer ${token}`
//             })
//         }
//     );
// }
updateFirmwareList(data: any) {
  const ownerName = localStorage.getItem('UserID');
  const dataList = [{
      owner: ownerName, 
      status: data.status,
      version: data.version,
      manufacturer: data.manufacturer,
      fileName: data.fileName,
      imageIdentifier: data.imageIdentifier
  }];
  
  return this.http.put(
      `${environment.apiUrl}/firmware/list`,
      dataList
  );
}
  getFullConfigLog(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.levelName = 'METER';
      this.getdata.levelValue = meterNo;
    } else {
      this.getdata.levelName = localStorage.getItem('levelName');
      this.getdata.levelValue = localStorage.getItem('levelValue');
    }
    this.getdata.startDate = fromdate;
    this.getdata.endDate = todate;

    return this.http.post(
      `${environment.apiUrl}/cfg/getFullConfigLogs`,
      this.getdata
    );
  }
}
