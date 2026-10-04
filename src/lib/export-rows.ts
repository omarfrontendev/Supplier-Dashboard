/**
 * §0.4 — "بيطلّع اللي ظاهر بالفلتر الحالي. لو أكتر من 5,000 صف، بيتبعت
 * بالإيميل": an export takes exactly the rows the current filter shows, and
 * a long one arrives by email instead of downloading.
 */

import { dataStateCopy, EXPORT_EMAIL_ROWS } from "./data-state-copy";
import { fill } from "./i18n";
import { notify } from "./notify";

function csv(rows: readonly (readonly string[])[]): string {
  return rows
    .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function exportRows({
  head,
  rows,
  filename,
  lang,
  email,
}: {
  head: readonly string[];
  /** Already filtered: what the screen is showing, and nothing else. */
  rows: readonly (readonly string[])[];
  filename: string;
  lang: string;
  /** Where a long export is sent. */
  email: string;
}) {
  const c = dataStateCopy[lang === "ar" ? "ar" : "en"];
  const count = rows.length.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  if (rows.length > EXPORT_EMAIL_ROWS) {
    notify.success(fill(c.exportByEmail, { count, email }));
    return;
  }

  const blob = new Blob([csv([head, ...rows])], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  notify.success(fill(c.exportReady, { count }));
}
