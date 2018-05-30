const expect = require('chai').expect
const middleware = require('./middleware')

describe('express-nemo-error-response', () => {
  let nextCalled = false
  let sendCalled = false
  let sendCalledWithCode = null
  let err = new Error('Test error')
  let req = { url: '/api/path' }

  const MockRes = () => {
    return {
      statusCode: 200,
      status: code => {
        res.statusCode = code
      },
      send: m => {
        sendCalled = true
        messages.push(m)
      }
    }
  }

  let res = MockRes()

  const testOptions = {
    errorMessageTemplate: (err, req, res) => 'test'
  }

  const next = () => {
    nextCalled = true
  }

  beforeEach(() => {
    nextCalled = false
    sendCalled = false
    res = MockRes()
    messages = []
  })

  context('should be a configurable middleware', () => {
    it('should store middleware options for us to inspect', () => {
      let mw = middleware()
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
        expect(mw.options.errorMessageTemplate).to.be.equal(
          testOptions.errorMessageTemplate
        )
      })
    })

    context('invalid', () => {
      context('when no errorMessage template is provided', () => {
        it('throws an error', () => {
          expect(() =>
            middleware({
              errorMessageTemplate: null
            })
          ).to.throw()
        })
      })
    })
  })

  it('should always call next', () => {
    let mw = middleware()
    mw(err, req, res, next)

    expect(nextCalled).to.be.true
  })

  it('should send a response', () => {
    let mw = middleware(testOptions)
    mw(err, req, res, next)

    expect(messages.length).to.be.equal(1)
    expect(messages[0]).to.be.equal('test')
  })

  it('passes 404 as status code', () => {
    let mw = middleware()
    mw(err, req, res, next)

    expect(res.statusCode).to.be.equal(500)
  })
})
