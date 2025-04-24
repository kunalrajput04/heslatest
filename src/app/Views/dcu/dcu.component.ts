import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { ToastrService } from 'ngx-toastr';
import { SubDivision } from 'src/app/Models/sub-division';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { Dcu } from 'src/app/Models/dcu';
declare let $: any;
import Swal from 'sweetalert2';

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Utility } from 'src/app/Shared/utility';
import { DCUService } from 'src/app/Services/dcu.service';

@Component({
  selector: 'app-dcu',
  templateUrl: './dcu.component.html',
  styleUrls: ['./dcu.component.scss']
})
export class DcuComponent implements OnInit {
  
    formdata: Dcu = new Dcu();
    isEdit: boolean = false;
    headerdata = [];
    rowdata = [];
    pageOfItems: Array<any>;
    items = [];
    searchText = null;
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
  
    data: Headernavigation = {
      firstlevel: 'Hierarchy',
      menuname: 'DCU',
      url: '/DCU',
    };
  
    iswritepermission: string;
    utility = new Utility();
    constructor(private render: Renderer2,
     // private subdivision: SubDivisionService,
      private _dcuService: DCUService,
      private toaster: ToastrService,
      private spinner: NgxSpinnerService,
      private datasharedservice: DataSharedService,
      private service: AuthService,
      private router: Router
    ) {
      this.datasharedservice.chagneHeaderNav(this.data);
    }
  
    ngOnInit(): void {
      let obj = this;
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100, 500, 1000, 10000],
        scrollY: 400,
  
        dom: 'lBfrtip',
        processing: true,
  
        buttons: [
          { extend: 'excel', title: 'Dcu' },
  
          { extend: 'pdf', title: 'Dcu' },
          {
            text: 'Refresh',
            action: function () {
              obj.rerender();
            },
          },
        ],
      };
  
      this.getDcu();
      this.iswritepermission = localStorage.getItem('WriteAccess');
    }
  
    addDCU() {
      $('#ModalAddDcu').modal('show');
      this.isEdit = false;
      this.formdata = new Dcu();
    }
  
    onSubmit(form: NgForm) {
      this.spinner.show();
      this._dcuService.addDcu(form.value).subscribe((res: any) => {
        
        if (res.data == true) {
          this.spinner.hide();
          if (this.isEdit) {
            this.toaster.success('Record Updated Successfully');
          } else {
            this.toaster.success('Record Saved Successfully');
          }
  
          $('#ModalAddDcu').modal('hide');
          this.formdata = new Dcu();
         // this.utility.updateApiKey(res.apiKey);;
          this.rerender();
        }
         else {
          this.spinner.hide();
          this.toaster.error(res.message);
          $('#ModalAddDcu').modal('hide');
        }
      });
    }
  
    getDcu() {
      this.spinner.show();
      this._dcuService.getAllDCU().subscribe((res: any) => {          
        if (res != null && res.message != 'Key Is Not Valid') {
          this.spinner.hide();
          this.headerdata = res.data[0][1];
          this.rowdata = [];
          for (let item in res.data[0]) {
            if (parseInt(item) !== 1) {
              this.rowdata.push(res.data[0][item]);
            }
          }
          this.dtTrigger.next();
          //this.utility.updateApiKey(res.apiKey);;
        } else {
        //  
        }
      });
    }
  
    rerender(): void {
      this.getDcu();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
  
    onChangePage(pageOfItems: Array<any>) {
      // update current page of items
  
      this.pageOfItems = pageOfItems;
    }
  
    getDcuInfo(data: any) {
      this.spinner.show();
      this.isEdit = true;
  
      $('#ModalAddDcu').modal('show');
      this.spinner.hide();
      this.formdata = {  
        timestamp: data[0],
          dcu_serial_number: data[1],
          simSerialNo: data[2],
          simOperator: data[3],
          simIp: data[4],
          signalStrength: data[5],
          battery_voltage: data[6],
          cpu_temperature: data[7],
          latitude: data[8],
          longitude: data[9],
          user_id: '',
      
    
      };
    }
  
  
  }
