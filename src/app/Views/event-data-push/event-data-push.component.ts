import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MeterData } from 'src/app/Models/meter-data';
import { DataService } from 'src/app/Services/data.service';
import { DeviceService } from 'src/app/Services/device.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
declare let $: any;
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-event-data-push',
  templateUrl: './event-data-push.component.html',
  styleUrls: ['./event-data-push.component.scss'],
})
export class EventDataPushComponent implements OnInit {

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  formdata: MeterData = new MeterData();
  data: Headernavigation = {
    firstlevel: 'Meter Data',
    menuname: 'Event Data Push',
    url: '/EventDataPush',
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
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
  
  
    
    
    
    
    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'meterDateTime' },
      { field: 'dateTime' },
      { field: 'data' },
      { field: 'commandType' },
      { field: 'eventStatusWord' },
      

    ];

    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //this.getEventPushData(new Date(), new Date());
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
  
  logout() {
     
	sessionStorage.clear();
  localStorage.clear();
  this.router.navigate(['/meecl']);
  }

 


  onSubmit(form: NgForm) {
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
    this.service.getEventPushData(this.formdata.fromdate, this.formdata.todate, this.formdata.meterNo).subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        if (res.data != null) {
         console.log(res.data);
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                meterSNo: res.data[0][item][0],
                meterDateTime: res.data[0][item][1],
                dateTime: res.data[0][item][2],
                data: res.data[0][item][3],
                commandType: res.data[0][item][4],
                eventStatusWord: res.data[0][item][5],
               
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
}
