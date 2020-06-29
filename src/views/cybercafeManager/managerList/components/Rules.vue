<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="1000px"
    @close="close"
  >
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card" shadow="never">
          <div slot="header">
            <span class="noRules-header remove">未分配规则</span>
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
              <span>{{ node.label }}</span>
              <span>
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
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
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
import { doEdit } from '@/api/table'

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
      data2: [
        {
          id: 1,
          label: '一级 1',
          isOpen: false,
          children: [
            {
              id: 4,
              grouping_id: 1,
              label: '二级 1-1',
              isOpen: false,
            },
          ],
        },
        {
          id: 2,
          label: '一级 2',
          isOpen: false,
          children: [
            {
              id: 5,
              label: '二级 2-1',
              grouping_id: 2,
              isOpen: false,
            },
            {
              id: 6,
              label: '二级 2-2',
              grouping_id: 2,
              isOpen: false,
            },
          ],
        },
        {
          id: 3,
          label: '一级 3',
          isOpen: false,
          children: [
            {
              id: 7,
              label: '二级 3-1',
              isOpen: false,
              grouping_id: 3,
            },
            {
              id: 8,
              label: '二级 3-2',
              isOpen: false,
              grouping_id: 3,
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
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

    itemStatus2() {
      return function (data) {
        return data.children ? '关闭分组' : '关闭'
      }
    },
    data3() {
      return this.filterData(this.data2)
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
    // dialog被触发
    showEdit(row) {
      if (row instanceof Array) {
        this.title = '*分配规则'
      } else {
        this.title = `[${row.title}] 分配规则`
        this.rule = Object.assign({}, row)
      }
      this.dialogFormVisible = true
    },
    // 点击取消
    close() {
      this.dialogFormVisible = false
    },
    // 点击确定
    save() {
      this.dialogFormVisible = false
    },
    // 对节点进行过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击节点右边按钮触发
    changeStatus(item) {
      const status = item.isOpen
      // 渲染当前节点下面的所有子节点
      this.hanldleStatus(item, status)
      // 判断是否改变属性
      this.isChangeStatus(this.data2)
    },

    // 点击开启全部触发
    changeAll() {
      const status = this.isAllOpen
      this.data2.forEach((item) => {
        this.hanldleStatus(item, status)
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
        if (item.children) {
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
    filterData(list) {
      // if (list.length == 0) return []
      // const arr = []
      // list.forEach((item) => {
      //   const obj = this.deepFilterList(item)
      //   arr.push(obj)
      // })
      // return arr

      const dataList = []
      list.forEach((item2) => {
        let item = this.deepFilterList(item2)
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
</style>
