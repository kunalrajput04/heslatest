import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { ColumnDefs } from 'src/app/Models/column-defs';
import { MeterData, MeterDatas } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';

import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Utility } from 'src/app/Shared/utility';

declare let $: any;


@Component({
  selector: 'app-device-name-plate',
  templateUrl: './device-name-plate.component.html',
  styleUrls: ['./device-name-plate.component.scss']
})
export class DeviceNamePlateComponent implements OnInit {
  formdata: MeterData = new MeterData();

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Device',
    menuname: 'Device Name Plate',
    url: '/DeviceNamePlate',
  };
  utility = new Utility();
  constructor(
    private service: DataService,
    private router: Router,
    private datasharedservice: DataSharedService

  ) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'deviceSNo' },
      { field: 'mdasDateTime',headerName:'HES Date Time' },
      { field: 'meterSNo' },
      { field: 'fwVersion' },
      { field: 'currentRating' },
      { field: 'deviceID' },
      { field: 'manufacturerName' },
      { field: 'manufacturerYear' },
      { field: 'meterType' },
      { field: 'status' }

    ];
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {



  }

  onBtnExport() {
    var excelParams = {

      fileName: 'NamePlate.csv',

    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
  }


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }



  onSubmit() {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.service
      .getNamePlate(this.formdata.meterNo)
      .subscribe((res: any) => {
        if (res != null && res.message != 'Key Is Not Valid') {
          if (res.data != null) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  deviceSNo: res.data[0][item][0],
                  mdasDateTime: res.data[0][item][1],
                  meterSNo: res.data[0][item][2],
                  fwVersion: res.data[0][item][3],
                  currentRating: res.data[0][item][4],
                  deviceID: res.data[0][item][5],
                  manufacturerName: res.data[0][item][6],
                  manufacturerYear: res.data[0][item][7],
                  meterType: res.data[0][item][8],
                  status: res.data[0][item][9],
                });
              }
            }
            this.utility.updateApiKey(res.apiKey);
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else
            this.gridApi.setRowData([]);
        } else {

          
        }
      });
  }
}





