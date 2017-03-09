import './index.less'
import '../common/style/btn.less'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchNews } from './actions'
import Nav from '../nav/nav'
import { TO_HOME } from '../routerConfig'

class Home extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    const { dispatch, pageNum } = this.props
    dispatch(fetchNews(pageNum))
  }

  render () {
    const {
      hasEmptyAlbum, isFetching, items
    } = this.props

    return <div className='album-home'>
      <div className='album-banner'>
        <p><b>100,000+</b>个相册被创建</p>
        <p>和家人朋友一起共享照片</p>
      </div>
      {
        !isFetching && !items.length ?
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
        !isFetching && !hasEmptyAlbum ?
        <div className='create-album'>
          不同的聚会、旅行......共享不同的照片
          <a href='/quan/new/' className='btn btn-red btn-rounded'>创建相册</a>
        </div> : null
      }
      {
        items.map((item, index) =>
          item.type === 'newsInfo' ?
          <div key={index} className='news-card'>
            <div className='title'>
              <b>{item.info.groupName}</b>
              <i>{item.info.userName}，{item.info.updateTime}</i>
            </div>
            <div className='photo-list'>
              {
                item.info.mediaList.map(media =>
                  <div
                    key={media.photoId}
                    className='photo'
                    style={ {backgroundImage: `url(${media.photoUrl}!w132h132)`} }>
                  </div>
                )
              }
            </div>
          </div> :
          <div key={index} className='empty-album clearfix'>
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
      <Nav pageId={TO_HOME.id} notEmpty={!!items.length} />
    </div>
  }
}

Home.propTypes = {
  hasEmptyAlbum: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  pageNum: PropTypes.number.isRequired,
  message: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProp(state = {
  hasEmptyAlbum: false,
  isFetching: false,
  items: [],
  hasMore: true,
  pageNum: 1,
  message: null,
}) {
  const { news } = state
  const {
    hasEmptyAlbum, isFetching, items,
    hasMore, message, pageNum,
  } = news

  return {
    hasEmptyAlbum, isFetching, items,
    hasMore, message, pageNum
  }
}

export default connect(mapStateToProp)(Home)

