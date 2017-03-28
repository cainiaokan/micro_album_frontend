import './index.less'
import '../res/style/btn.less'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { } from './actions'
import {  } from '../components/gallery/actions'
import { TO_ALBUMS } from '../routerConfig'
import Nav from '../components/nav/nav'

class AlbumList extends React.Component {

  constructor(props) {
    super(props)
    this.onScrollHandler = this.onScrollHandler.bind(this)
    this.onGalleryShow = this.onGalleryShow.bind(this)
    this.getPhotoByIndex = this.getPhotoByIndex.bind(this)
    this.goToAlbum = this.goToAlbum.bind(this)
  }

  componentDidMount () {
    document.addEventListener('scroll', this.onScrollHandler)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.onScrollHandler)
  }

  goToAlbum (ev) {
    window.location.href = '/photos/info/' + ev.currentTarget.dataset.groupId
  }

  render () {
    const {
      isLoaded,
      isFetching,
      items,
      hasMore,
    } = this.props

    return (
      <div className='album-list'>
        {
          isLoaded && !items.length ?
          <div className='no-album'>
            <p>创建一个只有自己的私人相册</p>
            <p>也可以邀请亲朋好友一起共享照片</p>
            <div className='btn-container'>
              <button className='btn btn-red btn-rounded btn-wider'>创建一个相册</button>
            </div>
            <p>相册空间无限制</p>
            <p className='help'><a href='javascript:;'>微群相册使用指南</a></p>
          </div> : null
        }
        <div className={`upload-guide ${items.length ? 'auto-hide' : ''}`}>
        点击这里上传照片
        </div>
        {
          items.map((item, groupIndex) =>
            item.type === 'newsInfo' ?
            <div key={groupIndex} className='news-card'>
              <div
                className='title'
                data-group-id={item.info.groupId}
                onClick={this.goToAlbum}>
                <b>{item.info.groupName}</b>
                <i>{item.info.description + ' '}{item.info.updateTime}</i>
              </div>
              <div className='photo-list'>
                {
                  item.info.mediaList.map((media, photoIndex) =>
                    <div
                      key={photoIndex}
                      id={`photo-${media.photoId}`}
                      className='photo'
                      style={ {backgroundImage: `url(${media.photoUrl}!w132h132)`} }
                      data-group-index={groupIndex}
                      data-photo-index={photoIndex}
                      onClick={this.onGalleryShow}>
                      {
                        media.commentSize > 0 ?
                        <div className='comment-count'>{media.commentSize > 99 ? media.commentSize + '+' : media.commentSize}</div> : null
                      }
                    </div>
                  )
                }
              </div>
            </div> :
            <div
              key={groupIndex}
              className='empty-album clearfix'
              data-group-id={item.info.groupId}
              onClick={this.goToAlbum}>
              <div
                className='head-pic'
                style={ {backgroundImage: `url(${item.info.headImgUrl})`} }></div>
              <div className='album-info'>
                <h2>{item.info.groupName}</h2>
                <p>{item.info.memberNum}人，0张照片（我{item.info.createTime}{item.info.isOwn ? '创建' : '加入'}）</p>
                <a href='/photos/select' className='btn btn-red btn-rounded'>上传照片</a>
              </div>
            </div>
          )
        }
        {
          isFetching || !hasMore ?
          <div className={`loading ${hasMore ? '' : 'no-more-record'}`}>
            {
              !hasMore ? '已加载全部' : ''
            }
          </div> : null
        }
        <Nav pageId={TO_ALBUMS.id} />
      </div>
    )
  }
}

AlbumList.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  hasEmptyAlbum: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  pageNum: PropTypes.number.isRequired,
  message: PropTypes.object,
  showGallery: PropTypes.bool.isRequired,
  photoId: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    ...state.news,
    showGallery: state.gallery.showGallery,
    photoId: state.gallery.photoId,
  }
}

export default connect(mapStateToProps)(AlbumList)
