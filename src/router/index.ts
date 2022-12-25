import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { component } from 'vue/types/umd'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    // 重定向首页
    path: '/',
    redirect: '/home',
    name: 'main',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/common/Login.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Test.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//设置全局守卫来判断是否存在token，不存在就返回登录页
router.beforeEach((to, from, next) => {
  //to到哪儿  from从哪儿离开  next跳转 为空就是放行  
  if (to.path === '/login' || to.path == '/homePage' || to.path == '/register') {
    //如果跳转为登录，就放行 
    next();
  } else {
    //取出localStorage判断
    let token = localStorage.getItem('token');
    // localStorage.clear();
    // console.log(token,'token');
    if (token == null || token === '') {
      alert('请先登录')
      next({ name: 'login' });
    } else {
      next();
    }
  }
});

export default router
