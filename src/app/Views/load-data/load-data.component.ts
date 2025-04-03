import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MeterData } from 'src/app/Models/meter-data';
import { DataService } from 'src/app/Services/data.service';

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
declare let $: any;
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-load-data',
  templateUrl: './load-data.component.html',
  styleUrls: ['./load-data.component.scss'],
})
export class LoadDataComponent implements OnInit {
  formdata: MeterData = new MeterData();
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Load Profile Data',
    url: '/LoadData',
  };
  utility = new Utility();
  meterPhase: string = 'Evit';
  constructor(
    private service: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,
    private authservice: AuthService
  ) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
    this.columnDefs = this.getColumnName();

    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {


    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  onBtnExport() {
    var excelParams = {
      fileName: 'LoadData.csv',
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
      'yyyy-MM-dd HH:mm'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd HH:mm'
    );

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();


    this.service.getLoadProfileData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo).subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              const meterSNo = res.data[0][item][0];
              if (this.meterPhase == "Evit") {
                this.tableData.push({
                  meterSNo,
                 // meterSNo: res.data[0][item][0],
                  mdasDateTime: res.data[0][item][1],
                  intervalDateTime: res.data[0][item][2],
                  avgCurrent: res.data[0][item][3],
                  avgVoltage: res.data[0][item][4],
                  blockEnergyExportKvah: res.data[0][item][5],
                  blockEnergyImportKvah: res.data[0][item][6],
                  blockEnergyExportKwh: res.data[0][item][7],
                  blockEnergyImportKwh: res.data[0][item][8]
                });
              } else {
                this.tableData.push({
                  //meterSNo: res.data[0][item][0],
                  meterSNo,
                  mdasDateTime: res.data[0][item][1],
                  intervalDateTime: res.data[0][item][2],
                  rPhCurrent: meterSNo.startsWith('IN') &&  res.data[0][item][3]  === 0 ? '-' : res.data[0][item][3],
                  yPhCurrent: meterSNo.startsWith('IN') &&  res.data[0][item][4] === 0 ? '-' : res.data[0][item][4],
                  bPhCurrent: meterSNo.startsWith('IN') &&  res.data[0][item][5] === 0 ? '-' : res.data[0][item][5],
                  rPhVoltage: res.data[0][item][6],
                  yPhVoltage: res.data[0][item][7],
                  bPhVoltage: res.data[0][item][8],
                  blockEnergyExportKvah: res.data[0][item][9],
                  blockEnergyImportKvah: res.data[0][item][10],
                  blockEnergyExportKwh: res.data[0][item][11],
                  blockEnergyImportKwh: res.data[0][item][12]
                });
              }

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

  getColumnName(): any {

    this.meterPhase = sessionStorage.getItem('MeterPhase');
    if (this.meterPhase == '' || this.meterPhase == 'All' || this.meterPhase == null || this.meterPhase == undefined)
      this.meterPhase = 'Evit';
    if (this.meterPhase == "Evit") {
      return [
        { field: 'meterSNo' },
        { field: 'mdasDateTime', headerName: 'HES Date Time' },
        { field: 'intervalDateTime' },
        { field: 'avgCurrent' },
        { field: 'avgVoltage' },
        { field: 'blockEnergyExportKvah' },
        { field: 'blockEnergyImportKvah' },
        { field: 'blockEnergyExportKwh' },
        { field: 'blockEnergyImportKwh' }
      ];
    }
    else {
      return [
        { field: 'meterSNo' },
        { field: 'mdasDateTime', headerName: 'MDAS Date Time' },
        { field: 'intervalDateTime' },
        { field: 'rPhCurrent' },
        { field: 'yPhCurrent' },
        { field: 'bPhCurrent' },
        { field: 'rPhVoltage' },
        { field: 'yPhVoltage' },
        { field: 'bPhVoltage' },
        { field: 'blockEnergyExportKvah' },
        { field: 'blockEnergyImportKvah' },
        { field: 'blockEnergyExportKwh' },
        { field: 'blockEnergyImportKwh' }
      ];
    }
  }

  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }


}
