'use strict'

const _ = require('lodash')
const request = require('request')
const settings = require('../config/config')['test']

let defaultOptions = {
  name: 'Example Test Name',
  headers: {
    'Content-Type': 'application/json',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B141 Safari/8536.25'
  }
}

class MainTest {

  constructor (options) {
    this.options = _.extend({}, defaultOptions, options)
  }

  _url (uri, token, params = '') {
    const accessToken = (token) ? `?accessToken=${token}` : ''
    return `http://localhost:${settings.app.port}${settings.api_url}${uri}${accessToken}${params}`
  }

  _runTest ({data, url, checkings, done}) {
    request({
      // need to write with using url as private method
      url: this._url(url.path, url.token, url.params),
      method: url.method,
      headers: this.options.headers,
      body: JSON.stringify(data)
    }, (err, res, body) => {
      body = JSON.parse(body)
      if (checkings) checkings(err, res, body)
      done()
    })
  }

};

module.exports = MainTest
