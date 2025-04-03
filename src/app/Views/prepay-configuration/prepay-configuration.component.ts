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
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-prepay-configuration',
  templateUrl: './prepay-configuration.component.html',
  styleUrls: ['./prepay-configuration.component.scss'],
})
export class PrepayConfigurationComponent implements OnInit {
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
  iswritepermission: string;



  PaymentMode: string;
  CurrentBalanceAmount: string = '';
  TotalAmountAtLastRecharge: string = '';
  LastTokenRechargeTime: string = '';
  LastTokenRechargeAmount: string = '';
  CurrentBalanceTime: string = '';



  CurrentBalanceAmountCheck: boolean = false;
  TotalAmountAtLastRechargeCheck: boolean = false;
  LastTokenRechargeTimeCheck: boolean = false;
  LastTokenRechargeAmountCheck: boolean = false;
  CurrentBalanceTimeCheck: boolean = false;
  PaymentModeCheck: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private subdivisionservice: SubDivisionService,
    private substation: SubStationService,
    private feeder: FeederService,
    private dtservice: DTService,
    private authservice: AuthService,
    private router: Router,
    private ondemmand: OnDemandService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.formdata.roleID = '6';

    // this.getUtility();
    this.formdata.accessOwner = localStorage.getItem('UserID');
    this.iswritepermission = localStorage.getItem('WriteAccess');
  }

  // getUtility() {
  //   //this.spinner.show();
  //   this.subdivisionservice.getUtility().subscribe((res: any) => {
  //     if (res != null && res.message != 'Key Is Not Valid') {
  //       this.spinner.hide();
  //       this.UtilityDropdown = [];
  //       if (res.data != null) {
  //         let obj = res.data[0];
  //         for (var item in obj) {
  //           this.UtilityDropdown.push(obj[item][0]);
  //         }
  //       }
  //     } else {
  //       this.spinner.hide();
  //       this.logout();
  //     }
  //   });
  // }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  getSubdivision() {
    this.spinner.show();

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

          this.logout();
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
    this.getSubdivision();
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
    }
    else if (accessvalue == 6) {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = true;
    }
    else {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = false;
    }
  }

  changeUtility() {
    if (this.isSubdivision) {
      this.getSubdivision();
    }
  }
  onSubmitAll() {

    if (this.CurrentBalanceAmountCheck && this.CurrentBalanceAmount == "")
      this.toaster.error('Please Enter Current Balance Amount');

    else if (this.CurrentBalanceTimeCheck && this.CurrentBalanceTime == "")
      this.toaster.error('Please Enter Current Balance Time');
    else if (this.LastTokenRechargeAmountCheck && this.LastTokenRechargeAmount == "")
      this.toaster.error('Please Enter Last Recharge Amount');
    else if (this.LastTokenRechargeTimeCheck && this.LastTokenRechargeTime == "")
      this.toaster.error('Please Enter Last Recharge Time');
    else if (this.TotalAmountAtLastRechargeCheck && this.TotalAmountAtLastRecharge == "")
      this.toaster.error('Please Enter Total Amount');
    else if (this.PaymentMode && this.PaymentMode == "")
      this.toaster.error('Please Selcet Payment Mode');
    else {
      this.getLevelValue();
      let dataBody = {};
      if (this.CurrentBalanceAmountCheck)
        dataBody['CurrentBalanceAmount'] = this.CurrentBalanceAmount;
      if (this.CurrentBalanceTimeCheck)
        dataBody['CurrentBalanceTime'] = this.datePipe.transform(this.CurrentBalanceTime, 'yyyy-MM-dd HH:mm:ss');
      if (this.LastTokenRechargeAmountCheck)
        dataBody['LastTokenRechargeAmount'] = this.LastTokenRechargeAmount;
      if (this.LastTokenRechargeTimeCheck)
        dataBody['LastTokenRechargeTime'] = this.datePipe.transform(this.LastTokenRechargeTime, 'yyyy-MM-dd HH:mm:ss');
      if (this.TotalAmountAtLastRechargeCheck)
        dataBody['TotalAmountAtLastRecharge'] = this.TotalAmountAtLastRecharge;
        if (this.PaymentModeCheck)
        dataBody['PaymentMode'] = this.PaymentMode;
      this.ondemmand
        .executeMultipleCommandForConfiguration(
          dataBody,
          this.levelName,
          this.levelValue
        )
        .subscribe((res: any) => {
          this.spinner.hide();

          if (res.data != null) {

            this.toaster.success(res.data[0].status);
          } else {
            this.toaster.success('Something went wrong !!');
          }
        },
          (err) => {
            this.spinner.hide();
            this.toaster.error('Oops! Something Went Wrong.');
          })
    }
  }
  onSubmit(command: string) {
    this.spinner.show();
    this.getLevelValue();
    let commandValue;
    if (command == 'CurrentBalanceAmount') {
      commandValue = this.CurrentBalanceAmount;
    } else if (command == 'PaymentMode') {
      commandValue = this.PaymentMode;
    }
    else if (command == 'TotalAmountAtLastRecharge') {
      commandValue = this.TotalAmountAtLastRecharge;
    }
    else if (command == 'LastTokenRechargeTime') {
      commandValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd'); this.LastTokenRechargeTime;
    }
    else if (command == 'LastTokenRechargeAmount') {
      commandValue = this.LastTokenRechargeAmount;
    }
    else if (command == 'CurrentBalanceTime') {
      commandValue = this.datePipe.transform(this.CurrentBalanceTime, 'yyyy-MM-dd HH:mm:ss');
    }
    this.ondemmand
      .executeCommandForConfiguration(
        command,
        commandValue,
        this.levelName,
        this.levelValue
      )
      .subscribe((res: any) => {
        this.spinner.hide();

        if (res.data != null) {
          if (res.data == true) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.success('Something went wrong !!');
          }
        }
      },
        (err) => {
          this.spinner.hide();
          this.toaster.error('Oops! Something Went Wrong.');
        })
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
}
