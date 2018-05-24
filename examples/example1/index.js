const express = require('express')
const router = express.Router()

const expressHttpContextCorrelationId = require('../../packages/express-http-context-correlation-id')
const expressHttpContextLogger = require('../../packages/express-http-context-logger')
const expressHttpContextRequestResponseLogging = require('../../packages/express-http-context-request-response-logging')
const expressHttpContextPerformace = require('../../packages/express-http-context-performance')
const expressHttpContextErrorResponse = require('../../packages/express-http-context-error-response')
const expressHttpContextErrorLogging = require('../../packages/express-http-context-error-logging')
const performanceMonitor = expressHttpContextPerformace()

const PORT = process.env.PORT || 4000

router.get('/', (req, res, next) => {
  req.context.logger.debug('Hit the default route')
  res.status(200).send({
    correlationId: req.context.correlationId
  })
  next()
})

router.get('/error', (req, res, next) => {
  throw new Error('A very bad error')
})

const server = express()

server
  .use(performanceMonitor.start)
  .use(expressHttpContextCorrelationId())
  .use(expressHttpContextLogger({ loggerFactory: (req, res) => console }))
  .use('/', router)
  .use(performanceMonitor.end)
  .use(expressHttpContextErrorLogging())
  .use(expressHttpContextErrorResponse())
  .use(
    expressHttpContextRequestResponseLogging({
      logEventFactory: (req, res) => {
        const time =
          req.context &&
          req.context.performance &&
          req.context.performance.timing
            ? ` (time ${req.context.performance.timing.time} s.ms)`
            : ''
        return `${req.method} ${req.url} - HTTP ${res.statusCode}${time}`
      }
    })
  )

server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
