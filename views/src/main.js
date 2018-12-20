// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '../theme/index.css'
import "babel-polyfill";

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ClientRequest from './request/client'

import Vuex from 'vuex'
Vue.use(Vuex);

//引用element-ui
import ElementUI from 'element-ui';
Vue.use(ElementUI, { locale })
import locale from 'element-ui/lib/locale/lang/en'

Vue.prototype.getConfigJson=function(){
  
    if (process.env.NODE_ENV === 'development') {
      ClientRequest.defaults.baseURL = "http://192.168.0.4:19893"
      return
    }
    this.$http.get("dist/config.json").then((result)=>{
      ClientRequest.defaults.baseURL = result.body.ApiUrl
    }).catch((error)=>{
      this.$message.warning("Invalid configure. Please contact administrator!")
    });
}  

 Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
