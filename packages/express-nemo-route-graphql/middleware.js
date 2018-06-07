const graphqlExpress = require('./graphql/expressApollo')
const { makeExecutableSchema } = require('graphql-tools')

const defaults = {}

module.exports = options => {
  options = { ...defaults, ...options }

  if (!options.graphqlSchema || typeof options.graphqlSchema !== 'object') {
    throw new Error('[Options] Missing graphqlSchema object')
  }

  console.log('before')
  const schema = makeExecutableSchema(options.graphqlSchema)
  console.log('after')
  const middleware = async (req, res, next) => {
    let nextWasCalled = false
    const wrappedNext = arg => {
      nextWasCalled = true
      next(arg)
    }

    const graphqlHTTPHandler = function (req, res) {
      return graphqlExpress({
        schema: schema,
        context: {
          user: req.user,
          authorization: req.headers.authorization,
          logger: req.context.logger
        }
      })
    }

    let graphqlHandler = graphqlHTTPHandler(req, res)
    await graphqlHandler(req, res, wrappedNext)

    if (!nextWasCalled) {
      next()
    }
  }

  middleware.options = options
  return middleware
}
