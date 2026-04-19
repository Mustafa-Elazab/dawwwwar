/** Normalise any Egyptian phone format to 01XXXXXXXXX */
export const normalizePhone = (raw: string): string =>
  raw
    .replace(/^\+20/, '0')
    .replace(/^20(?=1)/, '0')
    .replace(/\s|-/g, '');

/** Validate Egyptian mobile number */
export const isValidEgyptianPhone = (phone: string): boolean =>
  /^01[0125]\d{8}$/.test(normalizePhone(phone));

/**
 * Format for display: 0101 234 5678
 * Used inside the input as the user types — NOT for API calls.
 */
export const formatPhoneDisplay = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
};

/** Strip display formatting before sending to API */
export const stripPhoneFormatting = (display: string): string =>
  display.replace(/\s/g, '');
