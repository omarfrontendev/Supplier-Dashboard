export interface PdfGroup {
  name: string;
  rows: readonly (readonly string[])[];
}

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const MARGIN = 28;
const SCALE = 2;
const FONT = '"Segoe UI", system-ui, -apple-system, Tahoma, Arial, sans-serif';
const CELL_SIZE = 7.5;
const ROW_HEIGHT = 15;
const PADDING = 4;

interface Page {
  title: string;
  group: string;
  rows: readonly (readonly string[])[];
}

const paginate = (title: string, groups: PdfGroup[]) => {
  const usable = PAGE_HEIGHT - MARGIN * 2 - 44 - 18;
  const perPage = Math.max(1, Math.floor(usable / ROW_HEIGHT) - 1);
  const pages: Page[] = [];
  for (const group of groups) {
    if (group.rows.length === 0) pages.push({ title, group: group.name, rows: [] });
    for (let start = 0; start < group.rows.length; start += perPage) {
      pages.push({ title, group: group.name, rows: group.rows.slice(start, start + perPage) });
    }
  }
  return pages.length ? pages : [{ title, group: "", rows: [] }];
};

const fit = (ctx: CanvasRenderingContext2D, text: string, width: number) => {
  if (ctx.measureText(text).width <= width) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > width) cut = cut.slice(0, -1);
  return `${cut}…`;
};

const columnWidths = (
  ctx: CanvasRenderingContext2D,
  head: readonly string[],
  groups: PdfGroup[],
) => {
  ctx.font = `600 ${CELL_SIZE}px ${FONT}`;
  const widths = head.map((cell) => ctx.measureText(cell).width);
  ctx.font = `${CELL_SIZE}px ${FONT}`;
  for (const group of groups) {
    for (const row of group.rows) {
      row.forEach((cell, index) => {
        widths[index] = Math.max(widths[index] ?? 0, ctx.measureText(String(cell)).width);
      });
    }
  }
  const padded = widths.map((width) => Math.min(width, 160) + PADDING * 2);
  const total = padded.reduce((sum, width) => sum + width, 0);
  const available = PAGE_WIDTH - MARGIN * 2;
  return padded.map((width) => (width * available) / total);
};

const drawPage = (
  page: Page,
  head: readonly string[],
  widths: number[],
  index: number,
  count: number,
  rtl: boolean,
) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PAGE_WIDTH * SCALE);
  canvas.height = Math.round(PAGE_HEIGHT * SCALE);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textBaseline = "middle";
  const startX = rtl ? PAGE_WIDTH - MARGIN : MARGIN;
  ctx.textAlign = rtl ? "right" : "left";

  ctx.fillStyle = "#111111";
  ctx.font = `600 12px ${FONT}`;
  ctx.fillText(fit(ctx, page.title, PAGE_WIDTH - MARGIN * 2), startX, MARGIN + 6);
  if (page.group) {
    ctx.font = `600 10px ${FONT}`;
    ctx.fillText(fit(ctx, page.group, PAGE_WIDTH - MARGIN * 2), startX, MARGIN + 26);
  }

  const top = MARGIN + 44;
  const rows = [head, ...page.rows];
  rows.forEach((row, r) => {
    const y = top + r * ROW_HEIGHT;
    if (r === 0) {
      ctx.fillStyle = "#f2f2f2";
      ctx.fillRect(MARGIN, y, PAGE_WIDTH - MARGIN * 2, ROW_HEIGHT);
    }
    let x = rtl ? PAGE_WIDTH - MARGIN : MARGIN;
    row.forEach((cell, c) => {
      const width = widths[c] ?? 0;
      const left = rtl ? x - width : x;
      ctx.strokeStyle = "#cccccc";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(left, y, width, ROW_HEIGHT);
      ctx.fillStyle = "#111111";
      ctx.font = `${r === 0 ? "600 " : ""}${CELL_SIZE}px ${FONT}`;
      ctx.fillText(
        fit(ctx, String(cell), width - PADDING * 2),
        rtl ? left + width - PADDING : left + PADDING,
        y + ROW_HEIGHT / 2,
      );
      x = rtl ? x - width : x + width;
    });
  });

  ctx.fillStyle = "#666666";
  ctx.font = `7px ${FONT}`;
  ctx.direction = "ltr";
  ctx.textAlign = rtl ? "left" : "right";
  ctx.fillText(`${index + 1} / ${count}`, rtl ? MARGIN : PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 14);

  const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { bytes, width: canvas.width, height: canvas.height };
};

const encoder = new TextEncoder();

const assemble = (images: Array<{ bytes: Uint8Array; width: number; height: number }>) => {
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (part: Uint8Array | string) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    parts.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, body: string) => {
    offsets[id] = length;
    push(`${id} 0 obj\n${body}\nendobj\n`);
  };

  push("%PDF-1.4\n%âãÏÓ\n");
  const pageIds = images.map((_, i) => 3 + i * 3);
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(
    2,
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${images.length} >>`,
  );
  images.forEach((image, i) => {
    const pageId = pageIds[i]!;
    const contentId = pageId + 1;
    const imageId = pageId + 2;
    object(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /XObject << /Im${i} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    const content = `q ${PAGE_WIDTH} 0 0 ${PAGE_HEIGHT} 0 0 cm /Im${i} Do Q`;
    object(contentId, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    offsets[imageId] = length;
    push(
      `${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n`,
    );
    push(image.bytes);
    push("\nendstream\nendobj\n");
  });

  const size = 3 + images.length * 3;
  const xref = length;
  let table = `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (let id = 1; id < size; id += 1) {
    table += `${String(offsets[id] ?? 0).padStart(10, "0")} 00000 n \n`;
  }
  push(`${table}trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts as BlobPart[], { type: "application/pdf" });
};

export function pdfBlob(title: string, head: readonly string[], groups: PdfGroup[], rtl: boolean) {
  const measure = document.createElement("canvas").getContext("2d")!;
  const widths = columnWidths(measure, head, groups);
  const pages = paginate(title, groups);
  return assemble(pages.map((page, i) => drawPage(page, head, widths, i, pages.length, rtl)));
}
