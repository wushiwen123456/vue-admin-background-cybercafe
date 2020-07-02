<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-folder-add" type="primary" @click="addGroup"
          >添加分组
        </el-button>
        <!-- <el-button icon="el-icon-delete" type="danger" @click="handleDelete"
          >删除
        </el-button> -->
        <el-button
          type="primary"
          icon="el-icon-folder-opened"
          @click="testMessage"
          >分配规则</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-document-copy"
          @click="handleDelete"
          >删除分组</el-button
        >
        <!-- <el-button type="primary" @click="testConfirm">baseConfirm</el-button> -->
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
      </vab-query-form-left-panel>
      <!-- <vab-query-form-right-panel>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.title" placeholder="标题" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
              >查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel> -->
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
        width="55"
        :selectable="selectable"
      ></el-table-column>
      <el-table-column label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column
        label="分组名称"
        prop="name"
        min-width="150"
      ></el-table-column>
      <!-- <el-table-column label="网吧地址" prop="pageViews"> </el-table-column> -->
      <el-table-column
        label="网吧数量"
        prop="internerBarNum"
        min-width="95"
      ></el-table-column>
      <el-table-column
        label="规则数量"
        prop="groupingNum"
        min-width="95"
      ></el-table-column>
      <el-table-column label="添加时间" min-width="150">
        <template slot-scope="scope">
          {{ formatDate(scope.row.add_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280px" fixed="right" min-width="150">
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

          <el-button
            type="warning"
            size="mini"
            icon="el-icon-eleme"
            @click="handleDelete(scope.row)"
            >匹配规则</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="dialogFormVisible = false"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="分组名称">
          <el-input
            v-model="form.name"
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
import { getgroupOptions, delGroup, addGroup, editGroup } from '@/api/table'
import { formatDate } from '@/utils/formatDate'

export default {
  name: 'GroupManager',
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
    return {
      imgShow: true,
      list: [],
      imageList: [],
      listLoading: true,
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      dialogFormVisible: false,
      form: {
        name: '',
      },
      dialogTitle: '添加分组',
    }
  },
  computed: {
    formatDate() {
      return function (time) {
        return formatDate(new Date(time * 1000), 'yyyy-MM-dd')
      }
    },
  },
  created() {
    this.fetchData()
  },

  beforeDestroy() {},
  mounted() {},
  methods: {
    // 刷新按钮
    refresh() {
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
    handleDelete(row) {
      if (row.is_default == 0) {
        this.$baseMessage('默认分组无法删除', 'warning')
        return
      }
      if (row.id) {
        this.$baseConfirm('你确定要删除当前项吗', null, () => {
          delGroup({ id: row.id }).then((res) => {
            if (res.code == 200) {
              this.$baseMessage(res.msg, 'success')
              this.fetchData()
            } else {
              this.$baseMessage(res.msg, 'error')
            }
          })
        })
      } else {
        if (this.selectRows.length > 0) {
          const idArr = this.selectRows.map((item) => item.id).join()
          this.$baseConfirm('你确定要删除选中项吗', null, () => {
            delGroup({ id: idArr }).then((res) => {
              if (res.code == 200) {
                this.$baseMessage(res.msg, 'success')
                this.fetchData()
              } else {
                this.$baseMessage(res.msg, 'error')
              }
            })
          })
        } else {
          this.$baseMessage('未选中任何行', 'error')
          return false
        }
      }
    },
    // 是否可选取
    selectable(row, index) {
      return row.is_default != 0
    },
    // 分配规则
    handleRules(row) {
      if (row.id) {
        this.$refs['rules'].showEdit(row)
      } else if (this.selectRows.length > 0) {
        this.$refs['rules'].showEdit(this.selectRows)
      } else {
        this.$baseMessage('未选中任何行', 'error')
        return false
      }
    },
    fetchData() {
      this.listLoading = true
      getgroupOptions().then((res) => {
        this.list = res.data
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    testMessage() {
      this.$baseMessage('test1', 'success')
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
    // 添加分组
    addGroup() {
      this.form = {}
      this.dialogTitle = '添加分组'
      this.dialogFormVisible = true
    },
    // 添加/编辑 提交
    save() {
      const form = { ...this.form }
      if (form.id) {
        // 执行编辑操作
        editGroup(form).then((res) => {
          if (res.code == 200) {
            this.$baseMessage('编辑成功', 'success')
            this.dialogFormVisible = false
            this.fetchData()
          } else {
            this.$baseMessage(res.msg, 'error')
          }
        })
      } else {
        // 执行添加操作
        addGroup(form).then((res) => {
          if (res.code == 200) {
            this.$baseMessage('添加成功', 'success')
            this.dialogFormVisible = false
            this.fetchData()
          } else {
            this.$baseMessage(res.msg, 'error')
          }
        })
      }
    },
    // 分组编辑
    handleEdit(row) {
      if (this.selectRows.length > 1) {
        this.$baseMessage('只能选择一个进行编辑', 'error')
        return
      }
      if (row.is_default == 0) {
        this.$baseMessage('默认分组无法更改', 'warning')
        return
      }
      this.dialogTitle = '编辑分组'
      this.form = {
        id: row.id,
        name: row.name,
      }
      this.dialogFormVisible = true
    },
    // 删除分组
    removeArr(row) {
      if (row.id) {
      }
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
</style>
