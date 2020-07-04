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
    }
  },
  methods: {
    handleEdit() {},
    handleDelete() {},
    handleAdd() {},
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
</style>
