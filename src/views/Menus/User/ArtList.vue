<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
            @click="pubVisible =
            true" type="primary"
            size="small"
            class="btn-pub">
          发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
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
          <quill-editor @blur="$refs.ruleForm.validateField('content')" v-model="pubForm.content"></quill-editor>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ArtList',
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 表单双向绑定的数据
      pubForm: {
        title: '',
        cate_id: '',
        content: ''
      },
      // 分类列表
      Lists: [],
      // 表单校验
      pubRules: {
        title: [
          {required: true, message: '请输入文章名称', trigger: 'blur'},
          {min: 1, max: 30, message: '请输入 1 ~ 30 个字符', trigger: 'blur'}
        ],
        cate_id: [
          {required: true, message: '请选择分类', trigger: 'blur'}
        ],
        content:[
          {required: true, message: '请输入文章内容', trigger: 'blur'}
        ]
      },
      pubVisible: false
    }
  },
  methods: {
    // dialog 关闭函数
    handleClose(done) {
      this.$confirm('此操作将导致文章信息丢失, 是否继续？', '提醒', {type: 'warning'})
          .then(() => {
            done()
          }).catch(() => {
      })
    },
    // 获取分类列表
    getCateList() {
      this.$http.get('/my/cate/list').then(response => {
        this.Lists = response.data.data
      })
    }
  },
  created() {
    this.getCateList()
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
.ql-container {
  height: 300px;
}
</style>
