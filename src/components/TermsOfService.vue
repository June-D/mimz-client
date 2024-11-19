<script setup>

</script>

<template>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
    <h3 class="text-xl font-bold mb-4">服务协议</h3>
    <div class="overflow-y-auto max-h-96">
      <p class="text-gray-700 mb-4">
        <!-- Placeholder text for Terms of Service -->
        <strong>1. Introduction</strong><br>
        Welcome to our Terms of Service. Please read them carefully.<br><br>
        <strong>2. User Responsibilities</strong><br>
        Users are expected to adhere to the following guidelines...<br><br>
        <strong>3. Account Security</strong><br>
        It is the user's responsibility to maintain the security of their account...<br><br>
        <strong>4. Prohibited Activities</strong><br>
        Users must not engage in the following activities...<br><br>
        <strong>5. Termination</strong><br>
        We reserve the right to terminate accounts that violate our terms...<br><br>
        <strong>6. Changes to Terms</strong><br>
        We may update these terms from time to time. Users will be notified of significant changes...<br><br>
        <strong>7. Contact Information</strong><br>
        For any questions regarding these terms, please contact us at...<br><br>
        <strong>8. Governing Law</strong><br>
        These terms are governed by the laws of...<br><br>
        <strong>9. Dispute Resolution</strong><br>
        Any disputes arising from these terms will be resolved through...<br><br>
        <strong>10. Miscellaneous</strong><br>
        Additional terms and conditions may apply to specific services...<br><br>
      </p>
    </div>
    <div class="flex justify-end">
      <button @click="$emit('close')" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        关闭
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>