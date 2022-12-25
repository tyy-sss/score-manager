import Vue from 'vue';
import router from './router'
import store from './store'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import axios from 'axios'
//配置请求根路径
axios.defaults.baseURL = "http://localhost:8088"                                 
//将axios作为全局的自定义属性，每个组件可以在内部组件访问
Vue.prototype.$http = axios

import "./api/mock"

//添加全局前置导航守卫
router.beforeEach((to, from, next) => {
  //判断token是否存在
  // localStorage.setItem("token", message.data.token);
  const token = localStorage.getItem("token");
  // localStorage.clear();
  console.log(token,'token')
  if( !token && to.name !== 'login' ){//token不存在，没有登录
      next({ name : 'login' })
  } else {
    next();
  }
})

new Vue({
  router,
  store,
  el: '#app',
  created() {
    store.commit('addMenu',router)
  },
  render: h => h(App)
});