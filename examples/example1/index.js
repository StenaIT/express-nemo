const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()

const expressHttpContextCorrelationId = require('../../packages/express-nemo-correlation-id')
const expressHttpContextLogger = require('../../packages/express-nemo-logger')
const expressHttpContextRequestResponseLogger = require('../../packages/express-nemo-request-response-logger')
const expressHttpContextPerformace = require('../../packages/express-nemo-performance')
const expressHttpContextErrorResponse = require('../../packages/express-nemo-error-response')
const expressHttpContextErrorLogger = require('../../packages/express-nemo-error-logger')
const expressHttpPingRoute = require('../../packages/express-nemo-route-ping')
const expressHttpHealthRoute = require('../../packages/express-nemo-route-health')
const expressHttpGraphqlRoute = require('../../packages/express-nemo-route-graphql')
const expressHttpNotFoundRoute = require('../../packages/express-nemo-route-not-found')
const performanceMonitor = expressHttpContextPerformace()

const typeDefs = `
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello world!'
    }
  }
}

const schema = {
  typeDefs,
  resolvers
}

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

const requestResponseLogger = expressHttpContextRequestResponseLogger({
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

const createEndHandler = (options, middlewares) => {
  const endHandler = (req, res, next) => {
    if (options.postHandlerOptions) {
      req.context.postHandlerOptions = options.postHandlerOptions
    }

    req.on('end', () => {
      if(!middlewares) {
        console.log('Did you forget to put end handlers!')
      }

      for (let i = 0; i < middlewares.length; i++) {
        middlewares[i](req,res, () => {})
      }
    })

    next();
  }

  return endHandler;
}

server
  .use(performanceMonitor.start)
  .use(expressHttpContextCorrelationId())
  .use(expressHttpContextLogger({ loggerFactory: (req, res) => console }))
  .use( createEndHandler({}, [performanceMonitor.end, requestResponseLogger] ))

  .use('/', router)
  .get('/ping', expressHttpPingRoute())
  .get('/health', expressHttpHealthRoute({ checks: [] }))
  .post(
    '/graphql',
    bodyParser.json(),
    expressHttpGraphqlRoute({ graphqlSchema: schema })
  )

  .use(performanceMonitor.error)
  .use(expressHttpNotFoundRoute())
  .use(expressHttpContextErrorLogger())
  .use(expressHttpContextErrorResponse())

server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
