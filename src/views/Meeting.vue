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
      meetingDetails: null, // 获取会议详情
      localStream: null,
      remoteStreams: [],
      peerConnections: [],
      socket: null,
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
    Get('/rooms/getRoomInfo', {roomId: this.$route.params.roomId}).then(response => {
      if (response.status === 'closed') {
        alert('会议已关闭');
        this.$router.replace('/');
      }
      this.meetingDetails = response;
    });
  },
  mounted() {
    Get('/rooms/getWs', {roomId: this.$route.params.roomId}).then(wsUrl => {
          if (wsUrl == null) {
            alert('会议不存在或已关闭');
            this.$router.replace('/');
          }
          console.log('WebSocket URL：', wsUrl);
          this.socket = new WebSocket(wsUrl);
          this.socket.onopen = (event) => {
            console.log('WebSocket 已连接');
            this.sendMessage({type: 'join', payload: {roomId: this.$route.params.roomId, username: this.username}});
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
            if (message.type === 'join') {
              console.log(message.payload.username + '加入了会议');
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
    <!-- Main Content -->
    <div v-if="!isCameraOn" class="flex-grow flex flex-col items-center justify-center px-4">
      <div class="bg-blue-100 text-blue-700 px-4 py-2 rounded-md mb-4 text-center">
        正在讲话: June;
      </div>
      <div class="flex flex-col items-center">
        <img src="https://replicate.delivery/yhqm/fyrzye5XpNpTzEdmYhkHNyAPVzXK1HnEFOthptZkVI8ydPSTA/out-0.png"
             alt="Profile picture of June, a cat" class="rounded-full mb-2" width="100" height="100"/>
        <span class="text-gray-700">{{ username }}</span>
      </div>
    </div>
    <div v-if="isCameraOn" class="flex-grow flex flex-col items-center justify-center px-4 overflow-hidden">
      <!-- 展示所有远程视频流 -->
      <div v-for="(stream, index) in remoteStreams" :key="index">
        <video autoplay class="w-full h-auto" :ref="'remoteVideo' + index" :srcObject="stream"></video>
      </div>
    </div>
    <audio ref="audioElement" autoplay></audio>
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
      <button class="bg-red-500 text-white px-4 py-2 rounded-md mt-2 md:mt-0" @click="endMeetingConfirm = true">
        结束会议
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
</style>