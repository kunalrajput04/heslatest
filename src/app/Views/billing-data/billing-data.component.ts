import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MeterData } from 'src/app/Models/meter-data';
import { DataService } from 'src/app/Services/data.service';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-billing-data',
  templateUrl: './billing-data.component.html',
  styleUrls: ['./billing-data.component.scss'],
})
export class BillingDataComponent implements OnInit {
  formdata: MeterData = new MeterData();
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Billing',
    url: '/Billing',
  };
  utility = new Utility();
  meterPhase: string = 'Evit';
  constructor(
    private service: DataService,
    private router: Router,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService
  ) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
    this.columnDefs = this.getColumnName();

    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {

    let date = new Date();
    date.setDate(date.getDate() - 35);
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  onBtnExport() {
    var excelParams = {
      fileName: 'BillingData.csv',
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

    this.service.getBillingData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo).subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              if (this.meterPhase == "Evit") {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],

                  mdasDateTime: res.data[0][item][1],
                  billingDateTime: res.data[0][item][2],
                  avgPF: res.data[0][item][3],
                  powerOnDuration: res.data[0][item][4],
                  powerOffDuration: res.data[0][item][5],
                  energyExportKvah: res.data[0][item][6],
                  energyImportKvah: res.data[0][item][7],
                  energyKvahT1: res.data[0][item][8],
                  energyKvahT2: res.data[0][item][9],
                  energyKvahT3: res.data[0][item][10],
                  energyKvahT4: res.data[0][item][11],
                  energyKvahT5: res.data[0][item][12],
                  energyKvahT6: res.data[0][item][13],
                  energyKvahT7: res.data[0][item][14],
                  energyKvahT8: res.data[0][item][15],
                  energyExportKwh: res.data[0][item][16],
                  energyImportKwh: res.data[0][item][17],
                  energyKwhT1: res.data[0][item][18],
                  energyKwhT2: res.data[0][item][19],
                  energyKwhT3: res.data[0][item][20],
                  energyKwhT4: res.data[0][item][21],
                  energyKwhT5: res.data[0][item][22],
                  energyKwhT6: res.data[0][item][23],
                  energyKwhT7: res.data[0][item][24],
                  energyKwhT8: res.data[0][item][25],
                  mdKva: res.data[0][item][26],
                  mdKvaDateTime: res.data[0][item][27],
                  mdKw: res.data[0][item][28],
                  mdKwDateTime: res.data[0][item][29]
                });
              }
              else {
                
                this.tableData.push({
                  meterSNo: res.data[0][item][0],

                  mdasDateTime: res.data[0][item][1],
                  billingDateTime: res.data[0][item][2],
                  avgPF: res.data[0][item][3],
                  powerOnDuration: res.data[0][item][4],
                  energyExportKvah: res.data[0][item][5],
                  energyImportKvah: res.data[0][item][6],
                  energyKvahT1: res.data[0][item][7],
                  energyKvahT2: res.data[0][item][8],
                  energyKvahT3: res.data[0][item][9],
                  energyKvahT4: res.data[0][item][10],
                  energyKvahT5: res.data[0][item][11],
                  energyKvahT6: res.data[0][item][12],
                  energyKvahT7: res.data[0][item][13],
                  energyKvahT8: res.data[0][item][14],
                  energyExportKwh: res.data[0][item][15],
                  energyImportKwh: res.data[0][item][16],
                  energyKwhT1: res.data[0][item][17],
                  energyKwhT2: res.data[0][item][18],
                  energyKwhT3: res.data[0][item][19],
                  energyKwhT4: res.data[0][item][20],
                  energyKwhT5: res.data[0][item][21],
                  energyKwhT6: res.data[0][item][22],
                  energyKwhT7: res.data[0][item][23],
                  energyKwhT8: res.data[0][item][24],
                  qOne: res.data[0][item][25],
                  qTwo: res.data[0][item][26],
                  qThree: res.data[0][item][27],
                  qFour: res.data[0][item][28],
                  mdKva: res.data[0][item][29],
                  mdKvaDateTime: res.data[0][item][30],
                  mdKw: res.data[0][item][31],
                  mdKwDateTime: res.data[0][item][32]
                });
              }
            }
          }
          this.utility.updateApiKey(res.apiKey);
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
        else
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
  getColumnName(): any {

    this.meterPhase = sessionStorage.getItem('MeterPhase');
    if (this.meterPhase == '' || this.meterPhase == 'All' || this.meterPhase == null || this.meterPhase == undefined)
      this.meterPhase = 'Evit';
    if (this.meterPhase == "Evit") {
      return [
        { field: 'meterSNo' },
        { field: 'mdasDateTime', headerName: 'HES Date Time' },
        { field: 'billingDateTime' },
        { field: 'avgPF' },
        { field: 'powerOnDuration' },
        { field: 'powerOffDuration' },
        { field: 'energyExportKvah' },
        { field: 'energyImportKvah' },
        { field: 'energyKvahT1' },
        { field: 'energyKvahT2' },
        { field: 'energyKvahT3' },
        { field: 'energyKvahT4' },
        { field: 'energyKvahT5' },
        { field: 'energyKvahT6' },
        { field: 'energyKvahT7' },
        { field: 'energyKvahT8' },
        { field: 'energyExportKwh' },
        { field: 'energyImportKwh' },
        { field: 'energyKwhT1' },
        { field: 'energyKwhT2' },
        { field: 'energyKwhT3' },
        { field: 'energyKwhT4' },
        { field: 'energyKwhT5' },
        { field: 'energyKwhT6' },
        { field: 'energyKwhT7' },
        { field: 'energyKwhT8' },
        { field: 'mdKva' },
        { field: 'mdKvaDateTime' },
        { field: 'mdKw' },
        { field: 'mdKwDateTime' }


      ];
    }
    else {
      return [
        { field: 'meterSNo' },
        { field: 'mdasDateTime', headerName: 'HES Date Time' },
        { field: 'billingDateTime' },
        { field: 'avgPF' },
        { field: 'powerOnDuration' },
        { field: 'energyExportKvah' },
        { field: 'energyImportKvah' },
        { field: 'energyKvahT1' },
        { field: 'energyKvahT2' },
        { field: 'energyKvahT3' },
        { field: 'energyKvahT4' },
        { field: 'energyKvahT5' },
        { field: 'energyKvahT6' },
        { field: 'energyKvahT7' },
        { field: 'energyKvahT8' },
        { field: 'energyExportKwh' },
        { field: 'energyImportKwh' },
        { field: 'energyKwhT1' },
        { field: 'energyKwhT2' },
        { field: 'energyKwhT3' },
        { field: 'energyKwhT4' },
        { field: 'energyKwhT5' },
        { field: 'energyKwhT6' },
        { field: 'energyKwhT7' },
        { field: 'energyKwhT8' },
        { field: 'qOne', headerName: 'Q1 (Kvarh)' },
        { field: 'qTwo', headerName: 'Q2 (Kvarh)' },
        { field: 'qThree', headerName: 'Q3 (Kvarh)' },
        { field: 'qFour', headerName: 'Q4 (Kvarh)' },
        { field: 'mdKva' },
        { field: 'mdKvaDateTime' },
        { field: 'mdKw' },
        { field: 'mdKwDateTime' }


      ];
    }
  }

}
