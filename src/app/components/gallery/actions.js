export const GALLERY_SHOW = 'GALLERY_SHOW'
export const GALLERY_SLIDE_IN = 'GALLERY_SLIDE_IN'
export const GALLERY_AFTER_SLIDE_IN = 'GALLERY_AFTER_SLIDE_IN'
export const GALLERY_SLIDE_OUT = 'GALLERY_SLIDE_OUT'
export const GALLERY_AFTER_SLIDE_OUT = 'GALLERY_AFTER_SLIDE_OUT'
export const GALLERY_SHOW_NEXT = 'GALLERY_SHOW_NEXT'
export const GALLERY_SHOW_PREV = 'GALLERY_SHOW_PREV'
export const GALLERY_DELETE_PHOTO = 'GALLERY_DELETE_PHOTO'
export const GALLERY_CLOSE = 'GALLERY_CLOSE'

export function showGallery (config) {
  return dispatch => {
    dispatch({
      type: GALLERY_SHOW,
      config,
    })
  }
}

export function slideIn () {
  return {
    type: GALLERY_SLIDE_IN
  }
}

export function afterSlideIn () {
  return {
    type: GALLERY_AFTER_SLIDE_IN,
  }
}

export function slideOut () {
  return {
    type: GALLERY_SLIDE_OUT,
  }
}

export function afterSlideOut () {
  return {
    type: GALLERY_AFTER_SLIDE_OUT,
  }
}

export function showNextPhoto () {
  return {
    type: GALLERY_SHOW_NEXT,
  }
}

export function showPrevPhoto () {
  return {
    type: GALLERY_SHOW_PREV,
  }
}

export function deletePhoto (groupIndex, photoIndex) {
  return {
    type: GALLERY_DELETE_PHOTO,
    groupIndex, photoIndex,
  }
}

export function closeGallery () {
  return {
    type: GALLERY_CLOSE,
  }
}
