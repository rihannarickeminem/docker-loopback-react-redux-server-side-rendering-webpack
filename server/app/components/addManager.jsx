import React, { PropTypes } from 'react'
import classNames from 'classnames/bind'
import styles from '../css/components/add_manager'

const cx = classNames.bind(styles)

const addManager = () => {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('admin_tabs label is-large')}>Add manager:</div>
      <p className={cx('control')}>
        <label className={cx('label')}>
          Email
          <input className={cx('input')} type={'text'} placeholder={'Email'} />
        </label>
      </p>
      <p className={cx('control')}>
        <label className={cx('label')}>
          Password
          <input className={cx('input')} type={'text'} placeholder={'Password'} />
        </label>
      </p>
    </div>
  )
}

export default addManager
