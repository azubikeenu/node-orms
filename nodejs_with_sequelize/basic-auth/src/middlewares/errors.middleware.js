import environment from '../config/env';

function errorsMiddleware(error, req, res, next) {
  const { status = 500, message, stack } = error;

  let errorMessage = { message };

  if (environment.nodeEnv === 'development') {
    errorMessage = { message, stack };
  }

  res.status(status).json({ success: false, error: errorMessage });
}

export default errorsMiddleware;
