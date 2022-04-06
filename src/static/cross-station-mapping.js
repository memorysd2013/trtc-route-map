/**
 * 測試發現某些不同線重疊的站別會有沒有出口資料的情形
 * 若檢查有以下的站別則回傳另一條線的同一站
 */
const crossStationMap = {
  R07: "O06",
  O05: "G09",
  G10: "R08",
  G12: "BL11",
}

export function checkCrossStation(stationId) {
  return crossStationMap?.[stationId] ? crossStationMap[stationId] : stationId
}