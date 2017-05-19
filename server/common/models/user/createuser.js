'use strict'

module.exports = function* (app, user, error, roleName) {
  let RoleMapping = app.models.RoleMapping
  let User = app.models.user
  let Role = app.models.Role
  let fullName = user.firstName + ' ' + user.lastName

  let foundUser = yield User.findOne({'username': user.username})

  if (foundUser.length > 0) {
    throw new error.UserCreationError('User with such username already exists', 400)
  }

  let newUser = yield User.create({
    'password': user.password,
    'username': user.username,
    'firstName': user.firstName,
    'lastName': user.lastName,
    'fullName': fullName,
    'telephone': user.telephone,
    'address': user.address
  })

  if (newUser === undefined || newUser === null) {
    throw new error.UserCreationError('Error during write to db', 400)
  }

  if (roleName !== null && roleName !== undefined) {
    let foundRole = yield Role.find({ where: {
      name: roleName
    }})
    if (foundRole.length <= 0 || foundRole === undefined) {
      throw new error.UserCreationError(`There is no such role: ${roleName}`, 400)
    }

    let principal = yield foundRole[0].principals.create({
      principalType: RoleMapping.USER,
      principalId: newUser.id
    })
    if (principal === undefined) {
      throw new error.UserCreationError('Principal is not created, db error', 400)
    }
  }

  return newUser
}
