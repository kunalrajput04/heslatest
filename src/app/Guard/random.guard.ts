import { Injectable } from '@angular/core';

import {
  CanActivate,
  CanLoad,
  Router,
  CanActivateChild,
} from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RandomGuard implements CanActivate, CanLoad {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate() {
      return this.canLoad();
    }
  
    canLoad() {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
      return this.authService.isLoggedIn();
    }
  }