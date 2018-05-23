const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-http-context-request-response-logging', () => {
  context('invalid configuration', () => {
    context('when no log event factory is provided', () => {
      it('throws an error', () => {
        expect(() =>
          middleware({
            logEventFactory: null
          })
        ).to.throw()
      })
    })

    context('when no logger function name is provided', () => {
      it('throws an error', () => {
        expect(() =>
          middleware({
            loggerFunctionName: null
          })
        ).to.throw()
      })
    })
  })

  context('valid configuration', () => {
    context('minimum configuration', () => {
      it('returns middleware with options exposed', () => {
        let mw = middleware()
        expect(mw.options).to.not.be.undefined
      })
    })
  })

  context('default log event factory', () => {
    it('produces a string log event', () => {
      const factory = middleware().options.logEventFactory
      const req = {
        method: 'GET',
        url: '/'
      }
      const res = {
        statusCode: 200
      }
      let logEvent = factory(req, res)
      expect(logEvent).to.equal('GET / - HTTP 200')
    })
  })

  context('middleware is called', () => {
    let nextCalled
    let callArgs
    let SUT
    let req = {
      context: {
        logger: {
          debug: (...args) => {
            callArgs = args
          }
        }
      }
    }
    let res = {}

    const next = () => {
      nextCalled = true
    }

    beforeEach(() => {
      nextCalled = false
      SUT = middleware({
        logEventFactory: () => {
          return {}
        }
      })
    })

    it('calls next', () => {
      SUT(req, res, next)
      expect(nextCalled).to.be.true
    })

    it('passes the log event to the context logger instance', () => {
      SUT(req, res, next)
      expect(callArgs.length).to.equal(1)
      expect(callArgs[0]).to.deep.equal({})
    })

    it('calls the log event factory with request and response', () => {
      let calledCorrectly

      mw = middleware({
        logEventFactory: (request, response) =>
          (calledCorrectly = request === req && response === res)
      })
      mw(req, res, next)
      expect(calledCorrectly).to.be.true
    })
  })
})
