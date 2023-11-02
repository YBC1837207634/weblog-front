export function getToken() {
    return localStorage.getItem('token')
}

export function setToken(token) {
    localStorage.setItem('token',token)
}

export function removeToken() {
    localStorage.removeItem('token')
}


export function getUid() {
    return localStorage.getItem('uid')
}

export function setUid(uid) {
    localStorage.setItem('uid', uid)
}

export function removeUid() {
    localStorage.removeItem('uid')
}
