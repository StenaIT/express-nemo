const jwt = require('express-jwt')

const defaults = {}

module.exports = options => {
  options = { ...defaults, ...options }

  if (!options.jwt || typeof options.jwt !== 'object') {
    throw new Error('[Options] Missing jwt configuration object')
  }

  if (!options.jwt.secret) {
    throw new Error('[Options] Missing secret in jwt')
  }

  if (!options.jwt.algorithms || !Array.isArray(options.jwt.algorithms)) {
    throw new Error('[Options] Missing algorithms in jwt')
  }

  const middleware = (req, res, next) => {
    const wrappedNext = err => {
      if (err) {
        res.status(401)
        middleware.log(
          req,
          'info',
          `Authentication failed! Reason: ${err.name}.`
        )
      } else {
        middleware.log(req, 'debug', 'Successfully authenticated!')
      }

      next(err)
    }

    middleware.log(req, 'debug', 'Starting authentication process')
    middleware.auth(req, res, wrappedNext)
  }

  middleware.log = (req, level, message) => {
    if (req.context && req.context.logger) {
      req.context.logger[level](`[auth0-jwt] ${message}`)
    }
  }

  middleware.auth = jwt(options.jwt).unless(_req => {
    return process.env.AUTHENTICATION_ACTIVE === 'false'
  })

  middleware.options = options
  return middleware
}
