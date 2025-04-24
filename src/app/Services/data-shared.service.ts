import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Headernavigation } from '../Model/headernavigation';
import { IChartTable } from '../Models/dashboard';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataSharedService {
  constructor(private router: Router) {}

  data: Headernavigation = new Headernavigation();
  private headernav = new BehaviorSubject(this.data);
  currentheadernav = this.headernav.asObservable();

  private weekdropdown = new BehaviorSubject('Last Week');
  private clearLocalStorage = new BehaviorSubject(false);
  currentweekdropdown = this.weekdropdown.asObservable();

  private datetime = new BehaviorSubject('');
  datetimevar = this.datetime.asObservable();

  chartTable: IChartTable = {
    commandType: null,
    daytype: null,
    status: null,
  };
  private shareChartTable = new BehaviorSubject(this.chartTable);
  shareChartData = this.shareChartTable.asObservable();

  chagneHeaderNav(data: Headernavigation) {
    this.headernav.next(data);
  }
  shareChartTableFunc(data: IChartTable) {
    this.shareChartTable.next(data);
  }
  chagneWeekDropDown(data: string) {
    this.weekdropdown.next(data);
  }
  lastUpdatedTime(data: string) {
    this.datetime.next(data);
  }
  clearlocalStorageData(data: boolean) {
    if (data) {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
