<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
          >注册
        </el-button>
        <el-button icon="el-icon-folder-add" type="primary" @click="handleRules"
          >分配规则
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-folder-opened "
          @click="testMessage"
          >分组管理</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-document-copy"
          @click="moveGroup"
          >移动分组</el-button
        >
        <!-- <el-button type="primary" @click="testConfirm">baseConfirm</el-button> -->
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">
          刷新
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
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
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      height="650"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form class="demo-table-expand">
            <el-form-item label="网吧地址">
              <span>{{ netWorkArea(scope.row) }}</span>
            </el-form-item>
            <el-form-item label="到期时间">
              <span>{{ scope.row.duration + '天' }}</span>
            </el-form-item>
            <el-form-item label="网吧账号">
              <span>{{ scope.row.account }}</span>
            </el-form-item>
            <el-form-item label="联系人">
              <span>{{ scope.row.contacts }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ scope.row.contacts_phone }}</span>
            </el-form-item>
            <el-form-item label="IP信息">
              <span>{{ scope.row.intranet_ip }}</span>
            </el-form-item>
            <el-form-item label="版本信息">
              <span>{{ scope.row.server_versions || '暂无' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="网吧名称" prop="name"></el-table-column>
      <el-table-column label="所属分组" prop="groupingName"></el-table-column>
      <el-table-column label="防御">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.defense"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="安全" prop="pageViews">
        <template slot-scope="scope">
          <el-badge :value="2" class="item" type="warning">
            <el-button
              class="rules-button"
              size="small"
              @click="handleRules(scope.row)"
              >分配规则</el-button
            >
          </el-badge>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="安装/在线">
        <template slot-scope="scope">
          <el-tag type="success" size="mini">
            <span style="padding: 0 15px;"> {{ scope.row.register_num }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280px" fixed="right">
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
            >解绑</el-button
          >

          <el-button type="warning" size="mini" icon="el-icon-s-shop"
            >续费</el-button
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
    <move-group ref="moves" @fetchData="fetchData" />
    <table-edit ref="edit" @fetchData="fetchData" />
    <unbound ref="unbound" @fetchData="fetchData" />
    <rules ref="rules" @fetchData="fetchData" />
    <table-add ref="add" @fetchData="fetchData" />
  </div>
</template>

<script>
import { getList, ruleDetail } from '@/api/table'
import TableEdit from './components/TableEdit'
import Unbound from './components/Unbound'
import Rules from './components/Rules'
import TableAdd from './components/TableAdd'
import moveGroup from './components/moveGroup'
export default {
  name: 'ComprehensiveTable',
  components: {
    TableEdit,
    Unbound,
    Rules,
    TableAdd,
    moveGroup,
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
        title: '',
      },
    }
  },
  computed: {
    netWorkArea() {
      return function (res) {
        return res.province + res.city + res.area
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
      this.$refs['add'].showEdit()
    },
    handleEdit(row) {
      this.$refs['edit'].showEdit(row)
    },
    handleDelete(row) {
      if (row.id) {
        this.$refs['unbound'].showEdit(row, this.total)
      }
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
    // 移动分组
    moveGroup() {
      if (this.selectRows.length > 0) {
        this.$refs['moves'].showEdit(this.selectRows)
      } else {
        this.$baseMessage('未选中任何行', 'error')
        return false
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
    fetchData() {
      this.listLoading = true
      getList(this.queryForm).then((res) => {
        this.list = res.data.data
        // const imageList = []
        // res.data.forEach((item, index) => {
        //   imageList.push(item.img)
        // })
        // this.imageList = imageList
        this.total = res.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    testMessage() {
      this.$router.push({ path: '/manager/groupManager' })
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
</style>
