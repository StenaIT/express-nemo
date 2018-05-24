const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-correlation-id', () => {
  context('valid configuration', () => {
    context('minimum configuration', () => {
      it('returns middleware with options exposed', () => {
        let mw = middleware()
        expect(mw.options).to.not.be.undefined
      })
    })
  })

  context('middleware is called', () => {
    let nextCalled = false
    let SUT

    const next = () => {
      nextCalled = true
    }

    beforeEach(() => {
      nextCalled = false
      SUT = middleware()
    })

    it('should always call next', () => {
      let req = { url: '/api/path' }
      let res = {}

      SUT(req, res, next)

      expect(nextCalled).to.be.true
    })

    context('when request does not contain a context property', () => {
      it('should not fail', () => {
        let req = { url: '/api/path' }
        let res = {}

        SUT(req, res, next)

        expect(req.context).to.not.be.an('undefined')
        expect(req.context).to.not.be.null
      })
    })

    context("when client don't supply a correlation id in request", () => {
      it('should generate a new correlation id', () => {
        let req = { url: '/api/path' }
        let res = {}

        SUT(req, res, next)

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

        SUT(req, res, next)

        expect(req.context.correlationId).to.equal(expected)
      })
    })
  })
})
