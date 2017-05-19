'use strict'
/* global describe, it, before */
//  run tests with  node ./node_modules/mocha/bin/mocha tests/mocha_test
//  or `make test`
//
const supertest = require('supertest-as-promised')
const expect = require('chai').expect

const host = 'http://localhost:3000'
/* eslint-disable no-unused-vars */
const log = console.log
/* eslint-enable no-unused-vars */

const username = 'admin'
const password = 'password'

let simpleFirstName = 'theFirstName'
let simpleLastName = 'theLastName'

const users = {}
const rooms = {}

const randomNumbers = () => Math.random().toString().slice(2, 7)

let testUser = 'loplop' + randomNumbers()
let testUserPass = '345tg34' + randomNumbers()

describe('test apis: ', function () {
  let agentAdmin = supertest.agent(host)

  before(function (done) {
    agentAdmin
      .post('/api/users/login')
      .send({
        username: username,
        password: password
      })
      .then(res => {
        log('rrrr login ', Object.keys(res))
        log('rrrr login ', res.res.headers)
        log('rrrr login ', res.body)
        // log('res.body.res header ', res.body.res)
        // expect(res.body.userInfo.rolesInfo.isAdmin).to.be.false
        expect(res.body.userInfo.rolesInfo.roles).to.be.instanceof(Object)
        expect(res.body.userInfo.rolesInfo.roles).to.be.instanceof(Array)
        expect(res.body.userInfo.rolesInfo.roles).to.include.members(['admin', '$authenticated', '$everyone'])
        // expect(res.body.res).to.have.property[ 'header' ]
        expect(res.res.headers['set-cookie']).to.have.property['kookie']
        done()
      })
  })

  it('creates new regular user', function () {
    return agentAdmin
      .post('/api/users/create-user')
      .send({
        username: testUser,
        password: testUserPass,
        firstName: simpleFirstName,
        lastName: simpleLastName
      })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('newuser')
        return agentAdmin
          .post('/api/users/create-user')
          .send({
            username: testUser,
            password: testUserPass,
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(422)
      })
      .then(res => {
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.instanceof(Object)
        expect(res.body.error).to.have.property('message')
        expect(res.body.error).to.have.property('name')
        expect(res.body.error.name).to.equal('ValidationError')
      })
  })

  it('creates new Manager-user', function () {
    users.firstManager = {}
    users.firstManager.managerUn = testUser + randomNumbers()
    users.firstManager.managerP = testUserPass + randomNumbers()

    // successfully creates new manager
    return agentAdmin
      .post('/api/users/create-manager')
      .send({
        username: users.firstManager.managerUn,
        password: users.firstManager.managerP,
        firstName: simpleFirstName,
        lastName: simpleLastName
      })
      .expect(200)
      .then(res => {
        // fails to create manager with existing username
        expect(res.body).to.have.property('newmanager')
        users.newmanager = res.body.newmanager
        return agentAdmin
          .post('/api/users/create-manager')
          .send({
            username: users.firstManager.managerUn,
            password: users.firstManager.managerP,
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(422)
      })
      .then(res => {
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.instanceof(Object)
        expect(res.body.error).to.have.property('message')
        expect(res.body.error).to.have.property('name')
        expect(res.body.error.name).to.equal('ValidationError')
      })
      .then(res => {
        // update user
        users.newmanager.firstName = simpleFirstName + 'UPDATED_firstName'
        users.newmanager.username = users.firstManager.managerUn + 'UPDATED_username' + randomNumbers()
        users.newmanager.lastName = simpleLastName + 'UPDATED_lastname'
        return agentAdmin
          .patch(`/api/users/${users.newmanager.id}`)
          .send({
            username: users.newmanager.username,
            firstName: users.newmanager.firstName,
            lastName: users.newmanager.lastName
          })
          .expect(200)
      })
      .then(res => {
        return agentAdmin
          .post('/api/users/create-manager')
          .send({
            username: users.firstManager.managerUn,
            password: users.firstManager.managerP,
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(200)
      })
  })
  it('creates new Room', function () {
    rooms['01'] = {}
    rooms['01'].name = 'The Funniest room ever'
    return agentAdmin
      .post(`/api/rooms`)
      .send({
        name: rooms['01'].name
      })
      .expect(200)
      .then(res => {
        expect(res.body.name).to.equal(rooms['01'].name)
        rooms['01'].res = res.body
      })
  })

  let agentFirstManager = supertest.agent(host)

  it('acts as manager-user: creates new user, adds kid to created user, fails to create manager: ', function () {
    return agentFirstManager
      .post('/api/users/login')
      .send({
        username: users.firstManager.managerUn,
        password: users.firstManager.managerP
      })
      .expect(200)
      .then(res => {
        expect(res.body.userInfo.rolesInfo.isAdmin).to.be.false
        expect(res.body.userInfo.rolesInfo.roles).to.be.instanceof(Object)
        expect(res.body.userInfo.rolesInfo.roles).to.be.instanceof(Array)
        expect(res.body.userInfo.rolesInfo.roles).to.include.members(['manager', '$authenticated', '$everyone'])

        users.tu2 = testUser + randomNumbers()
        users.tu2p = testUserPass + randomNumbers()

        // creates new user
        return agentFirstManager
          .post('/api/users/create-user')
          .send({
            username: users.tu2,
            password: users.tu2p,
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.have.property('newuser')
        // adds kid to created user
        users.tu2Id = res.body.newuser.id
        users.tu2Kids = {}
        users.tu2Kids['01'] = {}
        users.tu2Kids['01'].name = 'David Bowie Jr'
        return agentFirstManager
          .post(`/api/users/${users.tu2Id}/kids`)
          .send({
            fullName: users.tu2Kids['01'].name
          })
          .expect(422)
      })
      .then(res => {
        expect(res.body.error.name).to.equal('ValidationError')
        users.tu2Kids['01'].birthDate = new Date()
        users.tu2Kids['01'].gender = 'male'
        return agentFirstManager
          .post(`/api/users/${users.tu2Id}/kids`)
          .send({
            fullName: users.tu2Kids['01'].name,
            birthDate: users.tu2Kids['01'].birthDate,
            gender: users.tu2Kids['01'].gender
          })
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.have.property('fullName')
        expect(res.body.fullName).to.be.equal(users.tu2Kids['01'].name)
        // adds kid to created user
        users.tu2Kids['01'].res = res.body
        users.tu2Kids['02'] = {}
        users.tu2Kids['02'].name = 'Nickita Johan Mare'
        users.tu2Kids['02'].gender = 'female'
        return agentFirstManager
          .post(`/api/users/${users.tu2Id}/kids`)
          .send({
            fullName: users.tu2Kids['02'].name,
            birthDate: new Date(),
            gender: users.tu2Kids['02'].gender
          })
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.have.property('fullName')
        expect(res.body.fullName).to.be.equal(users.tu2Kids['02'].name)
        users.tu2Kids['02'].res = res.body
        // get kids
        return agentFirstManager
          .get(`/api/users/${users.tu2Id}/kids`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.have.lengthOf(2)
        // fails to create manager as manager-user(with manager ROLE)
        return agentFirstManager
          .post('/api/users/create-manager')
          .send({
            username: testUser + randomNumbers(),
            password: testUserPass + randomNumbers(),
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(401)
      })
      .then(res => {
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.instanceof(Object)
        expect(res.body.error).to.have.property('message')
        expect(res.body.error.message).to.equal('Authorization Required')
        return agentFirstManager
          .get(`/api/kids`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Array)
        // manager fails to create room
        return agentFirstManager
          .post(`/api/rooms`)
          .send({
            name: 'the room'
          })
          .expect(401)
      })
      .then(res => {
        // start track child in room with manager rights
        return agentFirstManager
          .post(`/api/rooms/start-track-time`)
          .query({
            'kidid': users.tu2Kids['02'].res.id,
            'roomid': rooms['01'].res.id
          })
          .expect(200)
      })
      .then(res => {
        expect(res.body.room.isFinished).to.be.false
        rooms['01'].visits_01 = res.body.room

        // get rooms
        return agentFirstManager
          .get(`/api/rooms`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Array)
        return agentFirstManager
          .get(`/api/visits`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Array)
        // stop track child in room
        return agentFirstManager
          .post(`/api/rooms/stop-track-time`)
          .query({
            'kidid': users.tu2Kids['02'].res.id,
            'roomid': rooms['01'].res.id
          })
          .expect(200)
      })
      .then(res => {
        // now returns somthing like { room: { count: 1 } }
        expect(res.body.room).to.be.instanceof(Object)
        expect(res.body.room).to.have.property('count')
      })
      .then(res => {
        // fails to create user with existing username
        return agentFirstManager
          .post('/api/users/create-user')
          .send({
            username: users.tu2,
            password: users.tu2p,
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(422)
      })
      .then(res => {
        return agentFirstManager
          .patch(`/api/users/${users.newmanager.id}`)
          .send({
            username: users.newmanager.username,
            firstName: users.newmanager.firstName,
            lastName: users.newmanager.lastName
          })
          .expect(200)
      })
  })

  let agentRegularUser = supertest.agent(host)

  it('acts as regular user (parent):: ', function () {
    return agentRegularUser
      .post('/api/users/login')
      .send({
        username: users.tu2,
        password: users.tu2p
      })
      .expect(200)
      .then(res => {
        expect(res.body.userInfo.rolesInfo.isAdmin).to.be.false
        expect(res.body.userInfo.rolesInfo.roles).to.be.instanceof(Object)

        // fails to create user
        return agentRegularUser
          .post('/api/users/create-user')
          .send({
            username: users.tu2,
            password: users.tu2p,
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(401)
      })
      .then(res => {
        // fails to add kids to created user
        return agentRegularUser
          .post(`/api/users/${users.tu2Id}/kids`)
          .send({
            fullName: 'Chuck Norris Jr'
          })
          .expect(401)
      })
      .then(res => {
        expect(res.body.error.message).to.equal('Authorization Required')
        return agentRegularUser
          .get(`/api/users/${users.tu2Id}/kids`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.have.lengthOf(2)
        return agentRegularUser
          .get(`/api/kids`)
          .expect(401)
      })
      .then(res => {
        // fails to create manager with regular user ROLE (parent)
        return agentRegularUser
          .post('/api/users/create-manager')
          .send({
            username: testUser + randomNumbers(),
            password: testUserPass + randomNumbers(),
            firstName: simpleFirstName,
            lastName: simpleLastName
          })
          .expect(401)
      })
      .then(res => {
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.instanceof(Object)
        expect(res.body.error).to.have.property('message')
        expect(res.body.error.message).to.equal('Authorization Required')
      })
      .then(res => {
        // fails to patch user with regular-user rights
        return agentRegularUser
          .patch(`/api/users/${users.newmanager.id}`)
          .send({
            username: users.newmanager.username,
            firstName: users.newmanager.firstName,
            lastName: users.newmanager.lastName
          })
          .expect(401)
      })
      .then(res => {
        // fails start track child in room with regular-user rights
        return agentRegularUser
          .post(`/api/rooms/start-track-time`)
          .query({
            'kidid': users.tu2Kids['02'].res.id,
            'roomid': rooms['01'].res.id
          })
          .expect(401)
      })
  })

  it('admin success start-track-time: ', function () {
    return agentAdmin
      .post(`/api/rooms/start-track-time`)
      .query({
        'kidid': users.tu2Kids['02'].res.id,
        'roomid': rooms['01'].res.id
      })
      .expect(200)
      .then(res => {
        expect(res.body.room.isFinished).to.be.false
        expect(res.body.room.started).to.be.a('string')
        expect(res.body.room.kid_visitor).to.be.a('number')
        expect(res.body.room.kid_visitor).to.be.a('number')
      })
  })
  it('admin success stop-track-time: ', function () {
    return agentAdmin
      .post(`/api/rooms/stop-track-time`)
      .query({
        'kidid': users.tu2Kids['02'].res.id,
        'roomid': rooms['01'].res.id
      })
      .expect(200)
      .then(res => {
        expect(res.body.room.count).to.be.a('number')
      })
  })
  it('manager success start-track-time: ', function () {
    return agentAdmin
      .post(`/api/rooms/start-track-time`)
      .query({
        'kidid': users.tu2Kids['02'].res.id,
        'roomid': rooms['01'].res.id
      })
      .expect(200)
      .then(res => {
        expect(res.body.room.isFinished).to.be.false
        expect(res.body.room.started).to.be.a('string')
        expect(res.body.room.kid_visitor).to.be.a('number')
        expect(res.body.room.kid_visitor).to.be.a('number')
      })
  })
  it('manager success stop-track-time: ', function () {
    return agentAdmin
      .post(`/api/rooms/stop-track-time`)
      .query({
        'kidid': users.tu2Kids['02'].res.id,
        'roomid': rooms['01'].res.id
      })
      .expect(200)
      .then(res => {
        expect(res.body.room.count).to.be.a('number')
      })
  })
  it('regular-user fails start-track-time: ', function () {
    return agentRegularUser
      .post(`/api/rooms/start-track-time`)
      .query({
        'kidid': users.tu2Kids['02'].res.id,
        'roomid': rooms['01'].res.id
      })
      .expect(401)
  })
  it('admin success stop-track-time: ', function () {
    return agentRegularUser
      .post(`/api/rooms/stop-track-time`)
      .query({
        'kidid': users.tu2Kids['02'].res.id,
        'roomid': rooms['01'].res.id
      })
      .expect(401)
  })

  // test visits get & visits delete

  let GotVisits
  it('admin success get visits & delete visit by id: ', function () {
    return agentAdmin
      .get(`/api/visits`)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
        GotVisits = res.body
        return agentAdmin
          .delete(`/api/visits/${GotVisits[0].id}`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.have.property('count')
      })
  })
  it('manager success get visits & delete visit by id: ', function () {
    return agentFirstManager
      .get(`/api/visits`)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
        GotVisits = res.body
        return agentFirstManager
          .delete(`/api/visits/${GotVisits[0].id}`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.have.property('count')
      })
  })
  it('regular-user fails to get visits & delete visit by id: ', function () {
    return agentRegularUser
      .get(`/api/visits`)
      .expect(401)
      .then(res => {
        return agentRegularUser
          .delete(`/api/visits/${GotVisits[0].id}`)
          .expect(401)
      })
  })

  let GotUsers
  it('admin get and successfully DELETE user', function () {
    return agentAdmin
      .get(`/api/users`)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
        GotUsers = res.body

        return agentAdmin
          .delete(`/api/users/${GotUsers[4].id}`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.have.property('count')
        expect(res.body.count).to.equal(1)
      })
  })

  it('manager success to get and DELETE user', function () {
    return agentFirstManager
      .get(`/api/users`)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
        GotUsers = res.body

        return agentAdmin
          .delete(`/api/users/${GotUsers[GotUsers.length - 1].id}`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.have.property('count')
        expect(res.body.count).to.equal(1)
      })
  })
  it('regular-user fails to get and DELETE user', function () {
    return agentRegularUser
      .get(`/api/users`)
      .expect(401)
      .then(res => {
        return agentRegularUser
          .delete(`/api/users/${GotUsers[GotUsers.length - 1].id}`)
          .expect(401)
      })
  })

  let gotKids
  it('admin get kids, and then get visits for kid', function () {
    return agentAdmin
      .get(`/api/kids`)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
        gotKids = res.body

        return agentAdmin
          .get(`/api/kids/${gotKids[gotKids.length - 1].id}/visits`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
      })
  })
  it('manager get kids, and then get visits for kid', function () {
    return agentFirstManager
      .get(`/api/kids`)
      .expect(200)
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
        gotKids = res.body

        return agentFirstManager
          .get(`/api/kids/${gotKids[gotKids.length - 1].id}/visits`)
          .expect(200)
      })
      .then(res => {
        expect(res.body).to.be.instanceof(Object)
        expect(res.body).to.be.instanceof(Array)
      })
  })
  it('regular-user fails to get kids, and get visits for kid', function () {
    return agentRegularUser
      .get(`/api/kids`)
      .expect(401)
      .then(res => {
        return agentRegularUser
          .get(`/api/kids/${gotKids[gotKids.length - 1].id}/visits`)
          .expect(401)
      })
  })
  it('regular-user get kids as owner', function () {
    return agentRegularUser
      .get(`/api/users`)
      .expect(200)
      .then(res => {
        return agentRegularUser
          .get(`/api/users/${gotKids[gotKids.length - 1].id}/visits`)
          .expect(401)
      })
  })
})

// can login with any pasword bag
