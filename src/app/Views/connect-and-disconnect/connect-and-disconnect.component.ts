import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { FormControl } from '@angular/forms';

import { ConnectDisconnect } from 'src/app/Models/connect-disconnect';

import { OnDemandService } from 'src/app/Services/on-demand.service';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Utility } from 'src/app/Shared/utility';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { UserCreate } from 'src/app/Models/user-create';

declare let $: any;
@Component({
  selector: 'app-connect-and-disconnect',
  templateUrl: './connect-and-disconnect.component.html',
  styleUrls: ['./connect-and-disconnect.component.scss'],
})
export class ConnectAndDisconnectComponent implements OnInit {
  formdata: ConnectDisconnect = new ConnectDisconnect();

  public formControl = new FormControl();

  exampleData: any[] = [];
  public value: string = 'exampleData';
  clients: any[] = [];
  dropValue: string = 'abc';
  data: any[] = [];
  loading: boolean = true;
  virtualScroll: boolean = true;
  iswritepermission: number;
  utility = new Utility();
  levelFormdata: UserCreate = new UserCreate();

  constructor(
    private service: OnDemandService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private config: NgSelectConfig,
    private subdivisionservice: SubDivisionService,
  ) {
    this.config.notFoundText = 'Device not found';
    this.config.loadingText = 'Device loading...';
    this.config.placeholder = 'Select Device ';

  }
  selectedCar: number;
  deviceno = [];
  SubDivisionDropdown: any[] = [];
  ngOnInit(): void {
    this.iswritepermission = parseInt(localStorage.getItem('WriteAccess'));
    $(document).ready(function () {
      $('.js-example-basic-single').select2();
    });

    this.formdata = new ConnectDisconnect();
    this.getDeviceDropdown();
    this.levelFormdata.roleID = 'METER';
    this.levelFormdata.accessOwner = localStorage.getItem('UserID');
    this.getSubdivision();
  }

  getDeviceDropdown() {

    this.service.getConnectDisconnectDevice().subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        this.spinner.hide();
        let obj = res.data[0];
        for (var item in obj) {

          this.exampleData.push(obj[item][1]);
        }
        this.deviceno = this.exampleData;
        this.loading = false;
        this.utility.updateApiKey(res.apiKey);;

      } else {
        this.spinner.hide();
        this.logout();
      }
    });
  }


  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  onSubmit() {

    if (this.formdata.command == 'ConnectStatus' || this.formdata.command == 'DisConnectStatus' || this.formdata.command == 'RTCClock') {
      this.onSubmitForStatus();
    }
    else {
      if (this.formdata != null) {
        this.spinner.show();
        if (this.levelFormdata.roleID == 'METER') {
          this.service
            .connectDisconnect(this.formdata.command, this.formdata.devicesrno)
            .subscribe((res: any) => {
              this.spinner.hide();
              if (res.result == true) {
                this.spinner.hide();
                this.toaster.success('Command Given Successfully');
                this.clearForm();
                $('#ModalConnectDisconnect').modal('hide');
                this.utility.updateApiKey(res.apiKey);;
              } else {
                this.spinner.hide();
                //this.toaster.error('Oops Something Went Wrong');
                this.toaster.warning('Command added in the queue.');
                $('#ModalConnectDisconnect').modal('hide');
              }
            });
        }
        else {
          let levelvalue = this.levelFormdata.roleID == 'ALL' ? this.levelFormdata.accessOwner : this.levelFormdata.accessSubdivision;
          this.service
            .connectDisconnectForAllLevel(this.formdata.command, this.levelFormdata.roleID, levelvalue)
            .subscribe((res: any) => {
              this.spinner.hide();
              if (res.result == true) {
                this.spinner.hide();
                this.toaster.success('Command Given Successfully');
                this.clearForm();
                $('#ModalConnectDisconnect').modal('hide');
                this.utility.updateApiKey(res.apiKey);;
              } else {
                this.spinner.hide();
                //this.toaster.error('Oops Something Went Wrong');
                this.toaster.warning('Command added in the queue.');
                $('#ModalConnectDisconnect').modal('hide');
              }
            });
        }
      }
    }
  }

  onSubmitFullDataCMD() {
    if (this.formdata != null) {
      this.spinner.show();

      this.service
        .connectDisconnectFullData(this.formdata.command, this.formdata.devicesrno)
        .subscribe((res: any) => {
          this.spinner.hide();
          if (res.data == true) {
            this.spinner.hide();
            this.toaster.success('Command added in the queue.');
            this.clearForm();
            $('#ModalConnectDisconnect').modal('hide');
            this.utility.updateApiKey(res.apiKey);;
          } else {
            this.spinner.hide();
            this.toaster.success('Command added in the queue.');
            $('#ModalConnectDisconnect').modal('hide');
          }
        });
    }
  }


  onSubmitForStatus() {
    if (this.formdata != null) {
      if (this.formdata.command == 'ConnectStatus')
        this.formdata.command = 'Connect';
      else if (this.formdata.command == 'DisConnectStatus')
        this.formdata.command = 'DisConnect';
      this.spinner.show();
      let levelvalue = this.levelFormdata.roleID == 'ALL' ? this.levelFormdata.accessOwner : this.levelFormdata.accessSubdivision;
      this.service
        .OnDemandStatus(this.formdata.command, this.levelFormdata.roleID, levelvalue)
        .subscribe((res: any) => {
          this.spinner.hide();
          if (res.data == true) {
            this.spinner.hide();
            this.toaster.success('Command added in the queue.');
            this.clearForm();
            $('#ModalConnectDisconnect').modal('hide');
            this.utility.updateApiKey(res.apiKey);;
          } else {
            this.spinner.hide();
            this.toaster.success('Command added in the queue.');
            $('#ModalConnectDisconnect').modal('hide');
          }
        });
    }
  }

  getSubdivision() {
    this.spinner.show();
    this.subdivisionservice
      .getSubdivisionForRegistration(this.levelFormdata.accessOwner)
      .subscribe((res: any) => {
        this.spinner.hide();
        if (
          res != null &&
          res.message != 'Key Is Not Valid' &&
          res.message != 'Session Is Expired'
        ) {
          this.SubDivisionDropdown = [];
          let obj = res.data[0];

          for (var item in obj) {
            this.SubDivisionDropdown.push(obj[item][0]);
          }
        } else {
          this.logout();
        }
      });
  }

  clearForm() {
    this.formdata = {
      command: '',
      devicesrno: '',
    };
  }
}
