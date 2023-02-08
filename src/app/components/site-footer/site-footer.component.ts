import { isPlatformBrowser, Location } from '@angular/common';
import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerService } from '../../services/customer/customer.service';
@Component({
    selector: 'app-site-footer',
    templateUrl: './site-footer.component.html',
    styleUrls: ['./site-footer.component.scss'],
})
export class SiteFooterComponent implements OnInit {
    private readonly PAGE_SLUG: string = 'footer';
    public butterContent: any;
    public applicationPage: boolean;
    public isLoggedIn = false;

    public disabled = false;
    public isBrowser;

    constructor(
        public customerService: CustomerService,
        public _router: Router,
        public location: Location,
        @Inject(PLATFORM_ID) private platformId
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit() {}
}
