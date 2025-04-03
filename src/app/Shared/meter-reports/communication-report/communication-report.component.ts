import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MeterreportService } from 'src/app/Services/meterreport.service';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Utility } from '../../utility';

@Component({
  selector: 'app-communication-report',
  templateUrl: './communication-report.component.html',
  styleUrls: ['./communication-report.component.scss']
})
export class CommunicationReportComponent {
  formdata: any = {};
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  isLoading: boolean = false; 

  data: any = {
    firstlevel: 'Meter Data',
    menuname: 'Instant Data',
    url: '/InstantData',
  };

  utility = new Utility();
  meterPhase: string = 'Evit';

  constructor(
    private service: MeterreportService,
    private router: Router,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService
  ) {
    this.gridOptions = { context: { componentParent: this } };
    this.defaultColDef = {
      resizable: true,
      filter: false,
      sortable: true,
    };

    this.columnDefs = this.getColumnName();
    this.datasharedservice.chagneHeaderNav(this.data);
  }

  ngOnInit(): void {
    this.formdata.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  onBtnExport() {
    const excelParams = {
      fileName: 'CommunicationReport.csv',
    };
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Apply column definitions again on grid ready
    this.gridApi.setColumnDefs(this.columnDefs);

    setTimeout(() => {
      if (this.tableData && this.tableData.length > 0) {
        this.gridApi.setRowData(this.tableData);
        this.gridColumnApi.autoSizeAllColumns();
      } else {
        this.gridApi.setRowData([]);
      }
    }, 100);
  }

  onFilterTextBoxChanged() {
    // this.gridApi.setQuickFilter(
    //   (document.getElementById('filter-text-box') as HTMLInputElement).value
    // );
  }

  onSubmit() {
    const selectedDate = this.formdata.fromdate ? new Date(this.formdata.fromdate) : null;
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      alert('Please select a valid date.');
      
      return;
    }
    this.isLoading = true;
  
    const payload = {
      commandType: 'LastComm',
      levelName: 'All',
      levelValue: 'MPDCL',
      startDate: this.datePipe.transform(selectedDate, 'yyyy-MM-dd'),
      status: 'Success',
      meterType: 'All',
    };
  
    console.log('Submitting payload:', JSON.stringify(payload, null, 2));
  
    this.service.getMeterReport(payload).subscribe(
      (res: any) => {
        console.log('API Response:', res);
  
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const nestedData = res.data.length > 1 ? res.data[1] : res.data[0];
          const tableDataArray = Object.values(nestedData);
  
          if (!tableDataArray || tableDataArray.length === 0) {
            this.gridApi.setRowData([]);
            this.isLoading = false;
            return;
          }
  
          const now = new Date();
          const filteredData = tableDataArray.filter((item: any) => {
            const lastCommDate = item[3] ? new Date(item[3]) : null;
            if (!lastCommDate || isNaN(lastCommDate.getTime())) return false;
  
            const timeDiff = now.getTime() - lastCommDate.getTime();
            return timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000; // within 24 hours
          });
  
          this.tableData = filteredData.map((item: any) => {
            return {
              'MeterSNo': item[0] || 'N/A',
              'Consumer No': item[1],
              'Subdivision': item[2],
              'Last Communication Date': item[3],
              'Last Energy KWH': item[4],
              'Date of Installation': item[5],
              'IP Address Main': item[6],
              'Meter Type': item[7],
              'Network Type': item[8],
              'Never Communicated': item[9] ? 'Yes' : 'No',
              'Non Communicated': item[10] ? 'Yes' : 'No',
            };
          });
  
          console.log('Filtered & Mapped Table Data:', this.tableData);
  
          if (this.gridApi) {
            this.gridApi.setColumnDefs(this.getColumnName());
            this.gridApi.setRowData(this.tableData);
            this.gridApi.refreshCells();
            this.gridColumnApi.autoSizeAllColumns();
          }
        } else {
          console.error('Unexpected API response structure or insufficient data:', res);
          alert('Unexpected API response. Please contact support.');
        }
        this.isLoading = false; 
      },
      (error) => {
        console.error('Error during API call:', error);
        if (error.error && error.error.message) {
          alert(`API Error: ${error.error.message}`);
        }
        this.isLoading = false;
        this.gridApi.hideOverlay();
      }
    );
  }
  

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  getColumnName(): any {
    return [
      { field: 'MeterSNo', headerName: 'Meter S.No.', sortable: true, filter: true, width: 150 },
      { field: 'Consumer No', headerName: 'Consumer No', sortable: true, filter: true, width: 150 },
      { field: 'Subdivision', headerName: 'Subdivision', sortable: true, filter: true, width: 150 },
      { field: 'Last Communication Date', headerName: 'Last Communication Date', sortable: true, filter: true, width: 200 },
      { field: 'Last Energy KWH', headerName: 'Last Energy KWH', sortable: true, filter: true, width: 150 },
      { field: 'Date of Installation', headerName: 'Date of Installation', sortable: true, filter: true, width: 200 },
      { field: 'IP Address Main', headerName: 'IP Address Main', sortable: true, filter: true, width: 200 },
      { field: 'Meter Type', headerName: 'Meter Type', sortable: true, filter: true, width: 150 },
      { field: 'Network Type', headerName: 'Network Type', sortable: true, filter: true, width: 150 },
      // { field: 'Never Communicated', headerName: 'Never Communicated', sortable: true, filter: true, width: 180 },
      // { field: 'Non Communicated', headerName: 'Non Communicated', sortable: true, filter: true, width: 180 },
    ];
  }
}
