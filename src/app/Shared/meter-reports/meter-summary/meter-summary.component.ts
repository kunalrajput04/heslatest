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
      commandType: 'LastComm',
      levelName: 'All',
      levelValue: 'MPDCL',
      startDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '',
      status: 'Success',
      meterType: 'All',
    };

    this.service.getMeterReport(payload).subscribe(
      (res: any) => {
        console.log('API Response:', res); // Log the API response for debugging
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const nestedData = res.data.length > 1 ? res.data[1] : res.data[0];
          const tableDataArray = Object.values(nestedData);

          const now = new Date();
          this.tableData = tableDataArray.map((item: any) => ({
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
          }));

          this.communicatingCount = this.tableData.filter((item: any) => {
            const lastCommDate = item['Last Communication Date'] ? new Date(item['Last Communication Date']) : null;
            return lastCommDate && (now.getTime() - lastCommDate.getTime()) <= 24 * 60 * 60 * 1000;
          }).length;

          this.nonCommunicatingCount = this.tableData.filter((item: any) => {
            const lastCommDate = item['Last Communication Date'] ? new Date(item['Last Communication Date']) : null;
            return lastCommDate && (now.getTime() - lastCommDate.getTime()) > 24 * 60 * 60 * 1000;
          }).length;

          this.neverCommunicatedCount = this.tableData.filter((item: any) => !item['Last Communication Date']).length;
        }
      },
      (error) => {
        console.error('Error fetching meter data:', error); // Log any errors for debugging
      }
    );
  }

  downloadCSV(category: string) {
    console.log(`Downloading CSV for category: ${category}`); // Debug log
    let filteredData: any[] = [];
    let fileName = '';
    const columnNames = [
      'MeterSNo',
      'Consumer No',
      'Subdivision',
      'Last Communication Date',
      'Last Energy KWH',
      'Date of Installation',
      'IP Address Main',
      'Meter Type',
      'Network Type'
    ];

    if (category === 'communicating') {
      filteredData = this.tableData.filter((item: any) => {
        const lastCommDate = item['Last Communication Date'] ? new Date(item['Last Communication Date']) : null;
        return lastCommDate && (new Date().getTime() - lastCommDate.getTime()) <= 24 * 60 * 60 * 1000;
      });
      fileName = 'CommunicatingMeters.csv';
    } else if (category === 'nonCommunicating') {
      filteredData = this.tableData.filter((item: any) => {
        const lastCommDate = item['Last Communication Date'] ? new Date(item['Last Communication Date']) : null;
        return lastCommDate && (new Date().getTime() - lastCommDate.getTime()) > 24 * 60 * 60 * 1000;
      });
      fileName = 'NonCommunicatingMeters.csv';
    } else if (category === 'neverCommunicated') {
      filteredData = this.tableData.filter((item: any) => !item['Last Communication Date']);
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
        const lastCommDate = item['Last Communication Date'] ? new Date(item['Last Communication Date']) : null;
        return lastCommDate && (new Date().getTime() - lastCommDate.getTime()) <= 24 * 60 * 60 * 1000;
      });
      fileName = 'CommunicatingMeters.pdf';
    } else if (category === 'nonCommunicating') {
      filteredData = this.tableData.filter((item: any) => {
        const lastCommDate = item['Last Communication Date'] ? new Date(item['Last Communication Date']) : null;
        return lastCommDate && (new Date().getTime() - lastCommDate.getTime()) > 24 * 60 * 60 * 1000;
      });
      fileName = 'NonCommunicatingMeters.pdf';
    } else if (category === 'neverCommunicated') {
      filteredData = this.tableData.filter((item: any) => !item['Last Communication Date']);
      fileName = 'NeverCommunicatedMeters.pdf';
    } else if (category === 'total') {
      filteredData = this.tableData; // Include all data for total
      fileName = 'TotalMeters.pdf';
    }

    const columnNames = [
      'MeterSNo',
      'Consumer No',
      'Subdivision',
      'Last Communication Date',
      'Last Energy KWH',
      'Date of Installation',
      'IP Address Main',
      'Meter Type',
      'Network Type'
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