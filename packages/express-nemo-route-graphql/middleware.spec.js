/* global describe context it beforeEach afterEach */

const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
var expect = chai.expect
chai.use(sinonChai)
let sandbox = sinon.createSandbox()

let apolloCore = require('apollo-server-core')
let runHttpQueryStub = sinon.stub(apolloCore, 'runHttpQuery')

const middleware = require('./middleware')

const validConfig = {
  graphqlSchema: {
    typeDefs: `
      type Query {
        hello: String
      }
    `,
    resolvers: {
      Query: {
        hello: (root, args, context) => {
          return 'Hello world!'
        }
      }
    }
  }
}

describe('express-nemo-route-graphql', () => {
  let SUT

  afterEach(() => {
    sandbox.reset()
    runHttpQueryStub.reset()
  })

  context('configuration', () => {
    SUT = middleware

    context('valid minimum', () => {
      it('returns middleware with options exposed', async () => {
        let mw = await SUT(validConfig)
        expect(mw.options).to.not.be.an('undefined')
      })
    })

    context('invalid', () => {
      it('throws an error when no graphqlSchema', () => {
        expect(() => SUT()).to.throw()
      })
    })
  })

  context('middleware is called', async () => {
    let nextStub = sandbox.stub()
    let req = {
      url: '/api/graphql',
      headers: {
        authorization: 'LONG_ID'
      },
      context: {
        logger: {
          debug: msg => console.log(msg)
        }
      }
    }

    let res = {
      setHeader: h => {},
      write: msg => {},
      end: () => {}
    }

    beforeEach(async () => {
      SUT = await middleware(validConfig)
    })

    it('should call next once on success', async () => {
      runHttpQueryStub.resolves('')

      await SUT(req, res, nextStub)
      expect(runHttpQueryStub).to.have.callCount(1)
      expect(nextStub).to.have.callCount(1)
    })

    it('should call next once on failure', async () => {
      runHttpQueryStub.rejects('Error')

      await SUT(req, res, nextStub)
      expect(runHttpQueryStub).to.have.callCount(1)
      expect(nextStub).to.have.callCount(1)
    })
  })
})
