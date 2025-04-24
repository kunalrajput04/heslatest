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

export interface sytemLogInfo {
        month: string;
        availability: string;
        s1_fail: string;
        s1_pass: string;
        s2_fail: string;
        s2_pass
        s3_fail: string;
        s3_pass: string;
        total_hit: string;
        TotalHithr: string;
        TSPasshr: string;
        TSFailhr: string;
}

@Component({
  selector: 'app-system-check',
  templateUrl: './system-check.component.html',
  styleUrls: ['./system-check.component.scss']
})
export class SystemCheckComponent implements OnInit {
    formdata: MeterData = new MeterData();
    levelName: string = 'ALL';
    levelValue: string = 'MZR';
    //startDate: string = "2022-10-14";
    //endDate: string = "2023-12-28";
    gridOptions: any;
    defaultColDef: any;
    columnDefs: any;
    gridApi: any;
    gridColumnApi: any;
    tableData: any[] = [];
  
    resultData: any;
    slaData: sytemLogInfo[] = [];
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
        { field: 'month', headerName: 'Month' },
        { field: 'availability', headerName: 'Availability' },
        { field: 's1_fail', headerName: 'S1 Fail' },
        { field: 's1_pass', headerName: 'S1 Pass' },
        { field: 's2_fail', headerName: 'S2 Fail' },
        { field: 's2_pass', headerName: 'S2 Pass' },
        { field: 's3_fail', headerName: 'S3 Fail' },
        { field: 's3_pass', headerName: 'S3 Pass' },
        { field: 'total_hit', headerName: 'Total Hits' },
        { field: 'TotalHithr', headerName: 'Total Hits HR' },
        { field: 'TSPasshr', headerName: 'TS Pass HR' },
        { field: 'TSFailhr', headerName: 'TS Fail HR' },
      ];
    }
  
    ngOnInit(): void {
      this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.formdata.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
  
    onSubmit() {
      this.slaDataService
        .getSystemLog(
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
                    month: this.resultData[item][0],       
                    availability: this.resultData[item][1], 
                    s1_fail: this.resultData[item][2],      
                    s1_pass: this.resultData[item][3],     
                    s2_fail: this.resultData[item][4],      
                    s2_pass: this.resultData[item][5],      
                    s3_fail: this.resultData[item][6],      
                    s3_pass: this.resultData[item][7],      
                    total_hit: this.resultData[item][8],     
                    TotalHithr: this.resultData[item][9],    
                    TSPasshr: this.resultData[item][10],     
                    TSFailhr: this.resultData[item][11],
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
  


  