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

## Middleware scripts

### Create

A script that generate the boiler plate for a new middleware.

```bash
./scripts/create-middleware express-nemo-[NAME]
```

### Init

After git clone you can run npm init on all of the middlewares.

```bash
./scripts/init
```

### Run test

This runs test on all of the middlewares.

```bash
./scripts/test
```

## Publish
- [Prereq](#prereq)
- [Update version](#update-version)
- [Git push](#git-push)
- [Publish](#publish-the-new-version)


### Prereq
- User must be in the collaborators for "stena-it" organization
- cd to the middleware you wish to publish

### Update version

Update x in version x.0.0 (eg. breaking change was made)
```bash
npm version major
```

Update y in version 1.y.0 (eg. a feature was added )
```bash
npm version minor

```
Update z in version 1.0.z (eg. a fix internally was applied that do not effect the interface)
```bash
npm version patch
```

### Git push

```bash
git add package.json
git commit -m "bump version to x.y.z"
git push
```

### Publish the new version

```bash
npm publish
```
