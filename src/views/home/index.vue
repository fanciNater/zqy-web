<!--
 * @Author: fanciNate
 * @Date: 2023-05-23 07:25:46
 * @LastEditTime: 2023-05-28 22:15:37
 * @LastEditors: fanciNate
 * @Description: In User Settings Edit
 * @FilePath: /zqy-web/src/views/home/index.vue
-->
<template>
    <div class="zqy-home">
        <Header></Header>
        <div class="home-container">
            <div class="container-left">
                <menu-list
                    :defaultMenu="defaultMenu"
                    :menuList="menuListData"
                    @select="select"
                ></menu-list>
            </div>
            <div class="container-right" v-if="showData">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, onUnmounted, nextTick } from "vue"
import Header from '@/layout/header/index.vue'
import MenuList from '@/layout/menu-list/index.vue'
import { menu, MenuListData } from './home.config'
import { useRouter, useRoute } from 'vue-router'
import eventBus from '@/utils/eventBus'
import { useMutations, useState } from "@/hooks/useStore"

const router = useRouter()
const route = useRoute()
const mutations = useMutations(['setCurrentMenu'], 'authStoreModule')
const state = useState(['currentMenu', 'role'], 'authStoreModule')

const defaultMenu = ref('')
const showData = ref(true)
const menuListData: Array<menu> = reactive(MenuListData)

const select = (e: string) => {
    defaultMenu.value = e
    mutations.setCurrentMenu(e)
    router.push({ name: e })
}

onMounted(() => {
    const menuList = menuListData.filter(menu => menu.authType?.includes(state.role.value || 'ROLE_TENANT_MEMBER'))
    if (!state.currentMenu.value) {
        defaultMenu.value = menuList[0].code
        router.push({ name: defaultMenu.value })
        mutations.setCurrentMenu(defaultMenu.value)
    } else {
        defaultMenu.value = state.currentMenu.value
        router.push({ name: state.currentMenu.value })
    }
    // 这里接受eventbus 触发页面更新
    eventBus.on('tenantChange', () => {
        showData.value = false
        nextTick(() => {
            showData.value = true
        })
    })
})

onUnmounted(() => {
    eventBus.off('tenantChange', () => {
        console.log('这里移除了bus')
    })
})
</script>

<style lang="scss">
.zqy-home {
    width: 100%;
    .home-container {
        width: 100%;
        display: flex;
        height: calc(100vh - 60px);
        margin-top: 60px;
        position: relative;
        // min-width: 960px;
        .container-left {
            background-color: $--app-light-color;
            box-shadow: $--app-box-shadow;
            padding-top: 8px;
            box-sizing: border-box;
            z-index: 1;
        }
        .container-right {  
            width: 100%;
            overflow: auto;
        }
    }
}
</style>
