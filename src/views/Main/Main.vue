<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt=""/>
      <!-- 右侧的菜单 -->
      <el-menu
          class="el-menu-top"
          mode="horizontal"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img v-if="userinfo.user_pic" :src="userinfo.user_pic" alt="" class="avatar"/>
            <img v-else src="@/assets/logo.png" alt="" class="avatar"/>
            <span>个人中心</span>
          </template>
          <el-menu-item @click="$router.push('user-info')"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item @click="$router.push('user-avatar')"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item @click="$router.push('user-pwd')"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logout"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!--        侧边栏用户名头像展示-->
        <div class="user-box">
          <!-- webpack 打包注意事项 ：如果路径里面是表达式或变量 ，webpack 不会进行打包 -->
          <!-- <img :src="userinfo.user_pic || '@/assets/logo.png'" alt=""> -->
          <img v-if="userinfo.user_pic" :src="userinfo.user_pic" alt="">
          <img v-else src="@/assets/logo.png" alt="">
          <span>欢迎 {{ userinfo.nickname || userinfo.username }}</span>
        </div>
        <!-- 左侧菜单栏 -->
        <!-- router : 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#23262e"
            text-color="#fff"
            active-text-color="#409eff"
            router
        >
          <template v-for="item in menu">
            <!-- 如果有没有子菜单渲染 首页 组件 -->
            <el-menu-item
                v-if="!item.children"
                :key="item.indexPath"
                :index="item.indexPath">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- 如果有子菜单则渲染 列表 组件 -->
            <el-submenu v-else :key="item.indexPath" :index="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                  :index="child.indexPath"
                  v-for="child in item.children"
                  :key="child.indexPath">
                <i :class="child.icon"></i>
                {{ child.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 牛马程序员 · 小丁</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Main',
  data() {
    return {
      // 准备数组装菜单栏数据
      menu: []
    }
  },
  methods: {
    // 退出功能
    logout() {
      this.$confirm('嘤嘤嘤，确定要退出登陆吗？ ꒰*´◒`*꒱ ', '退出登录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '呜呜呜，退出登录成功!  ｡°(°¯᷄◠¯᷅°)°｡'
        })
        // 清空 token
        this.$store.commit('users/updateToken')
        // 退出登录成功跳转至登录页
        this.$router.replace('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出登录 ₍ᐢ⸝⸝› ̫ ‹⸝⸝ᐢ₎ '
        })
      })
    }
  },
  // 页面加载时获取用户信息 , 需携带请求头并且存放到 Vuex 中 , 所以在 vuex 中发送请求
  created() {
    // 发送请求 ，获取菜单列表
    this.$http.get('/my/menus').then(({data: res}) => {
      if (res.code !== 0) return
      this.menu = res.data
    })
    // 获取 Vuex 里面的用户信息
    this.$store.dispatch('users/getUserinfo')
  },
  computed: {
    ...mapState('users', ['userinfo', 'token'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;

  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-aside {
    .user-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70px;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;

      img {
        margin-right: 15px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: #fff;
      }

      span {
        color: #fff;
        font-size: 12px;
      }
    }
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

.el-menu-vertical-demo {
  width: 200px;

  span,
  .el-menu-item {
    font-size: 12px;
  }
}
</style>
