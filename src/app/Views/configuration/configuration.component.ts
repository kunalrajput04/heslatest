import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { UserCreate } from 'src/app/Models/user-create';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { DTService } from 'src/app/Services/dt.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { OnDemandService } from 'src/app/Services/on-demand.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  currentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
  isAsync = false;
  formdata: UserCreate = new UserCreate();
  UtilityDropdown: any[] = [];
  SubDivisionDropdown: any[] = [];
  SubStationDropdown: any[] = [];
  FeederDropdown: any[] = [];
  DTDropdown: any[] = [];
  isSubdivision: boolean = false;
  isSubstation: boolean = false;
  isFeeder: boolean = false;
  isDT: boolean = false;
  levelName: string = '';
  levelValue: string = '';
  isMeter: boolean = true;
  demandIntegration: string = '900';
  loadLimit: string = '';
  meteringMode: string = '';
  profileCaptured: string = '900';
  enableDisableDisconnectControl: string = '0';
  CoverOpen: string = 'Y';
  AlertIPPush: string = '[2400:5300:1::711]:4059';
  InstantIPPush: string = '[2400:5300:1::711]:4059';
  ActivitySchedulePush: string = '00:31:00,06:30:00,12:30:00,18:30:00';
  iswritepermission: string;
  data: Headernavigation = {
    firstlevel: 'Settings',
    menuname: 'Configuration',
    url: '/Configuration',
  };

  BillingDatesValue: string = '';
  todTime: string;
  todDate: string;
  forOnDemandConfig: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private subdivisionservice: SubDivisionService,
    private substation: SubStationService,
    private feeder: FeederService,
    private dtservice: DTService,

    private router: Router,
    private ondemmand: OnDemandService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService
  ) {
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.formdata.roleID = '6';
    this.formdata.accessOwner = localStorage.getItem('UserID');
    this.iswritepermission = localStorage.getItem('WriteAccess');
  }

  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  getSubdivision() {
    this.spinner.show()
    this.subdivisionservice
      .getSubdivisionForRegistration(this.formdata.accessOwner)
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          this.SubDivisionDropdown = [];
          let obj = res.data[0];

          for (var item in obj) {
            this.SubDivisionDropdown.push(obj[item][0]);
          }

        }
        else {

          
        }
      });
  }

  getSubstation() {
    this.spinner.show();
    this.substation
      .getSubstationBySubdivision(this.formdata.accessSubdivision)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.SubStationDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.SubStationDropdown.push(obj[item][0]);
          }
        }
      });
  }

  getFeeder() {
    this.spinner.show();
    this.feeder
      .getFeederBySubstation(this.formdata.accessSubStation)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.FeederDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.FeederDropdown.push(obj[item][0]);
          }
        }
      });
  }
  getDT() {
    this.spinner.show();
    this.dtservice
      .getDTByFeeder(this.formdata.accessFeeder)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.DTDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.DTDropdown.push(obj[item][0]);
          }
        }
      });
  }

  changeAccessLevel(accessvalue: number) {
    this.getSubdivision()
    if (accessvalue == 2) {
      this.isSubdivision = true;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = false;
    } else if (accessvalue == 3) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = false;
    } else if (accessvalue == 4) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = false;
      this.isMeter = false;
    } else if (accessvalue == 5) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = true;
      this.isMeter = false;
    } else if (accessvalue == 6) {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = true;

    } else {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = false;
    }
  }
  getLevelValue() {
    if (this.formdata.roleID == '1') {
      this.levelName = 'All';
      this.levelValue = this.formdata.accessOwner;
    } else if (this.formdata.roleID == '2') {
      this.levelName = 'SUBDEVISION';
      this.levelValue = this.formdata.accessSubdivision;
    } else if (this.formdata.roleID == '3') {
      this.levelName = 'SUBSTATION';
      this.levelValue = this.formdata.accessSubStation;
    } else if (this.formdata.roleID == '4') {
      this.levelName = 'FEEDER';
      this.levelValue = this.formdata.accessFeeder;
    } else if (this.formdata.roleID == '5') {
      this.levelName = 'DT';
      this.levelValue = this.formdata.accessDT;
    }
    else if (this.formdata.roleID == '6') {
      this.levelName = 'METER';
      this.levelValue = this.formdata.designation;
    }
  }
  changeUtility() {
    if (this.isSubdivision) {
      this.getSubdivision();
    }
  }
  onSubmit(command: string) {
    this.spinner.show();
    this.getLevelValue();
    let commandValue;
    if (command == 'RTCClock') {
      commandValue = '';
    } else if (command == 'DemandIntegrationPeriod') {
      commandValue = this.demandIntegration;
    } else if (command == 'LoadLimit') {
      commandValue = this.loadLimit;
    } else if (command == 'MeteringMode') {
      commandValue = this.meteringMode;
    } else if (command == 'ProfileCapturePeriod') {
      commandValue = this.profileCaptured;
    } else if (command == 'EnableDisableDisconnectControl') {
      commandValue = this.enableDisableDisconnectControl;
    } else if (command == 'CoverOpen') {
      commandValue = this.CoverOpen;
    }
    else if (command == 'AlertIPPush') {
      commandValue = this.AlertIPPush;
    }
    else if (command == 'ActivitySchedulePush') {
      commandValue = this.ActivitySchedulePush;
    }
    else if (command == 'InstantIPPush') {
      commandValue = this.InstantIPPush;
    }
    else if (command == 'MdReset') {
      commandValue = 45;
    }
    else if (command == 'BillingDates') {
      commandValue = this.BillingDatesValue;
    }
    else if (command == 'ActivityCalendar') {
      commandValue = this.todTime + '|' + this.datePipe.transform(this.todDate, 'yyyy-MM-dd hh:mm:ss');
    }

    if (!this.forOnDemandConfig) {      
      const apiCall = this.isAsync
        ? this.ondemmand.executeCommandForConfigurationAsync(
            command,
            commandValue,
            this.levelName,
            this.levelValue
          )
        : this.ondemmand.executeCommandForConfiguration(
            command,
            commandValue,
            this.levelName,
            this.levelValue
          );

      apiCall.subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res && res.result === true) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.error('Something went wrong!');
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error('Oops! Something Went Wrong.');
        }
      });
    } else {
      
      const apiCall = this.isAsync
        ? this.ondemmand.executeOnDemandConfigAsync(
            command,
            commandValue,
            this.levelName,
            this.levelValue
          )
        : this.ondemmand.executeOnDemandConfig(
            command,
            commandValue,
            this.levelName,
            this.levelValue
          );

      apiCall.subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res && res.result === true) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.error('Something went wrong!');
          }
        }
      });
    }
  }
  // onSubmit(command: string) {
  //   this.spinner.show();
  //   this.getLevelValue();
  //   let commandValue;
  //   if (command == 'RTCClock') {
  //     commandValue = '';
  //   } else if (command == 'DemandIntegrationPeriod') {
  //     commandValue = this.demandIntegration;
  //   } else if (command == 'LoadLimit') {
  //     commandValue = this.loadLimit;
  //   } else if (command == 'MeteringMode') {
  //     commandValue = this.meteringMode;
  //   } else if (command == 'ProfileCapturePeriod') {
  //     commandValue = this.profileCaptured;
  //   } else if (command == 'EnableDisableDisconnectControl') {
  //     commandValue = this.enableDisableDisconnectControl;
  //   } else if (command == 'CoverOpen') {
  //     commandValue = this.CoverOpen;
  //   }
  //   else if (command == 'AlertIPPush') {
  //     commandValue = this.AlertIPPush;
  //   }
  //   else if (command == 'ActivitySchedulePush') {
  //     commandValue = this.ActivitySchedulePush;
  //   }
  //   else if (command == 'InstantIPPush') {
  //     commandValue = this.InstantIPPush;
  //   }
  //   else if (command == 'MdReset') {
  //     commandValue = 45;
  //   }
  //   else if (command == 'BillingDates') {
  //     commandValue = this.BillingDatesValue;
  //   }
  //   else if (command == 'ActivityCalendar') {
  //     commandValue = this.todTime + '|' + this.datePipe.transform(this.todDate, 'yyyy-MM-dd hh:mm:ss');
  //   }

  //   if (!this.forOnDemandConfig) {
  //     this.ondemmand
  //       .executeCommandForConfiguration(
  //         command,
  //         commandValue,
  //         this.levelName,
  //         this.levelValue
  //       )
  //       .subscribe({
  //         next: (res: any) => {
  //           this.spinner.hide();
  //             if (res && res.result === true) {
  //             this.toaster.success('Updated Successfully');
  //           } else {
  //             this.toaster.error('Something went wrong!');
  //           }
  //         },
  //         error: (err) => {
  //           this.spinner.hide();
  //           this.toaster.error('Oops! Something Went Wrong.');
  //         }
  //       }); 
  //   }
  //   else{
  //     this.ondemmand
  //     .executeOnDemandConfig(
  //       command,
  //       commandValue,
  //       this.levelName,
  //       this.levelValue
  //     )
  //     .subscribe({
  //       next: (res: any) => {
  //         this.spinner.hide();
  //           if (res && res.result === true) {
  //           this.toaster.success('Updated Successfully');
  //         } else {
  //           this.toaster.error('Something went wrong!');
  //         }
  //       }
  //     });   
  //   }
  // }
  // onSubmitAsync(command: string) {
  //   this.spinner.show();
  //   this.getLevelValue();
  //   let commandValue;

  //   // Reuse the same command value logic
  //   if (command == 'RTCClock') {
  //     commandValue = '';
  //   } else if (command == 'DemandIntegrationPeriod') {
  //     commandValue = this.demandIntegration;
  //   } else if (command == 'LoadLimit') {
  //     commandValue = this.loadLimit;
  //   } else if (command == 'MeteringMode') {
  //     commandValue = this.meteringMode;
  //   } else if (command == 'ProfileCapturePeriod') {
  //     commandValue = this.profileCaptured;
  //   } else if (command == 'EnableDisableDisconnectControl') {
  //     commandValue = this.enableDisableDisconnectControl;
  //   } else if (command == 'CoverOpen') {
  //     commandValue = this.CoverOpen;
  //   } else if (command == 'AlertIPPush') {
  //     commandValue = this.AlertIPPush;
  //   } else if (command == 'ActivitySchedulePush') {
  //     commandValue = this.ActivitySchedulePush;
  //   } else if (command == 'InstantIPPush') {
  //     commandValue = this.InstantIPPush;
  //   } else if (command == 'MdReset') {
  //     commandValue = 45;
  //   } else if (command == 'BillingDates') {
  //     commandValue = this.BillingDatesValue;
  //   } else if (command == 'ActivityCalendar') {
  //     commandValue = this.todTime + '|' + this.datePipe.transform(this.todDate, 'yyyy-MM-dd hh:mm:ss');
  //   }

  //   if (!this.forOnDemandConfig) {
  //     this.ondemmand
  //       .executeCommandForConfigurationAsync( 
  //         command,
  //         commandValue,
  //         this.levelName,
  //         this.levelValue
  //       )
  //       .subscribe({
  //         next: (res: any) => {
  //           this.spinner.hide();
  //           if (res && res.result === true) {
  //             this.toaster.success('Command added to queue');
  //           } else {
  //             this.toaster.error('Something went wrong!');
  //           }
  //         },
  //         error: (err) => {
  //           this.spinner.hide();
  //           this.toaster.error('Oops! Something Went Wrong.');
  //         }
  //       });
  //   } else {
  //     this.ondemmand
  //       .executeOnDemandConfigAsync( 
  //         command,
  //         commandValue,
  //         this.levelName,
  //         this.levelValue
  //       )
  //       .subscribe({
  //         next: (res: any) => {
  //           this.spinner.hide();
  //           if (res && res.result === true) {
  //             this.toaster.success('Command added to queue');
  //           } else {
  //             this.toaster.error('Something went wrong!');
  //           }
  //         }
  //       });
  //   }
  // }
}


