/**
 * Parses a string number to number type.
 * @param value - string or number value.
 * @returns the parsed number. It returns NaN if the string value is not a valid number.
 */
export const formatStringToNumber = (value: string | number): number => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  const newValue = value?.replace(/\./g, '')?.replace(',', '.');
  return parseFloat(newValue);
};

/**
 * Formats a number to a fixed number of decimals and returns it as a number.
 * @param number - The number to be formatted. It can be a string or a number.
 * @param decimals - The number of decimals to be returned. Default is 2.
 * @returns The formatted number.
 * @example parseFixed("1.2345"); // returns 1.23
 * @example parseFixed(1.2345); // returns 1.23
 * @example parseFixed("ab1.45"); // returns NaN
 */
export const parseFixed = (
  number: number | string,
  decimals: number = 2
): number => parseFloat(parseFloat(`${number}`).toFixed(decimals));

/**
 * Formats a number to a string with comma as decimal separator and dot as
 * thousand separator and to a fixed number of decimals.
 * @param number - The number to be formatted. It can be a string or a number.
 * @param decimals - The number of decimals to be returned. Default is 2.
 * @returns The formatted number.
 * @example formatNumberToLocal("1234.5678"); // returns "1.234,57"
 * @example formatNumberToLocal("abc"); // returns ""
 * @example formatNumberToLocal(null); // returns ""
 */
export const formatNumberToLocal = (
  number: number | string | null | undefined,
  decimals = 2
): string => {
  const truncateNumber = parseFixed(number ?? '');
  if (!truncateNumber && truncateNumber !== 0) return '';
  return truncateNumber.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};
