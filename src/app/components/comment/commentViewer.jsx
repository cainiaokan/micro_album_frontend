import './commentViewer.less'

import IScroll from 'iscroll'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  fetchBasicComments,
  fetchTextComments,
  commitComment,
  commitInputChange,
} from './actions'

function preventDefault (ev) {
  ev.preventDefault()
}

class CommentViewer extends React.Component {

  constructor (props) {
    super(props)
    this.scrollEndHandler = this.scrollEndHandler.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
    this.sendBtnClickHandler = this.sendBtnClickHandler.bind(this)
  }

  componentDidMount () {
    const { dispatch, photoId } = this.props
    dispatch(fetchBasicComments(photoId))
    this.refs.scroller.addEventListener('touchmove', preventDefault)
    this._scroller = new IScroll(this.refs.scroller, {
      mouseWheel: true,
      scrollbars: true,
      fadeScrollbars: true,
    })
    this._scroller.on('scrollEnd', this.scrollEndHandler)
  }

  componentDidUpdate () {
    this._scroller.refresh()
  }

  componentWillUnmount () {
    this.refs.scroller.removeEventListener('touchmove', preventDefault)
    this._scroller.destroy()
  }

  scrollEndHandler () {
    const { dispatch, photoId, pageNum, hasMore, isLoadingMore, } = this.props
    const scroller = this._scroller
    if (hasMore && !isLoadingMore && scroller.y === scroller.maxScrollY) {
      dispatch(fetchTextComments(photoId, pageNum))
    }
  }

  inputHandler (ev) {
    const { dispatch } = this.props
    const sendBtn = this.refs.sendBtn
    const content = ev.target.value

    dispatch(commitInputChange(content))

    if (content.length > 0) {
      sendBtn.style.color = '#e4474e'
    } else {
      sendBtn.style.color = ''
    }
  }

  sendBtnClickHandler () {
    const { dispatch, photoId } = this.props
    const input = this.refs.input
    const content = input.value
    if (content.length > 0) {
      dispatch(commitComment(photoId, content))
      this._scroller.scrollTo(0, 0)
      input.value = ''
    }
  }

  render () {
    const {
      isLoaded,
      hasMe,
      liked,
      comments,
      isLoadingMore,
      tempContent,
    } = this.props

    const hasMeNameList = hasMe.map(user => user.name)
    const hasMeCount = hasMeNameList.length
    const likedNameList = liked.map(user => user.name)
    const likedCount = likedNameList.length

    return (
      <div className={`comment-viewer ${!isLoaded ? 'loading' : ''}`}>
        <div className='comment-body'>
          {
            !isLoaded ? <div className='loading-tip'>正在加载评论...</div> : null
          }
          <div className='comment-scroller-container' ref='scroller'>
            <div className='comment-wrapper'>
              <div className='who-is-in'>
                {
                  hasMe.length !== 0 ?
                  `${hasMeNameList.join('，')}  ${hasMeCount}人在照片里` : '照片里都有谁？' 
                }
              </div>
              <div className='who-like'>
                {
                  liked.length !== 0 ?
                  `${likedNameList.join('，')}  ${likedCount}人点赞` : '还没有人点赞' 
                }
              </div>
              <div className='comment-list'>
                {
                  comments.length === 0 ?
                  '看完照片不想说点什么吗？' :
                  <ul>
                    {
                      comments.map((comment, i) =>
                        <li key={i}>
                          <p className='who-when'>{comment.name}，{comment.time}</p>
                          <p className='comment-text'>{comment.content}</p>
                        </li>
                      )
                    }
                    {
                      isLoadingMore ? <li className='loading-more'></li> : null
                    }
                  </ul>
                }
              </div>
            </div>
          </div>
          <div className='submit-comment'>
            <input
              ref='input'
              type='text'
              maxLength='200'
              placeholder='说点什么吧'
              defaultValue={tempContent}
              onInput={this.inputHandler} />
            <button
              ref='sendBtn'
              onClick={this.sendBtnClickHandler}>发送</button>
          </div>
        </div>
      </div>
    )
  }
}

CommentViewer.propTypes = {
  isLoadingMore: PropTypes.bool,
  photoId: PropTypes.number,
  isLoaded: PropTypes.bool,
  tempContent: PropTypes.string,
  hasMe: PropTypes.array,
  liked: PropTypes.array,
  hasMore: PropTypes.bool,
  comments: PropTypes.array,
  pageNum: PropTypes.number,
  dispatch: PropTypes.func,
}

function mapStateToProps (state) {
  return {
    ...state.comments,
    photoId: state.gallery.photoId,
  }
}

export default connect(mapStateToProps)(CommentViewer)
