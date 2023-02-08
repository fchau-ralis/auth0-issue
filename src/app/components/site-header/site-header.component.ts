import { isPlatformBrowser, Location } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute, Params } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { CustomerService } from '../../services/customer/customer.service';
import { HttpService } from '../../services/http/http.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
@Component({
    selector: 'site-header',
    templateUrl: './site-header.component.html',
    styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit {
    constructor(
        @Inject(DOCUMENT) public document: Document,

        @Inject(PLATFORM_ID) private platformId: Object,
        public auth: AuthService,
        private activatedRoute: ActivatedRoute,
        public http: HttpService,
        public customerService: CustomerService,
        private _location: Location,
        public _router: Router
    ) {}

    public login() {
        this.auth.loginWithRedirect({
            appState: { target: '/portal/application' },
            redirect_uri: `${window.location.origin}/portal/application`,
        });
    }

    public ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.auth.error$.subscribe(error => {
            // Handle Error here
            console.log('err', error);
            //redirect
        });
    }
}
