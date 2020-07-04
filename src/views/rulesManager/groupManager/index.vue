<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
          >添加分组
        </el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="refresh">
          刷新
        </el-button>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      fit
      :data="list"
      :element-loading-text="elementLoadingText"
      height="650"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column
        type="selection"
        min-width="55"
        :selectable="selectable"
      />
      <el-table-column label="ID" min-width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="分组名称" min-width="150">
        <template slot-scope="scope">
          <span :title="scope.row.name" class="text-cut">
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="规则数量" min-width="50" prop="rule_num" />
      <el-table-column label="操作" min-width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            class="left-btn"
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

    <!-- <el-pagination
      :background="background"
      :current-page="queryForm.page"
      :layout="layout"
      :page-size="queryForm.limit"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination> -->

    <el-dialog
      :title="dialogTitle"
      :rules="rules"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="dialogFormVisible = false"
    >
      <el-form ref="groupForm" :model="form" label-width="120px">
        <el-form-item label="分组名称" prop="name">
          <el-input
            v-model.trim="form.name"
            autocomplete="off"
            placeholder="请输入唯一的名字"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  rulesGroupList,
  ruleGroupListAdd,
  ruleGroupListEdit,
  ruleGroupListRemove,
} from '@/api/table'
export default {
  name: 'RuleManager',
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(this.$baseMessage('名称不能为空', 'success'))
      }
    }
    return {
      imgShow: true,
      list: [],
      imageList: [],
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        page: 1,
        limit: 20,
        title: '',
        groupId: '',
      },
      form: {
        name: '',
        id: '',
      },
      groupList: [],
      dialogFormVisible: false,
      dialogTitle: '',
      rules: {
        name: [{ validator: checkName, trigger: 'blur' }],
      },
    }
  },
  computed: {
    getGroupName() {
      return (id) => {
        return (
          (this.groupList.find((item) => item.id) &&
            this.groupList.find((item) => item.id).name) ||
          ''
        )
      }
    },
  },
  created() {
    this.fetchData()
  },

  beforeDestroy() {},
  mounted() {},
  methods: {
    // 判断是否默认
    selectable(row) {
      return row.is_default != 0
    },
    // 刷新按钮
    refresh() {
      this.queryForm = {
        page: 1,
        limit: 20,
        title: '',
      }
      this.fetchData()
    },
    tableSortChange() {
      const imageList = []
      this.$refs.tableSort.tableData.forEach((item, index) => {
        imageList.push(item.img)
      })
      this.imageList = imageList
    },
    setSelectRows(val) {
      this.selectRows = val
    },
    // 编辑
    handleEdit(row) {
      // if (row.id) {
      //   // 添加
      //   this.form.name = ''
      //   this.dialogTitle = '添加规则分组'
      //   this.dialogFormVisible = true
      // } else {

      // }
      if (row.is_default == 0) {
        return this.$baseMessage('默认分组无法编辑', 'warning')
      }
      this.dialogTitle = '编辑规则分组'
      this.form = {
        name: row.name,
        id: row.id,
      }
      this.dialogFormVisible = true
    },
    // 添加
    handleAdd() {
      this.dialogTitle = '添加规则分组'
      this.form = {}
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      if (row.is_default == 0) {
        return this.$baseMessage('默认分组无法删除', 'warning')
      }
      let id = row.id
      this.$baseConfirm('确定删除该分组么', null, () => {
        ruleGroupListRemove({ id }).then((res) => {
          if (res.code == 200) {
            this.$baseMessage(res.msg, 'success')
            const index = this.list.findIndex((item) => item.id == id)
            this.list.splice(index, 1)
          }
        })
      })
    },
    // 保存编辑
    save() {
      const form = this.form
      if (form.name == '') {
        return this.$baseMessage('分组名不能为空', 'error')
      }
      if (form.id) {
        // 执行编辑操作
        ruleGroupListEdit(form).then((res) => {
          if (res.code == 200) {
            this.$baseMessage(res.msg, 'success')
            this.dialogFormVisible = false
            this.fetchData()
          }
        })
      } else {
        // 执行添加操作
        ruleGroupListAdd(form).then((res) => {
          if (res.code == 200) {
            this.$baseMessage(res.msg, 'success')
            this.dialogFormVisible = false
            this.fetchData()
          }
        })
      }
    },
    handleSizeChange(val) {
      this.queryForm.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.page = val
      this.fetchData()
    },
    handleQuery() {
      this.queryForm.page = 1
      this.fetchData()
    },
    // 获取分组列表
    fetchData() {
      this.listLoading = true
      rulesGroupList().then((res) => {
        this.list = res.data
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    testALert() {
      this.$baseAlert('11')
      this.$baseAlert('11', '自定义标题', () => {
        /* 可以写回调; */
      })
      this.$baseAlert('11', null, () => {
        /* 可以写回调; */
      })
    },
    testConfirm() {
      this.$baseConfirm(
        '你确定要执行该操作?',
        null,
        () => {
          /* 可以写回调; */
        },
        () => {
          /* 可以写回调; */
        }
      )
    },
    testNotify() {
      this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
    },
  },
}
</script>
<style lang="scss" scoped>
.table-container {
  background: $base-content-content !important;
  color: $base-content-color;
  padding-top: 15px;
}
.el-button {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
}
.el-select {
  margin-right: 15px;
}
.el-tag {
  background-color: transparent;
}
.left-btn {
  margin-right: 15px;
}
</style>
