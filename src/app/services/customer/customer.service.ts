import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { ICustomer } from '../../interfaces/customer.interface';
import { HttpService } from '../http/http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs/internal/operators/take';
@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    constructor(
        private http: HttpService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        public auth: AuthService
    ) {
        this.initAuth();
    }

    /**
     * @description retrieves saved token from cookie and sets in http service
     */
    public async initAuth() {
        //check if client is browser
    }
}
