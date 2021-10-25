const { v4: uuid } = require('uuid')
const perfy = require('perfy')

const defaults = {}

const handleEnd = (req) => {
  const trackingId =
    req.context && req.context.performance
      ? req.context.performance.trackingId
      : null

  if (trackingId) {
    req.context.performance.timing = perfy.end(trackingId)
    req.context.performance.trackingId = null
  }
}

module.exports = options => {
  options = { ...defaults, ...options }

  const middleware = {
    start: (req, _res, next) => {
      req.context = {
        ...req.context,
        performance: {
          trackingId: uuid()
        }
      }

      perfy.start(req.context.performance.trackingId)

      if (next) {
        next()
      }
    },
    end: (req, _res, next) => {
      handleEnd(req)
      if (next) {
        next()
      }
    },
    error: (err, req, _res, next) => {
      handleEnd(req)
      if (next) {
        next(err)
      }
    }
  }

  middleware.options = options
  return middleware
}
