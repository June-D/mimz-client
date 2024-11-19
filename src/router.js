// src/router.js is the file that contains the routes for the application.
import {createRouter, createWebHistory} from 'vue-router'
import Home from './views/Home.vue'
import Meeting from './views/Meeting.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NotFound from './views/NotFound.vue'
import ForgetPassword from "@/views/ForgetPassword.vue";
import ResetPasswordSuccess from "@/components/ResetPasswordSuccess.vue";

// 引入axios实例
import {Get} from '@/plugins/http.js';
import EmailVerification from "@/components/EmailVerification.vue";
import store from './store'

const routes = [

    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {requiresAuth: true}
    },
    {
        path: '/meeting/:roomId',
        name: 'meeting',
        component: Meeting,
        meta: {requiresAuth: true}
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {requiresAuth: false, redirectIfAuth: true}
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {requiresAuth: false, redirectIfAuth: true}
    },
    {
        path: '/forget-password',
        name: 'ForgetPassword',
        component: ForgetPassword,
        meta: {requiresAuth: false, redirectIfAuth: true}
    },
    {
        path: '/reset-password-success',
        name: 'ResetPasswordSuccess',
        component: ResetPasswordSuccess,
        meta: {requiresAuth: false, redirectIfAuth: true}
    },
    {
        path: '/email-verification',
        name: 'EmailVerification',
        component: EmailVerification,
        meta: {requiresAuth: true, redirectIfAuth: false}
    },
    {
        path: '/notfound',
        name: 'notfound',
        component: NotFound,
        meta: {requiresAuth: true}
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 这个路由需要认证，检查认证状态
    Get('/login/isLoginStatus', null).then(status => {
        if (status === 0) {// 用户未登录, 只能跳转到登录页面、注册页面和忘记密码页面
            if (to.path === '/login' || to.path === '/register' || to.path === '/forget-password'|| to.path === '/reset-password-success') {
                next(); // 允许访问
            } else {
                next({
                    path: '/login',
                    query: {redirect: to.fullPath} // 将要访问的路由path作为参数，登录成功后跳转到该路由
                });
            }
        } else if (status === 1) { // 用户未激活，重定向到邮箱验证页面
            if (to.path !== '/email-verification') {
                next('/email-verification');
            } else {
                next();
            }
        } else {
            // 已登录，但是用户信息为空
            if (store.getters.getUser===null || store.getters.getUser === undefined) {
                Get('/user/getUserInfo', null).then(res => {
                    store.dispatch('login', res);
                });
            }
            // 用户已登录，不能访问登录页面、注册页面、忘记密码页面和邮箱验证页面
            if (to.path === '/login' || to.path === '/register' || to.path === '/forget-password' || to.path === '/email-verification') {
                next('/'); // 重定向到首页
            } else {
                next(); // 否则 正常访问
            }
        }
    }).catch(error => {
        console.log(error)
        next('/notfound'); // 或者其他你希望用户登录后重定向到的页面
    })
});

export default router;