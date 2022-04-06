<script setup>
import { ref } from "@vue/reactivity"

const props = defineProps({
  identities: Object,
})

const isInfoCollapse = ref(true)
</script>

<template lang="pug">
.information.flex.v-center(:class="[isInfoCollapse && 'collapse']")
  i.fas.fa-caret-left.caret-icon(@click="isInfoCollapse = !isInfoCollapse")
  div(v-for="(identity, key) in identities" :key="key")
    span(v-if="identity.user?.id") hi, {{ identity.user.name }}
    span(v-else) 請登入您的 {{ key }} 帳號
    slot(:identity="identity" :identityKey="key")
  
</template>

<style scoped>
.information {
  background-color: #f4f4f4;
  padding: 0.5rem;
  border-radius: 4px;
  transform: translateX(calc(100% - 2rem));
  cursor: default;
  transition: transform 0.6s;
}

.information.collapse {
  transform: translateX(0px);
}

.information span {
  padding: 0 1rem;
}

.information .caret-icon {
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s;
}
.information.collapse .caret-icon {
  transform: rotate(180deg);
}  
</style>