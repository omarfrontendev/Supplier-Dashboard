/**
 * OV 08.21 / 08.21B / 08.25 — Flow 12 Row H. Creating and editing a role:
 * a name, what it starts from, and the things it is allowed to do.
 */
export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export interface PermissionGroup {
  title: Bi;
  items: Bi[];
}

/** The five groups REF 08.R lists, in the frame's own order. */
export const permissionGroups: PermissionGroup[] = [
  {
    title: t("HOTELS & CONTRACTS", "الفنادق والعقود"),
    items: [t("See hotels", "رؤية الفنادق"), t("See contracts", "رؤية العقود")],
  },
  {
    title: t("RATES & INVENTORY", "الأسعار والمخزون"),
    items: [
      t("See rates", "رؤية الأسعار"),
      t("Edit rates", "تعديل الأسعار"),
      t("Publish rates", "نشر الأسعار"),
      t("Edit inventory", "تعديل المخزون"),
      t("Stop sale", "إيقاف البيع"),
    ],
  },
  {
    title: t("BOOKINGS", "الحجوزات"),
    items: [
      t("See bookings", "رؤية الحجوزات"),
      t("Confirm bookings", "تأكيد الحجوزات"),
      t("Reject bookings", "رفض الحجوزات"),
      t("Handle cancellations", "معالجة الإلغاءات"),
      t("Answer amendments", "الرد على التعديلات"),
      t("See arrivals and guest details", "رؤية الوصول وبيانات الضيف"),
      t("See guest identity", "رؤية هوية الضيف"),
    ],
  },
  {
    title: t("FINANCE", "المالية"),
    items: [
      t("See finance", "رؤية المالية"),
      t("See booking money", "رؤية مبالغ الحجوزات"),
      t("Export finance", "تصدير المالية"),
      /* Row H · 26 Sep — these two are the Owner's alone. */
      t("Accept statements", "قبول كشوف الحساب"),
      t("Upload tax invoices", "رفع الفواتير الضريبية"),
    ],
  },
  {
    title: t("PEOPLE", "الأشخاص"),
    items: [
      t("See users", "رؤية المستخدمين"),
      t("Invite people", "دعوة أشخاص"),
      t("Change roles", "تغيير الأدوار"),
      t("Deactivate people", "تعطيل الأشخاص"),
    ],
  },
];

/** The two the frame marks as Owner only, so they read as such. */
export const ownerOnly: string[] = ["Accept statements", "Upload tax invoices"];

export const roleOverlay = {
  createOverline: t("TEAM & ACCESS", "الفريق والوصول"),
  createTitle: t("Create a role", "إنشاء دور"),
  editTitle: t("Edit a role", "تعديل دور"),
  nameLabel: t("ROLE NAME", "اسم الدور"),
  namePlaceholder: t("e.g. Weekend cover", "مثال: تغطية نهاية الأسبوع"),
  startLabel: t("START FROM", "ابدأ من"),
  startEmpty: t(
    "Nothing ticked · or copy a built-in role",
    "لا شيء محدد · أو انسخ دورًا جاهزًا"
  ),
  copyOf: t("Copy of {role}", "نسخة من {role}"),
  emptyNote: t(
    "Pick at least one thing this role can do. Create role stays off until you do.",
    "اختر شيئًا واحدًا على الأقل يستطيع هذا الدور فعله. ويبقى «إنشاء الدور» مغلقًا حتى تفعل."
  ),
  tickedNote: t(
    "{count} things ticked · {gaps}. Nobody has this role yet.",
    "{count} عناصر محددة · {gaps}. ولا أحد يحمل هذا الدور بعد."
  ),
  editNote: t(
    "{count} has this role - {who}. They get the change on their next page load.",
    "{count} يحمل هذا الدور - {who}. ويصله التغيير عند تحميل صفحته التالية."
  ),
  noRates: t("no rates", "بلا أسعار"),
  noMoney: t("no money", "بلا مال"),
  noPeople: t("no people", "بلا أشخاص"),
  onePerson: t("1 person", "شخص واحد"),
  cancel: t("Cancel", "إلغاء"),
  create: t("Create role", "إنشاء الدور"),
  save: t("Save changes", "حفظ التغييرات"),
  ownerOnlyNote: t("Owner only", "المالك فقط"),
} as const;
