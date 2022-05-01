<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdFormRef" label-width="100px">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm" type="primary">修改密码</el-button>
        <el-button @click="resetPwd">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserPwd',
  data() {
    // 确认密码校验
    const checkPwd = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback()
      }
    }
    return {
      // 表单的数据对象
      pwdForm: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      // 表单的验证规则对象
      pwdFormRules: {
        old_pwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: /^\S{6,15}$/, message: '长度在 6 到 15 位', trigger: 'blur'}
        ],
        new_pwd: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {pattern: /^\S{6,15}$/, message: '长度在 6 到 15 位', trigger: 'blur'}
        ],
        re_pwd: [
          {required: true, message: '请再次输入新密码', trigger: 'blur'},
          {pattern: /^\S{6,15}$/, message: '长度在 6 到 15 位', trigger: 'blur'},
          {validator: checkPwd, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 兜底校验
    submitForm() {
      this.$refs.pwdFormRef.validate((valid) => {
        if (!valid) return
        // 校验成功后发送请求
        this.$http.patch('/my/updatepwd', this.pwdForm).then(response => {
          if (response.data.code !== 0) return this.$message.error('重置密码失败，请稍后重试…')
          this.$message.success(response.data.message)
          // 提交成功后重置表单
          this.resetPwd()
        })
      })
    },
    // 重置表单
    resetPwd() {
      this.$refs.pwdFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
