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

export type ExportFormat = "csv" | "xlsx" | "pdf";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

const printable = (
  title: string,
  head: readonly string[],
  groups: ReturnType<typeof groupsOf>,
  rtl: boolean,
) =>
  `<!doctype html><html lang="${rtl ? "ar" : "en"}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${escapeHtml(
    title,
  )}</title><style>body{font-family:system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;margin:24px;color:#111}h1{font-size:16px;margin:0 0 12px}h2{font-size:13px;margin:18px 0 6px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #ccc;padding:4px 6px;text-align:start}th{background:#f2f2f2}tr{break-inside:avoid}@page{size:landscape;margin:12mm}</style></head><body><h1>${escapeHtml(
    title,
  )}</h1>${groups
    .map(
      (group) =>
        `${group.name ? `<h2>${escapeHtml(group.name)}</h2>` : ""}<table><thead><tr>${head
          .map((cell) => `<th>${escapeHtml(cell)}</th>`)
          .join("")}</tr></thead><tbody>${group.rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join("")}</tr>`,
          )
          .join("")}</tbody></table>`,
    )
    .join("")}</body></html>`;

export function exportRows({
  head,
  rows,
  filename,
  lang,
  email,
  format = "csv",
  groupBy,
  title,
}: {
  head: readonly string[];
  /** Already filtered: what the screen is showing, and nothing else. */
  rows: readonly (readonly string[])[];
  filename: string;
  lang: string;
  /** Where a long export is sent. */
  email: string;
  format?: ExportFormat;
  /** A column that splits the rows into one sheet (xlsx) or one table (pdf) each. */
  groupBy?: number;
  title?: string;
}) {
  const c = dataStateCopy[lang === "ar" ? "ar" : "en"];
  const count = rows.length.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  const rtl = lang === "ar";

  if (rows.length > EXPORT_EMAIL_ROWS) {
    notify.success(fill(c.exportByEmail, { count, email }));
    return;
  }

  const base = filename.replace(/\.(csv|xlsx|pdf)$/i, "");
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
  } else if (format === "pdf") {
    const view = window.open("", "_blank");
    if (!view) {
      notify.error(c.exportBlocked);
      return;
    }
    view.document.write(printable(title ?? base, head, groupsOf(rows, groupBy), rtl));
    view.document.close();
    view.focus();
    view.setTimeout(() => view.print(), 300);
  } else {
    download(
      new Blob(["\uFEFF", csv([head, ...rows])], { type: "text/csv;charset=utf-8" }),
      `${base}.csv`,
    );
  }
  notify.success(fill(c.exportReady, { count }));
}
