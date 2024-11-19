<script setup>

</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
    <i class="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
    <h1 class="text-2xl font-bold mb-2">密码重置成功</h1>
    <p class="text-gray-600 mb-6">您的密码重置成功。您将在3秒钟后被重定向到登录页面。</p>
    <p class="text-gray-500 text-sm">如果你没有被重定向，请 <a @click="this.$router.replace('/login')" class="text-blue-500 underline">点这里</a>.</p>
  </div>
</template>

<script>
export default {
  name   : 'ResetPasswordSuccess',
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
    setTimeout(() => {
      this.$router.replace('/login');
    }, 3000);
  }
}
</script>
<style scoped>

</style>