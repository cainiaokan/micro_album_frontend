import { browserHistory } from 'react-router'


export const TO_HOME = {
  id: 'to-home',
  name: '首页',
  path: '/',
}
export const TO_GALLERY = {
  id: 'to-gallery',
  name: '相册',
  path: '/gallery',
}
export const TO_UPLOAD = {
  id: 'to-upload',
  name: '',
  path: '/upload'
}
export const TO_MY_PHOTOS = {
  id: 'to-my-photos',
  name: '我的照片',
  path: '/my_photos',
}
export const TO_USER_CENTER = {
  id: 'to-user-center',
  name: '个人中心',
  path: 'user_center',
}

export function goToPage(pageId) {
  let path = null

  switch (pageId) {
  case TO_HOME.id:
    path = TO_HOME.path
    break
  case TO_GALLERY.id:
    path = TO_GALLERY.path
    // location.href = '/photos/'
    break
  case TO_UPLOAD.id:
    path = TO_UPLOAD.path
    // location.href = '/photos/select/'
    break
  case TO_MY_PHOTOS.id:
    path = TO_MY_PHOTOS.path
    // location.href = '/photos/my/'
    break
  case TO_USER_CENTER.id:
    path = TO_USER_CENTER.path
    // location.href = '/usercenter/'
    break
  default:
    path = TO_HOME.path
  }

  browserHistory.push(path)
}