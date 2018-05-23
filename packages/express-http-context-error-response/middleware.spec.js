const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-http-context-error-response', () => {
  let nextCalled = false
  let sendCalled = false
  let sendCalledWithCode = null
  let err = new Error('Test error')
  let req = { url: '/api/path' }
  let  = []
  let res = {
    status: code => {
      sendCalledWithCode = code
      return {
        send: m => {
          sendCalled = true
          messages.push(m)
        }
      }
    }
  }

  const testOptions = {
    errorMessageTemplate: (err, statusCode, req) => 'test'
  }

  const next = () => {
    nextCalled = true
  }

  beforeEach(() => {
    nextCalled = false
    sendCalled = false
    messages = []
  })

  context('should be a configurable middleware', () => {
    it('should store middleware options for us to inspect', () => {
      let mw = middleware({})
      expect(mw.options).to.not.be.undefined
    })
    context('defaults', () => {
      it('default message template if no one is specified', () => {
        let mw = middleware({})
        expect(mw.options.errorMessageTemplate).to.be.a('function')
      })
    })

    context('overrides', () => {
      it('override message template with our own', () => {
        let mw = middleware(testOptions)
        expect(mw.options.errorMessageTemplate).to.be.equal(testOptions.errorMessageTemplate)
      })
    })
  })

  it('should always call next', () => {
    let mw = middleware({})
    mw(err, req, res, next)

    expect(nextCalled).to.be.true
  })

  it('should send a response', () => {
    let mw = middleware(testOptions)
    mw(err, req, res, next)

    expect(messages.length).to.be.equal(1)
    expect(messages[0]).to.be.equal('test')
  })

  it('should always call with HTTP 500', () => {
    let mw = middleware({})
    mw(err, req, res, next)

    expect(sendCalledWithCode).to.be.equal(500)
  })
})
