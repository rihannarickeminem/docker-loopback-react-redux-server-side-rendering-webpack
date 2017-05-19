import React, { PropTypes } from 'react'
import Navigation from 'containers/Navigation'
import RightContentColumn from 'containers/RightContentColumn'
import classNames from 'classnames/bind'
import styles from 'css/main'

const cx = classNames.bind(styles)

/*
 * React-router's <Router> component renders <Route>'s
 * and replaces `this.props.children` with the proper React Component.
 *
 * Please refer to `routes.jsx` for the route config.
 *
 * A better explanation of react-router is available here:
 * https://github.com/rackt/react-router/blob/latest/docs/Introduction.md
 */
const App = props => {
  return (
    <div className={cx('section', 'app')}>
      <div className={cx('container')}>
        <div className={cx('columns')}>
          <Navigation />
          <RightContentColumn {...props} />
        </div>
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.object
}

export default App
