<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="screen" ref="screenForm">
          <el-form-item prop="cate_id" label="文章分类">
            <el-select v-model="screen.cate_id" placeholder="请选择分类" size="small">
              <el-option
                  v-for="item in Lists"
                  :key="item.id"
                  :label="item.cate_name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="state" label="发布状态" style="margin-left: 15px;">
            <el-select v-model="screen.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="screenHandler">筛选</el-button>
            <el-button type="info" size="small" @click="resetHandler">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
            @click="pubVisible = true"
            type="primary"
            size="small"
            class="btn-pub">
          发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%;" stripe>
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="{row:{pub_date}}">
            {{ formatDate(pub_date) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <el-button size="mini" type="danger">删除</el-button>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[2,5,10]"
          :page-size="q.pagesize"
          :current-page="q.pagenum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!--    文章发布 dialog    -->
    <el-dialog
        title="提示"
        :visible.sync="pubVisible"
        width="30%"
        :before-close="handleClose"
        fullscreen>
      <el-form :model="pubForm" :rules="pubRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="文章名称" prop="title">
          <el-input v-model="pubForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择文章分类">
            <el-option
                v-for="item in Lists"
                :label="item.cate_name"
                :value="item.id" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 富文本编辑器 -->
          <quill-editor
              v-if="pubVisible"
              v-model="pubForm.content"
              @change="$refs.ruleForm.validateField('content')">
          </quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <img :src="cover" class="cover_img" alt="">
          <p>
            <el-button type="text" @click="selectFile">+ 选择图片</el-button>
          </p>
          <input
              v-if="pubVisible"
              type="file"
              @change="coverChange($event)"
              single
              accept="image/*"
              style="display: none"
              ref="file">
        </el-form-item>
        <!--        提交-->
        <el-form-item prop="state">
          <el-button @click="pubArt('已发布')" type="primary">发布</el-button>
          <el-button @click="pubArt('草稿')" type="info">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import cover from '@/assets/images/cover.jpg'

export default {
  name: 'ArtList',
  data() {
    return {
      // 预览图片
      cover,
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 筛选参数
      screen: {
        cate_id: '',
        state: ''
      },
      // 文章总数
      total: 0,
      // 表单双向绑定的数据
      pubForm: {
        title: '',
        cate_id: '',
        content: '',
        cover_img: '',
        state: ''
      },
      // 分类列表
      Lists: [],
      // 页面文章信息列表
      artList: [],
      // 表单校验
      pubRules: {
        title: [
          {required: true, message: '请输入文章名称', trigger: 'blur'},
          {min: 1, max: 30, message: '请输入 1 ~ 30 个字符', trigger: 'blur'}
        ],
        cate_id: [
          {required: true, message: '请选择分类', trigger: 'change'}
        ],
        content: [
          {required: true, message: '请输入文章内容', trigger: 'change'}
        ],
        cover_img: [
          {required: true, message: '文章封面不饿为空', trigger: 'change'}
        ],
      },
      // 决定 dialog 是否打开
      pubVisible: false
    }
  },
  methods: {
    // dialog 关闭函数
    handleClose(done) {
      this.$confirm('此操作将导致文章信息丢失, 是否继续？', '提醒', {type: 'warning'})
          .then(() => {
            done()
            // 重置表单
            this.$refs.ruleForm.resetFields()
            this.cover = cover
          }).catch(() => {
      })
    },
    // 获取分类列表
    getCateList() {
      this.$http.get('/my/cate/list').then(response => {
        this.Lists = response.data.data
      })
    },
    selectFile() {
      this.$refs.file.click()
    },
    // 更新封面
    coverChange(e) {
      const file = e.target.files[0]
      // 判断是否选择了图片
      if (file) {
        this.pubForm.cover_img = file
        /**  img 标签的 src 只能设置 url 或者 base64  **/

        // 方案一 ： 使用 FileReader 转成 base64
        /*const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', e => {
          this.cover = e.target.result
        })*/

        // 方案二 ： 使用 URL.createObjectURL() 转成 url
        this.cover = URL.createObjectURL(file)
      } else {
        this.pubForm.cover_img = ''
        this.cover = cover
      }
      // 图片发生改变后重新校验
      this.$refs.ruleForm.validateField('cover_img')
    },
    // 发布或存为草稿
    pubArt(state) {
      this.pubForm.state = state
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        // 将数据转成 formData 传给后端
        const fd = new FormData()
        // for in 遍历对象 , 将对象的所有属性加给 formData
        /*for (const k in this.pubForm) {
          fd.append(k, this.pubForm[k])
        }*/
        Object.keys(this.pubForm).forEach(k => fd.append(k, this.pubForm[k]))
        // 发送请求
        const {data: res} = await this.$http.post('/my/article/add', fd)
        // console.log(res)
        if (res.code !== 0) return this.$message.error(res.message)
        if (state === '已发布') {
          this.$message.success(res.message)
        } else if (state === '草稿') {
          this.$message.info('已存为草稿')
        }
        // 关闭并重置表单
        this.pubVisible = false
        this.$refs.ruleForm.resetFields()
        this.cover = cover
        // 重新获取列表
        await this.getArtList()
      })
    },
    // 获取分页列表信息
    async getArtList() {
      const {data: res} = await this.$http.get('/my/article/list', {params: this.q})
      this.artList = res.data
      this.total = res.total
    },
    // 格式化列表显示时间
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 绑定分页大小
    handleSizeChange(val) {
      // console.log(`handleSizeChange每页 ${val} 条`)
      // 修改当前分页大小并重新获取分页列表信息
      this.q.pagesize = val
      this.getArtList()
    },
    // 绑定当前分页
    handleCurrentChange(val) {
      // console.log(`handleCurrentChange当前页: ${val}`)
      // 修改当前分页并重新获取分页列表信息
      this.q.pagenum = val
      this.getArtList()
    },
    // 筛选列表
    screenHandler() {
      // 将要筛选的 screen 数据 遍历给 q 查询参数
      for (let key in this.screen) {
        this.q[key] = this.screen[key]
      }
      // 将当前分页设置成 第一页
      this.q.pagenum = 1
      // 重新获取分页列表信息
      this.getArtList()
    },
    // 重置列表
    resetHandler(){
      // 重置筛选状态
      this.$refs.screenForm.resetFields()
      // 重置查询参数
      this.q = {pagenum: 1, pagesize: 2, cate_id: '', state: ''}
      // 重新获取分页列表信息
      this.getArtList()
    }
  },
  created() {
    this.getCateList()
    this.getArtList()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .btn-pub {
    margin-top: 5px;
  }
}

.el-select {
  width: 100%;
}

// /deep/ 深度选择器
/deep/ .ql-container {
  height: 300px;
}

.cover_img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

.el-pagination {
  margin-top: 15px;
}
</style>