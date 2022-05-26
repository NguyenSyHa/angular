import { AppConsts } from './../../../shared/AppConsts';
import { InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedRequestDto } from '@shared/paged-listing-component-base';
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export abstract class BaseApiService {
    protected baseUrl = AppConsts.remoteServiceBaseUrl;

    protected get rootUrl() {
        return this.baseUrl + '/api/services/app/' + this.name();
    }

    protected http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
    }

    abstract name();

 
    getAllPagging(request: PagedRequestDto): Observable<any> {
        return this.http.post<any>(this.rootUrl + '/GetAllPagging', request);
    }

    public getById(id: any): Observable<any> {
        return this.http.get<any>(this.rootUrl + '/Get?id=' + id);
    }

    public delete(id: any): Observable<any> {
        return this.http.delete<any>(this.rootUrl + '/Delete', {
            params: new HttpParams().set('Id', id)
        })
    }

    public update(item: any): Observable<any> {
        return this.http.put<any>(this.rootUrl + '/Update', item);
    }

    public create(item: any): Observable<any> {
        return this.http.post<any>(this.rootUrl + '/Create', item);
    } 
    
    save(data: object): Observable<any> {
        return this.http.post(this.rootUrl + '/Save', data);
    }
    
}
