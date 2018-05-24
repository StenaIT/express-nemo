const defaults = {
  createLogger: () => console,
  eventTemplate: (err, req) => `Unandled error: ${err.name}, ${err.message}`
}

module.exports = opt => {
  const options = { ...defaults, ...opt }

  const getLogger = req => {
    if (req.context && req.context.logger) {
      return req.context.logger
    }
    return null
  }

  const middleware = (err, req, res, next) => {
    const logger = getLogger(req) || options.createLogger(err, req)
    logger.error(options.eventTemplate(err, req))
    next(err)
  }

  middleware.options = options
  return middleware
}
