import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Register from '@/views/Register.vue'
import UploadExcel from '@/views/UploadExcel.vue'



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes:[
    {
      path: '*',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/upload',
      name: 'uploadExcel',
      component: UploadExcel
    }
  ]
})

