# express-nemo-error-logger

A middleware for express to add error logger

## Options

| Name          | Required | Default value | Description                                                                                              |
| ------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------- |
| createLogger  |          | func          | A function receiving the error and request object, returning a logger used to log errors.                |
| eventTemplate |          | func          | A function receiving the error and request object, returning a log event to be passed off to the logger. |
| excludeErrors |          | []            | An array of error names that should not be logged.                                                       |
