<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { getLineAPI, getShapeAPI, getStationOfRouteAPI, getStationExitAPI } from './service/api';
import { handleShapeResponse, handleStationOfRouteResponse } from './service/response-handler';
import { checkCrossStation } from './static/cross-station-mapping';

import { useGoogleLogin } from './hooks/useGoogleLogin.js'
import { useFacebookLogin } from './hooks/useFacebookLogin.js'

const { googleState, googleSignout } = useGoogleLogin()
const { facebookState, facebookCore } = useFacebookLogin()

const isGuest = ref(false)
const collapeModel = ref('1')
const avatars = reactive({
  google: computed(() => googleState.user.picture),
  facebook: computed(() => facebookState.user.image),
})

/**
 * 存放捷運 api 取回的選項
 */
const metroData = reactive({
  list: [],
  selectedLine: '',

  shapeOfList: {},
  shape: [],

  stationOfList: {},
  stations: [],

  exit: [],
})

const placeData = reactive({
  place: {},
})

const isGoogleLogin = computed(() => googleState.isLogin)
const isFacebookLogin = computed(() => facebookState.isLogin)

onMounted(async () => {
  await getMetroLineOption()
  await getMetroShape()
})

const updateMetroData = async function ({ item, type }) {
  switch (type) {
    // 選擇捷運路線：取得該路線各站
    case 'line':
      if (!metroData.stationOfList?.[item.lineId]) {
        await getStationOfRoute(item.lineId)
      }
      metroData.selectedLine = item.lineId
      metroData.shape = metroData.shapeOfList[item.lineId]
      metroData.stations = metroData.stationOfList[item.lineId]
      break
    // 選擇站別：取得出入口資訊
    case 'station':
      await getStationExit(item.value)
      break
  }
}

/**
 * API and Handle response
 */
const getMetroLineOption = async function () {
  let response = await getLineAPI({})
  metroData.list = response
}

const getMetroShape = async function () {
  let response = await getShapeAPI()
  metroData.shapeOfList = handleShapeResponse(response)
}

const getStationOfRoute = async function (lineId) {
  let query = { LineID: lineId, Direction: 0 }
  let response = await getStationOfRouteAPI({ query })
  metroData.stationOfList[lineId] = handleStationOfRouteResponse(response)
}

const getStationExit = async function (stationId) {
  let query = { StationID: checkCrossStation(stationId) }
  let response = await getStationExitAPI({ query })
  metroData.exit = response || []
}
</script>

<template lang="pug">
.wrapper.flex
  Form(:propData="metroData" @chooseOption="updateMetroData")
    ElCollapse(v-model="collapeModel")
      ElCollapseItem(title="社群帳號登入" name="1")
        //- ElCheckbox(v-model="isGuest") 訪客模式
        .flex
          GoogleButton(:isLogin="isGoogleLogin" @logout="googleSignout")
          FacebookButton(:isLogin="isFacebookLogin" @click="facebookCore")

  LeafletMap(
    :avatars="avatars"
    :placeData="placeData"
    :metroData="metroData"
  )

</template>

<style lang="scss" scoped>
</style>