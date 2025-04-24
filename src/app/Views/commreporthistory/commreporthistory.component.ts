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
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
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
export interface IMeterInfo1 {
  consumerName: string;
  meterSerialNo: string;
  consumerNo: string;
  meterType: string;
  SLADateTime: string;
  installationDate: string;
  latitude: string;
  longitude: string;
  subDivision: string;
  NWType: string;
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
  selector: 'app-commreporthistory',
  templateUrl: './commreporthistory.component.html',
  styleUrls: ['./commreporthistory.component.scss']
})
export class CommreporthistoryComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public meterchartOptions: Partial<ChartOptions>;
  commRead: any[] = [0, 0, 0, 0];
  instantRead: any[] = [0, 0, 0, 0];
  metertypeRead: any[] = [0, 0, 0, 0];
  
  commchart: any;
  instatnchart: any;
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
  meterInfo1: IMeterInfo1[] = [];
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
  totalCount: number = 0;
  successCount: number = 0;
  failureCount: number = 0;
  inactiveCount: number = 0;
  activeCount: number = 0;
  faultyCount: number = 0;
  successPerventage: number = 0;
  failurePerventage: number = 0;
  inactivePerventage: number = 0;
  faultyPerventage: number = 0;
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
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };

    this.columnDefs = [
      { field: 'SLADateTime' },
      { field: 'subDivision' },
      { field: 'meterSerialNo' },
      { field: 'consumerName' },
      { field: 'consumerNo' },
      { field: 'installationDate' },
      { field: 'latitude' },
      { field: 'longitude' },
      { field: 'meterType' },
      { field: 'NWType' },
      { field: 'status' },
    ];
    this.datasharedservice.chagneHeaderNav(this.data);
    this.gridOptions.getRowClass = function (params) {
      
      if (params.data.status == 'Success') {
        return 'closerowcolor';
      }
      else if (params.data.status == 'Failure') {
        return 'newrowcolor';
      }
      else if (params.data.status == 'Inactive') {
        return 'inactiverowcolor';
      }
      else if (params.data.status == 'Active') {
        return 'activerowcolor';
      }
      else if (params.data.status == 'Faulty') {
        return 'faultyrowcolor';
      }
    }
    this.commonClass = new Common(datasharedservice);
  }

  ngOnInit(): void {
    this.formdata.accessOwner = localStorage.getItem('UserID');
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
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
      center: latLng(25.4670, 91.3662),
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


  onMapReady(data: any) {
    this.map = data;
  }
  getDashboardChartComman() {
    this.formdata.fromdate = this.datePipe.transform(
      new Date(this.formdata.fromdate),
      'yyyy-MM-dd'
    );
    this.formdata.todate = this.datePipe.transform(
      new Date(this.formdata.todate),
      'yyyy-MM-dd'
    );
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
      //.getCommReportChartData1(this.levelName, this.levelValue, this.startDate, this.endDate)
      .getCommReportChartData1(this.levelName, this.levelValue, this.formdata.fromdate, this.formdata.todate)
      .subscribe((res: any) => {
       
        // if (
        //   res != null &&
        //   res.message != 'Key Is Not Valid' &&
        //   res.message != 'Session Is Expired'
        // ) {
        const validData = this.commonClass.checkDataExists(res);
          if (res.data != null) {
            
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

    this.totalCount = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.inactiveCount = 0;
    this.activeCount = 0;
    this.faultyCount = 0;
    this.meterInfo = [];
    this.meterInfo1 = [];
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
    
    for (let item in this.resultData) {
      //alert(this.resultData[item]);
      //alert(this.totalCount);
      
      let lastUpdateDate;
      let isSuccess = false;
      let status = '';
      let simType;
      //console.log("---------------->>>>>>>COM Count",commSuccessCount);
      if (parseInt(item) !== 1) {
        this.totalCount++;
        if (this.resultData[item][10] == 'Inactive') {
          this.inactiveCount++;
          status = 'Inactive';
        }
        else if (this.resultData[item][10] == 'Failure') {
          this.failureCount++;
          status = 'Failure';
        }
        else if (this.resultData[item][10] == 'Faulty') {
          this.faultyCount++;
          status = 'Faulty';
        }
        if (this.resultData[item][10] == 'Success') {
          this.successCount++;
          status = 'Success';
        }
        else if (this.resultData[item][10] == 'null' || this.resultData[item][10] == null || this.resultData[item][10] == '') {
          //this.inactiveCount++;
          //status = 'Success';
        }

        let title =
          '<div style="height:auto; width: auto; color:black;font-weigh:bold;font-size:14px;text-align:left;">' +
          '<b>CONSUMER NUMBER :</b>' +
          this.resultData[item][4] +
          '<br><b>CONSUMER NAME :</b>' +
          this.resultData[item][3] +
          '<br><b>METER S.NO :</b> ' +
          this.resultData[item][2] +
          '<br><b>STATUS :</b>' +
          this.resultData[item][10] +
          '<br><b>LATITUDE :</b> ' +
          this.resultData[item][6] +
          '<br><b>LONGITUDE :</b> ' +
          this.resultData[item][7] +
          '</div>';
        let iconurl = '/assets/images/airtelsuccess.png';

        //comm count

        if (this.resultData[item][10] == 'Success')
        {
          if(this.resultData[item][9] == 'Airtel')
          {
            iconurl = '/assets/images/airtelsuccess.png';
            simType = 'Airtel';
          }
          else{
            iconurl = '/assets/images/jiosuccess.png';
            simType = 'JIO';
          }

        }
        else{
          if(this.resultData[item][9] == 'Airtel')
          {
            iconurl = '/assets/images/airtelfail.png';
            simType = 'Airtel';
          }
          else{
            iconurl = '/assets/images/jiofail.png';
            simType = 'JIO';
          }
        }
        if (this.resultData[item][9] == 'Airtel' ) {
          if (this.resultData[item][6] != '-' && this.resultData[item][6] != '--' && this.resultData[item][6] != 'null' && this.resultData[item][6] != 'NaN' &&
            this.resultData[item][7] != '-' && this.resultData[item][7] != '--' && this.resultData[item][7] != 'null' && this.resultData[item][7] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][6]),
                parseFloat(this.resultData[item][7]),
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
          this.meterInfo1.push({
           SLADateTime: this.resultData[item][0],
           subDivision: this.resultData[item][1],
           meterSerialNo: this.resultData[item][2],
           consumerName:this.resultData[item][3] ,
           consumerNo: this.resultData[item][4],
           installationDate: this.resultData[item][5],
           latitude: this.resultData[item][6],
           longitude: this.resultData[item][7],
           meterType: this.resultData[item][8],
           NWType: this.resultData[item][9],
                // isSuccess: boolean;
           status: this.resultData[item][10]
          });
        } else if (this.resultData[item][9] != 'JIO') {
          if (this.resultData[item][6] != '-' && this.resultData[item][6] != '--' && this.resultData[item][6] != 'null' && this.resultData[item][6] != 'NaN' &&
            this.resultData[item][7] != '-' && this.resultData[item][7] != '--' && this.resultData[item][7] != 'null' && this.resultData[item][7] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][6]),
                parseFloat(this.resultData[item][7]),
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
          this.meterInfo1.push({
            SLADateTime: this.resultData[item][0],
            subDivision: this.resultData[item][1],
            meterSerialNo: this.resultData[item][2],
            consumerName:this.resultData[item][3] ,
            consumerNo: this.resultData[item][4],
            installationDate: this.resultData[item][5],
            latitude: this.resultData[item][6],
            longitude: this.resultData[item][7],
            meterType: this.resultData[item][8],
            NWType: this.resultData[item][9],
            status: this.resultData[item][10]
          });
        } else{

          if (this.resultData[item][6] != '-' && this.resultData[item][6] != '--' && this.resultData[item][6] != 'null' && this.resultData[item][6] != 'NaN' &&
            this.resultData[item][7] != '-' && this.resultData[item][7] != '--' && this.resultData[item][7] != 'null' && this.resultData[item][7] != 'NaN'
          ) {
            const newMarker = marker(
              [
                parseFloat(this.resultData[item][6]),
                parseFloat(this.resultData[item][7]),
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
          this.meterInfo1.push({
            SLADateTime: this.resultData[item][0],
            subDivision: this.resultData[item][1],
            meterSerialNo: this.resultData[item][2],
            consumerName:this.resultData[item][3] ,
            consumerNo: this.resultData[item][4],
            installationDate: this.resultData[item][5],
            latitude: this.resultData[item][6],
            longitude: this.resultData[item][7],
            meterType: this.resultData[item][8],
            NWType: this.resultData[item][9],
            status: this.resultData[item][10]
          });
        }
      }
    }
    this.successPerventage =  this.successCount*100/this.totalCount;
    this.failurePerventage =  this.failureCount*100/this.totalCount;
    this.inactivePerventage =  this.inactiveCount*100/this.totalCount;
    this.faultyPerventage =  this.faultyCount*100/this.totalCount;
  
    this.markerClusterGroup.addTo(this.map);
    this.spinner.hide();

    //this.rerender();
    this.commRead = [this.successCount,this.failureCount, this.inactiveCount, this.activeCount, this.faultyCount];
    this.instantRead = [this.successPerventage, this.failurePerventage, this.inactivePerventage, this.faultyPerventage];
   this.metertypeRead = [airtelcount, jiocount];

    this.gridApi.setRowData(this.meterInfo1);
    this.gridColumnApi.autoSizeAllColumns();

    if (this.commandType == 'LastComm') {
      this.graphHeaderValue = 'Communication Status';
    } else if (this.commandType == 'Instant') {
      this.graphHeaderValue = 'Communication Status(%)';
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
      this.getSubdivision1();
      this.isSubdivision = true;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
    } else if (accessvalue == 3) {
      this.getSubdivision1();
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = false;
      this.isDT = false;
    } else if (accessvalue == 4) {
      this.getSubdivision1();
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = false;
    } else if (accessvalue == 5) {
      this.getSubdivision1();
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

  getSubdivision1() {
    this.spinner.show();
    this.subdivisionservice
      .getSubdivisionForRegistration(this.formdata.accessOwner)
      .subscribe((res: any) => {
        
        this.spinner.hide();
        if (
          res != null &&
          res.message != 'Key Is Not Valid' &&
          res.message != 'Session Is Expired'
        ) {
          this.SubDivisionDropdown = [];
          let obj = res.data[0];

          for (var item in obj) {
            this.SubDivisionDropdown.push(obj[item][0]);
          }
        } else {
          
        }
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
  

  // onSubmit(){
  //   this.formdata.fromdate = this.datePipe.transform(
  //     new Date(this.formdata.fromdate),
  //     'yyyy-MM-dd'
  //   );
  //   this.formdata.todate = this.datePipe.transform(
  //     new Date(this.formdata.todate),
  //     'yyyy-MM-dd'
  //   );

  //   this.spinner.show();
  //   this.chartservice
  //     .getCommReportChartData1(this.levelName, this.levelValue, this.formdata.fromdate, this.formdata.todate)
  //     .subscribe((res: any) => {
               
  //       if (
  //         res != null &&
  //         res.message != 'Key Is Not Valid' &&
  //         res.message != 'Session Is Expired'
  //       ) {
  //         if (res.data != null) {
            
  //           this.resultData = res.data[0];
  //           this.isclick = false;
  //           this.simType = 'All';
            
  //           for(let item in this.resultData){
  //             //console.log(this.resultData[item])
  //             if (parseInt(item) !== 1) {
  //              // console.log(item)
  //              this.meterInfo1.push({
  //               SLADateTime: this.resultData[item][0],
  //               subDivision: this.resultData[item][1],
  //               meterSerialNo: this.resultData[item][2],
  //               consumerName:this.resultData[item][3] ,
  //               consumerNo: this.resultData[item][4],
  //               installationDate: this.resultData[item][5],
  //               latitude: this.resultData[item][6],
  //               longitude: this.resultData[item][7],
  //               meterType: this.resultData[item][8],
  //               NWType: this.resultData[item][9],
  //               status: this.resultData[item][10]
  //             });
  //             }
              
  //           }
  //           this.gridApi.setRowData(this.meterInfo1);
  //           this.gridColumnApi.autoSizeAllColumns();
  //         }
  //       } else {
  //         
  //       }
  //       this.spinner.hide();

        
  //     });
      
  // }

  
  }

