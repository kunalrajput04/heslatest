import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dropdown } from 'src/app/Models/dropdown';
import { Feeder } from 'src/app/Models/feeder';
import { GetSubdivision } from 'src/app/Models/get-subdivision';
import { SubDivision } from 'src/app/Models/sub-division';
import { SubStation } from 'src/app/Models/sub-station';
import { DataService } from 'src/app/Services/data.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
import Swal from 'sweetalert2';
declare let $: any;

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { Utility } from 'src/app/Shared/utility';
import { Common } from 'src/app/Shared/Common/common';

@Component({
  selector: 'app-feeder',
  templateUrl: './feeder.component.html',
  styleUrls: ['./feeder.component.scss'],
})
export class FeederComponent implements OnInit {
  formdata: Feeder = new Feeder();

  subdivisionDropDown: Dropdown[] = [];
  substationDropdown: Dropdown[] = [];
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
commonClass: Common;
  data: Headernavigation = {
    firstlevel: 'Hierarchy',
    menuname: 'Feeder',
    url: '/Feeder',
  };

  iswritepermission: string;
  utility = new Utility();
  
  constructor(
    private service: DataService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private feederservice: FeederService,
    private authservice: AuthService,
    private router: Router,
    private substation: SubStationService,
    private subdivisionservice: SubDivisionService,
    private datasharedservice: DataSharedService
  ) {
    this.datasharedservice.chagneHeaderNav(this.data);
    this.commonClass = new Common(datasharedservice);
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
        { extend: 'excel', title: 'Feeder' },

        { extend: 'pdf', title: 'Feeder' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender();
          },
        },
      ],
    };
    this.getFeeder();
    this.getSubdivision();
    this.iswritepermission = localStorage.getItem('WriteAccess');
  }

  addFeeder() {
    $('#ModalAddFeeder').modal('show');
    this.getSubdivision();
    this.formdata = new Feeder();
    this.isEdit = false;
  }

  saveFeeder(form: NgForm) {
    this.spinner.show();

    this.feederservice.addFeeder(form.value).subscribe((res: any) => {
      // if (res.data == true) {
        if (res && res.result === true) {
        if (this.isEdit) {
          this.spinner.hide();
          this.toaster.success('Record Saved Successfully');
          $('#ModalAddFeeder').modal('hide');
          this.utility.updateApiKey(res.apiKey);;
          this.rerender();
        } else if (res.data == null) {
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toaster.success('Record Updated Successfully');
          $('#ModalAddFeeder').modal('hide');
          this.utility.updateApiKey(res.apiKey);;
          this.rerender();
        }
      } else {
        this.spinner.hide();
        this.toaster.error(res.message);
        $('#ModalAddFeeder').modal('hide');
      }
      this.isEdit = false;
    });
  }
  getSubdivision() {
    this.spinner.show();
    this.subdivisionservice.getSubdivision().subscribe((res: any) => {
      this.spinner.hide();
      const validData = this.commonClass.checkDataExists(res);
        this.subdivisionDropDown = [];
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
      //  this.utility.updateApiKey(res.apiKey);        
   
    });
  }

  getSubstation(subdivision: string) {
    // this.subdivisionDropDown = [];
    this.spinner.show();
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.substationDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.substationDropdown.push(obj[item][0]);
          }
        //  this.utility.updateApiKey(res.apiKey);;
        }
      });
  }

  getFeeder() {
    this.spinner.show();
    this.feederservice.getFeederList().subscribe((res: any) => {
      this.spinner.hide();
      const validData = this.commonClass.checkDataExists(res);
        this.rowdata = [];
        this.headerdata = res.data[0][1];

        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.rowdata.push(res.data[0][item]);
          }
        }
     //   this.utility.updateApiKey(res.apiKey);;
        this.dtTrigger.next();
    
    });
  }

  logout() {
     
	sessionStorage.clear();
  localStorage.clear();
  this.router.navigate(['/meecl']);
  }

  rerender(): void {
    this.getFeeder();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  getFeederInfo(data: any) {
    this.spinner.show();
    this.isEdit = true;

    $('#ModalAddFeeder').modal('show');

    this.getSubdivision();
    this.getSubstation(data[0]);
    this.formdata = {
      subDivisionName: data[0],
      subStationName: data[1],
      feederName: data[2],
      latitude: data[3],
      longitude: data[4],
      ownerName: localStorage.getItem('UserID'),
    };
  }

  // deleteFederInfo(feerderId: string) {
  //   this.formdata.feederName = feerderId;
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     input: 'text',
  //     inputAttributes: {
  //       autocapitalize: 'off',
  //     },

  //     text: 'You will not be able to recover this data! Enter your reason',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.value == '') {
  //       Swal.fire('Please Enter Delete Reason!', '', 'error');
  //     } else if (result.isConfirmed) {
  //       this.feederservice.deleteFeeder(this.formdata).subscribe((res: any) => {
  //         const validData = this.commonClass.checkDataExists(res);
  //           this.formdata = new Feeder();
  //           Swal.fire('deleted successfully', '', 'success');
  //           this.utility.updateApiKey(res.apiKey);;
  //           this.rerender();
        
  //       });
  //     }
  //   });
  // }

  deleteFederInfo(feerderId: string) {
    this.formdata.feederName = feerderId;    
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
        this.feederservice.deleteFeeder(this.formdata)
          .subscribe({
            next: (res: any) => {
              const validData = this.commonClass.checkDataExists(res);
              if (validData) {
                this.formdata = new Feeder();
                Swal.fire('Deleted successfully', '', 'success');
             
                this.rerender();
              } else {
                Swal.fire('Error', res.message || 'Failed to delete feeder', 'error');
              }
            },
            error: (error) => {
              Swal.fire('Error', 'Failed to delete feeder', 'error');
            }
          });
      }
    });
  }
}
