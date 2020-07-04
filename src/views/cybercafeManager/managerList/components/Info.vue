<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <div class="info-container">
      <p>每个网吧都有自己所在的分组</p>
      <p>
        每个分组都有自己的默认规则，可以在分组管理中查看编辑不同分组的规则
      </p>
      <p>
        如果想针对单个网吧或者多个网吧进行自定义规则编辑，可以点击网吧列表中的--分配规则--按钮进行自定义规则匹配
      </p>
      <p>
        单个或多个网吧进行--移动分组--操作时，可以选择"一键同步"或者"一键追加"操作替换或者追加当前规则
      </p>
      <p>"一键同步"会丢失当前所有规则，自动替换为目标分组下的所有规则</p>
      <p>
        "一键追加"会保留当前所有规则，在当前规则基础上添加目标分组下的所有规则
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
      title: '网吧规则介绍说明',
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
