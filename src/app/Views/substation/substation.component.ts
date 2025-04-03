import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { SubStation } from 'src/app/Models/sub-station';
import { DeviceService } from 'src/app/Services/device.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import Swal from 'sweetalert2';
import { SubStationService } from 'src/app/Services/sub-station.service';
declare let $: any;

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Utility } from 'src/app/Shared/utility';

@Component({
  selector: 'app-substation',
  templateUrl: './substation.component.html',
  styleUrls: ['./substation.component.scss'],
})
export class SubstationComponent implements OnInit {
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
  formdata: SubStation = new SubStation();

  subdivisionDropDown: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Hierarchy',
    menuname: 'Substation',
    url: '/Substation',
  };

  iswritepermission: string;
  utility = new Utility();
  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private substationservice: SubStationService,
    private router: Router,
    private deviceservice: DeviceService,
    private subdivisionservice: SubDivisionService,
    private datasharedservice: DataSharedService,
    private service: AuthService
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
        { extend: 'excel', title: 'Substation' },

        { extend: 'pdf', title: 'Substation' },
        {
          text: 'Refresh',
          action: function () {
            obj.rerender();
          },
        },
      ],
    };
    this.onTableget();
    this.iswritepermission = localStorage.getItem('WriteAccess');
  }

  onTableget() {
    this.spinner.show();
    this.substationservice.getSubstationData().subscribe((res: any) => {
      this.spinner.hide();
      if (res != null && res.message != 'Key Is Not Valid') {
        this.headerdata = res.data[0][1];
        this.rowdata = [];
        for (let item in res.data[0]) {
          if (parseInt(item) !== 1) {
            this.rowdata.push(res.data[0][item]);
          }
        }
        this.utility.updateApiKey(res.apiKey);;

        this.dtTrigger.next();
      } else {
        this.spinner.hide();
        this.logout();
      }
    });
  }

  rerender(): void {
    this.onTableget();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  onSubmit(form: NgForm) {
    $('#ModalUpdateSubstation').modal('hide');
    this.spinner.show();

    this.substationservice.addSubStation(form.value).subscribe((res: any) => {
      this.spinner.hide();
      if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
        if (res.data == true) {
          if (this.isEdit) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.success('Created Successfully');
          }
          this.rerender();
        }
        else {
          this.toaster.error(res.message);

        }
      }
      else {

        this.logout();
      }
    });
  }

  getSubstationInfo(substation: any) {
    this.isEdit = true;
    $('#ModalUpdateSubstation').modal('show');

    this.getSubdivision();
    this.formdata = {
      latitude: substation[2],
      longitude: substation[3],
      subdivisionName: substation[0],
      substation_name: substation[1],
      user_id: localStorage.getItem('UserID'),
    };
  }

  openAddModel() {
    this.isEdit = false;
    this.formdata = new SubStation();
    this.getSubdivision();
  }
  getSubdivision() {
    this.spinner.show();
    this.subdivisionDropDown = [];

    this.subdivisionservice.getSubdivision().subscribe((res: any) => {
      this.spinner.hide();
      if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
        let obj = res.data[0];
        for (var item in obj) {
          this.subdivisionDropDown.push(obj[item][0]);
        }
        this.utility.updateApiKey(res.apiKey);;

      }
      else {

        this.logout();
      }
    });
  }
  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  deleteSubstationInfo(meterno: string) {
    this.formdata = new SubStation();
    this.formdata.substation_name = meterno;

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
        this.substationservice
          .deleteSubstationData(this.formdata)
          .subscribe((res: any) => {
            if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
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
