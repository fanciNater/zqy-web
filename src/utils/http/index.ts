import { createAxios } from '@/plugins/http-request';
// import { setTokenToHeaders, getTokenFromResponse, clearLocalLoginInfo, LOGIN_NAME } from '@devopsuse/login';
// import { useUserStoreWidthOut } from '@/store/user';
import router from '@/router';
import { merge } from '../checkType';
// import { getUuid } from './getUuid';
// import { clearStorage } from '../storage';

export const httpOption = {
    transform: {
        requestInterceptors: (config: any) => {
            // setTokenToHeaders(config);

            // const userStore = useUserStoreWidthOut();
            // const tenant = userStore.tenant;
            // if (tenant?.tenantCode) {
            //     config.headers['x-devops-tenant'] = tenant.tenantCode;
            // }
            // config.headers['X-DEVOPS-R-NO'] = getUuid();

            return config;
        },
        responseInterceptors: (config: any): any => {
            // getTokenFromResponse(config);

            return config;
        }
    },
    requestOptions: {
        showSuccessMessage: (msg: string): void => {
            console.log('123', msg)
        },
        showErrorMessage: (msg: string): void => {
            //   window['$message'].error(msg);
            console.log('123', msg)
        },
        checkStatus: (status: number, msg: string, showMsg: any): void => {
            console.log('hahah')

            try {
                if (status == 401) {
                    showMsg('用户登录过期');
                    // clearLocalLoginInfo();
                    // storage.clear();
                    // clearStorage();
                    // router.replace({
                    //     name: LOGIN_NAME,
                    //     query: {
                    //         redirect: location.href
                    //     }
                    // });
                } else {
                    showMsg('2222', msg);
                }
            } catch (error) {
                console.log('2ddddd')
                // console.log('err', error);
                // router.replace({
                //     name: LOGIN_NAME,
                //     query: {
                //         redirect: '/home'
                //     }
                // });
            }
        }
    },
    timeout: 30 * 1e3
};

export const createHttp = (option = {}) => {
    return createAxios(merge({}, { ...httpOption }, { ...option }));
};

export const http = createHttp();
