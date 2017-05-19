import React from 'react'
import { default as AddManager } from '../components/addManager'
import styles from '../css/components/admin_panel.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const AdminPanel = () => {
  return (
    <div className={cx('wrapper')}>
      <AddManager />
    </div>
  )
}

export default AdminPanel
