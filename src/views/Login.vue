<script setup>
import PrivacyPolicy from "@/components/PrivacyPolicy.vue";
import TermsOfService from "@/components/TermsOfService.vue";
</script>


<template>
  <div class="flex items-center justify-center min-h-screen relative">
    <div class="background-slider">
      <img alt="" class="active" height="1080" src="@/assets/images/login-bg-0.avif" width="1920"/>
      <img alt="" class="" height="1080" src="@/assets/images/login-bg-1.avif" width="1920"/>
      <img alt="" class="" height="1080" src="@/assets/images/login-bg-3.avif" width="1920"/>
      <img alt="" class="" height="1080" src="@/assets/images/login-bg-4.avif" width="1920"/>
      <img alt="" class="" height="1080" src="@/assets/images/login-bg-5.avif" width="1920"/>
    </div>
    <div class="background-overlay"></div>
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative z-10">
      <div class="absolute top-4 right-4">
        <i class="text-gray-700 cursor-pointer" @click="showSettings = true"><font-awesome-icon :icon="['fas', 'cog']"/></i>
      </div>
      <h2 class="text-2xl font-bold mb-6 text-center">登录</h2>
      <div class="mb-4">
        <button :class="{'bg-blue-500 text-white': loginMethod === 'account', 'bg-gray-200': loginMethod !== 'account'}" @click="setLoginMethod('account')" class="w-full py-2 rounded mb-2 flex items-center justify-center">
          <i class="mr-2"><font-awesome-icon :icon="['fas', 'user']"/></i> 账号密码登录
        </button>
        <button :class="{'bg-blue-500 text-white': loginMethod === 'phone', 'bg-gray-200': loginMethod !== 'phone'}" @click="setLoginMethod('phone')" class="w-full py-2 rounded mb-2 flex items-center justify-center">
          <i class="mr-2"><font-awesome-icon :icon="['fas', 'mobile-alt']"/></i> 手机验证码登录
        </button>
        <button :class="{'bg-blue-500 text-white': loginMethod === 'email', 'bg-gray-200': loginMethod !== 'email'}" @click="setLoginMethod('email')" class="w-full py-2 rounded flex items-center justify-center">
          <i class="mr-2"><font-awesome-icon :icon="['fas', 'envelope']"/></i> 邮件验证码登录
        </button>
      </div>
      <form @submit.prevent="login">
        <div class="mb-4" v-if="loginMethod === 'account'">
          <label class="block mb-2">账号</label>
          <input class="w-full p-2 border rounded" placeholder="请输入账号" type="text" v-model="account"/>
          <label class="block mb-2 mt-4">密码</label>
          <input class="w-full p-2 border rounded" placeholder="请输入密码" type="password" v-model="password"/>
        </div>
        <div class="mb-4" v-if="loginMethod === 'phone'">
          <label class="block mb-2">手机号</label>
          <div class="flex">
            <input class="w-full p-2 border rounded-l" placeholder="请输入手机号" type="text" v-model="phone"/>
            <button :disabled="phoneCodeSent" type="button" @click="sendPhoneCode" class="bg-blue-500 text-white p-2 rounded-r disabled:opacity-50 whitespace-nowrap">{{ phoneCodeSent ? `${countdown}s` : '发送验证码' }}</button>
          </div>
          <label class="block mb-2 mt-4">验证码</label>
          <input class="w-full p-2 border rounded" placeholder="请输入验证码" type="text" v-model="phoneCode" :disabled="!phoneCodeSent"/>
        </div>
        <div class="mb-4" v-if="loginMethod === 'email'">
          <label class="block mb-2">邮件</label>
          <div class="flex">
            <input class="w-full p-2 border rounded-l" placeholder="请输入邮件" type="email" v-model="email"/>
            <button :disabled="emailCodeSent" type="button" @click="sendEmailCode" class="bg-blue-500 text-white p-2 rounded-r disabled:opacity-50 whitespace-nowrap">{{ emailCodeSent ? `${countdown}s` : '发送验证码' }}</button>
          </div>
          <label class="block mb-2 mt-4">验证码</label>
          <input class="w-full p-2 border rounded" placeholder="请输入验证码" type="text" v-model="emailCode" :disabled="!emailCodeSent"/>
        </div>
        <div class="mb-4">
          <label class="inline-flex items-center">
            <input class="form-checkbox" type="checkbox" v-model="agreed"/>
            <span class="ml-2">我已阅读并同意 <a class="text-blue-500" href="#" @click.prevent="showTerms = true">服务协议</a> 和 <a class="text-blue-500" href="#" @click.prevent="showPrivacy = true">用户隐私协议</a></span>
          </label>
        </div>
        <div class="mb-4 text-red-500" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        <button :disabled="!agreed" class="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50" type="submit">登录</button>
        <div class="text-center mt-4 text-sm ">
          <a @click.prevent="this.$router.replace('/forget-password')" class="text-blue-500  ">忘记密码？</a>
          <a @click="this.$router.replace('/register')" class="text-blue-500 hover:underline">没有账号？注册</a>
        </div>
      </form>
    </div>
    <!-- Terms of Service Modal -->
    <div v-if="showTerms" @click.self="showTerms = false" class="fixed inset-0 z-20 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <TermsOfService @close="showTerms = false" />
    </div>
    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacy" @click.self="showPrivacy = false" class="fixed inset-0 z-20 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <PrivacyPolicy @close="showPrivacy = false" />
    </div>
  </div>
</template>

<script>

// 引入axios实例
import {Post,Get} from '@/plugins/http.js';

export default {
  name: 'Login',
  data() {
    return {
      loginMethod: 'account',
      account: '',
      password: '',
      phone: '',
      phoneCode: '',
      email: '',
      emailCode: '',
      agreed: false,
      phoneCodeSent: false,
      emailCodeSent: false,
      countdown: 60,
      showTerms: false,
      showPrivacy: false,
      showSettings: false
    };
  },
  computed: {
    errorMessage() {
      return this.$store.state.error;
    }
  },
  methods: {
    setLoginMethod(method) {
      this.loginMethod = method;
      this.$store.dispatch('clearError');
    },
    async sendPhoneCode() {
      if (!this.phone) {
        this.$store.dispatch('showError', '请输入手机号');
        return;
      }
      if (!this.agreed) {
        this.$store.dispatch('showError', '请同意服务协议和用户隐私协议');
        return;
      }
      this.$store.dispatch('clearError');
      try {
        await Post('/login/sendPhoneCode', { phone: this.phone });
        this.phoneCodeSent = true;
        this.startCountdown();
      } catch (error) {
        this.$store.dispatch('showError', '发送验证码失败，请稍后再试');
      }
    },
    async sendEmailCode() {
      if (!this.email) {
        this.$store.dispatch('showError', '请输入邮件地址');
        return;
      }
      if (!this.agreed) {
        this.$store.dispatch('showError', '请同意服务协议和用户隐私协议');
        return;
      }
      this.$store.dispatch('clearError');
      try {
        await Post('/login/sendEmailCode', { email: this.email });
        this.emailCodeSent = true;
        this.startCountdown();
      } catch (error) {
        this.$store.dispatch('showError', '发送验证码失败，请稍后再试');
      }
    },
    startCountdown() {
      this.countdown = 60;
      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(interval);
          this.phoneCodeSent = false;
          this.emailCodeSent = false;
        }
      }, 1000);
    },
    async login() {
      if (!this.agreed) {
        this.$store.dispatch('showError', '请同意服务协议和用户隐私协议');
        return;
      }

      let payload = { method: this.loginMethod, device:"pc" };

      if (this.loginMethod === 'account') {
        if (!this.account || !this.password) {
          this.$store.dispatch('showError', '请输入账号和密码');
          return;
        }
        payload = { ...payload,type: 'username', username: this.account, password: this.password };
      } else if (this.loginMethod === 'phone') {
        if (!this.phone || !this.phoneCode) {
          this.$store.dispatch('showError', '请输入手机号和验证码');
          return;
        }
        payload = { ...payload,type: 'phone', username: this.phone, password: this.phoneCode };
      } else if (this.loginMethod === 'email') {
        if (!this.email || !this.emailCode) {
          this.$store.dispatch('showError', '请输入邮件和验证码');
          return;
        }
        payload = { ...payload,type: 'email', username: this.email, password: this.emailCode };
      }

      this.$store.dispatch('clearError');

      try {
        const token = await Post('/login/doLogin', payload);
        localStorage.setItem('token', token);
        // // 登录成功后，获取用户信息
        const user = await Get('/user/getUserInfo', null);
        this.$store.dispatch('login', user);
        const redirect = this.$route.query.redirect;
        if (redirect) {
          this.$router.replace(redirect);
        } else {
          this.$router.replace('/');
        }
      } catch (error) {
        this.$store.dispatch('showError', error.message);
      }
    }
  },
  mounted() {
    let currentIndex = 0;
    const images = document.querySelectorAll('.background-slider img');
    setInterval(() => {
      images[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 5000);
  }
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}
.background-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}
.background-slider img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
.background-slider img.active {
  opacity: 1;
}
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: -1;
}
a {
  cursor: pointer;
}

</style>