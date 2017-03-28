import {
  getPhotoInfo,
  deletePhotoById,
  likePhotoById,
  undoLikePhotoById,
  setPhotoHasMeById,
  undoPhotoHasMeById,
} from '../../http'

import { deletePhoto } from '../gallery/actions'

import {
  GALLERY_OVERLAY_HIDE_COMMENT,
  GALLERY_OVERLAY_SHOW_COMMENT,
} from '../comment/actions'

export const RECEIVE_PHOTO_INFO = 'RECEIVE_PHOTO_INFO'
export const GALLERY_OVERLAY_TIP_SHOW = 'GALLERY_OVERLAY_TIP_SHOW'
export const GALLERY_OVERLAY_TIP_HIDE = 'GALLERY_OVERLAY_TIP_HIDE'
export const GALLERY_OVERLAY_LIKE_PHOTO = 'GALLERY_OVERLAY_LIKE_PHOTO'
export const GALLERY_OVERLAY_UNDO_LIKE_PHOTO = 'GALLERY_OVERLAY_UNDO_LIKE_PHOTO'
export const GALLERY_OVERLAY_HAS_ME = 'GALLERY_OVERLAY_HAS_ME'
export const GALLERY_OVERLAY_UNDO_HAS_ME = 'GALLERY_OVERLAY_UNDO_HAS_ME'

function receivePhotoInfo (photoInfo) {
  return {
    type: RECEIVE_PHOTO_INFO,
    photoInfo,
  }
}

export function fetchPhotoInfo (photoId) {
  return dispatch => {
    return getPhotoInfo(photoId)
      .then(json => dispatch(receivePhotoInfo(json.data)))
  }
}

export function requestDeletePhoto (photoId, groupIndex, photoIndex) {
  return dispatch => {
    return deletePhotoById(photoId)
      .then(() => dispatch(deletePhoto(groupIndex, photoIndex)))
  }
}

function likePhoto () {
  return {
    type: GALLERY_OVERLAY_LIKE_PHOTO,
  }
}


export function requestLikePhoto (photoId) {
  return dispatch => {
    dispatch(likePhoto())
    return likePhotoById(photoId)
  }
}

function undoLikePhoto () {
  return {
    type: GALLERY_OVERLAY_UNDO_LIKE_PHOTO,
  }
}

export function requestUndoLikePhoto (photoId) {
  return dispatch => {
    dispatch(undoLikePhoto())
    return undoLikePhotoById(photoId)
  }
}

function setPhotoHasMe () {
  return {
    type: GALLERY_OVERLAY_HAS_ME,
  }
}

export function requestPhotoHasMe (photoId) {
  return dispatch => {
    dispatch(setPhotoHasMe())
    return setPhotoHasMeById(photoId)
  }
}

function undoPhotoHasMe () {
  return {
    type: GALLERY_OVERLAY_UNDO_HAS_ME,
  }
}

export function requestUndoPhotoHasMe (photoId) {
  return dispatch => {
    dispatch(undoPhotoHasMe())
    return undoPhotoHasMeById(photoId)
  }
}

export function showTip (tipIndex, tipContent) {
  return {
    type: GALLERY_OVERLAY_TIP_SHOW,
    tipInfo: {
      tipIndex, tipContent
    },
  }
}

export function hideTip () {
  return {
    type: GALLERY_OVERLAY_TIP_HIDE,
  }
}

export function showComments () {
  return {
    type: GALLERY_OVERLAY_SHOW_COMMENT,
  }
}

export function hideComments () {
  return {
    type: GALLERY_OVERLAY_HIDE_COMMENT,
  }
}

