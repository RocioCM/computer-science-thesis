/* eslint-disable no-console */
import { isProduction } from './env';

/**
 * A simple wrapper around `console.log` that adds some color and a prefix to the log message.
 * It also has a `debug` method that only logs in development mode.
 */
const logger = {
  info: (...text: any) => console.log('\x1b[36m[INFO]', ...text, '\x1b[0m'), // Cyan
  warn: (...text: any) => console.log('\x1b[33m[WARN]', ...text, '\x1b[0m'), // Yellow
  error: (...text: any) => console.error('\x1b[31m[ERROR]', ...text, '\x1b[0m'), // Red
  success: (...text: any) =>
    console.log('\x1b[32m[SUCCESS]', ...text, '\x1b[0m'), // Green
  debug: (...text: any) =>
    !isProduction() && console.log('\x1b[35m[DEBUG]', ...text, '\x1b[0m'), // Magenta
};

export default logger;
