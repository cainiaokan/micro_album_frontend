import {
  GALLERY_SHOW_NEXT,
  GALLERY_SHOW_PREV,
  GALLERY_DELETE_PHOTO,
  GALLERY_CLOSE,
} from '../gallery/actions'

import {
  GALLERY_OVERLAY_REQUEST_COMMENTS,
  GALLERY_OVERLAY_RECEIVE_COMMENTS,
  GALLERY_OVERLAY_COMMIT_COMMENT,
  GALLERY_OVERLAY_COMMIT_INPUT_CHANGE,
  GALLERY_OVERLAY_HIDE_COMMENT,
} from './actions'

const defaultState = {
  isLoaded: false,
  isLoadingMore: false,
  pageNum: 1,
  tempContent: '',
  hasMe: [],
  liked: [],
  comments: [],
}

export default function comments (state = {
  ...defaultState
}, action) {
  switch (action.type) {
  case GALLERY_SHOW_NEXT:
  case GALLERY_SHOW_PREV:
  case GALLERY_DELETE_PHOTO:
  case GALLERY_OVERLAY_HIDE_COMMENT:
  case GALLERY_CLOSE:
    return {
      ...state,
      ...defaultState,
    }
  case GALLERY_OVERLAY_REQUEST_COMMENTS:
    return {
      ...state,
      isLoadingMore: true,
    }
  case GALLERY_OVERLAY_RECEIVE_COMMENTS:
    return {
      ...state,
      ...action.commentInfo,
      comments: state.comments.concat(action.commentInfo.comments),
      isLoadingMore: false,
    }
  case GALLERY_OVERLAY_COMMIT_INPUT_CHANGE:
    return {
      ...state,
      tempContent: action.content,
    }
  case GALLERY_OVERLAY_COMMIT_COMMENT:
    return {
      ...state,
      comments: [action.comment].concat(state.comments),
    }
  default:
    return state
  }
}