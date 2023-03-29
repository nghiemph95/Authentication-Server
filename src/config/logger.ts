import winston from 'winston';

winston.addColors({
  info: 'green',
  warn: 'yellow',
  error: 'red',
});

const colorizer = winston.format.colorize();

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MM/YYYY, h:mm:ss A' }),
    winston.format.label({ label: '[Server]' }),
    winston.format.printf(({ level, message, timestamp, label }) =>
      colorizer.colorize(level, `${label} - [${timestamp}] - ${level.toUpperCase()}: ${message}`),
    ),
  ),
});

const logger = winston.createLogger({
  transports: [consoleTransport],
});

export default logger;
