import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DashBoardChartStatus } from '../Models/dash-board-chart-status';
import { DashboardCharts } from '../Models/dashboard-charts';
import { MeterDatas, RecentInstantData, LogDatas } from '../Models/meter-data';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Correct import for operators

@Injectable({
  providedIn: 'root'
})
export class MeterreportService {
  apikey: any;

  getdata: MeterDatas = new MeterDatas();
  getrecentdata: RecentInstantData = new RecentInstantData();
  logdata: LogDatas = new LogDatas();
  getchart: DashboardCharts = new DashboardCharts();
  getchartstatus: DashBoardChartStatus = new DashBoardChartStatus();

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getMeterReport(payload: any) {
    const apiKey = localStorage.getItem('apikey') || ''; // Retrieve the API key
    if (!apiKey) {
      console.error('API Key is missing or invalid'); // Log if the API key is missing
      return throwError(() => new Error('API Key is missing or invalid')); // Updated throwError syntax
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // Ensure Content-Type is set
        apiKey: apiKey, // Ensure apiKey is not null
      }),
    };

    console.log('API Key being sent:', apiKey); // Log the API key
    console.log('Payload being sent:', JSON.stringify(payload, null, 2)); // Log the payload in a readable format
    console.log('Headers being sent:', httpOptions.headers); // Log the headers

    return this.http.post(
      `${environment.apiBaseUrl}/Evit/getLastCommDevicesList`, // Use environment variable for base URL
      payload, // Ensure payload is sent as an object
      httpOptions
    ).pipe(
      tap((response) => console.log('API Response:', response)), // Log the API response
      catchError((error) => {
        console.error('API Error:', error); // Log any errors
        return throwError(() => error); // Updated throwError syntax
      })
    );
  }
}
