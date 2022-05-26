import {HttpClient, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApiService} from './base-api.service';
import {Observable} from 'rxjs';
import {AppConsts} from '@shared/AppConsts';
import {PagedRequestDto} from '@shared/paged-listing-component-base';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseApiService {

    constructor(http: HttpClient) {
        super(http);
    }

    name() {
        return 'User';
    }

    getAll(): Observable<any> {
        return this.http.get(this.rootUrl + '/GetAll');
    }

    getAllNotPagging(): Observable<any> {
        return this.http.get(this.rootUrl + '/GetUserNotPagging');
    }

    getRoles(): Observable<any> {
        return this.http.get(this.rootUrl + '/GetRoles');
    }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        const url = '/api/services/app/User/ImportUsersFromFile';
        formData.append('file', file);
        const uploadReq = new HttpRequest('POST', AppConsts.remoteServiceBaseUrl + url,
            formData,
            {
                reportProgress: true
            }
        );
        return this.http.request(uploadReq);
    }

    public uploadImageFile(file, id): Observable<any> {
        const formData = new FormData();
        if (navigator.msSaveBlob) {
            formData.append('file', file, 'image.jpg');
        } else {
            formData.append('file', file);
        }
        formData.append('userId', id);
        const uploadReq = new HttpRequest(
            'POST', AppConsts.remoteServiceBaseUrl + '/api/services/app/User/UpdateAvatar', formData,
            {
                reportProgress: true
            }
        );
        return this.http.request(uploadReq);
    }

    public upLoadOwnAvatar(file): Observable<any> {
        const formData = new FormData();
        if (navigator.msSaveBlob) {
            formData.append('file', file, 'image.jpg');
        } else {
            formData.append('file', file);
        }
        const uploadReq = new HttpRequest(
            'POST', AppConsts.remoteServiceBaseUrl + '/api/services/app/User/UpdateYourOwnAvatar', formData,
            {
                reportProgress: true
            }
        );
        return this.http.request(uploadReq);
    }


    getAllManager(): Observable<any> {
        return this.http.get(this.rootUrl + '/GetAllManager');
    }

    changeUserRole(userId, role): Observable<any> {
        return this.http.post(this.rootUrl + "/ChangeUserRole", {userId, role});
    }
 

    deactivateUser(id: number): Observable<any> {
        return this.http.post(this.rootUrl + '/DeactiveUser', {id: id});
    }

    activateUser(id: number) {
        return this.http.post(this.rootUrl + '/ActiveUser', {id: id});
    }
}
