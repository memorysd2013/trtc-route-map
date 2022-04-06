<script setup>
import { computed } from 'vue'

const props = defineProps({
  identity: Object,
  identityKey: String,
})
const emit = defineEmits(['clearUser', 'setUser'])

const isSignedIn = computed(() => !!props.identity?.user?.id)
const icon = computed(() => props.identity?.icon || '')

const signInOrSignOut = () => {
  isSignedIn.value
    ? props.identity.logout().then(() => emit('clearUser', props.identityKey))
    : props.identity.login().then(() => emit('setUser', props.identityKey))
}

</script>

<template lang="pug">
button(@click="signInOrSignOut") {{ isSignedIn ? '登出' : '登入' }}
  i.icon
</template>

<style scoped>
button {
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 0;
  border: none;
  background-color: white;
  padding: 5px 10px;
  cursor: pointer;
  transition: all .3s;
  color: #666;
}

button:hover {
  color: #333;
  transform: translate(-2px);
  box-shadow: 4px 4px 0 0 #ccc;
}
</style>