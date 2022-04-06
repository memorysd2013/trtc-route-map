<script setup>
import ColorfulButton from './unit/ColorfulButton.vue';
import { computed, reactive, watch } from 'vue'
const emit = defineEmits(['chooseOption'])
const props = defineProps({
  propData: Object,
})

const metroData = reactive({
  lineList: [],
  stationList: [],
})

const stationBc = computed(() => {
  let activeLine = metroData.lineList.find(m => m.isActive)
  return activeLine?.bcColor || ''
})

watch(() => props.propData.list, () => {
  metroData.lineList = props.propData.list.map(p => ({ bcColor: p.LineColor, label: `${p.LineName.Zh_tw}(${p.LineID})`, lineId: p.LineID, isActive: false }))
})
watch(() => props.propData.stations, () => {
  metroData.stationList = props.propData.stations.map(p => ({ label: `${p.StationName.Zh_tw}(${p.StationID})`, value: p.StationID, isActive: false }))
}, { deep: true })

/**
 *
 */
const chooseOption = function (item, index, type) {
  if (type === 'line') {
    metroData.lineList.forEach((m, i) => m.isActive = i === index)
  } else if (type === 'station') {
    metroData.stationList.forEach((m, i) => m.isActive = i === index)
  }
  emit('chooseOption', { item, type })
}

</script>

<template lang="pug">
#form.flex
  .metroLineList.flex.column
    template(v-for="(item, i) of metroData.lineList" :key="i")
      ColorfulButton(
        :label="item.label"
        :isActive="item.isActive"
        :backgroundColor="item.bcColor" 
        @click="chooseOption(item, i, 'line')"
      )

  .metroStationList.flex.column(v-if="metroData.stationList")
    template(v-for="(item, i) of metroData.stationList" :key="i")
      ColorfulButton(
        :label="item.label"
        :isActive="item.isActive"
        :backgroundColor="stationBc" 
        @click="chooseOption(item, i, 'station')"
      )

</template>

<style lang="stylus" scoped>
#form
  background-color #f4f4f4
  height calc(100vh - 1rem)
  min-width 360px
  padding 0.5rem

  .metroLineList, .metroStationList
    overflow auto
    > *
      flex 0 0 auto
      & + *
        margin-top .25rem

</style>