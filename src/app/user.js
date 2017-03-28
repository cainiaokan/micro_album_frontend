function getCookie (name) {
  let arr
  let reg=new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2])
  } else {
    return null
  }
}

const userInfo = JSON.parse(getCookie('ud'))

export default userInfo