import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Headernavigation } from 'src/app/Model/headernavigation';
import { UserCreate } from 'src/app/Models/user-create';
import { AuthService } from 'src/app/Services/auth.service';
import { DataSharedService } from 'src/app/Services/data-shared.service';
import { DTService } from 'src/app/Services/dt.service';
import { FeederService } from 'src/app/Services/feeder.service';
import { OnDemandService } from 'src/app/Services/on-demand.service';
import { SubDivisionService } from 'src/app/Services/sub-division.service';
import { SubStationService } from 'src/app/Services/sub-station.service';
import { EditButtonComponent } from 'src/app/Shared/AgGrid/edit-button/edit-button.component';
import { Utility } from 'src/app/Shared/utility';
import Swal from 'sweetalert2';
declare let $: any;
export interface IFirmwareData {
  firmWareFile: File,
  manufacturer: string,
  version: string,
  status: string,
  imageIdentifier: string

}

@Component({
  selector: 'app-firm-ware',
  templateUrl: './firm-ware.component.html',
  styleUrls: ['./firm-ware.component.scss']
})
export class FirmWareComponent implements OnInit {
  iswritepermission: string;
  UtilityDropdown: any[] = [];
  formdata: UserCreate = new UserCreate();
  currentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
  SubDivisionDropdown: any[] = [];
  SubStationDropdown: any[] = [];
  FeederDropdown: any[] = [];
  DTDropdown: any[] = [];
  isSubdivision: boolean = false;
  isSubstation: boolean = false;
  isFeeder: boolean = false;
  isDT: boolean = false;
  levelName: string = '';
  levelValue: string = '';
  isMeter: boolean = true;
  data: Headernavigation = {
    firstlevel: 'Settings',
    menuname: 'Firmware',
    url: '/firmware',
  };

  formFiledata: IFirmwareData = {
    firmWareFile: null,
    manufacturer: '',
    status: '',
    version: '',
    imageIdentifier: ''
  };


  gridOptions: any;
  defaultColDef: any;
  columnDefs: any;
  gridApi: any;
  gridColumnApi: any;
  tableData: any[] = [];
  utility = new Utility();
  frameworkComponents: any;
  rowSelection = 'multiple';
  constructor(private spinner: NgxSpinnerService,
    private subdivisionservice: SubDivisionService,
    private substation: SubStationService,
    private feeder: FeederService,
    private dtservice: DTService,
    private router: Router,
    private ondemmand: OnDemandService,
    private toaster: ToastrService,
    private datePipe: DatePipe,
    private datasharedservice: DataSharedService) {
    this.gridOptions = { context: { componentParent: this } }
    this.defaultColDef = {
      resizable: true, filter: false, sortable: true
    };
    this.frameworkComponents = {
      buttonRenderer: EditButtonComponent,
    };
    this.columnDefs = [
      {
        field: 'fileName',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      { field: 'uploadDatetime' },
      { field: 'imageIdentifier' },
      { field: 'status' },
      { field: 'version' },

      { field: 'manufacturer' },
      {
        headerName: 'Delete',

        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onDeleteRow.bind(this),
          label: 'Delete',
          color: 'red  !important',
          isModal: true
        }
      },
      {
        headerName: 'Update',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onEditRow.bind(this),
          label: 'Edit',
          color: 'blue  !important',
          isModal: true
        }
      },



    ];
    this.datasharedservice.chagneHeaderNav(this.data);
  }




  ngOnInit(): void {
    this.formdata.roleID = '6';
    //this.getUtility();
    this.formdata.accessOwner = localStorage.getItem('UserID');
    this.iswritepermission = localStorage.getItem('WriteAccess');
  }



  logout() {

    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/meecl']);
  }

  getSubdivision() {
    this.spinner.show()
    this.subdivisionservice
      .getSubdivisionForRegistration(this.formdata.accessOwner)
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
          this.SubDivisionDropdown = [];
          let obj = res.data[0];

          for (var item in obj) {
            this.SubDivisionDropdown.push(obj[item][0]);
          }

        }
        else {

          this.logout();
        }
      });
  }

  getSubstation() {
    this.spinner.show();
    this.substation
      .getSubstationBySubdivision(this.formdata.accessSubdivision)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.SubStationDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.SubStationDropdown.push(obj[item][0]);
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
        this.FeederDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.FeederDropdown.push(obj[item][0]);
          }
        }
      });
  }
  getDT() {
    this.spinner.show();
    this.dtservice
      .getDTByFeeder(this.formdata.accessFeeder)
      .subscribe((res: any) => {
        this.spinner.hide();
        this.DTDropdown = [];
        if (res.data != null) {
          let obj = res.data[0];
          for (var item in obj) {
            this.DTDropdown.push(obj[item][0]);
          }
        }
      });
  }

  changeAccessLevel(accessvalue: number) {
    this.getSubdivision()
    if (accessvalue == 2) {
      this.isSubdivision = true;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = false;

    } else if (accessvalue == 3) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = false;
      //this.getSubdivision();
      //this.getSubstation();
    } else if (accessvalue == 4) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = false;
      this.isMeter = false;
      //this.getSubdivision();
      //this.getSubstation();
      //this.getFeeder();
    } else if (accessvalue == 5) {
      this.isSubdivision = true;
      this.isSubstation = true;
      this.isFeeder = true;
      this.isDT = true;
      this.isMeter = false;
      //this.getSubdivision();
      //this.getSubstation();
      //this.getFeeder();
      //this.getDT();
    } else if (accessvalue == 6) {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = true;
    }
    else {
      this.isSubdivision = false;
      this.isSubstation = false;
      this.isFeeder = false;
      this.isDT = false;
      this.isMeter = false;
    }
  }
  getLevelValue() {
    if (this.formdata.roleID == '1') {
      this.levelName = 'All';
      this.levelValue = this.formdata.accessOwner;
    } else if (this.formdata.roleID == '2') {
      this.levelName = 'SUBDEVISION';
      this.levelValue = this.formdata.accessSubdivision;
    } else if (this.formdata.roleID == '3') {
      this.levelName = 'SUBSTATION';
      this.levelValue = this.formdata.accessSubStation;
    } else if (this.formdata.roleID == '4') {
      this.levelName = 'FEEDER';
      this.levelValue = this.formdata.accessFeeder;
    } else if (this.formdata.roleID == '5') {
      this.levelName = 'DT';
      this.levelValue = this.formdata.accessDT;
    }
    else if (this.formdata.roleID == '6') {
      this.levelName = 'METER';
      this.levelValue = this.formdata.designation;
    }
  }
  changeUtility() {
    if (this.isSubdivision) {
      this.getSubdivision();
    }
  }



  onBtnExport() {
    var excelParams = {
      fileName: 'FirmwareList.csv',
    }
    this.gridApi.exportDataAsCsv(excelParams);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.onList();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }


  onList() {
    this.tableData = [];
    this.gridApi.setRowData([]);
    this.gridColumnApi.autoSizeAllColumns();
    this.gridApi.showLoadingOverlay();
    this.ondemmand.getFirmwareList().subscribe((res: any) => {
      if (res != null && res.message != 'Key Is Not Valid') {
        this.tableData = res.data;
        this.utility.updateApiKey(res.apiKey);;
        this.gridApi.setRowData(this.tableData);
        this.gridColumnApi.autoSizeAllColumns();

      } else {

        this.logout();
      }
    });
  }


  uploadFirmware() {
    this.spinner.show();
    this.ondemmand.addFirmware(this.formFiledata.firmWareFile, this.formFiledata.status, this.formFiledata.version, this.formFiledata.manufacturer).subscribe((res: any) => {
      this.spinner.hide();
      if (res != null && res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired') {
        if (res.result != 'false') {
          this.toaster.success(res.message);
          this.onList();
        }
        else {
          this.toaster.error(res.message);
        }
      } else {

        this.logout();
      }
    });
  }


  updateFirmware() {
    this.spinner.show();
    this.ondemmand.updateFirmwareList(this.formFiledata).subscribe((res: any) => {
      this.spinner.hide();
      if (res != null && res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired') {
        if (res.result != 'false') {
          this.toaster.success(res.message);
          this.onList();
          $('#ModalAddDevice').modal('hide');
        }
        else {
          this.toaster.error(res.message);
        }
      } else {

        this.logout();
      }

    });
  }

  checkFile(data: any) {
    
    this.formFiledata.firmWareFile = data.target.files[0];

  }

  onDeleteRow(data: any) {

    let dataList = [
      {
        owner: data.rowData.owner,
        fileName: data.rowData.fileName
      }
    ];
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data! Enter your reason',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {

      if (result.isConfirmed) {
        this.ondemmand
          .deleteFirmwareList(dataList)
          .subscribe((res: any) => {
            this.spinner.hide();
            if (res != null && (res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired')) {
              Swal.fire('Deleted Successfully', '', 'success');
              this.utility.updateApiKey(res.apiKey);;
              this.onList();
            }
            else {

              this.logout();
            }
          });
      }
    });
  }

  onEditRow(data: any) {
    $('#ModalAddDevice').modal('show');
    this.formFiledata = data.rowData;
  }


  getSelectedRowData() {
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node =>

      node.data.manufacturer
    );

    let selectedFileName = selectedNodes.map(node =>

      node.data.fileName
    );

    let isAnyDuplicate = this.hasDuplicates(selectedData);
    if (isAnyDuplicate)
      this.toaster.error('You can not select multiple files from same manufacturer');
    else if (selectedData.length <= 0)
      this.toaster.error('Please select atleast one file');
    else {
      const s = {};
      for (var i = 0; i < selectedData.length; ++i) {
        let value = selectedData[i];

        s[value] = selectedFileName[i];

      }

      this.getLevelValue();
      this.ondemmand.addConfigs(this.levelName, this.levelValue, s, true).subscribe((res: any) => {
        if (res != null && res.message != 'Key Is Not Valid' && res.message != 'Session Is Expired') {
          if (res.result != 'false') {
            this.toaster.success(res.message);
            this.onList();
          }
          else {
            this.toaster.error(res.message);
          }
        } else {

          this.logout();
        }
      });


    }
  }
  hasDuplicates(array) {

    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
        return true;
      }
      valuesSoFar[value] = true;
    }
    return false;
  }
}
