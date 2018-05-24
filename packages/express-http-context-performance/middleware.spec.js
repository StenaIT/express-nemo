const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-http-context-performance', () => {
  context('valid configuration', () => {
    context('minimum configuration', () => {
      it('returns middleware with options exposed', () => {
        let mw = middleware()
        expect(mw.options).to.not.be.undefined
      })
    })
  })

  context('start', () => {
    context('middleware is called', () => {
      let nextCalled = false
      let SUT

      const next = () => {
        nextCalled = true
      }

      beforeEach(() => {
        nextCalled = false
        SUT = middleware().start
      })

      it('should always call next', () => {
        let req = { url: '/api/path' }
        let res = {}

        SUT(req, res, next)

        expect(nextCalled).to.be.true
      })

      it('should add performance tracking id to context', () => {
        let req = { url: '/api/path' }
        let res = {}

        SUT(req, res, next)

        expect(req.context.performance).to.not.be.an('undefined')
        expect(req.context.performance).to.not.be.null
        expect(req.context.performance.trackingId).to.not.be.an('undefined')
        expect(req.context.performance.trackingId).to.not.be.null
      })
    })
  })

  context('end', () => {
    context('middleware is called', () => {
      let nextCalled = false
      let start
      let SUT

      const next = () => {
        nextCalled = true
      }

      beforeEach(() => {
        nextCalled = false
        let mw = middleware()
        start = mw.start
        SUT = mw.end
      })

      it('should always call next', () => {
        let req = { url: '/api/path' }
        let res = {}
        start(req, res, next)

        SUT(req, res, next)

        expect(nextCalled).to.be.true
      })

      context('when tracking id is not set', () => {
        it('should not add performance timing to context', () => {
          let req = { url: '/api/path' }
          let res = {}

          SUT(req, res, next)

          expect(req.context).to.be.an('undefined')
        })
      })

      context('when tracking id is set', () => {
        it('should add performance timing to context', () => {
          let req = { url: '/api/path' }
          let res = {}
          start(req, res, next)

          SUT(req, res, next)

          expect(req.context.performance).to.not.be.an('undefined')
          expect(req.context.performance).to.not.be.null
          expect(req.context.performance.timing).to.not.be.an('undefined')
          expect(req.context.performance.timing).to.not.be.null
        })
      })
    })
  })
})
