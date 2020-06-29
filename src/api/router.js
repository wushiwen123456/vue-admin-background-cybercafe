import request from '@/utils/request'

export function getRouterList(data) {
  return request({
    url: 'Menus',
    method: 'get',
    data,
  })
}
