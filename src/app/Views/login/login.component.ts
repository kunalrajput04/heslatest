import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formdata: User = new User();

  siteKey: string = '6LeV1W0eAAAAAOCbEJTuw7e__K8R1j1eEyNfN4YO';
   loginForm: FormGroup;
   @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  constructor(
    private authservice: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder

  ) { }

  ngOnInit(): void {
    this.spinner.hide();
    this.loginForm = this.formBuilder.group({
      recaptcha: ['', Validators.required],
      email: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  userlogin() {
    this.formdata={
      email:this.loginForm.value.email,
      password:this.loginForm.value.password
    }
    this.spinner.show();
    this.authservice.newlogin(this.formdata,this.loginForm.value.recaptcha).subscribe((res: any) => {

      if (res != null && res.apiKey !==null ) {
        this.spinner.hide();

        localStorage.setItem('email', res.data.email);
        localStorage.setItem('WriteAccess', res.data.writeaccess);
        localStorage.setItem('Welcomemsg', res.data.welcomemsg);
        if (res.data.roleid == '1') {
          localStorage.setItem('levelName', 'All');
          localStorage.setItem('levelValue', res.data.access_owner);
          localStorage.setItem('StorelevelName', 'All');
          localStorage.setItem('StorelevelValue', res.data.access_owner);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('UserID', res.data.access_owner);
          this.authservice.doLoginUser(res.apiKey);
          this.router.navigate(['/']);
        } else if (res.data.roleid == '2') {
          localStorage.setItem('levelName', 'SUBDEVISION');
          localStorage.setItem('levelValue', res.data.access_subsdivision);
          localStorage.setItem('StorelevelName', 'SUBDEVISION');
          localStorage.setItem('StorelevelValue', res.data.access_subsdivision);
          localStorage.setItem('UserID', res.data.access_owner);
          localStorage.setItem('username', res.data.username);
          this.authservice.doLoginUser(res.apiKey);
          this.router.navigate(['/']);
        } else if (res.data.roleid == '3') {
          localStorage.setItem('levelName', 'SUBSTATION');
          localStorage.setItem('levelValue', res.data.access_substation);
          localStorage.setItem('StorelevelName', 'SUBSTATION');
          localStorage.setItem('StorelevelValue', res.data.access_substation);
          localStorage.setItem('UserID', res.data.access_owner);
          localStorage.setItem('username', res.data.username);
          this.authservice.doLoginUser(res.apiKey);
          this.router.navigate(['/']);
        } else if (res.data.roleid == '4') {
          localStorage.setItem('levelName', 'FEEDER');
          localStorage.setItem('levelValue', res.data.access_feeder);
          localStorage.setItem('StorelevelName', 'FEEDER');
          localStorage.setItem('StorelevelValue', res.data.access_feeder);
          localStorage.setItem('UserID', res.data.access_owner);
          localStorage.setItem('username', res.data.username);
          this.authservice.doLoginUser(res.apiKey);
          this.router.navigate(['/']);
        } else if (res.data.roleid == '5') {
          localStorage.setItem('levelName', 'DT');
          localStorage.setItem('levelValue', res.data.access_dt);
          localStorage.setItem('StorelevelName', 'DT');
          localStorage.setItem('StorelevelValue', res.data.access_dt);
          localStorage.setItem('username', res.data.username);
          this.authservice.doLoginUser(res.apiKey);
          localStorage.setItem('UserID', res.data.access_owner);
          this.router.navigate(['/']);
        } else if (res.data.roleid == '6') {
          localStorage.setItem('UserID', 'All');
          localStorage.setItem('username', res.data.username);
          this.authservice.doLoginUser(res.apiKey);
          this.router.navigate(['/register']);
        }
      } else {
        this.formdata={
          email:'',
          password:''
        }
        this.loginForm.reset();
        this.captchaElem.resetCaptcha();
        this.spinner.hide();
        this.toaster.error('Please Enter Valid Credentials');
      }
    });
  }

  // userlogin() {
  //      this.formdata={
  //     email:this.loginForm.value.email,
  //     password:this.loginForm.value.password
  //   }
  //   this.spinner.show();
  //   this.authservice.login(this.formdata).subscribe((res: any) => {
  //     console.clear();
  //     console.log(res);
  //     if (res != null && res.message == 'successfully login') {
  //       this.spinner.hide();

  //       localStorage.setItem('email', res.email);
  //       localStorage.setItem('WriteAccess', res.writeaccess);
  //       localStorage.setItem('Welcomemsg', res.welcomemsg);
  //       if (res.roleid == '1') {
  //         localStorage.setItem('levelName', 'All');
  //         localStorage.setItem('levelValue', res.access_owner);
  //         localStorage.setItem('StorelevelName', 'All');
  //         localStorage.setItem('StorelevelValue', res.access_owner);
  //         localStorage.setItem('username', res.username);
  //         localStorage.setItem('UserID', res.access_owner);
  //         this.authservice.doLoginUser(res.apiKey);
  //         this.router.navigate(['/']);
  //       } else if (res.roleid == '2') {
  //         localStorage.setItem('levelName', 'SUBDEVISION');
  //         localStorage.setItem('levelValue', res.access_subsdivision);
  //         localStorage.setItem('StorelevelName', 'SUBDEVISION');
  //         localStorage.setItem('StorelevelValue', res.access_subsdivision);
  //         localStorage.setItem('UserID', res.access_owner);
  //         localStorage.setItem('username', res.username);
  //         this.authservice.doLoginUser(res.apiKey);
  //         this.router.navigate(['/']);
  //       } else if (res.roleid == '3') {
  //         localStorage.setItem('levelName', 'SUBSTATION');
  //         localStorage.setItem('levelValue', res.access_substation);
  //         localStorage.setItem('StorelevelName', 'SUBSTATION');
  //         localStorage.setItem('StorelevelValue', res.access_substation);
  //         localStorage.setItem('UserID', res.access_owner);
  //         localStorage.setItem('username', res.username);
  //         this.authservice.doLoginUser(res.apiKey);
  //         this.router.navigate(['/']);
  //       } else if (res.roleid == '4') {
  //         localStorage.setItem('levelName', 'FEEDER');
  //         localStorage.setItem('levelValue', res.access_feeder);
  //         localStorage.setItem('StorelevelName', 'FEEDER');
  //         localStorage.setItem('StorelevelValue', res.access_feeder);
  //         localStorage.setItem('UserID', res.access_owner);
  //         localStorage.setItem('username', res.username);
  //         this.authservice.doLoginUser(res.apiKey);
  //         this.router.navigate(['/']);
  //       } else if (res.roleid == '5') {
  //         localStorage.setItem('levelName', 'DT');
  //         localStorage.setItem('levelValue', res.access_dt);
  //         localStorage.setItem('StorelevelName', 'DT');
  //         localStorage.setItem('StorelevelValue', res.access_dt);
  //         localStorage.setItem('username', res.username);
  //         this.authservice.doLoginUser(res.apiKey);
  //         localStorage.setItem('UserID', res.access_owner);
  //         this.router.navigate(['/']);
  //       } else if (res.roleid == '6') {
  //         localStorage.setItem('UserID', 'All');
  //         localStorage.setItem('username', res.username);
  //         this.authservice.doLoginUser(res.apiKey);
  //         this.router.navigate(['/register']);
  //       }
  //     } else {
  //       this.spinner.hide();
  //       this.toaster.error('Please Enter Valid Credentials');
  //     }
  //   });
  // }

}
