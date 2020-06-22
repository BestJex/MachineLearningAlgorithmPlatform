import router from './router'
import store from './store'
import { Message } from 'element-ui'
import auth from '@/utils/auth'

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  const hasToken = auth.getToken()

  if (hasToken) {
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' })
    } else {
      try {
        next()
      } catch (error) {
        await store.dispatch('user/Logout')
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})