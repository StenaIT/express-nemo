# express-nemo-route-not-found

A route middleware that handle unhandled routes and returns 404 when server has no handler for that request.

## Options

| Name                        | Required | Default value | Description                                                                       |
| --------------------------- | -------- | ------------- | --------------------------------------------------------------------------------- |
| notFoundResponseTemplate    |          | func          | A function receiving the request and response object, returning a client response. |
