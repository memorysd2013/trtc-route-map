import { transformLatlng } from './utils'

/**
 * 處理捷運營運路線車站基本資料
 *  - 彙集所有不同路線的站別
 *  - 去重
 */
export function handleStationOfRouteResponse(response) {
  let stations = []
  let map = new Map()
  response.forEach(res => {
    res.Stations.forEach(s => {
      if (!map.has(s.StationID)) {
        map.set(s.StationID)
        stations.push(s)
      }
    })
  })

  return stations
}

/**
 * 利用正則分離出需要的字符
 *  - Geometry: LINESTRING(1.50 2.98,1.50 2.98..)
 *  - Geometry: MULTILINESTRING((1.50 2.98,1.50 2.98..),(1.50 2.98,1.50 2.98..))
 */
export function handleShapeResponse(response) {
  let geoMaps = {}

  response.forEach(res => {
    let { Geometry } = res
    let formats = Geometry.match(/[0-9 \.\,]+[^),(]/g)
    geoMaps[res.LineID] = formats.map(d => d.split(',').map(e => transformLatlng(e.split(' ').map(f => Number(f)))))
  })

  return geoMaps
}