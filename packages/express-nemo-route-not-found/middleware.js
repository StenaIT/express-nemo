const defaults = {
  notFoundResponseTemplate: (req, res) => {
    return `Not Found '${res.statusCode}' - No route matching path '${
      req.url
    }' was found`
  }
}

module.exports = options => {
  options = { ...defaults, ...options }

  if (
    !options.notFoundResponseTemplate ||
    typeof options.notFoundResponseTemplate !== 'function'
  ) {
    throw new Error('[Options] Missing notFoundResponseTemplate function')
  }

  const middleware = (req, res, next) => {
    if (res.statusCode === 200) {
      if (!req.route) {
        res.status(404)
        const clientResponse = options.notFoundResponseTemplate(req, res)
        res.send(clientResponse)
      }
    }

    next()
  }

  middleware.options = options
  return middleware
}
