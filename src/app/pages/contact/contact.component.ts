import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
    public butterContent;
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
