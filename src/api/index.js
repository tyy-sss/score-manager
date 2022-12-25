// 请求首页数据
export const getData = () =>{
    //返回一个pormise对象
    return this.$http.get('/managerHome/getData')
}
// // 请求添加用户数据
// export const addUser = (params) =>{
//     return axios({
//         method: 'post',
//         url: http.post('/managerUser/add'),
//         data: qs.stringify(params)
//     })
// }