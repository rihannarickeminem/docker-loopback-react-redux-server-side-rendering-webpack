'use strict'

module.exports = function (Visit) {
  Visit.disableRemoteMethodByName('create', true)
  Visit.disableRemoteMethodByName('upsert', true)
  Visit.disableRemoteMethodByName('updateAll', true)
  Visit.disableRemoteMethodByName('updateAttributes', false)
  Visit.disableRemoteMethodByName('replaceOrCreate', true)
  Visit.disableRemoteMethodByName('replaceById', true)
  Visit.disableRemoteMethodByName('upsertWithWhere', true)
  Visit.disableRemoteMethodByName('createChangeStream', true)

  // Visit.disableRemoteMethodByName("find", true);
  Visit.disableRemoteMethodByName('findById', true)
  Visit.disableRemoteMethodByName('findOne', true)

  // Visit.disableRemoteMethodByName('deleteById', true)

  Visit.disableRemoteMethodByName('confirm', true)
  // Visit.disableRemoteMethodByName("count", true);
  Visit.disableRemoteMethodByName('exists', true)
}
