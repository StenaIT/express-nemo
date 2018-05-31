# express-nemo

A collection of middlewares for express

## Packages

- [express-nemo-correlation-id](packages/express-nemo-correlation-id/)
- [express-nemo-error-logger](packages/express-nemo-error-logger/)
- [express-nemo-error-response](packages/express-nemo-error-response/)
- [express-nemo-logger](packages/express-nemo-logger/)
- [express-nemo-performance](packages/express-nemo-performance/)
- [express-nemo-request-response-logger](packages/express-nemo-request-response-logger/)
- [express-nemo-route-health](packages/express-nemo-route-health/)
- [express-nemo-route-not-found](packages/express-nemo-route-not-found/)
- [express-nemo-route-ping](packages/express-nemo-route-ping/)

## Sematic versioning

All packages are versioned using [semver](https://semver.org/). In essence, having installed version `1.0.0`, version `2.0.0` is to be considered breaking while `1.9.0` is not.

## Installation example

```bash
npm install --save express-nemo-correlation-id
```

## Usage example

```js
const express = require('express')
const router = express.Router()
const middleware = require('express-nemo-correlation-id')

router.use(middleware)
```

### Configuration

Some middlewares are configurable (see each package for configuration options).
