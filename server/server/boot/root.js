'use strict'

/* const App = require('../../public/assets/server'); */

module.exports = function (server) {
  let router = server.loopback.Router()
  let RoleMapping = server.models.RoleMapping
  let getUserRoles = require('../services/getUserRoles')

  server.use(function (req, res, next) {
    if (req.user) {
      getUserRoles(server,
        {
          principalType: RoleMapping.USER,
          principalId: req.user.id
        },
                {returnOnlyRoleNames: true}
            ).then(rolesInfo => {
              req.rolesInfo = rolesInfo
              next()
            }).catch(err => next(err))
    } else {
      next()
    }
  })

  router.get('/status', server.loopback.status())

  /* router.get(/^\/(?!api|assets|__webpack_hmr)., App.default); */

  server.use(router)
}
