import axios from 'axios';
import store from "@/store";
import jwt from "@/utils/jwt";
import router from '@/router';
import auth from "@/utils/auth";
import apiConfig from '@/config/api';
import Message from "element-ui/packages/message/src/main";

// 使用自定义配置新建一个 axios 实例
const service = axios.create({
    baseURL: apiConfig.BaseAPI,
    withCredentials: true,
})

// request拦截器
service.interceptors.request.use(
    config => {
        // 验证 token 是否过期
        if (auth.getToken()) {
            const payload = jwt.payload_decode(auth.getToken());
            const now = Date.parse(new Date());
            if (now / 1000 > payload.exp) {
                store.dispatch('user/Logout');
                router.push('/login');
                return Promise.reject({
                    response: {data: "signature expire"}
                });
            }
            config.headers['Authorization'] = 'JWT ' + auth.getToken();
        }
        return config;
    },
    error => {
        console.log("request interceptor:", error);
        return Promise.reject(error);
    }
)

// response拦截器
service.interceptors.response.use(
    response => {
        if (response.status === 200 || response.status === 201 || response.status === 202) {
            return Promise.resolve(response.data);
        } else {
            Message({
                message: response.data,
                type: 'error',
                duration: 3 * 1000,
            })
            return Promise.reject(response.data);
        }
    },
    error => {
        Message({
          message: error,
          type: 'error',
          duration: 5 * 1000,
        });
        return Promise.reject(error.response.data);
    }
)

export default service