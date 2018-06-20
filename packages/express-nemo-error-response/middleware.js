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
    if (res.statusCode <= 399) {
      res.status(500)
    }
    let errorResponse = options.errorMessageTemplate(err, req, res)
    res.send(errorResponse)
    next()
  }

  middleware.options = options
  return middleware
}
