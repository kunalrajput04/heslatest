import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MeterData } from 'src/app/Models/meter-data';
import { DataService } from 'src/app/Services/data.service';
import { SLAIMeterInfo } from '../../sla-history/sla-history.component';

@Component({
  selector: 'app-metercount',
  templateUrl: './metercount.component.html',
  styleUrls: ['./metercount.component.scss']
})
export class MetercountComponent implements OnInit {

  formdata: MeterData = new MeterData();

  // startDate: string = "2022-10-14";
  // endDate: string = "2023-12-28";
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
    const today = new Date();
    this.formdata.fromdate = this.datePipe.transform(today, 'yyyy-MM-dd') || '';
    this.formdata.todate = this.datePipe.transform(today, 'yyyy-MM-dd') || '';
  }

  onSubmit() {
    if (!this.formdata.fromdate || !this.formdata.todate) {
      alert('Start date and end date cannot be null or empty.');
      return;
    }

    // Ensure dates are properly formatted
    this.formdata.fromdate = this.datePipe.transform(this.formdata.fromdate, 'yyyy-MM-dd') || '';
    this.formdata.todate = this.datePipe.transform(this.formdata.todate, 'yyyy-MM-dd') || '';

    console.log('Submitting with dates:', {
      fromdate: this.formdata.fromdate,
      todate: this.formdata.todate,
    });

    this.slaDataService
      .getMeterCount(
        this.formdata.fromdate,
        this.formdata.todate
      )
      .subscribe(
        (res: any) => {
          if (
            res != null &&
            res.message != 'Key Is Not Valid' &&
            res.message != 'Session Is Expired'
          ) {
            if (res.data != null) {
              this.resultData = res.data;

              for (let item of this.resultData) {
                this.slaData.push({
                  OwnerName: item.ownerName,
                  SlaMonth: item.slaMonth,
                  Active: item.active,
                  Failure: item.failure,
                  Faulty: item.faulty,
                  Inactive: item.inactive,
                  Installed: item.installed,
                  Never: item.never,
                  Non: item.non,
                  Percentage: parseFloat(item.percentage).toFixed(2),
                  Success: item.success,
                });
              }
              // Table creation
              this.gridApi.setRowData(this.slaData);
              this.gridColumnApi.autoSizeAllColumns();
            }
          }
        },
        (error) => {
          console.error('Error occurred while fetching meter count:', error);
          if (error?.error?.message) {
            alert(`Error: ${error.error.message}`);
          } else {
            alert('An error occurred while fetching data. Please try again later.');
          }
        }
      );
  }

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
        'metercommunicationcount' +
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
      fileName: 'metercommunicationcount.csv',
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
