/* global describe context it beforeEach */

const expect = require('chai').expect
const middleware = require('./middleware')

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
    let nextCalled
    let nextError
    let logMessages = []
    let SUT

    const next = err => {
      nextCalled = true
      nextError = err
    }

    beforeEach(() => {
      req = {
        context: {
          logger: {
            debug: msg => {
              logMessages.push(msg)
            }
          }
        }
      }
      res = {
        status: code => {
          return res
        }
      }
      nextCalled = false
      logMessages = []
      SUT = middleware({
        jwt: {
          secret: 'a secret'
        }
      })
    })

    it('calls next', () => {
      SUT(req, res, next)
      expect(nextCalled).to.equal(true)
    })

    it('logs messages', () => {
      SUT(req, res, next)
      expect(logMessages.length).to.be.above(1)
    })

    context('without logger', () => {
      it('does not log any messages', () => {
        req = {}
        SUT(req, res, next)
        expect(logMessages.length).to.be.equal(0)
      })
    })

    context('failed authentication', () => {
      it('logs failed authenticaitons', () => {
        SUT(req, res, next)
        expect(
          logMessages.includes(
            '[auth0-jwt] Authentication failed! Reason: UnauthorizedError.'
          )
        ).to.equal(true)
      })

      it('calls next with error', () => {
        SUT(req, res, next)
        expect(nextError.name).to.equal('UnauthorizedError')
      })
    })

    context('successful authentication', () => {
      beforeEach(() => {
        SUT.auth = (req, res, next) => {
          next()
        }
      })

      it('logs successful authenticaitons', () => {
        SUT(req, res, next)
        expect(
          logMessages.includes('[auth0-jwt] Successfully authenticated!')
        ).to.equal(true)
      })

      it('calls next without error', () => {
        SUT(req, res, next)
        expect(nextError === undefined).to.equal(true)
      })
    })
  })
})
