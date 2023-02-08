import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';

declare var decibelInsight: any;
@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
    public name;
    public butterContent: any;
    private readonly PAGE_SLUG: string = 'error';
    public phone: String;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {}
}
