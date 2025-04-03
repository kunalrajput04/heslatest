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
  selector: 'app-return-instant-data',
  templateUrl: './return-instant-data.component.html',
  styleUrls: ['./return-instant-data.component.scss'],
})
export class ReturnInstantDataComponent implements OnInit {
  formdata: MeterData = new MeterData();

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];


  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Recent Instant Data',
    url: '/RecentInstantData',
  };
  utility = new Utility();
  constructor(
    private service: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,

  ) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'meterDateTime' },
      { field: 'energyExportKvah' },
      { field: 'energyImportKvah' },
      { field: 'energyExportKwh' },
      { field: 'energyImportKwh' },
      { field: 'loadLimit' },
      { field: 'loadStatus' },
      { field: 'mdKva' },
      { field: 'mdKvaDateTime' },
      { field: 'mdKw' },
      { field: 'mdKwDateTime' },
      { field: 'tamperCount' }


    ];
    this.datasharedservice.chagneHeaderNav(this.data);
  }
  ngOnInit(): void {
   // this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'RecentInstantData.csv',
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
    
    if(this.formdata.todate !="")
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    this.service.getReturnInstantData(this.formdata.todate, this.formdata.meterNo)
      .subscribe((res: any) => {
        if (res != null && res.message != 'Key Is Not Valid') {
          if (res.data != null) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  meterDateTime: res.data[0][item][1],
                  energyExportKvah: res.data[0][item][2],
                  energyImportKvah: res.data[0][item][3],
                  energyExportKwh: res.data[0][item][4],
                  energyImportKwh: res.data[0][item][5],
                  loadLimit: res.data[0][item][6],
                  loadStatus: res.data[0][item][7],
                  mdKva: res.data[0][item][8],
                  mdKvaDateTime: res.data[0][item][9],
                  mdKw: res.data[0][item][10],
                  mdKwDateTime: res.data[0][item][11],
                  tamperCount: res.data[0][item][12],
                });
              }
            }
            this.utility.updateApiKey(res.apiKey);;
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else
            this.gridApi.setRowData([]);
        } else {

          this.logout();
        }
      });

  }

  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }



}
