import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { Consumerlogdata, Consumerlogmodel } from 'src/app/Models/consumerlogmodel';
import { DataService } from 'src/app/Services/data.service';
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
  selector: 'app-command-log-chart',
  templateUrl: './command-log-chart.component.html',
  styleUrls: ['./command-log-chart.component.scss'],
})
export class CommandLogChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions>;
  public chartOptions4: Partial<ChartOptions>;
  condumerlog: Consumerlogmodel = new Consumerlogmodel();
  @Input() fromDate: Date;
  @Input() toDate: Date;
  constructor(
    private service: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {
    this.chartOptions = {
      series: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
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
      series: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',

        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#commsuccess').trigger('click');
            } else {
              $('#commfail').trigger('click');
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
      series: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#instsuccess').trigger('click');
            } else {
              $('#instfail').trigger('click');
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
      series: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#dlpdsuccess').trigger('click');
            } else {
              $('#dlpdfail').trigger('click');
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
      series: [0, 0, 0],
      labels: ['IN_PROGRESS', 'FAILURE', 'SUCCESS'],
      fill: {
        colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      },
      colors: ['#e7eb15', '#e8240e', '#0ee83a'],
      chart: {
        width: 240,
        type: 'donut',
        events: {
          click: function (event, chartContext, config) {
            var el = event.target;

            var dataPointIndex = parseInt(el.getAttribute('j'));

            if (dataPointIndex == 0) {
              $('#lpdsuccess').trigger('click');
            } else {
              $('#lpdfail').trigger('click');
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
    this.getInstant(this.fromDate, this.toDate);

  }

  getInstant(from: any, to: any) {

    this.spinner.show();
    if (from == null && to == null) {
      from = new Date();
      to = new Date();
    }
    from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
    to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');


    this.condumerlog.instant = new Consumerlogdata();
    this.condumerlog.dailyLP = new Consumerlogdata();
    this.condumerlog.deltaLP = new Consumerlogdata();
    this.condumerlog.billing = new Consumerlogdata();
    this.condumerlog.otherRelatedEvents = new Consumerlogdata();
    this.condumerlog.powerRelatedEvents = new Consumerlogdata();
    this.condumerlog.voltageRelatedEvents = new Consumerlogdata();
    this.condumerlog.currentRelatedEvents = new Consumerlogdata();
    this.condumerlog.controlRelatedEvents = new Consumerlogdata();
    this.condumerlog.transactionRelatedEvents = new Consumerlogdata();

    this.service
      .getCommandLogChartData(from, to, 'InstantaneousRead')
      .subscribe((res: any) => {


        this.spinner.hide();
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {

          this.condumerlog = res.data;

          if (this.condumerlog[0].instant == null)
            this.condumerlog[0].instant = new Consumerlogdata();
          if (this.condumerlog[0].dailyLP == null)
            this.condumerlog[0].dailyLP = new Consumerlogdata();
          if (this.condumerlog[0].deltaLP == null)
            this.condumerlog[0].deltaLP = new Consumerlogdata();
          if (this.condumerlog[0].billing == null)
            this.condumerlog[0].billing = new Consumerlogdata();

          if (this.condumerlog[0].otherRelatedEvents == null)
            this.condumerlog[0].otherRelatedEvents = new Consumerlogdata();

          if (this.condumerlog[0].powerRelatedEvents == null)
            this.condumerlog[0].powerRelatedEvents = new Consumerlogdata();

          if (this.condumerlog[0].voltageRelatedEvents == null)
            this.condumerlog[0].voltageRelatedEvents = new Consumerlogdata();

          if (this.condumerlog[0].currentRelatedEvents == null)
            this.condumerlog[0].currentRelatedEvents = new Consumerlogdata();

          if (this.condumerlog[0].controlRelatedEvents == null)
            this.condumerlog[0].controlRelatedEvents = new Consumerlogdata();

          if (this.condumerlog[0].transactionRelatedEvents == null)
            this.condumerlog[0].transactionRelatedEvents = new Consumerlogdata();

          this.chartOptions.series = [this.condumerlog[0].instant.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].instant.IN_PROGRESS, this.condumerlog[0].instant.FAILURE == undefined ? 0 : this.condumerlog[0].instant.FAILURE, this.condumerlog[0].instant.SUCCESS == undefined ? 0 : this.condumerlog[0].instant.SUCCESS];

          this.chartOptions1.series = [this.condumerlog[0].dailyLP.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].dailyLP.IN_PROGRESS, this.condumerlog[0].dailyLP.FAILURE == undefined ? 0 : this.condumerlog[0].dailyLP.FAILURE, this.condumerlog[0].dailyLP.SUCCESS == undefined ? 0 : this.condumerlog[0].dailyLP.SUCCESS];

          this.chartOptions2.series = [this.condumerlog[0].deltaLP.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].deltaLP.IN_PROGRESS, this.condumerlog[0].deltaLP.FAILURE == undefined ? 0 : this.condumerlog[0].deltaLP.FAILURE, this.condumerlog[0].deltaLP.SUCCESS == undefined ? 0 : this.condumerlog[0].deltaLP.SUCCESS];

          this.chartOptions3.series = [this.condumerlog[0].billing.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].billing.IN_PROGRESS, this.condumerlog[0].billing.FAILURE == undefined ? 0 : this.condumerlog[0].billing.FAILURE, this.condumerlog[0].billing.SUCCESS == undefined ? 0 : this.condumerlog[0].billing.SUCCESS];




          this.chartOptions4.series = [
            (
              (this.condumerlog[0].otherRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].otherRelatedEvents.IN_PROGRESS)
              + (this.condumerlog[0].powerRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].powerRelatedEvents.IN_PROGRESS)
              + (this.condumerlog[0].voltageRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].voltageRelatedEvents.IN_PROGRESS)
              + (this.condumerlog[0].currentRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].currentRelatedEvents.IN_PROGRESS)
              + (this.condumerlog[0].controlRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].controlRelatedEvents.IN_PROGRESS)
              + (this.condumerlog[0].transactionRelatedEvents.IN_PROGRESS == undefined ? 0 : this.condumerlog[0].transactionRelatedEvents.IN_PROGRESS)
            )
            , (
              (this.condumerlog[0].otherRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].otherRelatedEvents.FAILURE)
              + (this.condumerlog[0].powerRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].powerRelatedEvents.FAILURE)
              + (this.condumerlog[0].voltageRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].voltageRelatedEvents.FAILURE)
              + (this.condumerlog[0].currentRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].currentRelatedEvents.FAILURE)
              + (this.condumerlog[0].controlRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].controlRelatedEvents.FAILURE)
              + (this.condumerlog[0].transactionRelatedEvents.FAILURE == undefined ? 0 : this.condumerlog[0].transactionRelatedEvents.FAILURE)
            )
            ,
            (
              (this.condumerlog[0].otherRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].otherRelatedEvents.SUCCESS)
              + (this.condumerlog[0].powerRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].powerRelatedEvents.SUCCESS)
              + (this.condumerlog[0].voltageRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].voltageRelatedEvents.SUCCESS)
              + (this.condumerlog[0].currentRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].currentRelatedEvents.SUCCESS)
              + (this.condumerlog[0].controlRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].controlRelatedEvents.SUCCESS)
              + (this.condumerlog[0].transactionRelatedEvents.SUCCESS == undefined ? 0 : this.condumerlog[0].transactionRelatedEvents.SUCCESS)
            )];
        }
        else {

          this.logout();
        }
      });
  }

  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  // DAILY_LOAD_PROFILE(from: any, to: any) {
  //   this.spinner.show();
  //   if (from == null && to == null) {
  //     from = new Date();
  //     to = new Date();
  //   }
  //   from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
  //   to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');

  //   this.service
  //     .getCommandLogChartData(from, to, 'DailyLoadProfile')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         this.chartOptions1.series = res.data[0][2];
  //       }
  //     });
  // }

  // DELTA_LOAD_PROFILE(from: any, to: any) {
  //   this.spinner.show();
  //   if (from == null && to == null) {
  //     from = new Date();
  //     to = new Date();
  //   }
  //   from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
  //   to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');

  //   this.service
  //     .getCommandLogChartData(from, to, 'DeltaLoadProfile')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         this.chartOptions2.series = res.data[0][2];
  //       }
  //     });
  // }

  // BILLING_DATA(from: any, to: any) {
  //   this.spinner.show();
  //   if (from == null && to == null) {
  //     from = new Date();
  //     to = new Date();
  //   }
  //   from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
  //   to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');

  //   this.service
  //     .getCommandLogChartData(from, to, 'BillingData')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         this.chartOptions3.series = res.data[0][2];
  //       }
  //     });
  // }

  // Event_DATA(from: any, to: any) {
  //   this.spinner.show();
  //   if (from == null && to == null) {
  //     from = new Date();
  //     to = new Date();
  //   }
  //   from = this.datePipe.transform(new Date(from), 'yyyy-MM-dd');
  //   to = this.datePipe.transform(new Date(to), 'yyyy-MM-dd');

  //   this.service
  //     .getCommandLogChartData(from, to, 'PowerRelatedEvents')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         let added = this.chartOptions4.series[0];
  //         let inprogress = this.chartOptions4.series[1];
  //         let failure = this.chartOptions4.series[2];
  //         let success = this.chartOptions4.series[3];
  //         added = added + res.data[0][2][0];
  //         inprogress = inprogress + res.data[0][2][1];
  //         failure = failure + res.data[0][2][2];
  //         success = success + res.data[0][2][3];
  //         this.chartOptions4.series = [added, inprogress, failure, success];
  //       }
  //     });

  //   this.service
  //     .getCommandLogChartData(from, to, 'VoltageRelatedEvents')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         let added = this.chartOptions4.series[0];
  //         let inprogress = this.chartOptions4.series[1];
  //         let failure = this.chartOptions4.series[2];
  //         let success = this.chartOptions4.series[3];
  //         added = added + res.data[0][2][0];
  //         inprogress = inprogress + res.data[0][2][1];
  //         failure = failure + res.data[0][2][2];
  //         success = success + res.data[0][2][3];
  //         this.chartOptions4.series = [added, inprogress, failure, success];
  //       }
  //     });
  //   this.service
  //     .getCommandLogChartData(from, to, 'TransactionRelatedEvents')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         let added = this.chartOptions4.series[0];
  //         let inprogress = this.chartOptions4.series[1];
  //         let failure = this.chartOptions4.series[2];
  //         let success = this.chartOptions4.series[3];
  //         added = added + res.data[0][2][0];
  //         inprogress = inprogress + res.data[0][2][1];
  //         failure = failure + res.data[0][2][2];
  //         success = success + res.data[0][2][3];
  //         this.chartOptions4.series = [added, inprogress, failure, success];
  //       }
  //     });
  //   this.service
  //     .getCommandLogChartData(from, to, 'CurrentRelatedEvents')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         let added = this.chartOptions4.series[0];
  //         let inprogress = this.chartOptions4.series[1];
  //         let failure = this.chartOptions4.series[2];
  //         let success = this.chartOptions4.series[3];
  //         added = added + res.data[0][2][0];
  //         inprogress = inprogress + res.data[0][2][1];
  //         failure = failure + res.data[0][2][2];
  //         success = success + res.data[0][2][3];
  //         this.chartOptions4.series = [added, inprogress, failure, success];
  //       }
  //     });
  //   this.service
  //     .getCommandLogChartData(from, to, 'OtherRelatedEvents')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         let added = this.chartOptions4.series[0];
  //         let inprogress = this.chartOptions4.series[1];
  //         let failure = this.chartOptions4.series[2];
  //         let success = this.chartOptions4.series[3];
  //         added = added + res.data[0][2][0];
  //         inprogress = inprogress + res.data[0][2][1];
  //         failure = failure + res.data[0][2][2];
  //         success = success + res.data[0][2][3];
  //         this.chartOptions4.series = [added, inprogress, failure, success];
  //       }
  //     });
  //   this.service
  //     .getCommandLogChartData(from, to, 'ControlRelatedEvents')
  //     .subscribe((res: any) => {
  //       this.spinner.hide();
  //       if (res != null && res.message != 'Key Is Not Valid') {
  //         let added = this.chartOptions4.series[0];
  //         let inprogress = this.chartOptions4.series[1];
  //         let failure = this.chartOptions4.series[2];
  //         let success = this.chartOptions4.series[3];
  //         added = added + res.data[0][2][0];
  //         inprogress = inprogress + res.data[0][2][1];
  //         failure = failure + res.data[0][2][2];
  //         success = success + res.data[0][2][3];

  //         this.chartOptions4.series = [added, inprogress, failure, success];
  //       }
  //     });
  // }
}
