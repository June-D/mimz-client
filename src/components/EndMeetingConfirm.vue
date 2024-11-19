<script>
export default {
  name: 'EndMeetingConfirm',
  props: ['endMeeting'],
  methods: {
    callEndMeeting() {
      if(this.endMeeting) {
        this.endMeeting();
      }
      this.$emit('close');
    },
  }
}
</script>

<template>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <p class="mb-4">
        确认要结束会议吗？
      </p>
      <div class="flex justify-end space-x-4">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded-lg">
          取消
        </button>
        <button @click="callEndMeeting" class="px-4 py-2 bg-red-500 text-white rounded-lg">
          确定
        </button>
      </div>
    </div>
</template>

<style scoped>

</style>