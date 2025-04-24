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
  //git working

  getInstantData(fromdate: any, todate: any, meterNo: string) {
    if (meterNo != '') {
      this.getdata.levelName = 'METER';
      this.getdata.levelValue = meterNo;
    } else {
      this.getdata.levelName = localStorage.getItem('levelName');
      this.getdata.levelValue = localStorage.getItem('levelValue');
    }
    this.getdata.startDate = fromdate;
    this.getdata.endDate = todate;
    // Add devType from localStorage or default to '3P'
    this.getdata.devType = localStorage.getItem('devType') || '3P';

    return this.http.post(
      `${environment.apiUrl}/instant/getUiInstantData`,
      this.getdata
    );
  }
  getMeterStatusLogData(fromdate: any, todate: any, meterNo: string) {
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
      `${environment.apiUrl}/Reports/getMeterStatusCommandLogs/` + ``,
      this.getdata
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

    return this.http.post(
      `${environment.apiUrl}/Reports/getMeterStatus/` + ``,
      body
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

    return this.http.post(`${environment.apiUrl}/devices/getNamePlate`, body);
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

    return this.http.post(
      `${environment.apiUrl}/instant/getRecentInstantData`,
      this.getrecentdata
    );
  }

  getConfigrationReportData(fromdate: any, todate: any, meterNo: string) {
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
      `${environment.apiUrl}/cfg/getConfigurations`,
      this.getdata
    );
  }

  getAllCommandLogs(fromdate: any, todate: any, meterNo: string) {
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
      `${environment.apiUrl}/cfg/getFullDataCommandLogs`,
      this.getdata
    );
  }

  getCommandLogData(fromdate: any, todate: any, meterNo: string) {
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
      `${environment.apiUrl}/cfg/getCommandsLogs`,
      this.getdata
    );
  }
  getCommandLogChartData(fromdate: any, todate: any, commandname: string) {
    this.logdata.levelName = localStorage.getItem('levelName');
    this.logdata.levelValue = localStorage.getItem('levelValue');
    this.logdata.startDate = fromdate;
    this.logdata.endDate = todate;
    //this.logdata.commandName = commandname;

    return this.http.post(
      `${environment.apiUrl}/cfg/getDeviceCommandLogsCount`,
      this.logdata
    );
  }

  getInstantPushData(fromdate: any, todate: any, meterNo: string) {
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
      `${environment.apiUrl}/instant/getInstantPushData`,
      this.getdata
    );
  }

  getDailyLoadProfileData(fromdate: any, todate: any, meterNo: string) {
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
      `${environment.apiUrl}/daily/getDailyLoadProfileData`,
      this.getdata
    );
  }

  getEventData(fromdate: any, todate: any, meterNo: string) {
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
      `${environment.apiUrl}/events/getEventData`,
      this.getdata
    );
  }

  getEventPushData(fromdate: string, todate: string, meterNo: string) {
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
      `${environment.apiUrl}/events/getEventDataPush`,
      this.getdata
    );
  }

  getLoadProfileData(fromdate: string, todate: string, meterNo: string) {
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
      `${environment.apiUrl}/delta/getLoadProfileData`,
      this.getdata
    );
  }

  getBillingData(fromdate: string, todate: string, meterNo: string) {
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
      `${environment.apiUrl}/billing/getBillingData`,
      this.getdata
    );
  }

  getCurrentBillingData(fromdate: string, todate: string, meterNo: string) {
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
      `${environment.apiUrl}/currbill/getCurrentBillingData`,
      this.getdata
    );
  }

  getDevice() {
    return this.http.get(`${environment.apiUrl}/Evit/getDevice/ALL/EVIT_DELHI`);
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

    return this.http.post(
      `${environment.apiUrl}/Evit/getCommCount/`,
      this.getchart
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

    return this.http.post(
      `${environment.apiUrl}/Evit/getCommCount/`,
      this.getchart
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

    return this.http.post(
      `${environment.apiUrl}/devices/getMetersCommCount`,
      bodyData

    );
  }


  getCommReportChartData(levelname: string, levelvalue: string) {
    let bodyData = {
      levelName: levelname,
      levelValue: levelvalue,
    };

    return this.http.post(
      `${environment.apiUrl}/Evit/getDeviceDatasetsComm`,
      bodyData
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

    return this.http.post(
      `http://115.124.114.201:8080/sla/rest/Evit/getSLAData`,
      bodyData
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

    return this.http.post(
      `http://115.124.114.201:8080/sla2/rest/Evit/getMonthlySLANew`,
      // `https://meghasmarts.com:8443/sla1/rest/Evit/getMonthlySLA`,
      bodyData
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

    return this.http.post(
      `http://115.124.119.161:8069/api/MonthSla/getMonthlySLA`,
      bodyData
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

    return this.http.post(
      `http://115.124.119.161:5065/api/SystemCheck`,
      bodyData
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
    return this.http.get(`${environment.slaH}/api/MonthSla/get-all-sla-data`);
  }
  getDashboardChartList(
    commandType: string,
    status: string,
    date: string,
    dropdownvalue: string,
    meterType: string
  ) {
    debugger;
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

    return this.http.post(
      `${environment.apiComUrl}/devices/getCommCountDevicesList`,
      this.getchartstatus
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

    return this.http.post(
      `${environment.apiComUrl}/devices/getCommCountDevicesList`,
      this.getchartstatus
    );
  }
}
