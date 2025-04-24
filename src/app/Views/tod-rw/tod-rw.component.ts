import { DatePipe } from '@angular/common';
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
  selector: 'app-tod-rw',
  templateUrl: './tod-rw.component.html',
  styleUrls: ['./tod-rw.component.scss']
})
export class TodRWComponent implements OnInit {

  data: Headernavigation = {
    firstlevel: '',
    menuname: 'TOD R/W',
    url: '/todrw',
  };
  gridApi: any;
  gridColumnApi: any;
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  gridOptions: any;
  tableData: any[] = [];
  utility = new Utility();
  frameworkComponents: any;
  levelName: string = '';
  levelValue: string = '';
  todTime: string;
  todDate: string;
  constructor(private datasharedservice: DataSharedService, private spinner: NgxSpinnerService, private ondemmand: OnDemandService, private toaster: ToastrService, private router: Router, private datePipe: DatePipe) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
    this.frameworkComponents = {
      buttonRenderer: EditButtonComponent,
    };
    this.columnDefs = [

      { field: 'meterSNo' },
      { field: 'hesTime' },
      { field: 'tod1',headerName:'TOD 1' },
      { field: 'tod2',headerName:'TOD 2' },
      { field: 'tod3',headerName:'TOD 3' },
      { field: 'tod4' ,headerName:'TOD 4'},

    

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
    this.ondemmand.getTODList(this.levelValue, this.levelName).subscribe((res: any) => {

      if (res != null && res.message != 'Key Is Not Valid') {
        if (res.data != null) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                meterSNo: res.data[0][item][0],
                hesTime: res.data[0][item][1],
                tod1: res.data[0][item][2] != "" ? res.data[0][item][2].split(",")[0] : "",
                tod2: res.data[0][item][2] != "" ? res.data[0][item][2].split(",")[1] : "",
                tod3: res.data[0][item][2] != "" ? res.data[0][item][2].split(",")[2] : "",
                tod4: res.data[0][item][2] != "" ? res.data[0][item][2].split(",")[3].split("|")[0] : ""

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


  onRtcSync(data: any) {
    let meterno = data.rowData.deviceSerialNo;


  }

  onRtcRead(data: any) {
    let meterno = data.rowData.deviceSerialNo;


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
        'ActivityCalendar',
        this.todTime + '|' + this.datePipe.transform(this.todDate, 'yyyy-MM-dd hh:mm:ss'),
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
