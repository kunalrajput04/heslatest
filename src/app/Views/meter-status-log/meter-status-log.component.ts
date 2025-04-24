import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterData } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-meter-status-log',
  templateUrl: './meter-status-log.component.html',
  styleUrls: ['./meter-status-log.component.scss']
})
export class MeterStatusLogComponent implements OnInit {


  formdata: MeterData = new MeterData();

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Log Reports',
    menuname: 'Meter Status Log',
    url: '/meterstatuslog',
  };
  utility = new Utility();

  constructor(
    private service: DataService,
    private router: Router,
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
      { field: 'mdasDateTime' },
      { field: 'commandCompletionDateTime' },
      { field: 'status' },
      { field: 'attempts' }
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

    this.service
      .getMeterStatusLogData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo)
      .subscribe((res: any) => {
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
            this.utility.updateApiKey(res.apiKey);;
            this.gridApi.setRowData(this.tableData);
            this.gridColumnApi.autoSizeAllColumns();
          } else
            this.gridApi.setRowData([]);
        } else {

          
        }
      });

  }

  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }





}
