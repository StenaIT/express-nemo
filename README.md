# express-http-context

A collection of middlewares for express

## Packages

- [express-http-context-correlation-id](packages/express-http-context-correlation-id/)


## Installation example

```bash
npm install --save express-http-context-correlation-id
```

## Usage example

```js
const express = require('express')
const router = express.Router()
const middleware = require('express-http-context-correlation-id')

router.use(middleware)
```

### Configuration

Some middlewares are configurable (see each package for configuration options).
