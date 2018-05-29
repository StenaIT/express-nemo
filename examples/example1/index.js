const express = require('express')
const router = express.Router()

const expressHttpContextCorrelationId = require('express-nemo-correlation-id')
const expressHttpContextLogger = require('express-nemo-logger')
const expressHttpContextRequestResponseLogger = require('express-nemo-request-response-logger')
const expressHttpContextPerformace = require('express-nemo-performance')
const expressHttpContextErrorResponse = require('express-nemo-error-response')
const expressHttpContextErrorLogger = require('express-nemo-error-logger')
const expressHttpNotFoundRoute = require('express-nemo-route-not-found')
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
  .use(expressHttpNotFoundRoute())
  .use(performanceMonitor.end)
  .use(expressHttpContextErrorLogger())
  .use(expressHttpContextErrorResponse())
  .use(
    expressHttpContextRequestResponseLogger({
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
