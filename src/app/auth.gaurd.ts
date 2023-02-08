import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { CustomerService } from './services/customer/customer.service';

@Injectable()
export class AuthGaurd implements CanActivate {
    constructor(
        private customerService: CustomerService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return true;
    }
}
