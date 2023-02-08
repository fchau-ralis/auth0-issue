import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
    public butterContent: any;
    private readonly slug: string = 'about';
    constructor(
        private route: ActivatedRoute,
        public meta: Meta,
        private titleService: Title,
        private location: Location
    ) {}
    ngOnInit() {
        this.route.params.subscribe(params => {});
    }
}
