import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Type, CompilerOptions, NgModuleRef } from '@angular/core';
import { environment } from './environments/environment';

export class AppPreBootstrap {
    static run(appRootUrl: string, callback: () => void): void {
        AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
            AppPreBootstrap.getUserConfiguration(callback);
            AppPreBootstrap.getGoogleClientAppId(callback);
        });
    }

    static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
        return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
    }

    private static getApplicationConfig(appRootUrl: string, callback: () => void) {
        return abp.ajax({
            url: appRootUrl + 'assets/' + environment.appConfig,
            method: 'GET',
            headers: {
                'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
            }
        }).done(result => {
            AppConsts.appBaseUrl = result.appBaseUrl;
            AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl;
            AppConsts.localeMappings = result.localeMappings;
            AppConsts.enableNormalLogin = result.enableNormalLogin;
            callback();
        });
    }

    private static getGoogleClientAppId(callback: () => void) {
        return abp.ajax({
            url: AppConsts.remoteServiceBaseUrl + '/api/services/app/Configuration/GetGoogleClientAppId',
            method: 'GET',
            headers: {
                'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
            }
        }).done(result => {
            AppConsts.googleClientAppId = result;
            callback();
        });
    }

    private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    public static getUserConfiguration(callback: () => void): JQueryPromise<any> {
        return abp.ajax({
            url: AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + abp.auth.getToken(),
                '.AspNetCore.Culture': abp.utils.getCookieValue('Abp.Localization.CultureName'),
                'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
            }
        }).done(result => {
            $.extend(true, abp, result);

            // abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);

            // moment.locale(abp.localization.currentLanguage.name);

            // if (abp.clock.provider.supportsMultipleTimezone) {
            //     moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
            // }       
            
            abp.clock.provider = abp.timing.utcClockProvider;

            moment.locale('en');

            // if (abp.clock.provider.supportsMultipleTimezone) {
            //     moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
            // }       

            // moment.tz.setDefault('Asia/Ho_Chi_Minh');

            callback();
        });
    }

}
