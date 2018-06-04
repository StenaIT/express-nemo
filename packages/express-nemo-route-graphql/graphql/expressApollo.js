// Modiefied https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-express/src/expressApollo.ts#L44
// Added return promise from runHttpQuery, we could have just called next() see line 39.
// See also these topics on progress:
// https://github.com/apollographql/apollo-server/pull/945
// https://github.com/apollographql/apollo-server/issues/953

const {runHttpQuery} = require('apollo-server-core')

const graphqlExpress = function (options) {
  if (!options) {
    throw new Error('Apollo Server requires options.')
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error(
      `Apollo Server expects exactly one argument, got ${arguments.length}`
    )
  }

  const graphqlHandler = (
    req,
    res,
    next
  ) => {
    return runHttpQuery([req, res], {
      method: req.method,
      options: options,
      query: req.method === 'POST' ? req.body : req.query
    }).then(
      gqlResponse => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader(
          'Content-Length',
          Buffer.byteLength(gqlResponse, 'utf8').toString()
        )
        res.write(gqlResponse)
        res.end()
        // next()
      },
      (error) => {
        if (error.name !== 'HttpQueryError') {
          return next(error)
        }

        if (error.headers) {
          Object.keys(error.headers).forEach(header => {
            res.setHeader(header, error.headers[header])
          })
        }

        res.statusCode = error.statusCode
        res.write(error.message)
        res.end()
        next()
      }
    )
  }

  return graphqlHandler
}

module.exports = graphqlExpress
