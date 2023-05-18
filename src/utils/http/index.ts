import { createAxios } from '@/plugins/http-request'
import router from '@/router'
import { merge } from '../checkType'
import store from '@/store'
import { ElMessage } from 'element-plus'


const message = ElMessage
const storeData: any = store

export const httpOption = {
    transform: {
        requestInterceptors: (config: any) => {

            config.headers['authorization'] = storeData.state?.authStoreModule?.token
            config.headers['tenant'] = storeData.state?.authStoreModule?.tenantId

            return config;
        },
        responseInterceptors: (config: any): any => {
            // getTokenFromResponse(config);

            return config;
        }
    },
    requestOptions: {
        showSuccessMessage: (msg: string): void => {
            message.success(msg)
        },
        showErrorMessage: (msg: string): void => {
            message.error(msg)
        },
        checkStatus: (status: number, msg: string, showMsg: any): void => {

            try {
                if (status == 401) {
                    showMsg('用户登录过期');
                    router.push({
                        name: 'login'
                    });
                } else {
                    showMsg('2222', msg);
                }
            } catch (error) {
                console.error('error', error)
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
