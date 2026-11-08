import type { LifecycleDialog } from "@/lib/contract-lifecycle-data";
import type { ConfirmPanel } from "@/lib/contract-overlay-data";

const t = (en: string, ar: string) => ({ en, ar });

export const contractStatusNames = {
  draft: t("Draft", "مسودة"),
  scheduled: t("Scheduled", "مجدول"),
  active: t("Active", "نشط"),
  paused: t("Paused", "متوقف مؤقتًا"),
  expired: t("Expired", "منتهي"),
  terminated: t("Terminated", "تم إنهاؤه"),
} as const;

export const statusName = (status: unknown, k: "en" | "ar") =>
  contractStatusNames[status as keyof typeof contractStatusNames]?.[k] ?? String(status ?? "—");

const statusOverline = (name: string, status: string) => ({
  en: `${name.toUpperCase()} · ${statusName(status, "en").toUpperCase()}`,
  ar: `${name} · ${statusName(status, "ar")}`,
});

export const livePauseDialog = (name: string, status: string): LifecycleDialog => ({
  overline: statusOverline(name, status),
  title: t("Pause this contract?", "هل توقف هذا العقد مؤقتًا؟"),
  body: t(
    "Agents stop seeing it and new sales are blocked. You can resume it later.",
    "يتوقف ظهوره للوكلاء وتُمنع المبيعات الجديدة. ويمكنك استئنافه لاحقًا.",
  ),
  listLabel: t("WHAT PAUSE MEANS", "ماذا يعني الإيقاف المؤقت"),
  points: [
    t("Confirmed bookings stay exactly as booked.", "تبقى الحجوزات المؤكدة كما حُجزت."),
    t(
      "Published terms, stock and daily changes are kept.",
      "تبقى الشروط المنشورة والمخزون والتعديلات اليومية محفوظة.",
    ),
    t(
      "Different from Stop sale: a stopped contract stays visible; a paused one is hidden.",
      "ويختلف عن إيقاف البيع: فالعقد الموقوف بيعه يبقى ظاهرًا، والموقوف مؤقتًا يُخفى.",
    ),
  ],
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Pause contract", "إيقاف العقد مؤقتًا"),
  tone: "brand",
  confirmTone: "warning",
});

export const liveTerminateDialog = (name: string, status: string): LifecycleDialog => ({
  overline: statusOverline(name, status),
  title: t("Terminate this contract?", "هل تنهي هذا العقد؟"),
  body: t(
    "Irreversible. The contract can never be resumed or sold again.",
    "غير قابل للتراجع. ولا يمكن استئناف العقد أو البيع منه مرة أخرى.",
  ),
  points: [
    t("Confirmed bookings are still honoured.", "تبقى الحجوزات المؤكدة سارية."),
    t(
      "Rooms, seasons and rules stay readable for records; nothing can be sold.",
      "تبقى الغرف والمواسم والقواعد قابلة للقراءة للسجلات؛ ولا يمكن بيع شيء.",
    ),
  ],
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Terminate contract", "إنهاء العقد"),
  tone: "danger",
  confirmTone: "destructive",
});

export const liveResumePanel = (name: string): ConfirmPanel => ({
  overline: `PAUSED · ${name.toUpperCase()}`,
  overlineAr: `موقوف · ${name}`,
  title: `Resume “${name}”?`,
  titleAr: `هل تستأنف «${name}»؟`,
  body: "Its status returns to Scheduled, Active or Expired according to today's date. Daily changes and stop sales stay as they are.",
  bodyAr:
    "تعود حالته إلى مجدول أو نشط أو منتهٍ حسب تاريخ اليوم. وتبقى التعديلات اليومية وإيقاف البيع كما هي.",
  cancel: "Keep paused",
  cancelAr: "إبقاؤه موقوفًا",
  confirm: "Resume contract",
  confirmAr: "استئناف العقد",
  tone: "brand",
});

export const liveDeletePanel = (name: string): ConfirmPanel => ({
  overline: `DRAFT · ${name.toUpperCase()}`,
  overlineAr: `مسودة · ${name}`,
  title: `Delete the draft “${name}”?`,
  titleAr: `هل تحذف مسودة «${name}»؟`,
  body: "It was never published, so nothing changes for agents. The hotel and its rooms stay linked; only this draft is removed.",
  bodyAr:
    "لم تُنشر قط، فلا يتغيّر شيء للوكلاء. ويبقى الفندق وغرفه مرتبطين؛ وتُحذف هذه المسودة فقط.",
  points: [
    {
      text: "A deleted draft cannot be restored.",
      textAr: "لا يمكن استرجاع المسودة بعد حذفها.",
    },
    {
      text: "Its name stays reserved and cannot be used again for this hotel.",
      textAr: "يبقى اسمها محجوزًا ولا يمكن استخدامه مرة أخرى لهذا الفندق.",
    },
  ],
  cancel: "Keep draft",
  cancelAr: "الاحتفاظ بالمسودة",
  confirm: "Delete draft",
  confirmAr: "حذف المسودة",
  tone: "danger",
  confirmTone: "destructive",
});

export const contractActionCopy = {
  reason: t("Reason · optional", "السبب · اختياري"),
  paused: t("Contract paused", "تم إيقاف العقد مؤقتًا"),
  resumed: t("Contract resumed", "تم استئناف العقد"),
  terminated: t("Contract terminated", "تم إنهاء العقد"),
  deleted: t("Draft deleted", "تم حذف المسودة"),
  stale: t(
    "This contract changed. The list was reloaded - check it and try again.",
    "تغيّر هذا العقد. أُعيد تحميل القائمة - راجعه وحاول مرة أخرى.",
  ),
  failed: t("That didn't work. Try again.", "تعذّر ذلك. حاول مرة أخرى."),
  alreadyDeleted: t("This draft was already deleted.", "تم حذف هذه المسودة من قبل."),
  deleteUnknown: t(
    "We couldn't confirm the deletion. The list was reloaded - check it before trying again.",
    "تعذّر تأكيد الحذف. أُعيد تحميل القائمة - راجعها قبل المحاولة مرة أخرى.",
  ),
  cancel: t("Cancel", "إلغاء"),
};

export const copyPeriodCopy = {
  overline: t("COPY TO A NEW PERIOD", "نسخ لفترة جديدة"),
  title: t("Copy this contract to a new period", "نسخ هذا العقد لفترة جديدة"),
  body: t(
    "Creates a new draft with the same rooms, prices, seasons and rules. This contract does not change.",
    "ينشئ مسودة جديدة بنفس الغرف والأسعار والمواسم والقواعد. ولا يتغيّر هذا العقد.",
  ),
  period: t("New contract period", "فترة العقد الجديدة"),
  periodPlaceholder: t("Select the dates", "اختر التواريخ"),
  name: t("New contract name · optional", "اسم العقد الجديد · اختياري"),
  namePlaceholder: t("Left empty, we name it from the dates", "إذا تُرك فارغًا نسميه حسب التواريخ"),
  nameTaken: t(
    "A contract with this name already exists for this hotel.",
    "يوجد عقد بهذا الاسم لهذا الفندق.",
  ),
  periodRequired: t("Select the new period.", "اختر الفترة الجديدة."),
  conflicts: t(
    "This period overlaps another contract for the same hotel:",
    "تتداخل هذه الفترة مع عقد آخر لنفس الفندق:",
  ),
  confirm: t("Create draft", "إنشاء مسودة"),
  done: t("Draft created", "تم إنشاء المسودة"),
  skipped: t(
    "{count} restrictions were left out because they fall outside the new period.",
    "تم استبعاد {count} من القيود لأنها خارج الفترة الجديدة.",
  ),
};

export const stopSaleCopy = {
  overline: (name: string, status: string) => statusOverline(name, status),
  title: t("Stop sale on the whole contract?", "إيقاف البيع على العقد كله؟"),
  body: t(
    "Every room and meal offer stops selling on the chosen nights. The contract status does not change.",
    "تتوقف كل الغرف والوجبات عن البيع في الليالي المختارة. ولا تتغيّر حالة العقد.",
  ),
  period: t("Nights to stop", "الليالي المراد إيقافها"),
  listLabel: t("WHAT STOP SALE MEANS", "ماذا يعني إيقاف البيع"),
  points: [
    t("Confirmed bookings stay exactly as booked.", "تبقى الحجوزات المؤكدة كما حُجزت."),
    t(
      "Selected rooms and dates can be reopened later from the rates calendar.",
      "يمكن إعادة فتح غرف وتواريخ محددة لاحقًا من تقويم الأسعار.",
    ),
    t(
      "Pause is different: it hides the contract entirely.",
      "والإيقاف المؤقت مختلف: فهو يخفي العقد بالكامل.",
    ),
  ],
  preview: t("Preview", "معاينة"),
  summary: t("WHAT WILL CHANGE", "ما الذي سيتغيّر"),
  nights: t("Nights", "الليالي"),
  variations: t("Room types", "أنواع الغرف"),
  cells: t("Room nights and meals", "ليالي الغرف والوجبات"),
  replacedStop: t("Stop sales replaced", "إيقافات بيع مستبدلة"),
  replacedRequest: t("On Request replaced", "عند الطلب المستبدلة"),
  confirm: t("Stop sale", "إيقاف البيع"),
  done: t("Stop sale applied", "تم إيقاف البيع"),
  noNights: t("No nights left to stop on this contract.", "لا توجد ليالٍ متبقية لإيقافها في هذا العقد."),
};

export const activityCopy = {
  overline: t("CONTRACT ACTIVITY", "نشاط العقد"),
  title: t("Activity history", "سجل النشاط"),
  close: t("Close", "إغلاق"),
  empty: t("No activity on this contract yet.", "لا يوجد نشاط على هذا العقد بعد."),
  failed: t("We couldn't load the activity.", "تعذّر تحميل النشاط."),
  retry: t("Try again", "إعادة المحاولة"),
  system: t("System", "النظام"),
  reason: t("Reason", "السبب"),
  changed: t("Changed", "تم التغيير"),
  actions: {
    created: t("Contract created", "تم إنشاء العقد"),
    updated: t("Contract updated", "تم تعديل العقد"),
    copied_to_new_period: t("Copied to a new period", "تم النسخ لفترة جديدة"),
    created_by_copy: t("Created by copying", "تم إنشاؤه بالنسخ"),
    status_changed: t("Status changed", "تغيّرت الحالة"),
  },
  causes: {
    supplier_finalization: t("Activated by the supplier", "فعّله المورد"),
    supplier_pause: t("Paused by the supplier", "أوقفه المورد مؤقتًا"),
    supplier_resume: t("Resumed by the supplier", "استأنفه المورد"),
    supplier_terminate: t("Terminated by the supplier", "أنهاه المورد"),
    scheduled_lifecycle: t("Automatic date change", "تغيير تلقائي حسب التاريخ"),
    legacy_publication_reset: t("Publication reset", "إعادة ضبط النشر"),
  },
  fields: {
    status: t("Status", "الحالة"),
    period: t("Period", "الفترة"),
    name: t("Name", "الاسم"),
    startDate: t("Start date", "تاريخ البداية"),
    endDate: t("End date", "تاريخ النهاية"),
    currency: t("Currency", "العملة"),
    bookingType: t("Booking confirmation type", "نوع تأكيد الحجز"),
    onRequestSettings: t("On Request settings", "إعدادات عند الطلب"),
    pricing: t("Pricing", "الأسعار"),
    inventoryRules: t("Inventory rules", "قواعد المخزون"),
    childPricing: t("Child pricing", "أسعار الأطفال"),
    restrictions: t("Restrictions", "القيود"),
    seasons: t("Seasons", "المواسم"),
    cancellationPolicy: t("Cancellation policy", "سياسة الإلغاء"),
    releasePolicy: t("Release policy", "سياسة الإفراج"),
    bookingCutoff: t("Booking cut-off", "وقت إقفال الحجز"),
  },
};
