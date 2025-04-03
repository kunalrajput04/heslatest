import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConnectDisconnect } from '../Models/connect-disconnect';
import { HesSetting } from '../Models/hes-setting';
import { IHesSetting } from '../Models/ihes-setting';
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
  configData: ConfigCommand = new ConfigCommand();
  constructor(private http: HttpClient) { }

  getConnectDisconnectDevice(): Observable<any> {
    let levelValue = localStorage.getItem('levelValue');
    let levelName = localStorage.getItem('levelName');
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getDevice1/` + levelName + `/` + levelValue,
      httpOptions
    );
  }
  getDeviceForDT(levelValue: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getDevice1/DT/` + levelValue,
      httpOptions
    );
  }
  getRTCList(levelValue: string, levelName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    let data = {
      levelName: levelName,
      levelValue: levelValue
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getClockData`, data,
      httpOptions
    );
  }
  getTODList(levelValue: string, levelName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    let data = {
      levelName: levelName,
      levelValue: levelValue
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getTODData`, data,
      httpOptions
    );
  }

  addCommand(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addCommand/`,
      this.data,
      httpOptions
    );
  }

  connectDisconnect(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/directOnMeterCmd/`,
      this.data,
      httpOptions
    );
  }

  connectDisconnectForAllLevel(Command: string, levelname: string, levelvalue: string) {
    let body = {
      commandName: Command,
      levelName: levelname,
      levelValue: levelvalue
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/meters/onDemand/`,
      body,
      httpOptions
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
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/meters/onDemand/`,
      body,
      httpOptions
    );
  }
  connectDisconnectFullData(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addCommand`,
      this.data,
      httpOptions
    );
  }
  RTCFullDataRead(levelName: string, levelValue: string) {
    let data = {
      levelName: levelName,
      levelValue: levelValue,
      command: "InstantaneousRead",
      commandsVal: ""
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addInstantCommand`,
      data,
      httpOptions
    );
  }

  addCommandForInstantRead(Command: any, DeviceSerialNo: any) {
    this.data = {
      commandName: Command,
      device: DeviceSerialNo,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addCommand/`,
      this.data,
      httpOptions
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
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/addConfigsCommand`,
      this.configData,
      httpOptions
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
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/meters/onDemandConfig`,
      body,
      httpOptions
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
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/mutiple/configsCommand/add`,
      body,
      httpOptions
    );
  }
  executeCommandForHESsettings(data: HesSetting) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/changeHESSetting`,
      data,
      httpOptions
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

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/addHesScheduling`,
      hesData,
      httpOptions
    );
  }

  getHesScheduling() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    let data = {
      ownerName: localStorage.getItem('UserID')
    }
    return this.http.post(
      `${environment.apiUrl}/Reports/getHesScheduling`,
      data,
      httpOptions
    );
  }

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
    formData.append('firmwareFile', postedFile);
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/firmware/uploadFile`,
      formData,
      httpOptions
    );
  }
  addConfigs(levelName: string, levelValue: string, configVals: any, skipOtherManufacturer: boolean) {

    let data = {
      levelName: levelName,
      levelValue: levelValue,
      configVals: configVals,
      skipOtherManufacturer: skipOtherManufacturer
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/firmware/configs/add`,
      data,
      httpOptions
    );
  }
  getFirmwareList() {
    let data = {
      owner: localStorage.getItem("UserID")
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/firmware/list`,
      data,
      httpOptions
    );
  }
  getFirmwareLogs(fromdate: any, todate: any) {
    let data = {
      level_name: localStorage.getItem('levelName'),
      level_value: localStorage.getItem('levelValue'),
      start_date: fromdate,
      end_date: todate
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/getFirmwareLogs`,
      data,
      httpOptions
    );
  }

  deleteFirmwareList(data: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
      body: data
    };
    return this.http.delete(
      `${environment.apiUrl}/firmware/list`,
      httpOptions
    );
  }
  updateFirmwareList(data: any) {
    let dataList = [
      {
        owner: data.owner,
        status: data.status,
        version: data.version,
        manufacturer: data.manufacturer,
        fileName: data.fileName,
        imageIdentifier: data.imageIdentifier
      }
    ]


    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.put(
      `${environment.apiUrl}/firmware/list`,
      dataList,
      httpOptions
    );

  }
  getFullConfigLog(fromdate: any, todate: any) {
    let data = {
      level_name: localStorage.getItem('levelName'),
      level_value: localStorage.getItem('levelValue'),
      start_date: fromdate,
      end_date: todate
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Reports/getFullConfigLogs`,
      data,
      httpOptions
    );

  }
}
