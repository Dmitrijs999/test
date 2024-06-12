export const displayTruncated = (
  str: string,
  beginLength: number,
  endLength: number
): string =>
  `${str.substring(0, beginLength)}...${str.substring(
    str.length - endLength,
    str.length
  )}`;

/**
 * Formats a number based on whether it has a mantissa.
 *
 * @param {number} number - The number to be formatted.
 * @param {number} maxMantissaToShow  - The max digits to show. Default value is 3.
 * @returns {string} The formatted number. If the number has a mantissa,
 * it shows the mantissa or a maximum of `maxMantissaToShow` digits after the decimal point.
 * If there is no mantissa, it formats the number without adding zeros.
 */
export function formatNumberWithMantissa(
  number: number,
  maxMantissaToShow = 3
): string {
  const hasMantissa = number % 1 !== 0;

  const minValueToShow = 1 / Math.pow(10, maxMantissaToShow);
  if (number < minValueToShow) return `0`;
  if (hasMantissa) {
    // If there is a mantissa, show it or a maximum of `maxMantissaToShow` digits
    const mantissa = number
      .toString()
      .split('.')[1]
      .slice(0, maxMantissaToShow);
    return `${number.toFixed(mantissa.length > 0 ? mantissa.length : 0)}`;
  } else {
    // If there is no mantissa, don't add zeros
    return `${number.toFixed(0)}`;
  }
}
