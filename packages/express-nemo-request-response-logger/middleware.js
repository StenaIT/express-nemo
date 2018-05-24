const defaults = {
  loggerFunctionName: 'debug',
  logEventFactory: (req, res) =>
    `${req.method} ${req.url} - HTTP ${res.statusCode}`
}

module.exports = options => {
  options = { ...defaults, ...options }

  if (
    !options.logEventFactory ||
    typeof options.logEventFactory !== 'function'
  ) {
    throw new Error('[Options] Missing log event factory function')
  }

  if (
    !options.loggerFunctionName ||
    typeof options.loggerFunctionName !== 'string'
  ) {
    throw new Error('[Options] Missing logger function name')
  }

  const middleware = (req, res, next) => {
    const logEvent = options.logEventFactory(req, res)
    req.context.logger[options.loggerFunctionName](logEvent)
    next()
  }

  middleware.options = options
  return middleware
}
