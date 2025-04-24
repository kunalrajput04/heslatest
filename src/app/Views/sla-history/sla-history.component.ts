import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';
import { MeterData } from 'src/app/Models/meter-data';
import { DataService } from 'src/app/Services/data.service';

export interface SLAIMeterInfo {
  OwnerName: string;
  SlaMonth: string;
  Active: string;
  Failure: string;
  Faulty: string;
  Inactive: string;
  Installed: string;
  Never: string;
  Non: string;
  Percentage: string;
  Success: string;
  // SLADateTime: string;
  // installed: string;
  // inactive: string;
  // active: string;
  // faulty: string;
  // failure: string;
  // never:string;
  // success: string;
  // successPersent: string;
}

@Component({
  selector: 'app-sla-history',
  templateUrl: './sla-history.component.html',
  styleUrls: ['./sla-history.component.scss'],
})
export class SlaHistoryComponent implements OnInit {
  formdata: MeterData = new MeterData();
  levelName: string = 'ALL';
  levelValue: string = 'MPDCL';
  //startDate: string = "2022-10-14";
  //endDate: string = "2023-12-28";
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];

  resultData: any;
  slaData: SLAIMeterInfo[] = [];
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private slaDataService: DataService,
    private router: Router
  ) {
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };
    this.columnDefs = [
      { field: 'OwnerName' },
      { field: 'SlaMonth' },
      { field: 'Active' },
      { field: 'Failure' },
      { field: 'Faulty' },
      { field: 'Inactive' },
      { field: 'Installed' },
      { field: 'Never' },
      { field: 'Non' },
      { field: 'Percentage', headerName: 'Success(%)' },
      { field: 'Success' },
      // { field: 'SLADateTime' },
      // { field: 'installed' },
      // { field: 'inactive' },
      // { field: 'active' },
      // { field: 'faulty' },
      // { field: 'failure' },
      // {field:'never'},
      // { field: 'success' },
      // { field: 'successPersent', headerName: 'Success(%)' },
    ];
  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  onSubmit() {
    this.slaDataService
      .getSLAReportHistoryData1(
        this.levelName,
        this.levelValue,
        this.formdata.fromdate,
        this.formdata.todate
      )
      .subscribe((res: any) => {
        if (
          res != null &&
          res.message != 'Key Is Not Valid' &&
          res.message != 'Session Is Expired'
        ) {
          if (res.data != null) {
            this.resultData = res.data[0];

            for (let item in this.resultData) {
              if (parseInt(item) !== 1) {
                this.slaData.push({
                  OwnerName: this.resultData[item][0],
                  SlaMonth: this.resultData[item][1],
                  Active: this.resultData[item][2],
                  Failure: this.resultData[item][3],
                  Faulty: this.resultData[item][4],
                  Inactive: this.resultData[item][5],
                  Installed: this.resultData[item][6],
                  Never: this.resultData[item][7],
                  Non: this.resultData[item][8],
                  Percentage: this.resultData[item][9],
                  Success: this.resultData[item][10],
                });
              }
              // else{
              //   
              // }
            }
            //table creation
            this.gridApi.setRowData(this.slaData);
            this.gridColumnApi.autoSizeAllColumns();
          }
        }
      });
  }
  // logout(){
  //   sessionStorage.clear();
  //   localStorage.clear();
  //   this.router.navigate(['/meecl']);
  // }
  convertpdf() {
    //alert("sla history report")
    this.beforePrint();
    var date = new Date();
    this.datePipe.transform(date, 'dd-MM-yyyy');

    html2canvas(document.getElementById('#printingsection')).then((canvas) => {
      // Few necessary setting options

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('l', 'pt', 'a4'); // A4 size page of PDF
      var width = pdf.internal.pageSize.getWidth();
      var height = (canvas.height * width) / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
      pdf.save(
        'SLAHistoryReport' +
          this.datePipe.transform(date, 'dd-MM-yyyy') +
          '.pdf'
      ); // Generated PDF
    });

    this.afterPrint();
  }
  beforePrint() {
    $('.page-header,.noprint').hide();
    $('.center,.print').show();
  }

  afterPrint() {
    $('.page-header,.noprint').show();
    $('.center,.print').hide();
  }

  onBtnExport() {
    var excelParams = {
      fileName: 'SLAHistorytData.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
  }
}
