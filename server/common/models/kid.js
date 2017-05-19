'use strict'

module.exports = function (Kid) {
  Kid.disableRemoteMethodByName('create', true)
  Kid.disableRemoteMethodByName('upsert', true)
  Kid.disableRemoteMethodByName('updateAll', true)
  Kid.disableRemoteMethodByName('updateAttributes', false)
  Kid.disableRemoteMethodByName('replaceOrCreate', true)
  Kid.disableRemoteMethodByName('replaceById', true)
  Kid.disableRemoteMethodByName('upsertWithWhere', true)
  Kid.disableRemoteMethodByName('createChangeStream', true)

  // Kid.disableRemoteMethodByName("find", true);
  Kid.disableRemoteMethodByName('findById', true)
  Kid.disableRemoteMethodByName('findOne', true)

  // Kid.disableRemoteMethodByName('deleteById', true)

  Kid.disableRemoteMethodByName('confirm', true)
  Kid.disableRemoteMethodByName('count', true)
  Kid.disableRemoteMethodByName('exists', true)

  // Kid.disableRemoteMethodByName('prototype.__count__visits', false)
  Kid.disableRemoteMethodByName('prototype.__create__visits', false)
  Kid.disableRemoteMethodByName('prototype.__delete__visits', false)
  Kid.disableRemoteMethodByName('prototype.__destroyById__visits', false)
  // Kid.disableRemoteMethodByName('prototype.__findById__visits', false)
  // Kid.disableRemoteMethodByName('__get__visits', false);
  Kid.disableRemoteMethodByName('prototype.__updateById__visits', false)

  // to perform search use /api/kids API with query:
  // like {"where": {"fullName": {"regexp": "`${ example string, containing searched field values}`"}}}
}
