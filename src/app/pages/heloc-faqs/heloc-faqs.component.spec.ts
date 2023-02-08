import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelocFaqsComponent } from './heloc-faqs.component';

describe('HelocFaqsComponent', () => {
    let component: HelocFaqsComponent;
    let fixture: ComponentFixture<HelocFaqsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HelocFaqsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HelocFaqsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
