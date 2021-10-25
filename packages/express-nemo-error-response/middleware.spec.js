/* global describe context it beforeEach */

const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-error-response', () => {
  let nextCalled = false
  let messages = []
  const err = new Error('Test error')
  const req = { url: '/api/path' }
  let res = {}

  const testOptions = {
    errorMessageTemplate: (_err, _req, _res) => 'test'
  }

  const next = () => {
    nextCalled = true
  }

  beforeEach(() => {
    nextCalled = false
    res = {
      statusCode: 200,
      status: code => {
        res.statusCode = code
      },
      send: m => {
        messages.push(m)
      }
    }
    messages = []
  })

  context('should be a configurable middleware', () => {
    it('should store middleware options for us to inspect', () => {
      const mw = middleware()
      expect(mw.options).to.not.be.undefined
    })
    context('defaults', () => {
      it('default message template if no one is specified', () => {
        const mw = middleware({})
        expect(mw.options.errorMessageTemplate).to.be.a('function')
      })
    })

    context('overrides', () => {
      it('override message template with our own', () => {
        const mw = middleware(testOptions)
        expect(mw.options.errorMessageTemplate).to.be.equal(
          testOptions.errorMessageTemplate
        )
      })
    })

    context('invalid', () => {
      context('when no errorMessage template is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              errorMessageTemplate: null
            })
          ).to.throw()
        })
      })
    })
  })

  context(
    'when middleware is called with status code from range 100-399',
    () => {
      beforeEach(() => {
        const min = 100
        const max = 399
        res.statusCode = Math.floor(Math.random() * (max - min + 1)) + min
      })

      it('should always call next', () => {
        const mw = middleware()
        mw(err, req, res, next)

        expect(nextCalled).to.equal(true)
      })

      it('should send a response', () => {
        const mw = middleware(testOptions)
        mw(err, req, res, next)

        expect(messages.length).to.be.equal(1)
        expect(messages[0]).to.be.equal('test')
      })

      it('should set status code to 500', () => {
        const mw = middleware()
        mw(err, req, res, next)

        expect(res.statusCode).to.be.equal(500)
      })
    }
  )

  context(
    'when middleware is called with status code above or equal to 400',
    () => {
      let expectedStatusCode

      beforeEach(() => {
        const min = 400
        const max = 999
        expectedStatusCode = Math.floor(Math.random() * (max - min + 1)) + min
        res.statusCode = expectedStatusCode
      })

      it('should always call next', () => {
        const mw = middleware()
        mw(err, req, res, next)

        expect(nextCalled).to.equal(true)
      })

      it('should send a response', () => {
        const mw = middleware(testOptions)
        mw(err, req, res, next)

        expect(messages.length).to.be.equal(1)
        expect(messages[0]).to.be.equal('test')
      })

      it('preserve status code', () => {
        const mw = middleware()
        mw(err, req, res, next)

        expect(res.statusCode).to.be.equal(expectedStatusCode)
      })
    }
  )
})
