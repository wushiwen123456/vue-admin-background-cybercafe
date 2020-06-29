import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/internetbar/internetbarList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/internetbar/edit',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/internetbar/add',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '',
    method: 'post',
    data,
  })
}

export function getgroupOptions() {
  return request({
    url: '/InternetbarGrouping/list',
    method: 'get',
  })
}
