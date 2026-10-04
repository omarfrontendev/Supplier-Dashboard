/**
 * Figma UI 01.6C-* / 01.6D-* / 01.6E-* — what each requestable company detail
 * asks for, what it is checked against, and how the submitted line reads.
 * One entry per detail id in `companyRecord`.
 */
export interface ChangeFieldCopy {
  /** The "Current:" line the change frame prints, where it differs from the profile. */
  current?: string;
  currentAr?: string;
  /** Label over the new-value control. */
  newLabel: string;
  newLabelAr: string;
  /** The value the design types into it. */
  example: string;
  exampleAr: string;
  /** The sentence under the control. */
  hint: string;
  hintAr: string;
  /** The EVIDENCE column on the review step. */
  evidence: string;
  evidenceAr: string;
  /** What follows the requested value on the submitted screen. */
  submitted: string;
  submittedAr: string;
  /** Country and city are picked from a list, not typed. */
  picker?: boolean;
  /** A detail held as text on the profile but replaced by a document. */
  asDocument?: boolean;
  /** Size, issue and expiry line under a replacement document. */
  fileMeta?: string;
  fileMetaAr?: string;
}

export const changeFieldCopy: Record<string, ChangeFieldCopy> = {
  legalName: {
    current: "Jewar Al-Safwah Travel & Tourism Co.",
    currentAr: "شركة جوار الصفوة للسفر والسياحة",
    newLabel: "New legal company name",
    newLabelAr: "الاسم القانوني الجديد للشركة",
    example: "Jewar Al-Safwah Hospitality Co.",
    exampleAr: "شركة جوار الصفوة للضيافة",
    hint: "Must match the name on your commercial registration - Hoteliana checks the two together.",
    hintAr: "يجب أن يطابق الاسم في سجلك التجاري - فهوتيليانا تفحص الاثنين معًا.",
    evidence: "Checked against commercial registration",
    evidenceAr: "يُفحص مقابل السجل التجاري",
    submitted: "checked against your commercial registration",
    submittedAr: "يُفحص مقابل سجلك التجاري",
  },
  country: {
    newLabel: "New country",
    newLabelAr: "الدولة الجديدة",
    example: "United Arab Emirates",
    exampleAr: "الإمارات العربية المتحدة",
    hint: "Pick from the list. Hoteliana confirms the new country with your registration documents.",
    hintAr: "اختر من القائمة. وتؤكد هوتيليانا الدولة الجديدة بمستندات تسجيلك.",
    evidence: "Confirmed with registration documents",
    evidenceAr: "يُؤكَّد بمستندات التسجيل",
    submitted: "confirmed with your registration documents",
    submittedAr: "يُؤكَّد بمستندات تسجيلك",
    picker: true,
  },
  city: {
    newLabel: "New city",
    newLabelAr: "المدينة الجديدة",
    example: "Jeddah",
    exampleAr: "جدة",
    hint: "Pick from the list. Your hotels keep their own addresses - this is the company address only.",
    hintAr: "اختر من القائمة. وتحتفظ فنادقك بعناوينها - وهذا عنوان الشركة وحده.",
    evidence: "Company address only",
    evidenceAr: "عنوان الشركة وحده",
    submitted: "your hotels keep their own addresses",
    submittedAr: "وتحتفظ فنادقك بعناوينها",
    picker: true,
  },
  email: {
    current: "info@jewaralsafwah.com",
    currentAr: "info@jewaralsafwah.com",
    newLabel: "New company email",
    newLabelAr: "بريد الشركة الجديد",
    example: "contact@jewaralsafwah.com",
    exampleAr: "contact@jewaralsafwah.com",
    hint: "A verification link is sent to the new address before Hoteliana reviews it.",
    hintAr: "يُرسل رابط تحقق إلى العنوان الجديد قبل أن تراجعه هوتيليانا.",
    evidence: "Verification link · sent to new address",
    evidenceAr: "رابط تحقق · أُرسل إلى العنوان الجديد",
    submitted: "waiting for the address to be confirmed",
    submittedAr: "بانتظار تأكيد العنوان",
  },
  tax: {
    current: "Tax_Certificate.pdf · expires 31 Dec 2026 · Expiring soon",
    currentAr: "Tax_Certificate.pdf · تنتهي ٣١ ديسمبر ٢٠٢٦ · على وشك الانتهاء",
    newLabel: "Replacement tax certificate",
    newLabelAr: "شهادة ضريبية بديلة",
    example: "Tax_Certificate_2027.pdf",
    exampleAr: "Tax_Certificate_2027.pdf",
    hint: "The current approved file stays active until Hoteliana approves the replacement.",
    hintAr: "يبقى الملف المعتمد الحالي فعّالًا حتى تعتمد هوتيليانا البديل.",
    evidence: "PDF · 1.1 MB · exp. 31 Dec 27",
    evidenceAr: "PDF · ١٫١ ميجابايت · تنتهي ٣١ ديسمبر ٢٧",
    submitted: "exp. 31 Dec 2027",
    submittedAr: "تنتهي ٣١ ديسمبر ٢٠٢٧",
    fileMeta: "1.1 MB · issued 01 Jan 2027 · expires 31 Dec 2027 · Ready to send",
    fileMetaAr: "١٫١ ميجابايت · صدرت ١ يناير ٢٠٢٧ · تنتهي ٣١ ديسمبر ٢٠٢٧ · جاهزة للإرسال",
  },
  license: {
    current: "Tourism_License.pdf · expires 30 Jun 2027",
    currentAr: "Tourism_License.pdf · تنتهي ٣٠ يونيو ٢٠٢٧",
    newLabel: "Replacement tourism license",
    newLabelAr: "رخصة سياحية بديلة",
    example: "Tourism_License_2028.pdf",
    exampleAr: "Tourism_License_2028.pdf",
    hint: "The current approved file stays active until Hoteliana approves the replacement.",
    hintAr: "يبقى الملف المعتمد الحالي فعّالًا حتى تعتمد هوتيليانا البديل.",
    evidence: "PDF · 0.9 MB · exp. 30 Jun 28",
    evidenceAr: "PDF · ٠٫٩ ميجابايت · تنتهي ٣٠ يونيو ٢٨",
    submitted: "exp. 30 Jun 2028",
    submittedAr: "تنتهي ٣٠ يونيو ٢٠٢٨",
    fileMeta: "0.9 MB · issued 01 Jul 2027 · expires 30 Jun 2028 · Ready to send",
    fileMetaAr: "٠٫٩ ميجابايت · صدرت ١ يوليو ٢٠٢٧ · تنتهي ٣٠ يونيو ٢٠٢٨ · جاهزة للإرسال",
  },
  guarantee: {
    current: "Not uploaded yet · optional",
    currentAr: "لم يُرفع بعد · اختياري",
    newLabel: "Bank guarantee letter",
    newLabelAr: "خطاب الضمان البنكي",
    example: "Bank_Guarantee_Letter.pdf",
    exampleAr: "Bank_Guarantee_Letter.pdf",
    hint: "Optional. Adding it does not change anything else on your record.",
    hintAr: "اختياري. وإضافته لا تغيّر شيئًا آخر في سجلك.",
    evidence: "PDF · 0.6 MB · exp. 09 Sep 27",
    evidenceAr: "PDF · ٠٫٦ ميجابايت · ينتهي ٩ سبتمبر ٢٧",
    submitted: "exp. 09 Sep 2027",
    submittedAr: "ينتهي ٩ سبتمبر ٢٠٢٧",
    fileMeta: "0.6 MB · issued 10 Sep 2026 · expires 09 Sep 2027 · Ready to send",
    fileMetaAr: "٠٫٦ ميجابايت · صدر ١٠ سبتمبر ٢٠٢٦ · ينتهي ٩ سبتمبر ٢٠٢٧ · جاهز للإرسال",
  },
  ownerName: {
    current: "Abdullrahman Najeh",
    currentAr: "عبدالرحمن ناجح",
    newLabel: "New owner name",
    newLabelAr: "اسم المالك الجديد",
    example: "Abdullrahman Mohamed Najeh",
    exampleAr: "عبدالرحمن محمد ناجح",
    hint: "Must match the owner ID on file. If the owner changed, request the owner ID too.",
    hintAr: "يجب أن يطابق هوية المالك المحفوظة. وإن تغيّر المالك فاطلب هوية المالك أيضًا.",
    evidence: "Checked against the owner ID on file",
    evidenceAr: "تُفحص مقابل هوية المالك المحفوظة",
    submitted: "checked against the owner ID on file",
    submittedAr: "تُفحص مقابل هوية المالك المحفوظة",
  },
  ownerPhone: {
    current: "+966 55 123 4567",
    currentAr: "+966 55 123 4567",
    newLabel: "New owner phone number",
    newLabelAr: "رقم جوال المالك الجديد",
    example: "+966 50 765 4321",
    exampleAr: "+966 50 765 4321",
    hint: "A code is sent by SMS to the new number before Hoteliana reviews it.",
    hintAr: "يُرسل رمز برسالة نصية إلى الرقم الجديد قبل أن تراجعه هوتيليانا.",
    evidence: "SMS code · sent to new number",
    evidenceAr: "رمز نصي · أُرسل إلى الرقم الجديد",
    submitted: "waiting for the number to be confirmed",
    submittedAr: "بانتظار تأكيد الرقم",
  },
  ownerEmail: {
    newLabel: "New owner email",
    newLabelAr: "بريد المالك الجديد",
    example: "finance@jewaralsafwah.com",
    exampleAr: "finance@jewaralsafwah.com",
    hint: "A verification link is sent to the new address before Hoteliana reviews it.",
    hintAr: "يُرسل رابط تحقق إلى العنوان الجديد قبل أن تراجعه هوتيليانا.",
    evidence: "Verification link · sent to new address",
    evidenceAr: "رابط تحقق · أُرسل إلى العنوان الجديد",
    submitted: "waiting for the owner to confirm this email",
    submittedAr: "بانتظار تأكيد المالك لهذا البريد",
  },
  ownerId: {
    current: "Owner_ID.pdf · expires 14 Mar 2027",
    currentAr: "Owner_ID.pdf · تنتهي ١٤ مارس ٢٠٢٧",
    newLabel: "Replacement owner ID",
    newLabelAr: "هوية مالك بديلة",
    example: "Owner_ID_2031.pdf",
    exampleAr: "Owner_ID_2031.pdf",
    hint: "The current approved file stays active until Hoteliana approves the replacement.",
    hintAr: "يبقى الملف المعتمد الحالي فعّالًا حتى تعتمد هوتيليانا البديل.",
    evidence: "PDF · 0.8 MB · exp. 14 Mar 31",
    evidenceAr: "PDF · ٠٫٨ ميجابايت · تنتهي ١٤ مارس ٣١",
    submitted: "exp. 14 Mar 2031",
    submittedAr: "تنتهي ١٤ مارس ٢٠٣١",
    asDocument: true,
    fileMeta: "0.8 MB · issued 15 Mar 2026 · expires 14 Mar 2031 · Ready to send",
    fileMetaAr: "٠٫٨ ميجابايت · صدرت ١٥ مارس ٢٠٢٦ · تنتهي ١٤ مارس ٢٠٣١ · جاهزة للإرسال",
  },
};
