<template>
    <BlockModal
        :modelConfig="modelConfig"
    >
        <el-form
            class="add-computer-group"
            label-position="top"
            ref="form"
            :model="formData"
            :rules="rules"
        >
            <el-form-item label="数据源" prop="datasourceId">
                <el-select v-model="formData.datasourceId" placeholder="请选择">
                    <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </BlockModal>
</template>

<script lang="ts" setup>
import { reactive, defineExpose, ref, nextTick } from 'vue'
import BlockModal from '@/components/block-modal/index.vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { GetDatasourceList } from '@/services/datasource.service'

const form = ref<FormInstance>()
const callback = ref<any>()
const typeList = ref([])
const modelConfig = reactive({
    title: '作业属性配置',
    visible: false,
    width: '520px',
    okConfig: {
        title: '确定',
        ok: okEvent,
        disabled: false,
        loading: false
    },
    cancelConfig: {
        title: '取消',
        cancel: closeEvent,
        disabled: false
    },
    needScale: false,
    zIndex: 1100,
    closeOnClickModal: false
})
const formData = reactive({
    datasourceId: ''
})
const rules = reactive<FormRules>({
    datasourceId: [
        { required: true, message: '请选择数据源', trigger: ['blur', 'change'] }
    ]
})

function showModal(cb: () => void, data: any): void {
    getDataSourceList()
    callback.value = cb
    modelConfig.visible = true
    formData.datasourceId = data.datasourceId
    nextTick(() => {
        form.value?.resetFields()
    })
}

function getDataSourceList() {
    GetDatasourceList({
        page: 0,
        pageSize: 10000,
        searchKeyWord: '',
    }).then((res: any) => {
        typeList.value = res.data.content.map((item: any) => {
            return {
                label: item.name,
                value: item.id
            }
        })
    }).catch(() => {
        typeList.value = []
    });
}

function okEvent() {
    form.value?.validate((valid, fields) => {
        if (valid) {
            modelConfig.okConfig.loading = true
            callback.value({
                ...formData
            }).then((res: any) => {
                modelConfig.okConfig.loading = false
                if (res === undefined) {
                    modelConfig.visible = false
                } else {
                    modelConfig.visible = true
                }
            }).catch((err: any) => {
                modelConfig.okConfig.loading = false
                ElMessage.error(err)
            })
        } else {
            ElMessage.warning('请将表单输入完整')
        }
    })
}

function closeEvent() {
    modelConfig.visible = false
}

defineExpose({
    showModal
})
</script>

<style lang="scss">
.add-computer-group {
    padding: 12px 20px 0 20px;
    box-sizing: border-box;
}
</style>
