<script>

import EndMeetingConfirm from "@/components/EndMeetingConfirm.vue";
import MeetingDetailsPopup from "@/components/MeetingDetailsPopup.vue";
import {Get, Post} from "@/plugins/http.js";

export default {
  name: "Meeting",
  components: {EndMeetingConfirm, MeetingDetailsPopup},
  data() {
    return {
      endMeetingConfirm: false,
      showMDModal: false,
      isAudioOn: false,
      isCameraOn: false,
      isSpeaking: false, // 添加一个新的响应式变量
      detailsPopupPosition: {top: 0, left: 0},
      userId: null,
      username: null,
      userAvatar: null,
      isHost: false, // 新增变量，判断是否为房间主人
      meetingDetails: null, // 获取会议详情
      localStream: null,
      remoteStreams: [],
      peerConnections: [],
      members: [], // 存储所有参会人员信息
      membersInfo: new Map(), // 存储所有参会人员信息
      socket: null,
      messageBubbleVisible: false, // 控制气泡是否可见
      currentMessage: '', // 当前展示的消息
    };
  },
  created() {
    // 判断登录状态
    Get('/login/isLoginStatus', null).then(status => {
      if (status === 0) {
        this.$router.replace('/login');
      } else if (status === 1) {
        this.$router.replace('/email-verification');
      }
    });
    // 判断用户是否登录
    if (this.$store.getters.getUser === null || this.$store.getters.getUser === undefined) {
      this.$router.replace('/login');
    }
    this.userId = this.$store.getters.getUser.userId;
    this.username = this.$store.getters.getUser.username;
    // 获取会议详情
    Get('/rooms/getRoomInfo', {roomId: this.$route.params.roomId}).then(roomInfo => {
      if (roomInfo.status === 'closed') {
        alert('会议已关闭');
        this.$router.replace('/');
      }
      this.meetingDetails = roomInfo;

      // 判断用户是否为房间主人
      this.isHost = roomInfo.hostUserId === this.userId; // 假设hostId为房间主人ID
    });
  },
  mounted() {
    this.userAvatar = this.$store.getters.getUser.avatar;

    Get('/rooms/getWs', {roomId: this.$route.params.roomId}).then(wsUrl => {
          if (wsUrl == null) {
            alert('会议不存在或已关闭');
            this.$router.replace('/');
          }
          console.log('WebSocket URL：', wsUrl);
          this.socket = new WebSocket(wsUrl);
          this.socket.onopen = (event) => {
            console.log('WebSocket 已连接');
            this.sendMessage({type: 'join', payload: {roomId: this.$route.params.roomId, userId: this.userId, username: this.username, avatar: this.userAvatar, isHost: this.isHost, isSpeaking: false, isAudioOn: false, isCameraOn: false, isMuted: false, isSharingScreen: false}});
            this.members.push(this.username)
            this.membersInfo.set(this.username, {roomId: this.$route.params.roomId, userId: this.userId, username: this.username, avatar: this.userAvatar, isHost: this.isHost, isSpeaking: false, isAudioOn: false, isCameraOn: false, isMuted: false, isSharingScreen: false}); // 存储所有参会人员信息
          };
          this.socket.onerror = (error) => {
            console.log('WebSocket 连接失败：', error);
            this.$router.replace('/');
            alert('oops! 连接失败，请检查网络连接');
          };
          this.socket.onclose = () => {
            console.log('WebSocket 已关闭');
            this.$router.replace('/');
          };
          this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'joined') { // 存储所有参会人员信息
              this.members.push(message.payload.username);
              this.membersInfo.set(message.payload.username, message.payload);
            } else if (message.type === 'join') {
              console.log(message.payload.username + '加入了会议');
              // 设置当前消息并显示气泡
              this.currentMessage =  message.payload.username + ' 加入了会议';
              this.messageBubbleVisible = true;
              this.members.push(message.payload.username);
              this.membersInfo.set(message.payload.username, message.payload);
              // 1秒后自动隐藏气泡
              setTimeout(() => {
                this.messageBubbleVisible = false;
              }, 1000);
            } else if (message.type === 'leave') {
              console.log(message.payload.username + '离开了会议');
              // 设置当前消息并显示气泡
              this.currentMessage =  message.payload.username + ' 离开了会议';
              this.messageBubbleVisible = true;
              // 遍历members 数组，删除离开的用户信息
              for (let i = 0; i < this.members.length; i++) {
                if (this.members[i] === message.payload.username) {
                  this.members.splice(i, 1);
                  this.membersInfo.delete(message.payload.username);
                  break;
                }
              }
              // 1秒后自动隐藏气泡
              setTimeout(() => {
                this.messageBubbleVisible = false;
              }, 1000);
            }
          }
          // this.socket.onmessage = (event) => {
          //   const message = JSON.parse(event.data);
          //   if (message.type === 'offer'){
          //     this.handleOffer(message.payload);
          //   } else if (message.type === 'answer') {
          //     this.handleAnswer(message);
          //   } else if (message.iceCandidate) {
          //     this.handleIceCandidate(message.iceCandidate, message.userId);
          //   }
          // };
        })
        .catch(error => {
          console.error('请求出错：', error);
        });
  },
  methods: {
    // handleOffer(offer, userId) {
    //   const peerConnection = new RTCPeerConnection();
    //
    //   peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    //   peerConnection.createAnswer().then(answer => peerConnection.setLocalDescription(answer))
    //       .then(() => this.sendMessage({ type: 'answer', sdp: peerConnection.localDescription }))
    //       .then(() => {
    //         this.localStream.getTracks().forEach(track => {
    //           peerConnection.addTrack(track, this.localStream);
    //         });
    //       });
    //
    //   peerConnection.ontrack = (event) => {
    //     this.remoteStreams.push(event.streams[0]); // 存储每个用户的远程流
    //   };
    //
    //   peerConnection.onicecandidate = (event) => {
    //     if (event.candidate) {
    //       this.sendMessage({iceCandidate: event.candidate, userId});
    //     }
    //   };
    //
    //   // 这里可以根据 userId 将 peerConnection 存入相应的数据结构中
    //   this.peerConnections[userId] = peerConnection; // 存储对应的 peer connection
    // },
    // handleAnswer(answer, userId) {
    //   this.peerConnections[userId].setRemoteDescription(new RTCSessionDescription(answer));
    // },
    //
    // handleIceCandidate(candidate, userId) {
    //   this.peerConnections[userId].addIceCandidate(new RTCIceCandidate(candidate));
    // },

    sendMessage(message) {
      this.socket.send(JSON.stringify(message));
    },
    leaveMeeting() {
      // 处理离开会议的逻辑
      Post('/rooms/leaveRoom', {roomId: this.$route.params.roomId, userId: this.userId}).then(response => {
        if (response === 'success') {
          this.sendMessage({type: 'leave', payload: {roomId: this.$route.params.roomId, username: this.username}})
          this.socket.close();
          this.$router.replace('/'); // 返回主页或其他逻辑
        }else {
          alert(response);
        }
      });
    },
    endMeeting() {
      Post('/rooms/closeRoom', {roomId: this.$route.params.roomId, userId: this.userId}).then(response => {
        if (response === 'success') {
          this.stopCamera();
          this.stopAudio();
          this.$router.replace('/');
        }else {
          alert(response);
        }
      });
    },
    toggleDetailModal(event) {
      this.showMDModal = !this.showMDModal
      this.detailsPopupPosition.top = event.clientY + 10; // 在按钮下方偏移10px
      this.detailsPopupPosition.left = event.clientX; // 在按钮右侧偏移10px
    },
    async toggleCamera() {
      this.isCameraOn = !this.isCameraOn;
      if (this.isCameraOn) {
        await this.startCamera();
      } else {
        await this.stopCamera();
      }
    },
    async startCamera() {
      navigator.mediaDevices.getUserMedia({video: true})
          .then(stream => {
            this.$refs.videoElement.srcObject = stream;
          })
          .catch(error => {
            console.error('Error: ', error);
          });
    },
    async stopCamera() {
      if (this.$refs.videoElement && this.$refs.videoElement.srcObject) {
        const tracks = this.$refs.videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        this.$refs.videoElement.srcObject = null;
      }
    },

    async toggleAudio() {
      this.isAudioOn = !this.isAudioOn;
      if (this.isAudioOn) {
        await this.startAudio();
      } else {
        await this.stopAudio();
      }
    },
    async startAudio() {
      navigator.mediaDevices.getUserMedia({audio: true})
          .then(stream => {
            this.$refs.audioElement.srcObject = stream;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 2048;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              analyser.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
              this.isSpeaking = average > 50; // 调整阈值以适应你的需要
            };

            setInterval(checkVolume, 100); // 每100ms检查一次音量
          })
          .catch(error => {
            console.error('Error: ', error);
          });
    },
    async stopAudio() {
      if (this.$refs.audioElement && this.$refs.audioElement.srcObject) {
        const tracks = this.$refs.audioElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        this.$refs.audioElement.srcObject = null;
      }
    },

    async toggleFullScreen() {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    }
  },
}

</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Top Bar -->
    <div class="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
      <div class="flex items-center space-x-2 cursor-pointer" @click="toggleDetailModal">
        <span class="text-gray-700">会议详情</span>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'info-circle']"/>
        </i>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-gray-700">00:13</span>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'th']"/>
        </i>
        <button @click="toggleFullScreen" class="text-gray-500 hover:text-gray-700"><i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'expand']"/>
        </i></button>
      </div>
    </div>
    <!-- 添加气泡提示 -->
    <div v-if="messageBubbleVisible" class="message-bubble absolute top-10 left-1/2 transform -translate-x-1/2">
      {{ currentMessage }}
    </div>
    <!-- Main Content -->
    <div class="flex-grow flex flex-col items-center justify-center px-4">
      <div class="bg-blue-100 text-blue-700 px-4 py-2 rounded-md mb-4 text-center">
        正在讲话: June;
      </div>
      <div class="flex flex-col items-center">
        <img v-if="userAvatar" :src="userAvatar"
             alt="Profile picture of June, a cat" class="rounded-full mb-2" width="100" height="100"/>
        <span class="text-gray-700">{{ username }}</span>
      </div>
    </div>
<!--    <div v-if="isCameraOn" class="flex-grow flex flex-col items-center justify-center px-4 overflow-hidden">-->
<!--      &lt;!&ndash; 展示所有远程视频流 &ndash;&gt;-->
<!--      <div v-for="(stream, index) in remoteStreams" :key="index">-->
<!--        <video autoplay class="w-full h-auto" :ref="'remoteVideo' + index" :srcObject="stream"></video>-->
<!--      </div>-->
<!--    </div>-->
<!--    <audio ref="audioElement" autoplay></audio>-->
    <!-- Bottom Bar -->
    <div class="flex items-center justify-between bg-white border-t border-gray-200 px-4 py-2 flex-wrap">
      <div class="flex items-center space-x-4 flex-wrap justify-center">
        <i :class="[isAudioOn ? (isSpeaking ? 'text-green-500 animate-bounce' : 'text-green-500') : 'text-gray-500']"
           @click="toggleAudio">
          <font-awesome-icon :icon="['fas', isAudioOn ? 'microphone' : 'microphone-slash']"/>
        </i>
        <i :class="[isCameraOn ? 'text-green-500' : 'text-gray-500']" @click="toggleCamera">
          <font-awesome-icon :icon="['fas', isCameraOn?'video':'video-slash']"/>
        </i>
        <i class="text-green-500">
          <font-awesome-icon :icon="['fas', 'desktop']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'shield-alt']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'user-plus']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'users']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'comments']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'record-vinyl']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'hand-paper']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'robot']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'th-large']"/>
        </i>
        <i class="text-gray-500">
          <font-awesome-icon :icon="['fas', 'cogs']"/>
        </i>
      </div>
      <button v-if="isHost" class="bg-red-500 text-white px-4 py-2 rounded-md mt-2 md:mt-0" @click="endMeetingConfirm = true">
        结束会议
      </button>
      <button v-else class="bg-red-500 text-white px-4 py-2 rounded-md mt-2 md:mt-0" @click="leaveMeeting()">
        离开会议
      </button>
    </div>
    <!-- end meeting Confirm Modal -->
    <div v-if="endMeetingConfirm" @click.self="endMeetingConfirm = false"
         class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <EndMeetingConfirm :endMeeting="endMeeting" @close="endMeetingConfirm = false"></EndMeetingConfirm>
    </div>
    <!-- Click Outside Handler -->
    <MeetingDetailsPopup v-if="showMDModal" :details="meetingDetails"
                         :style="{ top: detailsPopupPosition.top + 'px', left: detailsPopupPosition.left + 'px' }"
                         @close="showMDModal = false"/>
    <div v-if="showMDModal" class="fixed inset-0 z-40" @click="showMDModal = false"></div>
  </div>
</template>

<style scoped>
@keyframes colorJump {
  0% {
    color: #48bb78;
  }
  50% {
    color: #f6e05e;
  }
  100% {
    color: #48bb78;
  }
}

.animate-bounce {
  animation: colorJump 0.5s infinite;
}

.message-bubble {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
  max-width: 250px; /* 根据需要调整 */
  text-align: center;
  z-index: 10; /* 确保气泡显示在其他元素之上 */
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

img {
  height: 100px !important;
}
</style>