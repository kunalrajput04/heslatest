import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DTService } from 'src/app/Services/dt.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { OnDemandService } from 'src/app/Services/on-demand.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
declare let $: any;
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  levelvalue: string = '';
  levelname: string = '';

  isSubdivision: boolean = false;
  isSubstation: boolean = false;
  isFeeder: boolean = false;
  isDT: boolean = false;

  subdivisionDropDown: any[] = [];
  substatioDropDown: any[] = [];
  feederDropDown: any[] = [];
  dtDropDown: any[] = [];
  deviceDropDown: any[] = [];
  isWriteAccess: boolean = true;
  constructor(
    private spinner: NgxSpinnerService,

    private subdivisionservice: SubDivisionService,

    private substation: SubStationService,
    private feederservice: FeederService,
    private dtservice: DTService,
    private service: OnDemandService,
    private router: Router
  ) {
    if (
      localStorage.getItem('levelName') !==
      localStorage.getItem('StorelevelName')
    ) {
      let levelname = localStorage.getItem('StorelevelName');
      let levelvalue = localStorage.getItem('StorelevelValue');

      localStorage.setItem('levelName', levelname);
      localStorage.setItem('levelValue', levelvalue);
    }
    this.levelname = localStorage.getItem('levelName');

    this.levelvalue = localStorage.getItem('levelValue');

    this.changeAccessLevel(this.levelname);
    if (parseInt(localStorage.getItem('WriteAccess')) != 0) {
      this.isWriteAccess = true;
    } else {
      this.isWriteAccess = false;
    }
  }

  ngOnInit(): void {}

  connectAndDisconnect() {
    $('#ModalConnectDisconnect').modal('show');
  }

  inStantRead() {
    $('#ModalConnectDisconnectInstant').modal('show');
  }

  getSubdivision() {
    this.spinner.show();
    this.subdivisionservice.getSubdivision().subscribe(
      (res: any) => {
    
        if (
          res != null &&
          res.message != 'Key Is Not Valid' &&
          res.message != 'Session Is Expired'
        ) {
          this.subdivisionDropDown = [];
          let obj = res.data[0];
          for (var item in obj) {
            this.subdivisionDropDown.push(obj[item][0]);
          }
          // this.spinner.hide();
        } else {
    
          
        }
      },
      (error) => console.log('error', error)
    );
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    //this.router.navigate(['/meecl']);
  }

  getSubstation(subdivision: string) {
    localStorage.setItem('levelName', 'SUBDEVISION');
    localStorage.setItem('levelValue', subdivision);
    //this.spinner.show();
    this.substation
      .getSubstationBySubdivision(subdivision)
      .subscribe((res: any) => {
        //this.spinner.hide();
        this.substatioDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.substatioDropDown.push(obj[item][0]);
          }
        }
      });
  }
  getFeeder(substation: string) {
    localStorage.setItem('levelName', 'SUBSTATION');
    localStorage.setItem('levelValue', substation);
    //this.spinner.show();
    this.feederservice
      .getFeederBySubstation(substation)
      .subscribe((res: any) => {
        //this.spinner.hide();
        this.feederDropDown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.feederDropDown.push(obj[item][0]);
          }
        }
      });
  }
  getDT(feeder: string) {
    localStorage.setItem('levelName', 'FEEDER');
    localStorage.setItem('levelValue', feeder);
    // this.spinner.show();
    this.dtservice.getDTByFeeder(feeder).subscribe((res: any) => {
      // this.spinner.hide();
      this.dtDropDown = [];
      if (res.data != null) {
        let obj = res.data[0];
        for (var item in obj) {
          this.dtDropDown.push(obj[item][0]);
        }
      }
    });
  }
  getDevice(levelValue: string) {
    localStorage.setItem('levelName', 'DT');
    localStorage.setItem('levelValue', levelValue);
    this.service.getDeviceForDT(levelValue).subscribe((res: any) => {
      this.deviceDropDown = [];
      if (res.data != null) {
        // this.spinner.hide();
        let obj = res.data[0];
        for (var item in obj) {
          this.deviceDropDown.push(obj[item][1]);
        }
      }
    });
  }
  setDevice(levelValue: string) {
    localStorage.setItem('levelName', 'METER');
    localStorage.setItem('levelValue', levelValue);
  }
  changeAccessLevel(accessvalue: string) {
    if (accessvalue == 'All') {
      this.getSubdivision();
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = true;
    } else if (accessvalue == 'SUBDEVISION') {
      this.getSubstation(this.levelvalue);
      this.isSubdivision = false;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = true;
    } else if (accessvalue == 'SUBSTATION') {
      this.getFeeder(this.levelvalue);
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = true;
      this.isDT = true;
    } else if (accessvalue == 'FEEDER') {
      this.getDT(this.levelvalue);
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = true;
    } else if (accessvalue == 'DT') {
      this.getDevice(this.levelvalue);
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
    } else {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
    }
  }
}
