const defaults = {
  createLogger: () => console,
  eventTemplate: (err, req) => {
    const time =
      req.context &&
      req.context.performance &&
      req.context.performance.timing
        ? ` (time ${req.context.performance.timing.time} s.ms)`
        : ''

    return `Unandled error: ${err.name}, ${err.message}${time}`
  },
  excludeErrors: []
}

module.exports = opt => {
  const options = { ...defaults, ...opt }

  const optionsGuards = (requiredNotNullOptions, requiredfunctionOptions) => {
    if (!Array.isArray(requiredNotNullOptions)) {
      throw new Error('optionGuard requiredNotNullOptions requires an array')
    }

    if (!Array.isArray(requiredfunctionOptions)) {
      throw new Error('optionGuard functionOptions requires an array')
    }

    requiredNotNullOptions.forEach(option => {
      if (!Object.prototype.hasOwnProperty.call(options, option)) {
        throw new Error(`[Options] Missing '${option}' property`)
      } else if (options[option] === null) {
        throw new Error(`[Options] Null on '${option}' property is not allowed`)
      }
    })

    requiredfunctionOptions.forEach(option => {
      if (
        Object.prototype.hasOwnProperty.call(options, option) &&
        typeof options[option] !== 'function'
      ) {
        throw new Error(`[Options] ${option} is not a function`)
      }
    })
  }

  const requiredFunctions = ['createLogger', 'eventTemplate']
  const requiredOptions = requiredFunctions.concat(['excludeErrors'])
  optionsGuards(requiredOptions, requiredFunctions)

  const getLogger = req => {
    if (req.context && req.context.logger) {
      return req.context.logger
    }
    return null
  }

  const middleware = (err, req, res, next) => {
    const logger = getLogger(req) || options.createLogger(req, res)
    const ignoreError = options.excludeErrors.includes(err.name)
    if (!ignoreError) {
      logger.error(options.eventTemplate(err, req))
    }
    next(err)
  }

  middleware.options = options
  return middleware
}
