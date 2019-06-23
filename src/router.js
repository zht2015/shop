import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const r = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path:'/',
      redirect:'/welcome'
    },
    
    {
      path: '/home',
      component: () => import('./views/Home.vue'),
      children:[
        {path: '/welcome',component: () => import('./views/Welcome.vue')},
        {path: '/users',component: () => import('./views/UserList.vue')},
        {path: '/roles',component: () => import('./views/RoleList.vue')},
        {path: '/goods',component: () => import('./views/goods/Goods.vue')},
      ]
    },
    {
      path: '/login',
      component: () => import('./views/Login.vue')
    }
  ]
})

r.beforeEach((to, from, next)=>{
  // /login 允许访问
  if(to.path == '/login') return next()
  // 取出令牌
  let token = sessionStorage.getItem('token')
  // 如果有令牌
  if(token) 
    return next()
  else 
    return next('/login')

})


export default r
