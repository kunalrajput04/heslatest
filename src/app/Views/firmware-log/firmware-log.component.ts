import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterData } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { OnDemandService } from 'src/app/Services/on-demand.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-firmware-log',
  templateUrl: './firmware-log.component.html',
  styleUrls: ['./firmware-log.component.scss']
})
export class FirmwareLogComponent implements OnInit {
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Log Reports',
    menuname: 'Firmware Logs',
    url: '/firmwarelogs',
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
      { field: 'firmwareFile' },
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
      .getFirmwareLogs(this.formdata.fromdate, this.formdata.todate)
      .subscribe((res: any) => {
        if (res != null && res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired') {
          if (res.data != null) {
            
            for (let item in res.data[0]) {
              if (parseInt(item) !== 1) {
                this.tableData.push({
                  trackingID: res.data[0][item][0],
                  meterSNo: res.data[0][item][1],
                  firmwareFile: res.data[0][item][2],
                  mdasDateTime: res.data[0][item][3],
                  commandCompletionDateTime: res.data[0][item][4],
                  status: res.data[0][item][5],
                  attempts: res.data[0][item][6],
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
