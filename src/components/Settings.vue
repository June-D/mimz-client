<script setup>

</script>

<template>
    <div class="bg-white w-3/4 h-3/4 rounded-lg overflow-hidden">
      <!-- Header -->
      <header class="bg-gray-200 text-black p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">设置</h1>
        <button @click="$emit('close')" class="text-red-600 hover:text-red-800, focus:outline-none">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </header>

      <div class="flex h-full">
        <!-- Sidebar -->
        <div class="w-1/4 bg-gray-100 p-4">
          <ul class="space-y-4">
            <li @click="currentTab = 'general'" :class="{'bg-blue-100 text-blue-600 p-2 rounded': currentTab === 'general'}" class="flex items-center space-x-2 cursor-pointer">
              <font-awesome-icon :icon="['fas', 'cog']" />
              <span class="hidden md:inline">常规设置</span>
            </li>
            <li @click="currentTab = 'video'" :class="{'bg-blue-100 text-blue-600 p-2 rounded': currentTab === 'video'}" class="flex items-center space-x-2 cursor-pointer">
              <font-awesome-icon :icon="['fas', 'video']" />
              <span class="hidden md:inline">视频</span>
            </li>
            <li @click="currentTab = 'audio'" :class="{'bg-blue-100 text-blue-600 p-2 rounded': currentTab === 'audio'}" class="flex items-center space-x-2 cursor-pointer">
              <font-awesome-icon :icon="['fas', 'volume-up']" />
              <span class="hidden md:inline">音频</span>
            </li>
            <li @click="currentTab = 'recording'" :class="{'bg-blue-100 text-blue-600 p-2 rounded': currentTab === 'recording'}" class="flex items-center space-x-2 cursor-pointer">
              <font-awesome-icon :icon="['fas', 'microphone']" />
              <span class="hidden md:inline">录制</span>
            </li>
            <li @click="currentTab = 'shortcuts'" :class="{'bg-blue-100 text-blue-600 p-2 rounded': currentTab === 'shortcuts'}" class="flex items-center space-x-2 cursor-pointer">
              <font-awesome-icon :icon="['fas', 'keyboard']" />
              <span class="hidden md:inline">快捷键</span>
            </li>
            <li @click="currentTab = 'about'" :class="{'bg-blue-100 text-blue-600 p-2 rounded': currentTab === 'about'}" class="flex items-center space-x-2 cursor-pointer">
              <font-awesome-icon :icon="['fas', 'info-circle']" />
              <span class="hidden md:inline">关于我们</span>
            </li>
          </ul>
        </div>

        <!-- Main Content -->
        <div class="w-3/4 p-8 overflow-y-auto">
          <div class="mt-8" v-if="currentTab === 'general'">
            <h2 class="text-lg font-bold">常规设置</h2>
            <p class="mt-2">这里是常规设置的内容。</p>
          </div>
          <div class="mt-8" v-if="currentTab === 'video'">
            <h2 class="text-lg font-bold">视频</h2>
            <p class="mt-2">这里是视频设置的内容。</p>
          </div>
          <div class="mt-8" v-if="currentTab === 'audio'">
            <h2 class="text-lg font-bold">音频</h2>
            <p class="mt-2">这里是音频设置的内容。</p>
          </div>
          <div class="mt-8" v-if="currentTab === 'recording'">
            <h2 class="text-lg font-bold">录制</h2>
            <p class="mt-2">这里是录制设置的内容。</p>
          </div>
          <div class="mt-8" v-if="currentTab === 'shortcuts'">
            <h2 class="text-lg font-bold">快捷键</h2>
            <p class="mt-2">这里是快捷键设置的内容。</p>
          </div>
          <div class="mt-8" v-if="currentTab === 'about'">
            <h2 class="text-lg font-bold">关于我们</h2>
            <p class="mt-2">这里是关于我们的内容。</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      showModal: false,
      currentTab: 'general'
    }
  }
}
</script>

<style scoped>

</style>