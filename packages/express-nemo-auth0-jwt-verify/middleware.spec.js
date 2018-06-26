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

describe('express-nemo-auth0-jwt-verify', () => {
  context('invalid configuration', () => {
    context('when no jwt configuration is provided', () => {
      it('throws an error', () => {
        expect(() => middleware()).to.throw()
      })
    })
  })

  context('valid configuration', () => {
    context('minimum configuration', () => {
      it('returns middleware with options exposed', () => {
        const expectedOptions = {
          jwt: {
            secret: 'a secret'
          }
        }
        let mw = middleware(expectedOptions)
        expect(mw.options).to.deep.equal(expectedOptions)
      })
    })
  })

  context('middleware is called', () => {
    let req
    let res
    let nextError
    let logMessages = []
    let infoMessages = []
    let SUT

    beforeEach(() => {
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
          secret: 'a secret'
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

    it('calls next', done => {
      const next = () => done()

      SUT(req, res, next)
    })

    it('logs messages', done => {
      const next = () => {
        expect(logMessages.length).to.be.above(1)
        done()
      }
      SUT(req, res, next)
    })

    context('without logger', () => {
      it('does not log any messages', done => {
        req = {}
        const next = () => {
          expect(logMessages.length).to.be.equal(0)
          done()
        }

        SUT(req, res, next)
      })
    })

    context('failed authentication', () => {
      beforeEach(() => {
        SUT.auth = (req, res, next) => {
          setTimeout(() => {
            next(new UnauthorizedError('errorCode', new Error('MyError')))
          }, 5)
        }
      })

      it('logs failed authenticaitons with info', done => {
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

      it('calls next with error', done => {
        const next = nextError => {
          expect(nextError.name).to.equal('UnauthorizedError')
          done()
        }

        SUT(req, res, next)
      })

      it('sets the HTTP status code to 401', done => {
        const next = () => {
          expect(res.statusCode).to.equal(401)
          done()
        }

        SUT(req, res, next)
      })
    })

    context('successful authentication', () => {
      beforeEach(() => {
        SUT.auth = (req, res, next) => {
          setTimeout(() => {
            next()
          }, 1)
        }
      })

      it('logs successful authenticaitons', done => {
        const next = () => {
          expect(
            logMessages.includes('[auth0-jwt] Successfully authenticated!')
          ).to.equal(true)
          done()
        }

        SUT(req, res, next)
      })

      it('calls next without error', done => {
        const next = () => {
          expect(nextError === undefined).to.equal(true)
          done()
        }

        SUT(req, res, next)
      })

      it('preserves the HTTP status code', done => {
        const next = () => {
          expect(res.statusCode).to.equal(200)
          done()
        }
        SUT(req, res, next)
      })
    })
  })
})
