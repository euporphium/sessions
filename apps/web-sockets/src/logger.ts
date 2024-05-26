import winston, { format } from 'winston';
import env from '../env';

export type Logger = Pick<
  winston.Logger,
  'error' | 'warn' | 'info' | 'verbose' | 'debug'
>;

let singletonLogger: Logger | null = null;

export function getLogger() {
  if (!singletonLogger) {
    const { combine, timestamp, colorize, align, printf } = format;

    const logger = winston.createLogger({
      level: env.LOG_LEVEL,
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      ),
      // TODO Use a file transport in production
      transports: [new winston.transports.Console()],
    });

    logger.info('logger initialized');

    singletonLogger = {
      error: (args: any) => logger.error(args),
      warn: (args: any) => logger.warn(args),
      info: (args: any) => logger.info(args),
      verbose: (args: any) => logger.verbose(args),
      debug: (args: any) => logger.debug(args),
    };
  }

  return singletonLogger;
}
