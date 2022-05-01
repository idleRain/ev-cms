<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <!-- <img class="avatar" v-if="avatar" @click="choiceImage" :src="avatar" alt=""/>-->
      <!-- <img class="avatar" v-else @click="choiceImage" src="@/assets/images/avatar.jpg" alt=""/>-->
      <img class="avatar" @click="choiceImage" :src="avatar" alt=""/>

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" @change="changeImg($event)" ref="ipt" style="display: none" accept="image/*">
        <el-button @click="choiceImage" type="primary" icon="el-icon-plus">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" @click="upload" :disabled="isAvatar">上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import defaultImg from '@/assets/images/avatar.jpg'

export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: defaultImg,
      isAvatar: true
    }
  },
  methods: {
    choiceImage() {
      this.$refs.ipt.click()
    },
    changeImg(e) {
      const files = e.target.files
      if (files.length > 0) {
        // 1.创建文件读取器对象
        const reader = new FileReader()
        // 2.读取文件
        reader.readAsDataURL(files[0])
        // 3.获取读取的结果
        reader.addEventListener('load', (e) => {
          // console.log(e.target.result)
          // 将结果赋值给 avatar
          this.avatar = e.target.result
          this.isAvatar = false
        })
      } else {
        this.avatar = defaultImg
        this.isAvatar = true
      }
    },
    // 提交头像
    upload() {
      this.$http.patch('/my/update/avatar', {
        avatar: this.avatar
      }).then(response => {
        if (response.data.code !== 0) return this.$message.error(response.data.message)
        // 更新用户信息
        this.$store.dispatch('users/getUserinfo')
        this.$message.success(response.data.message)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}

.avatar {
  width: 350px;
  height: 350px;
}

.preview {
  object-fit: cover;
}
</style>