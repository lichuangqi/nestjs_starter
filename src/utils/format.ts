/**
 * Converts a value to a boolean.
 * - "true", "yes", "1" are converted to true (case insensitive).
 * - "false", "no", "0" are converted to false (case insensitive).
 * - True boolean `true` returns true, `false` returns false.
 * - `null` and `undefined` return false.
 * - All other inputs return false.
 *
 * @param value - The value to be converted.
 * @returns The boolean result of the conversion.
 */
export function toBoolean(value: unknown): boolean {
  if (typeof value === 'string') {
    const cleanedValue = value.toLowerCase().trim();
    return ['true', 'yes', '1'].includes(cleanedValue);
  } else if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'number') {
    return value !== 0;
  }
  return false;
}
