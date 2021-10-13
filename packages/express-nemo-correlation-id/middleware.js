const querystring = require('querystring')
const url = require('url')
const { v4: uuid } = require('uuid');

const defaults = {}

module.exports = options => {
  options = { ...defaults, ...options }

  const middleware = (req, res, next) => {
    const query = querystring.parse(url.parse(req.url).query)
    const correlationId = query.correlationId || uuid()
    req.context = { ...req.context, correlationId: correlationId }
    next()
  }

  middleware.options = options
  return middleware
}
