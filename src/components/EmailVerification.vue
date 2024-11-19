<script setup>

import LogoutConfirm from "@/components/LogoutConfirm.vue";
</script>

<template>
  <div class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button @click="showLogoutConfirm = true" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']"/>
        </button>
        <h2 class="text-2xl font-bold mb-6 text-gray-800">邮箱验证</h2>
        <form @submit.prevent="sendVerificationCode">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">邮箱地址</label>
            <input v-model="form.email"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   id="email" type="email" placeholder="邮箱地址">
            <p v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email }}</p>
          </div>
          <div class="flex items-center justify-between">
            <button :disabled="isSending"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit">
              <span v-if="loading" class="spinner"></span>
              {{ isSending ? `${countdown}秒后重新发送` : '发送验证码' }}
            </button>
            <p v-if="send.error" class="text-red-500 text-xs italic">{{ send.error }}</p>
            <p v-if="send.success" class="text-blue-500 text-xs italic">{{ send.success }}</p>
          </div>
        </form>
        <form @submit.prevent="validatSubmit" class="mt-6">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="verificationCode">验证码</label>
            <input v-model="form.verificationCode" :disabled="!verificationCodeSent"
                   class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   id="verificationCode" type="text" placeholder="验证码">
            <p v-if="errors.verificationCode" class="text-red-500 text-xs italic">{{ errors.verificationCode }}</p>
          </div>
          <div class="flex items-center justify-between">
            <button :disabled="!verificationCodeSent"
                    class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit">
              提交验证
            </button>
          </div>
        </form>
        <p class="text-center text-gray-500 text-xs mt-6">
          &copy;2023 MIMZ. All rights reserved.
        </p>
      </div>
    </div>
    <!-- Logout Confirm Modal -->
    <div v-if="showLogoutConfirm" @click.self="showLogoutConfirm = false"
         class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <LogoutConfirm @close="showLogoutConfirm = false"></LogoutConfirm>
    </div>
  </div>
</template>

<script>

import {Post} from "@/plugins/http.js";

export default {
  name: 'EmailVerification',
  data() {
    return {
      form: {
        email: '',
        verificationCode: '',
      },
      send: {},
      errors: {},
      isSending: false,
      countdown: 60,
      showLogoutConfirm: false,
      verificationCodeSent: false, // 新增标志位
      loading: false,
    };
  },
  mounted() {
    const savedCountdown = localStorage.getItem('countdown');
    if (savedCountdown) {
      const remainingTime = parseInt(savedCountdown) - Math.floor(Date.now() / 1000);
      if (remainingTime > 0) { // still valid
        this.countdown = remainingTime;
        this.isSending = true;
        this.startCountdown();
      }
    }
  },
  methods: {
    sendVerificationCode() {
      this.errors = this.validateEmail();
      if (Object.keys(this.errors).length === 0) {
        // Handle sending verification code logic here
        this.loading = true;
        console.log('Verification code sent to:', this.form.email);
        Post('/email/sendVerificationCode', {email: this.form.email, codyType: 'jkasiuo'})
            .then(() => {
              this.startCountdown();
              this.verificationCodeSent = true; // 设置标志位
              this.send.error = '';
              this.send.success = '验证码已发送至邮箱，请注意查收';
              localStorage.setItem('countdown', Math.floor(Date.now() / 1000) + this.countdown);
            })
            .catch((error) => {
              this.send.success = '';
              this.send.error = error.message;
              console.error('Error sending verification code:', error);
            })
            .finally(() => {
              this.loading = false;
            });
      }
    },
    async validatSubmit() {
      this.errors = this.validateSubmitForm();
      if (Object.keys(this.errors).length === 0) {
        const b = await Post('/email/submitVerCode', {
          email: this.form.email,
          verCode: this.form.verificationCode,
          codyType: 'jkasiuo'
        })
        if (b === 0) {
          this.$router.push('/');
        } else {
          this.errors.verificationCode = '验证码错误，请重新输入';
        }
      }
    },
    validateEmail() {
      const errors = {};
      if (!this.form.email) {
        errors.email = '邮箱地址不能为空';
      } else if (!this.validEmail(this.form.email)) {
        errors.email = '邮箱地址格式不正确';
      }
      return errors;
    },
    validateSubmitForm() {
      const errors = {};
      if (!this.form.verificationCode) {
        errors.verificationCode = '验证码不能为空';
      }
      if (!this.form.email) {
        errors.email = '邮箱地址不能为空';
      }
      return errors;
    },
    validEmail(email) {
      const re = /^(([^<>()$\\.,;:\s@"]+(\.[^<>()$\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
      return re.test(email);
    },
    startCountdown() {
      this.isSending = true;
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.isSending = false;
          this.countdown = 60;
          localStorage.removeItem('countdown');
        }
      }, 1000);
    },
  }
};
</script>

<style scoped>
a {
  cursor: pointer;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 16px;
  height: 16px;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
