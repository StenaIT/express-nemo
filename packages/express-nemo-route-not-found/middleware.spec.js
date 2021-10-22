const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-route-not-found', () => {
  context('configuration', () => {
    context('invalid', () => {
      context('when no notFoundResponse template is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              notFoundResponseTemplate: null
            })
          ).to.throw()
        })
      })
    })

    context('valid', () => {
      context('minimum configuration', () => {
        it('returns middleware with options exposed', () => {
          const mw = middleware()
          expect(mw.options).to.not.be.undefined
        })
      })

      context('default notFoundResponseTemplate', () => {
        it('produces a string', () => {
          const responseTemplate = middleware().options.notFoundResponseTemplate
          const req = {
            method: 'GET',
            url: '/'
          }
          const res = {
            statusCode: 404
          }
          const clientResponse = responseTemplate(req, res)
          expect(clientResponse).to.equal(
            "Not Found '404' - No route matching path '/' was found"
          )
        })
      })
    })
  })

  context('middleware is called with 200 status code', () => {
    let nextCalled
    let sendCalled
    let SUT
    const req = {}
    let res = {}

    const next = () => {
      nextCalled = true
    }

    beforeEach(() => {
      nextCalled = false
      sendCalled = false
      res = {
        statusCode: 200,
        send: _data => {
          sendCalled = true
          return res
        },
        status: code => {
          res.statusCode = code
          return res
        }
      }
      SUT = middleware({
        notFoundResponseTemplate: () => {
          return {}
        }
      })
    })

    it('calls next', () => {
      SUT(req, res, next)
      expect(nextCalled).to.equal(true)
    })

    it('passes 404 as status code', () => {
      SUT(req, res, next)
      expect(res.statusCode).to.equal(404)
    })

    it('sends response to client', () => {
      SUT(req, res, next)
      expect(sendCalled).to.equal(true)
    })

    it('calls the template function with request and response', () => {
      let calledCorrectly
      const mw = middleware({
        notFoundResponseTemplate: (request, response) =>
          (calledCorrectly = request === req && response === res)
      })
      mw(req, res, next)
      expect(calledCorrectly).to.equal(true)
    })
  })

  context('middleware is called with non 200 status code', () => {
    let nextCalled
    let sendCalled
    let SUT
    const req = {}
    let res = {}

    const next = () => {
      nextCalled = true
    }

    beforeEach(() => {
      nextCalled = false
      sendCalled = false
      res = {
        statusCode: 401,
        send: _data => {
          sendCalled = true
          return res
        },
        status: code => {
          res.statusCode = code
          return res
        }
      }
      SUT = middleware({
        notFoundResponseTemplate: () => {
          return {}
        }
      })
    })

    it('calls next', () => {
      SUT(req, res, next)
      expect(nextCalled).to.equal(true)
    })

    it('preserves the status code', () => {
      SUT(req, res, next)
      expect(res.statusCode).to.equal(401)
    })

    it('does not try to send any response', () => {
      SUT(req, res, next)
      expect(sendCalled).to.equal(false)
    })
  })
})
