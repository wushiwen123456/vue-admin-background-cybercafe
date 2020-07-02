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
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="当前网吧剩余时长：">
        <span>{{ form.duration }}天</span>
      </el-form-item>
      <el-form-item label="剩余网吧数量：">
        <span>{{ total }}家</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unbound } from '@/api/table'

export default {
  name: 'Unbound',
  data() {
    return {
      form: {
        duration: '',
      },
      title: '温馨提示',
      dialogFormVisible: false,
      total: '',
    }
  },
  methods: {
    showEdit(row, total) {
      console.log(row, total)
      this.form = Object.assign({}, row)
      this.total = total
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    save() {
      const data = {
        id: this.form.id,
      }
      unbound(data).then((res) => {
        if (res.code == 200) {
          this.$baseMessage(res.msg, 'success')
          this.dialogFormVisible = false
          this.$emit('fetchData')
        } else {
          this.$baseMessage(res.msg, 'error')
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.title-content {
  font-size: 16px;
  text-align: center;
  margin-bottom: 21px;
  color: $base-content-color;
  i {
    color: #e6a23c;
  }
  .el-dialog {
    color: $base-content-color !important;
  }
}
</style>
