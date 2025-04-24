import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { ChangePassword, ILogout } from 'src/app/Models/change-password';
import { AuthService } from 'src/app/Services/auth.service';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { environment } from 'src/environments/environment';
declare let $: any;
declare let toggleMenu: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  data: Headernavigation = new Headernavigation();
  changepassword: ChangePassword = new ChangePassword();
  logoutcred: ILogout = {
    email: '',
  };
  reTypePassword: string = '';
  chartFilter = [];
  isdashboard: boolean = true;
  lastUpdatedTime: string;
  hesVersion: string;
  buildDate: string;
  meterphase: string = 'All';
  welcomemessage: string = localStorage.getItem('Welcomemsg');
  userName: string = localStorage.getItem('username');

  constructor(
    private service: AuthService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private datepipe: DatePipe
  ) {
    this.hesVersion = environment.hesVersion;
    this.buildDate = this.datepipe.transform(
      environment.buildDate,
      'dd-MM-yyyy'
    );
  }

  ngOnInit(): void {
    this.getchartFilter();
    if (sessionStorage.getItem('MeterPhase') != undefined)
      this.meterphase = sessionStorage.getItem('MeterPhase');

    this.setDevType(this.meterphase);

    let userid = localStorage.getItem('UserID');
    if (userid == 'All') {
      this.router.navigate(['/register']);
    }

    this.datasharedservice.currentheadernav.subscribe((data) => {
      this.data = data;
      if (
        this.data.menuname == 'Dashboard' ||
        this.data.menuname == 'Summary' ||
        this.data.menuname == 'Report'
      ) {
        this.isdashboard = true;
      } else {
        this.isdashboard = false;
      }
    });
    this.datasharedservice.datetimevar.subscribe((data) => {
      this.lastUpdatedTime = data;
    });
    if (this.welcomemessage == 'null') {
      this.welcomemessage = 'Welcome to Mizoram Energy Corporation Limited';
    }
  }

  myValue(value: string) {
    this.meterphase = value;
    sessionStorage.setItem('MeterPhase', value);
    this.setDevType(value);
    location.reload();
  }

  setDevType(phaseValue: string): void {
    let devType = '3P';

    if (phaseValue === 'All') {
      devType = 'All';
    } else if (phaseValue === 'Evit') {
      devType = '1P';
    }

    localStorage.setItem('devType', devType);
    console.log(`Set devType in localStorage to: ${devType}`);
  }

  logout() {
    this.logoutcred.email = localStorage.getItem('email');
    this.service.logout(this.logoutcred).subscribe((res: any) => {});

    this.datasharedservice.clearlocalStorageData(true);
  }

  changePassword(form: NgForm) {
    this.spinner.show();
    if (form.value.newPassword != form.value.reTypePassword) {
      this.spinner.hide();
      this.toaster.error('Re-Password Not Matched');
    } else {
      this.changepassword = {
        email: localStorage.getItem('email'),
        newPassword: form.value.newPassword,
        oldPassword: form.value.oldPassword,
      };

      if (form.value != null) {
        this.service
          .changePassword(this.changepassword)
          .subscribe((res: any) => {
            this.spinner.hide();
            if (
              res != null &&
              res.message != 'Key Is Not Valid' &&
              res.message != 'Session Is Expired'
            ) {
              if (res.data == false) {
                this.toaster.error('Password Not Matched');
              } else if (res.data == true) {
                this.toaster.success('Password Updated Successfully');
                $('#changepassword').modal('hide');
              }
            } else {
              alert('Oops!! something went wrong');
            }
          });
      }
    }
  }

  getchartFilter() {
    this.chartFilter = [
      { filter: 'Last Week' },
      { filter: 'Yesterday' },
      { filter: 'Today' },
      { filter: 'Last Month' },
    ];
  }

  getDashboardChart(data: string) {
    this.datasharedservice.chagneWeekDropDown(data);
  }
}
