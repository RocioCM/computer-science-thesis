/* eslint-disable no-console */
import { isDevelopment } from '@/common/constants';

const DEBUG_ENABLED = isDevelopment && false;

/** A simple wrapper around `console.log` that only logs in development mode. */
const log = {
  error: (...text: any[]) => DEBUG_ENABLED && console.error(...text),
  debug: (...text: any[]) => DEBUG_ENABLED && console.log('[DEBUG]', ...text),
};

export default log;
