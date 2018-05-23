const querystring = require('querystring')
const url = require('url')
const uuid = require('uuid/v4')

module.exports = (req, res, next) => {
  const query = querystring.parse(url.parse(req.url).query)
  const correlationId = query.correlationId || uuid()
  req.context = { ...req.context, correlationId: correlationId }
  next()
}
