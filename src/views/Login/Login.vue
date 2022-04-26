<template>
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单-->
      <!-- 表单校验需检查 :model :rules prop 这三个属性的配置-->
      <el-form :model="loginForm" status-icon :rules="loginRules" ref="ruleForm">
        <el-form-item prop="username">
          <el-input type="text"
                    placeholder="请输入用户名"
                    prefix-icon="el-icon-user"
                    v-model="loginForm.username"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-lock"
                    v-model="loginForm.password"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
          <el-link type="info" class="toRegister" @click="toRegister">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {pattern: /^[A-Za-z][0-9a-zA-Z]{1,9}$/, message: '必须是以字母开头的 2 到 10 位字母或数字', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: /^\S{6,15}$/, message: '必须是 6 到 15 位非空字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return console.log('没输入')
        this.$http.post('/api/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        }).then(({data: res}) => {
          if (res.code === 0) {
            this.$message.success(res.message)
            // localStorage.setItem('token',JSON.stringify(res.token))
            // 调用 users.js 下的 updateToken
            this.$store.commit('users/updateToken', res.token)
            // 登陆成功跳转主页
            this.$router.push('/')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    toRegister() {
      this.$router.push('/reg')
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
    height: 270px;
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

    .toRegister {
      font-size: 12px;
    }
  }
}
</style>