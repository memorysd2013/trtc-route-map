<script setup>
const props = defineProps({
  isLogin: Boolean,
})
const emits = defineEmits(['logout'])

const logout = () => emits('logout')
</script>

<template lang="pug">
#googleLoginButton(v-show="!props.isLogin")
#googleLogoutButton(v-if="props.isLogin" @click="logout")
  .icon.fab.fa-google
  span Google 帳號登出

</template>