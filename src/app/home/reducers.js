import {
  REQUEST_NEWS, RECEIVE_NEWS,
  TOGGLE_GALLERY,
} from './actions'

export function news (state = {
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
  case TOGGLE_GALLERY:
    return {
      ...state,
      showGallery: action.showGallery,
      groupIndex: action.groupIndex,
      photoIndex: action.photoIndex,
    }
  default:
    return state
  }
}