import React, { Component, PropTypes } from 'react'
import Page from 'pages/Page'
import LoginOrRegisterContainer from 'containers/LoginOrRegister'

class LoginOrRegister extends Component {
  render () {
    return (
      <Page {...this.getMetaData()}>
        <LoginOrRegisterContainer {...this.props} />
      </Page>
    )
  }

  getMetaData () {
    return {
      title: this.pageTitle(),
      meta: this.pageMeta(),
      link: this.pageLink()
    }
  }

  pageTitle () {
    return 'LoginOrRegister'
  }

  pageMeta () {
    return [
      { name: 'description', content: 'login or register page' }
    ]
  }

  pageLink () {
    return []
  }
}

export default LoginOrRegister
