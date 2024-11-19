<script setup>

</script>

<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="text-center p-6 bg-white shadow-lg rounded-lg" id="app">
    <img alt="Illustration of a person looking confused while standing in front of a broken signpost" class="mx-auto mb-6" height="300" src="https://replicate.delivery/yhqm/9jkLsBg1NmL5NlYyoZ7OftYidIX4tee98kdTb3ZfL8QzM8INB/out-0.png" width="400"/>
    <h1 class="text-6xl font-bold text-gray-800 mb-4">
      ERROR
    </h1>
    <p class="text-xl text-gray-600 mb-6">
      Oops! The page you're looking for doesn't exist.
    </p>
    <button @click="goHome" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
      <i class="mr-2"><font-awesome-icon :icon="['fas', 'home']" /></i>
      Go Home
    </button>
  </div>
  </div>
</template>
<script>
export default {
  name: 'NotFound',
  components: {},
  data() {
    return {
      message: 'Hello Vue 3.0 + Vite!'
    }
  },
  methods: {
    goHome() {
      this.$router.replace('/');
    }
  }
}
</script>
<style scoped>

</style>