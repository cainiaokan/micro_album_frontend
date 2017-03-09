import {
  REQUEST_NEWS, RECEIVE_NEWS,
} from './actions'

export function news (state = {
  hasEmptyAlbum: false,
  isFetching: false,
  hasMore: true,
  pageNum: 1,
  items: [],
  message: null,
}, action) {
  switch(action.type) {
  case REQUEST_NEWS:
    return {
      ...state,
      isFetching: true,
    }
  case RECEIVE_NEWS:
    return {
      hasEmptyAlbum: action.hasEmptyAlbum,
      isFetching: false,
      hasMore: action.hasMore,
      pageNum: state.pageNum + 1,
      items: [...state.items, ...action.items],
      message: action.message,
    }
  default:
    return state
  }
}