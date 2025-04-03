import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootObject } from './responsemodel';
import { catchError, map, tap } from 'rxjs/operators';
import {
  LogDatas,
  MeterData,
  MeterDatas,
  RecentInstantData,
} from '../Models/meter-data';

import { DashboardCharts } from '../Models/dashboard-charts';
import { DatePipe } from '@angular/common';
import { DashBoardChartStatus } from '../Models/dash-board-chart-status';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apikey: any;

  getdata: MeterDatas = new MeterDatas();
  getrecentdata: RecentInstantData = new RecentInstantData();
  logdata: LogDatas = new LogDatas();
  getchart: DashboardCharts = new DashboardCharts();
  getchartstatus: DashBoardChartStatus = new DashBoardChartStatus();
  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getInstantData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All' || meterPhase == 'Evit') {
      meterPhase = 'Evit';
    } else {
      meterPhase = 'Evit3P';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getInstantData/` + ``,
      this.getdata,
      httpOptions
    );
  }
  getMeterStatusLogData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All') {
      meterPhase = 'Evit';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/getMeterStatusCommandLogs/` + ``,
      this.getdata,
      httpOptions
    );
  }
  getMeterStatusData(meterNo: string) {
    let body;
    if (meterNo != '') {
      body = {
        level_name: 'METER',
        level_value: meterNo,
      };
    } else {
      body = {
        level_name: localStorage.getItem('levelName'),
        level_value: localStorage.getItem('levelValue'),
      };
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/getMeterStatus/` + ``,
      body,
      httpOptions
    );
  }

  getNamePlate(meterNo: string) {
    let body = {
      levelName: '',
      levelValue: '',
    };
    if (meterNo != '') {
      body = {
        levelName: 'METER',
        levelValue: meterNo,
      };
    } else {
      body = {
        levelName: localStorage.getItem('levelName'),
        levelValue: localStorage.getItem('levelValue'),
      };
    }

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All') {
      meterPhase = 'Evit';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getNamePlate/` + ``,
      body,
      httpOptions
    );
  }

  getReturnInstantData(todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getrecentdata.levelName = 'METER';
      this.getrecentdata.levelValue = meterNo;
    } else {
      this.getrecentdata.levelName = localStorage.getItem('levelName');
      this.getrecentdata.levelValue = localStorage.getItem('levelValue');
    }

    this.getrecentdata.date = todate;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getRecentInstantData/` + ``,
      this.getrecentdata,
      httpOptions
    );
  }

  getConfigrationReportData(fromdate: any, todate: any) {
    this.getdata.level_name = localStorage.getItem('levelName');
    this.getdata.level_value = localStorage.getItem('levelValue');
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/getConfigurations`,
      this.getdata,
      httpOptions
    );
  }

  getAllCommandLogs(fromdate: any, todate: any) {
    this.getdata.level_name = localStorage.getItem('levelName');
    this.getdata.level_value = localStorage.getItem('levelValue');
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/getFullDataCommandLogs`,
      this.getdata,
      httpOptions
    );
  }

  getCommandLogData(fromdate: any, todate: any) {
    this.getdata.level_name = localStorage.getItem('levelName');
    this.getdata.level_value = localStorage.getItem('levelValue');
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/getCommandsLogs`,
      this.getdata,
      httpOptions
    );
  }

  getCommandLogChartData(fromdate: any, todate: any, commandname: string) {
    this.logdata.levelName = localStorage.getItem('levelName');
    this.logdata.levelValue = localStorage.getItem('levelValue');
    this.logdata.startDate = fromdate;
    this.logdata.endDate = todate;
    //this.logdata.commandName = commandname;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Reports/getDeviceCommandLogsCount`,
      this.logdata,
      httpOptions
    );
  }

  getInstantPushData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }

    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All') {
      meterPhase = 'Evit';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getInstantPushData/` + ``,
      this.getdata,
      httpOptions
    );
  }

  getDailyLoadProfileData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;
    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All' || meterPhase == 'Evit') {
      meterPhase = 'Evit';
    } else {
      meterPhase = 'Evit3P';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getDailyLoadProfileData/` + ``,
      this.getdata,
      httpOptions
    );
  }

  getEventData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All' || meterPhase == 'Evit') {
      meterPhase = 'Evit';
    } else {
      meterPhase = 'Evit3P';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getEventData` + ``,
      this.getdata,
      httpOptions
    );
  }

  getEventPushData(fromdate: string, todate: string, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All') {
      meterPhase = 'Evit';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getEventDataPush/` + ``,
      this.getdata,
      httpOptions
    );
  }

  getLoadProfileData(fromdate: string, todate: string, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }

    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;

    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All' || meterPhase == 'Evit') {
      meterPhase = 'Evit';
    } else {
      meterPhase = 'Evit3P';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getLoadProfileData/` + ``,
      this.getdata,
      httpOptions
    );
  }

  getBillingData(fromdate: string, todate: string, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;
    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All' || meterPhase == 'Evit') {
      meterPhase = 'Evit';
    } else {
      meterPhase = 'Evit3P';
    }

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getBillingData/` + ``,
      this.getdata,
      httpOptions
    );
  }

  getCurrentBillingData(fromdate: string, todate: string, meterNo: string) {
    if (meterNo != '') {
      this.getdata.level_name = 'METER';
      this.getdata.level_value = meterNo;
    } else {
      this.getdata.level_name = localStorage.getItem('levelName');
      this.getdata.level_value = localStorage.getItem('levelValue');
    }
    this.getdata.start_date = fromdate;
    this.getdata.end_date = todate;
    let meterPhase = sessionStorage.getItem('MeterPhase');

    if (meterPhase == null || meterPhase == 'All' || meterPhase == 'Evit') {
      meterPhase = 'Evit';
    } else {
      meterPhase = 'Evit3P';
    }
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/` + meterPhase + `/getCurrentBillingData/` + ``,
      this.getdata,
      httpOptions
    );
  }

  getDevice() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getDevice/ALL/EVIT_DELHI`,
      httpOptions
    );
  }

  getSubdivisionData() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getSubdivisionList/SUBDEVISION/SUBD_DEL_01/2021-03-03/2023-03-14`,
      httpOptions
    );
  }

  getSubstationData() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getSubstationList/SUBDEVISION/SUBD_DEL_01/2021-03-03/2023-03-14`,
      httpOptions
    );
  }

  getFeederData() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getFeederList/SUBDEVISION/SUBD_DEL_01/2021-03-03/2023-03-14`,
      httpOptions
    );
  }

  getDTData() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.apiUrl}/Evit/getDtTransList/SUBDEVISION/SUBD_DEL_01/2021-03-03/2023-03-14`,
      httpOptions
    );
  }

  getDashboardChart(commandType: any, date: string, meterPhase: string) {
    switch (meterPhase) {
      case 'All':
        this.getchart.devType = 'All';
        break;
      case 'Evit':
        this.getchart.devType = 'All';
        break;
      case 'Evit3P':
        this.getchart.devType = 'All';
        break;
      default:
        this.getchart.devType = 'All';
        break;
    }
    this.getchart.levelName = localStorage.getItem('levelName');
    this.getchart.levelValue = localStorage.getItem('levelValue');
    this.getchart.commandType = commandType;
    this.getchart.startDate = date;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getCommCount/`,
      this.getchart,
      httpOptions
    );
  }
  getDashboardChartForCommReport(
    commandType: any,
    date: string,
    levelName: string,
    levelValue: string,
    meterPhase: string
  ) {
    switch (meterPhase) {
      case 'All':
        this.getchart.devType = 'All';
        break;
      case 'Evit':
        this.getchart.devType = 'All';
        break;
      case 'Evit3P':
        this.getchart.devType = 'All';
        break;
      default:
        this.getchart.devType = 'All';
        break;
    }
    this.getchart.levelName = levelName;
    this.getchart.levelValue = levelValue;
    this.getchart.commandType = commandType;
    this.getchart.startDate = date;
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getCommCount/`,
      this.getchart,
      httpOptions
    );
  }
  getDashboardChartComman(meterPhase: string) {
    let devType;
    switch (meterPhase) {
      case 'All':
        devType = 'All';
        break;
      case 'Evit':
        devType = 'Single Phase';
        break;
      case 'Evit3P':
        devType = 'Three Phase';
        break;
      case 'Evit3P1':
        devType = 'CT Meter';
        break;
      case 'EvitHT':
        devType = 'HT Meter';
        break;
      default:
        devType = 'All';
        break;
    }
    let bodyData = {
      levelValue: localStorage.getItem('levelValue'),
      devType: devType,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getMetersCommCount/`,
      bodyData,
      httpOptions
    );
  }
  getCommReportChartData(levelname: string, levelvalue: string) {
    let bodyData = {
      levelName: levelname,
      levelValue: levelvalue,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.apiUrl}/Evit/getDeviceDatasetsComm`,
      bodyData,
      httpOptions
    );
  }

  // new func
  getCommReportChartData1(
    levelname: string,
    levelvalue: string,
    startdate: string,
    enddate: string
  ) {
    let bodyData = {
      level_name: levelname,
      level_value: levelvalue,
      start_date: startdate,
      end_date: enddate,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `https://meghasmarts.com:8443/sla/rest/Evit/getSLAData`,
      bodyData,
      httpOptions
    );
  }

  //sla history
  getSLAReportHistoryData(
    levelname: string,
    levelvalue: string,
    startdate: string,
    enddate: string
  ) {
    let bodyData = {
      level_name: levelname,
      level_value: levelvalue,
      start_date: startdate,
      end_date: enddate,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      // `https://meghasmarts.com:8443/sla2/rest/Evit/getMonthlySLANew`,
      `https://meghasmarts.com:8443/dlms1/rest/Evit/getMonthlySLANew`,
      bodyData,
      httpOptions
    );
  }
  //sla history by rajneesh
  getSLAReportHistoryData1(
    levelname: string,
    levelvalue: string,
    startdate: string,
    enddate: string
  ) {
    let bodyData = {
      level_name: levelname,
      level_value: levelvalue,
      start_date: startdate,
      end_date: enddate,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `http://115.124.119.161:8069/api/MonthSla/getMonthlySLA`,
      bodyData,
      httpOptions
    );
  }

  getSystemLog(
    levelname: string,
    levelvalue: string,
    startdate: string,
    enddate: string
  ) {
    let bodyData = {
      level_name: levelname,
      level_value: levelvalue,
      start_date: startdate,
      end_date: enddate,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `http://115.124.119.161:5065/api/SystemCheck`,
      bodyData,
      httpOptions
    );
  }

  getSLAReportHistoryData4() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.slaH}/api/MonthSla/get-all-sla-data`,
      httpOptions
    );
  }

  getSLAReportHistoryData3() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.get(
      `${environment.slaH}/api/MonthSla/get-all-sla-data`,
      httpOptions
    );
  }
  getDashboardChartList(
    commandType: string,
    status: string,
    date: string,
    dropdownvalue: string,
    meterType: string
  ) {
    if (commandType == 'Billing') {
      let month_year;

      if (dropdownvalue == 'Yesterday' || dropdownvalue == 'Last Week') {
        month_year = this.datePipe.transform(new Date(), 'yyyy-MM');
      } else if (dropdownvalue == 'Last Month') {
        month_year = this.datePipe.transform(new Date(date), 'yyyy-MM');
        date = month_year + '-01';
      } else if (dropdownvalue == 'Today' || dropdownvalue == '')
        date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }

    this.getchartstatus.commandType = commandType;
    this.getchartstatus.status = status;
    this.getchartstatus.levelName = localStorage.getItem('levelName');
    this.getchartstatus.levelValue = localStorage.getItem('levelValue');
    this.getchartstatus.startDate = date;
    this.getchartstatus.meterType = meterType;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiComUrl}/Evit/getCommCountDevicesList/`,
      this.getchartstatus,
      httpOptions
    );
  }
  getDashboardChartListForCommReport(
    commandType: string,
    status: string,
    date: string,
    dropdownvalue: string,
    levelname: string,
    levelvalue: string,
    meterType: string
  ) {
    if (commandType == 'Billing') {
      let month_year;

      if (dropdownvalue == 'Yesterday' || dropdownvalue == 'Last Week') {
        month_year = this.datePipe.transform(new Date(), 'yyyy-MM');
      } else if (dropdownvalue == 'Last Month') {
        month_year = this.datePipe.transform(new Date(date), 'yyyy-MM');
        date = month_year + '-01';
      } else if (dropdownvalue == 'Today' || dropdownvalue == '')
        date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    let devType;
    switch (sessionStorage.getItem('MeterPhase')) {
      case 'All':
        devType = 'All';
        break;
      case 'Evit':
        devType = 'Single Phase';
        break;
      case 'Evit3P':
        devType = 'Three Phase';
        break;
      case 'Evit3P1':
        devType = 'CT Meter';
        break;
      case 'EvitHT':
        devType = 'HT Meter';
        break;
      default:
        devType = 'All';
        break;
    }
    this.getchartstatus.commandType = commandType;
    this.getchartstatus.status = status;
    (this.getchartstatus.levelName = levelname),
      (this.getchartstatus.levelValue = levelvalue);
    this.getchartstatus.startDate = date;
    this.getchartstatus.meterType = devType;

    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(
      `${environment.apiComUrl}/Evit/getCommCountDevicesList/`,
      this.getchartstatus,
      httpOptions
    );
  }
}
