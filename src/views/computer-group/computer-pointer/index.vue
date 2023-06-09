<!--
 * @Author: fanciNate
 * @Date: 2023-04-27 16:57:57
 * @LastEditTime: 2023-05-03 21:38:13
 * @LastEditors: fanciNate
 * @Description: In User Settings Edit
 * @FilePath: /zqy-web/src/views/computer-group/computer-pointer/index.vue
-->
<template>
    <Breadcrumb :breadCrumbList="breadCrumbList"></Breadcrumb>
    <div class="zqy-seach-table" >
        <div class="zqy-table-top">
            <el-button type="primary" @click="addData">添加节点</el-button>
            <div class="zqy-seach">
                <el-input
                    v-model="keyword"
                    placeholder="请输入节点名称/地址/备注 回车进行搜索"
                    :maxlength="200"
                    clearable
                    @input="inputEvent"
                    @keyup.enter="initData(false)"
                />
            </div>
        </div>
        <LoadingPage :visible="loading" :networkError="networkError" @loading-refresh="initData(false)">
            <div class="zqy-table">
                <BlockTable
                    :tableConfig="tableConfig"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                >
                    <template v-slot:statusTag="scopeSlot">
                        <div class="btn-group">
                            <el-tag v-if="scopeSlot.row.status === 'ACTIVE'" class="ml-2" type="success">可用</el-tag>
                            <el-tag v-if="scopeSlot.row.status === 'NO_ACTIVE'" class="ml-2" type="danger">不可用</el-tag>
                            <el-tag v-if="scopeSlot.row.status === 'NEW'">待配置</el-tag>
                        </div>
                    </template>
                    <template v-slot:options="scopeSlot">
                        <div class="btn-group">
                            <span v-if="!scopeSlot.row.checkLoading" @click="checkData(scopeSlot.row)">检测</span>
                            <el-icon v-else class="is-loading"><Loading /></el-icon>
                            <span v-if="!scopeSlot.row.installLoading" @click="installData(scopeSlot.row)">安装</span>
                            <el-icon v-else class="is-loading"><Loading /></el-icon>
                            <span v-if="!scopeSlot.row.uninstallLoading" @click="uninstallData(scopeSlot.row)">卸载</span>
                            <el-icon v-else class="is-loading"><Loading /></el-icon>
                            <span @click="deleteData(scopeSlot.row)">删除</span>
                        </div>
                    </template>
                </BlockTable>
            </div>
        </LoadingPage>
        <AddModal ref="addModalRef"></AddModal>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import Breadcrumb from "@/layout/bread-crumb/index.vue"
import BlockTable from "@/components/block-table/index.vue"
import LoadingPage from '@/components/loading/index.vue'
import AddModal from './add-modal/index.vue'

import { PointTableConfig, FormData } from "../computer-group.config";
import { GetComputerPointData, CheckComputerPointData, AddComputerPointData, InstallComputerPointData, UninstallComputerPointData, DeleteComputerPointData } from '@/services/computer-group.service'
import { reject } from "lodash"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRoute } from 'vue-router'

const route = useRoute()
const breadCrumbList = reactive([
    {
        name: '计算集群',
        code: 'computer-group'
    },
    {
        name: '节点',
        code: 'computer-pointer'
    }
])
const tableConfig: any = reactive(PointTableConfig)
const keyword = ref("")
const loading = ref(false)
const networkError = ref(false)
const addModalRef = ref(null)

function initData(tableLoading?: boolean) {
    loading.value = tableLoading ? false : true
    networkError.value = networkError.value || false;
    GetComputerPointData({
        page: tableConfig.pagination.currentPage - 1,
        pageSize: tableConfig.pagination.pageSize,
        searchKeyWord: keyword.value,
        clusterId: route.query.id
    }).then((res: any) => {
        tableConfig.tableData = res.data.content
        tableConfig.pagination.total = res.data.totalElements
        loading.value = false
        tableConfig.loading = false
        networkError.value = false
    }).catch(() => {
        tableConfig.tableData = []
        tableConfig.pagination.total = 0
        loading.value = false
        tableConfig.loading = false
        networkError.value = true
    });
}

// 添加节点数据
function addData() {
    addModalRef.value.showModal((formData: FormData) => {
        return new Promise((resolve: any, reject: any) => {
            AddComputerPointData({
                ...formData,
                calculateEngineId: route.query.id
            }).then((res: any) => {
                ElMessage.success(res.msg)
                initData()
                resolve()
            }).catch((error: any) => {
                reject(error);
            })
        })
    })
}

// 安装
function installData(data: any) {
    data.installLoading = true
    InstallComputerPointData({
        engineNodeId: data.id
    }).then((res: any) => {
        ElMessage.success(res.msg)
        data.installLoading = false
        initData(true)
    }).catch((error: any) => {
        data.installLoading = false
    })
}

// 卸载
function uninstallData(data: any) {
    data.uninstallLoading = true
    UninstallComputerPointData({
        engineNodeId: data.id
    }).then((res: any) => {
        ElMessage.success(res.msg)
        data.uninstallLoading = false
        initData(true)
    }).catch((error: any) => {
        data.uninstallLoading = false
    })
}

// 检测
function checkData(data: any) {
    data.checkLoading = true
    CheckComputerPointData({
        engineNodeId: data.id
    }).then((res: any) => {
        data.checkLoading = false
        ElMessage.success(res.msg)
        initData(true)
    }).catch((error: any) => {
        data.checkLoading = false
    })
}

// 删除
function deleteData(data: any) {
    ElMessageBox.confirm('确定删除该节点吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        DeleteComputerPointData({
            engineNodeId: data.id
        }).then((res: any) => {
            ElMessage.success(res.msg)
            initData()
        }).catch((error: any) => {
        })
    })
}

function inputEvent(e: string) {
    if (e === "") {
        initData();
    }
}

function handleSizeChange(e: number) {
    tableConfig.pagination.pageSize = e;
    initData()
}

function handleCurrentChange(e: number) {
    tableConfig.pagination.currentPage = e;
    initData()
}

onMounted(() => {
    initData()
})
</script>
