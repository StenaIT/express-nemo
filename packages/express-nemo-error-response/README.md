# express-nemo-error-response

A middleware for express to add error response

## Options

| Name                 | Required | Default value | Description                                                                                                                      |
| -------------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| errorMessageTemplate |          | func          | A function receiving the error, request and response object, returning a error response message to be sent as the response body. |
