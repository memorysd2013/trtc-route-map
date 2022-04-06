<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import SignInButton from './components/unit/SignInButton.vue';
import LeafletMap from './components/unit/LeafletMap.vue';
import Form from './components/Form.vue';
import InformationBar from './components/InformationBar.vue';
import { getLineAPI, getShapeAPI, getStationOfRouteAPI, getStationExitAPI } from './service/api';
import { handleShapeResponse, handleStationOfRouteResponse } from './service/response-handler';
import { checkCrossStation } from './static/cross-station-mapping';
import {
  getGoogleUser,
  getFacebookUser,
  googleLogin,
  googleLogout,
  facebookLogin,
  facebookLogout,
} from './service/public';

const identities = reactive({
  google: {
    user: null,
    icon: 'fab fa-google',
    login: googleLogin,
    logout: googleLogout,
    getUser: getGoogleUser,
  },
  facebook: {
    user: null,
    icon: 'fab fa-facebook-f',
    login: facebookLogin,
    logout: facebookLogout,
    getUser: getFacebookUser,
  }
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

onMounted(async () => {
  // google sdk init 速度很慢，為避免重複 google 登入，只能等 sdk 完全初始化後再取得 user
  setTimeout(() => {
    setUser('google');
    setUser('facebook');
  }, 1500)

  await getMetroLineOption()
  await getMetroShape()
})

const setUser = function (key) {
  identities[key].getUser()
    .then(res => identities[key].user = res)
    .catch(err => identities[key].user = null);
}

const clearUser = function (key) {
  identities[key].user = null;
}

const updateMetroData = async function ({ item, type }) {
  if (!identities.google.user || !identities.facebook.user) {
    alert('請先登入 Google 與 Facebook 帳號')
    return
  }
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

const updateLocation = async function (m) {
  if (!identities.google.user || !identities.google.user) {
    alert('請先登入 Google 與 Facebook 帳號')
    return
  }
  //
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
.infoWrapper
  InformationBar(:identities="identities" v-slot:default="slotProps")
    SignInButton(:identity="slotProps.identity" :identityKey="slotProps.identityKey" @setUser="setUser" @clearUser="clearUser")

.wrapper.flex
  Form(:propData="metroData" @chooseOption="updateMetroData")
  LeafletMap(
    :identities="identities"
    :placeData="placeData"
    :metroData="metroData"
    @updateLocation="updateLocation"
  )

</template>

<style lang="stylus" scoped>
.infoWrapper
  position absolute
  top 0
  right 0
  z-index 2000

</style>