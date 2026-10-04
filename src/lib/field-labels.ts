import type { Dict } from "./dict";

/** Label for a company record field, in the active language. */
export function fieldLabel(c: Dict, id: string): string {
  const company = c.agreement.company as Record<string, string>;
  const supplier = c.agreement.supplier as Record<string, string>;
  return company[id] ?? supplier[id] ?? id;
}
