// store.js

import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls';

const ls = new SecureLS({
    isCompression: false,
    encryptionSecret: 'ds7s6s8dh$gYfgWH#4W12' // 自定义密钥
});


const store = createStore({
    plugins: [createPersistedState({
        // 配置项，可根据需要进行调整
        key: 'mimzclient', // 存储在本地存储中的键名，默认为'vuex'
        //storage: window.localStorage, // 存储位置，默认为window.localStorage，也可以设置为window.sessionStorage或自定义存储方法
        paths: ['user'], // 指定需要持久化的state属性路径数组，默认为undefined，表示持久化整个state
        storage: {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key)
        }
        // 其他可选配置项，如reducer、transformer、filter等
    })],
    state() {
        return{
            error: null, // 初始化错误信息为null
            user: null // 初始化用户信息为null
        };
    },
    mutations: {
        setError(state, error) {
            state.error = error; // 设置错误信息
        },
        clearError(state) {
            state.error = null; // 清除错误信息
        },
        setUser(state, user) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        }
    },
    actions: {
        showSuccess({ commit }, message) {
            commit('clearError'); // 提交mutation来清除错误信息
            // 显示成功信息的逻辑代码
        },
        showError({ commit }, error) {
            commit('setError', error); // 提交mutation来显示错误信息
        },
        clearError({ commit }) {
            commit('clearError'); // 提交mutation来清除错误信息
        },
        login({ commit }, user) {
            commit('setUser', user); // 提交mutation来设置用户信息
        },
        logout({ commit }) {
            commit('clearUser'); // 提交mutation来清除用户信息
        }
    },
    getters: {
        isLoggedIn(state) {
            return state.user !== null; // 通过getters来判断用户是否登录
        },
        getError(state) {
            return state.error; // 通过getters来获取错误信息
        },
        getUser(state) {
            return state.user; // 通过getters来获取用户信息
        }
    }
});

export default store;