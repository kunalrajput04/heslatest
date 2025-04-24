import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterData, MeterDatas } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';

import { Utility } from 'src/app/Shared/utility';

declare let $: any;

@Component({
  selector: 'app-instant-data',
  templateUrl: './instant-data.component.html',
  styleUrls: ['./instant-data.component.scss'],
})
export class InstantDataComponent implements OnInit {
  formdata: MeterData = new MeterData();

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Instant Data',
    url: '/InstantData',
  };
  utility = new Utility();
  meterPhase: string = 'Evit';
  constructor(
    private service: DataService,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService
  ) {
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
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
      fileName: 'InstantData.csv',
    };
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

  // onSubmit()
  // {
  //   this.formdata.fromdate = this.datePipe.transform(
  //     new Date(this.formdata.fromdate),
  //     'yyyy-MM-dd'
  //   );
  //   this.formdata.todate = this.datePipe.transform(
  //     new Date(this.formdata.todate),
  //     'yyyy-MM-dd'
  //   );

  //   this.tableData = [];
  //   this.gridApi.setRowData([]);
  //   this.gridColumnApi.autoSizeAllColumns();
  //   this.gridApi.showLoadingOverlay();

  //   this.service
  //     .getInstantData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo)
  //     .subscribe((res: any) => {
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         if (res.data != null) {
  //           for (let item in res.data[0]) {
  //             if (parseInt(item) !== 1) {
  //               if (this.meterPhase == "Evit") {
  //                 this.tableData.push({
  //                   meterSNo: res.data[0][item][0],
  //                   meterDateTime: res.data[0][item][1],
  //                   mdasDateTime: res.data[0][item][2],
  //                   energyExportKvah: res.data[0][item][3],
  //                   energyImportKvah: res.data[0][item][4],
  //                   energyExportKwh: res.data[0][item][5],
  //                   energyImportKwh: res.data[0][item][6],
  //                   voltage: res.data[0][item][7],
  //                   phaseCurrent: res.data[0][item][8],
  //                   neutralCurrent: res.data[0][item][9],
  //                   activePowerKw: res.data[0][item][10],
  //                   apparentPowerKva: res.data[0][item][11],
  //                   pf: res.data[0][item][12],
  //                   frequency: res.data[0][item][13],
  //                   loadLimit: res.data[0][item][14],
  //                   loadStatus: res.data[0][item][15],
  //                   mdKva: res.data[0][item][16],
  //                   mdKvaDateTime: res.data[0][item][17],
  //                   mdKw: res.data[0][item][18],
  //                   mdKwDateTime: res.data[0][item][19],
  //                   powerOnDuration: res.data[0][item][20],
  //                   programCount: res.data[0][item][21],
  //                   tamperCount: res.data[0][item][22],

  //                 });
  //               } else {
  //                 this.tableData.push({
  //                   meterSNo: res.data[0][item][0],
  //                   meterDateTime: res.data[0][item][1],
  //                   mdasDateTime: res.data[0][item][2],
  //                   energyImportKwh: res.data[0][item][3],
  //                   energyExportKwh: res.data[0][item][4],
  //                   energyImportKvah: res.data[0][item][5],
  //                   energyExportKvah: res.data[0][item][6],
  //                   q1: res.data[0][item][7],
  //                   q2: res.data[0][item][8],
  //                   q3: res.data[0][item][9],
  //                   q4: res.data[0][item][10],
  //                   activePowerKw: res.data[0][item][11],
  //                   apparentPowerKva: res.data[0][item][12],
  //                   reactivePowerKvar: res.data[0][item][13],
  //                   rPhV: res.data[0][item][14],
  //                   yPhV: res.data[0][item][15],
  //                   bPhV: res.data[0][item][16],
  //                   rPhC: res.data[0][item][17],
  //                   yPhC: res.data[0][item][18],
  //                   bPhC: res.data[0][item][19],
  //                   rPhPF: res.data[0][item][20],
  //                   yPhPF: res.data[0][item][21],
  //                   bPhPF: res.data[0][item][22],
  //                   totalPF: res.data[0][item][23],
  //                   frequency: res.data[0][item][24],
  //                   loadLimit: res.data[0][item][25],
  //                   loadStatus: res.data[0][item][26],
  //                   mdKva: res.data[0][item][27],
  //                   mdKvaDateTime: res.data[0][item][28],
  //                   mdKw: res.data[0][item][29],
  //                   mdKwDateTime: res.data[0][item][30],
  //                   powerOnDuration: res.data[0][item][31],
  //                   programCount: res.data[0][item][32],
  //                   tamperCount: res.data[0][item][33]
  //                 });
  //               }
  //             }
  //           }
  //           this.utility.updateApiKey(res.apiKey);;
  //           this.gridApi.setRowData(this.tableData);
  //           this.gridColumnApi.autoSizeAllColumns();
  //         } else
  //           this.gridApi.setRowData([]);
  //       } else {

  //         
  //       }
  //     });

  // }
  // onSubmit() {
  //   // Date formatting remains the same
  //   this.formdata.fromdate = this.datePipe.transform(
  //     new Date(this.formdata.fromdate),
  //     'yyyy-MM-dd'
  //   );
  //   this.formdata.todate = this.datePipe.transform(
  //     new Date(this.formdata.todate),
  //     'yyyy-MM-dd'
  //   );

  //   this.tableData = [];
  //   this.gridApi.setRowData([]);
  //   this.gridColumnApi.autoSizeAllColumns();
  //   this.gridApi.showLoadingOverlay();

  //   this.service
  //     .getInstantData(
  //       this.formdata.fromdate,
  //       this.formdata.todate,
  //       this.formdata.meterNo
  //     )
  //     .subscribe((res: any) => {
  //       if (res.result && res.data?.length > 0) {
  //         // Get headers from the "1" key
  //         const headers = res.data[0]["1"];

  //         // Process all data rows (starting from "2" onwards)
  //         const dataRows = Object.keys(res.data[0])
  //           .filter(key => key !== "1")
  //           .map(key => res.data[0][key]);

  //         this.tableData = dataRows.map(dataRow => ({
  //           meterSNo: dataRow[0],
  //           meterDateTime: dataRow[1],
  //           mdasDateTime: dataRow[2],
  //           energyExportKvah: dataRow[3],
  //           energyImportKvah: dataRow[4],
  //           energyExportKwh: dataRow[5],
  //           energyImportKwh: dataRow[6],
  //           voltage: dataRow[7],
  //           phaseCurrent: dataRow[8],
  //           neutralCurrent: dataRow[9],
  //           activePowerKw: dataRow[10],
  //           apparentPowerKva: dataRow[11],
  //           pf: dataRow[12],
  //           frequency: dataRow[13],
  //           loadLimit: dataRow[14],
  //           loadStatus: dataRow[15],
  //           mdKva: dataRow[16],
  //           mdKvaDateTime: dataRow[17],
  //           mdKw: dataRow[18],
  //           mdKwDateTime: dataRow[19],
  //           powerOnDuration: dataRow[20],
  //           programCount: dataRow[21],
  //           tamperCount: dataRow[22]
  //         }));

  //         this.gridApi.setRowData(this.tableData);
  //         this.gridColumnApi.autoSizeAllColumns();
  //       } else {
  //         this.gridApi.setRowData([]);
  //       }
  //     });
  // }
  // onSubmit() {
  //   this.formdata.fromdate = this.datePipe.transform(
  //     new Date(this.formdata.fromdate),
  //     'yyyy-MM-dd'
  //   );
  //   this.formdata.todate = this.datePipe.transform(
  //     new Date(this.formdata.todate),
  //     'yyyy-MM-dd'
  //   );

  //   this.tableData = [];
  //   this.gridApi.setRowData([]);
  //   this.gridColumnApi.autoSizeAllColumns();
  //   this.gridApi.showLoadingOverlay();

  //   this.service
  //     .getInstantData(
  //       this.formdata.fromdate,
  //       this.formdata.todate,
  //       this.formdata.meterNo
  //     )
  //     .subscribe((res: any) => {
  //       if (res?.result === true && res.data?.[0]) {
  //         for (let item in res.data[0]) {
  //           if (parseInt(item) !== 1) {
  //             this.tableData.push({
  //               meterSNo: res.data[0][item][0],
  //               meterDateTime: res.data[0][item][1],
  //               mdasDateTime: res.data[0][item][2],
  //               energyExportKvah: res.data[0][item][3],
  //               energyImportKvah: res.data[0][item][4],
  //               energyExportKwh: res.data[0][item][5],
  //               energyImportKwh: res.data[0][item][6],
  //               voltage: res.data[0][item][7],
  //               phaseCurrent: res.data[0][item][8],
  //               neutralCurrent: res.data[0][item][9],
  //               activePowerKw: res.data[0][item][10],
  //               apparentPowerKva: res.data[0][item][11],
  //               pf: res.data[0][item][12],
  //               frequency: res.data[0][item][13],
  //               loadLimit: res.data[0][item][14],
  //               loadStatus: res.data[0][item][15],
  //               mdKva: res.data[0][item][16],
  //               mdKvaDateTime: res.data[0][item][17],
  //               mdKw: res.data[0][item][18],
  //               mdKwDateTime: res.data[0][item][19],
  //               powerOnDuration: res.data[0][item][20],
  //               programCount: res.data[0][item][21],
  //               tamperCount: res.data[0][item][22]
  //             });
  //           }
  //         }
  //         this.gridApi.setRowData(this.tableData);
  //         this.gridColumnApi.autoSizeAllColumns();
  //       } else {
  //         this.gridApi.setRowData([]);
  //       }
  //     });
  // }
  // onSubmit() {
  //   this.formdata.fromdate = this.datePipe.transform(
  //     new Date(this.formdata.fromdate),
  //     'yyyy-MM-dd'
  //   );
  //   this.formdata.todate = this.datePipe.transform(
  //     new Date(this.formdata.todate),
  //     'yyyy-MM-dd'
  //   );

  //   this.tableData = [];
  //   this.gridApi.setRowData([]);
  //   this.gridColumnApi.autoSizeAllColumns();
  //   this.gridApi.showLoadingOverlay();

  //   this.service
  //     .getInstantData(
  //       this.formdata.fromdate,
  //       this.formdata.todate,
  //       this.formdata.meterNo
  //     )
  //     .subscribe({
  //       next: (res: any) => {
  //         if (res?.result === true && res.data?.[0]) {
  //           for (let item in res.data[0]) {
  //             if (parseInt(item) !== 1) {
  //               this.tableData.push({
  //                 meterSNo: res.data[0][item][0],
  //                 meterDateTime: res.data[0][item][1],
  //                 mdasDateTime: res.data[0][item][2],
  //                 energyExportKvah: res.data[0][item][3],
  //                 energyImportKvah: res.data[0][item][4],
  //                 energyExportKwh: res.data[0][item][5],
  //                 energyImportKwh: res.data[0][item][6],
  //                 voltage: res.data[0][item][7],
  //                 phaseCurrent: res.data[0][item][8],
  //                 neutralCurrent: res.data[0][item][9],
  //                 activePowerKw: res.data[0][item][10],
  //                 apparentPowerKva: res.data[0][item][11],
  //                 pf: res.data[0][item][12],
  //                 frequency: res.data[0][item][13],
  //                 loadLimit: res.data[0][item][14],
  //                 loadStatus: res.data[0][item][15],
  //                 mdKva: res.data[0][item][16],
  //                 mdKvaDateTime: res.data[0][item][17],
  //                 mdKw: res.data[0][item][18],
  //                 mdKwDateTime: res.data[0][item][19],
  //                 powerOnDuration: res.data[0][item][20],
  //                 programCount: res.data[0][item][21],
  //                 tamperCount: res.data[0][item][22]
  //               });
  //             }
  //           }
  //           this.gridApi.setRowData(this.tableData);
  //           this.gridColumnApi.autoSizeAllColumns();
  //         } else {
  //           this.gridApi.setRowData([]);
  //           // Show error message to user
  //           this.toastr.error(res.message || 'No data found');
  //         }
  //       },
  //       error: (error: any) => {
  //         this.gridApi.setRowData([]);
  //         // Show error message from the error response
  //         const errorMessage = error.error?.message || 'Something went wrong';
  //         this.toastr.error(errorMessage);
  //       },
  //       complete: () => {
  //         this.gridApi.hideOverlay();
  //       }
  //     });
  // }
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

    this.service
      .getInstantData(
        this.formdata.fromdate,
        this.formdata.todate,
        this.formdata.meterNo
      )
      .subscribe({
        next: (res: any) => {
          if (res?.result === true && res.data?.[0]) {
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  meterDateTime: res.data[0][item][1],
                  mdasDateTime: res.data[0][item][2],
                  energyExportKvah: res.data[0][item][3],
                  energyImportKvah: res.data[0][item][4],
                  energyExportKwh: res.data[0][item][5],
                  energyImportKwh: res.data[0][item][6],
                  voltage: res.data[0][item][7],
                  phaseCurrent: res.data[0][item][8],
                  neutralCurrent: res.data[0][item][9],
                  activePowerKw: res.data[0][item][10],
                  apparentPowerKva: res.data[0][item][11],
                  pf: res.data[0][item][12],
                  frequency: res.data[0][item][13],
                  loadLimit: res.data[0][item][14],
                  loadStatus: res.data[0][item][15],
                  mdKva: res.data[0][item][16],
                  mdKvaDateTime: res.data[0][item][17],
                  mdKw: res.data[0][item][18],
                  mdKwDateTime: res.data[0][item][19],
                  powerOnDuration: res.data[0][item][20],
                  programCount: res.data[0][item][21],
                  tamperCount: res.data[0][item][22],
                });
              }
            }
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else {
            this.gridApi.setRowData([]);
            this.toastr.error(res.message || 'No data found');
          }
        },
        error: (error: any) => {
          this.gridApi.setRowData([]);
          const errorMessage = error.error?.message || 'Something went wrong';
          this.toastr.error(errorMessage);
        },
        complete: () => {
          this.gridApi.hideOverlay();
        },
      });
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  getColumnName(): any {
    this.meterPhase = sessionStorage.getItem('MeterPhase');
    if (
      this.meterPhase == '' ||
      this.meterPhase == 'All' ||
      this.meterPhase == null ||
      this.meterPhase == undefined
    )
      this.meterPhase = 'Evit';
    if (this.meterPhase == 'Evit') {
      return [
        { field: 'meterSNo' },
        { field: 'meterDateTime' },
        { field: 'mdasDateTime', headerName: 'HES Date Time' },
        { field: 'energyExportKvah' },
        { field: 'energyImportKvah' },
        { field: 'energyExportKwh' },
        { field: 'energyImportKwh' },
        { field: 'voltage' },
        { field: 'phaseCurrent' },
        { field: 'neutralCurrent' },
        { field: 'activePowerKw' },
        { field: 'apparentPowerKva' },
        { field: 'pf' },
        { field: 'frequency' },
        { field: 'loadLimit' },
        { field: 'loadStatus' },
        { field: 'mdKva' },
        { field: 'mdKvaDateTime' },
        { field: 'mdKw' },
        { field: 'mdKwDateTime' },
        { field: 'powerOnDuration' },
        { field: 'programCount' },
        { field: 'tamperCount' },
      ];
    } else {
      return [
        { field: 'meterSNo', headerName: 'Meter S.No.' },
        { field: 'meterDateTime', headerName: 'Meter Date Time' },
        { field: 'mdasDateTime', headerName: 'HES Date Time' },
        { field: 'energyImportKwh', headerName: 'Energy Import(Kwh)' },
        { field: 'energyExportKwh', headerName: 'Energy Export(Kwh)' },
        { field: 'energyImportKvah', headerName: 'Energy Import(Kvah)' },
        { field: 'energyExportKvah', headerName: 'Energy Export(Kvah)' },
        { field: 'q1', headerName: 'Q1(Kvarh)' },
        { field: 'q2', headerName: 'Q2(Kvarh)' },
        { field: 'q3', headerName: 'Q3(Kvarh)' },
        { field: 'q4', headerName: 'Q4(Kvarh)' },
        { field: 'activePowerKw', headerName: 'Active Power(Kw)' },
        { field: 'apparentPowerKva', headerName: 'Apparent Power(Kva)' },
        { field: 'reactivePowerKvar', headerName: 'Reactive Power(Kvar)' },
        { field: 'rPhV', headerName: 'R Ph Voltage' },
        { field: 'yPhV', headerName: 'Y Ph Voltage' },
        { field: 'bPhV', headerName: 'B Ph Voltage' },
        { field: 'rPhC', headerName: 'R Ph Current' },
        { field: 'yPhC', headerName: 'Y Ph Current' },
        { field: 'bPhC', headerName: 'B Ph Current' },
        { field: 'rPhPF', headerName: 'R Ph PF' },
        { field: 'yPhPF', headerName: 'Y Ph PF' },
        { field: 'bPhPF', headerName: 'B Ph PF' },
        { field: 'totalPF', headerName: 'Total PF' },
        { field: 'frequency', headerName: 'Frequency' },
        { field: 'loadLimit', headerName: 'Load Limit' },
        { field: 'loadStatus', headerName: 'Load Status' },
        { field: 'mdKva', headerName: 'MD(Kva)' },
        { field: 'mdKvaDateTime', headerName: 'MD Kva Date Time' },
        { field: 'mdKw', headerName: 'MD(Kw)' },
        { field: 'mdKwDateTime', headerName: 'MD Kw Date Time' },
        { field: 'powerOnDuration', headerName: 'Power Off Duration' },
        { field: 'programCount', headerName: 'Program Count' },
        { field: 'tamperCount', headerName: 'Tamper Count' },
      ];
    }
  }
}
