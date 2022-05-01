<script setup>
const props = defineProps({
  isLogin: Boolean,
})
</script>

<template lang="pug">
#facebookLoginButton
  .fab.fa-facebook.icon
  span {{ props.isLogin ? 'Facebook 帳號登出' : '使用 Facebook 帳號登入' }}
</template>

<style lang="scss" scoped>

</style>