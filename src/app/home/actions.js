import { getNews } from '../http'

export const REQUEST_NEWS = 'REQUEST_NEWS'
export const RECEIVE_NEWS = 'RECEIVE_NEWS'
export const TOGGLE_GALLERY = 'TOGGLE_GALLERY'

function requestNews () {
  return {
    type: REQUEST_NEWS
  }
}

function receiveNews (data) {
  return {
    type: RECEIVE_NEWS,
    hasEmptyAlbum: data.type !== -1,
    hasMore: data.hasMore,
    items: data.newsList,
    message: data.message || null,
  }
}

export function fetchNews (pageNum) {
  return dispatch => {
    dispatch(requestNews())
    return getNews(pageNum)
      .then(json => dispatch(receiveNews(json.data)))
  }
}

export function toggleGallery (showGallery, groupIndex, photoIndex) {
  return dispatch => {
    dispatch({
      type: TOGGLE_GALLERY,
      showGallery,
      groupIndex,
      photoIndex,
    })
  }
}