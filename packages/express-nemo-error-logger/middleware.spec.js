/* global describe context it beforeEach */

const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-error-logger', () => {
  let nextCalled = false
  let err = new Error('Test error')
  let req = { url: '/api/path' }
  let res = {}
  let logs = []

  const next = err => {
    nextCalled = !!err
  }

  beforeEach(() => {
    nextCalled = false
    logs = []
  })

  const testOptions = {
    createLogger: () => {
      return {
        error: message => logs.push(message)
      }
    },
    eventTemplate: (err, req) => 'test',
    excludeErrors: ['UnauthorizedError']
  }

  context('should be a configurable middleware', () => {
    it('should store middleware options for us to inspect', () => {
      let mw = middleware({})
      expect(mw.options).to.not.be.undefined
    })
    context('defaults', () => {
      it('default logger (console) if no one is specified', () => {
        let mw = middleware({})
        expect(mw.options.createLogger).to.be.a('function')
      })

      it('default eventTemplate if no one is specified', () => {
        let mw = middleware({})
        expect(mw.options.eventTemplate).to.be.a('function')
      })
    })

    context('overrides', () => {
      it('override logger with our own', () => {
        let mw = middleware(testOptions)
        expect(mw.options.createLogger).to.be.equal(testOptions.createLogger)
      })

      it('override eventTemplate with our own', () => {
        let mw = middleware(testOptions)
        expect(mw.options.eventTemplate).to.be.equal(testOptions.eventTemplate)
      })
    })

    context('invalid', () => {
      context('when no createLogger is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              createLogger: null
            })
          ).to.throw()
        })
      })

      context('when no eventTemplate is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              eventTemplate: null
            })
          ).to.throw()
        })
      })

      context('when no excludeErrors is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              excludeErrors: null
            })
          ).to.throw(
            "[Options] Null on 'excludeErrors' property is not allowed"
          )
        })
      })
    })
  })

  it('should always call next', () => {
    let mw = middleware(testOptions)
    mw(err, req, res, next)

    expect(nextCalled).to.be.true
  })

  it('should log an error event', () => {
    let mw = middleware(testOptions)
    mw(err, req, res, next)

    expect(logs.length).to.be.equal(1)
    expect(logs[0]).to.be.equal('test')
  })

  it('should not log an error event', () => {
    let mw = middleware(testOptions)

    mw({ name: 'UnauthorizedError' }, req, res, next)

    expect(logs.length).to.be.equal(0)
  })
})
