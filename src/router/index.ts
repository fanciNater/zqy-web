/*
 * @Author: fanciNate
 * @Date: 2023-04-17 09:43:00
 * @LastEditTime: 2023-04-27 17:12:59
 * @LastEditors: fanciNate
 * @Description: In User Settings Edit
 * @FilePath: /zqy-web/src/router/index.ts
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/home/index.vue'
import ComputerGroup from '@/views/computer-group/index.vue'
import ComputerPointer from '@/views/computer-group/computer-pointer/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: {
        name: 'home'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: {
      name: 'computer-group'
    },
    children: [
      {
        path: 'computer-group',
        name: 'computer-group',
        component: ComputerGroup
      },
      {
        path: 'computer-pointer',
        name: 'computer-pointer',
        component: ComputerPointer
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
