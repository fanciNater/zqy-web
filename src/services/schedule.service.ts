/*
 * @Author: fanciNate
 * @Date: 2023-04-26 17:01:16
 * @LastEditTime: 2023-05-03 21:36:23
 * @LastEditors: fanciNate
 * @Description: In User Settings Edit
 * @FilePath: /zqy-web/src/services/computer-group.service.ts
 */
import { http } from '@/utils/http';
interface SerchParams {
    page: number
    pageSize: number
    searchKeyWord: string
}

// 获取调度历史查询数据
export function GetScheduleList(params: SerchParams): Promise<any> {
    return http.request({
        method: 'post',
        url: '/vip/woi/queryInstance',
        params: params
    })
}
