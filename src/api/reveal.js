import request from '../utils/request'

// export function userRank(num = 5) {
//     return request.request({
//         method: 'get',
//         url: '/reveal/user/rank/' + num,
//         isToken:true,
//     })
// }

// export function articleRank(num = 5) {
//     return request.request({
//         method: 'get',
//         url: '/reveal/article/rank/' + num,
//         isToken:true,
//     })
// }

export function articleRank() {
  return request.request({
    method: 'get',
    url: '/reveal/article/rank',
    isToken: true
  })
}
