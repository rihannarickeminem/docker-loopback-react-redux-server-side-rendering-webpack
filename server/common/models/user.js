'use strict'

const Promise = require('bluebird')
const CreateUser = require('./user/createuser')
const app = require('../../server/server.js')
const error = require('../../server/errors/')
const disableAllMethods = require('./helpers').disableAllMethods

module.exports = function (User) {
  User.createManager = function (manager, cb) {
    let roleName = 'manager'
    let createManagerCo = Promise.coroutine(CreateUser)(app, manager, error, roleName)

    createManagerCo.then(m => {
      return cb(null, m)
    }).catch(e => {
      return cb(e)
    })
  }

  User.remoteMethod(
        'createManager', {
          description: 'Create user with manager rights',
          accepts: {
            arg: 'manager',
            type: 'object',
            default: {
              'password': {
                'type': 'string',
                'required': true
              },
              'email': {
                'type': 'string',
                'required': true
              },
              'firstName': {
                'type': 'string',
                'required': true
              },
              'lastName': {
                'type': 'string',
                'required': true
              },
              'telephone': {
                'type': 'number'
              },
              'address': {
                'type': 'string'
              },
              'username': {
                'type': 'string'
              }
            },
            http: { source: 'body' }
          },
          http: {
            path: '/create-manager',
            verb: 'post',
            status: 200,
            errorStatus: 400
          },
          returns: {
            arg: 'newmanager',
            type: 'object'
          }
        }
    )

  User.createUser = function (theuser, cb) {
    let createUserCo = Promise.coroutine(CreateUser)(app, theuser, error)

    createUserCo.then(newuser => {
      return cb(null, newuser)
    }).catch(e => {
      return cb(e)
    })
  }

  User.remoteMethod(
        'createUser', {
          description: 'Create user, that will have kids',
          accepts: [ {
            arg: 'theuser',
            type: 'object',
            default: {
              'password': {
                'type': 'string',
                'required': true
              },
              'email': {
                'type': 'string',
                'required': true
              },
              'firstName': {
                'type': 'string',
                'required': true
              },
              'lastName': {
                'type': 'string',
                'required': true
              },
              'telephone': {
                'type': 'number'
              },
              'address': {
                'type': 'string'
              },
              'username': {
                'type': 'string'
              }
            },
            http: { source: 'body' }
          } ],
          http: {
            path: '/create-user',
            verb: 'post',
            status: 200,
            errorStatus: 400
          },
          returns: {
            arg: 'newuser',
            type: 'object'
          }
        }
    )
  let methodsIDontWannaHide = ['login', "findById", 'patchAttributes', 'deleteById', 'logout', 'createUser', 'createManager', 'upsert', 'find', 'findOne', '__create__accessTokens', '__create__kids', '__get__kids']

  disableAllMethods(User, [...methodsIDontWannaHide])

    // User.disableRemoteMethodByName("create", true);
    // // User.disableRemoteMethodByName("upsert", true);
    // User.disableRemoteMethodByName("updateAll", true);
    // User.disableRemoteMethodByName("updateAttributes", false);
    // User.disableRemoteMethodByName("replaceOrCreate", true);
    // User.disableRemoteMethodByName("replaceById", true);
    // User.disableRemoteMethodByName("upsertWithWhere", true);
    // User.disableRemoteMethodByName("createChangeStream", true);

    // // User.disableRemoteMethodByName("find", true);
    // User.disableRemoteMethodByName("findById", true);
    // // User.disableRemoteMethodByName("findOne", true);

    // User.disableRemoteMethodByName("deleteById", true);

    // User.disableRemoteMethodByName("confirm", true);
    // User.disableRemoteMethodByName("count", true);
    // User.disableRemoteMethodByName("exists", true);
    // User.disableRemoteMethodByName("resetPassword", true);

    // User.disableRemoteMethodByName('prototype.__create__accessTokens', false);
    // User.disableRemoteMethodByName('prototype.__count__accessTokens', false);
    // // User.disableRemoteMethodByName('__create__accessTokens', false);
    // User.disableRemoteMethodByName('prototype.__delete__accessTokens', false);
    // User.disableRemoteMethodByName('prototype.__destroyById__accessTokens', false);
    // User.disableRemoteMethodByName('prototype.__findById__accessTokens', false);
    // User.disableRemoteMethodByName('prototype.__get__accessTokens', false);
    // User.disableRemoteMethodByName('prototype.__updateById__accessTokens', false);
    // User.disableRemoteMethodByName('prototype.__count__kids', false);
    // // User.disableRemoteMethodByName('__create__kids', false);
    // User.disableRemoteMethodByName('prototype.__delete__kids', false);
    // User.disableRemoteMethodByName('prototype.__destroyById__kids', false);
    // User.disableRemoteMethodByName('prototype.__findById__kids', false);
    // // User.disableRemoteMethodByName('__get__kids', false);
    // User.disableRemoteMethodByName('prototype.__updateById__kids', false);
}
