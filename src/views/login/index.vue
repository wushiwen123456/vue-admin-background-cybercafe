<template>
  <div class="login-container">
    <div class="login-logo-bysj"></div>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <!-- 手机架验证码登录 -->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          auto-complete="off"
          class="login-form"
          label-position="left"
        >
          <div class="title">
            hello !
          </div>
          <div class="title-tips">欢迎来到{{ title }}！</div>

          <div v-show="formMethod == 'phone'">
            <el-form-item prop="phone" class="login-form-admin">
              <span class="svg-container svg-container-admin">
                <vab-icon :icon="['fas', 'mobile-alt']" />
              </span>
              <el-input
                v-model="loginForm.phone"
                auto-complete="off"
                placeholder="请输入手机号"
                tabindex="1"
                type="text"
              />
              <el-button type="primary" class="send-code">发送验证码</el-button>
            </el-form-item>
            <el-form-item prop="img-cord" class="login-form-imgCord">
              <el-input
                v-model="loginForm.imgCord"
                auto-complete="off"
                placeholder="请输入验证码"
                tabindex="1"
                type="text"
              />
              <img
                v-if="dialogImageCode"
                :src="imgCode"
                class="img-code"
                alt=""
                @click="getImageCode"
              />
            </el-form-item>
            <el-form-item prop="phoneCord" class="login-form-imgCord">
              <el-input
                v-model="loginForm.phoneCord"
                v-focus
                auto-complete="off"
                placeholder="请输入手机验证码"
                tabindex="1"
                type="text"
              />
            </el-form-item>
          </div>

          <div v-show="formMethod == 'normal'">
            <el-form-item prop="phone" class="login-form-admin">
              <span class="svg-container svg-container-admin">
                <vab-icon :icon="['fas', 'mobile-alt']" />
              </span>
              <el-input
                v-model="loginForm.phone"
                auto-complete="off"
                placeholder="请输入手机号"
                tabindex="1"
                type="text"
              />
            </el-form-item>
            <el-form-item class="login-form-admin">
              <span class="svg-container svg-container-admin">
                <vab-icon :icon="['fas', 'lock']" />
              </span>
              <el-input
                v-model="loginForm.password"
                v-focus
                auto-complete="off"
                placeholder="请输入密码"
                tabindex="1"
                type="text"
              />
            </el-form-item>
          </div>

          <div v-show="formMethod == 'weixin'" class="ewm_container">
            <el-form-item class="login-form-imgCord">
              <div class="ewm-box">
                <img src="@/assets/ewm_me.png" />
              </div>
            </el-form-item>
          </div>

          <el-button
            v-show="formMethod != 'weixin'"
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
            >登录
          </el-button>
          <div class="choose-login">
            <el-button
              type="success"
              icon="iconfont icon-weixin"
              circle
              @click="checkLogin(1)"
            />
            <el-button
              type="primary"
              icon="iconfont icon-phone"
              circle
              @click="checkLogin(2)"
            />
            <el-button
              type="warning"
              icon="iconfont icon-jianpan"
              circle
              @click="checkLogin(3)"
            />
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isPassword } from '@/utils/validate'
import { getImageCode } from '@/api/user.js'

export default {
  name: 'Login',
  directives: {
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      },
    },
  },
  data() {
    const validateUserName = (rule, value, callback) => {
      if ('' == value) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!isPassword(value)) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    const validatePhoneCord = (rule, value, callback) => {
      if ('' == value) {
        callback(new Error('请输入手机验证码'))
      } else {
        callback()
      }
    }

    return {
      nodeEnv: process.env.NODE_ENV,
      title: this.$baseTitle,
      loginForm: {
        password: '',
        phoneCord: '',
        phone: '',
      },
      imgCode: '',
      dialogImageCode: true,
      smsCode: '',
      loginRules: {
        phone: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePhone,
          },
        ],
        phoneCord: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePhoneCord,
          },
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      formMethod: 'normal',
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },

  created() {
    // 获取验证码
    this.getImageCode()
  },
  mounted() {
    if ('production' !== process.env.NODE_ENV) {
      this.loginForm.userName = 'admin'
      this.loginForm.password = '123456'
      this.loginForm.phone = '16638245952'
      this.loginForm.phoneCord = '1234'
    }
  },
  methods: {
    showPwd() {
      this.passwordType === 'password'
        ? (this.passwordType = '')
        : (this.passwordType = 'password')
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 获取图形验证码
    getImageCode() {
      getImageCode().then((res) => {
        if (res.code == 200) {
          this.dialogImageCode = false
          this.imgCode = res.data[0]
          this.$nextTick(() => {
            this.dialogImageCode = true
          })
        }
      })
    },
    handleLogin() {
      let type
      switch (this.formMethod) {
        case 'phone':
          type = 1
          break
        case 'normal':
          type = 0
          break
        default:
          break
      }
      let data = {
        type,
        phone: this.loginForm.phone,
        password: this.loginForm.password,
        smsCode: this.loginForm.phoneCord,
      }

      this.doLogin(data)
    },
    async doLogin(data) {
      this.loading = true
      await this.$store.dispatch('user/login', data)
      const routerPath =
        this.redirect === '/404' || this.redirect === '/401'
          ? '/'
          : this.redirect
      this.$router.push({ path: routerPath }).catch((error) => {})
      this.loading = false
    },
    // 登陆方式转换
    checkLogin(num) {
      switch (num) {
        case 1:
          this.formMethod = 'weixin'
          break
        case 2:
          this.formMethod = 'phone'
          break
        case 3:
          this.formMethod = 'normal'
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  min-height: 600px;
  background: url('~@/assets/login_images/background.jpg') center center fixed
    no-repeat;
  background-size: cover;

  .title {
    height: 50px;
    font-size: 54px;
    font-weight: 500;
    color: rgba(14, 18, 26, 1);
  }

  .title-tips {
    height: 24px;
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(14, 18, 26, 1);
  }

  .login-btn {
    display: inherit;
    width: 220px;
    height: 60px;
    margin-top: 5px;
    border: 0;
    position: relative;
    z-index: 99;
    &:hover {
      opacity: 0.9;
    }
  }

  .login-logo-bysj {
    position: absolute;
    top: 45px;
    left: 45px;

    img {
      width: 180px;
    }
  }

  .login-form {
    position: relative;
    max-width: 100%;
    margin: 22vh 10% 10%;
    overflow: hidden;

    .forget-password {
      width: 100%;
      margin-top: 40px;
      text-align: left;

      .forget-pass {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }
  }

  .tips {
    margin-bottom: 10px;
    font-size: $base-font-size-default;
    color: $base-color-white;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 34px;
      font-weight: bold;
      color: $base-color-blue;
      text-align: center;
    }
  }

  .svg-container {
    position: absolute;
    top: 14px;
    left: 15px;
    z-index: $base-z-index;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  .show-pwd {
    position: absolute;
    top: 14px;
    right: 25px;
    font-size: 16px;
    color: $base-font-color;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0;
      color: #454545;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2px;

      &__content {
        min-height: $base-input-height;
        line-height: $base-input-height;
      }

      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        font-size: $base-font-size-small;
        line-height: 18px;
        color: $base-color-red;
      }
    }

    .el-input {
      box-sizing: border-box;

      input {
        height: 58px;
        padding-left: 45px;
        font-size: $base-font-size-default;
        line-height: 58px;
        color: $base-font-color;
        background: #f6f4fc;
        border: 0;
        caret-color: $base-font-color;
      }
    }
    .login-form-imgCord {
      .el-input {
        input {
          padding-left: 20px;
        }
      }
      .img-code {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        user-select: none;
        height: 100%;
        width: 200px;
      }
    }
  }
  .choose-login {
    position: absolute;
    width: 100%;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    .el-button {
      display: block;
      font-size: 18px;
    }
  }
  .send-code {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 200px;
  }
  .ewm-box {
    width: 250px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    position: relative;
    img {
      width: 150px;
      height: 150pxpx;
    }
  }
  .ewm-box::before {
    content: '请使用微信扫描二维码登录';
    display: block;
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
    color: #ffffff;
  }
  .ewm_container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    height: 317px;
  }
}
</style>
