import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MeterreportService } from 'src/app/Services/meterreport.service';
import jsPDF from 'jspdf'; // Import jsPDF
import autoTable from 'jspdf-autotable'; // Import autotable plugin

@Component({
  selector: 'app-meter-summary',
  templateUrl: './meter-summary.component.html',
  styleUrls: ['./meter-summary.component.scss']
})
export class MeterSummaryComponent implements OnInit {
  communicatingCount: number = 0;
  nonCommunicatingCount: number = 0;
  neverCommunicatedCount: number = 0;
  tableData: any[] = [];

  constructor(private service: MeterreportService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.fetchMeterData(); // Automatically fetch data when the page loads
  }

  fetchMeterData() {
    const payload = {
      startDate: this.datePipe.transform(new Date('2021-01-31'), 'yyyy-MM-dd') || '', // Only date
      endDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '', // Only date
    };

    this.service.getMeterReport(payload).subscribe(
      (res: any) => {
        console.log('API Response:', res); // Log the API response for debugging

        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const tableDataArray = res.data.slice(1); // Ignore the first response of three

          if (!tableDataArray || tableDataArray.length === 0) {
            console.warn('No data available to display.');
            return;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

          this.tableData = [];
          tableDataArray.forEach((item: any) => {
            const lastUpdateDate = item[2] ? new Date(item[2]) : null; // Access the correct index for lastUpdateDate

            // Handle missing or invalid lastUpdateDate
            if (!lastUpdateDate || isNaN(lastUpdateDate.getTime())) {
              this.tableData.push({
                deviceSerialNumber: item[0] || 'N/A',
                slaMonth: item[1] || 'N/A',
                lastUpdateDate: 'Never Communicated',
                consumerName: item[3] || 'N/A',
                consumerNo: item[4] || 'N/A',
                meterType: item[5] || 'N/A',
                simType: item[6] || 'N/A',
                status: item[7] || 'N/A',
                nicIpv6: item[8] || 'N/A',
                latitude: item[9] || 'N/A',
                longitude: item[10] || 'N/A',
              });
              return;
            }

            lastUpdateDate.setHours(0, 0, 0, 0); // Reset time to midnight for comparison

            // Filter rows based on conditions
            if (lastUpdateDate.toDateString() === today.toDateString()) {
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
            } else if (lastUpdateDate < today) {
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

          // Update counts
          this.communicatingCount = this.tableData.filter((item: any) => {
            const lastCommDate = item['lastUpdateDate'] ? new Date(item['lastUpdateDate']) : null;
            return lastCommDate && lastCommDate.toDateString() === today.toDateString();
          }).length;

          this.nonCommunicatingCount = this.tableData.filter((item: any) => {
            const lastCommDate = item['lastUpdateDate'] ? new Date(item['lastUpdateDate']) : null;
            return lastCommDate && lastCommDate < today;
          }).length;

          this.neverCommunicatedCount = this.tableData.filter((item: any) => !item['lastUpdateDate'] || item['lastUpdateDate'] === 'Never Communicated').length;

          console.log('Filtered & Mapped Table Data:', this.tableData);
          console.log('Communicating Count:', this.communicatingCount);
          console.log('Non-Communicating Count:', this.nonCommunicatingCount);
          console.log('Never Communicated Count:', this.neverCommunicatedCount);
        } else {
          console.error('Unexpected API response structure or insufficient data:', res);
          alert('Unexpected API response. Please contact support.');
        }
      },
      (error) => {
        console.error('Error during API call:', error);
        if (error.error && error.error.message) {
          alert(`API Error: ${error.error.message}`);
        }
      }
    );
  }

  downloadCSV(category: string) {
    console.log(`Downloading CSV for category: ${category}`); // Debug log
    let filteredData: any[] = [];
    let fileName = '';
    const columnNames = [
      'deviceSerialNumber',
      'slaMonth',
      'lastUpdateDate',
      'consumerName',
      'consumerNo',
      'meterType',
      'simType',
      'status',
      'nicIpv6',
      'latitude',
      'longitude'
    ];

    if (category === 'communicating') {
      filteredData = this.tableData.filter((item: any) => {
        const lastCommDate = item['lastUpdateDate'] ? new Date(item['lastUpdateDate']) : null;
        const today = new Date();
        return lastCommDate && lastCommDate.toDateString() === today.toDateString();
      });
      fileName = 'CommunicatingMeters.csv';
    } else if (category === 'nonCommunicating') {
      filteredData = this.tableData.filter((item: any) => {
        const lastCommDate = item['lastUpdateDate'] ? new Date(item['lastUpdateDate']) : null;
        const today = new Date();
        return lastCommDate && lastCommDate.toDateString() !== today.toDateString();
      });
      fileName = 'NonCommunicatingMeters.csv';
    } else if (category === 'neverCommunicated') {
      filteredData = this.tableData.filter((item: any) => !item['lastUpdateDate']);
      fileName = 'NeverCommunicatedMeters.csv';
    } else if (category === 'total') {
      filteredData = this.tableData; // Include all data for total
      fileName = 'TotalMeters.csv';
    }

    const csvData = [
      columnNames.join(','), // Add column names as the first row
      ...filteredData.map(row => columnNames.map(col => row[col] || '').join(',')) // Map data rows
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadPDF(category: string) {
    console.log(`Downloading PDF for category: ${category}`); // Debug log
    let filteredData: any[] = [];
    let fileName = '';

    if (category === 'communicating') {
      filteredData = this.tableData.filter((item: any) => {
        const lastCommDate = item['lastUpdateDate'] ? new Date(item['lastUpdateDate']) : null;
        const today = new Date();
        return lastCommDate && lastCommDate.toDateString() === today.toDateString();
      });
      fileName = 'CommunicatingMeters.pdf';
    } else if (category === 'nonCommunicating') {
      filteredData = this.tableData.filter((item: any) => {
        const lastCommDate = item['lastUpdateDate'] ? new Date(item['lastUpdateDate']) : null;
        const today = new Date();
        return lastCommDate && lastCommDate.toDateString() !== today.toDateString();
      });
      fileName = 'NonCommunicatingMeters.pdf';
    } else if (category === 'neverCommunicated') {
      filteredData = this.tableData.filter((item: any) => !item['lastUpdateDate']);
      fileName = 'NeverCommunicatedMeters.pdf';
    } else if (category === 'total') {
      filteredData = this.tableData; // Include all data for total
      fileName = 'TotalMeters.pdf';
    }

    const columnNames = [
      'deviceSerialNumber',
      'slaMonth',
      'lastUpdateDate',
      'consumerName',
      'consumerNo',
      'meterType',
      'simType',
      'status',
      'nicIpv6',
      'latitude',
      'longitude'
    ];

    // Prepare data for the table
    const tableRows = filteredData.map(row => columnNames.map(col => row[col] || ''));

    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text(fileName.replace('.pdf', ''), 14, 20);

      // Add table using autoTable
      autoTable(doc, {
        head: [columnNames],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error); // Log any errors for debugging
    }
  }

}