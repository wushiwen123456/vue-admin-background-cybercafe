<template>
  <div>
    <el-button
      icon="el-icon-plus"
      class="add-button"
      type="primary"
      @click="handleAdd"
      >添加</el-button
    >
    <el-table
      ref="tableList"
      fit
      :data="list"
      class="el-table"
      :header-cell-style="{ background: '#1e1e2d' }"
    >
      <el-table-column label="ID" prop="id" min-width="50"></el-table-column>
      <el-table-column
        label="类型"
        prop="RuleType"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="进程特征"
        prop="ProcessInfo"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="调试动作"
        prop="Options"
        min-width="350"
      ></el-table-column>
      <el-table-column
        label="备注"
        prop="Remark"
        min-width="150"
      ></el-table-column>
      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-folder-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      append-to-body
      :title="title"
      :visible.sync="dialogFormVisible"
      width="1000px"
      @close="close"
    >
      <el-form :model="form" :rules="rules" label-width="120">
        <el-form-item label="进程特征：">
          <el-select
            v-model="form.ProcessInfoType"
            placeholder="进程类型"
            class="couise-list"
          >
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="form.ProcessInfo"
            class="process-info"
            placeholder="支持通配符*和?(文件摘要和特征除外)"
          ></el-input>
        </el-form-item>
        <el-form-item label="生效系统：">
          <el-checkbox-group v-model="form.system">
            <el-checkbox
              v-for="item in OSList"
              :key="item.id"
              name="system"
              :label="item.name"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="调试动作：">
          <el-checkbox-group
            v-model="form.debugActionSelected"
            @change="handleCheckedDebugChange"
          >
            <el-checkbox
              v-for="item in debugAction"
              :key="item.id"
              name="debugActionList"
              :label="item.name"
            />
          </el-checkbox-group>
          <!-- <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          > -->
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="form.mark"
            class="mark"
            placeholder="备注信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用规则：">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RuleContent',
  props: {
    typeId: {
      type: Number,
      default() {
        return 0
      },
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      list: [
        {
          id: 1,
          RuleType: 1,
          Enabled: true,
          OsVersion: 3,
          ProcessInfoType: 0,
          Remark: '',
          ProcessInfo: '1.exe',
          Options: 3,
        },
      ],
      form: {
        ProcessInfoType: 0,
        ProcessInfo: '', //进程特征信息
        system: [],
        debugActionSelected: [],
        mark: '',
        status: '',
      },
      rules: {},
      title: '添加进程',
      // 进程特征列表
      courseList: [
        {
          id: 0,
          name: '进程名称',
        },
        {
          id: 1,
          name: '进程路径',
        },
        {
          id: 2,
          name: '进程MD5',
        },
        {
          id: 3,
          name: '文件摘要',
        },
      ],
      // 系统列表
      OSList: [
        {
          id: 1,
          name: 'Win7',
        },
        {
          id: 2,
          name: 'Win10',
        },
      ],
      // 调试动作列表
      debugAction: [
        {
          id: 0,
          name: '进程',
          value: 1,
        },
        {
          id: 1,
          name: '模块',
          value: 2,
        },
        {
          id: 2,
          name: '注册表',
          value: 4,
        },
        {
          id: 3,
          name: '网络',
          value: 8,
        },
        {
          id: 4,
          name: '窗口',
          value: 16,
        },
        {
          id: 5,
          name: '文件',
          value: 32,
        },
        {
          id: 6,
          name: '保护',
          value: 64,
        },
        {
          id: 7,
          name: '注入',
          value: 128,
        },
        {
          id: 8,
          name: '域名',
          value: 256,
        },
      ],
      checkAll: false,
      isIndeterminate: true,
    }
  },
  methods: {
    handleEdit() {},
    handleDelete() {},
    handleAdd() {
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    // 全选
    handleCheckAllChange(val) {
      console.log(val)
      this.form.debugActionSelected = val ? this.debugAction : []
      this.isIndeterminate = false
    },
    // 选中debug列表中的某个
    handleCheckedDebugChange(value) {
      console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.debugAction.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.debugAction.length
    },
    // 保存
    save() {},
  },
}
</script>
<style lang="scss" scoped>
.el-button {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
}
.add-button {
  margin: 15px 0;
  background: $base-color-default;
}
.couise-list {
  width: 120px;
  margin-right: 25px;
}
.process-info {
  width: 260px;
}
.mark {
  width: 380px;
}
</style>
