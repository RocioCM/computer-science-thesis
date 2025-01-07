/** Joins multiple classNames in one string. */
const cn = (...args: Array<string | boolean | null | undefined>): string =>
  args.filter((arg) => typeof arg === 'string' && arg !== '').join(' ');

export default cn;
