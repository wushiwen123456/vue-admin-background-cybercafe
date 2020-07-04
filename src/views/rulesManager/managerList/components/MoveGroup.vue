<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="600px"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="135px">
      <el-form-item label="选择移动到的分组">
        <el-select v-model="form.grouping_id" placeholder="请选择">
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { rulesGroupList, moveRulesToGroup } from '@/api/table'
export default {
  data() {
    return {
      form: {
        grouping_id: '',
      },
      groupOptions: [],
      dialogFormVisible: false,
      title: '移动分组',
      dataOptions: [],
    }
  },
  methods: {
    showEdit(rows) {
      this.dataOptions = rows
      this.dialogFormVisible = true
      this.getgroupOptions()
    },
    getgroupOptions() {
      rulesGroupList().then((res) => {
        this.groupOptions = res.data
      })
    },
    save() {
      const data = {
        id: this.dataOptions.map((item) => item.id).join(','),
        grouping_id: this.form.grouping_id,
      }
      moveRulesToGroup(data).then((res) => {
        if (res.code == 200) {
          this.$baseMessage(res.msg, 'success')
          this.grouping_id = ''
          this.dataOptions = []
          this.dialogFormVisible = false
          this.$emit('fetchData')
        } else {
          this.$baseMessage(res.msg, 'error')
        }
      })
    },
    close() {
      this.dialogFormVisible = false
    },
  },
}
</script>

<style></style>
