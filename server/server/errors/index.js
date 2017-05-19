class ExtendableError extends Error {
  constructor (message, status) {
    super(message, status)
    this.name = this.constructor.name
    this.message = message
    this.status = status

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

class UserCreationError extends ExtendableError {
  constructor (m, s) {
    super(m, s)
  }
}

class UserAuthError extends ExtendableError {
  constructor (m, s) {
    super(m, s)
  }
}

class TrackVisitError extends ExtendableError {
  constructor (m, s) {
    super(m, s)
  }
}

module.exports = {
  UserCreationError,
  TrackVisitError,
  UserAuthError
}
