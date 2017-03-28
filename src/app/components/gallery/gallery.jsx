import './index.less'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Photo from './photo'

import {
  slideIn,
  afterSlideIn,
  slideOut,
  showNextPhoto,
  showPrevPhoto,
  closeGallery,
} from './actions'

export const SLOT_MARGIN = 40
const MIN_MOVE = 10

class PhotoGallery extends React.Component {

  constructor (props) {
    super(props)
    this.touchStartHandler = this.touchStartHandler.bind(this)
    this.touchMoveHandler = this.touchMoveHandler.bind(this)
    this.touchEndHanlder = this.touchEndHanlder.bind(this)
    this.touchAniEndHandler = this.touchAniEndHandler.bind(this)
    this.InOutAniEndHandler = this.InOutAniEndHandler.bind(this)
    this.onClickHandler = this.onClickHandler.bind(this)
  }

  componentDidMount () {
    setTimeout(() => {
      this.props.dispatch(slideIn())
    }, 50)
  }

  render () {
    const { maxScaleUp, minScaleDown, photos, slotIndex, phase } = this.props
    return (
      <div
        className={`photo-gallery ${phase}`}
        onTransitionEnd={this.InOutAniEndHandler}>
        { 
          this.props.children ?
          React.Children.only(this.props.children) : null
        }
        <div
          ref='list'
          className='gallery-list'
          onClick={this.onClickHandler}
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onTouchEnd={this.touchEndHanlder}
          onTransitionEnd={this.touchAniEndHandler}>

        {
          photos ? 
          photos.map((photo, i) =>
            <Photo
              key={photo.photoId}
              slotOffset={i - slotIndex}
              maxScaleUp={maxScaleUp}
              minScaleDown={minScaleDown}
              onAnimate={this.animate}
              {...photo}/>
          ) : null
        }
        </div>
      </div>
    )
  }

  touchStartHandler (ev) {
    // 只处理单指滑动
    if (ev.touches.length === 1) {
      this.touchStartTime = ev.timeStamp
      this.touchStartX = ev.touches[0].pageX
      this.touchStartY = ev.touches[0].pageY
    }
  }

  touchMoveHandler (ev) {
    // 只处理单指滑动
    if (ev.touches.length === 1) {
      const { timeStamp } = ev

      if (timeStamp - this.touchStartTime < 100) {
        this.touchStartTime = timeStamp
      }

      const { pageX, pageY } = ev.changedTouches[0]
      const touchMoveDirection = this.touchMoveDirection
      const offsetX = pageX - this.touchStartX
      const offsetY = pageY - this.touchStartY

      let horzMove

      if (touchMoveDirection === 'horz') {
        horzMove = true 
      } else if (touchMoveDirection === 'vert') {
        horzMove = false
      } else if (Math.abs(offsetX) > Math.abs(offsetY) && Math.abs(offsetX) > MIN_MOVE) {
        this.touchMoveDirection = 'horz'
        horzMove = true 
      } else if (Math.abs(offsetY) > Math.abs(offsetX) && Math.abs(offsetY) > MIN_MOVE) {
        this.touchMoveDirection = 'vert'
        horzMove = false 
      } else {
        return
      }

      if (!ev.isDefaultPrevented()) {
        if (horzMove) {
          this.refs.list.style.transform = `translate3d(${offsetX}px, 0, 0)`
        } else {
          this.refs.list.style.transform = `translate3d(0, ${offsetY}px, 0)`
        }
      }
    }
    ev.preventDefault()
  }

  touchEndHanlder (ev) {
    // 只处理单指滑动
    if (ev.touches.length === 0) {
      const { timeStamp } = ev
      const { totalCount } = this.props
      const { loop, photoIndex } = this.props
      const { clientWidth, clientHeight } = document.documentElement
      const { pageX, pageY } = ev.changedTouches[0]
      const { touchStartX, touchStartY, touchStartTime } = this
      const offsetX = pageX - touchStartX
      const offsetY = pageY - touchStartY

      if (Math.abs(offsetX) > clientWidth / 2 ||
         (this.touchMoveDirection === 'horz' && timeStamp - touchStartTime < 100)) {
        if (offsetX > 0) {
          if (photoIndex === 0) {
            if (loop) {
              this.animationType = 'backward'
            } else {
              this.animationType = 'cancel'
            }
          } else {
            this.animationType = 'backward'
          }
        } else if (offsetX < 0) {
          if (photoIndex === totalCount - 1) {
            if (loop) {
              this.animationType = 'forward'
            } else {
              this.animationType = 'cancel'
            }
          } else {
            this.animationType = 'forward'
          }
        }
      } else if (Math.abs(offsetY) > clientHeight / 2 ||
        (this.touchMoveDirection === 'vert' && timeStamp - touchStartTime < 100)) {
        if (offsetY > 0) {
          this.animationType = 'cancel'
        } else {
          this.animationType = 'slideup'
        }
      } else {
        this.animationType = 'cancel'
      }

      this.animate(this.animationType)

      this.touchMoveDirection = null
    }
  }

  animate (animationType) {
    const { dispatch } = this.props
    const style = this.refs.list.style
    switch(animationType) {
    case 'forward':
      style.transition = 'transform .2s ease-out'
      style.transform = `translate3d(calc(-100% + ${-SLOT_MARGIN}px), 0, 0)`
      break
    case 'backward':
      style.transition = 'transform .2s ease-out'
      style.transform = `translate3d(calc(100% + ${SLOT_MARGIN}px), 0, 0)`
      break
    case 'slideup':
      dispatch(slideOut())
      break
    case 'cancel':
      style.transition = 'transform .2s ease-out'
      style.transform = 'translate3d(0, 0, 0)'
      break
    }
  }

  touchAniEndHandler (ev) {
    ev.stopPropagation()
    const { dispatch } = this.props
    const style = this.refs.list.style
    switch(this.animationType) {
    case 'forward':
      dispatch(showNextPhoto())
      break
    case 'backward':
      dispatch(showPrevPhoto())
      break
    case 'cancel':
      break
    }
    style.transition = ''
    style.transform = ''
    this.animationType = null
  }

  InOutAniEndHandler () {
    const {
      dispatch,
      phase,
    } = this.props

    switch (phase) {
    case 'slide-in':
      dispatch(afterSlideIn())
      break
    case 'slide-out':
      dispatch(closeGallery())
      break
    }
  }

  onClickHandler () {
    this.props.dispatch(slideOut())
  }
}

PhotoGallery.propTypes = {
  photos: PropTypes.array,
  slotIndex: PropTypes.number,
  photoId: PropTypes.any,
  groupIndex: PropTypes.number.isRequired,
  photoIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  getPhotoByIndex: PropTypes.func.isRequired,
  preLoad: PropTypes.array,
  loop: PropTypes.bool,
  minScaleDown: PropTypes.number,
  maxScaleUp: PropTypes.number,
  phase: PropTypes.oneOf(['before-slide-in', 'slide-in', 'after-slide-in', 'slide-out', 'after-slide-out']),
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.element,
}

function mapStateToProps (state) {
  return state.gallery
}

export default connect(mapStateToProps)(PhotoGallery)
