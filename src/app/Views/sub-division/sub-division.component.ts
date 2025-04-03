import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { ToastrService } from 'ngx-toastr';
import { SubDivision } from 'src/app/Models/sub-division';
import { SubDivisionService } from 'src/app/Services/sub-division.service';

declare let $: any;
import Swal from 'sweetalert2';

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-sub-division',
  templateUrl: './sub-division.component.html',
  styleUrls: ['./sub-division.component.scss'],
})
export class SubDivisionComponent implements OnInit {
  formdata: SubDivision = new SubDivision();
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
    menuname: 'SubDevision',
    url: '/subdivision',
  };

  iswritepermission: string;
  utility = new Utility();
  constructor(
    private subdivision: SubDivisionService,
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
        { extend: 'excel', title: 'Subdivision' },

        { extend: 'pdf', title: 'Subdivision' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender();
          },
        },
      ],
    };

    this.getSubDivision();
    this.iswritepermission = localStorage.getItem('WriteAccess');
  }

  addSubDivision() {
    $('#ModalAddSubdivision').modal('show');
    this.isEdit = false;
    this.formdata = new SubDivision();
  }

  onSubmit(form: NgForm) {
    this.spinner.show();
    this.subdivision.addSubdivision(form.value).subscribe((res: any) => {
      
      if (res.data == true) {
        this.spinner.hide();
        if (this.isEdit) {
          this.toaster.success('Record Updated Successfully');
        } else {
          this.toaster.success('Record Saved Successfully');
        }

        $('#ModalAddSubdivision').modal('hide');
        this.formdata = new SubDivision();
        this.utility.updateApiKey(res.apiKey);;
        this.rerender();
      }
       else {
        this.spinner.hide();
        this.toaster.error(res.message);
        $('#ModalAddSubdivision').modal('hide');
      }
    });
  }

  getSubDivision() {
    this.spinner.show();
    this.subdivision.getAllSubDivisioin().subscribe((res: any) => {
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
        this.utility.updateApiKey(res.apiKey);;
      } else {
        this.logout();
      }
    });
  }

  rerender(): void {
    this.getSubDivision();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items

    this.pageOfItems = pageOfItems;
  }

  getSubDivisionInfo(data: any) {
    this.spinner.show();
    this.isEdit = true;

    $('#ModalAddSubdivision').modal('show');
    this.spinner.hide();
    this.formdata = {
      latitude: data[1],
      longitude: data[2],
      substation_name: data[0],
      user_id: '',
    };
  }

  deleteSubDivisionInfo(deviceid: string) {
    this.formdata.substation_name = deviceid;
    Swal.fire({
      title: 'Are you sure?',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },

      text: 'You will not be able to recover this data! Enter your reason',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value == '') {
        Swal.fire('Please Enter Delete Reason!', '', 'error');
      } else if (result.isConfirmed) {
        this.subdivision
          .deleteSubDivion(this.formdata)
          .subscribe((res: any) => {
             if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
              this.formdata = new SubDivision();
              Swal.fire('deleted successfully', '', 'success');
              this.utility.updateApiKey(res.apiKey);;
              this.rerender();
            }
            else {
        
              this.logout();
            }
          });
      }
    });
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }
}
