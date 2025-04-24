import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { OnDemandService } from 'src/app/Services/on-demand.service';
import { EditButtonComponent } from 'src/app/Shared/AgGrid/edit-button/edit-button.component';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-rtc-sync',
  templateUrl: './rtc-sync.component.html',
  styleUrls: ['./rtc-sync.component.scss']
})
export class RtcSyncComponent implements OnInit {
  data: Headernavigation = {
    firstlevel: '',
    menuname: 'RTC Synch',
    url: '/rtcsync',
  };
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  gridOptions: any;
  tableData: any[] = [];
  utility = new Utility();
  frameworkComponents: any;
  levelName: string = '';
  levelValue: string = '';
  constructor(private datasharedservice: DataSharedService, private spinner: NgxSpinnerService, private ondemmand: OnDemandService, private toaster: ToastrService, private router: Router) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
    this.frameworkComponents = {
      buttonRenderer: EditButtonComponent,
    };
    this.columnDefs = [

      { field: 'meterSNo' },
      { field: 'hesReadTime' },
      { field: 'meterTime' },

      {
        headerName: 'RTC Synch',

        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRtcSync.bind(this),
          label: 'RTC Synch',
          color: 'red  !important',
          isModal: true
        }
      },
      {
        headerName: 'RTC Read',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onRtcRead.bind(this),
          label: 'RTC Read',
          color: 'blue  !important',
          isModal: true
        }
      }

    ];

    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
  }


  onBtnExport() {
    var excelParams = {
      fileName: 'RTCSync.csv',
      processCellCallback: function (cell) {
        if (cell.column.colId == 'nicMsisdnNo')
          return "\u200C" + cell.value;
        else
          return cell.value;
      },
    };

    this.gridApi.exportDataAsCsv(excelParams);
  }



  onGridReady(params: any) {
    this.levelName = localStorage.getItem('levelName');
    this.levelValue = localStorage.getItem('levelValue');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    params.api.showLoadingOverlay();
    params.api.setRowData([]);
    this.onList();

  }
  onList() {
    this.gridApi.setRowData([]);
    this.tableData = [];
    this.gridApi.showLoadingOverlay();
    this.ondemmand.getRTCList(this.levelValue, this.levelName).subscribe((res: any) => {

      if (res != null && res.message != 'Key Is Not Valid') {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                meterSNo: res.data[0][item][0],
                hesReadTime: res.data[0][item][1],
                meterTime: res.data[0][item][2]
              });
            }
          }
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        }
        else {
          this.gridApi.setRowData([]);
          this.tableData = [];
        }
      }
      else {

        
      }
    }, (err) => {
      this.tableData = [];
      this.gridApi.setRowData([]);
      this.gridColumnApi.autoSizeAllColumns();
      this.toaster.error('something went wrong please try again !!!');
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }


  onRtcRead(data: any) {
    let meterno = data.rowData.meterSNo;
    this.spinner.show();

    this.ondemmand
      .connectDisconnect("InstantRead", meterno)
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res.result == true) {
          this.spinner.hide();
          this.toaster.success('Command Given Successfully');
          this.utility.updateApiKey(res.apiKey);;
        } else {
          this.spinner.hide();
          this.toaster.warning('Command added in the queue.');

        }
      });

  }
  onRTCReadAll() {

    this.spinner.show();
    this.ondemmand
      .RTCFullDataRead(this.levelName,this.levelValue)
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res.data == true) {
          this.spinner.hide();
          this.toaster.success('Command added in the queue.');
          this.utility.updateApiKey(res.apiKey);;
        } else {
          this.spinner.hide();
          this.toaster.success('Command added in the queue.');

        }
      });

  }
  onRtcSync(data: any) {
    let meterno = data.rowData.meterSNo;
    this.levelName = 'METER';
    this.levelValue = meterno;
    this.onSubmit();
  }
  OnRtSetAll() {
    this.levelName = localStorage.getItem('levelName');
    this.levelValue = localStorage.getItem('levelValue');
    this.onSubmit();
  }
 
  onSubmit() {
    this.spinner.show();

    this.ondemmand
      .executeCommandForConfiguration(
        'RTCClock',
        '',
        this.levelName,
        this.levelValue
      )
      .subscribe((res: any) => {
        this.spinner.hide();

        if (res.data != null) {
          if (res.data == true) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.success('Something went wrong !!');
          }
        }
      });
  }


  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

}
