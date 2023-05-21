import config from 'config';
import expressWinston from 'express-winston';
import winston from 'winston';
const { createLogger, format, transports } = winston;

const enviroment = config.get<string>('nodeEnv');
const { logLevel } =
  enviroment === 'development'
    ? config.get<{ logLevel: string }>(`development`)
    : config.get<{ logLevel: string }>(`production`);

const { printf } = format;

const customFormat = printf(({ level, message, timestamp, label, stack }) => {
  return `[${label}]- ${timestamp} ${level}: ${stack || message}`;
});

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = createLogger({
      level: logLevel,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
    });

    if (enviroment !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.label({ label: 'Nodejs_with_type_orm' }),
            customFormat
          ),
        })
      );
    }
  }

  get log() {
    return this.logger;
  }

  public getRequestLogger() {
    return expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        format.simple()
      ),
      meta: process.env.ENV !== 'production', // optional: control whether you want to log the meta data about the request (default to true)
      msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute(req, res) {
        return false;
      }, // optional: allows to skip some log messages based on request and/or response
    });
  }

  public getRequestErrorLogger() {
    return expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        format.simple()
      ),
    });
  }
}
export { Logger };
