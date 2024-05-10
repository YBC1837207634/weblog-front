import request from '../utils/request'

// 登陆记录查询
export function getCategory() {
  return request.request({
    method: 'get',
    url: '/category/list',
    isToken: true
  })
}
