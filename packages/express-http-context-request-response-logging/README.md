# express-http-context-request-response-logging

A middleware for express, adding request and response logging

## Options

| Name               | Required | Default value | Description                                                                                                             |
| ------------------ | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| logEventFactory    |          | func          | A function receiving the request and response object, returning a log event to be passed off to the logger.             |
| loggerFunctionName |          | debug         | The name of the function to be called on the logger. Can be used to change the level a request/response is logged with. |
