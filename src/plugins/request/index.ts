import { createAxios } from '@/plugins/http-request';
import { setTokenToHeaders, getTokenFromResponse, clearLocalLoginInfo, LOGIN_NAME } from '@devopsuse/login';
import { useUserStoreWidthOut } from '@/store/user';
import router from '@/router';
import { storage, deepMerge } from '@/utils/checkType';

export const httpOption = {
  transform: {
    requestInterceptors: (config: any) => {
      setTokenToHeaders(config);

    //   const userStore = useUserStoreWidthOut();
    //   const tenant = userStore.tenant;
    //   if (tenant?.tenantCode) {
    //     config.headers['x-devops-tenant'] = tenant.tenantCode;
    //   }

      return config;
    },
    responseInterceptors: (config: any) => {
      getTokenFromResponse(config);

      return config;
    }
  },
  requestOptions: {
    showSuccessMessage: (msg) => {
      window['$message'].success(msg);
    },
    showErrorMessage: (msg) => {
      window['$message'].error(msg);
    },
    checkStatus: (status, msg, showMsg) => {
      console.log('---status', status);
      try {
        if (status == 401) {
          showMsg('用户登录过期');
          clearLocalLoginInfo();
          storage.clear();
          router.replace({
            name: LOGIN_NAME,
            query: {
              redirect: '/home'
            }
          });
        } else {
          showMsg(msg);
        }
      } catch (error) {
        console.log('err', error);
        router.replace({
          name: LOGIN_NAME,
          query: {
            redirect: '/home'
          }
        });
      }
    }
  }
};

export const createHttp = (option = {}) => {
  return createAxios(deepMerge({ ...httpOption }, { ...option }));
};

export const http = createHttp();
