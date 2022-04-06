<script setup>
import { onMounted, computed, ref, reactive, watch } from 'vue'
import { getGeolocation } from '../../service/api'
const emit = defineEmits(['updateLocation'])
const leafletMapLayoutStyle = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const shapeDefaultColor = '#aaa'

let map = {}
let marker = {}
let polylineIns = {}
let markerIns = []

const props = defineProps({
  identities: Object,
  metroData: Object,
})

// 點擊到的位置經緯度 [lat, lng]
const latLng = reactive({ m: [25.001984, 121.5266816] })

const isMapInit = ref(false)
const lastTriggerLineId = ref('')

const avatars = computed(() => {
  return Object.keys(props.identities).map(idt => props.identities[idt]?.user?.image).filter(f => f)
})

// 登入身份更新時 更新 marker 內容
watch(props.identities, () => {
  let els = avatars.value.map(url => `<img src="${url}" class="tl-img">`).join('')
  setTimeout(() => {
    if (marker.bindTooltip) {
      marker.bindTooltip('Here you are <br/>' + els)
    }
  }, 0)
})

// 等 map 完全初始化後才會執行生成 shapeLine
watch(() => props.metroData.shapeOfList, () => {
  awaitUntil()

  function awaitUntil() {
    window.requestAnimationFrame(() => isMapInit.value ? generateAllShape() : awaitUntil())
  }

  function generateAllShape() {
    Object.keys(props.metroData.shapeOfList).forEach(id => {
      polylineIns[id] = L.polyline(props.metroData.shapeOfList[id], { color: shapeDefaultColor }).addTo(map)
    })
  }
})

// 將選定到的路線 highLight
watch(() => props.metroData.selectedLine, () => {
  let plyIns = polylineIns[props.metroData.selectedLine]

  if (lastTriggerLineId.value) {
    polylineIns[lastTriggerLineId.value].setStyle({ color: shapeDefaultColor })
  }

  if (plyIns) {
    let activeLine = props.metroData.list.find(m => m.LineID === props.metroData.selectedLine)
    plyIns.setStyle({ color: activeLine?.LineColor || '' })
    plyIns.bringToFront()
    map.fitBounds(plyIns.getBounds())
  }

  lastTriggerLineId.value = props.metroData.selectedLine
  clearMarkIns()
})

watch(() => props.metroData.exit, () => {
  clearMarkIns()

  markerIns = props.metroData.exit.map(e => {
    let { ExitPosition, ExitName, LocationDescription } = e
    let exitId = ExitName?.Zh_tw?.match(/[\w]+$/g)?.[0] || '出口'
    let divIcon = L.divIcon({ className: 'div-icon', html: `<div>${exitId}</div>`, iconSize: [20, 20] });

    return L.marker([ExitPosition.PositionLat, ExitPosition.PositionLon], { icon: divIcon })
      .bindTooltip(`${ExitName.Zh_tw} (${ExitName.En})<br/>${LocationDescription}`)
      .openTooltip()
      .addTo(map);
  })

  if (props.metroData.exit?.[0]?.ExitPosition) {
    map.flyTo([props.metroData.exit[0].ExitPosition.PositionLat, props.metroData.exit[0].ExitPosition.PositionLon], 18)
  }
})

onMounted(async () => {
  // 如果能取得使用者經緯度就覆蓋預設值
  let m = await getGeolocation()
  if (m) {
    latLng.m = m
  }

  await mapInit()
})

// 地圖生成
const mapInit = () => {
  // init map
  map = L.map('mapid', { center: latLng.m, zoom: 15 });
  map.on('click', e => {
    marker.setLatLng(e.latlng)
    emit('updateLocation', e.latlng)
  });

  // 加入底圖
  L.tileLayer(leafletMapLayoutStyle, { maxZoom: 20 }).addTo(map);

  // init marker
  marker = L.marker(latLng.m, { draggable: true, autoPan: true })
    .bindTooltip('please login google & facebook first')
    .openTooltip()
    .addTo(map);
  marker.on('moveend', e => {
    if (e.target._latlng) {
      emit('updateLocation', e.target._latlng)
    }
  });

  isMapInit.value = true
}

const clearMarkIns = () => {
  if (markerIns.length) {
    markerIns.forEach(m => m.remove())
  }
  markerIns = []
}
</script>

<template lang="pug">
#mapid
</template>

<style lang="stylus">
.div-icon
  position relative
  font-size 1.5rem
  text-shadow 2px #fbb034
  text-align center
  font-weight 500
  &:before
    content ''
    position absolute
    z-index -1
    top 0
    left 0
    border 15px solid
    border-color #fbb034 transparent transparent #fbb034

</style>
<style lang="stylus" scoped>
#mapid
  width 100%
  height 100vh

.tl-img
  width 60px
  height 60px

.div-icon
  width 30px
  height 30px
  background-color blue

</style>