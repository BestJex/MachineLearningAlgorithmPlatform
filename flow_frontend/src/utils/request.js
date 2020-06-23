import axios from 'axios'
import jwt from '@/utils/jwt'
import store from '@/store'
import router from '@/router'
import configJS from '@/statics/config'
import { Message, MessageBox } from 'element-ui'
import auth from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: configJS.BASE_API,
  withCredentials: true,
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (auth.getToken()) {
      // 验证token是否过期
        const payload = jwt.payload_decode(auth.getToken());
        const now = Date.parse(new Date());
        if (now / 1000 > payload.exp) {
        store.dispatch('user/Logout')
        router.push('/login')
        return Promise.reject({
            response: { data: "signature expire" }
        })
      }
      config.headers['Authorization'] = 'JWT ' + auth.getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  res => {
    /**
    * code为非200是抛错 可结合自己业务进行修改
    */
    if (res.status == 202 || res.status == 201 || res.status == 200) {
      // Promise.resolve(res.data)
      return Promise.resolve(res.data)
    } else {
      Message({
        message: res.data,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res.data)
    }
  },
  error => {
    // Message({
    //   message: error,
    //   type: 'error',
    //   duration: 5 * 1000
    // });
    return Promise.reject(error.response.data)
  }
)

export default service