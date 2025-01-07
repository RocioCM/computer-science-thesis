/* eslint-disable no-console */
import chalk from 'chalk';
import { isProduction } from './env';

/**
 * A simple wrapper around `console.log` that adds some color and a prefix to the log message.
 * It also has a `debug` method that only logs in development mode.
 */
const logger = {
  info: (...text: any) => console.log(chalk.cyan('[INFO]', ...text)),
  warn: (...text: any) => console.log(chalk.yellow('[WARN]', ...text)),
  error: (...text: any) => console.error(chalk.red('[ERROR]'), ...text),
  success: (...text: any) => console.log(chalk.green('[SUCCESS]', ...text)),
  debug: (...text: any) =>
    !isProduction() && console.log(chalk.magenta('[DEBUG]', ...text)),
};

export default logger;
