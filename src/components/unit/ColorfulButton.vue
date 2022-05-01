<script setup>
import { computed } from 'vue'

const props = defineProps({
  backgroundColor: String,
  isActive: Boolean,
})

const bcStyle = computed(() => ({ backgroundColor: props.backgroundColor }))

</script>

<template lang="pug">
button(:class="{ isActive }")
  span
    slot
  .background(:style="bcStyle")
</template>

<style lang="scss" scoped>
$btnH: 40px;

button {
  position: relative;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  height: $btnH;
  overflow: hidden;
  &:hover, &.isActive {
    .background {
      transform: translateX(0);
    }
    span {
      color: #fff;
    }
  }
}

span {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 1.5rem;
  line-height: 40px;
  transition: color .4s;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: $btnH;
  transform: translateX(calc(-100% + 1rem));
  transition: transform .4s;
}

</style>