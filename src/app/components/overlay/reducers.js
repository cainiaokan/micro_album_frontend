import {
  GALLERY_SHOW_NEXT,
  GALLERY_SHOW_PREV,
  GALLERY_SLIDE_OUT,
  GALLERY_DELETE_PHOTO,
} from '../gallery/actions'

import {
  RECEIVE_PHOTO_INFO,
  GALLERY_OVERLAY_TIP_SHOW,
  GALLERY_OVERLAY_TIP_HIDE,
  GALLERY_OVERLAY_LIKE_PHOTO,
  GALLERY_OVERLAY_UNDO_LIKE_PHOTO,
  GALLERY_OVERLAY_HAS_ME,
  GALLERY_OVERLAY_UNDO_HAS_ME,
} from './actions'

import {
  GALLERY_OVERLAY_SHOW_COMMENT,
  GALLERY_OVERLAY_HIDE_COMMENT,
} from '../comment/actions'

import { GALLERY_OVERLAY_COMMIT_COMMENT } from '../comment/actions'

const defaultState = {
  isShow: true,
  isShowTip: false,
  isShowComment: false,
}

export default function galleryOverlay (state={
  ...defaultState,
}, action) {
  switch (action.type) {
  case RECEIVE_PHOTO_INFO:
    // if (!state.photoId || state.photoId === action.photoInfo.mediaId) {
    return {
      ...state,
      ...action.photoInfo,
      isShow: true,
    }
    // } else {
    //   return state
    // }
  case GALLERY_OVERLAY_LIKE_PHOTO:
    return {
      ...state,
      liked: true,
      commentNum: state.commentNum + 1,
    }
  case GALLERY_OVERLAY_UNDO_LIKE_PHOTO:
    return {
      ...state,
      liked: false,
      commentNum: state.commentNum - 1,
    }
  case GALLERY_OVERLAY_COMMIT_COMMENT:
    return {
      ...state,
      commentNum: state.commentNum + 1,
    }
  case GALLERY_OVERLAY_HAS_ME:
    return {
      ...state,
      hasMe: true,
      commentNum: state.commentNum + 1,
    }
  case GALLERY_OVERLAY_UNDO_HAS_ME:
    return {
      ...state,
      hasMe: false,
      commentNum: state.commentNum - 1,
    }
  case GALLERY_OVERLAY_TIP_SHOW:
    return {
      ...state,
      isShowTip: true,
      ...action.tipInfo,
    }
  case GALLERY_OVERLAY_TIP_HIDE:
    return {
      ...state,
      isShowTip: false,
    }
  case GALLERY_OVERLAY_SHOW_COMMENT:
    return {
      ...state,
      isShowComment: true,
    }
  case GALLERY_OVERLAY_HIDE_COMMENT:
    return {
      ...state,
      isShowComment: false,
    }
  case GALLERY_DELETE_PHOTO:
  case GALLERY_SHOW_NEXT:
  case GALLERY_SHOW_PREV:
    return {
      ...state,
      isShow: true,
      isShowTip: false,
      isShowComment: false,
    }
  case GALLERY_SLIDE_OUT:
    return {
      ...defaultState,
    }
  default:
    return state
  }
}