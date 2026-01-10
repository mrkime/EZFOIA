/**
 * Production-safe logger that only outputs in development mode.
 * Prevents sensitive information from being exposed in browser console.
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) console.log(...args);
  },
  error: (...args: unknown[]) => {
    if (isDevelopment) console.error(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) console.warn(...args);
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) console.info(...args);
  },
};

/**
 * Returns a safe error message for display to users.
 * Shows detailed errors only in development mode.
 */
export const getSafeErrorMessage = (error: unknown, fallback = "An error occurred. Please try again."): string => {
  if (isDevelopment && error instanceof Error) {
    return error.message;
  }
  if (isDevelopment && typeof error === "string") {
    return error;
  }
  return fallback;
};
