import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    public butterContent: any;
    private readonly PAGE_SLUG: string = 'home';

    constructor() {}

    ngOnInit() {}
    ngAfterViewInit() {}
}
