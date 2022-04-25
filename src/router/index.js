import Vue from "vue";
// 引入 VueRouter
import VueRouter from "vue-router";

import Reg from "@/views/Reg/Reg";
import Login from "@/views/Login/Login";

// 应用 VueRouter
Vue.use(VueRouter)

const routes = [
    {
        path:'/reg',
        component:Reg
    },
    {
        path: '/login',
        component: Login
    }
]

// 创建路由器
const router = new VueRouter({
    routes
})

// 暴露路由器
export default router