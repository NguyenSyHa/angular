import { AppConsts } from './../../shared/AppConsts';
import { UserService } from './../service/api/user.service';
import { UploadAvatarComponent } from './../modules/user/upload-avatar/upload-avatar.component';
import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AuthService } from "angularx-social-login";
import { MatDialog } from '@angular/material';
@Component({
    templateUrl: './sidebar-user-area.component.html',
    selector: 'sidebar-user-area',
    encapsulation: ViewEncapsulation.None
})
export class SideBarUserAreaComponent extends AppComponentBase implements OnInit {

    shownLoginName = '';
    prefix = AppConsts.remoteServiceBaseUrl;

    constructor(
        private _authService: AppAuthService,
        private googleAuthService: AuthService,
        injector: Injector,
        private diaLog: MatDialog,
        private userService: UserService

    ) {
        super(injector);
    }

    getAvatar(){
        if (this.appSession.user.avatarPath && this.appSession.user.avatarPath.trim()){
            return AppConsts.remoteServiceBaseUrl + this.appSession.user.avatarPath;
        }
        if(this.appSession.user.sex == 0) {
            return "assets/images/men.png";
        }
        if(this.appSession.user.sex == 1) {
            return "assets/images/women.png";
        }
        return "assets/images/undefine.png";
    }

    ngOnInit() {
        // this.shownLoginName = this.appSession.getShownLoginName();
        //this.appSession.user.avatarPath = AppConsts.remoteServiceBaseUrl + this.appSession.user.avatarPath;
        this.shownLoginName = this.appSession.user.name + " " + this.appSession.user.surname;
    }

    updateAvatar(num): void {
        var diaLogRef = this.diaLog.open(UploadAvatarComponent, {
            width: "600px",
            data: num
        });
        diaLogRef.afterClosed().subscribe(res => {
            if (res) {
                this.userService.upLoadOwnAvatar(res).subscribe(data => {
                    if (data) {
                        this.notify.success("Upload Avatar Successfully!");
                        this.appSession.user.avatarPath = data.body.result;
                    } else this.notify.error("Upload Avatar Failed!");
                });
            }
        });
    }

    logout(): void {
        this._authService.logout();
        this.googleAuthService.signOut();
        // this.googleAuthService.signOut().then(result => {
        //     this._authService.logout();
        // });
    }
}
