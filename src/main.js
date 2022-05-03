import Vue from 'vue'
import App from './App.vue'
// 引入 vux的js文件
import store from '@/store'

// 引入 VueRouter 插件
import VueRouter from "vue-router"
// 引入 Router
import router from "@/router"

// 引入全局样式
import "@/assets/global.less"

// 完整引入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 axios
import axios from "axios"
// 配置 axios 请求根路径
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
// axios请求拦截器 配置全局请求头
axios.interceptors.request.use((config) => {
    // 请求头携带 token
    config.headers.Authorization = store.state.users.token
    return config
}, (error) => {
    return Promise.reject(error)
})
// axios 响应拦截器，判断登录状态是否失效
axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    // 如果状态码为 401 ，说明 token 失效，那么返回登录页
    if (error.response.status === 401) {
        // 清空 token
        store.commit('users/updateToken')
        Vue.prototype.$message.error('登陆状态失效，请重新登录！')
        router.push('/login')
    }
    return Promise.reject(error)
})

// 将 axios 挂载到 Vue 的原型对象上
Vue.prototype.$http = axios

import VueQuillEditor from 'vue-quill-editor'

// require styles
// 引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)

// 应用 element-ui
Vue.use(ElementUI)
// 应用 router
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store,
    router
}).$mount('#app')
