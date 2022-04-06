<script setup>
import { computed } from 'vue'

const props = defineProps({
  backgroundColor: String,
  label: String,
  isActive: Boolean,
})

const bcStyle = computed(() => ({ backgroundColor: props.backgroundColor }))

</script>

<template lang="pug">
button(:class="{ isActive }")
  span {{ label }}
  .background(:style="bcStyle")
</template>

<style lang="stylus" scoped>
btn_h = 40px
btn_w = 200px

button
  position relative
  background-color transparent
  border none
  cursor pointer
  font-size 1rem
  height btn_h
  width btn_w
  overflow hidden
  &:hover, &.isActive
    .background
      transform translateX(0)
    span
      color #fff

span
  z-index 1
  position absolute
  top 0
  left 1.5rem
  line-height 40px
  transition color .4s

.background
  position absolute
  top 0
  left 0
  width 100%
  height btn_h
  transform translateX(calc(-100% + 1rem))
  transition transform .4s

</style>