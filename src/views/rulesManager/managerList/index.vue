<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
          >添加规则
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-document-copy"
          @click="moveGroup"
          >移动分组</el-button
        >
        <el-button type="primary" icon="el-icon-delete" @click="handleDelete"
          >删除规则</el-button
        >
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-select
          v-model="queryForm.grouping_id"
          placeholder="规则分组"
          @change="fetchData"
        >
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-form
          ref="form"
          :model="queryForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input v-model="queryForm.name" placeholder="标题" />
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="fetchData"
              >查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
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
      <el-table-column type="selection" min-width="55" />
      <el-table-column label="ID" min-width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="规则名称" min-width="150">
        <template slot-scope="scope">
          <span :title="scope.row.name" class="text-cut">
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="规则介绍" min-width="150">
        <template slot-scope="scope">
          <span :title="scope.row.introduce" class="text-cut">
            {{ scope.row.introduce }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="所属分组" width="120">
        <template slot-scope="scope">
          <span :class="{ 'is-default': scope.row.grouping_id == 1 }">{{
            getGroupName(scope.row.grouping_id)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="0"
            :inactive-value="1"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="版本" min-width="120">
        <template slot-scope="scope">
          <el-tag size="medium" type="warning">{{
            scope.row.versions || '暂无版本'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" prop="up_time" min-width="120" />
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

    <el-pagination
      :background="background"
      :current-page="queryForm.page"
      :layout="layout"
      :page-size="queryForm.limit"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>

    <move-group ref="moveGroup" @fetchData="fetchData" />
    <add-rule ref="addRule" @fetchData="fetchData" />
  </div>
</template>

<script>
import { rulesGroupList, ruleList } from '@/api/table'
import MoveGroup from './components/MoveGroup'
import AddRule from './components/AddRule'
export default {
  name: 'RuleManager',
  components: {
    MoveGroup,
    AddRule,
  },
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
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      selectRows: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        page: 1,
        limit: 20,
        name: '',
        grouping_id: '',
      },
      groupList: [],
    }
  },
  computed: {
    getGroupName() {
      return (id) => {
        return (
          (this.groupList.find((item) => item.id == id) &&
            this.groupList.find((item) => item.id == id).name) ||
          ''
        )
      }
    },
  },
  created() {
    this.fetchData()
    this.getGroupList()
  },

  beforeDestroy() {},
  mounted() {},
  methods: {
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

    handleAdd() {
      this.$refs['addRule'].showEdit()
    },
    handleEdit(row) {
      this.$refs['addRule'].showEdit(row)
    },
    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm('你确定要删除当前项么', null, () => {})
      } else {
        if (this.setSelectRows.length > 0) {
          this.$baseConfirm('你确定要删除选中项么', null, () => {})
        } else {
          this.$baseMessage('未选中任何行', 'error')
        }
      }
    },
    // 移动分组
    moveGroup() {
      if (this.selectRows.length > 0) {
        this.$refs['moveGroup'].showEdit(this.selectRows)
      } else {
        return this.$baseMessage('未选中任何行', 'error')
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
    // 获取规则列表
    fetchData() {
      this.listLoading = true
      ruleList(this.queryForm).then((res) => {
        this.list = res.data.data
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    // 获取分组列表
    getGroupList() {
      rulesGroupList().then((res) => {
        if (res.code == 200) {
          this.groupList = res.data
        } else {
          this.$baseMessage(res.msg, 'error')
        }
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
.is-default {
  color: #666;
}
</style>
