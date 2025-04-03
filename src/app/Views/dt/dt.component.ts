import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DT } from 'src/app/Models/dt';
import { GetSubdivision } from 'src/app/Models/get-subdivision';
import { SubStation } from 'src/app/Models/sub-station';
import { DataService } from 'src/app/Services/data.service';
import { DTService } from 'src/app/Services/dt.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
import Swal from 'sweetalert2';

import { Headernavigation } from 'src/app/Model/headernavigation';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/Services/auth.service';
import { Utility } from 'src/app/Shared/utility';

declare let $: any;
@Component({
  selector: 'app-dt',
  templateUrl: './dt.component.html',
  styleUrls: ['./dt.component.scss'],
})
export class DTComponent implements OnInit {
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

  formdata: DT = new DT();
  subdivisionDropDown: any[] = [];
  substationDropdown: any[] = [];
  feederDropdown: any[] = [];

  data: Headernavigation = {
    firstlevel: 'Hierarchy',
    menuname: 'DT',
    url: '/DT',
  };

  iswritepermission: string;
  utility = new Utility();
  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private dtservice: DTService,
    private router: Router,
    private subdivisionservice: SubDivisionService,
    private substation: SubStationService,
    private feeder: FeederService,
    private datasharedservice: DataSharedService,
    private authservice: AuthService
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
        { extend: 'excel', title: 'DT' },

        { extend: 'pdf', title: 'DT' },
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
    this.rowdata = [];
    this.spinner.show();
    this.dtservice.getDtData().subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        this.spinner.hide();

        this.headerdata = res.data[0][1];
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

  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  rerender(): void {
    this.onTableget();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
  }

  openAddModel() {
    this.isEdit = false;
    this.formdata = new DT();
    this.getSubdivision();
  }
  getSubdivision() {
    this.spinner.show();

    this.subdivisionservice.getSubdivision().subscribe((res: any) => {
      this.spinner.hide();
      if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
        this.subdivisionDropDown = [];
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
  getSubstation(subdivision: string) {
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
          this.utility.updateApiKey(res.apiKey);;
        }
      });
  }
  getFeeder(substation: string) {
    this.spinner.show();
    this.feeder.getFeederBySubstation(substation).subscribe((res: any) => {
      this.spinner.hide();
      this.feederDropdown = [];
      if (res.data != null) {
        let obj = res.data[0];
        for (var item in obj) {
          this.feederDropdown.push(obj[item][0]);
        }
        this.utility.updateApiKey(res.apiKey);;
      }
    });
  }
  getDTInfo(data: any) {
    this.isEdit = true;
    $('#ModalAddDT').modal('show');
    this.getSubdivision();
    this.formdata = {
      latitude: data[5],
      longitude: data[4],
      subDivisionName: data[2],
      subStationName: data[1],
      ownerName: localStorage.getItem('UserID'),
      feederName: data[3],
      dtName: data[0],
    };
  }
  onSubmit(form: NgForm) {
    $('#ModalAddDT').modal('hide');
    this.spinner.show();
    this.dtservice.addDT(form.value).subscribe((res: any) => {
      this.spinner.hide();
      if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
        if (res.data == true) {
          this.rerender();
          if (this.isEdit) {
            this.toaster.success('Updated Successfully');
          } else {
            this.toaster.success('Created Successfully');
          }
          this.utility.updateApiKey(res.apiKey);;
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

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }
  deleteDTInfo(dtname: string) {
    this.formdata.dtName = dtname;
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
        this.dtservice.deleteDTData(this.formdata).subscribe((res: any) => {
          if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
            this.formdata = new DT();
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
}
