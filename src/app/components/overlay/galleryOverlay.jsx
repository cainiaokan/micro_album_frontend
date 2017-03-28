import './galleryOverlay.less'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CommentViewer from '../comment/commentViewer'
import {
  fetchPhotoInfo,
  requestDeletePhoto,
  requestLikePhoto,
  requestUndoLikePhoto,
  requestPhotoHasMe,
  requestUndoPhotoHasMe,
  showTip,
  hideTip,
  showComments,
  hideComments,
} from './actions'
import { slideOut as gallerySlideOut } from '../gallery/actions'

class GalleryOverlay extends React.Component {

  constructor (props) {
    const { dispatch, photoId } = props
    super(props)
    this.clickHandler = this.clickHandler.bind(this)
    this.closeHandler = this.closeHandler.bind(this)
    dispatch(fetchPhotoInfo(photoId))
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, photoId } = this.props
    const newPhotoId = nextProps.photoId
    if (photoId !== newPhotoId && !!newPhotoId) {
      dispatch(fetchPhotoInfo(newPhotoId))
      clearTimeout(this.tipTimeout)
    }
  }

  componentWillUnmount () {
    clearTimeout(this.tipTimeout)
  }

  clickHandler (ev) {
    const {
      dispatch,
      photoId,
      groupIndex,
      photoIndex,
      isShowTip,
      tipIndex,
      isShowComment,
      liked,
      hasMe,
    } = this.props
    const id = ev.target.dataset.id

    switch (id) {
    case 'delete':
      dispatch(requestDeletePhoto(photoId, groupIndex, photoIndex))
      break
    case 'share':
      if (isShowTip && tipIndex === 2) {
        dispatch(hideTip())
      } else {
        dispatch(showTip(2, '长按图片，选择“发送给朋友”'))
        this.tipTimeout = setTimeout(() => {
          dispatch(hideTip())
        }, 3000)
      }
      if (isShowComment) {
        dispatch(hideComments())
      }
      break
    case 'has-me':
      if (hasMe) {
        dispatch(requestUndoPhotoHasMe(photoId))
        dispatch(hideTip())
      } else {
        dispatch(requestPhotoHasMe(photoId))
        dispatch(showTip(3, '我被拍到啦'))
        this.tipTimeout = setTimeout(() => {
          dispatch(hideTip())
        }, 3000)
      }
      break
    case 'like':
      if (liked) {
        dispatch(requestUndoLikePhoto(photoId))
      } else {
        dispatch(requestLikePhoto(photoId))
      }
      break
    case 'comment':
      if (isShowComment) {
        dispatch(hideComments())
      } else {
        dispatch(showComments())
      }
      break
    default:
    }
  }

  closeHandler () {
    this.props.dispatch(gallerySlideOut())
  }

  render () {
    const {
      isShow,
      commentNum,
      photoIndex,
      totalCount,
      uploadTime,
      ownerName,
      description,
      isOwner,
      hasMe,
      liked,

      isShowTip,
      tipIndex,
      tipContent,

      isShowComment,
    } = this.props

    return (
      <div className='gallery-overlay' style={ { display: isShow ? 'block' : 'none' } }>
        <div className='nav-bar'>
          <div className='basic clearfix'>
            <div className='stat'>{photoIndex + 1}/{totalCount}</div>
            <div className='close' onClick={this.closeHandler}></div>
            <div>{uploadTime}&nbsp;{ownerName}</div>
          </div>
          <div className='desc'>{description}</div>
        </div>
        <ul className='control-bar' onClick={this.clickHandler}>
          <li className={`delete ${isOwner ? '' : 'hidden'}`} data-id='delete'>删除</li>
          <li className='share' data-id='share'>分享</li>
          <li className={`has-me ${hasMe ? 'active' : ''}`} data-id='has-me'>照片有我</li>
          <li className={`like ${liked ? 'active' : ''}`} data-id='like'>赞</li>
          <li className='comment' data-id='comment'>
            {commentNum > 0 ? 
              commentNum > 99 ? '99+' : commentNum
              : ''
            }评论
          </li>
          {
            isShowTip ?
            <div className={`tip arrow-${tipIndex}`}>
            {tipContent}
            </div> : null
          }
        </ul>
        {
          isShowComment ? <CommentViewer /> : null
        }
      </div>
    )
  }
}

GalleryOverlay.propTypes = {
  isShow: PropTypes.bool,
  photoId: PropTypes.number,
  groupIndex: PropTypes.number,
  photoIndex: PropTypes.number,

  totalCount: PropTypes.number,
  commentNum: PropTypes.number,
  description: PropTypes.string,
  hasMe: PropTypes.bool,
  isOwner: PropTypes.bool,
  liked: PropTypes.bool,
  ownerName: PropTypes.string,
  uploadTime: PropTypes.string,

  isShowTip: PropTypes.bool,
  tipIndex: PropTypes.number,
  tipContent: PropTypes.string,

  isShowComment: PropTypes.bool,

  dispatch: PropTypes.func,
}

function mapStateToProps (state) {
  const { galleryOverlay, gallery } = state
  return {
    ...galleryOverlay,
    photoId: gallery.photoId,
    groupIndex: gallery.groupIndex,
    photoIndex: gallery.photoIndex,
    totalCount: gallery.totalCount,
  }
}

export default connect(mapStateToProps)(GalleryOverlay)
