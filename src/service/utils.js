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

/**
 * https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
 */
export function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};