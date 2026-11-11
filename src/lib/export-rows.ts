/**
 * §0.4 — "بيطلّع اللي ظاهر بالفلتر الحالي. لو أكتر من 5,000 صف، بيتبعت
 * بالإيميل": an export takes exactly the rows the current filter shows, and
 * a long one arrives by email instead of downloading.
 */

import { dataStateCopy, EXPORT_EMAIL_ROWS } from "./data-state-copy";
import { fill } from "./i18n";
import { notify } from "./notify";
import { xlsxBlob } from "./xlsx-writer";

function csv(rows: readonly (readonly string[])[]): string {
  return rows
    .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export type ExportFormat = "csv" | "xlsx";

const download = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const groupsOf = (rows: readonly (readonly string[])[], column: number | undefined) => {
  if (column === undefined) return [{ name: "", rows }];
  const groups = new Map<string, (readonly string[])[]>();
  for (const row of rows) {
    const key = row[column] ?? "";
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return [...groups].map(([name, list]) => ({ name, rows: list }));
};

export function exportRows({
  head,
  rows,
  filename,
  lang,
  email,
  format = "csv",
  groupBy,
}: {
  head: readonly string[];
  /** Already filtered: what the screen is showing, and nothing else. */
  rows: readonly (readonly string[])[];
  filename: string;
  lang: string;
  /** Where a long export is sent. */
  email: string;
  format?: ExportFormat;
  /** A column that splits the rows into one sheet each (xlsx). */
  groupBy?: number;
}) {
  const c = dataStateCopy[lang === "ar" ? "ar" : "en"];
  const count = rows.length.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  const rtl = lang === "ar";

  if (rows.length > EXPORT_EMAIL_ROWS) {
    notify.success(fill(c.exportByEmail, { count, email }));
    return;
  }

  const base = filename.replace(/\.(csv|xlsx)$/i, "");
  if (format === "xlsx") {
    download(
      xlsxBlob(
        groupsOf(rows, groupBy).map((group) => ({
          name: group.name || base,
          rows: [head, ...group.rows],
        })),
        rtl,
      ),
      `${base}.xlsx`,
    );
  } else {
    download(
      new Blob(["\uFEFF", csv([head, ...rows])], { type: "text/csv;charset=utf-8" }),
      `${base}.csv`,
    );
  }
  notify.success(fill(c.exportReady, { count }));
}
