<script setup>
import { computed, ref, reactive, watch } from 'vue'
const emit = defineEmits(['chooseOption'])
const props = defineProps({
  propData: Object,
})

const activeNames = ref(['1'])

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
#form.flex.column
  slot

  .metro.flex
    .metroLineList.flex.column
      template(v-for="(item, i) of metroData.lineList" :key="i")
        ColorfulButton(
          :isActive="item.isActive"
          :backgroundColor="item.bcColor"
          @click="chooseOption(item, i, 'line')"
        ) {{ item.label }}

    .metroStationList.flex.column(v-if="metroData.stationList")
      template(v-for="(item, i) of metroData.stationList" :key="i")
        ColorfulButton(
          :isActive="item.isActive"
          :backgroundColor="stationBc"
          @click="chooseOption(item, i, 'station')"
        ) {{ item.label }}

</template>

<style lang="scss" scoped>
#form {
  background-color: #fff;
  height: calc(100vh - 1rem);
  padding: 0.5rem;
  min-width: 500px;
  
  .metro {
    margin-top: .5rem;
    overflow: auto;
    .metroLineList, .metroStationList {
      width: 50%;
      overflow: auto;
      > * {
        flex: 0 0 auto;
        & + * {
          margin-top: .25rem;
        }
      }
    }
  }
}
</style>