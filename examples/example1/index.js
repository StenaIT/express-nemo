const express = require('express')
const router = express.Router()
const expressHttpContextCorrelationId = require('../../packages/express-http-context-correlation-id')
const expressHttpContextLogger = require('../../packages/express-http-context-logger')
const PORT = process.env.PORT || 4000

router.get('/', (req, res, next) => {
  req.context.logger.debug('Hit the default route')
  res.status(200).send({
    correlationId: req.context.correlationId
  })
})

const server = express()

server
  .use(expressHttpContextCorrelationId)
  .use(expressHttpContextLogger({
    loggerFactory: (req, res) => console
  }))
  .use('/', router)

server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
