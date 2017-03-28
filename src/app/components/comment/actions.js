import {
  getBasicComments,
  getTextComments,
  commentPhotoById,
} from '../../http'

import userInfo from '../../user'

export const GALLERY_OVERLAY_REQUEST_COMMENTS = 'GALLERY_OVERLAY_REQUEST_COMMENTS'
export const GALLERY_OVERLAY_RECEIVE_COMMENTS = 'GALLERY_OVERLAY_RECEIVE_COMMENTS'
export const GALLERY_OVERLAY_COMMIT_COMMENT = 'GALLERY_OVERLAY_COMMIT_COMMENT'
export const GALLERY_OVERLAY_COMMIT_INPUT_CHANGE = 'GALLERY_OVERLAY_COMMIT_INPUT_CHANGE'
export const GALLERY_OVERLAY_SHOW_COMMENT = 'GALLERY_OVERLAY_SHOW_COMMENT'
export const GALLERY_OVERLAY_HIDE_COMMENT = 'GALLERY_OVERLAY_HIDE_COMMENT'

function receiveBasicComments (data) {
  const { hasMe, moreTextComment, text, liked } = data
  return {
    type: GALLERY_OVERLAY_RECEIVE_COMMENTS,
    commentInfo: {
      hasMe,
      hasMore: moreTextComment,
      comments: text,
      liked,
      isLoaded: true,
    }
  }
}

export function fetchBasicComments (photoId) {
  return dispatch => {
    return getBasicComments(photoId)
      .then(json => dispatch(receiveBasicComments(json.data)))
  }
}

function requestTextComments () {
  return {
    type: GALLERY_OVERLAY_REQUEST_COMMENTS,
  }
}

function receiveTextComments (data) {
  const { moreTextComment, text, pageNum } = data
  return {
    type: GALLERY_OVERLAY_RECEIVE_COMMENTS,
    commentInfo: {
      hasMore: moreTextComment,
      comments: text,
      pageNum,
    }
  }
}

export function fetchTextComments (photoId, pageNum) {
  return dispatch => {
    dispatch(requestTextComments())
    return getTextComments(photoId, pageNum)
      .then(json => dispatch(receiveTextComments(json.data)))
  }
}

export function commitInputChange (content) {
  return {
    type: GALLERY_OVERLAY_COMMIT_INPUT_CHANGE,
    content,
  }
}

function commitCommentSuccess (content) {
  var d = new Date()
  return {
    type: GALLERY_OVERLAY_COMMIT_COMMENT,
    comment: {
      content,
      name: userInfo.nickName,
      userId: userInfo.userId,
      time: `${d.getMonth() + 1}月${d.getDate()}日`
    }
  }
}

export function commitComment (photoId, content) {
  return dispatch => {
    dispatch(commitCommentSuccess(content))
    return commentPhotoById(photoId, content)
  }
}
