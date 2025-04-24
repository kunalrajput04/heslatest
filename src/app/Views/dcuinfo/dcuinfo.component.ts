import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import {
  DeviceInfoListDcu,
  DeviceInformation,
  getDevice,
} from 'src/app/Models/device-information';

import { DeviceService } from 'src/app/Services/device.service';
import { DTService } from 'src/app/Services/dt.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
import Swal from 'sweetalert2';
declare let $: any;

import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { environment } from 'src/environments/environment';
import { CellClickedEvent } from 'ag-grid-community';
import { EditButtonComponent } from 'src/app/Shared/AgGrid/edit-button/edit-button.component';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-dcuinfo',
  templateUrl: './dcuinfo.component.html',
  styleUrls: ['./dcuinfo.component.scss']
})
export class DcuinfoComponent implements OnInit {  
    formdata: DeviceInformation = new DeviceInformation();
    isEdit: boolean = false;
    subdivisionDropDown: any[] = [];
    substatioDropDown: any[] = [];
    feederDropDown: any[] = [];
    dtDropDown: any[] = [];
    deviceno: getDevice = new getDevice();
    data: Headernavigation = {
      firstlevel: '',
      menuname: 'Device & Info',
      url: '/deviceInfo',
    };
    iswritepermission: string;
    apiUrl: string = environment.apiUrl;
    gridApi: any;
    gridColumnApi: any;
    columnDefs: any;
    defaultColDef: any;
    rowData: any;
    gridOptions: any;
    tableData: DeviceInfoListDcu[] = [];
    utility = new Utility();
    frameworkComponents: any;
    meterNo: string = "";
    constructor(
      private deviceservice: DeviceService,
      private spinner: NgxSpinnerService,
      private toaster: ToastrService,
      private subdivisionservice: SubDivisionService,
      private router: Router,
      private substation: SubStationService,
      private feederservice: FeederService,
      private dtservice: DTService,
      private datasharedservice: DataSharedService,
  
    ) {
      this.gridOptions = { context: { componentParent: this } }
      this.defaultColDef = {
        resizable: true, filter: false, sortable: true
      };
      this.frameworkComponents = {
        buttonRenderer: EditButtonComponent,
      };
      this.columnDefs = [
        { field: 'consumerName' },
        { field: 'deviceSerialNo' },
        { field: 'consumerNo' },
        { field: 'installationDate' },
        { field: 'meterMode' },
        { field: 'meterType' },
        { field: 'network' },
        { field: 'nicMsisdnNo' },
        { field: 'ipAddressMain' },
        { field: 'subDivisionName' },
        { field: 'subStationName' },
        { field: 'feederName' },
        { field: 'latitude' },
        { field: 'longitude' },
        {
          headerName: 'Delete',
  
          cellRenderer: 'buttonRenderer',
          cellRendererParams: {
            onClick: this.onDeleteRow.bind(this),
            label: 'Delete',
            color: 'red  !important',
            isModal: true
          }
        },
        {
          headerName: 'Update',
          cellRenderer: 'buttonRenderer',
          cellRendererParams: {
            onClick: this.onEditRow.bind(this),
            label: 'Edit',
            color: 'blue  !important',
            isModal: true
          }
        }
  
      ];
  
      this.datasharedservice.chagneHeaderNav(this.data);
    }
  
  
    ngOnInit(): void {
  
      this.iswritepermission = localStorage.getItem('WriteAccess');
    }
  
  
    onBtnExport() {
      var excelParams = {
        fileName: 'Devices.csv',
        processCellCallback: function (cell) {
          if (cell.column.colId == 'nicMsisdnNo')
            return "\u200C" + cell.value;
          else
            return cell.value;
        },
      };
  
      this.gridApi.exportDataAsCsv(excelParams);
    }
  
  
  
    onGridReady(params: any) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.setRowData([]);
      this.gridColumnApi.autoSizeAllColumns();
  
  
    }
  
    onList() {
      this.tableData = [];
      this.gridApi.setRowData([]);
      this.gridColumnApi.autoSizeAllColumns();
      this.gridApi.showLoadingOverlay();
      this.deviceservice.getDeviceList(this.meterNo).subscribe((res: any) => {
  
        if (res != null && res.message != 'Key Is Not Valid') {
          if (res.data != null) {
  
  
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  consumerName: res.data[0][item][0],
                  deviceSerialNo: res.data[0][item][1],
                  consumerNo: res.data[0][item][2],
                  installationDate: res.data[0][item][3],
                  meterMode: res.data[0][item][4],
                  meterType: res.data[0][item][5],
                  network: res.data[0][item][6],
                  nicMsisdnNo: res.data[0][item][7],
                  ipAddressMain: res.data[0][item][8],
                  subDivisionName: res.data[0][item][9],
                  subStationName: res.data[0][item][10],
                  feederName: res.data[0][item][11],
                  latitude: res.data[0][item][12],
                  longitude: res.data[0][item][13],
  
                });
              }
            }
  
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          }
          else {
            this.gridApi.setRowData([]);
          }
        }
        else {
  
          
        }
      }, (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
        this.toaster.error('something went wrong please try again !!!');
      });
    }
    logout() {
  
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/meecl']);
    }
  
  
    showDeviceModal() {
      $('#ModalAddDevice').modal('show');
      this.isEdit = false;
      this.formdata = new DeviceInformation();
      this.getSubdivision();
    }
    getSubdivision() {
      this.spinner.show();
  
      this.subdivisionservice.getSubdivision().subscribe((res: any) => {
        this.spinner.hide();
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          this.subdivisionDropDown = [];
          let obj = res.data[0];
          for (var item in obj) {
            this.subdivisionDropDown.push(obj[item][0]);
          }
  
        }
        else {
  
          
        }
      });
    }
  
    getSubstation(subdivision: string) {
      this.spinner.show();
      this.substation
        .getSubstationBySubdivision(subdivision)
        .subscribe((res: any) => {
          this.spinner.hide();
          this.substatioDropDown = [];
          if (res.data != null) {
            let obj = res.data[0];
            for (var item in obj) {
              this.substatioDropDown.push(obj[item][0]);
            }
          }
        });
    }
    getFeeder(substation: string) {
      this.spinner.show();
      this.feederservice
        .getFeederBySubstation(substation)
        .subscribe((res: any) => {
          this.spinner.hide();
          this.feederDropDown = [];
          if (res.data != null) {
            let obj = res.data[0];
            for (var item in obj) {
              this.feederDropDown.push(obj[item][0]);
            }
          }
        });
    }
    getDT(feeder: string) {
      this.spinner.show();
      this.dtservice.getDTByFeeder(feeder).subscribe((res: any) => {
        this.spinner.hide();
        this.dtDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.dtDropDown.push(obj[item][0]);
          }
        }
      });
    }
  
    onDeleteRow(data: any) {
      let meterno = data.rowData.deviceSerialNo;
  
      Swal.fire({
        title: 'Are you sure?',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off',
        },
  
        text: 'You will not be able to recover this data! Enter your reason',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value == '') {
          Swal.fire('Please Enter Delete Reason!', '', 'error');
        } else if (result.isConfirmed) {
          this.deviceservice
            .deleteDevice(meterno, result.value)
            .subscribe((res: any) => {
              this.spinner.hide();
              if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
  
                Swal.fire('Deleted Successfully', '', 'success');
                this.utility.updateApiKey(res.apiKey);;
                //this.rerender();
              }
              else {
  
                
              }
            });
        }
      });
    }
  
    saveDevice(form: NgForm) {
      $('#ModalAddDevice').modal('hide');
      this.spinner.show();
      if (form.value != null) {
        this.deviceservice.AddDevice(form.value).subscribe((res: any) => {
          this.spinner.hide();
          if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
            if (res.data == true) {
              if (this.isEdit) {
                this.toaster.success('Updated Successfully');
              } else {
                this.toaster.success('Created Successfully');
              }
            }
            else {
              this.toaster.error(res.message);
            }
          } else {
  
            
          }
        });
      }
    }
  
    onEditRow(data: any) {
      let meterno = data.rowData.deviceSerialNo;
      this.getSubdivision();
      this.deviceno.deviceNo = meterno;
      this.spinner.show();
      this.deviceservice.getDeviceInfo(this.deviceno).subscribe((res: any) => {
        this.isEdit = true;
        this.spinner.hide();
        if (res.data != null) {
          this.formdata.ownerName = res.data.owner_name;
          this.formdata.subDivisionName = res.data.subdevision_name;
          this.getSubstation(this.formdata.subDivisionName);
          this.formdata.subStationName = res.data.substation_name;
          this.getFeeder(this.formdata.subStationName);
          this.formdata.feederName = res.data.feeder_name;
          this.getDT(this.formdata.feederName);
  
          this.formdata.dtName = res.data.dt_name;
          this.formdata.deviceSerialNo = meterno;
          this.formdata.commissioningStatus = res.data.commissioning_status;
          this.formdata.consumerName = res.data.consumer_name;
          this.formdata.consumerNo = res.data.consumer_no;
          this.formdata.phoneNumber = res.data.phone_number;
          this.formdata.latitude = res.data.latitude;
          this.formdata.longitude = res.data.longitude;
          this.formdata.deviceType = res.data.device_type;
          this.formdata.ipAddressMain = res.data.ip_address_main;
          this.formdata.address = res.data.address;
          this.formdata.ipPortMain = res.data.ip_port_main;
          if (res.data.manufacturer == 'IHM')
            this.formdata.manufacturer = "JPM";
          else
            this.formdata.manufacturer = res.data.manufacturer;
  
          $('#ModalAddDevice').modal('show');
          this.utility.updateApiKey(res.apiKey);;
        } else {
          this.toaster.error('Oops!! something went wrong');
        }
      });
    }
    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
  
  }
