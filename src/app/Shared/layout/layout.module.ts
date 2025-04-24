import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from 'src/app/Views/home/home.component';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from 'src/app/Views/side-menu/side-menu.component';
import { DeviceInfoComponent } from 'src/app/Views/device-info/device-info.component';
import { InstantDataComponent } from 'src/app/Views/instant-data/instant-data.component';
import { InsantDataPushComponent } from 'src/app/Views/insant-data-push/insant-data-push.component';
import { EventDataComponent } from 'src/app/Views/event-data/event-data.component';
import { LoadDataComponent } from 'src/app/Views/load-data/load-data.component';
import { BillingDataComponent } from 'src/app/Views/billing-data/billing-data.component';
import { DailyLpdComponent } from 'src/app/Views/daily-lpd/daily-lpd.component';
import { SubDivisionComponent } from 'src/app/Views/sub-division/sub-division.component';
import { FeederComponent } from 'src/app/Views/feeder/feeder.component';
import { DTComponent } from 'src/app/Views/dt/dt.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ForgetPassordComponent } from 'src/app/Views/forget-passord/forget-passord.component';
import { RegisterComponent } from 'src/app/Views/register/register.component';
import { ConnectAndDisconnectComponent } from 'src/app/Views/connect-and-disconnect/connect-and-disconnect.component';

import { InstentenousChartPopupComponent } from 'src/app/Views/instentenous-chart-popup/instentenous-chart-popup.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { EventDataPushComponent } from 'src/app/Views/event-data-push/event-data-push.component';
import { SubstationComponent } from 'src/app/Views/substation/substation.component';
import { PrepayConfigurationComponent } from 'src/app/Views/prepay-configuration/prepay-configuration.component';
import { ConfigurationComponent } from 'src/app/Views/configuration/configuration.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { ConfigurationReportComponent } from 'src/app/Views/configuration-report/configuration-report.component';
import { CommandLogComponent } from '../../Views/command-log/command-log.component';
import { HesSettingComponent } from '../../Views/hes-setting/hes-setting.component';
import { CommandLogChartComponent } from '../../Views/command-log-chart/command-log-chart.component';
import { ReturnInstantDataComponent } from 'src/app/views/return-instant-data/return-instant-data.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommunicationsummaryComponent } from '../../Views/communicationsummary/communicationsummary.component';
import { ChartPopupComponent } from '../chart-popup/chart-popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FirmWareComponent } from '../../Views/firm-ware/firm-ware.component';
import { DeviceNamePlateComponent } from 'src/app/Views/device-name-plate/device-name-plate.component';
import { CommReportComponent } from '../../Views/comm-report/comm-report.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { AgGridModule } from 'ag-grid-angular';
import { EditButtonComponent } from '../AgGrid/edit-button/edit-button.component';
import { AllCommandLogComponent } from '../../Views/all-command-log/all-command-log.component';
import { FirmwareLogComponent } from '../../Views/firmware-log/firmware-log.component';
import { FullConfigLogComponent } from '../../Views/full-config-log/full-config-log.component';
import { CurrentBillingDataComponent } from '../../Views/current-billing-data/current-billing-data.component';
import { RtcSyncComponent } from '../../Views/rtc-sync/rtc-sync.component';
import { TodRWComponent } from '../../Views/tod-rw/tod-rw.component';
import { MeterStatusComponent } from 'src/app/Views/meter-status/meter-status.component';
import { MeterStatusLogComponent } from 'src/app/Views/meter-status-log/meter-status-log.component';
import { SystemCheckComponent } from 'src/app/Views/system-check/system-check.component';
import { DcuinfoComponent } from 'src/app/Views/dcuinfo/dcuinfo.component';
import { DcuoutageComponent } from 'src/app/Views/dcuoutage/dcuoutage.component';
import { DcuComponent } from 'src/app/Views/dcu/dcu.component';
import { CircleComponent } from 'src/app/Views/circle/circle.component';
import { DcuHierarchyComponent } from 'src/app/Views/dcu-hierarchy/dcu-hierarchy.component';
import { DivisionComponent } from 'src/app/Views/division/division.component';
import { ZoneComponent } from 'src/app/Views/zone/zone.component';


@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    SideMenuComponent,
    DeviceInfoComponent,DcuinfoComponent, DcuComponent, DcuoutageComponent,
    InstantDataComponent,
    InsantDataPushComponent,
    DailyLpdComponent,
    EventDataComponent,
    InsantDataPushComponent,
    LoadDataComponent,
    BillingDataComponent,
    SubDivisionComponent,
    FeederComponent,
    SubDivisionComponent,
    DTComponent,
    ForgetPassordComponent,
    PrepayConfigurationComponent,
    ConnectAndDisconnectComponent,
    ReturnInstantDataComponent,
    InstentenousChartPopupComponent,
    EventDataPushComponent,
    SubstationComponent,
    ConfigurationComponent,
    ConfigurationReportComponent,
    CommandLogComponent,
    HesSettingComponent,
    CommandLogChartComponent,
    CommunicationsummaryComponent,
    ChartPopupComponent,
    FirmWareComponent,
    DeviceNamePlateComponent,
    CommReportComponent,
    EditButtonComponent,
    AllCommandLogComponent,
    FirmwareLogComponent,
    FullConfigLogComponent,
    CurrentBillingDataComponent,
    RtcSyncComponent,
    TodRWComponent,
    MeterStatusComponent,
    MeterStatusLogComponent,SystemCheckComponent, ZoneComponent, CircleComponent, DivisionComponent, DcuHierarchyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgApexchartsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgSelect2Module,
    NgxSpinnerModule,
    DataTablesModule,
    NgSelectModule,
    NgbModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    AgGridModule.withComponents([]),
  ],
  entryComponents:[EditButtonComponent],
  
})
export class LayoutModule {}
