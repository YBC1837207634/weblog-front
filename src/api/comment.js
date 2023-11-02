import request from "../utils/request";

// 登陆记录查询
export function getComment(params) {
    return request.request({
        method: 'get',
        url: '/comment/list',
        isToken:true,
        params
    })
}

// 登陆记录查询
export function push(data) {
    return request.request({
        method: 'post',
        url: '/comment/push',
        isToken:true,
        data
    })
}
