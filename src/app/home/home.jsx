import './index.less'
import '../common/style/btn.less'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchNews, toggleGallery } from './actions'
import { TO_HOME } from '../routerConfig'
import Nav from '../nav/nav'
import Gallery from '../gallery/gallery'

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.onScrollHandler = this.onScrollHandler.bind(this)
    this.onGalleryShow = this.onGalleryShow.bind(this)
    this.onGalleryClose = this.onGalleryClose.bind(this)
    this.getPhotoByIndex = this.getPhotoByIndex.bind(this)
  }

  componentDidMount () {
    const { dispatch, pageNum } = this.props
    dispatch(fetchNews(pageNum))
    document.addEventListener('scroll', this.onScrollHandler)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.onScrollHandler)
  }

  onScrollHandler () {
    const { dispatch, pageNum, isFetching, hasMore } = this.props
    if (!isFetching &&
        hasMore &&
        document.body.scrollTop + document.documentElement.clientHeight + 64 >= document.documentElement.offsetHeight) {
      dispatch(fetchNews(pageNum))
    }
  }

  onGalleryShow (ev) {
    const { dispatch } = this.props
    const { groupIndex, photoIndex } = ev.target.dataset 
    dispatch(toggleGallery(true, +groupIndex, +photoIndex))
  }

  onGalleryClose () {
    const { dispatch } = this.props
    dispatch(toggleGallery(false))
  }

  getPhotoByIndex (index) {
    const { items, groupIndex } = this.props
    const url = items[groupIndex].info.mediaList[index].photoUrl
    return {
      thumbnail: `${url}!w132h132`,
      url,
    }
  }

  render () {
    const {
      hasEmptyAlbum, isLoaded,
      isFetching, items, hasMore,
      showGallery, groupIndex, photoIndex,
    } = this.props

    return <div className='album-home'>
      <div className='album-banner'>
        <p><b>100,000+</b>个相册被创建</p>
        <p>和家人朋友一起共享照片</p>
      </div>
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
      {
        isLoaded && !hasEmptyAlbum ?
        <div className='create-album'>
          不同的聚会、旅行......共享不同的照片
          <a href='/quan/new/' className='btn btn-red btn-rounded'>创建相册</a>
        </div> : null
      }
      {
        items.map((item, groupIndex) =>
          item.type === 'newsInfo' ?
          <div key={groupIndex} className='news-card'>
            <div className='title'>
              <b>{item.info.groupName}</b>
              <i>{item.info.userName}，{item.info.updateTime}</i>
            </div>
            <div className='photo-list'>
              {
                item.info.mediaList.map((media, photoIndex) =>
                  <div
                    key={photoIndex}
                    className='photo'
                    style={ {backgroundImage: `url(${media.photoUrl}!w132h132)`} }
                    data-group-index={groupIndex}
                    data-photo-index={photoIndex}
                    onClick={this.onGalleryShow}>
                  </div>
                )
              }
            </div>
          </div> :
          <div key={groupIndex} className='empty-album clearfix'>
            <div
              className='head-pic'
              style={ {backgroundImage: `url(${item.info.headImgUrl})`} }></div>
            <div className='album-info'>
              <h2>{item.info.groupName}</h2>
              <p>{item.info.memberNum}人，0张照片（我{item.info.createTime}创建）</p>
              <a href='javascript:;' className='btn btn-red btn-rounded'>上传照片</a>
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
      <Nav pageId={TO_HOME.id} notEmpty={!!items.length} />
      {
        showGallery ?
        <Gallery
          initialIndex={photoIndex}
          totalCount={items[groupIndex].info.mediaList.length}
          getPhotoByIndex={this.getPhotoByIndex}
          onClose={this.onGalleryClose} /> : null
      }
    </div>
  }
}

Home.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  hasEmptyAlbum: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  pageNum: PropTypes.number.isRequired,
  message: PropTypes.object,
  showGallery: PropTypes.bool.isRequired,
  groupIndex: PropTypes.number,
  photoIndex: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProp(state) {
  return state.news
}

export default connect(mapStateToProp)(Home)
