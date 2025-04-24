import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  DeviceInfoList,
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
import { Common } from 'src/app/Shared/Common/common';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss'],
})
export class DeviceInfoComponent implements OnInit {
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
  tableData: DeviceInfoList[] = [];
  utility = new Utility();
  frameworkComponents: any;
  meterNo: string = '';
  commonClass: Common;
  constructor(
    private deviceservice: DeviceService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private subdivisionservice: SubDivisionService,
    private router: Router,
    private substation: SubStationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private datasharedservice: DataSharedService
  ) {
    this.commonClass = new Common(datasharedservice);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.frameworkComponents = {
      buttonRenderer: EditButtonComponent,
    };
    
    this.columnDefs = [
   
      { field: 'consumerName' },
      { field: 'consumerNo' },      
      { field: 'address' },
      { field: 'phoneNo' },
      { field: 'deviceSerialNo', headerName: 'Meter Serial Number', width: 100,  },
      { field: 'installationDate' },
      { field: 'meterMode', headerName: 'PrepaidMode' },
      { field: 'billMode' , width: 50, },
      { field: 'meterType' , width: 50, },      
      { field: 'network' , width: 50, },
      { field: 'nicIPV6', headerName: 'NIC IPV6' },
      { field: 'subDivisionName', headerName: 'Subdivision' },
      { field: 'subStationName', headerName: 'Substation' },
      { field: 'feederName', headerName: 'Feeder' },
      { field: 'latitude' },
      { field: 'longitude' , width: 80, },
      {
        headerName: 'Delete',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onDeleteRow.bind(this),
          label: 'Delete', 
          color: 'red  !important',
          isModal: true,
        },
        width: 70, 
      },
      {
        headerName: 'Update',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onEditRow.bind(this),
          label: '', 
          color: 'blue  !important',
          isModal: true,
        },
        width: 70, 
      },
    
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
        if (cell.column.colId == 'nicMsisdnNo') return '\u200C' + cell.value;
        else return cell.value;
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
    this.deviceservice.getDeviceList(this.meterNo).subscribe(
      (res: any) => {
        // if (res != null && res.message != 'Key Is Not Valid') {
          const validData = this.commonClass.checkDataExists(res);
          if (res.data != null) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({             
                  consumerName: res.data[0][item][0],
                  consumerNo: res.data[0][item][1],
                  address: res.data[0][item][2],
                  phoneNo: res.data[0][item][3],                  
                  deviceSerialNo: res.data[0][item][4],                  
                  installationDate: res.data[0][item][5],
                  meterMode: res.data[0][item][6],
                  billMode: res.data[0][item][7],
                  meterType: res.data[0][item][8],
                  network: res.data[0][item][9],                 
                  nicIPV6: res.data[0][item][10],
                  subDivisionName: res.data[0][item][11],
                  subStationName: res.data[0][item][12],
                  feederName: res.data[0][item][13],
                  latitude: res.data[0][item][14],
                  longitude: res.data[0][item][15],
                });
              }
            }

            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else {
            this.gridApi.setRowData([]);
          }
      
      },
      (err) => {
        this.gridApi.setRowData([]);
        this.gridColumnApi.autoSizeAllColumns();
        this.toaster.error('something went wrong please try again !!!');
      }
    );
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
      const validData = this.commonClass.checkDataExists(res);
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
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

  // onDeleteRow(data: any) {
  //   let meterno = data.rowData.deviceSerialNo;

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     input: 'text',
  //     inputAttributes: {
  //       autocapitalize: 'off',
  //     },

  //     text: 'You will not be able to recover this data! Enter your reason',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.value == '') {
  //       Swal.fire('Please Enter Delete Reason!', '', 'error');
  //     } else if (result.isConfirmed) {
  //       this.deviceservice
  //         .deleteDevice(meterno, result.value)
  //         .subscribe((res: any) => {
  //           this.spinner.hide();
  //           const validData = this.commonClass.checkDataExists(res);
  //             Swal.fire('Deleted Successfully', '', 'success');
              
           
  //         });
  //     }
  //   });
  // }
  onDeleteRow(data: any) {
    const meterno = data.rowData.deviceSerialNo;
    Swal.fire({
      title: 'Are you sure?',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      text: 'You will not be able to recover this data! Enter your reason',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      if (!result.value) {
        Swal.fire('Please Enter Delete Reason!', '', 'error');
        return;
      }
      
      this.spinner.show();
      
      this.deviceservice.deleteDevice(meterno, result.value)
        .subscribe({
          next: (res: any) => {
            this.spinner.hide();
            
            if (res && res.data === true) {
              Swal.fire({
                title: 'Deleted Successfully',
                icon: 'success',
                allowOutsideClick: false
              }).then(() => {
                
                this.tableData = [];
                this.gridApi.setRowData([]);
           
                this.onList();
              });
            } else {
              const errorMessage = res?.message || 'Failed to delete device';
              Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                allowOutsideClick: false
              });
            }
          },
          error: (err) => {
            this.spinner.hide();
            const errorMessage = err?.error?.message || 'Failed to delete device';
            Swal.fire({
              title: 'Error',
              text: errorMessage,
              icon: 'error',
              allowOutsideClick: false
            });
          }
        });
    });
}

// onList() {
//     // Clear existing data
//     this.tableData = [];
//     this.gridApi.setRowData([]);
//     this.gridColumnApi.autoSizeAllColumns();
//     this.gridApi.showLoadingOverlay();

//     this.deviceservice.getDeviceList(this.meterNo).subscribe({
//       next: (res: any) => {
//         try {
//           if (res?.data != null && Array.isArray(res.data) && res.data[0]) {
//             const deviceData = res.data[0];
//             this.tableData = Object.keys(deviceData)
//               .filter(key => parseInt(key) !== 1)
//               .map(key => ({
//                 consumerName: deviceData[key][0],
//                 consumerNo: deviceData[key][1],
//                 address: deviceData[key][2],
//                 phoneNo: deviceData[key][3],
//                 deviceSerialNo: deviceData[key][4],
//                 installationDate: deviceData[key][5],
//                 meterMode: deviceData[key][6],
//                 billMode: deviceData[key][7],
//                 meterType: deviceData[key][8],
//                 network: deviceData[key][9],
//                 nicIPV6: deviceData[key][10],
//                 subDivisionName: deviceData[key][11],
//                 subStationName: deviceData[key][12],
//                 feederName: deviceData[key][13],
//                 latitude: deviceData[key][14],
//                 longitude: deviceData[key][15]
//               }));

//             this.gridApi.setRowData(this.tableData);
//           } else {
//             this.gridApi.setRowData([]);
//           }
//         } catch (error) {
//           console.error('Error processing device list:', error);
//           this.gridApi.setRowData([]);
//         }
//         this.gridColumnApi.autoSizeAllColumns();
//       },
//       error: (err) => {
//         this.gridApi.setRowData([]);
//         this.gridColumnApi.autoSizeAllColumns();
//         this.toaster.error('Something went wrong, please try again!');
//       },
//       complete: () => {
//         this.gridApi.hideOverlay();
//       }
//     });
// }
// onDeleteRow(data: any) {
//   const meterno = data.rowData.deviceSerialNo;
  
//   Swal.fire({
//     title: 'Are you sure?',
//     input: 'text',
//     inputAttributes: {
//       autocapitalize: 'off'
//     },
//     text: 'You will not be able to recover this data! Enter your reason',
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, delete it!'
//   }).then((result) => {
//     if (result.value === '') {
//       Swal.fire('Please Enter Delete Reason!', '', 'error');
//       return;
//     }
    
//     if (result.isConfirmed) {
//       this.spinner.show();
      
//       this.deviceservice.deleteDevice(meterno, result.value)
//         .subscribe({
//           next: (res: any) => {
//             this.spinner.hide();
            
//             if (res.data === true) {
//               Swal.fire('Deleted Successfully', '', 'success')
//                 .then(() => { this.onList();
//                 });
//             } else {
//               // Show the API's error message if available
//               const errorMessage = res.message || 'Failed to delete device';
//               Swal.fire('Error', errorMessage, 'error');
//             }
//           },
//           error: (error) => {
//             this.spinner.hide();
//             const errorMessage = error.error?.message || 'Failed to delete device';
//             Swal.fire('Error', errorMessage, 'error');
//           }
//         });
//     }
//   });
// }
  // saveDevice(form: NgForm) {
  //   $('#ModalAddDevice').modal('hide');
  //   this.spinner.show();
  //   if (form.value != null) {
  //     this.deviceservice.AddDevice(form.value).subscribe((res: any) => {
  //       this.spinner.hide();
  //       const validData = this.commonClass.checkDataExists(res);
  //         if (res.data == true) {
  //           if (this.isEdit) {
  //             this.toaster.success('Updated Successfully');
  //           } else {
  //             this.toaster.success('Created Successfully');
  //           }
  //         } else {
  //           this.toaster.error(res.message);
  //         }
       
  //     });
  //   }
  // }
  saveDevice(form: NgForm) {
    $('#ModalAddDevice').modal('hide');
    this.spinner.show();
    
    if (form.value != null) {
      this.deviceservice.AddDevice(form.value).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          
          if (res.result === true) {
            if (this.isEdit) {
              this.toaster.success('Updated Successfully');
            } else {
              this.toaster.success('Created Successfully');
            }
          } else {
            this.toaster.error(res.message || 'Failed to save device');
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.toaster.error(error.message || 'An error occurred');
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
        if (res.data.manufacturer == 'IHM') this.formdata.manufacturer = 'JPM';
        else this.formdata.manufacturer = res.data.manufacturer;

        $('#ModalAddDevice').modal('show');
        this.utility.updateApiKey(res.apiKey);
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
