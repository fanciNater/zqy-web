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
    <div class="zqy-work-item" >
        <LoadingPage :visible="loading" :networkError="networkError" @loading-refresh="initData">
            <div class="zqy-work-container">
                <div class="sql-code-container">
                    <div class="sql-option-container">
                        <div class="btn-box" @click="goBack">
                            <el-icon><RefreshLeft /></el-icon>
                            <span class="btn-text">返回</span>
                        </div>
                        <div class="btn-box" @click="runWorkData">
                            <el-icon v-if="!runningLoading"><VideoPlay /></el-icon>
                            <el-icon v-else class="is-loading"><Loading /></el-icon>
                            <span class="btn-text">运行</span>
                        </div>
                        <div class="btn-box" @click="terWorkData">
                            <el-icon v-if="!terLoading"><Close /></el-icon>
                            <el-icon v-else class="is-loading"><Loading /></el-icon>
                            <span class="btn-text">中止</span>
                        </div>
                        <div class="btn-box" @click="saveData">
                            <el-icon v-if="!saveLoading"><Finished /></el-icon>
                            <el-icon v-else class="is-loading"><Loading /></el-icon>
                            <span class="btn-text">保存</span>
                        </div>
                        <div class="btn-box" @click="setConfigData">
                            <el-icon><Setting /></el-icon>
                            <span class="btn-text">配置</span>
                        </div>
                    </div>
                    <el-input
                        type="textarea"
                        v-model="sqltextData"
                        maxlength="2000"
                        :autosize="{minRows: 10, maxRows: 10}"
                        placeholder="请输入"
                    />
                </div>
                <div class="log-show">
                    <el-tabs v-model="activeName">
                        <el-tab-pane v-for="tab in tabList" :key="tab.code" :label="tab.name" :name="tab.code">
                            <!-- <component :is="activeName"></component> -->
                            <PublishLog v-if="tab.code === 'publish-log'"></PublishLog>
                            <ReturnData v-if="tab.code === 'return-data'"></ReturnData>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </LoadingPage>
        <ConfigModal ref="configModalRef"></ConfigModal>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import Breadcrumb from '@/layout/bread-crumb/index.vue'
import LoadingPage from '@/components/loading/index.vue'
import ConfigModal from './config-modal/index.vue'
import PublishLog from './publish-log.vue'
import ReturnData from './return-data.vue'

import { GetWorkItemConfig, RunWorkItemConfig, SaveWorkItemConfig, TerWorkItemConfig } from '@/services/workflow.service'
import { ElMessage, ElMessageBox } from "element-plus"
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const networkError = ref(false)
const runningLoading = ref(false)
const saveLoading = ref(false)
const terLoading = ref(false)
const configModalRef = ref(null)
const activeName = ref('publish-log')
const sqltextData = ref('')

let workConfig = reactive({
    datasourceId: '',
    name: '',
    sql: '',
    workId: '',
    workType: '',
    workflowId: '',
    applicationId: ''
})

const breadCrumbList = reactive([
    {
        name: '作业流',
        code: 'workflow'
    },
    {
        name: '作业',
        code: 'workflow-detail',
        query: {
            id: route.query.workflowId
        }
    },
    {
        name: '作业详情',
        code: 'work-item'
    }
])
const tabList = reactive([
    {
        name: '提交日志',
        code: 'publish-log'
    },
    {
        name: '数据返回',
        code: 'return-data'
    }
])

function initData() {
    loading.value = true
    networkError.value = networkError.value || false;
    GetWorkItemConfig({
        workId: route.query.id
    }).then((res: any) => {
        workConfig = res.data
        sqltextData.value = res.data.sql
        loading.value = false
        networkError.value = false
    }).catch(() => {
        loading.value = false
        networkError.value = false
    });
}

// 返回
function goBack() {
    router.push({
        name: 'workflow-detail',
        query: {
            id: route.query.workflowId
        }
    })
}

// 运行
function runWorkData() {
    runningLoading.value = true
    RunWorkItemConfig({
        workId: route.query.id
    }).then((res: any) => {
        runningLoading.value = false
        workConfig.applicationId = res.data.applicationId
        ElMessage.success(res.msg)
        initData()
    }).catch((error: any) => {
        runningLoading.value = false
    })
}

// 终止
function terWorkData() {
    if (!workConfig.applicationId) {
        ElMessage.warning('暂无可中止的作业')
        return
    }
    terLoading.value = true
    TerWorkItemConfig({
        workId: route.query.id,
        applicationId: workConfig.applicationId
    }).then((res: any) => {
        terLoading.value = false
        ElMessage.success(res.msg)
        initData()
    }).catch((error: any) => {
        terLoading.value = false
    })
}

// 保存配置
function saveData() {
    saveLoading.value = true
    SaveWorkItemConfig({
        sql: sqltextData.value,
        workId: route.query.id,
        datasourceId: workConfig.datasourceId
    }).then((res: any) => {
        ElMessage.success(res.msg)
        saveLoading.value = false
        initData()
    }).catch((error: any) => {
        saveLoading.value = false
    })
}

// 配置打开
function setConfigData() {
    configModalRef.value.showModal((formData: any) => {
        return new Promise((resolve: any, reject: any) => {
            SaveWorkItemConfig({
                sql: sqltextData.value,
                workId: route.query.id,
                datasourceId: formData.datasourceId
            }).then((res: any) => {
                ElMessage.success(res.msg)
                initData()
                resolve()
            }).catch((error: any) => {
                reject(error)
            })
        })
    }, workConfig)
}

onMounted(() => {
    initData()
})
</script>

<style lang="scss">
.zqy-work-item {
    .zqy-loading {
        padding: 0 20px;
        box-sizing: border-box;
        height: calc(100vh - 116px);
    }
    .zqy-work-container {
        .sql-code-container {
            .sql-option-container {
                height: $--app-item-height;
                display: flex;
                align-items: center;
                color: $--app-unclick-color;
                .btn-box {
                    font-size: $--app-small-font-size;
                    display: flex;
                    cursor: pointer;
                    width: 48px;
                    margin-right: 8px;
                    .btn-text {
                        margin-left: 4px;
                    }
                    &:hover {
                        color: $--app-primary-color;
                    }
                }
            }
            .el-textarea {
                .el-textarea__inner {
                    border-radius: $--app-border-radius;
                    font-size: $--app-small-font-size;
                }
            }
        }

        .log-show {
            .el-tabs {
                .el-tabs__item {
                    font-size: $--app-small-font-size;
                }
                .el-tabs__content {
                    height: calc(100vh - 420px);
                }
                .el-tabs__nav-scroll {
                    border-bottom: 1px solid $--app-border-color;
                }
            }
        }
    }
}
</style>
