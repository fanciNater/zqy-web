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
            <el-form-item label="集群名称" prop="name">
                <el-input
                    v-model="formData.name"
                    maxlength="20"
                    placeholder="请输入"
                    show-word-limit
                />
            </el-form-item>
            <el-form-item label="备注">
                <el-input
                    show-word-limit
                    type="textarea"
                    v-model="formData.comment"
                    maxlength="200"
                    :autosize="{minRows: 4, maxRows: 4}"
                    placeholder="请输入"
                />
            </el-form-item>
        </el-form>
    </BlockModal>
</template>

<script lang="ts" setup>
import { reactive, defineExpose, ref, nextTick } from 'vue'
import BlockModal from '@/components/block-modal/index.vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'

const form = ref<FormInstance>()
const callback = ref<any>()
const modelConfig = reactive({
    title: '添加集群',
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
    name: '',
    comment: '',
    id: ''
})
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入集群名称', trigger: ['blur', 'change'] }
    ]
})


function showModal(cb: () => void, data: any): void {
    callback.value = cb
    if (data) {
        formData.name = data.name
        formData.comment = data.comment
        formData.id = data.id
        modelConfig.title = '编辑集群'
    } else {
        formData.name = ''
        formData.comment = ''
        formData.id = ''
        modelConfig.title = '添加集群'
    }
    nextTick(() => {
        form.value?.resetFields()
    })
    modelConfig.visible = true
}

function okEvent() {
    form.value?.validate((valid, fields) => {
        if (valid) {
            modelConfig.okConfig.loading = true
            callback.value({
                ...formData,
                id: formData.id ? formData.id : undefined,
                calculateEngineId: formData.id ? formData.id : undefined,
            }).then((res: any) => {
                modelConfig.okConfig.loading = false
                if (res === undefined) {
                    modelConfig.visible = false
                } else {
                    modelConfig.visible = true
                }
            }).catch((err: any) => {
                modelConfig.okConfig.loading = false
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
