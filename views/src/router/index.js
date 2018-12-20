import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'


import user from '@/components/user'
import forgot_password from '@/components/forgot_password'
import home from '@/components/home'
import introduction from '@/components/introduction'
import clientlist from '@/components/clientlist'
import createclient from '@/components/createclient'
import editclient from '@/components/editclient'
import manageaddress from '@/components/manageaddress'
import validateaddress from '@/components/validate'
import erroraddress from '@/components/erroraddress'

// import operation_log from '@/components/operation_log'


Vue.use(Router)
Vue.use(VueResource)


const router = new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      redirect: '/cryptoaudit'
    
    },
    {
      path: '/cryptoaudit',
      redirect: '/cryptoaudit/home',
    },
    {
      path: '/cryptoaudit/user',
      name: 'user',
      component: user
    },
    {
      path: '/cryptoaudit/forgot_password',
      name: 'forgot_password',
      component:forgot_password
    },
    {
      path: '/cryptoaudit/home',
      name: 'home',
      component: home,
      //  redirect: '/cryptoaudit/home/clientlist',
      redirect: '/cryptoaudit/home/introduction',
      children:[
        {
          path: 'introduction',
          name:'introduction',
          component:introduction
        },
        
        {
          path: 'clientlist',
          name:'clientlist',
          component: clientlist
        },
         {
          path: 'createclient',
          name:'createclient',
          component:createclient
        },
        {
         path: 'editclient',
         name:'editclient',
         component:editclient
       },{
        path: 'address/manage',
        name:'manageaddress',
        component: manageaddress
      },
      {
        path: 'address/validate',
        name:'validateaddress',
        component: validateaddress
      },
      {
        path: 'address/error',
        name:'erroraddress',
        component: erroraddress
      }]
    }
  ],
})
router.beforeEach((to,from,next)=>{
  if(to.matched.length === 0){
    from.name ? next({name:'home'}) : next('/');
  }else{
  next();
  }
})
export default router;
