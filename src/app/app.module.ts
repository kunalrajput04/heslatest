import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SelectProjectComponent,
    CommreporthistoryComponent,
    SlaHistoryComponent,
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
    AgGridModule,
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
})
export class AppModule {}
