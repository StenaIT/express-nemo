/* global describe context it beforeEach */

const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-logger', () => {
  context('invalid configuration', () => {
    context('when no logger factory is provided', () => {
      it('throws an error', () => {
        expect(() => middleware()).to.throw()
      })
    })
  })

  context('valid configuration', () => {
    context('minimum configuration', () => {
      it('returns middleware with options exposed', () => {
        const mw = middleware({
          loggerFactory: () => console
        })
        expect(mw.options).to.not.be.undefined
      })
    })
  })

  context('middleware is called', () => {
    let nextCalled
    let SUT

    const next = () => {
      nextCalled = true
    }

    beforeEach(() => {
      nextCalled = false
      SUT = middleware({
        loggerFactory: () => console
      })
    })

    it('calls next', () => {
      const req = {}
      const res = {}
      SUT(req, res, next)
      expect(nextCalled).to.be.true
    })

    it('attaches a logger instance to the context object', () => {
      const req = {}
      const res = {}
      SUT(req, res, next)
      expect(req.context.logger).to.equal(console)
    })

    it('calls the logger factory with request and response', () => {
      const req = {}
      const res = {}
      let calledCorrectly

      const mw = middleware({
        loggerFactory: (request, response) =>
          (calledCorrectly = request === req && response === res)
      })
      mw(req, res, next)
      expect(calledCorrectly).to.be.true
    })
  })
})
