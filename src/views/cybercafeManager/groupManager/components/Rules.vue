<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :width="dialogWidth"
    @close="close"
  >
    <el-row :gutter="15">
      <el-col
        :xs="24"
        :sm="24"
        :md="widthNumber"
        :lg="widthNumber"
        :xl="widthNumber"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header">
            <span class="noRules-header remove">规则备选列表</span>
          </div>
          <div class="rule-title margin-bottom">
            <span>规则标题</span>
            <el-button type="text" size="mini" @click="changeAll">
              <b :class="isAllOpen ? 'check-all' : 'check'">
                <i :class="[isAllOpen ? 'el-icon-check' : 'el-icon-plus']"></i>
                {{ isAllOpen ? '已开启' : '全开启' }}
              </b>
            </el-button>
          </div>
          <el-input
            v-model="input1"
            class="margin-bottom"
            placeholder="请输入规则标题"
            prefix-icon="el-icon-search"
          />
          <el-tree
            ref="tree"
            class="filter-tree"
            node-key="tree1"
            default-expand-all
            :data="data2"
            :props="defaultProps"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ rulesName(data) }}</span>
              <span v-if="isShowChangeRule(data)">
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => changeStatus(data)"
                >
                  <b :class="[itemStatus(data) ? 'check-all' : 'check']">
                    <i
                      :class="[
                        itemStatus(data) ? 'el-icon-check' : 'el-icon-plus',
                      ]"
                    ></i>
                    {{
                      itemStatus(data)
                        ? '已开启'
                        : data.children
                        ? '开启分组'
                        : '开启'
                    }}
                  </b>
                </el-button>
              </span>
            </span>
          </el-tree>
          <div class="tips">
            注：所有的规则
          </div>
        </el-card>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="widthNumber"
        :lg="widthNumber"
        :xl="widthNumber"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header">
            <span class="noRules-header check-all">已分配规则</span>
          </div>
          <div class="rule-title margin-bottom">
            <span>规则标题</span>
            <el-button type="text" size="mini" @click="closeAll">
              <b class="remove">
                <i class="el-icon-close"></i>
                全关闭
              </b>
            </el-button>
          </div>
          <el-input
            v-model="input2"
            class="margin-bottom"
            placeholder="请输入规则标题"
            prefix-icon="el-icon-search"
          />
          <el-tree
            ref="tree2"
            class="filter-tree"
            node-key="tree2"
            default-expand-all
            :data="data3"
            :props="defaultProps"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => changeStatus2(data)"
                >
                  <b class="remove">
                    <i class="el-icon-close"></i>
                    {{ itemStatus2(data) }}
                  </b>
                </el-button>
              </span>
            </span>
          </el-tree>
          <div class="tips">
            注：当前已分配的规则
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { groupRules, allNetworkRules } from '@/api/table'
export default {
  name: 'Rules',
  data() {
    return {
      rule: {},
      title: '',
      dialogFormVisible: false,
      input1: '',
      input2: '',
      totalRules: {},
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      rows: [],
      singerEdit: '',
    }
  },
  computed: {
    isAllOpen() {
      return this.data2.every((item) => item.isOpen == true)
    },

    itemStatus() {
      return (data) => {
        return data.isOpen
      }
    },
    rulesName() {
      return (data) => {
        if (!data.grouping_id && data.children.length == 0) {
          return data.name + '(暂无规则)'
        } else {
          return data.name
        }
      }
    },
    // 是否显示开启按钮
    isShowChangeRule() {
      return (data) => {
        return !(!data.grouping_id && data.children.length == 0)
      }
    },
    itemStatus2() {
      return function (data) {
        return data.children ? '关闭分组' : '关闭'
      }
    },
    data3() {
      return this.filterData(this.data2)
    },
    // 计算宽度
    dialogWidth() {
      return '900px'
    },
    // 计算布局
    widthNumber() {
      return 12
    },
  },
  watch: {
    input1(val) {
      this.$refs.tree.filter(val)
    },
    input2(val) {
      this.$refs.tree2.filter(val)
    },
  },
  created() {},
  methods: {
    // 跳转到分组管理界面
    goGroupManager() {
      this.$router.push({ path: '/manager/groupManager' })
    },
    // dialog被触发
    showEdit(row) {
      if (row instanceof Array) {
        this.title = '*分配规则'
        this.allNetworkRules()
        this.singerEdit = true
      } else {
        this.title = '[' + row.name + ']' + ' ' + '分配规则'
        this.allNetworkRules(row.id)
        this.singerEdit = false
      }
      this.rows = row
      this.dialogFormVisible = true
    },
    // 获取所有规则信息
    allNetworkRules(id) {
      if (!id) {
        allNetworkRules().then((res) => {
          if (res.code == 200) {
            let allRules = res.data
            allRules.forEach((item) => this.allRulesInit(item, false))
            this.data2 = allRules
          } else {
          }
        })
      } else {
        groupRules({ id }).then((res) => {
          this.data2 = res.data
        })
      }
    },
    // 初始化所有规则列表
    allRulesInit(rule, status) {
      rule.isOpen = status
      if (rule.children && rule.children.length > 0) {
        rule.children.forEach((child) => {
          this.allRulesInit(child, status)
        })
      }
    },
    // 点击取消
    close() {
      this.dialogFormVisible = false
    },
    // 点击确定
    save() {
      let id
      if (this.rows instanceof Array) {
        // 多个提交
        id = this.rows.map((item) => item.id).join(',')
      } else {
        // 单个提交
        id = this.rows.id
      }
      const rule_id = this.dealRightData(this.data3).join(',')
      this.$emit('groupRulesEdit', { id, rule_id })
    },
    // 对提交的数据进行处理
    dealRightData(data3) {
      // 取所有的二级id，不要一级
      const arr = []
      let data = data3.filter(
        (item) => item.children && item.children.length > 0
      )
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].children.length; j++) {
          arr.push(data[i].children[j].id)
        }
      }
      return arr
    },
    // 对节点进行过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击节点右边按钮触发
    changeStatus(item) {
      const status = item.isOpen
      // 如果没有children属性，则自动return
      if (!item.grouping_id && item.children.length == 0) return
      // 渲染当前节点下面的所有子节点
      this.hanldleStatus(item, status)
      // 判断是否改变属性
      this.isChangeStatus(this.data2)
    },

    // 点击开启全部触发
    changeAll() {
      const status = this.isAllOpen
      this.data2.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.hanldleStatus(item, status)
        }
      })
    },
    // 递归遍历数组
    hanldleStatus(item, status) {
      this.$set(item, 'isOpen', !status)
      if (item.children) {
        item.children.forEach((child) => {
          this.hanldleStatus(child, status)
        })
      }
    },
    // 判断点击后的状态
    isChangeStatus(list) {
      if (list.length && list.length > 0) {
        this.doStatus(list)
        this.doStatus(list)
      }
    },
    doStatus(list) {
      list.forEach((item) => {
        if (item.children && item.children.length > 0) {
          let status = item.children.every((child) => child.isOpen)
          this.$set(item, 'isOpen', status)
          this.doStatus(item.children)
        }
      })
    },

    // part2部分
    // 全关闭
    closeAll() {
      this.data2.forEach((item) => {
        this.hanldleStatus(item, true)
      })
    },
    // 监听item点击
    changeStatus2(data) {
      //  获取当前元素对应的左边对象
      const id = data.id
      const grouping_id = data.grouping_id || ''
      const obj = this.findData(id, grouping_id, this.data2)
      this.changeStatus(obj)
    },
    // 根据id寻找一级元素
    findData(id, grouping_id, list) {
      // 判断grouping_id是否为空
      if (grouping_id) {
        const obj = list.find((item) => item.id == grouping_id)
        return obj.children.find((item) => {
          return item.id == id
        })
      } else {
        return list.find((item) => item.id == id)
      }
    },
    // 对规则进行筛选，选出已选数组
    filterData(list2) {
      const dataList = []
      const list = this.deepFilterList(list2)
      list.forEach((item) => {
        const linshi = []
        if (item.isOpen) {
          //父级为true
          dataList.push(item)
        } else {
          //遍历子级
          item.children.forEach((index, key) => {
            if (index.isOpen) {
              //子级为true
              linshi.push(index)
            }
            if (key == item.children.length - 1) {
              if (linshi.length != 0) {
                item.children = linshi
                dataList.push(item)
              } else {
              }
            }
          })
        }
      })
      return dataList
    },
    // 对每个item进行递归筛选
    deepFilterList(obj, cache = []) {
      // typeof [] => 'object'
      // typeof {} => 'object'
      if (obj === null || typeof obj !== 'object') {
        return obj
      }
      // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
      /**
       * 类似下面这种
       * var a = {b:1}
       * a.c = a
       * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
       */
      const hit = cache.filter((c) => c.original === obj)[0]
      if (hit) {
        return hit.copy
      }

      const copy = Array.isArray(obj) ? [] : {}
      // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
      cache.push({
        original: obj,
        copy,
      })

      Object.keys(obj).forEach((key) => {
        copy[key] = this.deepFilterList(obj[key], cache)
      })

      return copy
    },

    // 对每个item进行递归筛选
    deepFilterData(obj, cache = [], obj2) {
      // typeof [] => 'object'
      // typeof {} => 'object'
      if (obj === null || typeof obj !== 'object') {
        return obj
      }
      // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
      /**
       * 类似下面这种
       * var a = {b:1}
       * a.c = a
       * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
       */
      const hit = cache.filter((c) => c.original === obj)[0]
      if (hit) {
        return hit.copy
      }

      const copy = Array.isArray(obj) ? [] : {}
      // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
      cache.push({
        original: obj,
        copy,
      })

      Object.keys(obj).forEach((key) => {
        copy[key] = this.deepFilterData(obj[key], cache)
      })

      return copy
    },
  },
}
</script>
<style lang="scss" scoped>
.box-card {
  min-height: 480px;
  position: relative;
}
.margin-bottom {
  margin-bottom: 15px;
}
.rule-title {
  display: flex;
  justify-content: space-between;
  b {
    font-weight: 600;
    cursor: pointer;
  }
}
.check-all {
  color: $base-color-green;
}
.check {
  color: $base-color-default;
}
.remove {
  color: $base-color-red;
}
.custom-tree-node {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}
.yello-color {
  color: $base-color-yellow;
}
.tips {
  color: #999;
  box-sizing: border-box;
  padding: 0 20px;
  font-size: 12px;
  position: absolute;
  bottom: 10px;
}
.goManager {
  color: $base-color-default;
  cursor: pointer;
}
</style>
