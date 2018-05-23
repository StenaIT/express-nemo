# express-http-context-logger

A middleware for express, extending requests with a logger instance of your choice

## Options

| Name          | Description                                                                       | Default value |
| ------------- | --------------------------------------------------------------------------------- | ------------- |
| loggerFactory | A function receiving the request and response object, returning a logger instance | null          |
