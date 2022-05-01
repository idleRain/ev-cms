import Vue from "vue";
// 引入 VueRouter
import VueRouter from "vue-router";

import Reg from "@/views/Reg/Reg";
import Login from "@/views/Login/Login";
import Main from "@/views/Main/Main";
import store from "@/store";
import Home from "@/views/Menus/Home/Home";
import UserInfo from "@/views/Menus/User/UserInfo";
import UserAvatar from "@/views/Menus/User/UserAvatar";
import UserPwd from "@/views/Menus/User/UserPwd";

// 应用 VueRouter
Vue.use(VueRouter)

const routes = [
    {
        path: '/reg',
        component: Reg
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/',
        component: Main,
        // 访问首页时重定向到 home
        redirect: '/home',
        children: [
            {path: 'home', component: Home},
            {path: 'user-info',component: UserInfo},
            {path: 'user-avatar',component: UserAvatar},
            {path: 'user-pwd',component: UserPwd}
        ]
    }
]

// 创建路由器
const router = new VueRouter({
    routes
})
// 路由前置守卫，判断用户是否未登录操作页面跳转，如果是 则自动跳转到登录页
router.beforeEach((to, from, next) => {
    // 设置免登录白名单
    const whiteList = ['/login', '/reg']
    // 如果未携带 token 且不在 白名单 ，则跳转至登录页
    if (!store.state.users.token && !whiteList.includes(to.path)) {
        Vue.prototype.$message.error('请先登录！')
        next('/login')
    } else {
        // 否则放行
        next()
    }
})

// 暴露路由器
export default router