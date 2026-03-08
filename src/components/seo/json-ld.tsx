/**
 * JSON-LD helpers for structured data.
 *
 * JSON.stringify() alone is NOT safe inside <script> tags because a value like
 *   "Some </script><script>evil()" would terminate the script block early.
 * We replace all `<` with the Unicode escape `\u003c` — JSON parsers still
 * read the value correctly but HTML parsers cannot break out of the script tag.
 */

/**
 * Serialise `data` to a JSON-LD string safe for injection into
 * <script type="application/ld+json"> blocks.
 *
 * Escapes `<` → `\u003c` to prevent `</script>` injection attacks.
 */
export function safeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
