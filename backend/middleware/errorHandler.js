import CustomAPIError from '../error/index.js';

export const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong, please try again';

  // If the error is a custom API error, use the custom status code and message
  if (err instanceof CustomAPIError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Send JSON error response
  res.status(statusCode).json({ message });
};
