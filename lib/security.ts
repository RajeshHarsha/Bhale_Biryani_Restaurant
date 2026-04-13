/**
 * Security utilities for input sanitization and validation.
 */

/**
 * Strips HTML tags and escapes dangerous characters to prevent XSS.
 * @param input The string to sanitize
 * @returns A safe, sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input) return "";
  
  return input
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/[&<>"']/g, (m) => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return map[m];
    })
    .trim();
}

/**
 * Recursively sanitizes all string properties in an object.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    if (typeof obj === "string") {
      return sanitizeString(obj) as any;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as any;
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeObject(value);
  }
  return result as T;
}
