import './index.less'
import '../../res/style/btn.less'

import React, { PropTypes } from 'react'

import {
  TO_HOME, TO_ALBUMS,
  TO_UPLOAD, TO_MY_PHOTOS,
  TO_USER_CENTER,
  goToPage,
} from '../../routerConfig'

const menuIds = [
  TO_HOME, TO_ALBUMS, TO_UPLOAD, 
  TO_MY_PHOTOS, TO_USER_CENTER,
]

function Nav ({ pageId }) {
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
  </ul>
}

function onClickHander (ev) {
  const menuId = ev.currentTarget.dataset.menu
  goToPage(menuId)
}

Nav.propTypes = {
  pageId: PropTypes.string.isRequired,
}

export default Nav

