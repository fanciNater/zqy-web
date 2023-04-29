import RequestPlugin from '@/plugins/request/request'
// import { message } from 'ant-design-vue';
import { ElMessage } from 'element-plus'

const message = ElMessage

const RequestPluginFun = (app: any) => {
    RequestPlugin.install(app, {
        // baseURL: process.env.VUE_APP_BASE_DOMAIN,
        // baseURL: 'http://101.132.135.228:30211',
        baseURL: 'https://zhiqingyun-demo.isxcode.com',
        timeout: 15000,
        headers: {
            'Accept-Language': 'zh-CN'
        },
        needShowMessage: true,
        businessErrorCatch: function(
            failRes: any,
            response: any,
            needShowMessage: boolean
        ) {
            if (needShowMessage) {
                message({
                    message: failRes.message,
                    type: failRes.code || 'error'
                })
            }
            if (failRes.code == '401') {
            }
        },
        errorCatch: function(err: any, needShowMessage: any) {
            console.log(needShowMessage)
            if (!err.response) {
                return true
            }
            if (err.response && err.response.status === 401) {
                return true
            } else if (err.response.status === 404) {
                message.error('404 NOT FOUND')
                return true
            } else if (err.response.status === 423) {
    
                return true
            } else if (err.response.status === 500) {
    
                return true
            } else if (err.response.status === 402) {
    
                return true
            } else if (err.response.status === 410) { // 版本更新
    
            } else {
                return true
            }
        }
    })
}

export default RequestPluginFun
