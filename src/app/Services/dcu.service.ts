import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetSubdivision } from '../Models/get-subdivision';
import { SubDivision } from '../Models/sub-division';
import { UserKey } from '../Models/user-key';
import { Dcu } from '../Models/dcu';
import { Observable } from 'rxjs';

export interface Billing {
  crn: string;  
}
@Injectable({
  providedIn: 'root',
})
export class DCUService {  

  rfBill: Billing ={
    crn: '',
    
  };
  data: UserKey = new UserKey();
  ownerdata: GetSubdivision = new GetSubdivision();
  constructor(private http: HttpClient) { 
  
  }
  addDcu(formdata: Dcu) {   
    formdata.user_id = localStorage.getItem('UserID'); 
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.rf}/MeterData/rec/rest/Evit/GetDCUHealth`,  
      httpOptions
    );
  }
  getUtility() {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.get(
      `${environment.apiUrl}/Evit/getOwnerList/XXXXX`,
      httpOptions
    );
  }
  getDCU(): Observable<any> {    
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.rf}/MeterData/rec/rest/Evit/GetDCUHealth`,
      httpOptions
    );
  }
  getAllDCU() {
    this.data = {
      ownerName: localStorage.getItem('UserID'),
    };
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
        `${environment.rf}/MeterData/rec/rest/Evit/GetDCUHealth`,
      this.data,
      httpOptions
    );
  }

  getDCUById(username: any, deviceid: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.get(
      `${environment.rf}/MeterData/rec/rest/Evit/GetDCUHealth/` +
        username +
        `/` +
        deviceid +
        ``,
      httpOptions
    );
  }

  deleteDCU(data: Dcu) {
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };

    return this.http.post(      
      `${environment.rf}/MeterData/rec/rest/Evit/DeleteDCUHealth`,
      data,
      httpOptions
    );
  }
//DCU OUTAGE
  getDcuOutage(): Observable<any> {    
    const httpOptions = {
      headers: new HttpHeaders({
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
      `${environment.rf}/MeterData/rec/rest/Evit/GetDCUOutage`,
      httpOptions
    );
  }

  // billing api start here    

  getBillingCategory(): Observable<any> {    
    const httpOptions = {
      headers: new HttpHeaders({
        
      }),
    };
    return this.http.post(
      `${environment.rf}/Bill/billingcategorydetail`,
      httpOptions
    );
  }

  getBillingConsumer(): Observable<any> {    
    const httpOptions = {
      headers: new HttpHeaders({
        
      }),
    };
    return this.http.get(
      `${environment.rf}/Bill/showconsumerdetail`,
      httpOptions
    );
  }

  //   getBilling(): Observable<any> {    
  //   const httpOptions = {
  //     headers: new HttpHeaders({
        
  //     }),
  //   };
  //   return this.http.post(
  //     `${environment.rf}/Billing/billingdetail`,
  //     httpOptions
  //   );
  // }

  // billReport(crn: any,cotegory: any) {    
  //   this.rfBill = {
  //     crn: crn,
  //     // billingCatogort: cotegory      
  //   };
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //      // apiKey: localStorage.getItem('apikey'),
  //     }),
  //   };
  //   return this.http.post(
  //     `${environment.rf}/Billing/BillReportFinal`,
  //     this.rfBill,
  //     httpOptions
  //   );
  // }
  //http://206.1.12.216:8081/api/Billing/BillReportFinal


  billReportpdf(crn: any) {    
    this.rfBill = {
      crn: crn          
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(
       `${environment.rf}/Bill/BillReportFinal`,
      this.rfBill,
      httpOptions
    );
  }


  // billReportpdfW(crn: any): Observable<any> {    
  //   this.rfBill = {
  //     crn: crn          
  //   };
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       apiKey: localStorage.getItem('apikey'),
  //     }),
  //   };
  //   return this.http.post(      
  //     `${environment.rf}/Bill/BillReportFinalwork`,
  //     this.rfBill,
  //     httpOptions
  //   );
  // }



  //============LIST FOR ONLY=======
  billReportpdfL(crn: string = 'All'): Observable<any> {  
    const payload = { crn: [crn === "" ? "All" : crn] };
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'apiKey': localStorage.getItem('apikey'),
      }),
    };
   return this.http.post<any[]>(
    `${environment.rf}/Bill/BillReportFinalwork`,
     payload, httpOptions);
  }  

  //==========================
  BillingListPdf(data:any){
    const httpOptions = {
      headers: new HttpHeaders({        
        apiKey: localStorage.getItem('apikey'),
      }),
    }
    return this.http.post(
      `${environment.rf}/Bill/BillReportFinalwork`,
      data,httpOptions
    );
  }

    // billReportpdfW(crn: any): Observable<any> {    
  //   this.rfBill = {
  //     crn: crn          
  //   };
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       apiKey: localStorage.getItem('apikey'),
  //     }),
  //   };
  //   return this.http.post(      
  //     `${environment.rf}/Bill/BillReportFinalwork`,
  //     this.rfBill,
  //     httpOptions
  //   );
  // }


  // billReportpdfW(crn: string): Observable<any> {
  //   const payload = {
  //     crn: [crn]
  //   };
  
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       apiKey: localStorage.getItem('apikey'),
  //     }),
  //   };
  
  //   return this.http.post(`${environment.rf}/Bill/BillReportFinalwork`, payload, httpOptions);
  // }

  //==========================history use for Bill Pdf download link genreate =======

  getBillingHistory(): Observable<any> {    
    const httpOptions = {
      headers: new HttpHeaders({
        
      }),
    };
    return this.http.get(
      `${environment.rf}/Bill/Billinfo`,
      httpOptions
    );
  }
 //====================== rf Bill History by rajneesh
 getBillingData(): Observable<any> {    
    const httpOptions = {
      headers: new HttpHeaders({
        
      }),
    };
    return this.http.get(
      `${environment.rf}/Bill/BillHistory`,
      httpOptions
    );
  }

  //================billing wala for pdf without list

  billReportpdfW(crn: any): Observable<any> {    
    this.rfBill = {
      crn: crn          
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        apiKey: localStorage.getItem('apikey'),
      }),
    };
    return this.http.post(      
      `${environment.rf}/Bill/BillReportFinaltest`,
      this.rfBill,
      httpOptions
    );
  }

  //-------------------L2
  // billReportpdfLL(crns: string[] = ['All']): Observable<any> {  
  //   const payload = { crn: crns.length > 0 ? crns : ['All'] };
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'apiKey': localStorage.getItem('apikey'),
  //     }),
  //   };
  //   return this.http.post<any[]>(
  //     `${environment.rf}/Bill/BillReportFinalwork`,
  //     payload,
  //     httpOptions
  //   );
  // }
  //=================this is use before device info data multiple time
  // billReportpdfLL(crns: string[] = ['All']): Observable<any> {  
  //   const payload = { crn: crns };
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //       'apiKey': localStorage.getItem('apikey'),
  //     }),
  //   };
  //   return this.http.post<any[]>(
  //     `${environment.rf}/Bill/BillReportFinalwork`,
  //     payload,
  //     httpOptions
  //   );
  // }
  billReportpdfLLL(crns: string[] = ['All']): Observable<any> {  
    const payload = { crn: crns };
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'apiKey': localStorage.getItem('apikey'),
      }),
    };
    return this.http.post<any[]>(
      `${environment.rf}/Bill/BillReportFinalworktest`,
      payload,
      httpOptions
    );
  }
}
