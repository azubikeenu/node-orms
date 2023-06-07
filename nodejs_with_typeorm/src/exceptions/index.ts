class AppError extends Error {
  private statusCode: number;
  constructor(message: string, statusCode: number) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    // capture/preserve the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

const BadRequestException = class BadRequestException extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
};

const NotFoundException = class NotFoundException extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
};

const ServerException = class ServerException extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
};

const ConflictException = class ServerException extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
};

export {
  BadRequestException,
  NotFoundException,
  ServerException,
  ConflictException,
};
