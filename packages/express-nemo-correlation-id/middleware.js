const { v4: uuid } = require('uuid')

const defaults = {}

module.exports = options => {
  options = { ...defaults, ...options }

  const middleware = (req, res, next) => {
    const url2 = new URL(req.url, 'relative:///')
    const params = new URLSearchParams(url2.search)
    const correlationId = (params.has('correlationId') && params.get('correlationId')) || uuid()
    req.context = { ...req.context, correlationId: correlationId }
    next()
  }

  middleware.options = options
  return middleware
}
