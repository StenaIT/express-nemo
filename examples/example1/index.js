const express = require('express')
const router = express.Router()

const expressHttpContextCorrelationId = require('../../packages/express-http-context-correlation-id')
const expressHttpContextLogger = require('../../packages/express-http-context-logger')
const expressHttpContextRequestResponseLogging = require('../../packages/express-http-context-request-response-logging')
const expressHttpContextPerformace = require('../../packages/express-http-context-performance')
const performanceMonitor = expressHttpContextPerformace()

const PORT = process.env.PORT || 4000

router.get('/', (req, res, next) => {
  req.context.logger.debug('Hit the default route')
  res.status(200).send({
    correlationId: req.context.correlationId
  })
  next()
})

const server = express()

server
  .use(performanceMonitor.start)
  .use(expressHttpContextCorrelationId())
  .use(expressHttpContextLogger({ loggerFactory: (req, res) => console }))
  .use('/', router)
  .use(performanceMonitor.end)
  .use(
    expressHttpContextRequestResponseLogging({
      logEventFactory: (req, res) => {
        return `${req.method} ${req.url} - HTTP ${res.statusCode} (time ${
          req.context.performance.timing.time
        } s.ms)`
      }
    })
  )

server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
