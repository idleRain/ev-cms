import Vue from 'vue'
import App from './App.vue'
// 引入 vux的js文件
import store from '@/store'

// 引入 VueRouter 插件
import VueRouter from "vue-router";
// 引入 Router
import router from "@/router";

// 引入全局样式
import "@/assets/global.less"

// 完整引入 element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入 axios
import axios from "axios";
// 配置 axios 请求根路径
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
// 将 axios 挂载到 Vue 的原型对象上
Vue.prototype.$http = axios

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
