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
    this.image = new Image()
    this.image.src = props.url
    this.image.onload = this.onLoadHandler.bind(this)
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
    const { thumbnail, url, slotOffset, onClick } = this.props
    const { loaded, style } = this.state
    return (
      <div
        className='gallery-photo'
        style={ {
          transform: `translate3d(calc(${slotOffset * 100}% + ${slotOffset * SLOT_MARGIN}px), 0, 0)`
        } }>
        <img
          src={loaded ? url : thumbnail}
          onClick={onClick}
          className={style} />
      </div>
    )
  }
}

Photo.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  slotOffset: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}
