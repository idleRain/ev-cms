// axios 挂载到 Vue 实例上 , 但 vuex 跟 Vue 实例没有关系 , 所以需要重新引入
import axios from "axios";

export default {
    // 开启命名空间
    namespaced: true,
    state: () => ({
        token: '',
        userinfo:{}
    }),
    mutations: {
        // 将 token 存放到 Vuex
        updateToken(state, token) {
            state.token = token
        },
        // 将 用户数据存放到 Vuex
        updateUserinfo(state, userinfo) {
            state.userinfo = userinfo
        }
    },
    // 异步或需处理的任务放在 actions 里面
    actions: {
        // content : 上下文对象 ( 小store )
        getUserinfo(content) {
            axios.get('/my/userinfo').then(({data: res}) => {
                // 如果没有获取到则终止运行
                if (res.code !== 0) return
                // 数据提交给 mutations 下的 updateUserinfo
                content.commit('updateUserinfo',res.data)
            })
        }
    },
    getters: {}
}