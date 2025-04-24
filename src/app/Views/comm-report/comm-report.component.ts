import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RowClassRules } from 'ag-grid-community';
import { DataTableDirective } from 'angular-datatables';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  icon,
  latLng,
  MapOptions,
  marker,
  markerClusterGroup,
  MarkerClusterGroup,
  MarkerClusterGroupOptions,
  TileLayer,
  tileLayer,
} from 'leaflet';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ChartComponent,
} from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { Dashboard, IDashboardChartComman } from 'src/app/Models/dashboard';
import { UserCreate } from 'src/app/Models/user-create';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';
import { DTService } from 'src/app/Services/dt.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
import { Common } from 'src/app/Shared/Common/common';
export interface IMeterInfo {
  consumerName: string;
  meterSerialNo: string;
  ipAddress: string;
  consumerNo: string;
  meterType: string;
  UpdatedDate: string;
  latitude: string;
  longitude: string;
  simType: string;
  isSuccess: boolean;
  status: string;
}
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  colors: any;
  responsive: ApexResponsive[];
};
@Component({
  selector: 'app-comm-report',
  templateUrl: './comm-report.component.html',
  styleUrls: ['./comm-report.component.scss'],
})
export class CommReportComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public meterchartOptions: Partial<ChartOptions>;
  commRead: any[] = [0, 0, 0, 0];
  instantRead: any[] = [0, 0, 0, 0];
  dlpRead: any[] = [0, 0, 0, 0];
  lpRead: any[] = [0, 0, 0, 0];
  billingRead: any[] = [0, 0, 0, 0];
  metertypeRead: any[] = [0, 0, 0, 0];
  eventRead: any[] = [0, 0, 0, 0];

  commchart: any;
  instatnchart: any;
  dlpchart: any;
  lpchart: any;
  eventchart: any;
  billingchart: any;
  metertypechart: any;
  chartData: any[] = [];
  dashboard: Dashboard = new Dashboard();
  data: Headernavigation = {
    firstlevel: '',
    menuname: 'Report',
    url: '/',
  };

  graphHeaderValue: string = '';
  weekdropvalue: string = '';
  weekdate: string = '';
  isclick: boolean = false;
  commonClass: Common;
  formdata: UserCreate = new UserCreate();
  meterInfo: IMeterInfo[] = [];
  isSubdivision: boolean = false;
  isSubstation: boolean = false;
  isFeeder: boolean = false;
  isDT: boolean = false;
  UtilityDropdown: any[] = [];
  SubDivisionDropdown: any[] = [];
  SubStationDropdown: any[] = [];
  FeederDropdown: any[] = [];
  DTDropdown: any[] = [];
  levelName: string = localStorage.getItem('levelName');
  levelValue: string = localStorage.getItem('levelValue');
  resultData: any;
  isChartRendered: boolean = false;

  markerClusterGroup: MarkerClusterGroup;
  markerClusterData = [];
  mapOptions: MapOptions;
  map: any;
  simType: string = 'All';
  commandType: string = 'LastComm';
  inactiveCount: number = 0;
  activeCount: number = 0;
  faultyCount: number = 0;
  markerClusterOptions: MarkerClusterGroupOptions = {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
  };

  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  constructor(
    private chartservice: DataService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,
    private spinner: NgxSpinnerService,
    private subdivisionservice: SubDivisionService,
    private substation: SubStationService,
    private feeder: FeederService,

    private router: Router,
    private dtservice: DTService
  ) {
    let thispage = this;
    this.formdata.roleID = '';

    this.commchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));
          thispage.commandType = 'LastComm';
          thispage.setCommReportChartData();
        },
      },
    };

    this.metertypechart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));

          if (dataPointIndex == 0) {
            thispage.simType = 'AIRTEL';
            thispage.setCommReportChartData();
          } else {
            thispage.simType = 'JIO';
            thispage.setCommReportChartData();
          }
        },
      },
    };

    this.instatnchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));
          thispage.commandType = 'Instant';
          thispage.setCommReportChartData();
        },
      },
    };

    this.dlpchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));
          thispage.commandType = 'DailyLp';
          thispage.setCommReportChartData();
        },
      },
    };

    this.lpchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));
          thispage.commandType = 'DeltaLp';
          thispage.setCommReportChartData();
        },
      },
    };

    this.eventchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));
          thispage.commandType = 'Events';
          thispage.setCommReportChartData();
        },
      },
    };

    this.billingchart = {
      width: 158,
      type: 'donut',
      events: {
        click: function (event, chartContext, config) {
          var el = event.target;
          var dataPointIndex = parseInt(el.getAttribute('j'));
          thispage.commandType = 'Billing';
          thispage.setCommReportChartData();
        },
      },
    };
    this.chartOptions = {
      series: [],

      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64'],
      },
      labels: ['Success', 'Failure', 'Inactive', 'Active', 'Faulty'],
      colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],

      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
    this.meterchartOptions = {
      series: [],

      fill: {
        colors: ['#eb9234', '#6b34eb'],
      },
      labels: ['Airtel', 'JIO'],
      colors: ['#eb9234', '#6b34eb'],

      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: '15px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
    };
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };

    this.columnDefs = [
      { field: 'consumerName' },
      { field: 'meterSerialNo' },
      { field: 'consumerNo' },
      { field: 'meterType' },
      { field: 'simType' },
      { field: 'status' },
      { field: 'ipAddress', headerName: 'NIC IPV6' },
      { field: 'UpdatedDate', headerName: 'Last Update Date' },
      { field: 'latitude' },
      { field: 'longitude' },
    ];
    this.datasharedservice.chagneHeaderNav(this.data);
    this.gridOptions.getRowClass = function (params) {
      console.log(params.data.status);
      if (params.data.status == 'Success') {
        return 'closerowcolor';
      } else if (params.data.status == 'Failure') {
        return 'newrowcolor';
      } else if (params.data.status == 'Inactive') {
        return 'inactiverowcolor';
      } else if (params.data.status == 'Active') {
        return 'activerowcolor';
      } else if (params.data.status == 'Faulty') {
        return 'faultyrowcolor';
      }
    };
  }

  ngOnInit(): void {
    this.formdata.accessOwner = localStorage.getItem('UserID');
    this.datasharedservice.currentweekdropdown.subscribe((data) => {
      let filter = new Date();
      let date;
      if (data == 'Today') date = this.datePipe.transform(filter, 'yyyy-MM-dd');
      else if (data == 'Yesterday')
        date = this.datePipe.transform(
          filter.setDate(filter.getDate() - 1),
          'yyyy-MM-dd'
        );
      else if (data == 'Last Week')
        date = this.datePipe.transform(
          filter.setDate(filter.getDate() - 7),
          'yyyy-MM-dd'
        );
      else if (data == 'Last Month')
        date = this.datePipe.transform(
          filter.setDate(filter.getDate() - 31),
          'yyyy-MM-dd'
        );
      this.weekdropvalue = data;
      this.weekdate = date;

      if (this.isChartRendered) {
        this.setCommReportChartData();
      }
    });

    //this.getDashboardChartComman();
    this.markerClusterGroup = markerClusterGroup({
      removeOutsideVisibleBounds: true,
    });
    this.initializeMapOptions();
  }
  private initializeMapOptions() {
    this.mapOptions = {
      center: latLng(25.467, 91.3662),
      zoom: 9,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data © OpenStreetMap contributors',
        }),
      ],
    };
  }
  onBtnExport() {
    var excelParams = {
      fileName: 'SLAReport.csv',
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

  onMapReady(data: any) {
    this.map = data;
  }
  getDashboardChartComman() {
    this.isChartRendered = true;
    if (this.formdata.roleID == '1') {
      this.levelValue = this.formdata.accessOwner;
      this.levelName = 'All';
    } else if (this.formdata.roleID == '2') {
      this.levelValue = this.formdata.accessSubdivision;
      this.levelName = 'SUBDEVISION';
    } else if (this.formdata.roleID == '3') {
      this.levelValue = this.formdata.accessSubStation;
      this.levelName = 'SUBSTATION';
    } else if (this.formdata.roleID == '4') {
      this.levelValue = 'FEEDER';
      this.levelName = this.formdata.accessFeeder;
    } else if (this.formdata.roleID == '5') {
      this.levelValue = this.formdata.accessDT;
      this.levelName = 'DT';
    }

    this.spinner.show();
    this.chartservice
      .getCommReportChartData(this.levelName, this.levelValue)
      .subscribe((res: any) => {
        const validData = this.commonClass.checkDataExists(res);
        // if (res.data != null) {
          if (res.data && res.data.length > 0) {
          this.resultData = res.data[0];
          this.isclick = false;
          this.simType = 'All';
          this.setCommReportChartData();
        }

        this.spinner.hide();
      });
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  reSetSimType() {
    this.simType = 'All';
    this.setCommReportChartData();
  }
  setCommReportChartData() {
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();

    this.inactiveCount = 0;
    this.activeCount = 0;
    this.faultyCount = 0;
    this.meterInfo = [];
    this.spinner.show();
    this.markerClusterGroup.clearLayers();
    let airtelcount = 0;
    let jiocount = 0;
    let startDate = new Date();
    let endDate = new Date();

    let commSuccessCount = 0;
    let commFailureCount = 0;
    let instantSuccessCount = 0;
    let instantFailureCount = 0;
    let billingSuccessCount = 0;
    let billingFailureCount = 0;
    let dailySuccessCount = 0;
    let dailyFailureCount = 0;
    let deltaSuccessCount = 0;
    let deltaFailureCount = 0;
    let eventSuccessCount = 0;
    let eventFailureCount = 0;

    if (this.weekdropvalue == 'Last Week')
      startDate.setDate(endDate.getDate() - 7);
    else if (this.weekdropvalue == 'Yesterday')
      startDate.setDate(endDate.getDate() - 1);
    else if (this.weekdropvalue == 'Last Month')
      startDate.setDate(endDate.getDate() - 30);
    else startDate.setDate(endDate.getDate());

    for (let item in this.resultData) {
      let lastUpdateDate;
      let isSuccess = false;
      let status = '';
      let simType;

      if (parseInt(item) !== 1) {
        if (this.resultData[item][2] == 'Down') {
          this.inactiveCount++;
          status = 'Inactive';
        } else if (this.resultData[item][2] == 'Active') {
          this.activeCount++;
          status = 'Active';
        } else if (this.resultData[item][2] == 'Faulty') {
          this.faultyCount++;
          status = 'Faulty';
        } else if (
          this.resultData[item][2] == 'null' ||
          this.resultData[item][2] == null ||
          this.resultData[item][2] == ''
        ) {
          this.inactiveCount++;
          status = 'Inactive';
        }

        let title =
          '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
          '<b>CONSUMER NUMBER :</b>' +
          this.resultData[item][3] +
          '<br><b>CONSUMER NAME :</b>' +
          this.resultData[item][0] +
          '<br><b>METER S.NO :</b> ' +
          this.resultData[item][1] +
          '<br><b>LOAD STATUS :</b>' +
          this.resultData[item][4] +
          '<br><b>LATITUDE :</b> ' +
          this.resultData[item][12] +
          '<br><b>LONGITUDE :</b> ' +
          this.resultData[item][12] +
          '</div>';
        let iconurl = '/assets/images/airtelsuccess.png';

        //comm count

        if (this.resultData[item][6] == '-') {
          if (this.commandType == 'LastComm') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            commFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][6]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'LastComm') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            commSuccessCount++;
          } else {
            if (this.commandType == 'LastComm') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                airtelcount++;
                iconurl = '/assets/images/airtelfail.png';
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                jiocount++;
                iconurl = '/assets/images/jiofail.png';
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              commFailureCount++;
          }
        }

        //comm count

        //instant count

        if (this.resultData[item][7] == '-') {
          if (this.commandType == 'Instant') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            instantFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][7]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'Instant') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            instantSuccessCount++;
          } else {
            if (this.commandType == 'Instant') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                jiocount++;
                iconurl = '/assets/images/jiofail.png';
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              instantFailureCount++;
          }
        }

        //instant count

        //billing count

        if (this.resultData[item][8] == '-') {
          if (this.commandType == 'Billing') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][4].substring(0, 4) == '2401'
            ) {
              airtelcount++;
              iconurl = '/assets/images/airtelfail.png';
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][4].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            billingFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][8]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'Billing') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                jiocount++;
                iconurl = '/assets/images/jiosuccess.png';
                simType = 'JIO';
              }
            }
            billingSuccessCount++;
          } else {
            if (this.commandType == 'Billing') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              billingFailureCount++;
          }
        }
        //billing count

        //daily lp count

        if (this.resultData[item][9] == '-') {
          if (this.commandType == 'DailyLp') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            dailyFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][9]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'DailyLp') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            dailySuccessCount++;
          } else {
            if (this.commandType == 'DailyLp') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              dailyFailureCount++;
          }
        }
        //daily lp count

        //delta lp count

        if (this.resultData[item][9] == '-') {
          if (this.commandType == 'DeltaLp') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              simType = 'Airtel';
              airtelcount++;
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            deltaFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][10]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'DeltaLp') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelsuccess.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiosuccess.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            deltaSuccessCount++;
          } else {
            if (this.commandType == 'DeltaLp') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              deltaFailureCount++;
          }
        }
        //delta lp count

        //event  count

        if (this.resultData[item][11] == '-') {
          if (this.commandType == 'Events') {
            isSuccess = false;
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              status = 'Failure';
            if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2401'
            ) {
              iconurl = '/assets/images/airtelfail.png';
              airtelcount++;
              simType = 'Airtel';
            } else if (
              this.resultData[item][5] != null &&
              this.resultData[item][5].substring(0, 4) == '2405'
            ) {
              iconurl = '/assets/images/jiofail.png';
              jiocount++;
              simType = 'JIO';
            }
          }
          if (status != 'Inactive' && status != 'Active' && status != 'Faulty')
            eventFailureCount++;
        } else {
          let dataDate = new Date(this.resultData[item][11]);
          dataDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          if (
            dataDate.getTime() >= startDate.getTime() &&
            dataDate.getTime() <= endDate.getTime()
          ) {
            if (this.commandType == 'Events') {
              isSuccess = true;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Success';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            eventSuccessCount++;
          } else {
            if (this.commandType == 'Events') {
              isSuccess = false;
              if (
                status != 'Inactive' &&
                status != 'Active' &&
                status != 'Faulty'
              )
                status = 'Failure';
              if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2401'
              ) {
                iconurl = '/assets/images/airtelfail.png';
                airtelcount++;
                simType = 'Airtel';
              } else if (
                this.resultData[item][5] != null &&
                this.resultData[item][5].substring(0, 4) == '2405'
              ) {
                iconurl = '/assets/images/jiofail.png';
                jiocount++;
                simType = 'JIO';
              }
            }
            if (
              status != 'Inactive' &&
              status != 'Active' &&
              status != 'Faulty'
            )
              eventFailureCount++;
          }
        }
        //event count

        if (this.commandType == 'LastComm')
          lastUpdateDate = this.resultData[item][6];
        else if (this.commandType == 'Instant')
          lastUpdateDate = this.resultData[item][7];
        else if (this.commandType == 'Billing')
          lastUpdateDate = this.resultData[item][8];
        else if (this.commandType == 'DailyLp')
          lastUpdateDate = this.resultData[item][9];
        else if (this.commandType == 'DeltaLp')
          lastUpdateDate = this.resultData[item][10];
        else if (this.commandType == 'Events')
          lastUpdateDate = this.resultData[item][11];

        if (
          this.resultData[item][5] != null &&
          this.simType == 'AIRTEL' &&
          this.resultData[item][5].substring(0, 4) == '2401'
        ) {
          if (
            this.resultData[item][12] != '-' &&
            this.resultData[item][12] != '--' &&
            this.resultData[item][12] != 'null' &&
            this.resultData[item][12] != 'NaN' &&
            this.resultData[item][13] != '-' &&
            this.resultData[item][13] != '--' &&
            this.resultData[item][13] != 'null' &&
            this.resultData[item][13] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][12]),
                parseFloat(this.resultData[item][13]),
              ],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: iconurl,
                }),
              }
            ).bindPopup(title);
            this.markerClusterGroup.addLayer(newMarker);
            this.markerClusterGroup.addTo(this.map);
          }
          this.meterInfo.push({
            consumerName: this.resultData[item][0],
            UpdatedDate: lastUpdateDate,
            consumerNo: this.resultData[item][2],
            ipAddress: this.resultData[item][4],
            latitude: this.resultData[item][12],
            longitude: this.resultData[item][13],
            meterSerialNo: this.resultData[item][1],
            meterType: this.resultData[item][3],
            isSuccess: isSuccess,
            simType: simType,
            status: status,
          });
        } else if (
          this.resultData[item][5] != null &&
          this.simType == 'JIO' &&
          this.resultData[item][5].substring(0, 4) == '2405'
        ) {
          if (
            this.resultData[item][12] != '-' &&
            this.resultData[item][12] != '--' &&
            this.resultData[item][12] != 'null' &&
            this.resultData[item][12] != 'NaN' &&
            this.resultData[item][13] != '-' &&
            this.resultData[item][13] != '--' &&
            this.resultData[item][13] != 'null' &&
            this.resultData[item][13] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][12]),
                parseFloat(this.resultData[item][13]),
              ],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: iconurl,
                }),
              }
            ).bindPopup(title);
            this.markerClusterGroup.addLayer(newMarker);
            this.markerClusterGroup.addTo(this.map);
          }
          this.meterInfo.push({
            consumerName: this.resultData[item][0],
            UpdatedDate: lastUpdateDate,
            consumerNo: this.resultData[item][3],
            ipAddress: this.resultData[item][5],
            latitude: this.resultData[item][12],
            longitude: this.resultData[item][13],
            meterSerialNo: this.resultData[item][1],
            meterType: this.resultData[item][4],
            isSuccess: isSuccess,
            simType: simType,
            status: status,
          });
        } else if (this.simType == 'All') {
          if (
            this.resultData[item][12] != '-' &&
            this.resultData[item][12] != '--' &&
            this.resultData[item][12] != 'null' &&
            this.resultData[item][12] != 'NaN' &&
            this.resultData[item][13] != '-' &&
            this.resultData[item][13] != '--' &&
            this.resultData[item][13] != 'null' &&
            this.resultData[item][13] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][12]),
                parseFloat(this.resultData[item][13]),
              ],
              {
                icon: icon({
                  iconSize: [40, 40],
                  iconAnchor: [22, 94],
                  popupAnchor: [-3, -76],
                  iconUrl: iconurl,
                }),
              }
            ).bindPopup(title);
            this.markerClusterGroup.addLayer(newMarker);
            this.markerClusterGroup.addTo(this.map);
          }
          this.meterInfo.push({
            consumerName: this.resultData[item][0],
            UpdatedDate: lastUpdateDate,
            consumerNo: this.resultData[item][3],
            ipAddress: this.resultData[item][5],
            latitude: this.resultData[item][12],
            longitude: this.resultData[item][13],
            meterSerialNo: this.resultData[item][1],
            meterType: this.resultData[item][4],
            isSuccess: isSuccess,
            simType: simType,
            status: status,
          });
        }
      }
    }

    this.markerClusterGroup.addTo(this.map);
    this.spinner.hide();

    //this.rerender();
    this.commRead = [
      commSuccessCount,
      commFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.instantRead = [
      instantSuccessCount,
      instantFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.dlpRead = [
      dailySuccessCount,
      dailyFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.lpRead = [
      deltaSuccessCount,
      deltaFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.eventRead = [
      eventSuccessCount,
      eventFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.billingRead = [
      billingSuccessCount,
      billingFailureCount,
      this.inactiveCount,
      this.activeCount,
      this.faultyCount,
    ];
    this.metertypeRead = [airtelcount, jiocount];

    this.gridApi.setRowData(this.meterInfo);
    this.gridColumnApi.autoSizeAllColumns();

    if (this.commandType == 'LastComm') {
      this.graphHeaderValue = 'Communication Status';
    } else if (this.commandType == 'Instant') {
      this.graphHeaderValue = 'Instant Data';
    } else if (this.commandType == 'DailyLp') {
      this.graphHeaderValue = 'Daily Load Profile Data ';
    } else if (this.commandType == 'DeltaLp') {
      this.graphHeaderValue = 'Load Profile Data';
    } else if (this.commandType == 'Events') {
      this.graphHeaderValue = 'Event Data';
    } else if (this.commandType == 'Billing') {
      this.graphHeaderValue = 'Billing Data';
    }
  }

  callFunctionForChart() {
    this.getDashboardChartComman();
  }

  changeAccessLevel(accessvalue: number) {
    if (accessvalue == 2) {
      this.getSubdivision();
      this.isSubdivision = true;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
    } else if (accessvalue == 3) {
      this.getSubdivision();
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = false;
      this.isDT = false;
    } else if (accessvalue == 4) {
      this.getSubdivision();
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = false;
    } else if (accessvalue == 5) {
      this.getSubdivision();
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = true;
    } else {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
    }
  }

  getSubdivision() {
    this.spinner.show();
    this.subdivisionservice
      .getSubdivisionForRegistration(this.formdata.accessOwner)
      .subscribe((res: any) => {
        this.spinner.hide();
        // if (
        //   res != null &&
        //   res.message != 'Key Is Not Valid' &&
        //   res.message != 'Session Is Expired'
        // ) {
        const validData = this.commonClass.checkDataExists(res);
        this.SubDivisionDropdown = [];
        let obj = res.data[0];

        for (var item in obj) {
          this.SubDivisionDropdown.push(obj[item][0]);
        }
        // } else {

        // }
      });
  }

  getSubstation() {
    this.spinner.show();
    this.substation
      .getSubstationBySubdivision(this.formdata.accessSubdivision)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.SubStationDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.SubStationDropdown.push(obj[item][0]);
          }
        }
      });
  }

  getFeeder() {
    this.spinner.show();
    this.feeder
      .getFeederBySubstation(this.formdata.accessSubStation)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.FeederDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.FeederDropdown.push(obj[item][0]);
          }
        }
      });
  }
  getDT() {
    this.spinner.show();
    this.dtservice
      .getDTByFeeder(this.formdata.accessFeeder)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.DTDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.DTDropdown.push(obj[item][0]);
          }
        }
      });
  }

  convertToPDF() {
    var date = new Date();
    this.datePipe.transform(date, 'dd-MM-yyyy');
    this.beforprint();

    window.scrollTo(0, 0);
    html2canvas(document.querySelector('#printingsection')).then((canvas) => {
      // Few necessary setting options
      window.scrollTo(
        0,
        document.body.scrollHeight || document.documentElement.scrollHeight
      );
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'pt', 'a4'); // A4 size page of PDF
      var width = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(contentDataURL);

      const ratio = width / imgProps.width;
      var height = ratio * imgProps.height;
      pdf.internal.pageSize.height = height;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save(
        'SLAReport' + this.datePipe.transform(date, 'dd-MM-yyyy') + '.pdf'
      ); // Generated PDF
    });
    this.afterPrint();
  }

  beforprint() {
    $(
      '.noprint,.page-header,.dataTables_length, .dt-buttons, .dataTables_filter, .dataTables_info'
    ).hide();
    $('#DataTables_Table_0_paginate').hide();
    $('.center').show();
  }

  afterPrint() {
    $(
      '.noprint,.page-header,.dataTables_length, .dt-buttons, .dataTables_filter, .dataTables_info'
    ).show();
    $('.center').hide();
    $('#DataTables_Table_0_paginate').show();
  }
}
