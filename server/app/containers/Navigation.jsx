import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { logOut } from 'actions/users'

import classNames from 'classnames/bind'
import styles from 'css/components/navigation'

const cx = classNames.bind(styles)

const Navigation = ({ user, logOut }) => {
  const isAdmin = user.userInfo && user.userInfo.rolesInfo && user.userInfo.rolesInfo.isAdmin
  return (
    <div className={cx('column', 'is-3')}>
      <aside className={cx('navigation', 'menu')} role='navigation'>
        <ul className={cx('menu-list')}>
          <li>
            <Link to='/'
              className={cx('item', 'logo')}
              activeClassName={cx('active')}><div>Kids-rooms</div></Link>
          </li>
          { user.authenticated ? (
            <li>
              <Link
                onClick={logOut}
                className={cx('item')} to='/'>Logout</Link>
            </li>
            ) : (
              <li>
                <Link className={cx('item')} to='/login'>Log in</Link>
              </li>
            )}
          { (isAdmin) ? (
            <li>
              <Link
                className={cx('item')} to='/'>Домой</Link>
            </li>
            ) : null }
          { (isAdmin) ? (
            <li>
              <Link
                className={cx('item')} to='/adminpanel'>Admin Panel</Link>
            </li>
            ) : null }
          { (isAdmin) ? (
            <li>
              <Link
                className={cx('item')} to='/adminpanel'>События</Link>
            </li>
            ) : null }
          { (isAdmin) ? (
            <li>
              <Link
                className={cx('item')} to='/adminpanel'>Клиенты</Link>
            </li>
            ) : null }
          { (isAdmin) ? (
            <li>
              <Link
                className={cx('item')} to='/adminpanel'>Настройки</Link>
            </li>
            ) : null }
        </ul>
      </aside>
    </div>
  )
}

Navigation.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func.isRequired
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { logOut })(Navigation)
