import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare let $: any;
import Swal from 'sweetalert2';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Utility } from 'src/app/Shared/utility';
import { Common } from 'src/app/Shared/Common/common';
import { ZoneService } from 'src/app/Services/zone.service';
import { Zone } from 'src/app/Models/zone';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {
  formdata: Zone = new Zone();
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
    menuname: 'Zone',
    url: '/zone',
  };

  iswritepermission: string;
  utility = new Utility();
  commonClass: Common;
  constructor(
    private zone: ZoneService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private datasharedservice: DataSharedService,
    private service: AuthService,
    private router: Router
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
        { extend: 'excel', title: 'Zone' },

        { extend: 'pdf', title: 'Zone' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender();
          },
        },
      ],
    };

    this.getZone();
    this.iswritepermission = localStorage.getItem('WriteAccess');
  }

  addZone() {
    $('#ModalAddZone').modal('show');
    this.isEdit = false;
    this.formdata = new Zone();
  }

  // onSubmit(form: NgForm) {
  //   this.spinner.show();
  //   this.subdivision.addSubdivision(form.value).subscribe((res: any) => {
  //     if (res.result == true) {
  //       this.spinner.hide();
  //       if (this.isEdit) {
  //         this.toaster.success('Record Updated Successfully');
  //       } else {
  //         this.toaster.success('Record Saved Successfully');
  //       }

  //       $('#ModalAddSubdivision').modal('hide');
  //       this.formdata = new SubDivision();

  //       this.rerender();
  //     }
  //      else {
  //       this.spinner.hide();
  //       this.toaster.error(res.message);
  //       $('#ModalAddSubdivision').modal('hide');
  //     }
  //   });
  // }
  onSubmit(form: NgForm) {
    this.spinner.show();
    this.zone.addZone(form.value).subscribe((res: any) => {
      debugger;
      if (res.result == true) {
        this.spinner.hide();
        if (this.isEdit) {
          this.toaster.success('Updated Successfully');
        } else {
          this.toaster.success('Saved Successfully');
        }

        $('#ModalAddZone').modal('hide');
        this.formdata = new Zone();

        this.rerender();
      } else {
        this.spinner.hide();
        this.toaster.error(res.message);
        $('#ModalAddZone').modal('hide');
      }
    });
  }
  getZone() {
    this.spinner.show();
    this.zone.getAllZone().subscribe((res: any) => {
      this.spinner.hide();
      this.commonClass.checkDataExists(res);
      this.headerdata = res.data[0][1];
      this.rowdata = [];
      for (let item in res.data[0]) {
        if (parseInt(item) !== 1) {
          this.rowdata.push(res.data[0][item]);
        }
      }
      this.dtTrigger.next();
    });
  }
  // getSubDivision() {
  //   this.spinner.show();
  //   this.subdivision.getAllSubDivisioin().subscribe({

  //     next: (res: any) => {
  //       debugger;
  //       this.spinner.hide();
  //       const validData = this.commonClass.checkDataExists(res);
  //       if (validData) {
  //         this.headerdata = res.data[0][1];
  //         this.rowdata = [];
  //         for (let item in res.data[0]) {
  //           if (parseInt(item) !== 1) {
  //             this.rowdata.push(res.data[0][item]);
  //           }
  //         }
  //         this.dtTrigger.next();
  //       }
  //     },
  //     error: (error) => {
  //       this.spinner.hide();
  //       console.error('Error fetching subdivision data:', error);
  //     }
  //   });
  // }
  rerender(): void {
    this.getZone();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  getZoneInfo(data: any) {
    this.spinner.show();
    this.isEdit = true;
    $('#ModalAddZone').modal('show');
    this.spinner.hide();
    this.formdata = {
      latitude: data[1],
      longitude: data[2],
      zoneName: data[0],
      ownerName: '',
    };
  }

  // deleteSubDivisionInfo(deviceid: string) {
  //   this.formdata.subDivisionName = deviceid;
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
  //       this.subdivision
  //         .deleteSubDivion(this.formdata)
  //         .subscribe((res: any) => {
  //           const validData = this.commonClass.checkDataExists(res);
  //             this.formdata = new SubDivision();
  //             Swal.fire('deleted successfully', '', 'success');
  //             // this.utility.updateApiKey(res.apiKey);;
  //             this.rerender();

  //         });
  //     }
  //   });
  // }
  // deleteSubDivisionInfo(deviceid: string) {
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
  //       const payload = { subDivisionName: deviceid };

  //       this.subdivision.deleteSubDivion(payload).subscribe(
  //         (res: any) => {
  //           if (this.commonClass.checkDataExists(res)) {
  //             Swal.fire('Deleted successfully', '', 'success');
  //             this.rerender();
  //           }
  //         },
  //         (error) => {
  //           Swal.fire('Error deleting subdivision', '', 'error');
  //         }
  //       );
  //     }
  //   });
  // }
  // Service method

  deleteZoneInfo(deviceid: string) {
    this.formdata.zoneName = deviceid;

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
        this.zone.deleteZone(this.formdata).subscribe({
          next: (res: any) => {
            const validData = this.commonClass.checkDataExists(res);
            if (validData) {
              this.formdata = new Zone();
              Swal.fire('Deleted successfully', '', 'success');
              this.rerender();
            } else {
              Swal.fire(
                'Error',
                res.message || 'Failed to delete zone',
                'error'
              );
            }
          },
          error: (error) => {
            Swal.fire('Error', 'Failed to delete zone', 'error');
          },
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
