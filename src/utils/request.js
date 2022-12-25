//添加请求拦截器
http.interceptors.request.use(function (config) {
    //在发送请求前干什么
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    let token = localStorage.getItem('token')
    if (!config.headers.hasOwnProperty('token') && token) {
        config.headers.token = token
    }
    return config
}, function (error) {
    return Promise.reject(error)
});
//添加响应拦截器
http.interceptors.response.use(function (response) {
    //在响应数据干什么
    return response;
}, function (error) {
    return Promise.reject(error)
});