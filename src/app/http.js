import fetch from 'isomorphic-fetch'

const API_PATH = process.env.NODE_ENV !== 'production' ?
        'http://weixin.imliren.com/v/api' : 'http://m.weiqunxiangce.com/v/api'

const FETCH_CONFIG = { credentials: 'include' }

export function getNews (pageNum) {
  return fetch(`${API_PATH}/getNewsInfo?pageNum=${pageNum}`, FETCH_CONFIG)
    .then(response => response.json())
}