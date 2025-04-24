import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Models/user';
import { UserCreate } from 'src/app/Models/user-create';
import { DTService } from 'src/app/Services/dt.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
import { UserServiceeService } from 'src/app/Services/user-servicee.service';
import { Common } from 'src/app/Shared/Common/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  formdata: UserCreate = new UserCreate();
  repeatPassword: string = '';
  subdivisionDropDown: any[] = [];
  substationDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  utilityDropdown: any[] = [];
  isSubdivision: boolean = false;
  isSubstation: boolean = false;
  isFeeder: boolean = false;
  isDT: boolean = false;
  subdivisonvalue: string = '';
  substationvalue: string = '';
  feedervalue: string = '';
  dtvalue: string = '';
  isUpdate: boolean = false;
  commonClass: Common;
  constructor(
    private spinner: NgxSpinnerService,
    private subdivisionservice: SubDivisionService,
    private substation: SubStationService,
    private feeder: FeederService,
    private dtservice: DTService,
    private userservice: UserServiceeService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let userid = localStorage.getItem('UserID');
    if (userid != 'All') {
      this.router.navigate(['/']);
    }
    this.getUtility();
  }
  getSubdivision() {
    this.spinner.show();

    this.subdivisionservice
      .getSubdivisionForRegistration(this.formdata.accessOwner)
      .subscribe((res: any) => {
        this.spinner.hide();
        // if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          const validData = this.commonClass.checkDataExists(res);
          this.subdivisionDropDown = [];
          let obj = res.data[0];

          for (var item in obj) {
            this.subdivisionDropDown.push(obj[item][0]);
          }
          

          this.formdata.accessSubdivision = this.subdivisonvalue;
       
      });
  }
    
  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }
  getSubstation() {
    this.spinner.show();
    this.substation
      .getSubstationBySubdivision(this.formdata.accessSubdivision)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.substationDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.substationDropDown.push(obj[item][0]);
          }
          this.formdata.accessSubStation = this.substationvalue;
        }
      });
  }
  saveUser(form: NgForm) {
    if (
      this.formdata.password !== this.repeatPassword &&
      this.isUpdate == false
    ) {
      this.toastr.error('Password Not Matched !');
    } else {
      this.spinner.show();

      this.userservice.adduser(this.formdata).subscribe((res: any) => {
        if (res.data == true) {
          this.spinner.hide();
          this.toastr.success('Record Saved Successfully');
          this.router.navigate(['/login']);
        } else {
          this.spinner.hide();
          this.toastr.error('Oops! Something Went wrong');
        }
      });
    }
  }
  getexistingUser() {
    this.spinner.show();
    this.userservice
      .getuserbyemail(this.formdata.email)
      .subscribe((res: any) => {
        
        this.spinner.hide();
        if (res.message == 'Not Found') {
          let email = this.formdata.email;
          this.formdata = new UserCreate();
          this.formdata.email = email;
          this.isUpdate = false;
        } else {
          this.isUpdate = true;
          if (res.roleid == 2) {
            this.getSubdivision();
          } else if (res.roleid == 3) {
            this.getSubdivision();
            this.getSubstation();
          } else if (res.roleid == 4) {
            this.getSubdivision();
            this.getSubstation();
            this.getFeeder();
          } else if (res.roleid == 5) {
            this.getSubdivision();
            this.getSubstation();
            this.getFeeder();
            this.getDT();
          }

          this.dtvalue = res.access_dt;
          this.feedervalue = res.access_feeder;
          this.formdata.accessOwner = res.access_owner;
          this.substationvalue = res.access_substation;
          this.formdata.designation = res.designation;
          this.formdata.roleID = res.roleid;
          this.formdata.userName = res.username;
          this.formdata.password = res.password;
          this.formdata.email = res.email;
          this.formdata.writeAccess = res.writeaccess;
          this.subdivisonvalue = res.access_subsdivision;
          this.formdata.welcomemsg = res.welcomemsg;
          this.changeAccessLevel(JSON.parse(this.formdata.roleID));
        }
      });
  }
  getUtility() {
    this.spinner.show();
    this.subdivisionservice.getUtility().subscribe((res: any) => {
      this.spinner.hide();
      this.utilityDropdown = [];
      if (res.data != null) {
        let obj = res.data[0];
        for (var item in obj) {
          this.utilityDropdown.push(obj[item][0]);
        }
      }
    });
  }
  getFeeder() {
    this.spinner.show();
    this.feeder
      .getFeederBySubstation(this.formdata.accessSubStation)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.feederDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
          this.formdata.accessFeeder = this.feedervalue;
        }
      });
  }
  getDT() {
    this.spinner.show();
    this.dtservice
      .getDTByFeeder(this.formdata.accessFeeder)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.dtDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.dtDropDown.push(obj[item][0]);
          }
          this.formdata.accessDT = this.dtvalue;
        }
      });
  }
  changeAccessLevel(accessvalue: number) {
    if (accessvalue == 2) {
      this.isSubdivision = true;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
    } else if (accessvalue == 3) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = false;
      this.isDT = false;
    } else if (accessvalue == 4) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = false;
    } else if (accessvalue == 5) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = true;
    } else {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
    }
  }
  changeUtility() {
    if (this.isSubdivision) {
      this.getSubdivision();
    }
  }
}
