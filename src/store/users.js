export default {
    // 开启命名空间
    namespaced:true,
    state: () => ({
        token:''
    }),
    mutations:{
        updateToken(state,token){
            state.token = token
        }
    },
    actions:{},
    getters:{}
}