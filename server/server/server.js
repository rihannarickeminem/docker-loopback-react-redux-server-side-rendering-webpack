'use strict'

const App = require('../compiled/server')
const loopback = require('loopback')
const boot = require('loopback-boot')
const app = module.exports = loopback()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')

const methodOverride = require('method-override')

const loopbackPassport = require('loopback-component-passport')
const PassportConfigurator = loopbackPassport.PassportConfigurator
const passportConfigurator = new PassportConfigurator(app)
const getUserRoles = require('./services/getUserRoles')
const bodyParser = require('body-parser')
const flash = require('express-flash')

const authMaxAge = 7 * 24 * 60 * 60 * 1000

// attempt to build the providers/passport config
let config = {}
try {
  config = require('../providers.json')
} catch (err) {
  console.trace(err)
  process.exit(1) // fatal
}

// The access token is only available after boot
// boot(app, __dirname);

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started')
    let baseUrl = app.get('url').replace(/\/$/, '')
    console.log('Web server listening at: %s', baseUrl)
    console.log('NODE_ENV = ', process.env.NODE_ENV)
    console.log('IN_DOCKER = ', process.env.IN_DOCKER)
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath)
    }
  })
}

boot(app, __dirname, function (err) {
  if (err) {
    throw err
  }

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  app.use(methodOverride())

  app.use(loopback.static(path.join(__dirname, '..', 'client')))

  app.middleware('auth', loopback.token({
    model: app.models.accessToken
  }))

  app.middleware('session:before', cookieParser(app.get('cookieSecret')))
  app.middleware('session', session({
    store: new (require('connect-pg-simple')(session))({
      conString: app.dataSources.PostgreSQL.settings.url
    }),
    secret: 'kitty',
    saveUninitialized: true,
    resave: true,
    httpOnly: true,
    cookie: {
      maxAge: authMaxAge
    },
    secure: true,
    name: 'kookie'
  }))

  passportConfigurator.init()

  app.use(flash())

  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  })
  for (let s in config) {
    let c = config[s]
    c.session = c.session !== false
    passportConfigurator.configureProvider(s, c)
  }

  app.post('/api/users/signup', function (req, res, next) {
    return res.status(401).json({
      message: 'Signup is denied'
    })
  })

  app.post('/api/users/login', function (req, res, next) {
    let User = app.models.user
    let RoleMapping = app.models.RoleMapping
    let user = {}

    user.username = req.body.username.toLowerCase()
    user.password = req.body.password

    User.find({where: {'username': user.username}}).then(foundUser => {
      if (foundUser.length <= 0) {
        return res.status(401).json({ message: 'User with such username not found!' })
      }

      foundUser = foundUser[0]

      console.log('foundUserfoundUser ', foundUser)
      console.log('useruser ', user)

      User.login({'username': user.username, 'password': user.password}, function (loginErr) {
        //     console.log('loginErrloginErr ', loginErr);
        if (loginErr) return res.status(401).json({ message: 'User login  fails' })

        foundUser.createAccessToken((authMaxAge), function (err, token) {
          if (err) return res.status(401).json({ message: 'User login  createAccessToken fails' })
          res.cookie('access_token', token.id, {
            signed: req.signedCookies,
            maxAge: token.ttl,
            httpOnly: true
          })

          res.cookie('userId', foundUser.id.toString(), {
            signed: req.signedCookies,
            maxAge: token.ttl,
            httpOnly: true
          })

          getUserRoles(app,
            {
              principalType: RoleMapping.USER,
              principalId: foundUser.id
            },
            {returnOnlyRoleNames: true}
          ).then(rolesInfo => {
            let userInfo = {
              rolesInfo
            }

            return res.status(200).json({
              message: 'You have been successfully logged in.',
              'token': token.id,
              'ttl': token.ttl,
              userInfo
            })
          }).catch(() => {
            return res.status(401).json({ message: 'User login  fails due roles fetching ' })
          })
        })
      })
    })
  })

  app.post('/api/users/logout', function (req, res, next) {
    req.logout()
    res.redirect('/')
  })

  // app.get('*', App.default)
  app.get(/^\/(?!api|assets|__webpack_hmr).*/, App.default)

  if (require.main === module) {
    app.start()
  }
})
