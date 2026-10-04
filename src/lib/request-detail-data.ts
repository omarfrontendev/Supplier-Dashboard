/**
 * The request-detail drawers — Figma OV 02.5B / 5B2 / 5C / 5C2 / 5D /
 * 5E / 5F / 5F2. One 560 shell, whose middle changes with what the
 * request is and where it stands.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export interface TimelineStep {
  title: Bi;
  note: Bi;
  /** A step that is behind you, the one in hand, or still ahead. */
  state: "done" | "active" | "waiting";
  /**
   * What the step in hand is: a question waiting on you, or a refusal.
   * Without it an active step is just the next number, which says nothing
   * about whether anything went wrong.
   */
  kind?: "question" | "refused";
}

/** Shared across all eight frames. */
export const requestDetail = {
  sentBy: t("Sent by", "أرسله"),
  sentByValue: t("Abdullrahman Najeh", "عبدالرحمن ناجح"),
  assignedTo: t("Assigned to", "مُسندة إلى"),
  assignedToValue: t(
    "Sara Al-Otaibi · Hoteliana reviewer",
    "سارة العتيبي · مراجِعة هوتيليانا"
  ),
  timeline: t("Timeline", "المسار"),

  /** The three steps, named for what the request is. */
  stepSent: t("Request sent", "أُرسل الطلب"),
  stepReviewAccess: t("Hoteliana review", "مراجعة هوتيليانا"),
  stepReviewRoom: t("Hoteliana verifies the room", "هوتيليانا تتحقق من الغرفة"),
  stepReviewRoomDone: t(
    "Hoteliana verified the room",
    "تحقّقت هوتيليانا من الغرفة"
  ),
  stepDecision: t("Decision", "القرار"),
  inProgress: t("In progress", "قيد التنفيذ"),
  completeOn: t("Complete · {date}", "اكتملت · {date}"),

  /** The reply box the two correction frames carry. */
  replyTitle: t("Reply to Hoteliana", "الرد على هوتيليانا"),
  replyPlaceholder: t(
    "Write your answer here - it is added to the request timeline and Hoteliana is notified.",
    "اكتب ردّك هنا - يُضاف إلى مسار الطلب وتُخطَر هوتيليانا به."
  ),

  withdraw: t("Withdraw request", "سحب الطلب"),
  withdrawShort: t("Withdraw", "سحب"),
  openHotelProfile: t("Open hotel profile", "فتح ملف الفندق"),
  openInMyHotels: t("Open in My Hotels", "فتح في فنادقي"),
  openForm: t("Open the form to fix", "افتح النموذج للتصحيح"),
  editAgain: t("Edit the form again", "تعديل النموذج مرة أخرى"),
  resubmit: t("Resubmit", "إعادة الإرسال"),
  askHoteliana: t("Ask Hoteliana", "اسأل هوتيليانا"),
  backToLibrary: t("Back to library", "العودة إلى المكتبة"),
  done: t("Done", "تم"),
};

export interface DetailShape {
  /** OV 02.5F2 — the two details that went back, ticked. */
  changed?: Bi;
  /** The pill and the line beside it. */
  stateLabel: Bi;
  stateNote: Bi;
  tone: "warning" | "success" | "danger" | "neutral";
  timeline: TimelineStep[];
  listTitle: Bi;
  list: Bi[];
  /** What Hoteliana actually said, where it said anything. */
  quote?: Bi;
  /** OV 02.5F / 5F2 — what you changed, ready to go back. */
  fixed?: { title: Bi; body: Bi; link?: Bi };
  reply?: boolean;
  note?: Bi;
  actions: Bi[];
  /** The last action is the one the frame fills in. */
  primary?: Bi;
}

const step = (title: Bi, note: Bi, state: TimelineStep["state"]) => ({
  title,
  note,
  state,
});

const d = requestDetail;

/** OV 02.5B — hotel access, with Hoteliana. */
export const accessWaiting: DetailShape = {
  stateLabel: t("Waiting for Hoteliana", "بانتظار هوتيليانا"),
  stateNote: t("usually within 2 working days", "عادةً خلال يومَي عمل"),
  tone: "warning",
  timeline: [
    step(
      d.stepSent,
      t("Just now · recorded under your name", "الآن · مسجّل باسمك"),
      "done"
    ),
    step(d.stepReviewAccess, d.inProgress, "active"),
    step(
      d.stepDecision,
      t(
        "You get the result here and in your notifications",
        "تصلك النتيجة هنا وفي إشعاراتك"
      ),
      "waiting"
    ),
  ],
  listTitle: t("What you acknowledged", "ما أقررت به"),
  list: [
    t("The company can supply this hotel.", "الشركة قادرة على توريد هذا الفندق."),
    t(
      "Published rates, inventory and confirmations are binding under the Hoteliana agreement.",
      "الأسعار والمخزون والتأكيدات المنشورة مُلزِمة بموجب اتفاقية هوتيليانا."
    ),
    t(
      "Hotel supply contracts for this hotel unlock only after approval.",
      "لا تُفتح عقود توريد هذا الفندق إلا بعد الموافقة."
    ),
  ],
  note: t(
    "Withdrawing cancels the review. You can request the same hotel again later.",
    "السحب يلغي المراجعة. ويمكنك طلب الفندق نفسه لاحقًا."
  ),
  actions: [],
  primary: d.withdraw,
};

/** OV 02.5B2 — a new room, with Hoteliana. */
export const roomWaiting: DetailShape = {
  stateLabel: t("Waiting for Hoteliana", "بانتظار هوتيليانا"),
  stateNote: t("usually within 2 working days", "عادةً خلال يومَي عمل"),
  tone: "warning",
  timeline: [
    step(
      d.stepSent,
      t("12 Sep · 4 images attached", "١٢ سبتمبر · مرفق ٤ صور"),
      "done"
    ),
    step(d.stepReviewRoom, d.inProgress, "active"),
    step(
      d.stepDecision,
      t(
        "Approved → “Added to official catalogue”, visible and in every supply contract room list",
        "عند الموافقة ← «أُضيفت إلى الدليل الرسمي»، وتظهر في قائمة غرف كل عقد توريد"
      ),
      "waiting"
    ),
  ],
  listTitle: t("While it is pending", "ما دام معلّقًا"),
  list: [
    t(
      "The room shows in the catalogue as “Pending Hoteliana”.",
      "تظهر الغرفة في الدليل بـ«بانتظار هوتيليانا»."
    ),
    t(
      "It cannot be priced or sold in any supply contract yet.",
      "ولا يمكن تسعيرها أو بيعها في أي عقد توريد بعد."
    ),
  ],
  note: t(
    "Withdrawing removes the pending room. You can add it again later.",
    "السحب يزيل الغرفة المعلّقة. ويمكنك إضافتها مرة أخرى لاحقًا."
  ),
  actions: [d.openHotelProfile],
  primary: d.withdraw,
};

/** OV 02.5C — hotel access, approved. */
export const accessApproved: DetailShape = {
  stateLabel: t("Approved", "مقبول"),
  stateNote: t("on 08 Sep", "في ٨ سبتمبر"),
  tone: "success",
  timeline: [
    step(d.stepSent, t("05 Sep", "٥ سبتمبر"), "done"),
    step(
      d.stepReviewAccess,
      t("Complete · 08 Sep", "اكتملت · ٨ سبتمبر"),
      "done"
    ),
    step(
      t("Approved", "مقبول"),
      t(
        "The hotel is linked. Create its first supply contract from My Hotels.",
        "الفندق مرتبط. أنشئ أول عقد توريد له من «فنادقي»."
      ),
      "done"
    ),
  ],
  listTitle: t("What changed", "ما الذي تغيّر"),
  list: [
    t("Rawdah Suites appears in My Hotels.", "تظهر أجنحة الروضة في «فنادقي»."),
    t(
      "Hotel supply contracts for this hotel are unlocked.",
      "فُتحت عقود توريد هذا الفندق."
    ),
  ],
  actions: [],
  primary: d.openInMyHotels,
};

/** OV 02.5C2 — a new room, approved. */
export const roomApproved: DetailShape = {
  stateLabel: t("Approved", "مقبول"),
  stateNote: t("Added to official catalogue", "أُضيفت إلى الدليل الرسمي"),
  tone: "success",
  timeline: [
    step(d.stepSent, t("08 Sep", "٨ سبتمبر"), "done"),
    step(
      d.stepReviewRoomDone,
      t("Complete · 09 Sep", "اكتملت · ٩ سبتمبر"),
      "done"
    ),
    step(
      t("Approved", "مقبول"),
      t(
        "In the catalogue and in every supply contract room list for this hotel.",
        "في الدليل وفي قائمة غرف كل عقد توريد لهذا الفندق."
      ),
      "done"
    ),
  ],
  listTitle: t("What changed", "ما الذي تغيّر"),
  list: [
    t(
      "Superior King is an official room of Al Noor Makkah Hotel.",
      "«سوبيريور كينج» غرفة رسمية في فندق النور مكة."
    ),
    t(
      "Price it inside a supply contract when you are ready.",
      "سعّرها داخل عقد توريد حين تكون جاهزًا."
    ),
  ],
  actions: [],
  primary: d.openHotelProfile,
};

/** OV 02.5D — a new hotel, corrections requested. */
export const hotelNeedsYou: DetailShape = {
  stateLabel: t("Needs you", "يحتاجك"),
  stateNote: t("corrections requested 04 Sep", "طُلبت تصحيحات ٤ سبتمبر"),
  tone: "danger",
  timeline: [
    step(d.stepSent, t("02 Sep", "٢ سبتمبر"), "done"),
    step(
      d.stepReviewAccess,
      t("Complete · 04 Sep", "اكتملت · ٤ سبتمبر"),
      "done"
    ),
    step(
      t("Corrections requested", "طُلبت تصحيحات"),
      t(
        "“Map pin is 3 km off and the Arabic name does not match the licence.” Fix both and resubmit - the reference stays the same.",
        "«موقع الخريطة يبعد ٣ كم والاسم العربي لا يطابق الرخصة.» صحّح الأمرين وأعد الإرسال - ويبقى المرجع كما هو."
      ),
      "active"
    ),
  ],
  listTitle: t("What Hoteliana needs", "ما تحتاجه هوتيليانا"),
  list: [
    t("Correct map location", "تصحيح موقع الخريطة"),
    t(
      "Arabic hotel name exactly as on the tourism licence",
      "اسم الفندق بالعربية كما في رخصة السياحة تمامًا"
    ),
    t("Everything else you entered is kept", "وكل ما أدخلته غير ذلك محفوظ"),
  ],
  reply: true,
  actions: [d.withdrawShort],
  primary: d.openForm,
};

/** OV 02.5E — hotel access, not approved. */
export const accessRejected: DetailShape = {
  stateLabel: t("Rejected", "مرفوض"),
  stateNote: t(
    "you can request it again from 10 Dec",
    "يمكنك طلبه مجددًا من ١٠ ديسمبر"
  ),
  tone: "danger",
  timeline: [
    step(d.stepSent, t("09 Sep", "٩ سبتمبر"), "done"),
    step(
      d.stepReviewAccess,
      t("Complete · 11 Sep", "اكتملت · ١١ سبتمبر"),
      "done"
    ),
    step(
      t("Rejected", "مرفوض"),
      t(
        "“The hotel already has an exclusive supplier for this season.”",
        "«للفندق مورّد حصري لهذا الموسم بالفعل.»"
      ),
      "done"
    ),
  ],
  listTitle: t("What you can do", "ما يمكنك فعله"),
  list: [
    t(
      "Request this hotel again from 10 Dec.",
      "اطلب هذا الفندق مجددًا من ١٠ ديسمبر."
    ),
    t(
      "Ask Hoteliana if you believe the decision is wrong.",
      "اسأل هوتيليانا إن كنت ترى القرار خاطئًا."
    ),
  ],
  actions: [d.askHoteliana],
  primary: d.backToLibrary,
};

/** OV 02.5F — the corrections are made, waiting to go back. */
export const hotelReady: DetailShape = {
  stateLabel: t("Needs you", "يحتاجك"),
  stateNote: t("corrections requested 04 Sep", "طُلبت تصحيحات ٤ سبتمبر"),
  tone: "danger",
  timeline: [
    step(d.stepSent, t("02 Sep", "٢ سبتمبر"), "done"),
    step(
      d.stepReviewAccess,
      t("Corrections requested · 04 Sep", "طُلبت تصحيحات · ٤ سبتمبر"),
      "done"
    ),
    step(
      d.stepDecision,
      t("Resumes as soon as you resubmit", "تستأنف فور إعادة الإرسال"),
      "waiting"
    ),
  ],
  fixed: {
    title: t(
      "Your corrections - ready to resubmit",
      "تصحيحاتك - جاهزة لإعادة الإرسال"
    ),
    body: t(
      "Map location moved to the hotel entrance · Arabic name now matches the tourism licence",
      "نُقل موقع الخريطة إلى مدخل الفندق · والاسم العربي صار يطابق رخصة السياحة"
    ),
    link: d.editAgain,
  },
  quote: t(
    "Hoteliana: “Map pin is 3 km off and the Arabic name does not match the licence.”",
    "هوتيليانا: «موقع الخريطة يبعد ٣ كم والاسم العربي لا يطابق الرخصة.»"
  ),
  listTitle: t("", ""),
  list: [],
  reply: true,
  actions: [d.withdraw],
  primary: d.resubmit,
};

/** OV 02.5F2 — sent back, and with Hoteliana again. */
export const hotelResubmitted: DetailShape = {
  stateLabel: t("Waiting", "بانتظار"),
  stateNote: t("resubmitted 15 Sep", "أُعيد الإرسال ١٥ سبتمبر"),
  tone: "warning",
  timeline: [
    step(d.stepSent, t("02 Sep", "٢ سبتمبر"), "done"),
    step(
      d.stepReviewAccess,
      t("Resubmitted · 15 Sep", "أُعيد الإرسال · ١٥ سبتمبر"),
      "active"
    ),
    step(
      d.stepDecision,
      t("Decision within 2 working days", "القرار خلال يومَي عمل"),
      "waiting"
    ),
  ],
  fixed: {
    title: t("What you changed", "ما الذي غيّرته"),
    body: t(
      "Hoteliana checks the two details again - everything else stays as accepted",
      "تراجع هوتيليانا التفصيلين مرة أخرى - ويبقى كل ما عداهما مقبولًا"
    ),
  },
  quote: t(
    "Hoteliana: “Map pin is 3 km off and the Arabic name does not match the licence.”",
    "هوتيليانا: «موقع الخريطة يبعد ٣ كم والاسم العربي لا يطابق الرخصة.»"
  ),
  changed: t("Map location · Arabic name", "موقع الخريطة · الاسم العربي"),
  listTitle: t("", ""),
  list: [],
  reply: true,
  actions: [d.withdraw],
  primary: d.done,
};

/**
 * OV 02.5C3 — the room was already in the catalogue under another name.
 *
 * Nothing was added, and that is the whole message: the request now points
 * at a room that already exists, so the next thing to do is price it.
 */
export const roomLinked: DetailShape = {
  stateLabel: t("Linked", "مرتبطة"),
  stateNote: t("Already in the catalogue", "موجودة في الدليل أصلًا"),
  tone: "neutral",
  timeline: [
    step(d.stepSent, t("20 Sep", "٢٠ سبتمبر"), "done"),
    step(
      t("Hoteliana verified the room", "تحققت هوتيليانا من الغرفة"),
      t("Complete · 21 Sep", "اكتمل · ٢١ سبتمبر"),
      "done"
    ),
    step(
      t("Linked", "مرتبطة"),
      t(
        "The same room is already in the catalogue under another name.",
        "الغرفة نفسها موجودة في الدليل باسم آخر."
      ),
      "done"
    ),
  ],
  listTitle: t("What changed", "ما الذي تغيّر"),
  list: [
    t(
      "Your request now points to \u201cDeluxe · Haram view\u201d. No new room was added.",
      "طلبك يشير الآن إلى «ديلوكس · إطلالة الحرم». ولم تُضف غرفة جديدة."
    ),
    t(
      "Price \u201cDeluxe · Haram view\u201d in your supply contract.",
      "سعّر «ديلوكس · إطلالة الحرم» في عقد التوريد."
    ),
  ],
  actions: [],
  primary: d.openHotelProfile,
};

/**
 * OV 02.5D2 — Hoteliana asked something before deciding.
 *
 * The clock is paused while the question is open, which the note says out
 * loud: waiting on you is not the same as being late.
 */
export const roomNeedsYou: DetailShape = {
  stateLabel: t("Needs you", "يحتاجك"),
  stateNote: t(
    "question asked 24 Sep · the 1-day clock is paused",
    "سُئل في ٢٤ سبتمبر · ومهلة اليوم موقوفة"
  ),
  tone: "warning",
  timeline: [
    step(d.stepSent, t("23 Sep", "٢٣ سبتمبر"), "done"),
    step(
      t("Hoteliana review", "مراجعة هوتيليانا"),
      t("Complete · 24 Sep", "اكتملت · ٢٤ سبتمبر"),
      "done"
    ),
    {
      ...step(
        t("Question from Hoteliana", "سؤال من هوتيليانا"),
        t("", ""),
        "active"
      ),
      kind: "question" as const,
    },
  ],
  quote: t(
    "\u201cIs this the same view as \u2018Deluxe · Haram view\u2019, or partial from some floors only? Send one photo from the window.\u201d Answer below - the reference stays the same.",
    "«هل هذه الإطلالة نفسها كـ«ديلوكس · إطلالة الحرم»، أم جزئية من بعض الأدوار فقط؟ أرسل صورة واحدة من النافذة.» أجب أدناه — والمرجع يبقى كما هو."
  ),
  listTitle: t("What Hoteliana needs", "ما تحتاجه هوتيليانا"),
  list: [
    t("Which view the room has", "أي إطلالة للغرفة"),
    t("One photo from the window", "صورة واحدة من النافذة"),
    t(
      "Everything else you entered is kept",
      "وكل ما أدخلته غير ذلك محفوظ"
    ),
  ],
  reply: true,
  actions: [d.withdraw],
  primary: t("Open the form to fix", "افتح النموذج للتصحيح"),
};

/**
 * OV 02.5E2 — refused, with the reason and a way forward.
 *
 * The frame does not stop at "no": it names what to sell instead, because
 * the supplier still has three guests to put somewhere.
 */
export const roomRejected: DetailShape = {
  stateLabel: t("Rejected", "مرفوضة"),
  stateNote: t("reason below", "السبب أدناه"),
  tone: "danger",
  timeline: [
    step(d.stepSent, t("18 Sep", "١٨ سبتمبر"), "done"),
    step(
      t("Hoteliana review", "مراجعة هوتيليانا"),
      t("Complete · 19 Sep", "اكتملت · ١٩ سبتمبر"),
      "done"
    ),
    {
      ...step(t("Rejected", "مرفوضة"), t("", ""), "active"),
      kind: "refused" as const,
    },
  ],
  quote: t(
    "\u201cThe hotel confirmed it has no triple rooms. Sell 3 guests as a Double with an extra bed.\u201d",
    "«أكّد الفندق أنه لا يملك غرفًا ثلاثية. بع ثلاثة نزلاء على غرفة مزدوجة بسرير إضافي.»"
  ),
  listTitle: t("What you can do", "ما يمكنك فعله"),
  list: [
    t(
      "Price 3 guests on your Double room with an extra bed.",
      "سعّر ثلاثة نزلاء على غرفتك المزدوجة بسرير إضافي."
    ),
    t(
      "Ask Hoteliana if you believe the decision is wrong.",
      "اسأل هوتيليانا إن رأيت القرار خاطئًا."
    ),
  ],
  actions: [d.askHoteliana],
  primary: t("Back to library", "عد إلى المكتبة"),
};

/** Which frame a row opens on, by what it is and where it stands. */
export function detailFor(
  kind: "access" | "hotel" | "room" | "company",
  state: "waiting" | "needsYou" | "approved" | "rejected" | "linked"
): DetailShape | null {
  if (kind === "room") {
    /* A new room ends four ways, and each of them has its own frame. */
    if (state === "approved") return roomApproved;
    if (state === "linked") return roomLinked;
    if (state === "needsYou") return roomNeedsYou;
    if (state === "rejected") return roomRejected;
    return roomWaiting;
  }
  /* Only a room can be linked to another room. */
  if (state === "linked") return null;
  if (kind === "hotel") {
    if (state === "needsYou") return hotelNeedsYou;
    if (state === "waiting") return hotelResubmitted;
    return null;
  }
  if (kind === "access") {
    if (state === "approved") return accessApproved;
    if (state === "rejected") return accessRejected;
    return accessWaiting;
  }
  return null;
}
