import fetch from 'isomorphic-fetch'

export const DOMAIN = process.env.NODE_ENV !== 'production' ?
  'http://weixin.imliren.com' : 'http://m.weiqunxiangce.com'

const API = DOMAIN + '/v/api'

const FETCH_CONFIG = { credentials: 'include' }

export function getNews (pageNum) {
  return fetch(`${API}/getNewsInfo?pageNum=${pageNum}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function getPhotoInfo (photoId) {
  return fetch(`${API}/media/getInfo?mediaId=${photoId}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function deletePhotoById (photoId) {
  return fetch(`${API}/media/delete?mediaId=${photoId}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function likePhotoById (photoId) {
  return fetch(`${API}/comment/doLiked?mediaId=${photoId}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function undoLikePhotoById (photoId) {
  return fetch(`${API}/comment/cancelLiked?mediaId=${photoId}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function setPhotoHasMeById (photoId) {
  return fetch(`${API}/comment/doHasMe?mediaId=${photoId}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function undoPhotoHasMeById (photoId) {
  return fetch(`${API}/comment/cancelHasMe?mediaId=${photoId}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function getBasicComments (photoId) {
  return fetch(`${API}/comment/getComment?mediaId=${photoId}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function getTextComments (photoId, pageNum) {
  return fetch(`${API}/comment/getTextComment?mediaId=${photoId}&pageNum=${pageNum}`, FETCH_CONFIG)
    .then(response => response.json())
}

export function commentPhotoById (photoId, content) {
  return fetch(`${API}/comment/add?mediaId=${photoId}&content=${content}`, FETCH_CONFIG)
    .then(response => response.json())
}
