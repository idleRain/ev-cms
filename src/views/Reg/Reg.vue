<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单-->
      <!-- 表单校验需检查 :model :rules prop 这三个属性的配置-->
      <el-form :model="regForm" status-icon :rules="regRules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input type="text"
                    placeholder="请输入用户名"
                    prefix-icon="el-icon-user"
                    v-model="regForm.username"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-lock"
                    v-model="regForm.password"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="truePassword">
          <el-input type="password"
                    placeholder="请确认密码"
                    prefix-icon="el-icon-lock"
                    v-model="regForm.truePassword"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="register">注册</el-button>
          <el-link type="info" class="toLogin" @click="toLogin">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Reg',
  data() {
    const checkPwd = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      regForm: {
        username: '',
        password: '',
        truePassword: ''
      },
      // 表单验证规则
      regRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {pattern: /^[A-Za-z][0-9a-zA-Z]{1,9}$/, message: '必须是以字母开头的 2 到 10 位字母或数字', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: /^\S{6,15}$/, message: '必须是 6 到 15 位非空字符', trigger: 'blur'}
        ],
        truePassword: [
          {required: true, message: '请输入确认密码', trigger: 'blur'},
          {pattern: /^\S{6,15}$/, message: '必须是 6 到 15 位非空字符', trigger: 'blur'},
          {validator: checkPwd, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    register() {
      // 点击提交后发送请求
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return console.log('没输入')
        this.$http.post('/api/reg', {
          username: this.regForm.username,
          password: this.regForm.password,
          repassword: this.regForm.truePassword
        }).then(
            response => {
              if (response.data.code === 0) {   // 注册成功
                this.$message.success(response.data.message)
                // 跳转到登录页
                this.$router.push('/login')
              } else {                          // 注册失败
                return this.$message.error(response.data.message)
              }
            }
        )
      })
    },
    toLogin(){
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    padding: 0 30px;
    box-sizing: border-box;
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
    .toLogin{
      font-size: 12px;
    }
  }
}
</style>
