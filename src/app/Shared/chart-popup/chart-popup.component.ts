import { DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { IChartTable } from 'src/app/Models/dashboard';
import { DataSharedService } from 'src/app/Services/data-shared.service';

import { DataService } from 'src/app/Services/data.service';
import { Common } from '../Common/common';

@Component({
  selector: 'app-chart-popup',
  templateUrl: './chart-popup.component.html',
  styleUrls: ['./chart-popup.component.scss'],
})
export class ChartPopupComponent implements OnInit {
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  commonClass: Common;
  tableData: any[] = [];
  data: Headernavigation = {
    firstlevel: '',
    menuname: 'Summary',
    url: '/',
  };

  graphHeaderValue: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private chartservice: DataService,
    private datePipe: DatePipe,
    private router: Router,
    private datasharedservice: DataSharedService
  ) {
    this.commonClass = new Common(datasharedservice);
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.columnDefs = [
      { field: 'meterSNo' },
      { field: 'ConsumerNo' },
      { field: 'NICMSISDNNo' },
      { field: 'NICIPV6' },
      { field: 'LastUpdateTime' },
      { field: 'longitude' },
      { field: 'latitude' },
    ];
  }

  ngOnInit() {
    this.datasharedservice.shareChartData.subscribe((data) => {
      let chartData: IChartTable = data;
      if (chartData.commandType != null) {
        setTimeout(() => {
          this.onTableget(
            chartData.commandType,
            chartData.status,
            chartData.daytype
          );
        }, 1000);
      }
    });
  }
  onBtnExport() {
    var excelParams = {
      fileName: this.graphHeaderValue + '.csv',
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

  onTableget(commandType: string, status: string, daytype: string) {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    if (commandType == 'LastComm') {
      this.graphHeaderValue = 'Communication Status';
    } else if (commandType == 'Instant') {
      this.graphHeaderValue = 'Instant Data';
    } else if (commandType == 'DailyLP') {
      this.graphHeaderValue = 'Daily Load Profile Data ';
    } else if (commandType == 'DeltaLP') {
      this.graphHeaderValue = 'Load Profile Data';
    } else if (commandType == 'Events') {
      this.graphHeaderValue = 'Event Data';
    } else if (commandType == 'Billing') {
      this.graphHeaderValue = 'Billing Data';
    }

    let currentDate = new Date();
    let date;
    if (daytype == 'Today')
      date = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    else if (daytype == 'Yesterday')
      date = this.datePipe.transform(
        currentDate.setDate(currentDate.getDate() - 1),
        'yyyy-MM-dd'
      );
    else if (daytype == 'Last Week')
      date = this.datePipe.transform(
        currentDate.setDate(currentDate.getDate() - 7),
        'yyyy-MM-dd'
      );
    else if (daytype == 'Last Month')
      date = this.datePipe.transform(
        currentDate.setDate(currentDate.getDate() - 30),
        'yyyy-MM-dd'
      );
    else date = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    let devType;
    switch (sessionStorage.getItem('MeterPhase')) {
      case 'All':
        devType = 'All';
        break;
      case 'Evit':
        devType = 'Single Phase';
        break;
      case 'Evit3P':
        devType = 'Three Phase';
        break;
      case 'Evit3P1':
        devType = 'CT Meter';
        break;
      case 'EvitHT':
        devType = 'HT Meter';
        break;
      default:
        devType = 'All';
        break;
    }
    this.chartservice
      .getDashboardChartList(commandType, status, date, daytype, devType)
      .subscribe((res: any) => {
        debugger;
        const validData = this.commonClass.checkDataExists(res);
        // if (res.data != null) {
        if (res && res.result === true) {
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.tableData.push({
                meterSNo: res.data[0][item][0],
                ConsumerNo: res.data[0][item][1],
                NICMSISDNNo: res.data[0][item][2],
                NICIPV6: res.data[0][item][3],
                LastUpdateTime: res.data[0][item][4],
                longitude: res.data[0][item][5],
                latitude: res.data[0][item][6],
              });
            }
          }
          this.gridApi.setRowData(this.tableData);
          this.gridColumnApi.autoSizeAllColumns();
        } else {
          this.gridApi.setRowData([]);
        }
      });
  }
}
