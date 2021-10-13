const { v4: uuid } = require('uuid');
const perfy = require('perfy')

const defaults = {}

const handleEnd = (req, res, next) => {
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
    start: (req, res, next) => {
      req.context = {
        ...req.context,
        performance: {
          trackingId: uuid()
        }
      }

      perfy.start(req.context.performance.trackingId)

      next && next()
    },
    end: (req, res, next) => {
      handleEnd(req, res, next)
      next && next()
    },
    error: (err, req, res, next) => {
      handleEnd(req, res, next)
      next && next(err)
    }
  }

  middleware.options = options
  return middleware
}
