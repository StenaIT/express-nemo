const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-route-health', () => {
  const req = { url: '/api/path' }
  const res = { status: () => res, send: () => {} }
  let nextCalled = false

  const next = () => {
    nextCalled = true
  }

  beforeEach(() => {
    nextCalled = false
  })

  context('should be a configurable middleware', () => {
    it('should store middleware options for us to inspect', () => {
      const mw = middleware({ checks: [] })
      expect(mw.options).to.not.be.undefined
    })

    context('defaults', () => {
      it('default responseTemplate if not specified', () => {
        const mw = middleware({ checks: [] })
        expect(mw.options.responseTemplate).to.be.a('function')
      })
    })

    context('overrides', () => {
      const testOptions = {
        responseTemplate: (_results, _req, _res) => 'a response',
        checks: []
      }

      it('override responseTemplate with our own', () => {
        const mw = middleware(testOptions)
        expect(mw.options.responseTemplate).to.be.equal(
          testOptions.responseTemplate
        )
      })
    })

    context('invalid', () => {
      context('when checks is NOT provided', () => {
        it('throws an error', () => {
          expect(() => middleware()).to.throw()
        })
      })

      context('when no responseTemplate is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              checks: [],
              responseTemplate: null
            })
          ).to.throw()
        })
      })
    })
  })

  it('should always call next', () => {
    const testOptions = {
      checks: []
    }
    const mw = middleware(testOptions)
    mw(req, res, next)

    expect(nextCalled).to.be.true
  })
})
