const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-performance', function () {
  context('valid configuration', () => {
    context('minimum configuration', () => {
      it('returns middleware with options exposed', () => {
        const mw = middleware()
        expect(mw.options).to.not.be.undefined
      })
    })
  })

  context('start', () => {
    context('middleware is called', () => {
      let nextCalled = false
      let SUT
      let next

      beforeEach(function () {
        nextCalled = false
        SUT = middleware().start
      })

      it('should always call next', function () {
        const req = { url: '/api/path' }
        const res = {}
        next = () => {
          nextCalled = true
        }

        SUT(req, res, next)

        expect(nextCalled).to.be.true
      })

      it('should add performance tracking id to context', function () {
        const req = { url: '/api/path' }
        const res = {}
        next = () => {
          nextCalled = true
        }

        SUT(req, res, next)

        expect(req.context.performance).to.not.be.an('undefined')
        expect(req.context.performance).to.not.be.null
        expect(req.context.performance.trackingId).to.not.be.an('undefined')
        expect(req.context.performance.trackingId).to.not.be.null
      })
    })
  })

  context('end', function () {
    context('with no error', function () {
      context('middleware is called', function () {
        let endNextCalled = false
        let start
        let SUT
        let req
        let res

        beforeEach(function () {
          req = { url: '/api/path' }
          res = {}
          endNextCalled = false
          const mw = middleware()
          start = mw.start
          SUT = mw.end
        })

        it('should always call next', function () {
          const nextEnd = () => {
            endNextCalled = true
          }

          start(req, res)
          SUT(req, res, nextEnd)

          expect(endNextCalled).to.be.true
        })

        context('when tracking id is not set', function () {
          it('should not add performance timing to context', function () {
            const nextEnd = () => {
            }

            SUT(req, res, nextEnd)
            expect(req.context).to.be.an('undefined')
          })
        })

        context('when tracking id is set', function () {
          it('should add performance timing to context', function () {
            const nextEnd = () => {
            }
            start(req, res)
            SUT(req, res, nextEnd)
            expect(req.context.performance).to.not.be.an('undefined')
            expect(req.context.performance).to.not.be.null
            expect(req.context.performance.timing).to.not.be.an('undefined')
            expect(req.context.performance.timing).to.not.be.null
            expect(req.context.performance.trackingId).to.be.null
          })
        })
      })
    })

    context('with error', function () {
      context('middleware is called', function () {
        let nextCalled = false
        let start
        let SUT
        let req
        let res

        beforeEach(function () {
          req = { url: '/api/path' }
          res = {}
          nextCalled = false
          const mw = middleware()
          SUT = mw.error
          start = mw.start
        })

        it('should always call next', function () {
          const nextError = () => {
            nextCalled = true
          }

          SUT({ err: true }, req, res, nextError)
          expect(nextCalled).to.be.true
        })

        it('should always call next with exception', function () {
          let currentError = {}
          const nextError = (e) => {
            currentError = e
          }

          const expected = { err: true }

          start(req, res)
          SUT(expected, req, res, nextError)
          expect(expected).to.be.equal(currentError)
        })

        context('when tracking id is not set', () => {
          it('should not add performance timing to context', function () {
            const nextError = () => {}
            // start(req, res)
            SUT({ err: true }, req, res, nextError)
            expect(req.context).to.be.an('undefined')
          })
        })

        context('when tracking id is set', () => {
          it('should add performance timing to context', function () {
            const nextError = () => {
            }

            start(req, res)
            SUT({ err: true }, req, res, nextError)
            expect(req.context.performance).to.not.be.an('undefined')
            expect(req.context.performance).to.not.be.null
            expect(req.context.performance.timing).to.not.be.an('undefined')
            expect(req.context.performance.timing).to.not.be.null
          })
        })
      })
    })
  })
})
