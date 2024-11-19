<script setup>

</script>

<template>
  <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
    <button @click="$emit('close')" class="top-1 right-2 text-red-600 hover:text-red-800"><font-awesome-icon :icon="['fas', 'times']" /></button>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">会议日历</h1>
      <div class="flex items-center space-x-4">
        <button @click="prevMonth" class="text-gray-600 hover:text-gray-800"><font-awesome-icon :icon="['fas', 'chevron-left']" /></button>
        <input type="month" v-model="selectedMonth" @change="updateMonth" class="border rounded-lg p-2 text-gray-700">
        <button @click="nextMonth" class="text-gray-600 hover:text-gray-800"><font-awesome-icon :icon="['fas', 'chevron-right']" /></button>
      </div>
    </div>
    <div class="grid grid-cols-7 gap-4 text-center text-gray-700">
      <div class="font-medium">Sun</div>
      <div class="font-medium">Mon</div>
      <div class="font-medium">Tue</div>
      <div class="font-medium">Wed</div>
      <div class="font-medium">Thu</div>
      <div class="font-medium">Fri</div>
      <div class="font-medium">Sat</div>
      <div v-for="day in daysInMonth" :key="day.date" class="p-4 border rounded-lg relative" :class="{'bg-yellow-100': day.meetings.length}" @mouseover="showTooltip($event, day)" @mouseleave="hideTooltip">
        <span class="absolute top-2 right-2 text-xs text-gray-500">{{ day.date }}</span>
        <div v-if="day.meetings.length" class="mt-4">
          <div v-for="meeting in day.meetings" :key="meeting.id" class="bg-blue-100 text-blue-800 text-xs rounded-lg p-2 mb-2 relative">
            <div class="font-medium truncate">{{ meeting.title }}</div>
            <div class="text-xs">{{ meeting.time }}</div>
          </div>
        </div>
        <div v-if="day.meetings.length" class="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full"></div>
      </div>
    </div>
    <div class="tooltip" :class="{'tooltip-visible': tooltipVisible}" :style="{ top: tooltipPosition.top, left: tooltipPosition.left }">
      <div v-if="tooltipContent">
        <div v-for="meeting in tooltipContent.meetings" :key="meeting.id">
          <div class="font-medium">{{ meeting.title }}</div>
          <div class="text-xs">{{ meeting.time }}</div>
          <div class="text-xs text-gray-600">{{ meeting.summary }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Calendar',
  data() {
    return {
      selectedMonth: new Date().toISOString().slice(0, 7),
      daysInMonth: this.getDaysInMonth(new Date().getFullYear(), new Date().getMonth()),
      tooltipVisible: false,
      tooltipPosition: { top: '0px', left: '0px' },
      tooltipContent: null
    };
  },
  methods: {
    getDaysInMonth(year, month) {
      const date = new Date(year, month, 1);
      const days = [];
      while (date.getMonth() === month) {
        days.push({
          date: date.getDate(),
          meetings: this.getMeetingsForDate(date)
        });
        date.setDate(date.getDate() + 1);
      }
      return days;
    },
    getMeetingsForDate(date) {
      const meetings = {
        '2023-10-02': [{ id: 1, title: 'Team Meeting', time: '10:00 AM', summary: 'Discuss project updates and next steps.' }],
        '2023-10-04': [{ id: 2, title: 'Client Call', time: '2:00 PM', summary: 'Review project requirements with the client.' }],
        '2023-10-09': [{ id: 3, title: 'Project Review', time: '11:00 AM', summary: 'Evaluate project progress and milestones.' },
          { id: 5, title: 'Review Code', time: '12:00 AM', summary: 'Review the code and provide feedback.' }],
        '2024-08-30': [{ id: 4, title: '面试', time: '3:00 PM', summary: 'Candidate interview for the developer position.' }]
      };
      const dateString = date.toISOString().split('T')[0];
      return meetings[dateString] || [];
    },
    prevMonth() {
      const currentDate = new Date(this.selectedMonth + '-01');
      currentDate.setMonth(currentDate.getMonth() - 1);
      this.selectedMonth = currentDate.toISOString().slice(0, 7);
      this.updateMonth();
    },
    nextMonth() {
      const currentDate = new Date(this.selectedMonth + '-01');
      currentDate.setMonth(currentDate.getMonth() + 1);
      this.selectedMonth = currentDate.toISOString().slice(0, 7);
      this.updateMonth();
    },
    updateMonth() {
      const [year, month] = this.selectedMonth.split('-').map(Number);
      this.daysInMonth = this.getDaysInMonth(year, month - 1);
    },
    showTooltip(event, day) {
      if (day.meetings.length) {
        this.tooltipVisible = true;
        this.tooltipContent = day;
        const rect = event.target.getBoundingClientRect();
        this.tooltipPosition = {
          top: rect.top + window.scrollY + 'px',
          left: rect.right + 10 + window.scrollX + 'px'
        };
      }

    },
    hideTooltip() {
      this.tooltipVisible = false;
    }
  }
}

</script>

<style scoped>
.tooltip {
  position: absolute;
  z-index: 10;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: none;
}
.tooltip-visible {
  display: block;
}
</style>