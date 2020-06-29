<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="close"
  >
    <p class="title-content">
      <i class="el-icon-warning-outline"></i>
      确定要解除绑定么
    </p>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="剩余网吧个数：" prop="title">
        <!-- <el-input v-model.trim="form.title" autocomplete="off"></el-input> -->
        <span>{{ form.title }}</span>
      </el-form-item>
      <el-form-item label="剩余网吧时间：" prop="author">
        <!-- <el-input v-model.trim="form.author" autocomplete="off"></el-input> -->
        <span>{{ form.author }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit } from '@/api/table'

export default {
  name: 'Unbound',
  data() {
    return {
      form: {
        title: '',
        author: '',
      },
      title: '',
      dialogFormVisible: false,
    }
  },
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '温馨提示'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.dialogFormVisible = true
    },
    close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.dialogFormVisible = false
    },
    save() {
      //   this.$refs['form'].validate((valid) => {
      //     console.log(valid)
      //     if (valid) {
      //       // doEdit(this.form).then((res) => {
      //       //   this.$baseMessage(res.msg, 'success')
      //       //   this.$refs['form'].resetFields()
      //       //   this.dialogFormVisible = false
      //       //   this.$emit('fetchData')
      //       //   this.form = this.$options.data().form
      //       // })
      //     } else {
      //       return false
      //     }
      //   })
      // },
      this.$baseMessage('解除绑定成功', 'success')
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
      this.form = this.$options.data().form
    },
  },
}
</script>
<style lang="scss" scoped>
.title-content {
  font-size: 16px;
  text-align: center;
  margin-bottom: 21px;
  i {
    color: #e6a23c;
  }
}
</style>
