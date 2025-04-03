import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './Shared/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './Guard/auth.guard';
import { AuthService } from './Services/auth.service';
import { RandomGuard } from './Guard/random.guard';
import { TokenInterceptor } from './Services/token.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './Views/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { DatePipe } from '@angular/common';
import { RegisterComponent } from './Views/register/register.component';
import { SelectProjectComponent } from './Views/select-project/select-project.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CommreporthistoryComponent } from './Views/commreporthistory/commreporthistory.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { SlaHistoryComponent } from './Views/sla-history/sla-history.component';
import { CommunicationReportComponent } from './Shared/meter-reports/communication-report/communication-report.component';
import { FailureReportComponent } from './Shared/meter-reports/failure-report/failure-report.component';
import { InactiveReportComponent } from './Shared/meter-reports/inactive-report/inactive-report.component';
import { FailureNeverReportComponent } from './Shared/meter-reports/failurenever-report/failurenever-report.component';
import { LayoutComponent } from './Shared/layout/layout.component';
import { MeterSummaryComponent } from './Shared/meter-reports/meter-summary/meter-summary.component';

@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    RegisterComponent,
    SelectProjectComponent,
    CommreporthistoryComponent,
    SlaHistoryComponent,
    CommunicationReportComponent,
    FailureReportComponent,
    InactiveReportComponent,
    FailureNeverReportComponent,
    MeterSummaryComponent,
    // LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LeafletModule,
    NgxCaptchaModule,
    BrowserAnimationsModule,
    LeafletMarkerClusterModule,
    LayoutModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgApexchartsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    AuthService,
    RandomGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
