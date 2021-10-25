const defaults = {
  errorMessageTemplate: (err, req) =>
    `'Unhandled error' type: ${err.name} '${req.url}'`
}

module.exports = opt => {
  const options = { ...defaults, ...opt }

  if (
    !options.errorMessageTemplate ||
    typeof options.errorMessageTemplate !== 'function'
  ) {
    throw new Error('[Options] Missing errorMessageTemplate function')
  }

  const middleware = (err, req, res, next) => {
    const errorResponse = options.errorMessageTemplate(err, req, res)
    if (!res.headersSent) {
      if (res.statusCode <= 399) {
        res.status(500)
      }
      res.send(errorResponse)
    } else if (req.context && req.context.logger) {
      req.context.logger.error('Message already sent, see next log for more info')
      req.context.logger.error(errorResponse)
    }
    next(err)
  }

  middleware.options = options
  return middleware
}
