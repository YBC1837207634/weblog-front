import request from "../utils/request";

// 关注，取消关注
export function relation(data) {
    return request.request({
        method: 'post',
        url: '/relation/modify',
        isToken:true,
        data
    })
}

export function getList(params) {
    return request.request({
        method: 'get',
        url: '/relation/list',
        isToken:true,
        params
    })
}

//

export function query(params) {
    return request.request({
        method: 'get',
        url: '/relation/query',
        isToken: true,
        params
    })
}
