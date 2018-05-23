# express-http-context

A collection of middlewares for express

## Packages

- [express-http-context-correlation-id](packages/express-http-context-correlation-id/)

## Sematic versioning

All packages are versioned using [semver](https://semver.org/). In essence, having installed version 1.0.0, version 2.0.0 is to be considered breaking while 1.9.0 is not.

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
