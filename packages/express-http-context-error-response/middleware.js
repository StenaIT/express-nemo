const extend = require('deep-extend')

const debugEnabled = () => process.env.NODE_ENV === 'DEV'

const defaults = {
  errorMessageTemplate: (err, statusCode, req) => `'Unhandled error' type: ${err.name} '${req.url}'`
}

module.exports = (opt) => {
  const options = extend({}, defaults, opt)

  const middleware = (err, req, res, next) => {
    const statusCode = 500
    let errorResponse = options.errorMessageTemplate(err, statusCode, req)

    res.status(statusCode).send(errorResponse)
    next()
  }

  middleware.options = options
  return middleware
}
