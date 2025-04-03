import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterData } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';

import { Router } from '@angular/router';
import { Utility } from 'src/app/Shared/utility';

declare let $: any;
@Component({
  selector: 'app-daily-lpd',
  templateUrl: './daily-lpd.component.html',
  styleUrls: ['./daily-lpd.component.scss'],
})
export class DailyLpdComponent implements OnInit {
  formdata: MeterData = new MeterData();

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Daliy LPD',
    url: '/DailyLpd',
  };
  utility = new Utility();
  constructor(
    private service: DataService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
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
      { field: 'dateTime' },
      { field: 'mdasDateTime',headerName:'HES Date Time' },
      { field: 'energyImportKwh' },
      { field: 'energyImportKvah' },
      { field: 'energyExportKwh' },
      { field: 'energyExportKvah' }


    ];
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {

    let date = new Date();
    date.setDate(date.getDate() - 1);

    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  onBtnExport() {
    var excelParams = {
      fileName: 'DailyLpd.csv',
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

    this.service.getDailyLoadProfileData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo)
      .subscribe((res: any) => {
        if (res != null && res.message != 'Key Is Not Valid') {
          if (res.data != null) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  dateTime: res.data[0][item][1],
                  mdasDateTime: res.data[0][item][2],
                  energyImportKwh: res.data[0][item][3],
                  energyImportKvah: res.data[0][item][4],
                  energyExportKwh: res.data[0][item][5],
                  energyExportKvah: res.data[0][item][6],

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
