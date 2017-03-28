import {
  REQUEST_NEWS, RECEIVE_NEWS,
} from './actions'

import {
  GALLERY_DELETE_PHOTO,
} from '../components/gallery/actions'

export default function news (state = {
  isLoaded: false,
  hasEmptyAlbum: false,
  isFetching: false,
  items: [],
  hasMore: true,
  pageNum: 1,
  message: null,
  showGallery: false,
}, action) {
  switch(action.type) {
  case REQUEST_NEWS:
    return {
      ...state,
      isFetching: true,
    }
  case RECEIVE_NEWS:
    return {
      ...state,
      isLoaded: true,
      isFetching: false,
      hasMore: action.hasMore,
      hasEmptyAlbum: action.hasEmptyAlbum,
      pageNum: state.pageNum + 1,
      items: [...state.items, ...action.items],
      message: action.message,
    }
  case GALLERY_DELETE_PHOTO:
    return deletePhoto(state, action)
  default:
    return state
  }
}

function deletePhoto (state, action) {
  const { groupIndex, photoIndex } = action
  const items = state.items
  const mediaList = items[groupIndex].info.mediaList

  if (mediaList.length > 1) {
    mediaList.splice(photoIndex, 1)
    return {
      ...state,
      items: items.slice(0)
    }
  } else {
    items.splice(groupIndex, 1)
    return {
      ...state,
      items: items.slice(0),
    }
  }
}