import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomGuard } from './Guard/random.guard';
import { LayoutComponent } from './Shared/layout/layout.component';
import { AllCommandLogComponent } from './Views/all-command-log/all-command-log.component';
import { BillingDataComponent } from './Views/billing-data/billing-data.component';
import { CommReportComponent } from './Views/comm-report/comm-report.component';
import { CommandLogComponent } from './Views/command-log/command-log.component';
import { CommreporthistoryComponent } from './Views/commreporthistory/commreporthistory.component';

import { CommunicationsummaryComponent } from './Views/communicationsummary/communicationsummary.component';
import { ConfigurationReportComponent } from './Views/configuration-report/configuration-report.component';
import { ConfigurationComponent } from './Views/configuration/configuration.component';
import { ConnectAndDisconnectComponent } from './Views/connect-and-disconnect/connect-and-disconnect.component';
import { CurrentBillingDataComponent } from './Views/current-billing-data/current-billing-data.component';
import { DailyLpdComponent } from './Views/daily-lpd/daily-lpd.component';
import { DeviceInfoComponent } from './Views/device-info/device-info.component';
import { DeviceNamePlateComponent } from './Views/device-name-plate/device-name-plate.component';
import { DTComponent } from './Views/dt/dt.component';
import { EventDataPushComponent } from './Views/event-data-push/event-data-push.component';
import { EventDataComponent } from './Views/event-data/event-data.component';
import { FeederComponent } from './Views/feeder/feeder.component';
import { FirmWareComponent } from './Views/firm-ware/firm-ware.component';
import { FirmwareLogComponent } from './Views/firmware-log/firmware-log.component';
import { ForgetPassordComponent } from './Views/forget-passord/forget-passord.component';
import { FullConfigLogComponent } from './Views/full-config-log/full-config-log.component';
import { HesSettingComponent } from './Views/hes-setting/hes-setting.component';
import { HomeComponent } from './Views/home/home.component';
import { InsantDataPushComponent } from './Views/insant-data-push/insant-data-push.component';
import { InstantDataComponent } from './Views/instant-data/instant-data.component';

import { InstentenousChartPopupComponent } from './Views/instentenous-chart-popup/instentenous-chart-popup.component';
import { LoadDataComponent } from './Views/load-data/load-data.component';
import { LoginComponent } from './Views/login/login.component';
import { MeterStatusLogComponent } from './Views/meter-status-log/meter-status-log.component';
import { MeterStatusComponent } from './Views/meter-status/meter-status.component';
import { PrepayConfigurationComponent } from './Views/prepay-configuration/prepay-configuration.component';
import { RegisterComponent } from './Views/register/register.component';
import { ReturnInstantDataComponent } from './views/return-instant-data/return-instant-data.component';
import { RtcSyncComponent } from './Views/rtc-sync/rtc-sync.component';
import { SelectProjectComponent } from './Views/select-project/select-project.component';
import { SlaHistoryComponent } from './Views/sla-history/sla-history.component';
import { SubDivisionComponent } from './Views/sub-division/sub-division.component';
import { SubstationComponent } from './Views/substation/substation.component';
import { TodRWComponent } from './Views/tod-rw/tod-rw.component';
import { SystemCheckComponent } from './Views/system-check/system-check.component';
import { DcuinfoComponent } from './Views/dcuinfo/dcuinfo.component';
import { DcuComponent } from './Views/dcu/dcu.component';
import { DcuoutageComponent } from './Views/dcuoutage/dcuoutage.component';
import { CircleComponent } from './Views/circle/circle.component';
import { DcuHierarchyComponent } from './Views/dcu-hierarchy/dcu-hierarchy.component';
import { DivisionComponent } from './Views/division/division.component';
import { ZoneComponent } from './Views/zone/zone.component';

const routes: Routes = [
  {
    path: '',

    component: LayoutComponent,
    canActivate: [RandomGuard],

    children: [
      { path: '', component: HomeComponent },
      { path: 'deviceInfo', component: DeviceInfoComponent },
      { path: 'dcuInfo', component: DcuinfoComponent },
      {path:'dcu',component:DcuComponent},
      {path:'dcuOutage',component:DcuoutageComponent},
      { path: 'nameplate', component: DeviceNamePlateComponent },
      { path: 'commsummary', component: CommunicationsummaryComponent },
      { path: 'commreport', component: CommReportComponent },
      { path: 'commreporthistory', component: CommreporthistoryComponent },
      { path: 'slahistory', component: SlaHistoryComponent },
      { path: 'sysAbility', component: SystemCheckComponent },
      { path: 'InstantData', component: InstantDataComponent },
      { path: 'InstantDataPush', component: InsantDataPushComponent },
      { path: 'RecentInstantData', component: ReturnInstantDataComponent },
      { path: 'LoadData', component: LoadDataComponent },
      { path: 'Billing', component: BillingDataComponent },
      { path: 'currentbilling', component: CurrentBillingDataComponent },
      { path: 'Billing', component: BillingDataComponent },
      { path: 'DailyLpd', component: DailyLpdComponent },
      { path: 'EventData', component: EventDataComponent },
      { path: 'EventDataPush', component: EventDataPushComponent },
      { path: 'Configuration', component: ConfigurationComponent },
      { path: 'PrepayConfiguration', component: PrepayConfigurationComponent },
      {
        path: 'ConnectAndDisconnect',
        component: ConnectAndDisconnectComponent,
      }, 
     {path: 'zone', component: ZoneComponent},
     {path: 'circle', component: CircleComponent},
      {path: 'division', component: DivisionComponent},  
      { path: 'subdivision', component: SubDivisionComponent },
      { path: 'Substation', component: SubstationComponent },
      { path: 'Feeder', component: FeederComponent },
      { path: 'DT', component: DTComponent },
      {path: 'dcuHierarchy', component: DcuHierarchyComponent},
      {
        path: 'InstentenousChartPopup',
        component: InstentenousChartPopupComponent,
      },
      {
        path: 'PrepayConfiguration',
        component: PrepayConfigurationComponent,
      },
      {
        path: 'configreport',
        component: ConfigurationReportComponent,
      },
      {
        path: 'commandlog',
        component: CommandLogComponent,
      },
      {
        path: 'allcommandlog',
        component: AllCommandLogComponent,
      },
      {
        path: 'hessetting',
        component: HesSettingComponent,
      },
      {
        path: 'firmware',
        component: FirmWareComponent,
      },
      {
        path: 'firmwarelogs',
        component: FirmwareLogComponent,
      },
      {
        path: 'fullconfiglogs',
        component: FullConfigLogComponent,
      },
      {
        path: 'rtcsync',
        component: RtcSyncComponent,
      },
      {
        path: 'todrw',
        component: TodRWComponent,
      },
      {
        path: 'meterstatus',
        component: MeterStatusComponent,
      },
      {
        path: 'meterstatuslog',
        component: MeterStatusLogComponent,
      },
    ],
  },

  { path: 'login', component: LoginComponent },
  // { path: 'meecl', component: SelectProjectComponent },
  { path: 'forgetpassord', component: ForgetPassordComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
