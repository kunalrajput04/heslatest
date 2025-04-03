import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterDatas } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-all-command-log',
  templateUrl: './all-command-log.component.html',
  styleUrls: ['./all-command-log.component.scss']
})
export class AllCommandLogComponent implements OnInit {
  formdata: MeterDatas = new MeterDatas();
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  data: Headernavigation = {
    firstlevel: 'Settings',
    menuname: 'Report',
    url: '/configreport',
  };
  utility = new Utility();
  constructor(
    private service: DataService,
    private router: Router,
   // private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,

  ) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'trackingID' },
      { field: 'meterSNo' },
      { field: 'commandName' },
      { field: 'mdasDateTime',headerName:'HES Date Time' },
      { field: 'commandCompletionDateTime' },
      { field: 'status' },
      { field: 'attempts' },



    ];
    this.datasharedservice.chagneHeaderNav(this.data);
  }
  ngOnInit(): void {

    this.formdata.start_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.end_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  onBtnExport() {
    var excelParams = {
      fileName: 'FullCommandLogs.csv',
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  // onGridReady(params: any) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.setRowData([]);
  //   this.gridColumnApi.autoSizeAllColumns();
  //   params.api.showLoadingOverlay();
  //   this.service.getAllCommandLogs(this.formdata.start_date, this.formdata.end_date).subscribe((res: any) => {
  //     if (res != null && res.message != 'Key Is Not Valid') {
  //       if (res.data != null) {
  //         for (let item in res.data[0]) {
  //           if (parseInt(item) !== 1) {
  //             this.tableData.push({
  //               trackingID: res.data[0][item][0],
  //               meterSNo: res.data[0][item][1],
  //               commandName: res.data[0][item][2],
  //               mdasDateTime: res.data[0][item][3],
  //               commandCompletionDateTime: res.data[0][item][4],
  //               status: res.data[0][item][5],
  //               attempts: res.data[0][item][6]
  //             });
  //           }
  //         }
  //         this.gridApi.setRowData(this.tableData);
  //         this.gridColumnApi.autoSizeAllColumns();
  //       }
  //       else {
  //         this.gridApi.setRowData([]);
  //       }
  //       this.utility.updateApiKey(res.apiKey);
  //     } else {
  //       this.logout();
  //     }
  //   });
  // }


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onSubmit() {
    this.formdata.start_date = this.datePipe.transform(
      new Date(this.formdata.start_date),
      'yyyy-MM-dd'
    );
    this.formdata.end_date = this.datePipe.transform(
      new Date(this.formdata.end_date),
      'yyyy-MM-dd'
    );

    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    //this.gridApi.showLoadingOverlay();

    this.service.getAllCommandLogs(this.formdata.start_date, this.formdata.end_date).subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        if (res.data != null) {

          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                trackingID: res.data[0][item][0],
                meterSNo: res.data[0][item][1],
                commandName: res.data[0][item][2],
                mdasDateTime: res.data[0][item][3],
                commandCompletionDateTime: res.data[0][item][4],
                status: res.data[0][item][5],
                attempts: res.data[0][item][6]

              });
            }
          }
          
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
        else
          this.gridApi.setRowData([]);

          this.utility.updateApiKey(res.apiKey);
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
