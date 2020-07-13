import auth from '@/utils/auth'
import userApi from '@/api/user.js'
import { Message } from 'element-ui'
import jwt from '@/utils/jwt'

const state = {
  token: auth.getToken(),
  userId: auth.getToken() ? jwt.payload_decode(auth.getToken()).userId : 0,
  username: auth.getToken() ? jwt.payload_decode(auth.getToken()).username : '',
}

const mutations = {
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  Login({ commit }, data) {
    return new Promise((resolve, reject) => {
      userApi.login(data).then(res => {
        res = res.data
        auth.setToken(res.token)
        commit('SET_TOKEN', res.token)
        commit('SET_USERNAME', res.username)
        commit('SET_USERID', res.userId)
        resolve()
      }).catch(err => {
        Message({
          message: err.data,
          type: 'error',
          duration: 3 * 1000
        })
        reject(err)
      })
    })
  },
  Register({ commit }, data) {
    return new Promise((resolve, reject) => {
      userApi.register(data).then(res => {
        res = res.data
        auth.setToken(res.token)
        commit('SET_TOKEN', res.token)
        commit('SET_USERNAME', res.username)
        commit('SET_USERID', res.userId)
        resolve()
      }).catch(err => {
        Message({
          message: err.data,
          type: 'error',
          duration: 3 * 1000
        })
        reject(err)
      })
    })
  },
  Logout({ commit }) {
    return new Promise((resolve, reject) => {
      auth.removeToken()
      commit('SET_TOKEN', null)
      commit('SET_USERNAME', '')
      commit('SET_USERID', 0)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}