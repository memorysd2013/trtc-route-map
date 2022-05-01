import { API_URL, METRO_SYSTEM } from '../static/config'
import { setQueryToUrl } from './utils'

export async function getLineAPI({ }) {
  let url = `${API_URL}/Line/${METRO_SYSTEM}`
  let response = await useFetch({ url })
  if (response) {
    return response
  } else {
    return null
  }
}

// 取得捷運路線 geojson
export async function getShapeAPI() {
  let url = `${API_URL}/Shape/${METRO_SYSTEM}`
  let response = await useFetch({ url })
  if (response) {
    return response
  } else {
    return null
  }
}

// 取得捷運營運路線車站基本資料
export async function getStationOfRouteAPI({ query }) {
  let url = setQueryToUrl(`${API_URL}/StationOfRoute/${METRO_SYSTEM}`, query)
  let response = await useFetch({ url })
  if (response) {
    return response
  } else {
    return null
  }
}

// 取得捷運站出入口資訊
export async function getStationExitAPI({ query }) {
  let url = setQueryToUrl(`${API_URL}/StationExit/${METRO_SYSTEM}`, query)
  let response = await useFetch({ url })
  if (response) {
    return response
  } else {
    return null
  }
}

/**
 * fetch
 */
function useFetch({ url, method = 'GET' }) {
  return fetch(url, { method })
    .then(async res => {
      let response = await res.json()
      switch (res.status) {
        case 200:
          return response
        case 429:
          alert(`${response?.message || ''} 請稍後再試。`)
          return null
        default:
          return response
      }
    })
    .catch(err => null)
}

/**
 * web api
 */
export function getGeolocation(timeout = 5000) {
  try {
    let m
    if (navigator.geolocation) {
      m = new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout }))
        .then(val => [val?.coords?.latitude || 0, val?.coords?.longitude || 0])
        .catch(err => null)
    }
    return m
  } catch (e) {
    //
  }
}