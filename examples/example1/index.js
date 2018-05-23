const express = require('express')
const router = express.Router()
const correlationId = require('../../packages/express-http-context-correlation-id')
const PORT = process.env.PORT || 4000

router.get('/', (req, res, next) => {
  res.status(200).send(req.context)
})

const server = express()

server
  .use(correlationId)
  .use('/', router)

server.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
