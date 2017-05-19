'use strict'

module.exports = function enableAuthentication (server) {
  const webpack = require('webpack')

  if (process.env.NODE_ENV === 'development') {
    const webpackDevConfig = require('../../webpack/webpack.config.dev-client')
    const compiler = webpack(webpackDevConfig)
    server.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackDevConfig.output.publicPath,
            // hot: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: true
              // poll: 1000
      }
    }))

    server.use(require('webpack-hot-middleware')(compiler))
  }
}
