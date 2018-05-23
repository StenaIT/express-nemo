const defaults = {}

module.exports = options => {
  options = { ...defaults, ...options }

  if (!options.loggerFactory || typeof options.loggerFactory !== 'function') {
    throw new Error('Missing logger factory function')
  }

  const middleware = (req, res, next) => {
    const logger = options.loggerFactory(req, res)
    req.context = { ...req.context, logger: logger }
    next()
  }

  middleware.options = options
  return middleware
}
