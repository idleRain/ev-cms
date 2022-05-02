<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button @click="addVisible = true" type="primary" size="mini">添加分类</el-button>
        <!--        添加文章分类-->
        <el-dialog
            title="添加文章分类"
            :visible.sync="addVisible"
            width="35%"
            @closed="close()">
          <el-form :model="addForm"
                   :rules="addRules"
                   ref="ruleForm"
                   label-width="80px"
                   class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cate_name">
              <el-input v-model="addForm.cate_name"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="cate_alias">
              <el-input v-model="addForm.cate_alias"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="addition">确 定</el-button>
          </span>
        </el-dialog>
        <!--        编辑文章分类-->
        <el-dialog
            title="编辑文章分类"
            :visible.sync="editVisible"
            width="35%"
            @closed="$refs.editForm.resetFields()">
          <el-form :model="editForm"
                   :rules="addRules"
                   ref="editForm"
                   label-width="80px"
                   class="demo-ruleForm">
            <el-form-item label="分类名称" prop="cate_name">
              <el-input v-model="editForm.cate_name"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="cate_alias">
              <el-input v-model="editForm.cate_alias"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="edit">修 改</el-button>
          </span>
        </el-dialog>
      </div>
      <el-table
          :data="cateList"
          border
          style="width: 100%">
        <el-table-column width="50" type="index" label="序号"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分内别名"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" @click="openEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="del(scope.row.id)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  data() {
    return {
      // 分类列表数据
      cateList: [],
      // 控制 dialog 窗口是否关闭
      addVisible: false,
      editVisible: false,
      // 添加分类输入的双向绑定数据
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      editForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 表单验证
      addRules: {
        cate_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ],
        cate_alias: [
          {required: true, message: '请输入分类别名', trigger: 'blur'},
          {pattern: /^([a-z]|[A-Z]|[0-9]){1,15}$/, message: '必须是 1 ~ 15 位的数字和字母', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    // 组件创建时获取分类列表数据
    this.getCateList()
  },
  methods: {
    // 获取文章分类列表
    getCateList() {
      this.$http.get('/my/cate/list').then(response => {
        // console.log(response)
        this.cateList = response.data.data
      })
    },
    // dialog 窗口关闭前清空输入
    close() {
      this.$refs.ruleForm.resetFields()
    },
    // 添加分类
    addition() {
      this.$refs.ruleForm.validate(async valid => {
        // 如果叫校验失败 ，停止运行
        if (!valid) return
        // 发送请求
        const {data: res} = await this.$http.post('/my/cate/add', this.addForm)
        // 添加失败提醒
        if (res.code !== 0) return this.$message.error(res.message)
        // 关闭 dialog 窗口
        this.addVisible = false
        // 重新获取分类列表
        this.getCateList()
      })
    },
    // 打开编辑 dialog 框
    openEdit(row) {
      if (row.id === 1 || row.id === 2) return this.$message.warning('管理员不允许修改此默认分类！呜呜呜~')
      // this.editForm.cate_name = row.cate_name
      // this.editForm.cate_alias = row.cate_alias
      // 使用浅拷贝将 row 的数据传给 editForm
      this.editForm = {...row}
      this.editVisible = true
    },
    // 编辑分类列表
    edit() {
      this.$refs.editForm.validate(async valid => {
        // 如果叫校验失败 ，停止运行
        if (!valid) return
        // 发送请求
        const {data: res} = await this.$http.put('/my/cate/info', this.editForm)
        // 添加失败提醒
        if (res.code !== 0) return this.$message.error(res.message)
        // 关闭 dialog 窗口
        this.editVisible = false
        // 重新获取分类列表
        this.getCateList()
      })
    },
    // 删除分类
    del(id) {
      if (id === 1 || id === 2) return this.$message.warning('管理员不允许删除此默认分类！呜呜呜~')
      this.$confirm('确认删除吗?', '确认删除', {type: 'warning'}).then(async () => {
        // 用户点了确定
        const {data:res} = await this.$http.delete('/my/cate/del',{
          params:{id}
        })
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 重新获取列表信息
        this.getCateList()
      }).catch(() => {
        // 用户点了取消
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
