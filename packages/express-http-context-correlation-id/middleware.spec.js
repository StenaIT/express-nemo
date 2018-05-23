const expect = require('chai').expect
const middleware = require('./middleware')

const inner = (req, res) => {
  res.body = {}
  res.getHeader = name => {
    return 'application/json'
  }
}

describe('express-http-context-correlation-id', () => {
  let nextCalled = false

  const next = () => {
    nextCalled = true
  }

  beforeEach(() => {
    nextCalled = false
  })

  it('should always call next', () => {
    let req = { url: '/api/path' }
    let res = {}

    middleware(req, res, next)

    expect(nextCalled).to.be.true
  })

  context('when request does not contain a context property', () => {
    it('should not fail', () => {
      let req = { url: '/api/path' }
      let res = {}

      middleware(req, res, next)

      expect(req.context).to.not.be.an('undefined')
      expect(req.context).to.not.be.null
    })
  })

  context("when client don't supply a correlation id in request", () => {
    it('should generate a new correlation id', () => {
      let req = { url: '/api/path' }
      let res = {}

      middleware(req, res, next)

      expect(req.context.correlationId).to.not.be.an('undefined')
      expect(req.context.correlationId).to.not.be.null
    })
  })

  context('when client supply a correlation id in request', () => {
    it('should use correlation id from querystring', () => {
      const expected = 'AbC123'
      let req = {
        url: `/api/path?foo=bar&correlationId=${expected}`
      }
      let res = {}

      middleware(req, res, next)

      expect(req.context.correlationId).to.equal(expected)
    })
  })
})
