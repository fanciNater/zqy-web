import axios from 'axios'
import fileDownload from 'js-file-download'
import { HttpError, HTTP_STATUS_CODE, HTTP_ERROR_CONSTANT } from './request-constant'
import { ElMessage } from 'element-plus'

const message = ElMessage

const RequestPlugin: any = {
  install(Vue: any, opts: any) {
    const requestInterceptorMap = new Map()
    const responseInterceptorMap = new Map()

    const options = {
      baseURL: opts.baseURL || '',
      timeout: opts.timeout || 50000,
      method: opts.method || 'get',
      headers: opts.headers || {},
      withCredentials: opts.withCredentials || false,
      responseType: opts.responseType || 'json',
      validateStatus:
        opts.validateStatus ||
        function(status: number) {
          return status >= 200 && status < 300 // 默认的
        },
      maxRedirects: opts.maxRedirects || 5,
      onUploadProgress: opts.onUploadProgress,
      onDownloadProgress: opts.onDownloadProgress,
      needShowMessage: opts.needShowMessage === true || typeof opts.needShowMessage === 'undefined'
    }

    const customOptions = {
      businessValid:
        opts.businessValid ||
        function(response: any) {
          return response.code === '200' || response.code === 'ok'
        },
      businessTransform:
        opts.businessTransform ||
        function(data: any, response: any) {
          data.headers = response.headers
          data.data = data.data || data.table
        },
      errorCatch: function(err: any, needShowMessage: boolean) {
        /**
         * 返回true阻断系统提示事件
         */
        if (opts.errorCatch(err, needShowMessage)) {
          return
        }
        if (!needShowMessage) {
          return
        }
        if (err.response) {
          if (HTTP_ERROR_CONSTANT[err.response.status]) {
            message.error(HTTP_ERROR_CONSTANT[err.response.status].errorMsg)
          } else if (
            err.response.status >=
              HTTP_ERROR_CONSTANT[HTTP_STATUS_CODE.BadRequestMin].errorCode - 9000 &&
            err.response.status <=
              HTTP_ERROR_CONSTANT[HTTP_STATUS_CODE.BadRequestMax].errorCode - 9000
          ) {
            message.error(
              HTTP_ERROR_CONSTANT[HTTP_STATUS_CODE.BadRequestMin].errorMsg
            )
          } else if (
            err.response.status >=
              HTTP_ERROR_CONSTANT[HTTP_STATUS_CODE.ServerExceptionMin].errorCode - 9000 &&
            err.response.status <=
              HTTP_ERROR_CONSTANT[HTTP_STATUS_CODE.ServerExceptionMin].errorCode - 9000
          ) {
            message.error(
              HTTP_ERROR_CONSTANT[HTTP_STATUS_CODE.ServerExceptionMin].errorMsg
            )
          }
        } else if (err.message === '终止请求') {
          console.log(err.message)
        } else {
          message.error('timeout : 网络连接超时了， 请检查您的网络设置')
        }
      },
      businessErrorCatch:
        opts.businessErrorCatch ||
        function(failRes: any, response: any, needShowMessage: boolean) {
          if (needShowMessage) {
            message.info(failRes.message)
          }
        }
    }

    // 设置通用配置
    const instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout,
      method: options.method,
      headers: options.headers,
      withCredentials: options.withCredentials,
      responseType: options.responseType,
      validateStatus: options.validateStatus,
      maxRedirects: options.maxRedirects
    })

    Vue.setGlobalConfig = function(networkConfig: any) {
      const globalOptions = {
        ...options,
        ...networkConfig
      }
      instance.defaults = {
        ...instance.defaults,
        ...globalOptions
      }
      Vue.axios = instance
      Vue.config.globalProperties.$axios = instance
    }

    Vue.addHeaders = function(headers: any) {
      options.headers = {
        ...options.headers,
        ...headers
      }
      instance.defaults = {
        ...instance.defaults,
        ...options
      }
      Vue.axios = instance
      Vue.config.globalProperties.$axios = instance
    }

    Vue.addInterceptorsRequest = function(interceptorKey: any, callback: any) {
      Vue.removeInterceptorsRequest(interceptorKey)
      const requestInterceptor = instance.interceptors.request.use(callback)
      requestInterceptorMap.set(interceptorKey, requestInterceptor)
    }

    Vue.removeInterceptorsRequest = function(interceptorKey: any) {
      if (requestInterceptorMap.get(interceptorKey)) {
        instance.interceptors.request.eject(requestInterceptorMap.get(interceptorKey))
      }
    }

    Vue.addInterceptorsResponse = function(interceptorKey: any, callback: any) {
      Vue.removeInterceptorsResponse(interceptorKey)
      const responseInterceptor = instance.interceptors.response.use(callback)
      responseInterceptorMap.set(interceptorKey, responseInterceptor)
    }

    Vue.removeInterceptorsResponse = function(interceptorKey: any) {
      if (responseInterceptorMap.get(interceptorKey)) {
        instance.interceptors.request.eject(responseInterceptorMap.get(interceptorKey))
      }
    }

    Vue.post = function(urlConfig: any, needShowMessage: boolean) {
      const config = {
        url: urlConfig.url,
        data: urlConfig.params,
        config: {
          ...urlConfig.config,
          method: 'post'
        }
      }
      return Vue.request(config, needShowMessage)
    }

    Vue.get = function(urlConfig: any, needShowMessage: any) {
      const config = {
        url: urlConfig.url,
        params: urlConfig.params,
        config: {
          ...urlConfig.config,
          method: 'get'
        }
      }
      Vue.request(config, needShowMessage)
    }

    Vue.request = function(urlConfig: any, needShowMessage: any) {
      if (typeof needShowMessage === 'undefined') {
        needShowMessage = options.needShowMessage
      }
      urlConfig = JSON.parse(JSON.stringify(urlConfig))

      if (urlConfig.url.indexOf('?') !== -1) {
        urlConfig.url = urlConfig.url + '&' + 'timestamp=' + new Date().valueOf()
      } else {
        urlConfig.url = urlConfig.url + '?' + 'timestamp=' + new Date().valueOf()
      }
      const config = {
        ...options,
        ...urlConfig,
        url: urlConfig.url,
        method: urlConfig.method,
        params: urlConfig.params,
        headers: {
          ...options.headers,
          ...urlConfig.headers
        },
        cancelToken: urlConfig.config && urlConfig.config.cancelToken
      }
      if (config.method === 'post' || config.method === 'POST') {
        config.data = urlConfig.params
        delete config.params
      }

      // eslint-disable-next-line no-extend-native
      const promise = new Promise(function(resolve, reject) {
        instance
          .request(config)
          .then((response) => {
            const data = response.data
            // 自定义解析字段，并带上相关请求头
            if (customOptions.businessValid(data)) {
              customOptions.businessTransform(data, response)
              resolve(data)
            } else {
              customOptions.businessErrorCatch(data, response, needShowMessage)
              reject(data)
            }
          })
          .catch((err) => {
            customOptions.errorCatch(err, needShowMessage)
            // if (promise && promise.$currentErrorCatchFunction) {
            //   promise.$currentErrorCatchFunction(err)
            // }
          })
      })
      // eslint-disable-next-line no-new
      return promise
    }

    /**
     * 默认使用post方式下载文件，若需要修改则需要在传入参数的config中，添加相关配置 { method: 'post'}
     */
    Vue.download = function(urlConfig: any, onDownloadProgress: any, needShowMessage: boolean) {
      if (typeof needShowMessage === 'undefined') {
        needShowMessage = options.needShowMessage
      }
      const config = {
        ...options,
        ...urlConfig,
        timeout: urlConfig.timeout || -1,
        url: urlConfig.url,
        method: urlConfig.method,
        params: urlConfig.params,
        responseType: 'blob',
        onDownloadProgress: onDownloadProgress || urlConfig.onDownloadProgress,
        cancelToken: urlConfig.config && urlConfig.config.cancelToken
      }
      if (config.method === 'post' || config.method === 'POST') {
        config.data = urlConfig.params
        delete config.params
      }

      // eslint-disable-next-line no-new
      const promise = new Promise((resolve, reject) => {
        instance
          .request(config)
          .then((response) => {
            // console.error(response)
            const disposition = response.headers['content-disposition']
            let filename =
              disposition &&
              disposition.match(/filename=(.*)/).length > 1 &&
              decodeURI(disposition.match(/filename=(.*)/)[1])
            filename = urlConfig.filename || filename || '下载文件'
            fileDownload(response.data, filename)
            // 将文件配置放入数据
            resolve(disposition)
          })
          .catch((err) => {
            console.error(err)
            customOptions.errorCatch(err, needShowMessage)
            // if (promise && promise.$currentErrorCatchFunction) {
            //   promise.$currentErrorCatchFunction(err)
            // }
          })
      })
      return promise
    }

    /**
     * @param urlConfig.params 参数必须是FormData
     */
    Vue.upload = function(urlConfig: any, onUploadProgress: any, needShowMessage: boolean) {
      if (typeof needShowMessage === 'undefined') {
        needShowMessage = options.needShowMessage
      }
      const config = {
        ...options,
        ...urlConfig,
        timeout: urlConfig.timeout || -1,
        method: 'post',
        onUploadProgress: onUploadProgress || options.onUploadProgress,
        headers: {
          ...options.headers,
          ...urlConfig.headers,
          'Content-Type': 'multipart/form-data'
        },
        url: urlConfig.url,
        data: urlConfig.params
      }
      delete config.params
      // eslint-disable-next-line no-new
      const promise = new Promise((resolve, reject) => {
        instance
          .request(config)
          .then((response) => {
            const data = response.data
            // 自定义解析字段，并带上相关请求头
            if (customOptions.businessValid(data)) {
              customOptions.businessTransform(data, response)
              resolve(data)
            } else {
              customOptions.businessErrorCatch(data, response, needShowMessage)
              reject(data)
            }
          })
          .catch((err) => {
            customOptions.errorCatch(err, needShowMessage)
            // if (promise && promise.$currentErrorCatchFunction) {
            //   promise.$currentErrorCatchFunction(err)
            // }
          })
      })
      return promise
    }

    Vue.config.globalProperties.$post = Vue.post
    Vue.config.globalProperties.$get = Vue.get
    Vue.config.globalProperties.$request = Vue.request
    Vue.config.globalProperties.$download = Vue.download
    Vue.config.globalProperties.$upload = Vue.upload

    Vue.config.globalProperties.$axios = instance
  },
  axios
}

RequestPlugin.axios = axios

RequestPlugin.HttpConstant = { HttpError, HTTP_STATUS_CODE, HTTP_ERROR_CONSTANT }

export default RequestPlugin