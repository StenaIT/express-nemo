const uuid = require('uuid/v4')
const perfy = require('perfy')

const defaults = {}

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

      next()
    },
    end: (req, res, next) => {
      const trackingId =
        req.context && req.context.performance
          ? req.context.performance.trackingId
          : null

      if (trackingId) {
        req.context.performance.timing = perfy.end(trackingId)
      }

      next()
    }
  }

  middleware.options = options
  return middleware
}
