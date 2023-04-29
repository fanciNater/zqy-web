/*
 * @Author: fanciNate
 * @Date: 2023-04-26 17:01:16
 * @LastEditTime: 2023-04-29 21:34:08
 * @LastEditors: fanciNate
 * @Description: In User Settings Edit
 * @FilePath: /zqy-web/src/services/computer-group.service.ts
 */
import { http } from '@/utils/http';
interface SerchParams {
    page: number
    pageSize: number
    searchContent: string
}

interface AddParams {
    comment: string,
    name: string,
    id?: string
}

export function GetComputerGroupList(params: SerchParams): Promise<any> {
    return http.request({
        method: 'post',
        url: `/cae/queryEngine`,
        params: params
    });
}

// 添加集群
export function AddComputerGroupData(params: AddParams): Promise<any> {
    return http.request({
        method: 'post',
        url: '/cae/addEngine',
        params: params
    });
}

// 更新集群
export function UpdateComputerGroupData(params: AddParams): Promise<any> {
    return http.request({
        method: 'post',
        url: '/cae/updateEngine',
        params: params
    });
}

// 检测
export function CheckComputerGroupData(params: any): Promise<any> {
    return http.request({
        method: 'get',
        url: '/cae/checkEngine',
        params: params
    });
}

// 删除
export function DeleteComputerGroupData(params: any): Promise<any> {
    return http.request({
        method: 'get',
        url: '/cae/delEngine',
        params: params
    });
}

// 节点页面查询数据
export function GetComputerPointData(params: any): Promise<any> {
    return http.request({
        method: 'post',
        url: '/eno/queryNode',
        params: params
    });
}


// 检测节点页面查询数据
export function CheckComputerPointData(params: any): Promise<any> {
    return http.request({
        method: 'get',
        url: '/eno/checkAgent',
        params: params
    });
}

// 编辑节点页面查询数据
export function UpdateComputerPointData(params: any): Promise<any> {
    return http.request({
        method: 'post',
        url: '/eno/updateNode',
        params: params
    });
}

// 添加节点数据
export function AddComputerPointData(params: AddParams): Promise<any> {
    return http.request({
        method: 'post',
        url: '/eno/addNode',
        params: params
    });
}