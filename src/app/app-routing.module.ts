import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactComponent } from './pages/contact/contact.component';
import { ErrorComponent } from './pages/error/error.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

// Import the authentication guard
import { HelocFaqsComponent } from './pages/heloc-faqs/heloc-faqs.component';

// App Routes

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'faq', component: HelocFaqsComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'about', component: AboutComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabled',
            enableTracing: true,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
