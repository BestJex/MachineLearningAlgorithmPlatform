import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/project',
      children: [
        {
          path: 'project',
          component: () => import('@/views/project'),
          name: 'Project'
        }
      ]
    },
    {
      path: '/graph/',
      component: Layout,
      hidden: true,
      children: [
        {
          path: ':id',
          component: () => import('@/components/G6Editor'),
          name: 'Graph'
        }
      ]
    },
    {
      path: '/personal/',
      component: Layout,
      hidden: true,
      children: [
        {
          path: ':id',
          component: () => import('@/components/PersonalCenter/PersonalCenter'),
          name: 'PersonalCenter'
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      redirect: '/project'
    },
    {
      path: '/login',
      component: () => import('@/views/login/index'),
    },
    {
      path: '/register',
      component: () => import('@/views/register/index'),
    }
  ]
})