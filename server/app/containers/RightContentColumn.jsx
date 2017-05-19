import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import classNames from 'classnames/bind'
import styles from 'css/components/right_content_column'

const cx = classNames.bind(styles)

const RightContentColumn = ({ user, children }) => {
  const isAdmin = user.userInfo && user.userInfo.rolesInfo && user.userInfo.rolesInfo.isAdmin
  return (
    <div className={cx('column', 'is-9')}>
      <div className={cx('')}>
        <div className={cx('rightopbar')}>
          { (isAdmin) ? (
              JSON.stringify(user.userInfo)
            ) : null }
        </div>
        <div className={cx('box')}>
          <div className={cx('green')}>
              sdfasf
            </div>
          <div className={cx('white')}>
            { (children) ? (
              <div className={cx('raised')}>
                { children }
              </div>
              ) : null }
          </div>
        </div>
      </div>
    </div>
  )
}

RightContentColumn.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(RightContentColumn)
