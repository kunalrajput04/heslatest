import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';
import { DeviceService } from 'src/app/Services/device.service';
import { DatePipe } from '@angular/common';
import { MeterData } from 'src/app/Models/meter-data';
import { NgForm } from '@angular/forms';

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
declare let $: any;
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-insant-data-push',
  templateUrl: './insant-data-push.component.html',
  styleUrls: ['./insant-data-push.component.scss'],
})
export class InsantDataPushComponent implements OnInit {
  formdata: MeterData = new MeterData();
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Instant Data Push',
    url: '/InstantDataPush',
  };
  utility = new Utility();
  constructor(
    private service: DataService,

    private spinner: NgxSpinnerService,

    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,

    private router: Router
  ) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
    
    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'meterDateTime' },
      { field: 'mdasDateTime',headerName:'HES Date Time' },
      { field: 'voltage' },
      { field: 'phaseCurrent' },
      { field: 'neutralCurrent' },
      { field: 'pf' },
      { field: 'frequency' },
      { field: 'powerKva' },
      { field: 'powerKw' },
      { field: 'energyImportKwh' },
      { field: 'energyImportKvah' }


    ];
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  onBtnExport() {
    var excelParams = {
      fileName: 'InstantData.csv',
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

  onSubmit() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    this.service.getInstantPushData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo)
      // .subscribe((res: any) => {
      //   if (res != null && res.message != 'Key Is Not Valid') {
      //     if (res.data != null) {
        .subscribe({
          next: (res: any) => {
            if (res?.result === true && res.data?.[0]) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  meterDateTime: res.data[0][item][1],
                  mdasDateTime: res.data[0][item][2],
                  voltage: res.data[0][item][3],
                  phaseCurrent: res.data[0][item][4],
                  neutralCurrent: res.data[0][item][5],
                  pf: res.data[0][item][6],
                  frequency: res.data[0][item][7],
                  powerKva: res.data[0][item][8],
                  powerKw: res.data[0][item][9],
                  energyImportKwh: res.data[0][item][10],
                  energyImportKvah: res.data[0][item][11],
                
                });
              }
            }
            this.utility.updateApiKey(res.apiKey);;
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else
            this.gridApi.setRowData([]);
       
      }});

  }

  logout() {


    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }


}
