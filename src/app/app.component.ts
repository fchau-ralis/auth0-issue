import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';
// import { UpdateService } from './services/website/update.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [],
})
export class AppComponent {
    public isBrowser;
    public showFooter = true;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        @Inject(PLATFORM_ID) private platformId
    ) {
        this.isBrowser = isPlatformBrowser(platformId);

        // this.update.checkForUpdates();
        // tslint:disable-line
    }
    ngOnInit() {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(r => {});

        this.router.events.subscribe(evt => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            console.log('router event', evt);
            const route = evt.urlAfterRedirects;
            this.activatedRoute.root.firstChild.data.subscribe(r => {
                if ('footer' in r) {
                    this.showFooter = r.footer;
                }
            });
            if (this.isBrowser) {
                window.scrollTo(0, 0);
            }
        });
    }
}
