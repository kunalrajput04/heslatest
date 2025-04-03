import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { HesSetting } from 'src/app/Models/hes-setting';
import { IHesSetting } from 'src/app/Models/ihes-setting';
import { UserCreate } from 'src/app/Models/user-create';
import { AuthService } from 'src/app/Services/auth.service';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DTService } from 'src/app/Services/dt.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { OnDemandService } from 'src/app/Services/on-demand.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';

@Component({
  selector: 'app-hes-setting',
  templateUrl: './hes-setting.component.html',
  styleUrls: ['./hes-setting.component.scss'],
})
export class HesSettingComponent implements OnInit {
  hescommand: IHesSetting = {
    FBilling: '15 min',
    FConfiguration: '15 min',
    FDailyLoadProfile: '15 min',
    FEvents: '15 min',
    FInstantData: '15 min',
    FLoadProfile: '15 min',
    FRTCSynchronization: '15 min',
    ownerName: localStorage.getItem('UserID'),
    RBilling: 1,
    RConfiguration: 1,
    RDailyLoadProfile: 1,
    REvents: 1,
    RInstantData: 1,
    RLoadProfile: 1,
    RRTCSynchronization: 1,
    SBilling: '',
    SConfiguration: '',
    SDailyLoadProfile: '',
    SEvents: '',
    SInstantData: '',
    SLoadProfile: '',
    SRTCSynchronization: '',
    updatedDatetime: ''

  }
  data: Headernavigation = {
    firstlevel: 'Settings',
    menuname: 'Hes Settings',
    url: '/hessetting',
  };

  iswritepermission: string;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private ondemmand: OnDemandService,
    private toaster: ToastrService,
    private datePipe: DatePipe,

    private datasharedservice: DataSharedService
  ) {
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.iswritepermission = localStorage.getItem('WriteAccess');
    this.getHesSettings();
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }
  getHesSettings() {
    this.spinner.show();
    this.ondemmand
      .getHesScheduling()
      .subscribe((res: any) => {
        
        this.spinner.hide();
        if (res != null && res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired') {
          if (res.data != null) {
            this.hescommand = {
              FBilling: res.data.dataFrequency['Billing'],
              FConfiguration: res.data.dataFrequency['Configuration'],
              FDailyLoadProfile: res.data.dataFrequency['Daily Load Profile'],
              FEvents: res.data.dataFrequency['Events'],
              FInstantData: res.data.dataFrequency['Instant Data'],
              FLoadProfile: res.data.dataFrequency['Load Profile'],
              FRTCSynchronization: res.data.dataFrequency['RTC Synchronization'],
              ownerName: localStorage.getItem('UserID'),
              RBilling: res.data.retry['Billing'],
              RConfiguration: res.data.retry['Configuration'],
              RDailyLoadProfile: res.data.retry['Daily Load Profile'],
              REvents: res.data.retry['Events'],
              RInstantData: res.data.retry['Instant Data'],
              RLoadProfile: res.data.retry['Load Profile'],
              RRTCSynchronization: res.data.retry['RTC Synchronization'],
              SBilling: res.data.startTime['Billing'],
              SConfiguration: res.data.startTime['Configuration'],
              SDailyLoadProfile: res.data.startTime['Daily Load Profile'],
              SEvents: res.data.startTime['Events'],
              SInstantData: res.data.startTime['Instant Data'],
              SLoadProfile: res.data.startTime['Load Profile'],
              SRTCSynchronization: res.data.startTime['RTC Synchronization'],
              updatedDatetime: res.data['updatedDatetime'],
            }
          }
        }
        else {

          this.logout();
        }

      });


  }
  onSubmit() { 
    
    this.hescommand.updatedDatetime= this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.spinner.show();
    this.ondemmand
      .addHesScheduling(this.hescommand)
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res.data != null) {
          if (res.data == true) {
            this.toaster.success('Scheduling done will effect after service restart');
          } else {
            this.toaster.success('Something went wrong !!');
          }
        }
      });


  }
}
