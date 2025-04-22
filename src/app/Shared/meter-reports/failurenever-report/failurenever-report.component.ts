import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { MeterData } from 'src/app/Models/meter-data';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DataService } from 'src/app/Services/data.service';
import { Utility } from '../../utility';
import { MeterreportService } from 'src/app/Services/meterreport.service';

@Component({
  selector: 'app-failurenever-report',
  templateUrl: './failurenever-report.component.html',
  styleUrls: ['./failurenever-report.component.scss']
})
export class FailureNeverReportComponent {
  formdata: any = {};
  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  isLoading: boolean = false; // Add a flag for progress bar

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
    const today = new Date();
    this.formdata.startDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.formdata.endDate = this.datePipe.transform(today, 'yyyy-MM-dd');
  }

  onBtnExport() {
    const excelParams = {
      fileName: 'NonCommunicatingReport.csv',
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
    const startDate = this.formdata.startDate ? new Date(this.formdata.startDate) : null;
    const endDate = this.formdata.endDate ? new Date(this.formdata.endDate) : null;

    if (!startDate || isNaN(startDate.getTime()) || !endDate || isNaN(endDate.getTime())) {
      alert('Please select valid start and end dates.');
      return;
    }

    if (startDate > endDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    this.isLoading = true;

    const payload = {
      startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd'),
    };

    console.log('Submitting payload with selected dates:', payload);

    this.service.getMeterReport(payload).subscribe(
      (res: any) => {
        console.log('API Response:', res);

        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const tableDataArray = res.data; // Assuming `res.data` is the array of data

          if (!tableDataArray || tableDataArray.length === 0) {
            this.gridApi.setRowData([]);
            this.isLoading = false;
            return;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

          this.tableData = [];
          tableDataArray.forEach((item: any) => {
            const lastUpdateDate = item[2] ? new Date(item[2]) : null; // Access the correct index for lastUpdateDate

            // Handle missing or invalid lastUpdateDate
            if (!lastUpdateDate || isNaN(lastUpdateDate.getTime())) {
              console.warn('Skipping row with invalid or missing lastUpdateDate:', item);
              return;
            }

            lastUpdateDate.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

            // Filter out rows where the lastUpdateDate is today
            if (lastUpdateDate < today) {
              this.tableData.push({
                deviceSerialNumber: item[0] || 'N/A',
                slaMonth: item[1] || 'N/A',
                lastUpdateDate: this.datePipe.transform(lastUpdateDate, 'yyyy-MM-dd') || 'N/A',
                consumerName: item[3] || 'N/A',
                consumerNo: item[4] || 'N/A',
                meterType: item[5] || 'N/A',
                simType: item[6] || 'N/A',
                status: item[7] || 'N/A',
                nicIpv6: item[8] || 'N/A',
                latitude: item[9] || 'N/A',
                longitude: item[10] || 'N/A',
              });
            }
          });

          console.log('Filtered & Mapped Table Data (Not Today):', this.tableData);

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
      { field: 'deviceSerialNumber', headerName: 'Device Serial Number', sortable: true, filter: true, width: 200 },
      { field: 'slaMonth', headerName: 'SLA Month', sortable: true, filter: true, width: 150 },
      { field: 'lastUpdateDate', headerName: 'Last Update Date', sortable: true, filter: true, width: 200 },
      { field: 'consumerName', headerName: 'Consumer Name', sortable: true, filter: true, width: 200 },
      { field: 'consumerNo', headerName: 'Consumer No', sortable: true, filter: true, width: 150 },
      { field: 'meterType', headerName: 'Meter Type', sortable: true, filter: true, width: 150 },
      { field: 'simType', headerName: 'SIM Type', sortable: true, filter: true, width: 150 },
      { field: 'status', headerName: 'Status', sortable: true, filter: true, width: 150 },
      { field: 'nicIpv6', headerName: 'NIC IPv6', sortable: true, filter: true, width: 200 },
      { field: 'latitude', headerName: 'Latitude', sortable: true, filter: true, width: 150 },
      { field: 'longitude', headerName: 'Longitude', sortable: true, filter: true, width: 150 },
    ];
  }

}
