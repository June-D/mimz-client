// src/plugins/request.js

import axios from 'axios'

import router from '../router'


//定义服务发送地址
//let baseURL = 'https://127.0.0.1:8443/api'

//定义axios请求
const service = axios.create({
    baseURL: process.env.BASE_API,
    withCredentials: true, // 允许携带cookie
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 3600000  // 定义超时时间，60 * 60 * 1000 简化为 3600000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在localStorage中获取token并设置到请求头中
        const token = localStorage.getItem('token') || sessionStorage.token;
        if (token) {
            config.headers['Mimztoken'] = token;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        console.error('请求错误：', error); // for debug
        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code === 0) {
            return res.data;
        } else if (res.code === 600) {
            // 登录超时，清除token
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            return Promise.reject(new Error('登录超时，请重新登录')).then(() => {
                // 跳转到登录页面
                router.replace('/login');
            });
        }else if (res.code === 700) { // 未激活
            // 跳转到绑定邮箱页面
            router.replace('/email-verification', { userId: res.message });
        } else {
            const errorMessage = res.message || 'Error';
            return Promise.reject(new Error(errorMessage));
        }
    },
    error => {
        const status = error.response?.status;
        const errorMessage = status ? {
            400: '操作失败，数据有误',
            401: '登录超时',
            403: '拒绝访问',
            404: '未找到对应服务',
            408: '请示超时',
            500: '服务器内部错误',
            501: '服务未实现',
            502: '网络错误',
            503: '服务不可用',
            504: '网络超时',
            505: 'http版本不受支持',
        }[status] || '连接出错' : '连接出错';
        console.error(errorMessage); // for debug
        return Promise.reject(new Error(errorMessage));
    }
);


export default service