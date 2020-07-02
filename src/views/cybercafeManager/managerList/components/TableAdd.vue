<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="网吧名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="网吧账号" prop="account">
        <el-input v-model.trim="form.account" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="网吧密码">
        <el-input v-model.trim="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="网吧联系人">
        <el-input v-model.trim="form.contacts" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="联系人手机">
        <el-input
          v-model.trim="form.contacts_phone"
          autocomplete="off"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="联系人手机">
        <el-input v-model.trim="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="网吧地址">
        <el-cascader
          v-model="form.selectedOptions"
          size="large"
          :options="allAddress"
          @change="handleChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细网吧地址">
        <el-input v-model="form.address_detail" size="large"></el-input>
      </el-form-item>
      <el-form-item label="所在分组">
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
      <el-form-item label="注册台数">
        <el-input
          v-model.trim="form.register_num"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doAdd, getgroupOptions } from '@/api/table'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'TableAdd',
  data() {
    var validateAddress = (rule, value, callback) => {
      if (this.form.selectedOptions.length < 3) {
        callback(new Error('请输入正确的地址'))
      }
    }
    return {
      allAddress: regionData,
      form: {
        name: '',
        account: '',
        password: '123456',
        contacts: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        grouping_id: '',
        selectedOptions: [],
        address_detail: '',
        register_num: '',
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入网吧名称' }],
        account: [
          { required: true, trigger: 'blur', message: '请输入网吧账号' },
        ],
        // password: [
        //   { required: true, trigger: 'blur', message: '请输入网吧密码' },
        // ],
      },
      title: '',
      dialogFormVisible: false,
      groupOptions: [],
    }
  },
  methods: {
    showEdit(row) {
      this.title = '添加'
      this.dialogFormVisible = true
      // 请求分组数据
      this.getgroupOptions()
    },
    close() {
      this.dialogFormVisible = false
    },
    handleChange(value) {},
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const form = this.form
          let data
          const addressData = this.computedArea(this.form.selectedOptions)

          data = {
            account: form.account,
            password: form.password,
            name: form.name,
            grouping_id: form.grouping_id,
            register_num: form.register_num,
            contacts: form.contacts,
            phone: form.phone,
          }
          data.address = {
            province: addressData[0],
            city: addressData[1],
            area: addressData[2],
            address_detail: form.address_detail,
          }
          data.address = JSON.stringify(data.address)
          doAdd(data).then((res) => {
            if (res.code == 200) {
              this.$baseMessage('注册成功', 'success')
              this.$refs['form'].resetFields()
              this.dialogFormVisible = false
              this.$emit('fetchData')
            } else {
              this.$baseMessage(res.msg, 'error')
            }
          })
        } else {
          return false
        }
      })
    },
    // 请求分组数据
    getgroupOptions() {
      getgroupOptions().then((res) => {
        this.groupOptions = res.data
      })
    },
    // 根据code计算省市区
    computedArea(arr) {
      return arr.map((item) => {
        return CodeToText[item + '']
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.el-form {
  height: 500px;
  overflow-x: hidden;
}
</style>
