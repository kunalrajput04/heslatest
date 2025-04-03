import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterData } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { OnDemandService } from 'src/app/Services/on-demand.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-full-config-log',
  templateUrl: './full-config-log.component.html',
  styleUrls: ['./full-config-log.component.scss']
})
export class FullConfigLogComponent implements OnInit {
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Log Reports',
    menuname: 'Full Config Log',
    url: '/fullconfiglogs',
  };
  utility = new Utility();
  formdata: MeterData = new MeterData();
  constructor(private datasharedservice: DataSharedService, private datePipe: DatePipe, private service: OnDemandService,
    private router: Router) {

    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'trackingID' },
      { field: 'meterSNo' },
      { field: 'configsCommand' },
      { field: 'configsCommandStatus' },
      { field: 'mdasDateTime',headerName:'HES Date Time' },
      { field: 'commandCompletionDateTime' },
      { field: 'overAllStatus' },
      { field: 'attempts' },

    ];
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }

  onBtnExport() {
    var excelParams = {
      fileName: 'FullConfigLog.csv',
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.onSubmit();
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
      .getFullConfigLog(this.formdata.fromdate, this.formdata.todate)
      .subscribe((res: any) => {

        if (res != null && res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired') {
          if (res.data != null) {

            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  trackingID: res.data[0][item][0],
                  meterSNo: res.data[0][item][1],
                  configsCommand: res.data[0][item][2],
                  configsCommandStatus: res.data[0][item][3],
                  mdasDateTime: res.data[0][item][4],
                  commandCompletionDateTime: res.data[0][item][5],
                  overAllStatus: res.data[0][item][6],
                  attempts: res.data[0][item][7],
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
