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
      <!-- <el-form-item label="网吧密码" prop="password">
        <el-input v-model.trim="form.password" autocomplete="off"></el-input>
      </el-form-item> -->
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
        <el-input
          v-model.trim="form.contacts_phone"
          autocomplete="off"
        ></el-input>
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
        <el-select v-model="form.groupingName" placeholder="请选择">
          <el-option
            v-for="item in groupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { doEdit, getgroupOptions } from '@/api/table'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'TableEdit',
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
        password: '123',
        contacts: '',
        contacts_phone: '',
        province: '',
        city: '',
        area: '',
        groupingName: '',
        selectedOptions: [],
        address_detail: '',
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
  created() {
    // 请求分组数据
    this.getgroupOptions()
  },
  methods: {
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
        if (row.province && row.city && row.area) {
          try {
            this.form.selectedOptions = [
              TextToCode[row.province].code,
              TextToCode[row.province][row.city].code,
              TextToCode[row.province][row.city][row.area].code,
            ]
          } catch (e) {
            this.form.selectedOptions = []
          }
        }
      }
      this.dialogFormVisible = true
    },
    close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.dialogFormVisible = false
      this.$emit('fetchData')
    },
    handleChange(value) {
      console.log(value)
      console.log(this.form.selectedOptions)
    },
    save() {
      this.$refs['form'].validate((valid) => {
        console.log()
        if (valid) {
          let data = this.form
          const addressData = this.computedArea(data.selectedOptions)
          data.address = {
            province: addressData[0],
            city: addressData[1],
            area: addressData[2],
            address_detail: data.address_detail,
          }
          if (data.id) {
            // 编辑保存

            // doEdit(data).then((res) => {
            //   this.$baseMessage(res.msg, 'success')
            //   this.$refs['form'].resetFields()
            //   this.dialogFormVisible = false
            //   this.$emit('fetchData')
            //   this.form = this.$options.data().form
            // })

            this.dialogFormVisible = false
          } else {
            // 添加保存
            // doAdd(data).then((res) => {
            //   this.$baseMessage(res.msg, 'success')
            //   this.$refs['form'].resetFields()
            //   this.dialogFormVisible = false
            //   this.$emit('fetchData')
            //   this.form = this.$options.data().form
            // })

            this.dialogFormVisible = false
          }
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
