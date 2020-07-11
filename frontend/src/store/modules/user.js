import jwt from "@/utils/jwt";
import auth from "@/utils/auth";
import userApi from "@/api/user";
import webSocket from "@/config/webSocket";
import Message from "element-ui/packages/message/src/main";

const state = {
    token: auth.getToken(),
    userId: auth.getToken() ? jwt.payload_decode(auth.getToken()).userId : 0,
    username: auth.getToken() ? jwt.payload_decode(auth.getToken()).username : '',
}

const mutations = {
    setUsername: (state, username) => {
        state.username = username;
    },
    setUserId: (state, userId) => {
        state.userId = userId;
    },
    setToken: (state, token) => {
        state.token = token;
    },
}

const actions = {
    Login({ commit }, data) {
        return new Promise((resolve, reject) => {
            userApi.login(data).then(response => {
                response = response.data;
                auth.setToken(response.token);
                commit('setUsername', response.username);
                commit('setUserId', response.userId);
                commit('setToken', response.token);
                webSocket.initWebSocket();
                resolve();
            }).catch(err => {
                Message({
                    message: err.data,
                    type: 'error',
                    duration: 3 * 1000,
                });
                reject(err);
            })
        })
    },
    Register({ commit }, data) {
        return new Promise((resolve, reject) => {
            userApi.register(data).then(response => {
                response = response.data;
                auth.setToken(response.token);
                commit('setUsername', response.username);
                commit('setUserId', response.userId);
                commit('setToken', response.token);
                webSocket.initWebSocket();
                resolve();
            }).catch(err => {
                Message({
                    message: err.data,
                    type: 'error',
                    duration: 3 * 1000,
                });
                reject(err);
            })
        })
    },
    Logout({ commit }) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            auth.removeToken();
            commit('setUsername', '');
            commit('setUserId', 0);
            commit('setToken', null);
            resolve();
        });
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}