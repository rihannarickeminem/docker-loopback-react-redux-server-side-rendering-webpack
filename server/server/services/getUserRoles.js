'use strict'

const roleAdmin = require('../../common/constants/db_constants').roleAdmin

module.exports = function (server, context, options) {
  let Role = server.models.Role

  return new Promise(function (resolve, reject) {
    Role.getRoles(
      context,
      options,
      function (err, roles) {
        let rolesInfo = {}

        if (err) reject(err)
        rolesInfo.isAdmin = false
        for (let role of roles) {
          if (role === roleAdmin) {
            rolesInfo.isAdmin = true
          }
        }

        rolesInfo.roles = roles
        resolve(rolesInfo)
      })
  })
}
