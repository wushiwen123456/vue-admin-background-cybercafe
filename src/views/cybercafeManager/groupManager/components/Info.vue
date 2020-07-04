<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <div class="info-container">
      <p>每个分组都有自己的预置规则</p>
      <p>
        分组下的所有网吧默认会使用当前分组的预置规则
      </p>
      <p>"一键同步"会丢失当前分组下的所有网吧规则，替换为当前分组的默认规则</p>
      <p>
        "一键追加"会保留当前分组下的所有网吧的规则，与分组的默认规则进行合并
      </p>
      <p>
        单个或多个分组进行--分配规则--操作时，默认会选择"一键追加"操作,可以手动进行"一键同步"
      </p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '分组规则介绍说明',
      dialogFormVisible: false,
    }
  },
  methods: {
    showEdit(row) {
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
  },
}
</script>
<style lang="scss" scoped>
.info-container {
  padding-left: 15px;
  color: #999;
}
.info-container p {
  line-height: 1.8;
}
.info-container p::before {
  content: '*';
  margin-right: 10px;
}
</style>
