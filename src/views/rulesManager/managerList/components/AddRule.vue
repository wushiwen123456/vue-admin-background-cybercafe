<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="1300px"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="适用区域：">
        <el-cascader
          v-model="form.selectedOptions"
          size="large"
          :options="allAddress"
          @change="handleChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="规则分组：">
        <el-select v-model="form.grouping_id" placeholder="请选择分组">
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则标题：">
        <el-input v-model="form.name" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="规则介绍：">
        <el-input
          v-model="form.introduce"
          type="textarea"
          autosize
          placeholder="请输入描述"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-switch
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="0"
          :inactive-value="1"
        >
        </el-switch>
      </el-form-item>
    </el-form>

    <!-- 规则内容 -->
    <el-tabs v-model="activeName" class="el-tabs" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabBarList"
        :key="item.id"
        :label="item.name"
        :name="item.name"
      >
        <rule-content :type-id="item.id" />
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { rulesGroupList, moveRulesToGroup } from '@/api/table'
import ruleConfig from '@/config/ruleConfig'
import RuleContent from './RuleContent'
import {
  provinceAndCityData,
  provinceAndCityDataPlus,
  CodeToText,
  TextToCode,
} from 'element-china-area-data'

export default {
  components: {
    RuleContent,
  },
  data() {
    return {
      groupOptions: [],
      dialogFormVisible: false,
      title: '添加规则',
      dataOptions: [],
      form: {
        grouping_id: '',
        selectedOptions: [],
        name: '',
        introduce: '',
        status: '',
      },
      allAddress: provinceAndCityDataPlus,
      tabBarList: ruleConfig,
      activeName: '',
    }
  },
  methods: {
    showEdit(row) {
      if (row) {
        // 编辑
      } else {
        // 添加
      }
      this.dialogFormVisible = true
      this.getgroupOptions()
    },
    getgroupOptions() {
      rulesGroupList().then((res) => {
        this.groupOptions = res.data
      })
      this.activeName = this.tabBarList[0].name
    },
    save() {
      const data = {
        id: this.dataOptions.map((item) => item.id).join(','),
        grouping_id: this.form.grouping_id,
      }
    },
    close() {
      this.dialogFormVisible = false
    },
    handleChange(e) {
      console.log(this.form.selectedOptions)
    },
    // tabBar点击
    handleClick(tab, event) {},
  },
}
</script>

<style>
.el-tabs {
  margin-top: 15px;
}
</style>
