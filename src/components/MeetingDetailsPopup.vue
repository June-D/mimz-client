<script>

export default {
  name: 'MeetingDetailsPopup',
  props: ['details'],
  data() {
    return {
      copySuccessMessage: '', // 复制成功提示信息
    };
  },
  methods: {
    copyMeetingId() {
      navigator.clipboard.writeText(this.details.roomId).then(() => {
        this.copySuccessMessage = '会议号已复制成功！';
        this.clearMessage();
      }).catch(err => {
        console.error('复制失败: ', err);
      });
    },

    copyLink() {
      // 实现复制链接的逻辑
      const link = `https://meeting.example.com/${this.details.roomId}`;
      navigator.clipboard.writeText(link).then(() => {
        this.copySuccessMessage = '分享链接已复制成功！';
        this.clearMessage();
      }).catch(err => {
        console.error('复制失败: ', err);
      });
    },

    clearMessage() {
      setTimeout(() => {
        this.copySuccessMessage = '';
      }, 2000); // 2秒后清除提示信息
    },
  },
}
</script>

<template>
  <div class="popup max-w-2xl mx-auto p-6">
    <div class="space-y-4">
      <div class="flex">
        <div class="w-20 text-gray-500">主 题</div>
        <div>{{ details.roomName }}</div>
      </div>

      <div class="flex items-center">
        <div class="w-20 text-gray-500">会议号</div>
        <div class="flex items-center">
          <span>{{ details.roomId }}</span>
          <button class="ml-2 p-1" @click="copyMeetingId">
            <i class="text-blue-500 cursor-pointer"><font-awesome-icon :icon="['fas', 'copy']" /></i>
          </button>
          <button class="ml-2 p-1" @click="copyLink">
            <i class="text-gray-400 cursor-pointer"><font-awesome-icon :icon="['fas', 'link']" /></i>
          </button>
        </div>
      </div>

      <!-- 复制成功提示 -->
      <div v-if="copySuccessMessage" class="text-green-500 mt-2">{{ copySuccessMessage }}</div>

      <div class="flex items-center">
        <div class="w-20 text-gray-500">发起人</div>
        <div class="flex items-center">
          {{ details.host }}
          <i class="fas fa-crown text-yellow-500 ml-1 text-sm"></i>
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-20 text-gray-500">我的名称</div>
        <div class="flex items-center">
          {{ details.myName }}
          <i class="fas fa-crown text-yellow-500 ml-1 text-sm"></i>
        </div>
      </div>

      <div class="flex">
        <div class="w-20 text-gray-500">参会时长</div>
        <div>{{ details.maxDuration }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: absolute;
  z-index: 1000; /* 确保弹出框在前面 */
  background: white; /* 弹出框背景 */
  border: 1px solid #ccc; /* 边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
</style>