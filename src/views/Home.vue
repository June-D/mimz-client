<script setup>
import Calendar from "@/components/Calendar.vue";
import Settings from "@/components/Settings.vue";
import LogoutConfirm from "@/components/LogoutConfirm.vue";
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-20 bg-gray-100 flex flex-col items-center py-4 justify-between">
      <div class="mb-4 relative space-y-4">
        <img :src="avatar" alt="User avatar" class="rounded-full cursor-pointer" height="40" width="40"
             @click="triggerFileInput"/>
        <input ref="fileInput" type="file" class="hidden" @change="uploadImage"/>
        <div class="flex flex-col items-center space-y-4">
          <i class="text-blue-500 text-xl cursor-pointer" @click="showCalendar = true"><font-awesome-icon :icon="['fas', 'calendar-alt']" /></i>
          <i class="text-gray-400 text-xl cursor-pointer" @click="showSettings = true"><font-awesome-icon :icon="['fas', 'cog']" /></i>
        </div>
      </div>
      <div>
        <i @click="showLogoutConfirm = true" class="text-red-500 mb-4 cursor-pointer"><font-awesome-icon :icon="['fas', 'sign-out-alt']" /></i>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Section -->
      <div class="flex-1 flex flex-col items-center justify-center space-y-8">
        <div class="grid grid-cols-2 gap-8">
          <div class="flex flex-col items-center">
            <div class="button bg-blue-500 text-white p-5 rounded-lg w-20 h-20 flex justify-center items-center"
                 @click="openJoinMeetingDialog()" @mouseover="hoverJoin = true" @mouseleave="hoverJoin = false">
              <i class="text-3xl button-icon"><font-awesome-icon :icon="['fas', hoverJoin ?'plus-square':'plus']" /></i>
            </div>
            <span class="mt-2 text-gray-700">
        加入会议
       </span>
          </div>
          <div class="flex flex-col items-center">
            <div class="button bg-blue-500 text-white p-5 rounded-lg w-20 h-20 flex justify-center items-center"
                 @click="createRoom()" @mouseover="hoverQuick = true" @mouseleave="hoverQuick = false">
              <i class="text-3xl button-icon"><font-awesome-icon :icon="['fas', hoverQuick?'rocket':'bolt']" /></i>
            </div>
            <span class="mt-2 text-gray-700">
        快速会议
       </span>
          </div>
        </div>
      </div>
      <!-- Bottom Section -->
      <div class="flex-1 flex flex-col items-center justify-center">
        <div class="text-center">
          <div class="text-2xl text-gray-800">
            8月13日
          </div>
          <div class="text-gray-500">
            周三 - 农历方日庚午
          </div>
          <div class="mt-4">
            <button class="text-gray-500 border border-gray-300 rounded px-4 py-1">
              历史会议
            </button>
          </div>
          <div class="mt-8">
            <img alt="No meetings illustration" class="mx-auto" height="100"
                 src="https://replicate.delivery/yhqm/fEliC20iSU2eVUKhmMSxXd85QnNM4qwg2Qtr8I1RPcknrMSTA/out-0.png"
                 width="100"/>
            <div class="text-gray-500 mt-2">
              暂无会议
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Join Meeting Dialog -->
    <div v-if="showJoinDialog" @click.self="showJoinDialog = false"
         class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-md" :class="{'shake': shakeDialog}">
        <h2 class="text-xl mb-4">输入会议号</h2>
        <input type="text" v-model="roomId" placeholder="请输入会议号" class="border p-2 w-full mb-2"/>
        <button @click="joinMeetingCheck()" class="bg-blue-500 text-white rounded px-4 py-2">确认</button>
        <button @click="showJoinDialog = false" class="text-gray-500 rounded px-4 py-2 ml-2">取消</button>
      </div>
    </div>
    <!-- Settings Modal -->
    <div v-if="showSettings" @click.self="showSettings = false"
         class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <Settings @close="showSettings = false"></Settings>
    </div>
    <!-- Calendar Modal -->
    <div v-if="showCalendar" @click.self="showCalendar = false"
         class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <Calendar @close="showCalendar = false"></Calendar>
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
import axios from 'axios'


export default {
  data() {
    return {
      showSettings: false,
      showCalendar: false,
      avatar: this.$store.getters.getUser.avatar? this.$store.getters.getUser.avatar : 'https://replicate.delivery/yhqm/DlFubeG0vtwREChpDcxiSoeFzkuDWLwxDy9gx0QoGQwmrMSTA/out-0.png',
      fileInput: null,
      hoverJoin: false,
      hoverQuick: false,
      showJoinDialog: false, // 新增的对话框显示状态
      roomId: '', // 会议号
      shakeDialog: false, // 用于控制对话框动画
      showLogoutConfirm: false
    }
  },
  computed: {
    errorMessage() {
      return this.$store.state.error;
    }
  },
  mounted() {
    this.fileInput = this.$refs.fileInput;
  },
  methods: {
    triggerFileInput() {
      this.fileInput.click();
    },
    uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('avatar', file); // 'avatar' 是后端接收的参数名
        axios.post(process.env.BASE_API + '/user/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Mimztoken': localStorage.getItem('token') || sessionStorage.token
          },
          withCredentials: true // 添加这个属性以确保携带cookie
        }).then(response => {
          console.log(response.data);
          if(response.data.code === 0){
            // 响应返回新的头像 URL
            this.avatar = response.data.data;
            const user = this.$store.getters.getUser;
            user.avatar = this.avatar;
            this.$store.commit('setUser', user);
          } else if(response.data.code === 401){
            alert('请先登录');
            this.$router.replace('/login');
          } else {
            alert(response.data.message);
          }
        }).catch(error => {
          console.error(error);
          alert('头像上传失败，请稍后再试');
        });
        event.target.value = ''; // 清空文件输入框，以便下次选择相同文件
      }
    },
    openJoinMeetingDialog() {
      this.showJoinDialog = true; // 显示加入会议对话框
      this.roomId = ''; // 清空会议号
      this.shakeDialog = false; // 确保初始状态
    },
    async joinMeetingCheck() {
      if (!this.roomId) {
        this.shakeDialog = true; // 触发摇动动画
        setTimeout(() => {
          this.shakeDialog = false; // 动画结束后重置
        }, 500); // 动画持续时间
        return;
      }
      try {
        await this.joinMeeting(this.roomId);
      } finally {
        this.showJoinDialog = false; // 隐藏对话框
        this.roomId = ''; // 清空会议号
        this.shakeDialog = false; // 确保初始状态
      }
    },
    async joinMeeting(roomId) {
      // 加入会议
      try {
        // 假设这是一种验证会议号的方式
        const response = await Post('/rooms/joinRoom', { roomId: roomId, userId: this.$store.getters.getUser.userId });
        if (response === 'success') {
          // 成功后跳转到会议页面
          this.$router.replace("/meeting/"+roomId);
        } else {
          alert(response);
        }
      } catch (error) {
        console.error(error);
        alert('加入会议失败，请稍后再试');
      }
    },
    async createRoom() {
      const roomName = this.$store.getters.getUser.username + '的快速会议';
      const roomId = await Post('/rooms/createRoom', {
        roomName: roomName,
        hostUserId: this.$store.getters.getUser.userId,
      });
      await this.joinMeeting(roomId);
    },
  }
}

</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
}

.button-icon {
  transition: transform 0.3s ease;
}

.button:hover .button-icon {
  transform: rotate(90deg);
}

.button:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
  100% { transform: translateX(0); }
}

img.rounded-full {
  border-radius: 50%;
}

img {
  display: block;
  height: 40px !important;
}

</style>