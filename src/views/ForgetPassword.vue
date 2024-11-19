<script setup>

</script>

<template>
  <body class="bg-gray-100">
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">重置密码</h2>
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
      <form @submit.prevent="resetPassword" class="mt-6">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="verificationCode">验证码</label>
          <input v-model="form.verificationCode"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 id="verificationCode" type="text" placeholder="验证码">
          <p v-if="errors.verificationCode" class="text-red-500 text-xs italic">{{ errors.verificationCode }}</p>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="newPassword">新密码</label>
          <input :type="showNewPassword ? 'text' : 'password'" v-model="form.newPassword"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 id="newPassword" placeholder="新密码">
          <i class="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 cursor-pointer" @click="toggleNewPassword"><font-awesome-icon :icon="['fas', showNewPassword ? 'eye-slash' : 'eye']"/></i>
          <p v-if="errors.newPassword" class="text-red-500 text-xs italic">{{ errors.newPassword }}</p>
        </div>
        <div class="mb-4 relative">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="confirmNewPassword">确认新密码</label>
          <input :type="showConfirmNewPassword ? 'text' : 'password'" v-model="form.confirmNewPassword"
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 id="confirmNewPassword" placeholder="确认新密码">
          <i class="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 cursor-pointer" @click="toggleConfirmNewPassword"><font-awesome-icon :icon="['fas', showConfirmNewPassword ? 'eye-slash' : 'eye']"/></i>
          <p v-if="errors.confirmNewPassword" class="text-red-500 text-xs italic">{{ errors.confirmNewPassword }}</p>
        </div>
        <div class="flex items-center justify-between">
          <button
              class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit">
            重置密码
          </button>
        </div>
      </form>
      <div class="mt-4 text-center text-sm">
        <a @click="this.$router.replace('/login')" class="text-blue-500 hover:text-blue-700 ">去登录</a>
      </div>
      <p class="text-center text-gray-500 text-xs mt-6">
        &copy;2023 MIMZ. All rights reserved.
      </p>
    </div>
  </div>

  </body>
</template>

<script>

import {Post} from "@/plugins/http.js";

export default {
  name: 'ForgetPassword',
  data() {
    return {
      form: {
        email: '',
        verificationCode: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      errors: {},
      send: {},
      isSending: false,
      countdown: 60,
      loading: false,
      showNewPassword: false,
      showConfirmNewPassword: false
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
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmNewPassword() {
      this.showConfirmNewPassword = !this.showConfirmNewPassword;
    },
    sendVerificationCode() {
      this.errors = this.validateEmail();
      if (Object.keys(this.errors).length === 0) {
        // Handle sending verification code logic here
        this.loading = true;
        console.log('Verification code sent to:', this.form.email);
        Post('/email/sendVerificationCode', {email: this.form.email, codyType: 'gywijdkw1'})
            .then(() => {
              this.startCountdown();
              this.send.error = '';
              this.send.success = '验证码已发送至邮箱，10分钟内有效。';
              localStorage.setItem('countdown', Math.floor(Date.now() / 1000) + this.countdown);
            })
            .catch(error => {
              this.send.success = '';
              this.send.error = error.message;
              console.error('Error sending verification code:', error);
            })
            .finally(() => {
              this.loading = false;
            });
      }
    },
    async resetPassword() {
      this.errors = this.validateResetForm();
      if (Object.keys(this.errors).length === 0) {
        // Handle password reset logic here
        console.log('Password reset for:', this.form.email);
        const b = await Post('/password/reset', {
          email: this.form.email,
          verCode: this.form.verificationCode,
          codyType: 'gywijdkw1',
          password: this.form.newPassword,
        })
        if (b === 0) {
          this.$router.push('/reset-password-success');
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
    validateResetForm() {
      const errors = this.validateEmail();

      if (!this.form.verificationCode) {
        errors.verificationCode = '验证码不能为空';
      }
      if (!this.form.newPassword) {
        errors.newPassword = '新密码不能为空';
      } else if (!this.validPassword(this.form.newPassword)) {
        errors.newPassword = '密码长度必须至少为8个字符，包括大写、小写、数字和特殊字符';
      }
      if (!this.form.confirmNewPassword) {
        errors.confirmNewPassword = '确认新密码不能为空';
      } else if (this.form.newPassword !== this.form.confirmNewPassword) {
        errors.confirmNewPassword = '密码不匹配';
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
    }
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>