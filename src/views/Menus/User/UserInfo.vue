<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form :model="userForm"
             :rules="userFormRules"
             ref="userFormRef"
             label-width="100px">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="update">提交修改</el-button>
        <!-- this.$refs[formName].resetFields()  对整个表单进行重置，将所有字段值重置为初始值并移除校验结果-->
        <el-button @click="$refs['userFormRef'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      // 基于浅拷贝，把 Vuex 中的用户信息对象复制一份，交给 userForm
      // userForm: Object.assign({}, this.$store.state.userInfo),
      userForm: {
        username: '',
        nickname: '',
        email: ''
      },
      // 表单的验证规则对象
      userFormRules: {
        nickname: [
          {required: true, message: '请输入用户昵称', trigger: 'blur'},
          {pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    // 初始化 userForm
    // this.userForm = this.$store.state.users.userinfo     // 不推荐，因为这样会直接修改 vuex.state 中的值
    // 基于浅拷贝，把 Vuex 中的用户信息对象复制一份，交给 userForm
    this.userForm = Object.assign({}, this.$store.state.users.userinfo)
  },
  methods: {
    update() {
      // 提交前兜底校验
      this.$refs['userFormRef'].validate((valid) => {
        if (!valid) return this.$message.warning('输入有误！请检查无误后提交')
        // 无误后提交数据
        this.$http.put('/my/userinfo', this.userForm).then(response => {
          this.$message.success(response.data.message)
          // 更新 vuex 中的 userinfo
          this.$store.dispatch('users/getUserinfo')
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>