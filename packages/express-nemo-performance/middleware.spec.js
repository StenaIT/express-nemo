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
    context('with no error', () => {
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
          SUT = mw.end[1] // handler with req as first arg
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

    context('with error', () => {
      context('middleware is called', () => {
        let nextCalled = false
        let start
        let SUT

        const next = err => {
          nextCalled = !!err
        }

        beforeEach(() => {
          nextCalled = false
          let mw = middleware()
          start = mw.start
          SUT = mw.end[0] // handler with err as first arg
        })

        it('should always call next', () => {
          let req = { url: '/api/path' }
          let res = {}
          start(req, res, next)

          SUT({ err: true }, req, res, next)

          expect(nextCalled).to.be.true
        })

        context('when tracking id is not set', () => {
          it('should not add performance timing to context', () => {
            let req = { url: '/api/path' }
            let res = {}

            SUT({ err: true }, req, res, next)

            expect(req.context).to.be.an('undefined')
          })
        })

        context('when tracking id is set', () => {
          it('should add performance timing to context', () => {
            let req = { url: '/api/path' }
            let res = {}
            start(req, res, next)

            SUT({ err: true }, req, res, next)

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
