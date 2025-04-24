import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { FormControl } from '@angular/forms';

import { ConnectDisconnect } from 'src/app/Models/connect-disconnect';

import { OnDemandService } from 'src/app/Services/on-demand.service';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Utility } from 'src/app/Shared/utility';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { UserCreate } from 'src/app/Models/user-create';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Common } from 'src/app/Shared/Common/common';

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
  commonClass: Common;
  isAsync = false;
  constructor(
    private service: OnDemandService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private config: NgSelectConfig,
    private subdivisionservice: SubDivisionService,
    private datasharedservice: DataSharedService
  ) {
    this.config.notFoundText = 'Device not found';
    this.config.loadingText = 'Device loading...';
    this.config.placeholder = 'Select Device ';
    this.commonClass = new Common(datasharedservice);
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
        this.utility.updateApiKey(res.apiKey);
      } else {
        this.spinner.hide();

        this.datasharedservice.clearlocalStorageData(true);
      }
    });
  }
  // getDeviceDropdown() {
  //   this.spinner.show();
  //   this.exampleData = [];  // Reset array

  //   this.service.getConnectDisconnectDevice().subscribe({
  //     next: (res: any) => {
  //       if (res != null && res.message !== 'Key Is Not Valid') {
  //         this.spinner.hide();

  //         // Handle new response format
  //         if (res.result === true && Array.isArray(res.data)) {
  //           const headerRow = res.data[0]['1']; // Get headers

  //           // Process data rows (skip header row)
  //           for (let i = 2; i <= Object.keys(res.data[0]).length; i++) {
  //             const row = res.data[0][i.toString()];
  //             if (row && Array.isArray(row)) {
  //               // Get the meter number (index 1 based on your data structure)
  //               const deviceInfo = row[1];
  //               if (deviceInfo) {
  //                 this.exampleData.push(deviceInfo);
  //               }
  //             }
  //           }

  //           this.deviceno = this.exampleData;
  //           this.loading = false;

  //           if (res.apiKey) {
  //             this.utility.updateApiKey(res.apiKey);
  //           }
  //         }
  //         // Handle old response format
  //         else if (res.data && Array.isArray(res.data[0])) {
  //           const obj = res.data[0];
  //           for (const item in obj) {
  //             if (Array.isArray(obj[item]) && obj[item][1]) {
  //               this.exampleData.push(obj[item][1]); // Push meter number
  //             }
  //           }

  //           this.deviceno = this.exampleData;
  //           this.loading = false;
  //         }
  //       } else {
  //         this.handleError('Invalid API Key or Session Expired');
  //       }
  //     },
  //     error: (error) => {
  //       this.handleError('Error fetching device data');
  //     }
  //   });
  // }

  // private handleError(message: string) {
  //   this.spinner.hide();
  //   this.loading = false;
  //   console.error(message);
  //   
  // }

  // private extractColumnData(row: any[], columnIndex: number): string {
  //   return row && Array.isArray(row) && row[columnIndex] ? row[columnIndex] : '';
  // }

  // private processDeviceData(data: any[]): string[] {
  //   const devices: string[] = [];
  //   if (Array.isArray(data)) {
  //     // Skip first row (headers)
  //     for (let i = 2; i <= Object.keys(data[0]).length; i++) {
  //       const row = data[0][i.toString()];
  //       const deviceNumber = this.extractColumnData(row, 1); // Meter S.No. is at index 1
  //       if (deviceNumber) {
  //         devices.push(deviceNumber);
  //       }
  //     }
  //   }
  //   return devices;
  // }

  // onSubmit() {
  //   if (
  //     this.formdata.command == 'ConnectStatus' ||
  //     this.formdata.command == 'DisConnectStatus' ||
  //     this.formdata.command == 'RTCClock'
  //   ) {
  //     this.onSubmitForStatus();
  //   } else {
  //     if (this.formdata != null) {
  //       this.spinner.show();
  //       if (this.levelFormdata.roleID == 'METER') {
  //         this.service
  //           .connectDisconnect(this.formdata.command, this.formdata.devicesrno)
  //           .subscribe((res: any) => {
  //             this.spinner.hide();
  //             if (res.result == true) {
  //               this.spinner.hide();
  //               this.toaster.success('Command Given Successfully');
  //               this.clearForm();
  //               $('#ModalConnectDisconnect').modal('hide');
  //               this.utility.updateApiKey(res.apiKey);
  //             } else {
  //               this.spinner.hide();
  //               //this.toaster.error('Oops Something Went Wrong');
  //               this.toaster.warning('Command added in the queue.');
  //               $('#ModalConnectDisconnect').modal('hide');
  //             }
  //           });
  //       } else {
  //         let levelvalue =
  //           this.levelFormdata.roleID == 'ALL'
  //             ? this.levelFormdata.accessOwner
  //             : this.levelFormdata.accessSubdivision;
  //         this.service
  //           .connectDisconnectForAllLevel(
  //             this.formdata.command,
  //             this.levelFormdata.roleID,
  //             levelvalue
  //           )
  //           .subscribe((res: any) => {
  //             this.spinner.hide();
  //             if (res.result == true) {
  //               this.spinner.hide();
  //               this.toaster.success('Command Given Successfully');
  //               this.clearForm();
  //               $('#ModalConnectDisconnect').modal('hide');
  //               this.utility.updateApiKey(res.apiKey);
  //             } else {
  //               this.spinner.hide();
  //               //this.toaster.error('Oops Something Went Wrong');
  //               this.toaster.warning('Command added in the queue.');
  //               $('#ModalConnectDisconnect').modal('hide');
  //             }
  //           });
  //       }
  //     }
  //   }
  // }
  onSubmit() {
    if (
      this.formdata.command == 'ConnectStatus' ||
      this.formdata.command == 'DisConnectStatus' ||
      this.formdata.command == 'RTCClock'
    ) {
      this.onSubmitForStatus();
    } else {
      if (this.formdata != null) {
        this.spinner.show();
        if (this.levelFormdata.roleID == 'METER') {
          // Choose API based on toggle state
          const apiCall = this.isAsync 
            ? this.service.connectDisconnectAsync(this.formdata.command, this.formdata.devicesrno)
            : this.service.connectDisconnect(this.formdata.command, this.formdata.devicesrno);

          apiCall.subscribe((res: any) => {
            this.spinner.hide();
            if (res.result == true) {
              this.spinner.hide();
              this.toaster.success('Command Given Successfully');
              this.clearForm();
              $('#ModalConnectDisconnect').modal('hide');
              this.utility.updateApiKey(res.apiKey);
            } else {
              this.spinner.hide();
              //this.toaster.error('Oops Something Went Wrong');
              this.toaster.warning('Command added in the queue.');
              $('#ModalConnectDisconnect').modal('hide');
            }
          });
        } else {
          let levelvalue =
            this.levelFormdata.roleID == 'ALL'
              ? this.levelFormdata.accessOwner
              : this.levelFormdata.accessSubdivision;
              
          // Choose API based on toggle state for all level
          const apiCall = this.isAsync
            ? this.service.connectDisconnectForAllLevelAsync(
                this.formdata.command,
                this.levelFormdata.roleID,
                levelvalue
              )
            : this.service.connectDisconnectForAllLevel(
                this.formdata.command,
                this.levelFormdata.roleID,
                levelvalue
              );

          apiCall.subscribe((res: any) => {
            this.spinner.hide();
            if (res.result == true) {
              this.spinner.hide();
              this.toaster.success('Command Given Successfully');
              this.clearForm();
              $('#ModalConnectDisconnect').modal('hide');
              this.utility.updateApiKey(res.apiKey);
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
  // onSubmitFullDataCMD() {
  //   if (this.formdata != null) {
  //     this.spinner.show();

  //     this.service
  //       .connectDisconnectFullData(
  //         this.formdata.command,
  //         this.formdata.devicesrno
  //       )
  //       .subscribe((res: any) => {
  //         this.spinner.hide();
  //         if (res.data == true) {
  //           this.spinner.hide();
  //           this.toaster.success('Command added in the queue.');
  //           this.clearForm();
  //           $('#ModalConnectDisconnect').modal('hide');
  //           this.utility.updateApiKey(res.apiKey);
  //         } else {
  //           this.spinner.hide();
  //           this.toaster.success('Command added in the queue.');
  //           $('#ModalConnectDisconnect').modal('hide');
  //         }
  //       });
  //   }
  // }
  onSubmitFullDataCMD() {
    if (this.formdata != null) {
      this.spinner.show();
      
      // Choose between sync and async API based on toggle
      const apiCall = this.isAsync
        ? this.service.connectDisconnectFullDataAsync(
            this.formdata.command,
            this.formdata.devicesrno
          )
        : this.service.connectDisconnectFullData(
            this.formdata.command,
            this.formdata.devicesrno
          );

      apiCall.subscribe((res: any) => {
        this.spinner.hide();
        if (res.data == true) {
          this.spinner.hide();
          this.toaster.success('Command added in the queue.');
          this.clearForm();
          $('#ModalConnectDisconnect').modal('hide');
          this.utility.updateApiKey(res.apiKey);
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
      let levelvalue =
        this.levelFormdata.roleID == 'ALL'
          ? this.levelFormdata.accessOwner
          : this.levelFormdata.accessSubdivision;
      this.service
        .OnDemandStatus(
          this.formdata.command,
          this.levelFormdata.roleID,
          levelvalue
        )
        .subscribe((res: any) => {
          this.spinner.hide();
          if (res.data == true) {
            this.spinner.hide();
            this.toaster.success('Command added in the queue.');
            this.clearForm();
            $('#ModalConnectDisconnect').modal('hide');
            this.utility.updateApiKey(res.apiKey);
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
        this.commonClass.checkDataExists(res);

        this.SubDivisionDropdown = [];
        let obj = res.data[0];

        for (var item in obj) {
          this.SubDivisionDropdown.push(obj[item][0]);
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
