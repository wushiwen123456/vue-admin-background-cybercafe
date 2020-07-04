import Vue from 'vue'
import { getInfo, login, logout } from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config/settings'

const state = {
  accessToken: getAccessToken(),
  userName: '',
  avatar: '',
  permissions: [],
}
const getters = {
  accessToken: (state) => state.accessToken,
  userName: (state) => state.userName,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
}
const actions = {
  async login({ commit }, userInfo) {
    try {
      const { data } = await login(userInfo)
      const accessToken = data
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } catch (error) {
      // Vue.prototype.$baseMessage(
      //   `登录接口异常，未正确返回${tokenName}...`,
      //   "error"
      // );
    }
  },
  async getInfo({ commit, state }) {
    const { data } = await getInfo(state.accessToken)
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    commit('setPermissions', ['admin'])
    commit('setUserName', 'admin')
    commit(
      'setAvatar',
      'https://picsum.photos/50/50?random=e4f4D59b-d77F-24Bc-A71e-Fe03668E7cEE'
    )
    // let { permissions, userName, avatar } = data
    // if (permissions && userName && avatar) {
    //   commit('setPermissions', ['admin'])
    //   commit('setUserName', 'admin')
    //   commit('setAvatar', 'https://picsum.photos/50/50?random=e4f4D59b-d77F-24Bc-A71e-Fe03668E7cEE')
    //   return permissions
    // } else {
    //   Vue.prototype.$baseMessage('获取用户信息接口异常', 'error')
    //   return false
    // }
  },
  async logout({ dispatch }) {
    // await logout(state.accessToken)
    await dispatch('tagsBar/delAllRoutes', null, { root: true })
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default { state, getters, mutations, actions }
