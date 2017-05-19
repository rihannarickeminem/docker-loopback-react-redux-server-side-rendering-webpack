import React, { Component, PropTypes } from 'react'
import Page from 'pages/Page'
import AdminPanelContainer from 'containers/AdminPanelContainer'

class AdminPanel extends Component {
  getMetaData () {
    return {
      title: this.pageTitle(),
      meta: this.pageMeta(),
      link: this.pageLink()
    }
  }

  pageTitle () {
    return 'Admin panel | kids-rooms'
  }

  pageMeta () {
    return [
      { name: 'description', content: 'Kids-rooms app admin panel' }
    ]
  }

  pageLink () {
    return []
  }

  render () {
    return (
      <Page {...this.getMetaData()}>
        <AdminPanelContainer {...this.props} />
      </Page>
    )
  }
}

// const AdminPanel = props => (
//   <Page title={title} meta={meta} link={link}>
//     <AdminPanelContainer {...props } />
//   </Page>
// );

export default AdminPanel
