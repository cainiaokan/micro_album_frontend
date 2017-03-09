import './index.less'
import '../common/style/btn.less'

import React, { PropTypes } from 'react'

import {
  TO_HOME, TO_GALLERY,
  TO_UPLOAD, TO_MY_PHOTOS,
  TO_USER_CENTER,
  goToPage,
} from '../routerConfig'

const menuIds = [
  TO_HOME, TO_GALLERY, TO_UPLOAD, 
  TO_MY_PHOTOS, TO_USER_CENTER,
]

function Nav ({ pageId, notEmpty }) {
  return <ul className='album-nav'>
    {
      menuIds.map(menu =>
        <li
          key={menu.id}
          data-menu={menu.id}
          onClick={onClickHander}
          className={`${menu.id} ${pageId === menu.id ? 'active' : ''}`}>
          {menu.name}
        </li>
      )
    }
    {
      pageId === TO_HOME.id ?
      <div className={`upload-guide ${notEmpty ? 'auto-hide' : ''}`}>
        点击这里上传照片
      </div> : null
    }
  </ul>
}

function onClickHander (ev) {
  const menuId = ev.currentTarget.dataset.menu
  goToPage(menuId)
}

Nav.propTypes = {
  pageId: PropTypes.string.isRequired,
  notEmpty: PropTypes.bool,
}

export default Nav

