import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
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

import { Headernavigation } from 'src/app/Model/headernavigation';
import { IChartTable, IDashboardChartComman } from 'src/app/Models/dashboard';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/Services/data.service';
import { ChartPopupComponent } from 'src/app/Shared/chart-popup/chart-popup.component';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';
declare let $: any;
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
  selector: 'app-communicationsummary',
  templateUrl: './communicationsummary.component.html',
  styleUrls: ['./communicationsummary.component.scss'],
})
export class CommunicationsummaryComponent implements OnInit {
  title = 'htmltopdf';
username:string='';
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  commRead: any[] = [0, 0, 0, 0];
  instantRead: any[] = [0, 0, 0, 0];
  dlpRead: any[] = [0, 0, 0, 0];
  lpRead: any[] = [0, 0, 0, 0];
  billingRead: any[] = [0, 0, 0, 0];
  eventRead: any[] = [0, 0, 0, 0];
  dashboardChartComman: IDashboardChartComman;

  data: Headernavigation = {
    firstlevel: '',
    menuname: 'Summary',
    url: '/',
  };

  constructor(
    private modalService: NgbModal,
    private datasharedservice: DataSharedService,
    private spinner:NgxSpinnerService,
    private datePipe:DatePipe
  ) {}

  ngOnInit(): void {
    
   this.username= localStorage.getItem('username')
    this.dashboardChartComman = JSON.parse(
      sessionStorage.getItem('communicationsummary')
    );
    let MeterTotal =
      this.dashboardChartComman.singlephasemeters +
      this.dashboardChartComman.threephasemeters +
      this.dashboardChartComman.ctmeters;

    this.chartOptions = {
      chart: {
        height: 200,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '18px',
            },
            value: {
              show: true,
              fontSize: '10px',
              fontFamily: undefined,
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: function (val) {
                return val + '%';
              },
            },
            total: {
              show: true,
              label: 'Total',
              color: '#373d3f',

              fontSize: '16px',
              fontFamily: undefined,
              fontWeight: 600,
              formatter: function (w) {
                return MeterTotal + '';
              },
            },
          },
          hollow: {
            size: '50%',
            background: 'transparent',
            position: 'front',
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },
        },
      },

      labels: ['Last Month', 'Last Week', 'Last Day', 'Today','Inactive'],
    };

    this.commRead = [
      (
        Math.round(this.dashboardChartComman.commmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.commweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.commyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.commdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.instantRead = [
      (
        Math.round(this.dashboardChartComman.instantmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.instantweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.instantyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.instantdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.dlpRead = [
      (
        Math.round(this.dashboardChartComman.dailymonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.dailyweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.dailyyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.dailydaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.lpRead = [
      (
        Math.round(this.dashboardChartComman.deltamonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.deltaweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.deltayestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.deltadaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.billingRead = [
      (
        Math.round(this.dashboardChartComman.billingmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.billingweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.billingyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.billingdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
    this.eventRead = [
      (
        Math.round(this.dashboardChartComman.eventmonthsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.eventweeksuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.eventyestsuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.eventdaysuccesscount * 100) /
        MeterTotal
      ).toFixed(2),
      (
        Math.round(this.dashboardChartComman.inactivedev * 100) /
        MeterTotal
      ).toFixed(2)
    ];
  }

  onTableget(commandType: string, status: string, daytype: string) {
    let chartData: IChartTable = {
      commandType: commandType,
      daytype: daytype,
      status: status,
    };
    this.datasharedservice.shareChartTableFunc(chartData);
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
      (reason: any) => {}
    );
  }

  // public downloadAsPDF() {
  //   const doc = new jsPDF();

  //   const pdfTable = this.pdfTable.nativeElement;

  //   var html = htmlToPdfmake(pdfTable.innerHTML);

  //   const documentDefinition = {
  //     pageSize: 'A5',
  //     pageOrientation: 'landscape',
  //     content: html,
  //     pageBreak: 'before',
  //     pageMargins: [40, 60, 40, 60],
  //   };

  //   pdfMake.createPdf(documentDefinition).open();
  // }

  // getPrint() {
  //   window.print();
  // }

  convertToPDF() {

    this.beforePrint();
    var date=new Date();
    this.datePipe.transform(date,"dd-MM-yyyy")
   
   
    html2canvas(document.querySelector('#contentToConvert')).then((canvas) => {
      // Few necessary setting options

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'pt', "a4"); // A4 size page of PDF
      var width = pdf.internal.pageSize.getWidth();
      var height = (canvas.height * width) / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save('SLAReport' + this.datePipe.transform(date,"dd-MM-yyyy") +'.pdf'); // Generated PDF
    });
   
    this.afterPrint();
  }


  beforePrint(){
    $('.page-header,.noprint').hide();
    $('.center,.print').show();


  }
  afterPrint(){
    $('.page-header,.noprint').show();
    $('.center,.print').hide();

  }
}
