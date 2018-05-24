const defaults = {
  errorMessageTemplate: (err, req) =>
    `'Unhandled error' type: ${err.name} '${req.url}'`
}

module.exports = opt => {
  const options = { ...defaults, ...opt }

  const middleware = (err, req, res, next) => {
    res.status(500)
    let errorResponse = options.errorMessageTemplate(err, req)
    res.send(errorResponse)
    next()
  }

  middleware.options = options
  return middleware
}
