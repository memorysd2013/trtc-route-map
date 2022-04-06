// 轉換 latlnt
export function transformLatlng(arr) {
  let [a, b] = arr
  return [b, a]
}

// 在網址列加入 Odata 語法的 query string
export function setQueryToUrl(url, query) {
  let _url = url + '?$filter='
  Object.keys(query).forEach((key, index) => {
    _url += index === 0
      ? `${key} eq ${typeDetector(query[key])}`
      : ` and ${key} eq ${typeDetector(query[key])}`
  })
  return _url
}

function typeDetector(param) {
  if (typeof param === 'string') {
    return `'${param}'`
  } else if (typeof param === 'number') {
    return param
  } else {
    return param
  }
}