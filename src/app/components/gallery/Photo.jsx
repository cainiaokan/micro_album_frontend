import React, { PropTypes } from 'react'

import { SLOT_MARGIN } from './gallery'

const LANDSCAPE = 'landscape'
const PORTRAIT = 'portrait'
const THUMBNAIL = 'thumbnail'

export default class Photo extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      style: THUMBNAIL,
    }
    this.offsetX = 0
    this.offsetY = 0
    this.touchCount = 0
    this.scaleFactor = 1
    this.touchStartOffsetX = 0
    this.touchStartOffsetY = 0
    this.scaleOffset = 0
    this.touchMoved = false
    this.gestureStart = false
    this.image = new Image()
    this.image.src = props.photoUrl
    // this.loadImageDelay = setTimeout(() => {
    //   this.image.src = props.photoUrl
    // }, 200)
    this.image.onload = this.onLoadHandler.bind(this)
    this.touchStartHandler = this.touchStartHandler.bind(this)
    this.touchMoveHandler = this.touchMoveHandler.bind(this)
    this.touchEndHanlder = this.touchEndHanlder.bind(this)
    this.transitionEndHandler = this.transitionEndHandler.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.loadImageDelay)
    clearTimeout(this.clickEventDelay)
  }

  onLoadHandler () {
    const { width, height } = this.image
    this.setState({
      loaded: true,
      style: width >= height ? LANDSCAPE : PORTRAIT,
      width, height,
    })
  }

  render () {
    const { thumbnail, photoUrl, slotOffset } = this.props
    const { loaded, style } = this.state
    return (
      <div
        className='gallery-photo'
        style={ {
          transform: `translate3d(calc(${slotOffset * 100}% + ${slotOffset * SLOT_MARGIN}px), 0, 0)`
        } }>
        <img
          ref='img'
          src={loaded ?  photoUrl: thumbnail}
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onTouchEnd={this.touchEndHanlder}
          onTransitionEnd={this.transitionEndHandler}
          className={style} />
        {
          !loaded ? <div className='loading thumbnail'>正在加载照片</div> : null
        }
      </div>
    )
  }

  touchStartHandler (ev) {
    const { touches } = ev
    const { pageX, pageY } = touches[0]

    this.touchMoved = false

    if (touches.length === 1) {
      this.touchStartTime = ev.timeStamp
      this.touchStartOffsetX = this.offsetX
      this.touchStartOffsetY = this.offsetY
      this.lastTouchX = pageX
      this.lastTouchY = pageY
      this.touchCount++
    } else if (touches.length === 2) {
      ev.stopPropagation()
      this.gestureStart = true
      this.touchCount = 0
      this.prevScaleFactor = this.scaleFactor
      this.touchDistance = Math.sqrt(Math.pow(touches[1].pageX - pageX, 2) + Math.pow(touches[1].pageY - pageY, 2))
    }
  }

  touchMoveHandler (ev) {
    const { scaleFactor, lastTouchX, lastTouchY } = this
    const { touches } = ev
    const { pageX, pageY } = touches[0]
    this.touchMoved = true
    this.touchCount = 0

    if (!this.gestureStart) {
      if (this.scaleFactor !== 1 && touches.length === 1) {
        ev.preventDefault()
        this.offsetX += pageX - lastTouchX
        this.offsetY += pageY - lastTouchY
        this.lastTouchX = pageX
        this.lastTouchY = pageY
        this.refs.img.style.transition = ''
        this.refs.img.style.transform = `translate3d(${this.offsetX}px, ${this.offsetY}px, 0) scale3d(${scaleFactor}, ${scaleFactor}, 1)`
      }
    } else {
      ev.stopPropagation()
      if (touches.length === 2) {
        this.scaleOffset = Math.sqrt(Math.pow(touches[1].pageX - pageX, 2) + Math.pow(touches[1].pageY - pageY, 2)) - this.touchDistance
        this.scaleFactor = this.prevScaleFactor * (1 + this.scaleOffset / this.touchDistance)
        this.refs.img.style.transition = ''
        this.refs.img.style.transform = `translate3d(${this.offsetX}px, ${this.offsetY}px, 0) scale3d(${scaleFactor}, ${scaleFactor}, 1)`
      }
    }
  }

  touchEndHanlder (ev) {
    // 阻止默认产生的click事件
    ev.preventDefault()

    if (!this.gestureStart) {
      if (this.touchCount === 0) {
        const { scaleFactor } = this
          // 只有在进行了缩放操作时，才可以“滚动”（滚动查看大图）图片，并且阻止事件冒泡，图片切换等动作。
        if (scaleFactor !== 1) {
          const { clientWidth, clientHeight } = document.documentElement
          const { width, height } = this.refs.img
          const maxOffsetX = width * scaleFactor > clientWidth ? width * scaleFactor / 2 - clientWidth / 2 : 0
          const maxOffsetY = height * scaleFactor > clientHeight ? height * scaleFactor / 2 - clientHeight / 2 : 0
          const prevOffsetX = this.offsetX
          const prevOffsetY = this.offsetY
          const timeStamp = ev.timeStamp
          const horizontalSwipe = Math.abs(prevOffsetX) > Math.abs(prevOffsetY)

          // 判断滚动是否超出边界，如果超出边界，则增加一个反弹效果，反弹到边界的边缘处
          if (prevOffsetX > maxOffsetX) {
            if (horizontalSwipe && this.touchStartOffsetX === maxOffsetX && timeStamp - this.touchStartTime < 100) {
              return this.restore()
            } else {
              this.offsetX = maxOffsetX
              this.animate()
            }
          } else if (prevOffsetX < -maxOffsetX) {
            if (horizontalSwipe && this.touchStartOffsetX === -maxOffsetX && timeStamp - this.touchStartTime < 100) {
              return this.restore()
            } else {
              this.offsetX = -maxOffsetX
              this.animate()
            }
          }

          if (prevOffsetY > maxOffsetY) {
            this.offsetY = maxOffsetY
            this.animate()
          } else if (prevOffsetY < -maxOffsetY) {
            if (!horizontalSwipe && this.touchStartOffsetY === -maxOffsetY && timeStamp - this.touchStartTime < 100) {
              return this.restore()
            } else {
              this.offsetY = -maxOffsetY
              this.animate()
            }
          }

          ev.stopPropagation()
        }
      } else if (this.touchCount === 1) {
        // 产生一个延迟300ms的click事件，用来模拟点击事件
        // 这里之所以要使用模拟事件，原因是下面还要检测“双击”事件，
        // 如果下面的双击事件在300ms内生效，则要取消这个延迟的click事件
        ev.stopPropagation()
        if (!this.touchMoved) {
          this.clickEventDelay = setTimeout(() => {
            const evt = document.createEvent('MouseEvents')
            evt.initEvent('click', true, false)
            this.refs.img.dispatchEvent(evt)
            this.touchCount = 0
            this.touchStartOffsetX = 0
            this.touchStartOffsetY = 0
          }, 300)
        }
      } else if (this.touchCount === 2) {
        ev.stopPropagation()
        // 双击缩放动作，默认为放大到最大倍数，若已经放至最大倍数，则双击时缩放回原尺寸
        const { maxScaleUp } = this.props
        if (!this.touchMoved && ev.timeStamp - this.touchStartTime < 300) {
          clearTimeout(this.clickEventDelay)
          if (this.scaleFactor < maxScaleUp) {
            this.scaleFactor = maxScaleUp
            this.refs.img.style.transition = 'transform .2s ease'
            this.refs.img.style.transform = `scale3d(${maxScaleUp}, ${maxScaleUp}, 1)`
          } else {
            this.scaleFactor = 1
            this.refs.img.style.transition = 'transform .2s ease'
            this.refs.img.style.transform = 'scale3d(1, 1, 1)'
          }
          this.offsetX = 0
          this.offsetY = 0
        }
        this.touchCount = 0
        this.touchStartOffsetX = 0
        this.touchStartOffsetY = 0
        this.touchMoved = false
      }
    } else {
      const { maxScaleUp, minScaleDown } = this.props
      ev.stopPropagation()

      if (ev.touches.length === 0) {
        if (this.scaleFactor > maxScaleUp) {
          this.scaleFactor = maxScaleUp
        } else if (this.scaleFactor < minScaleDown) {
          this.scaleFactor = minScaleDown
        }

        const { scaleFactor } = this
        const { clientWidth, clientHeight } = document.documentElement
        const { width, height } = this.refs.img
        const maxOffsetX = width * scaleFactor > clientWidth ? width * scaleFactor / 2 - clientWidth / 2 : 0
        const maxOffsetY = height * scaleFactor > clientHeight ? height * scaleFactor / 2 - clientHeight / 2 : 0
        const prevOffsetX = this.offsetX
        const prevOffsetY = this.offsetY

        // 判断滚动是否超出边界，如果超出边界，则增加一个反弹效果，反弹到边界的边缘处
        if (prevOffsetX >= maxOffsetX) {
          this.offsetX = maxOffsetX
        } else if (prevOffsetX < -maxOffsetX) {
          this.offsetX = -maxOffsetX
        }

        if (prevOffsetY >= maxOffsetY) {
          this.offsetY = maxOffsetY
        } else if (prevOffsetY < -maxOffsetY) {
          this.offsetY = -maxOffsetY
        }

        this.gestureStart = false
        this.refs.img.style.transition = 'transform .2s ease'
        this.refs.img.style.transform = `translate3d(${this.offsetX}px, ${this.offsetY}px, 0) scale3d(${scaleFactor}, ${scaleFactor}, 1)`
      }
    }
  }

  transitionEndHandler () {
    this.refs.img.style.transition = ''
  }

  animate () {
    const { offsetX, offsetY, scaleFactor } = this
    this.refs.img.style.transition = 'transform .2s ease'
    this.refs.img.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale3d(${scaleFactor}, ${scaleFactor}, 1)`
  }

  restore () {
    this.refs.img.style.transform = ''
    this.refs.img.style.transition = ''
    this.offsetX = 0
    this.offsetY = 0
    this.touchCount = 0
    this.scaleFactor = 1
    this.touchStartOffsetX = 0
    this.touchStartOffsetY = 0
    this.touchMoved = false
  }
}

Photo.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  photoUrl: PropTypes.string.isRequired,
  slotOffset: PropTypes.number.isRequired,
  maxScaleUp: PropTypes.number.isRequired,
  minScaleDown: PropTypes.number.isRequired,
}
