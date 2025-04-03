import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ChartComponent,
  ApexResponsive,
  ApexDataLabels,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Headernavigation } from 'src/app/Model/headernavigation';
import {
  Dashboard,
  IChartTable,
  IDashboardChartComman,
} from 'src/app/Models/dashboard';
import { AuthService } from 'src/app/Services/auth.service';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';

import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartPopupComponent } from 'src/app/Shared/chart-popup/chart-popup.component';
import { Utility } from 'src/app/Shared/utility';

declare let $: any;
declare let L: any;
declare const GetMap: any;
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dashboard: Dashboard = new Dashboard();
  dashboardChartComman: IDashboardChartComman;
  @ViewChild('chart') chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions>;
  public chartOptions4: Partial<ChartOptions>;
  public chartOptions5: Partial<ChartOptions>;
  public chartOptions6: Partial<ChartOptions>;
  chartBillings: any[] = [];
  Instant: any[] = [];
  Events: any[] = [];
  DailyLP: any[] = [];
  Connect: any[] = [];
  Disconnect: any[] = [];
  LastComm: any[] = [];

  selectedDate: any;
  weekdropvalue: string = '';
  data: Headernavigation = {
    firstlevel: '',
    menuname: 'Dashboard',
    url: '/',
  };
  isReload: boolean = false;

  dropdownvalue: string = '';
  utility = new Utility();
  meterPhase: string = sessionStorage.getItem('MeterPhase');
  constructor(
    private chartservice: DataService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService,
    private authservice: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {

    let thispage = this;
    this.isReload = JSON.parse(sessionStorage.getItem('IsReload'));
    if (!this.isReload) {
      sessionStorage.setItem('IsReload', 'true');
      window.location.reload();
    }
    this.datasharedservice.chagneHeaderNav(this.data);

    this.chartOptions = {
      series: [0],
      labels: ['Total Meters'],
      fill: {
        colors: ['#5f9ea0'],
      },
      colors: ['#5f9ea0'],
      chart: {
        width: 180,
        type: 'donut',
      },

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

    this.chartOptions1 = {
      series: [],

      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      },
      labels: ['Success', 'Failure', 'Inactive', 'Active', 'Faulty'],
      colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      chart: {
        width: 180,
        type: 'donut',

        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));
            if (dataPointIndex == 0) {
              thispage.onTableget('LastComm', 'Success');
            } else if (dataPointIndex == 2) {
              thispage.onTableget('LastComm', 'Inactive');

            } else if (dataPointIndex == 3) {
              thispage.onTableget('LastComm', 'Active');

            } else if (dataPointIndex == 4) {
              thispage.onTableget('LastComm', 'Faulty');

            } else {
              thispage.onTableget('LastComm', 'Failure');
            }
          },
        },
      },
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
    this.chartOptions2 = {
      series: [],
      labels: ['Success', 'Failure', 'Inactive', 'Active', 'Faulty'],
      colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      },
      chart: {
        width: 180,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              thispage.onTableget('Instant', 'Success');
            } else if (dataPointIndex == 2) {
              thispage.onTableget('Instant', 'Inactive');

            } else if (dataPointIndex == 3) {
              thispage.onTableget('Instant', 'Active');

            } else if (dataPointIndex == 4) {
              thispage.onTableget('Instant', 'Faulty');

            } else {
              thispage.onTableget('Instant', 'Failure');
            }
          },
        },
      },
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
    this.chartOptions3 = {
      series: [],
      labels: ['Success', 'Failure', 'Inactive', 'Active', 'Faulty'],
      colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      },
      chart: {
        width: 180,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              thispage.onTableget('DailyLP', 'Success');
            } else if (dataPointIndex == 2) {
              thispage.onTableget('DailyLP', 'Inactive');

            } else if (dataPointIndex == 3) {
              thispage.onTableget('DailyLP', 'Active');

            } else if (dataPointIndex == 4) {
              thispage.onTableget('DailyLP', 'Faulty');

            } else {
              thispage.onTableget('DailyLP', 'Failure');
            }
          },
        },
      },
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
    this.chartOptions4 = {
      series: [],
      labels: ['Success', 'Failure', 'Inactive', 'Active', 'Faulty'],
      colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      },
      chart: {
        width: 180,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              thispage.onTableget('DeltaLP', 'Success');
            } else if (dataPointIndex == 2) {
              thispage.onTableget('DeltaLP', 'Inactive');

            } else if (dataPointIndex == 3) {
              thispage.onTableget('DeltaLP', 'Active');

            } else if (dataPointIndex == 4) {
              thispage.onTableget('DeltaLP', 'Faulty');

            } else {
              thispage.onTableget('DeltaLP', 'Failure');
            }
          },
        },
      },
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
    this.chartOptions5 = {
      series: [],
      labels: ['Success', 'Failure', 'Inactive', 'Active', 'Faulty'],
      colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      },
      chart: {
        width: 180,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              thispage.onTableget('Events', 'Success');
            } else if (dataPointIndex == 2) {
              thispage.onTableget('Events', 'Inactive');

            } else if (dataPointIndex == 3) {
              thispage.onTableget('Events', 'Active');

            } else if (dataPointIndex == 4) {
              thispage.onTableget('Events', 'Faulty');

            } else {
              thispage.onTableget('Events', 'Failure');
            }


          },
        },
      },
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
    this.chartOptions6 = {
      series: [],
      labels: ['Success', 'Failure', 'Inactive', 'Active', 'Faulty'],
      colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      fill: {
        colors: ['#00D100', '#B32824', '#6e6d64', '#0307fc', '#fcb503'],
      },
      chart: {
        width: 180,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              thispage.onTableget('Billing', 'Success');
            } else if (dataPointIndex == 2) {
              thispage.onTableget('Billing', 'Inactive');

            } else if (dataPointIndex == 3) {
              thispage.onTableget('Billing', 'Active');

            } else if (dataPointIndex == 4) {
              thispage.onTableget('Billing', 'Faulty');

            } else {
              thispage.onTableget('Billing', 'Failure');
            }
          },
        },
      },
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
  }

  ngOnInit(): void {

    let levelName = localStorage.getItem('levelName');

    if (levelName == 'All') {
      this.getDashboardChartComman('Last Week');
    } else {
      this.getDashboard();
    }
    this.datasharedservice.currentweekdropdown.subscribe((data) => {
      this.dropdownvalue = data;
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
      else date = this.datePipe.transform(filter, 'yyyy-MM-dd');
      this.weekdropvalue = date;
      if (levelName == 'All') {
        if (data != '') this.getDashboardChartCommanData(data);
      } else {
        if (data == '') {
          this.getDashboardChart(
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        } else {
          this.getDashboardChart(data);
        }
      }
    });

    GetMap();
  }
  getDashboard() {
    this.authservice.getDashboard().subscribe((res: any) => {

      if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {

        this.dashboard = res.data;

        this.chartOptions.series = [
          res.data['1P'],

        ];
        this.utility.updateApiKey(res.apiKey);;
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

  onTableget(commandType: string, status: string) {
    let chartData: IChartTable = {
      commandType: commandType,
      daytype: this.dropdownvalue,
      status: status,
    };
    this.datasharedservice.shareChartTableFunc(chartData);
    if (this.weekdropvalue == '') {
      this.weekdropvalue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    const modalRef = this.modalService.open(ChartPopupComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.result.then(
      (data: any) => {
        if (data == 'Accept') {
          modalRef.close();
        } else {
        }
      },
      (reason: any) => { }
    );
  }

  getDashboardChart(date: string) {
    let meterPhase = sessionStorage.getItem('MeterPhase');
    let filter = new Date();
    if (date == 'Today') date = this.datePipe.transform(filter, 'yyyy-MM-dd');
    else if (date == 'Yesterday')
      date = this.datePipe.transform(
        filter.setDate(filter.getDate() - 1),
        'yyyy-MM-dd'
      );
    else if (date == 'Last Week')
      date = this.datePipe.transform(
        filter.setDate(filter.getDate() - 7),
        'yyyy-MM-dd'
      );
    else if (date == 'Last Month')
      date = this.datePipe.transform(
        filter.setDate(filter.getDate() - 31),
        'yyyy-MM-dd'
      );
    else date = this.datePipe.transform(filter, 'yyyy-MM-dd');
    this.weekdropvalue = date;
    this.chartservice
      .getDashboardChart('LastComm', date,meterPhase)
      .subscribe((res: any) => {

        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          if (res.data != null) {
            
            this.chartOptions1.series = res.data[0][2];
          }
        } else {
          this.logout();
        }
      });

    this.chartservice
      .getDashboardChart('Instant', date,meterPhase)
      .subscribe((res: any) => {
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          if (res.data != null) {
            this.chartOptions2.series = res.data[0][2];
          }
        }
        else {

          this.logout();
        }
      });
    this.chartservice
      .getDashboardChart('DailyLP', date,meterPhase)
      .subscribe((res: any) => {
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          if (res.data != null) {
            this.chartOptions3.series = res.data[0][2];
          }
        }
        else {

          this.logout();
        }
      });
    this.chartservice
      .getDashboardChart('DeltaLP', date,meterPhase)
      .subscribe((res: any) => {
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          if (res.data != null) {
            this.chartOptions4.series = res.data[0][2];
          }
        }
        else {

          this.logout();
        }
      });
    this.chartservice
      .getDashboardChart('Events', date,meterPhase)
      .subscribe((res: any) => {
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          if (res.data != null) {
            this.chartOptions5.series = res.data[0][2];
          }
        }
        else {

          this.logout();
        }
      });

    this.chartservice
      .getDashboardChart('Billing', date,meterPhase)
      .subscribe((res: any) => {
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          if (res.data != null) {
            this.chartOptions6.series = res.data[0][2];
          }
        }
        else {
          this.logout();
        }
      });
  }
  getDashboardChartComman(date: string) {
    
    let meterPhase = sessionStorage.getItem('MeterPhase');
    this.chartservice.getDashboardChartComman(meterPhase).subscribe((res: any) => {
      if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {

        if (res.data != null) {
          this.dashboardChartComman = res.data[0];
          sessionStorage.setItem(
            'communicationsummary',
            JSON.stringify(res.data[0])
          );
          this.datasharedservice.lastUpdatedTime(
            this.dashboardChartComman.lastupdatedtime
          );
          this.dashboard.DCU = this.dashboardChartComman.dcu;
          this.dashboard.DEVICES = this.dashboardChartComman.meters;
          this.dashboard.DT = this.dashboardChartComman.dt;
          this.dashboard.FEEDER = this.dashboardChartComman.feeder;
          this.dashboard.OWNER = this.dashboardChartComman.ownerName;
          this.dashboard.SUBDEVISION = this.dashboardChartComman.subdevision;
          this.dashboard.SUBSTATION = this.dashboardChartComman.substation;

          if (this.meterPhase == '' || this.meterPhase == 'All' || this.meterPhase == null || this.meterPhase == undefined || this.meterPhase == 'Evit') {
            this.chartOptions.series = [
              this.dashboardChartComman.meters,
            ];
          }

          else if (this.meterPhase == 'Evit3P') {
            this.chartOptions.series = [
              this.dashboardChartComman.threephasemeters,
            ];
          }
          else if (this.meterPhase == 'Evit3P1') {
            this.chartOptions.series = [
              this.dashboardChartComman.ctmeters,
            ];
          }
          else if (this.meterPhase == 'EvitHT') {
            this.chartOptions.series = [
              this.dashboardChartComman.htmeters,
            ];
          }

        
          if (date == 'Last Week') {
            this.chartOptions1.series = [
              this.dashboardChartComman.commweeksuccesscount,
              this.dashboardChartComman.commweekfailurecount,
              this.dashboardChartComman.inactivedev,
              this.dashboardChartComman.activedev,
              this.dashboardChartComman.faultydev
            ];
            this.chartOptions2.series = [
              this.dashboardChartComman.instantweeksuccesscount,
              this.dashboardChartComman.instantweekfailurecount,
              this.dashboardChartComman.inactivedev,
              this.dashboardChartComman.activedev,
              this.dashboardChartComman.faultydev
            ];
            this.chartOptions3.series = [
              this.dashboardChartComman.dailyweeksuccesscount,
              this.dashboardChartComman.dailyweekfailurecount,
              this.dashboardChartComman.inactivedev,
              this.dashboardChartComman.activedev,
              this.dashboardChartComman.faultydev
            ];
            this.chartOptions4.series = [
              this.dashboardChartComman.deltaweeksuccesscount,
              this.dashboardChartComman.deltaweekfailurecount,
              this.dashboardChartComman.inactivedev,
              this.dashboardChartComman.activedev,
              this.dashboardChartComman.faultydev
            ];
            this.chartOptions5.series = [
              this.dashboardChartComman.eventweeksuccesscount,
              this.dashboardChartComman.eventweekfailurecount,
              this.dashboardChartComman.inactivedev,
              this.dashboardChartComman.activedev,
              this.dashboardChartComman.faultydev
            ];
            this.chartOptions6.series = [
              this.dashboardChartComman.billingweeksuccesscount,
              this.dashboardChartComman.billingweekfailurecount,
              this.dashboardChartComman.inactivedev,
              this.dashboardChartComman.activedev,
              this.dashboardChartComman.faultydev
            ];
          }
        }
      }
      else {

        this.logout();
      }
    });
  }
  getDashboardChartCommanData(type: string) {

    if (this.dashboardChartComman != undefined) {
      if (type == 'Today' || type == '') {
        this.chartOptions1.series = [
          this.dashboardChartComman.commdaysuccesscount,
          this.dashboardChartComman.commdayfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions2.series = [
          this.dashboardChartComman.instantdaysuccesscount,
          this.dashboardChartComman.instantdayfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions3.series = [
          this.dashboardChartComman.dailydaysuccesscount,
          this.dashboardChartComman.dailydayfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions4.series = [
          this.dashboardChartComman.deltadaysuccesscount,
          this.dashboardChartComman.deltadayfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions5.series = [
          this.dashboardChartComman.eventdaysuccesscount,
          this.dashboardChartComman.eventdayfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions6.series = [
          this.dashboardChartComman.billingdaysuccesscount,
          this.dashboardChartComman.billingdayfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
      } else if (type == 'Yesterday') {
        this.chartOptions1.series = [
          this.dashboardChartComman.commyestsuccesscount,
          this.dashboardChartComman.commyestfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions2.series = [
          this.dashboardChartComman.instantyestsuccesscount,
          this.dashboardChartComman.instantyestfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions3.series = [
          this.dashboardChartComman.dailyyestsuccesscount,
          this.dashboardChartComman.dailyyestfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions4.series = [
          this.dashboardChartComman.deltayestsuccesscount,
          this.dashboardChartComman.deltayestfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions5.series = [
          this.dashboardChartComman.eventyestsuccesscount,
          this.dashboardChartComman.eventyestfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions6.series = [
          this.dashboardChartComman.billingyestsuccesscount,
          this.dashboardChartComman.billingyestfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
      } else if (type == 'Last Week') {
        this.chartOptions1.series = [
          this.dashboardChartComman.commweeksuccesscount,
          this.dashboardChartComman.commweekfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions2.series = [
          this.dashboardChartComman.instantweeksuccesscount,
          this.dashboardChartComman.instantweekfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions3.series = [
          this.dashboardChartComman.dailyweeksuccesscount,
          this.dashboardChartComman.dailyweekfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions4.series = [
          this.dashboardChartComman.deltaweeksuccesscount,
          this.dashboardChartComman.deltaweekfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions5.series = [
          this.dashboardChartComman.eventweeksuccesscount,
          this.dashboardChartComman.eventweekfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions6.series = [
          this.dashboardChartComman.billingweeksuccesscount,
          this.dashboardChartComman.billingweekfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
      } else if (type == 'Last Month') {
        this.chartOptions1.series = [
          this.dashboardChartComman.commmonthsuccesscount,
          this.dashboardChartComman.commmonthfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions2.series = [
          this.dashboardChartComman.instantmonthsuccesscount,
          this.dashboardChartComman.instantmonthfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions3.series = [
          this.dashboardChartComman.dailymonthsuccesscount,
          this.dashboardChartComman.dailymonthfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions4.series = [
          this.dashboardChartComman.deltamonthsuccesscount,
          this.dashboardChartComman.deltamonthfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions5.series = [
          this.dashboardChartComman.eventmonthsuccesscount,
          this.dashboardChartComman.eventmonthfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
        this.chartOptions6.series = [
          this.dashboardChartComman.billingmonthsuccesscount,
          this.dashboardChartComman.billingmonthfailurecount,
          this.dashboardChartComman.inactivedev,
          this.dashboardChartComman.activedev,
          this.dashboardChartComman.faultydev
        ];
      }
    }
  }
}
