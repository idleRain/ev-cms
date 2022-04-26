import Vue from "vue"
import Vuex from "vuex"

import users from './users'

// npm i --save vuex-persistedstate@3 安装 vuex-persistedstate 的包
// 引入 vuex 持续化状态的包
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    // 安装插件
    plugins:[createPersistedState()],
    actions: {},
    mutations: {},
    state: {},
    modules:{
        users
    }
})