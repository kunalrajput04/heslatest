import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RowNode } from 'ag-grid-community';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterData, MeterDatas } from 'src/app/Models/meter-data';
import { AuthService } from 'src/app/Services/auth.service';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';
import { Utility } from 'src/app/Shared/utility';
import { CommandLogChartComponent } from '../command-log-chart/command-log-chart.component';
var ageType = 'Select Command Type';
@Component({
  selector: 'app-command-log',
  templateUrl: './command-log.component.html',
  styleUrls: ['./command-log.component.scss'],

})
export class CommandLogComponent implements OnInit {
  formdata: MeterData = new MeterData();
  @ViewChild(CommandLogChartComponent) child: CommandLogChartComponent;

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  commandList: string[] = [];
  data: Headernavigation = {
    firstlevel: 'Settings',
    menuname: 'Command Logs',
    url: '/commandlog',
  };
  utility = new Utility();

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
      resizable: true, filter: false, sortable: true, floatingFilter: false,
    };

    this.columnDefs = [
      { field: 'trackingID' },
      { field: 'meterSNo' },

      {
        field: 'commandName'
      },
      { field: 'mdasDateTime',headerName:'HES Date Time' },
      { field: 'commandCompletionDateTime' },
      { field: 'status' },
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
      fileName: 'CommandLogs.csv',
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    params.api.showLoadingOverlay();
   
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }




  externalFilterChanged(newValue: string) {

    ageType = newValue;
    this.gridApi.onFilterChanged();
  }

  onSubmit() {
    this.commandList = [];
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
    this.child.getInstant(this.formdata.fromdate,this.formdata.todate);
    this.service.getCommandLogData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo).subscribe((res: any) => {
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
          this.commandList = this.tableData
            .map(e => e['commandName'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(obj => this.tableData[obj])
            .map(e => this.tableData[e].commandName);
        }
        else
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
