'use strict'

const Promise = require('bluebird')
const app = require('../../server/server.js')
const error = require('../../server/errors/')

module.exports = function (Room) {
  Room.startTrackTime = function (kidid, roomid, cb) {
    const Visit = app.models.visit
    const Room = app.models.room
    const Kid = app.models.kid

    function* startTrackVisit () {
      let startDate = Date()
      let foundKid = yield Kid.findById(kidid)
      if (foundKid === null || foundKid === undefined) {
        throw new error.TrackVisitError('There is no kid with such id', 400)
      }

      let foundRoom = yield Room.findById(roomid)
      if (foundKid === null || foundRoom === undefined) {
        throw new error.TrackVisitError('There is no room with such id', 400)
      }

      let foundVisit = yield Visit.find({'where': { 'kid_visitor': kidid, 'isFinished': false }})
      if (foundVisit.length > 0) {
        throw new error.TrackVisitError('Kid with such ID is already in room now', 400)
      }

      let newVisit = yield Visit.create({'kid_visitor': kidid, 'theroom': roomid, 'started': startDate, 'isFinished': false})
      if (newVisit === undefined || newVisit === null) {
        throw new error.TrackVisitError('Create new visit fails', 400)
      }

      return (newVisit)
    };
    let startTrackTimeCo = Promise.coroutine(startTrackVisit)()

    startTrackTimeCo.then(r => {
      return cb(null, r)
    }).catch(e => {
      return cb(e)
    })
  }

  Room.remoteMethod(
        'startTrackTime', {
          description: 'Start tracking, when kid visits room',
          accepts: [
            {
              arg: 'kidid',
              type: 'number',
              http: { source: 'query' },
              required: true
            },
            {
              arg: 'roomid',
              type: 'number',
              http: { source: 'query' },
              required: true
            }
          ],
          http: {
            path: '/start-track-time',
            verb: 'post',
            status: 200,
            errorStatus: 400
          },
          returns: {
            arg: 'room',
            type: 'object'
          }
        }
    )

  Room.stopTrackTime = function (kidid, roomid, cb) {
    const Visit = app.models.visit
    const Room = app.models.room
    const Kid = app.models.kid

    function* startTrackVisit () {
      let stopDate = Date()

      let foundKid = yield Kid.findById(kidid)
      if (foundKid === null || foundKid === undefined) {
        throw new error.TrackVisitError('There is no kid with such id', 400)
      }

      let foundRoom = yield Room.findById(roomid)
      if (foundRoom === null || foundRoom === undefined) {
        throw new error.TrackVisitError('There is no room with such id', 400)
      }

      let foundVisit = yield Visit.find({'where': { 'kid_visitor': kidid, 'isFinished': false }})
      if (foundVisit.length > 1) {
        throw new error.TrackVisitError('Something went wrong. Kid cant be in more the one room at one time ! ', 400)
      }
      if (foundVisit.length <= 0 || foundVisit === undefined) {
        throw new error.TrackVisitError('No visits for this query was found', 400)
      }

      let updatedVisit = yield Visit.updateAll({'id': foundVisit[0].id, 'kid_visitor': kidid}, {'isFinished': true, 'finishDate': stopDate})
      if (updatedVisit === undefined || updatedVisit === null) {
        throw new error.TrackVisitError('Update visit status fails', 400)
      }

      return (updatedVisit)
    };
    let startTrackTimeCo = Promise.coroutine(startTrackVisit)()

    startTrackTimeCo.then(r => {
      return cb(null, r)
    }).catch(e => {
      return cb(e)
    })
  }

  Room.remoteMethod(
    'stopTrackTime', {
      description: 'Stop tracking, when kid leaves room',
      accepts: [
        {
          arg: 'kidid',
          type: 'number',
          http: { source: 'query' },
          required: true
        },
        {
          arg: 'roomid',
          type: 'number',
          http: { source: 'query' },
          required: true
        }
      ],
      http: {
        path: '/stop-track-time',
        verb: 'post',
        status: 200,
        errorStatus: 400
      },
      returns: {
        arg: 'room',
        type: 'object'
      }
    }
  )

  // Room.disableRemoteMethodByName("create", true);
  Room.disableRemoteMethodByName('upsert', true)
  Room.disableRemoteMethodByName('updateAll', true)
  Room.disableRemoteMethodByName('updateAttributes', false)
  Room.disableRemoteMethodByName('replaceOrCreate', true)
  Room.disableRemoteMethodByName('replaceById', true)
  Room.disableRemoteMethodByName('upsertWithWhere', true)
  Room.disableRemoteMethodByName('createChangeStream', true)

  // Room.disableRemoteMethodByName("find", true);
  Room.disableRemoteMethodByName('findById', true)
  Room.disableRemoteMethodByName('findOne', true)

  // Room.disableRemoteMethodByName("deleteById", true);

  Room.disableRemoteMethodByName('confirm', true)
  Room.disableRemoteMethodByName('count', true)
  Room.disableRemoteMethodByName('exists', true)

  // Room.disableRemoteMethodByName('__count__visits', false);
  Room.disableRemoteMethodByName('__create__visits', false)
  Room.disableRemoteMethodByName('__delete__visits', false)
  Room.disableRemoteMethodByName('__destroyById__visits', false)
  Room.disableRemoteMethodByName('__findById__visits', false)
  // Room.disableRemoteMethodByName('__get__visits', false);
  Room.disableRemoteMethodByName('__updateById__visits', false)
}
