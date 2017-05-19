'use strict'

const bluebird = require('bluebird')
const roles = require('../../common/constants/db_constants')
const log = console.log

module.exports = function (app) {
  let PostgreSQL = app.dataSources.PostgreSQL
  let User = app.models.user
  let Role = app.models.Role
  let RoleMapping = app.models.RoleMapping
  let models = ['session', 'user', 'accessToken', 'ACL', 'userIdentity', 'kid', 'room', 'visit', 'userCredential', 'Role', 'RoleMapping']
  // let models = ['session'];

  bluebird.promisifyAll(PostgreSQL)

  let users = [
    // {username: 'John', email: 'john@doe.com', password: 'adminpassword', phonenumber : 983763497636},
    {
      'username': 'admin',
      'lastName': 'ADNINsdfjier',
      'firstName': 'jisdfkjwef23',
      // "email": "admin@gmailroom.com",
      'password': 'password',
      'telephone': 124121
    }
    // ,
    // {username: 'Bob', email: 'fdsffbob@projects.com', password: 'opensesame', phonenumber : 14124124}
  ]

  if (process.env.NODE_ENV === 'development') {
    // PostgreSQL.isActual(models, function (err, actual) {
    //   if (err) throw err
    //   if (!actual) {
    PostgreSQL.automigrate(models)
        .then(r => {
          User.create(users, (err, usr) => {
            if (err) throw err
            Role.create({
              name: roles.roleAdmin
            }, function (err, role) {
              if (err) throw err
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: 1
              }, function (err, principal) {
                if (err) throw err

                log('Created principal:', principal)
                Role.create({
                  name: roles.role_manager
                })
              })
            })
          })
        })
        .catch(err => {
          log('error: ', err)
          throw err
        })
      // }
    // })
  }
}
