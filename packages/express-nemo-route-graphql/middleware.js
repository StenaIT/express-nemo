const graphqlExpress = require('./graphql/expressApollo')

const defaults = {}

module.exports = options => {
  options = { ...defaults, ...options }

  if (
    !options.graphqlSchema ||
    typeof options.graphqlSchema !== 'object'
  ) {
    throw new Error('[Options] Missing graphqlSchema object')
  }

  const middleware = async (req, res, next) => {
     const graphqlHTTPHandler = function (req, res) {
       return graphqlExpress({
         schema: options.graphqlSchema,
         context: {
           user: req.user,
           authorization: req.headers.authorization,
           logger: req.context.logger
         }
       })
     }
     let graphqlHandler = graphqlHTTPHandler(req, res)
     await graphqlHandler(req, res, next)
     next()
  }

  middleware.options = options
  return middleware
}
