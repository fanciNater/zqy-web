<template>
    <Breadcrumb :breadCrumbList="breadCrumbList"></Breadcrumb>
    <div class="zqy-seach-table" >
        <div class="zqy-table-top">
            <el-button type="primary" @click="addGroup">添加集群</el-button>
            <div class="zqy-seach">
                <el-input
                    v-model="keyword"
                    placeholder="请输入集群名称/备注 回车进行搜索"
                    :maxlength="200"
                    clearable
                    @input="inputEvent"
                    @keyup.enter="initData"
                />
            </div>
        </div>
        <Loading :visible="loading" :networkError="networkError" @loading-refresh="initData">
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
                            <el-tag v-if="scopeSlot.row.status === 'NEW'" type="info">待配置</el-tag>
                            <el-tag v-if="scopeSlot.row.status === 'UN_CHECK'">待检测</el-tag>
                        </div>
                    </template>
                    <template v-slot:options="scopeSlot">
                        <div class="btn-group">
                            <span @click="editData(scopeSlot.row)">编辑</span>
                            <span @click="checkData(scopeSlot.row)">检测</span>
                            <span @click="showPointDetail(scopeSlot.row)">节点</span>
                            <span @click="deleteData(scopeSlot.row)">删除</span>
                        </div>
                    </template>
                </BlockTable>
            </div>
        </Loading>
        <AddModal ref="addModalRef"></AddModal>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, onMounted } from "vue";
import Breadcrumb from "@/layout/bread-crumb/index.vue"
import BlockTable from "@/components/block-table/index.vue"
import Loading from '@/components/loading/index.vue'
import AddModal from './add-modal/index.vue'

import { BreadCrumbList, TableConfig, FormData } from "./computer-group.config";
import { GetComputerGroupList, AddComputerGroupData, UpdateComputerGroupData, CheckComputerGroupData, DeleteComputerGroupData } from '@/services/computer-group.service'
import { reject } from "lodash"
import { ElMessage, ElMessageBox } from "element-plus"
import { useRouter } from 'vue-router'

const router = useRouter()
const breadCrumbList = reactive(BreadCrumbList)
const tableConfig: any = reactive(TableConfig)
const keyword = ref("")
const loading = ref(false)
const networkError = ref(false)
const addModalRef = ref(null)

function initData(tableLoading?: boolean) {
    loading.value = true
    networkError.value = networkError.value || false;
    GetComputerGroupList({
        page: tableConfig.pagination.currentPage - 1,
        pageSize: tableConfig.pagination.pageSize,
        searchContent: keyword.value,
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
        networkError.value = false
    });
}

function addGroup() {
    addModalRef.value.showModal((formData: FormData) => {
        return new Promise((resolve: any, reject: any) => {
            AddComputerGroupData(formData).then((res: any) => {
                ElMessage.success(res.msg)
                initData()
                resolve()
            }).catch((error: any) => {
                reject(error);
            })
        })
    })
}

function editData(data: any) {
    addModalRef.value.showModal((formData: FormData) => {
        return new Promise((resolve: any, reject: any) => {
            UpdateComputerGroupData(formData).then((res: any) => {
                ElMessage.success(res.msg)
                initData()
                resolve()
            }).catch((error: any) => {
                reject(error);
            })
        })
    }, data)
}

// 检测
function checkData(data: any) {
    CheckComputerGroupData({
        engineId: data.id
    }).then((res: any) => {
        ElMessage.success(res.msg)
        initData()
    }).catch((error: any) => {
    })
}

// 查看节点
function showPointDetail(data: any) {
    router.push({ name: 'computer-pointer', query: {
        id: data.id
    } })
}

// 删除
function deleteData(data: any) {
    ElMessageBox.confirm('确定删除该集群吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        DeleteComputerGroupData({
            engineId: data.id
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
    initData(true)
}

function handleCurrentChange(e: number) {
    tableConfig.pagination.currentPage = e;
    initData(true)
}

onMounted(() => {
    initData()
})
</script>

<style lang="scss">
.zqy-seach-table {
    .zqy-loading {
        height: calc(100vh - 176px);
    }
    .zqy-table-top {
        height: 60px;
        display: flex;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        .zqy-seach {
            .el-input {
                width: 300px;
            }
        }
    }
    .zqy-table {
        padding: 0 20px;
        .vxe-table--body-wrapper {
            max-height: calc(100vh - 292px);
        }
        .btn-group {
            display: flex;
            justify-content: space-between;
            span {
                cursor: pointer;
                color: $--app-unclick-color;
                &:hover {
                    color: $--app-primary-color;
                }
            }
        }
    }
}
</style>
