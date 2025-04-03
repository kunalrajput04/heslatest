import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MeterData } from 'src/app/Models/meter-data';
import { DataService } from 'src/app/Services/data.service';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';

import { Utility } from 'src/app/Shared/utility';
import { RowNode } from 'ag-grid-community';
var ageType = 'Select Event Type';
declare let $: any;
@Component({
  selector: 'app-event-data',
  templateUrl: './event-data.component.html',
  styleUrls: ['./event-data.component.scss'],
})
export class EventDataComponent implements OnInit {
  formdata: MeterData = new MeterData();
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Event Data',
    url: '/EventData',
  };
  utility = new Utility();
  commandList: string[] = [];
  meterPhase: string = 'Evit';
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
    this.columnDefs = this.getColumnName();

    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {

    let date = new Date();
    date.setDate(date.getDate());
    this.formdata.fromdate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  onBtnExport() {
    var excelParams = {
      fileName: 'EventData.csv',
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

  doesExternalFilterPass(node: RowNode): boolean {
    return node.data.eventType == ageType;
  }

  isExternalFilterPresent(): boolean {
    return ageType !== 'Select Event Type';
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

    this.service.getEventData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo).subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              if (this.meterPhase == "Evit") {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  mdasDateTime: res.data[0][item][1],
                  eventDateTime: res.data[0][item][2],
                  eventCategory: res.data[0][item][3],
                  eventCode: res.data[0][item][4],
                  eventType: res.data[0][item][5],
                  current: res.data[0][item][6],
                  voltage: res.data[0][item][7],
                  pf: res.data[0][item][8],
                  energyKwh: res.data[0][item][9],
                  tamperCount: res.data[0][item][10],
                });
              }
              else {
                this.tableData.push({
                  meterSNo: res.data[0][item][0],
                  mdasDateTime: res.data[0][item][1],
                  eventDateTime: res.data[0][item][2],
                  eventCategory: res.data[0][item][3],
                  eventCode: res.data[0][item][4],
                  eventType: res.data[0][item][5],
                  rPhC: res.data[0][item][6],
                  yPhC: res.data[0][item][7],
                  bPhC: res.data[0][item][8],
                  rPhV: res.data[0][item][9],
                  yPhV: res.data[0][item][10],
                  bPhV: res.data[0][item][11],
                  rPhPF: res.data[0][item][12],
                  yPhPF: res.data[0][item][13],
                  bPhPF: res.data[0][item][14],
                  energyKwh: res.data[0][item][15],
                  exportKwh: res.data[0][item][16],
                  tamperCount: res.data[0][item][17],
                });
              }
            }
          }
          this.utility.updateApiKey(res.apiKey);;
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
          this.commandList = this.tableData
            .map(e => e['eventType'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(obj => this.tableData[obj])
            .map(e => this.tableData[e].eventType);
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
        { field: 'eventDateTime' },
        { field: 'eventCategory' },
        { field: 'eventCode' },
        { field: 'eventType' },
        { field: 'current' },
        { field: 'voltage' },
        { field: 'pf' },
        { field: 'energyKwh' },
        { field: 'tamperCount' }


      ];
    }
    else {
      return [

        { field: 'meterSNo' },
        { field: 'mdasDateTime', headerName: 'HES Date Time' },
        { field: 'eventDateTime' },
        { field: 'eventCategory' },
        { field: 'eventCode' },
        { field: 'eventType' },
        { field: 'rPhC', headerName: 'R Ph Current' },
        { field: 'yPhC', headerName: 'Y Ph Current' },
        { field: 'bPhC', headerName: 'B Ph Current' },
        { field: 'rPhV', headerName: 'R Ph Voltage' },
        { field: 'yPhV', headerName: 'Y Ph Voltage' },
        { field: 'bPhV', headerName: 'B Ph Voltage' },
        { field: 'rPhPF', headerName: 'R Ph PF' },
        { field: 'yPhPF', headerName: 'Y Ph PF' },
        { field: 'bPhPF', headerName: 'B Ph PF' },
        { field: 'energyKwh',headerName:'Import(Kwh)' },
        { field: 'exportKwh',headerName:'Export(Kwh)' },
        { field: 'tamperCount' }

      ];
    }
  }

}
