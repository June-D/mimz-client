<script setup>

</script>

<template>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
    <h3 class="text-xl font-bold mb-4">用户隐私协议</h3>
    <div class="overflow-y-auto max-h-96">
      <p class="text-gray-700 mb-4">
        <!-- Placeholder text for Privacy Policy -->
        <strong>1. Introduction</strong><br>
        Welcome to our Privacy Policy. Your privacy is critically important to us.<br><br>
        <strong>2. Information We Collect</strong><br>
        We collect various types of information in connection with the services we provide...<br><br>
        <strong>3. How We Use Information</strong><br>
        The information we collect is used to provide, maintain, and improve our services...<br><br>
        <strong>4. Information Sharing</strong><br>
        We do not share personal information with companies, organizations, or individuals outside of our company except in the following cases...<br><br>
        <strong>5. Data Security</strong><br>
        We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold...<br><br>
        <strong>6. Changes to This Policy</strong><br>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page...<br><br>
        <strong>7. Contact Information</strong><br>
        If you have any questions about this Privacy Policy, please contact us at...<br><br>
        <strong>8. Your Rights</strong><br>
        You have the right to access, update, or delete your personal information...<br><br>
        <strong>9. Cookies</strong><br>
        We use cookies to improve your experience on our site. You can control the use of cookies through your browser settings...<br><br>
        <strong>10. Third-Party Services</strong><br>
        Our services may contain links to third-party websites or services that are not owned or controlled by us...<br><br>
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