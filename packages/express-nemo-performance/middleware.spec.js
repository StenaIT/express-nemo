const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-performance', () => {
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
      let next

      beforeEach( function() {
        nextCalled = false
        SUT = middleware().start
      })

      it('should always call next', function(done) {
        let req = { url: '/api/path' }
        let res = {}
        next = () => {
          nextCalled = true
          done()
        }

        SUT(req, res, next)
        expect(nextCalled).to.be.true
      })

      it('should add performance tracking id to context', function(done) {
        let req = { url: '/api/path' }
        let res = {}
        next = () => {
          nextCalled = true
          done()
        }

        SUT(req, res, next)

        expect(req.context.performance).to.not.be.an('undefined')
        expect(req.context.performance).to.not.be.null
        expect(req.context.performance.trackingId).to.not.be.an('undefined')
        expect(req.context.performance.trackingId).to.not.be.null
      })
    })
  })

  context('end', function() {
    context('with no error', function() {
      context('middleware is called', function() {
        let endNextCalled = false
        let start
        let SUT

        beforeEach( function() {
          req = { url: '/api/path' }
          res = {}
          endNextCalled = false
          let mw = middleware()
          start = mw.start
          SUT = mw.end
          start(req, res)
        })

        it('should always call next', function(done) {
          const nextEnd = () => {
            endNextCalled = true
            done()
          }
          SUT(req, res, nextEnd)

          expect(endNextCalled).to.be.true
        })

        context('when tracking id is not set', function() {
          it('should not add performance timing to context', function(done) {
            const nextEnd = () => {
              done()
            }

            SUT(req, res, nextEnd)

            expect(req.context).to.be.an('undefined')
          })
        })

        context('when tracking id is set', function() {
          it('should add performance timing to context',function(done) {
            const nextEnd = () => {
              done()
            }
            SUT(req, res, nextEnd)

            expect(req.context.performance).to.not.be.an('undefined')
            expect(req.context.performance).to.not.be.null
            expect(req.context.performance.timing).to.not.be.an('undefined')
            expect(req.context.performance.timing).to.not.be.null
          })
        })
      })
    })

    context('with error', function() {
      context('middleware is called', function()  {
        let nextCalled = false
        let start
        let SUT

        beforeEach( function() {
          req = { url: '/api/path' }
          res = {}
          nextCalled = false
          endNextCalled = false
          let mw = middleware()
          start = mw.start
          SUT = mw.error
          start(req, res)
        })

        it('should always call next', function(done) {
          const nextError = () => {
            nextCalled = true
            done()
          }

          SUT({ err: true }, req, res, nextError)

          expect(nextCalled).to.be.true
        })

        context('when tracking id is not set', () => {
          it('should not add performance timing to context',  function(done) {
            const nextError = () => {
              done()
            }
             SUT({ err: true }, req, res, nextError)

            expect(req.context).to.be.an('undefined')
          })
        })

        context('when tracking id is set', () => {
          it('should add performance timing to context', function(done) {
            const nextError = () => {
              done()
            }

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
