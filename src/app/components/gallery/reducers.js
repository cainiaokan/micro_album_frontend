import {
  GALLERY_SHOW,
  GALLERY_SLIDE_IN,
  GALLERY_SLIDE_OUT,
  GALLERY_SHOW_NEXT,
  GALLERY_SHOW_PREV,
  GALLERY_DELETE_PHOTO,
  GALLERY_CLOSE,
} from './actions'

const defaultState = {
  showGallery: false,
  phase: 'before-slide-in',
  preLoad: [1, 1],
  loop: false,
  minScaleDown: 0.75,
  maxScaleUp: 2,
}

export default function gallery (state = {...defaultState}, action) {
  switch (action.type) {
  case GALLERY_SHOW:
    return init(state, action.config)
  case GALLERY_SLIDE_IN:
    return {
      ...state,
      phase: 'slide-in',
    }
  case GALLERY_SLIDE_OUT:
    return {
      ...state,
      phase: 'slide-out'
    }
  case GALLERY_CLOSE:
    return {
      ...defaultState
    }
  case GALLERY_SHOW_NEXT:
    return {
      ...state,
      ...goNext(state),
    }
  case GALLERY_SHOW_PREV:
    return {
      ...state,
      ...goPrev(state),
    }
  case GALLERY_DELETE_PHOTO:
    return del(state)
  default:
    return state
  }
}

function init (state, config) {
  let { groupIndex, photoIndex, totalCount, preLoad, getPhotoByIndex, loop } = config
  let photos = [getPhotoByIndex(groupIndex, photoIndex)]
  let slotIndex = 0

  let backwardPreload = preLoad[0]
  let forwardPreload = preLoad[1]

  let tmpIndex = photoIndex

  loop = loop && totalCount >= preLoad[0] + preLoad[1] + 1

  while (backwardPreload--) {
    if (tmpIndex === 0) {
      if (loop) {
        tmpIndex = totalCount - 1
      } else {
        break
      }
    } else {
      tmpIndex--
    }
    slotIndex++
    photos.unshift(getPhotoByIndex(groupIndex, tmpIndex))
  }

  tmpIndex = photoIndex

  while (forwardPreload--) {
    if (tmpIndex === totalCount - 1) {
      if (loop) {
        tmpIndex = 0
      } else {
        break
      }
    } else {
      tmpIndex++
    }
    photos.push(getPhotoByIndex(groupIndex, tmpIndex))
  }

  return {
    ...state,
    ...config,
    photos,
    loop,
    photoId: photos[slotIndex].photoId,
    slotIndex,
  }
}

function goNext(state) {
  let {
    totalCount,
    getPhotoByIndex,
    preLoad,
    photos,
    loop,
    groupIndex,
    photoIndex,
    slotIndex,
  } = state

  const rightPreloadIndex = photoIndex + preLoad[1] + 1

  if (rightPreloadIndex <= totalCount - 1) {
    if (photoIndex < preLoad[0] && !loop) {
      photos = [
        ...photos,
        getPhotoByIndex(groupIndex, rightPreloadIndex)
      ]
      slotIndex++
    } else {
      photos = [
        ...photos.slice(1),
        getPhotoByIndex(groupIndex, rightPreloadIndex)
      ]
    }
    photoIndex++
  } else {
    if (loop) {
      photos = [
        ...photos.slice(1),
        getPhotoByIndex(groupIndex, rightPreloadIndex - totalCount)
      ]
      if (photoIndex >= totalCount - 1) {
        photoIndex = 0
      } else {
        photoIndex++
      }
    } else {
      if (photoIndex >= preLoad[0]) {
        photos = photos.slice(1)
      } else {
        slotIndex++
      }
      photoIndex++
    }
  }

  return {
    photoId: photos[slotIndex].photoId,
    photos, photoIndex, slotIndex,
  }
}

function goPrev (state) {
  let {
    totalCount,
    getPhotoByIndex,
    preLoad,
    photos,
    loop,
    groupIndex,
    photoIndex,
    slotIndex,
  } = state

  let leftPreloadIndex = photoIndex - preLoad[0] - 1

  if (leftPreloadIndex >= 0) {
    if (photoIndex > totalCount - 1 - preLoad[1] && !loop) {
      photos = [
        getPhotoByIndex(groupIndex, leftPreloadIndex),
        ...photos,
      ]
    } else {
      photos = [
        getPhotoByIndex(groupIndex, leftPreloadIndex),
        ...photos.slice(0, photos.length - 1),
      ]
    }
    photoIndex--
  } else {
    if (loop) {
      photos = [
        getPhotoByIndex(groupIndex, totalCount + leftPreloadIndex),
        ...photos.slice(0, photos.length - 1),
      ]
      if (photoIndex <= 0) {
        photoIndex = totalCount - 1
      } else {
        photoIndex--
      }
    } else {
      if (photoIndex <= totalCount - 1 - preLoad[1]) {
        photos = photos.slice(0, photoIndex + preLoad[1])
      }
      slotIndex--
      photoIndex--
    }
  }

  return {
    photoId: photos[slotIndex].photoId,
    photos, photoIndex, slotIndex,
  }
}

function del (state) {
  let {
    photos,
    totalCount,
    groupIndex,
    photoIndex,
    slotIndex,
    preLoad,
    getPhotoByIndex,
    loop,
  } = state

  totalCount--

  const rightPreloadIndex = photoIndex + preLoad[1]
  const leftPreloadIndex = photoIndex - preLoad[0] - 1
  loop = loop && totalCount > preLoad[0] + preLoad[1]

  // 如果还有的删
  if (totalCount > 0) {
    if (loop) {
      if (photoIndex === totalCount) {
        photos = [
          getPhotoByIndex(groupIndex, leftPreloadIndex),
          ...photos.slice(0, slotIndex),
          ...photos.slice(slotIndex + 1),
        ]
        photoIndex--
      } else {
        photos = [
          ...photos.slice(0, slotIndex),
          ...photos.slice(slotIndex + 1),
          getPhotoByIndex(groupIndex, rightPreloadIndex % totalCount),
        ]
      }
    } else {
      photos = []
      for (let i = 0; i < totalCount; i++) {
        photos.push(getPhotoByIndex(groupIndex, i))
      }
      if (photoIndex === totalCount) {
        photoIndex--
      }
      slotIndex = photoIndex
    }

    return {
      ...state,
      photoIndex,
      photos,
      totalCount,
      loop,
      slotIndex,
      photoId: photos[slotIndex].photoId,
    }
  } else {
    return {
      ...state,
      phase: 'slide-out',
    }
  }
}



