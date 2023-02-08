import { NgModule } from '@angular/core';
import {
    ServerModule,
    ServerTransferStateModule,
} from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import {
    BrowserModule,
    BrowserTransferStateModule,
} from '@angular/platform-browser';
@NgModule({
    imports: [
        BrowserModule.withServerTransition({
            appId: 'client',
        }),

        AppModule,
    ],
})
export class AppBrowserModule {}
