const expect = require('chai').expect
const middleware = require('./middleware')
const validConfig = {
  graphqlSchema: {'test'}
}

describe('express-nemo-route-graphql', () => {
  context('valid configuration', () => {
    context('minimum configuration', () => {
      it('returns middleware with options exposed', async () => {
        let mw = await middleware(validConfig)
        expect(mw.options).to.not.be.undefined
      })
    })
  })

  context('invalid configuration', () => {
    it('throws an error when no graphqlSchema', async () => {
       expect(() => await middleware()).to.throw()
    })
  })

  context('middleware is called', async () => {
    let nextCalled = false
    let SUT

    const next = () => {
      nextCalled = true
    }

    beforeEach(() => {
      nextCalled = false
      SUT = await middleware(validConfig)
    })

    it('should always call next', () => {
      let req = { url: '/api/path' }
      let res = {}

      SUT(req, res, next)

      expect(nextCalled).to.be.true
    })
  })
})
