import './index.less'

import React, { PropTypes } from 'react'
import Photo from './photo'

export const SLOT_MARGIN = 40
const MIN_MOVE = 10

export default class PhotoGallery extends React.Component {

  constructor (props) {
    super(props)
    this.propsToState(props, true)
    this.touchStartHandler = this.touchStartHandler.bind(this)
    this.touchMoveHandler = this.touchMoveHandler.bind(this)
    this.touchEndHanlder = this.touchEndHanlder.bind(this)
    this.touchAniEndHandler = this.touchAniEndHandler.bind(this)
    this.InOutAniEndHandler = this.InOutAniEndHandler.bind(this)
    this.onPhotoClick = this.onPhotoClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.propsToState(nextProps, false)
  }

  // shouldComponentUpdate (nextProps, nextState) {

  // }

  componentDidMount () {
    setTimeout(() => this.setState({ aniPhase: 'sliding-down' }), 200)
  }

  componentWillUnmount () {

  }

  propsToState (props, initial) {
    const { initialIndex, totalCount, preLoad, getPhotoByIndex, loop } = props

    const photos = [getPhotoByIndex(initialIndex)]
    const supportLoop = loop && totalCount >= preLoad[0] + preLoad[1] + 1
    let curSlotIndex = 0

    let curPhotoIndex = initialIndex
    let backwardPreload = preLoad[0]
    let forwardPreload = preLoad[1]

    while (backwardPreload--) {
      if (curPhotoIndex === 0) {
        if (supportLoop) {
          curPhotoIndex = totalCount - 1
        } else {
          break
        }
      } else {
        curPhotoIndex--
      }
      curSlotIndex++
      photos.unshift(getPhotoByIndex(curPhotoIndex))
    }

    curPhotoIndex = initialIndex

    while (forwardPreload--) {
      if (curPhotoIndex === totalCount - 1) {
        if (supportLoop) {
          curPhotoIndex = 0
        } else {
          break
        }
      } else {
        curPhotoIndex++
      }
      photos.push(getPhotoByIndex(curPhotoIndex))
    }

    this.state = {
      photos,
      supportLoop,
      curSlotIndex,
      curPhotoIndex: initialIndex,
      aniPhase: initial ? 'before-slide-down' : '',
    }
  }

  goForward () {
    let { totalCount, getPhotoByIndex, preLoad } = this.props
    let { photos, supportLoop, curPhotoIndex, curSlotIndex } = this.state

    const lastPhotoIndex = curPhotoIndex + preLoad[1] + 1

    if (lastPhotoIndex <= totalCount - 1) {
      photos.shift()
      photos.push(getPhotoByIndex(lastPhotoIndex))
    } else {
      if (supportLoop) {
        photos.shift()
        photos.push(getPhotoByIndex(lastPhotoIndex - totalCount))
        if (curPhotoIndex > totalCount - 1) {
          curPhotoIndex = 0
        }
      } else {
        curSlotIndex++
      }
    }
    curPhotoIndex++

    this.setState({
      curPhotoIndex, curSlotIndex
    })
  }

  goBackward () {
    let { totalCount, getPhotoByIndex, preLoad } = this.props
    let { photos, supportLoop, curPhotoIndex, curSlotIndex } = this.state

    let firstPhotoIndex = curPhotoIndex - preLoad[0] - 1

    if (firstPhotoIndex >= 0) {
      photos.pop()
      photos.unshift(getPhotoByIndex(firstPhotoIndex))
    } else {
      if (supportLoop) {
        photos.pop()
        photos.unshift(getPhotoByIndex(totalCount + firstPhotoIndex))
        if (curPhotoIndex < 0) {
          curPhotoIndex = totalCount - 1
        }
      } else {
        curSlotIndex--
      }
    }
    curPhotoIndex--

    this.setState({
      curPhotoIndex, curSlotIndex,
    })
  }

  render () {
    const { photos, curSlotIndex, aniPhase } = this.state
    return (
      <div
        className={`photo-gallery ${aniPhase}`}
        onTransitionEnd={this.InOutAniEndHandler}>
        <div
          ref='list'
          className='gallery-list'
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onTouchEnd={this.touchEndHanlder}
          onTransitionEnd={this.touchAniEndHandler}>
        {
          photos.map((photo, i) =>
            <Photo
              key={i}
              slotOffset={i - curSlotIndex}
              onClick={this.onPhotoClick}
              {...photo}/>
          )
        }
        </div>
      </div>
    )
  }

  touchStartHandler (ev) {
    this.touchStartTime = ev.timeStamp
    this.touchStartX = ev.touches[0].pageX
    this.touchStartY = ev.touches[0].pageY
  }

  touchMoveHandler (ev) {
    const { timeStamp } = ev

    ev.preventDefault()

    if (timeStamp - this.touchStartTime < 80) {
      this.touchStartTime = timeStamp
    }

    const { pageX, pageY } = ev.touches[0]
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

    if (horzMove) {
      this.refs.list.style.transform = `translate3d(${offsetX}px, 0, 0)`
    } else {
      this.refs.list.style.transform = `translate3d(0, ${offsetY}px, 0)`
    }
  }

  touchEndHanlder (ev) {
    const { timeStamp } = ev
    const { totalCount } = this.props
    const { supportLoop, curPhotoIndex } = this.state
    const { clientWidth, clientHeight } = document.documentElement
    const { pageX, pageY } = ev.changedTouches[0]
    const { touchStartX, touchStartY, touchStartTime } = this
    const offsetX = pageX - touchStartX
    const offsetY = pageY - touchStartY
    const style = this.refs.list.style

    console.log(timeStamp, touchStartTime, timeStamp - touchStartTime)

    if (Math.abs(offsetX) > clientWidth / 2 ||
       (this.touchMoveDirection === 'horz' && timeStamp - touchStartTime < 100)) {
      if (offsetX > 0) {
        if (curPhotoIndex === 0) {
          if (supportLoop) {
            this.animationType = 'backward'
          } else {
            this.animationType = 'cancel'
          }
        } else {
          this.animationType = 'backward'
        }
      } else if (offsetX < 0) {
        if (curPhotoIndex === totalCount - 1) {
          if (supportLoop) {
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

    switch(this.animationType) {
    case 'forward':
      style.transition = 'transform .2s ease-out'
      style.transform = `translate3d(calc(-100% + ${-SLOT_MARGIN}px), 0, 0)`
      break
    case 'backward':
      style.transition = 'transform .2s ease-out'
      style.transform = `translate3d(calc(100% + ${SLOT_MARGIN}px), 0, 0)`
      break
    case 'slideup':
      this.onPhotoClick()
      break
    case 'cancel':
      style.transition = 'transform .2s ease-out'
      style.transform = 'translate3d(0, 0, 0)'
      break
    }
    this.touchMoveDirection = null
  }

  touchAniEndHandler () {
    const style = this.refs.list.style
    switch(this.animationType) {
    case 'forward':
      this.goForward()
      break
    case 'backward':
      this.goBackward()
      break
    case 'cancel':
      break
    }
    style.transition = ''
    style.transform = ''
    this.animationType = null
  }

  InOutAniEndHandler () {
    const { aniPhase } = this.state
    switch (aniPhase) {
    case 'sliding-down':
      this.setState({ aniPhase: 'slide-in' })
      break
    case 'sliding-up':
      this.setState({ aniPhase: 'after-slide-up' })
      this.props.onClose()
      break
    }
  }

  onPhotoClick () {
    this.setState({ aniPhase: 'sliding-up' })
  }

  switchPhoto () {

  }
}

PhotoGallery.propTypes = {
  totalCount: PropTypes.number.isRequired,
  initialIndex: PropTypes.number.isRequired,
  getPhotoByIndex: PropTypes.func.isRequired,
  preLoad: PropTypes.array.isRequired,
  loop: PropTypes.bool,
  minScaleDown: PropTypes.number,
  maxScaleUp: PropTypes.number,
  onClose: PropTypes.func.isRequired,
}

PhotoGallery.defaultProps = {
  initialIndex: 0,
  preLoad: [1,1],
  loop: true,
  minScaleDown: 0.75,
  maxScaleUp: 2,
}
