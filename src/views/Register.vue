<script setup>
import TermsOfService from '../components/TermsOfService.vue';
import PrivacyPolicy from '../components/PrivacyPolicy.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">创建账户</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">用户名</label>
          <input v-model="form.username" @blur="checkUsernameAvailability"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 id="username" type="text" placeholder="用户名">
          <p v-if="errors.username" class="text-red-500 text-xs italic">{{ errors.username }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">密码</label>
          <input v-model="form.password"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 id="password" type="password" placeholder="密码">
          <p v-if="errors.password" class="text-red-500 text-xs italic">{{ errors.password }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="confirmPassword">确认密码</label>
          <input v-model="form.confirmPassword"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 id="confirmPassword" type="password" placeholder="确认密码">
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs italic">{{ errors.confirmPassword }}</p>
        </div>
        <div class="mb-4">
          <input v-model="form.agreeToTerms" type="checkbox" id="agreeToTerms" class="mr-2 leading-tight">
          <label for="agreeToTerms" class="text-gray-700 text-sm">
            我已阅读并同意 <a href="#" @click.prevent="showTerms = true"
                              class="text-blue-500 hover:text-blue-700">服务协议</a> 和 <a href="#"
                                                                                           @click.prevent="showPrivacy = true"
                                                                                           class="text-blue-500 hover:text-blue-700">用户隐私协议</a>.
          </label>
          <p v-if="errors.agreeToTerms" class="text-red-500 text-xs italic">{{ errors.agreeToTerms }}</p>
        </div>
        <div class="flex items-center justify-between">
          <button
              class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit">
            注册
          </button>
        </div>
      </form>
      <div class="mt-4 text-center text-sm">
        <a @click="this.$router.push('/login')" class="text-blue-500 hover:text-blue-700">返回登录</a>
      </div>
      <p class="text-center text-gray-500 text-xs mt-6">
        &copy;2023 MIMZ. All rights reserved.
      </p>
    </div>
    <!-- Terms of Service Modal -->
    <div v-if="showTerms" @click.self="showTerms = false"
         class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <TermsOfService @close="showTerms = false"/>
    </div>
    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacy" @click.self="showPrivacy = false"
         class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <PrivacyPolicy @close="showPrivacy = false"/>
    </div>
  </div>

</template>

<script>

import {Get, Post} from "@/plugins/http.js";

export default {
  name: 'Register',
  data() {
    return {
      showTerms: false,
      showPrivacy: false,
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      },
      errors: {}
    };
  },
  methods: {
    async register() {
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length === 0) {
        // 发送注册请求到服务器
        await Post('/register/preRegister', this.form)
            .then(response => {
              // 重定向到登录页面
              this.$router.replace('/login');
            })
            .catch(error => {
              console.error("注册失败:", error);
            });
      }
    },
    validateForm() {
      const errors = {};
      if (!this.form.username) {
        errors.username = '用户名必填';
      } else if (!this.validUsername(this.form.username)) {
        errors.username = '用户名必须只包含英文字母和阿拉伯数字，并且以英文字母开头';
      } else if(this.errors.username) {
        errors.username = this.errors.username;
      }
      if (!this.form.password) {
        errors.password = '密码必填';
      } else if (!this.validPassword(this.form.password)) {
        errors.password = '密码长度必须至少为8个字符，包括大写、小写、数字和特殊字符';
      }
      if (!this.form.confirmPassword) {
        errors.confirmPassword = '确认密码必填';
      } else if (this.form.password !== this.form.confirmPassword) {
        errors.confirmPassword = '密码不匹配';
      }
      if (!this.form.agreeToTerms) {
        errors.agreeToTerms = '您必须同意条款和隐私政策。';
      }
      return errors;
    },
    validEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
      return re.test(email);
    },
    validPassword(password) {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return re.test(password);
    },
    validUsername(username) {
      const re = /^[a-zA-Z][a-zA-Z0-9]*$/;
      return re.test(username);
    },
    async checkUsernameAvailability() {
      if (this.form.username && /^[a-zA-Z][a-zA-Z0-9]*$/.test(this.form.username)) {
        try {
          const canUse = await Get('/register/usernameUniqueCheck', {username: this.form.username});
          if (!canUse) {
            this.errors.username = '用户名已被占用';
          } else {
            this.errors.username = '';
          }
        } catch (error) {
          console.error("检查用户名失败:", error);
        }
      } else {
        this.errors.username = '用户名必须只包含英文字母和阿拉伯数字，并且以英文字母开头';
      }
    }
  }
}
</script>

<style scoped>
a {
  cursor: pointer;
}

</style>