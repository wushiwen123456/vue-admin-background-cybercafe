import request from '@/utils/request'
import { data } from 'jquery'
/**
 * 网吧列表
 * */
export function getList(params) {
  return request({
    url: '/internetbar/internetbarList',
    method: 'get',
    params,
  })
}
// 网吧编辑
export function doEdit(data) {
  return request({
    url: '/internetbar/edit',
    method: 'post',
    data,
  })
}
// 网吧添加
export function doAdd(data) {
  return request({
    url: '/internetbar/add',
    method: 'post',
    data,
  })
}
// 网吧解绑
export function unbound(data) {
  return request({
    url: '/internetbar/del',
    method: 'post',
    data,
  })
}
// 移动分组
export function moveGroup(data) {
  return request({
    url: '/internetbar/move',
    method: 'post',
    data,
  })
}

/**
 * 网吧分组
 */
// 获取分组列表
export function getgroupOptions() {
  return request({
    url: '/InternetbarGrouping/list',
    method: 'get',
  })
}

// 添加分组
export function addGroup(form) {
  return request({
    url: '/InternetbarGrouping/add',
    method: 'post',
    data: form,
  })
}

// 编辑分组
export function editGroup(form) {
  return request({
    url: '/InternetbarGrouping/edit',
    method: 'post',
    data: form,
  })
}

// 删除分组
export function delGroup(data) {
  return request({
    url: '/InternetbarGrouping/del',
    method: 'post',
    data: data,
  })
}

// 获取网吧规则信息(id)
export function ruleDetail(data) {
  return request({
    url: '/Internetbar/tree',
    method: 'post',
    data,
  })
}

// 获取网吧规则信息(全部)
export function allNetworkRules() {
  return request({
    url: '/RuleGrouping/treeform',
    method: 'get',
  })
}

// 提交网吧规则
export function formNetworkRules(data) {
  return request({
    url: '/Internetbar/giveRule',
    method: 'post',
    data,
  })
}
// 获取所有的规则列表
export function ruleList() {
  return request({
    url: '/rule/list',
    method: 'get',
  })
}
