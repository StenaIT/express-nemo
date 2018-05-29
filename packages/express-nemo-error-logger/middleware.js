const defaults = {
  createLogger: () => console,
  eventTemplate: (err, req) => `Unandled error: ${err.name}, ${err.message}`
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
      if (!options.hasOwnProperty(option)) {
        throw new Error(`[Options] Missing ${option} property`)
      }
    })

    requiredfunctionOptions.forEach(option => {
      if (
        options.hasOwnProperty(option) &&
        typeof options[option] !== 'function'
      ) {
        throw new Error(`[Options] ${option} is not a function`)
      }
    })
  }

  const requiredFunctions = ['createLogger', 'eventTemplate']
  optionsGuards(requiredFunctions, requiredFunctions)

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
