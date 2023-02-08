import { Observable, Subject, throwError as observableThrowError } from 'rxjs'; // only need to import from rxjs
import { isPlatformBrowser } from '@angular/common';
/* platform dependencies */
import { Location } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Headers, Response } from '@angular/http';

import { Router } from '@angular/router';
// TODO: change to using these
import {
    HttpClient,
    HttpHeaders,
    HttpResponse,
    HttpEventType,
    HttpErrorResponse,
} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';

/**
 * @description Service containing API specific configurations
 */
@Injectable()
export class HttpService {
    public isBrowser;
    // the base url for the api
    private readonly API_BASE_URL: string = environment.apiUrl;

    // the api auth token set in CustomerDataProvider after login
    private accessToken: string;
    private isLoggedIn: boolean;

    /**
     * @description injects http service and inits the base api url for the app
     * @param {Http} http http service for interacting with REST API
     */
    constructor(
        private http: HttpClient,
        private httpClient: HttpClient,
        private router: Router,
        private location: Location,
        @Inject(PLATFORM_ID) private platformId
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    /**
     * @description returns the base url of the server. Throws an error if not properly configured
     * @returns {string} the base url for the api
     */
    private getBaseUrl(): string {
        if (!this.API_BASE_URL) {
            throw new TypeError('No base URL defined');
        }
        return this.API_BASE_URL;
    }

    /**
     * @description fires a get request to the provided url
     * @param {string} url api endpoint to interact with
     * @param {boolean} requireAuth optional authentication enabled if true
     * @return {Observable<any>} results will vary based on api endpoint
     */
    public get(
        url: string,
        requireAuth?: boolean,
        external = false
    ): Observable<any> {
        const requestUrl: string = !external ? this.getBaseUrl() + url : url;
        let options = {};
        if (requireAuth) {
            this.enforceLogin();
            options = { headers: this.getAuthHeaders() };
        }
        console.log('getting to', requestUrl);
        return this.http.get(requestUrl, options).pipe(
            tap(data => console.log('got data', data)),
            catchError(this.handleError)
        );

        // .catch((err: Response) => Observable.throw(err.json().error));
    }

    private handleError(error: HttpErrorResponse) {
        console.log('errorlog', error);
        if (this.isBrowser) {
            if (error.error instanceof ErrorEvent) {
                // A client-side or network error occurred. Handle it accordingly.
                console.error('An error occurred:', error.error.message);
            } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                console.error(
                    `Backend returned code ${error.status}, ` +
                        `body was: ${error.error}`
                );
            }
            if (error.status != 404) {
                this.router.navigate(['/error']);
            }

            // return an observable with a user-facing error message
        }
        return observableThrowError(`An Error has Occured ${error}`);
    }
    /**
     * @description fires a post request to the provided url
     * @param {string} url api endpoint to interact with
     * @param {any} params params to be posted as part of the object body. types will vary
     * @param {boolean} requireAuth optional authentication enabled if true
     * @return {Observable<any>} results will vary based on api endpoint
     */
    public post(
        url: string,
        params: any,
        requireAuth?: boolean
    ): Observable<any> {
        const body: Object = params;
        const requestUrl: string = this.getBaseUrl() + url;
        let options = {};
        if (requireAuth) {
            this.enforceLogin();
            options = { headers: this.getAuthHeaders() };
        }
        console.log('posting to', requestUrl, body);
        return this.http.post(requestUrl, body, options).pipe(
            tap(data => console.log('post data', data)),
            catchError(this.handleError)
        );
    }

    // file from event.target.files[0]
    public uploadFile(url: string, file: File): Observable<HttpEvent<any>> {
        const requestUrl: string = this.getBaseUrl() + url;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sf_account_id', '4878fjr87s');
        const params = new HttpParams();

        const options = {
            params: params,
            reportProgress: true,
        };

        const req = new HttpRequest('POST', requestUrl, formData, options);
        return this.httpClient.request(req);
    }
    public upload(
        url: string,
        files: Set<File>,
        type,
        email
    ): { [key: string]: { [key: string]: { progress: Observable<number> } } } {
        // this will be the our resulting map
        const status: {
            [key: string]: { [key: string]: { progress: Observable<number> } };
        } = {};
        const requestUrl: string = this.getBaseUrl() + url;
        files.forEach(file => {
            // create a new multipart-form for every file
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('email', email);
            formData.append('type', type);
            // create a http-post request and pass the form
            // tell it to report the upload progress
            const req = new HttpRequest('POST', requestUrl, formData, {
                reportProgress: true,
            });

            // create a new progress-subject for every file
            const progress = new Subject<number>();

            // send the http-request and subscribe for progress-updates
            this.httpClient.request(req).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    // calculate the progress percentage
                    const percentDone = Math.round(
                        (100 * event.loaded) / event.total
                    );

                    // pass the percentage into the progress-stream
                    progress.next(percentDone);
                } else if (event instanceof HttpResponse) {
                    // Close the progress-stream if we get an answer form the API
                    // The upload is complete
                    progress.complete();
                }
            });

            // Save every progress-observable in a map of all observables
            status[type] = {
                [file.name]: { progress: progress.asObservable() },
            };
        });

        // return the map of progress.observables
        return status;
    }

    /**
     * @description fires a patch request to the provided url
     * @param {string} url api endpoint to interact with
     * @param {any} params params to be posted as part of the object body. types will vary
     * @param {boolean} requireAuth optional authentication enabled if true
     * @return {Observable<any>} results will vary based on api endpoint
     */
    public patch(
        url: string,
        params: any,
        requireAuth?: boolean
    ): Observable<any> {
        const body: Object = params;
        const requestUrl: string = this.getBaseUrl() + url;
        let options = {};
        if (requireAuth) {
            this.enforceLogin();
            options = { headers: this.getAuthHeaders() };
        }
        return this.http
            .patch(requestUrl, body, options)
            .map((res: Response) => res)
            .catch((err: Response) => {
                this.router.navigate(['/error']);
                return observableThrowError(err.json().error);
            });
        // .catch((err: Response) => Observable.throw(err.json().error));
    }

    /**
     * @description fires a put request to the provided url
     * @param {string} url api endpoint to interact with
     * @param {any} params params to be posted as part of the object body. types will vary
     * @param {boolean} requireAuth optional authentication enabled if true
     * @return {Observable<any>} results will vary based on api endpoint
     */
    public put(
        url: string,
        params: any,
        requireAuth?: boolean
    ): Observable<any> {
        const body: Object = params;
        const requestUrl: string = this.getBaseUrl() + url;
        let options = {};
        if (requireAuth) {
            this.enforceLogin();
            options = { headers: this.getAuthHeaders() };
        }
        return this.http
            .put(requestUrl, body, options)
            .map((res: Response) => res)
            .catch((err: Response) => {
                this.router.navigate(['/error']);
                return observableThrowError(err.json().error);
            });
        // .catch((err: Response) => Observable.throw(err.json().error));
    }

    /**
     * @description fires a delete request to the provided url
     * @param {string} url api endpoint to interact with
     * @param {boolean} requireAuth optional authentication enabled if true
     * @return {Observable<any>} results will vary based on api endpoint
     */
    public delete(url: string, requireAuth?: boolean): Observable<any> {
        const requestUrl: string = this.getBaseUrl() + url;
        let options = {};
        if (requireAuth) {
            this.enforceLogin();
            options = { headers: this.getAuthHeaders() };
        }
        return this.http
            .delete(requestUrl, options)
            .map((res: Response) => res)
            .catch((err: Response) => {
                this.router.navigate(['/error']);
                return observableThrowError(err.json().error);
            });
        // .catch((err: Response) => Observable.throw(err.json().error));
    }

    /**
     * @description generates the client auth headers for authenticating requests on API
     * @return {Headers} the generated headers
     */
    private getAuthHeaders(): Headers {
        const header = new Headers();
        header.set('Authorization', 'Bearer ' + this.accessToken);
        return header;
    }

    /**
     * @description checks login status and redirects to login page on not logged in
     */
    public enforceLogin(): void {
        if (!this.isLoggedIn) {
            this.forceLogin();
        }
    }

    /**
     * @description logs user out and prompts for login
     */
    public forceLogin(): void {
        this.router.navigate(['/login'], { queryParamsHandling: 'preserve' });
    }

    public setAccessToken(token: string): void {
        this.accessToken = token;
    }

    public setLoggedIn(loggedIn: boolean): void {
        this.isLoggedIn = loggedIn;
    }

    /**
     * @description Sends Beacon to local API
     */
    public sendBeacon(url: string, data): void {
        const requestUrl: string = this.getBaseUrl() + url + '?';
        let queryString = Object.keys(data)
            .map(key => key + '=' + data[key])
            .join('&');
        navigator.sendBeacon(requestUrl + queryString);
    }
}
