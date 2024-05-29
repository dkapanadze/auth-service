import { transports, format } from 'winston';

import * as winston from 'winston';

const { combine, timestamp, printf, simple, colorize } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const winstonConfig = {
  level: 'info',
  format: winston.format.json(),
  transports: [
    new transports.Console({
      format: combine(timestamp(), colorize(), simple(), myFormat),
    }),
    new transports.File({
      filename: 'combine.log',
      format: combine(timestamp(), simple(), myFormat),
    }),
  ],
};
