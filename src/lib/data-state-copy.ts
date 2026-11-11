/**
 * §0.4 — the states every screen with data has to carry, whether or not a
 * frame draws them. The wording sits here so the twenty states read the same
 * on every list in the portal.
 */

export const dataStateCopy = {
  en: {
    /* UI 03.0B — the filter matched nothing. */
    nothingMatches: "Nothing matches",
    nothingMatchesBody:
      "No row matches these filters. Clear them to see everything again.",
    clearFilters: "Clear filters",
    /* Nothing loaded. The page itself stays up. */
    loadFailed: "This did not load",
    loadFailedBody:
      "Only this part failed - the rest of the page is fine. Try again, and tell us if it keeps happening.",
    tryAgain: "Try again",
    /* A filter or a page is being fetched over rows that are already drawn. */
    updating: "Updating",
    /* Pagination — the filter and the page live in the address. */
    showing: "Showing {from}-{to} of {total}",
    pageOf: "Page {page} of {pages}",
    previous: "Previous",
    next: "Next",
    /* BR-00-22 - an arrow that cannot be pressed says why. */
    firstPage: "You are on the first page.",
    lastPage: "You are on the last page.",
    perPage: "{count} per page",
    /* Export — a long list arrives by email instead of downloading. */
    exportReady: "Exported {count} rows with your current filters.",
    exportByEmail:
      "{count} rows is too many to download here. We are emailing the file to {email}.",
  },
  ar: {
    nothingMatches: "لا شيء يطابق",
    nothingMatchesBody:
      "لا يطابق أي صف هذه المرشّحات. امسحها لترى كل شيء مرة أخرى.",
    clearFilters: "مسح المرشّحات",
    loadFailed: "تعذّر تحميل هذا الجزء",
    loadFailedBody:
      "هذا الجزء وحده هو الذي فشل — وبقيّة الصفحة سليمة. حاول مرة أخرى، وأخبرنا إن تكرّر الأمر.",
    tryAgain: "حاول مرة أخرى",
    updating: "جارٍ التحديث",
    showing: "عرض {from}-{to} من {total}",
    pageOf: "صفحة {page} من {pages}",
    previous: "السابق",
    next: "التالي",
    firstPage: "أنت في الصفحة الأولى.",
    lastPage: "أنت في الصفحة الأخيرة.",
    perPage: "{count} في الصفحة",
    exportReady: "صُدِّر {count} صفًا بالمرشّحات الحالية.",
    exportByEmail:
      "{count} صفًا أكثر من أن تُنزَّل هنا. نرسل الملف إلى {email} بالبريد.",
  },
} as const;

/** §0.4 — the threshold above which an export is emailed, not downloaded. */
export const EXPORT_EMAIL_ROWS = 5000;
