/* global describe context it beforeEach  */

const expect = require('chai').expect
const middleware = require('./middleware')

function UnauthorizedError (code, error) {
  this.name = 'UnauthorizedError'
  this.message = error.message
  Error.call(this, error.message)
  Error.captureStackTrace(this, this.constructor)
  this.code = code
  this.status = 401
  this.inner = error
}

describe('express-nemo-auth0-jwt-verify', function() {
  context('invalid configuration', function() {
    context('when no jwt configuration is provided', function() {
      it('throws an error', function() {
        expect(() => middleware()).to.throw()
      })
    })
  })

  context('valid configuration', function() {
    context('minimum configuration', function() {
      it('returns middleware with options exposed', function() {
        const expectedOptions = {
          jwt: {
            secret: 'a secret',
            algorithms: ['HS256']
          }
        }
        let mw = middleware(expectedOptions)
        expect(mw.options).to.deep.equal(expectedOptions, `Not equal ${mw.options}` )
      })
    })
  })

  context('middleware is called', function() {
    let req
    let res
    let nextError
    let logMessages = []
    let infoMessages = []
    let SUT

    beforeEach(function() {
      req = {
        context: {
          logger: {
            debug: msg => {
              logMessages.push(msg)
            },
            info: msg => {
              infoMessages.push(msg)
            }
          }
        }
      }
      res = {
        statusCode: 200,
        status: code => {
          res.statusCode = code
          return res
        }
      }
      logMessages = []
      infoMessages = []

      SUT = middleware({
        jwt: {
          secret: 'a secret',
          algorithms: ['HS256']
        }
      })

      // Simulate an async operation with callback
      // see https://github.com/auth0/express-jwt/blob/master/lib/index.js#L90
      SUT.auth = (req, res, next) => {
        setTimeout(() => {
          next()
        }, 1)
      }
    })

    it('calls next', function(done) {
      const next = () => done()

      SUT(req, res, next)
    })

    it('logs messages', function(done) {
      const next = () => {
        expect(logMessages.length).to.be.above(1)
        done()
      }
      SUT(req, res, next)
    })

    context('without logger', function() {
      it('does not log any messages', function(done) {
        req = {}
        const next = () => {
          expect(logMessages.length).to.be.equal(0)
          done()
        }

        SUT(req, res, next)
      })
    })

    context('failed authentication', function() {
      beforeEach(() => {
        SUT.auth = (req, res, next) => {
          setTimeout(() => {
            next(new UnauthorizedError('errorCode', new Error('MyError')))
          }, 5)
        }
      })

      it('logs failed authenticaitons with info', function(done)  {
        const next = () => {
          expect(
            infoMessages.includes(
              '[auth0-jwt] Authentication failed! Reason: UnauthorizedError.'
            )
          ).to.equal(true)
          done()
        }

        SUT(req, res, next)
      })

      it('calls next with error', function(done) {
        const next = nextError => {
          expect(nextError.name).to.equal('UnauthorizedError')
          done()
        }

        SUT(req, res, next)
      })

      it('sets the HTTP status code to 401', function(done) {
        const next = () => {
          expect(res.statusCode).to.equal(401)
          done()
        }

        SUT(req, res, next)
      })
    })

    context('successful authentication', function() {
      beforeEach(() => {
        SUT.auth = (req, res, next) => {
          setTimeout(() => {
            next()
          }, 1)
        }
      })

      it('logs successful authenticaitons', function(done) {
        const next = () => {
          expect(
            logMessages.includes('[auth0-jwt] Successfully authenticated!')
          ).to.equal(true)
          done()
        }

        SUT(req, res, next)
      })

      it('calls next without error', function(done) {
        const next = () => {
          expect(nextError === undefined).to.equal(true)
          done()
        }

        SUT(req, res, next)
      })

      it('preserves the HTTP status code', function(done) {
        const next = () => {
          expect(res.statusCode).to.equal(200)
          done()
        }
        SUT(req, res, next)
      })
    })
  })
})
