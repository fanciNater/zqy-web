<!--
 * @Author: fanciNate
 * @Date: 2023-05-23 07:25:46
 * @LastEditTime: 2023-05-28 22:19:07
 * @LastEditors: fanciNate
 * @Description: In User Settings Edit
 * @FilePath: /zqy-web/src/App.vue
-->
<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  // const url = require('./assets/icons/favicon.ico')
  const linkIcon: any = document.getElementById('icon')
  if (linkIcon) {
    linkIcon.href = './assets/icons/favicon.ico'
  }
})
</script>
