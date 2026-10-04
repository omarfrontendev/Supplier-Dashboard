<!--
  Extracted from "هوتليانا — بوابة المورد · دليل التنفيذ الكامل.pdf"
  (27 September 2026, 383 pages) - the designer's Product Owner specification.

  Each chapter carries eleven sections: goal and scope, numbered business
  rules (BR-xx-nn), the happy path, alternative flows, exception flows, the
  states the design never draws, the state machine, fields and validation,
  notifications and the log, acceptance criteria, and open questions.

  The PDF stores Arabic in visual order, so the text was put back into
  logical order line by line. A line that mixes Arabic and Latin can still
  read out of order; the PDF is the original if a rule looks garbled.

  This file outranks `front-end-states.md`, the Figma REF pages, and the
  frames - see `.claude/skills/figma-match/SKILL.md`.
-->

# Flow 07 · Finance

Finance 07: (Flow )المالية
Flow 07) الحقيقة: شاشاتمصدر في07.* 12 Flow ( في3662:62744 أقدم حاجة أي وبتلغي المعتمدة، النسخة هي
(.523:3214 )
 نهائي اتشال  07.0 وUI الجاري07.0A-D (الحساب account وRunning 07.5)، وUI القديمة)،07.6 (المدفوعات
).BR-07-05. 07.4و وOV و07.7 و07.8 في07.10 (الجدول الجديدة للصفحات يروح لازم لهم رايح كان لينك أي
OV من 07اتساب شغالFlow ولسه القديم   07.1 OV /  07.2 /  و07.3 (القيود)، 07.9 OV وExport( 07.11)،
07.15  / 07.14B  / 07.14E  / 07.14A  / OV 07.14 advice( وRemittance 07.12)، OV /  و07.13 (التواصل)،
BR-07- /  07.15B قيد). على (الاعتراض تتعدل ولازم والرصيد"، الجاري "الحساب عن بتتكلم لسه جواهم (شوفالنصوص
.(06
 المبالغ الضريبةكل 15%شاملة بالريال)VAT مكةSAR، وبتوقيت .)UTC+3)،
1 الهدف. والنطاق
موجود: ده الفلو يعرفليه لازم المورد 4 حد: يكلّم ما غير من حاجات مني محتاج اللي وإيه حساب، أي وعلى وإمتى، كام، هتدفعلي هوتليانا
. وليه،دلوقتي منه اتخصم مبلغ أي ويشوف الضريبية، الفاتورة ويرفع سطر، على يعترض أو ويقبله الشهري الكشف يراجع كمان يقدر ولازم
لمحاسبه. تقارير ويطلّع عليه، ويعترض
النطاق ):MVPجوا
المالية 07.Dقايمة بـOV عناصر8 وOverview وEarnings، وStatements، وPayments، وAdjustments، invoices، ،Tax
.Bank & payment وReportsو terms،
العامة 07.20النظرة وUI عادي، بحالاتها: و07.20H موقوفة، المدفوعات لهوتليانا07.20N فلوس عليك 07.38 ،OV
 11.18و لسه.UI مستحقة حاجة مفيش
عقد لكل الدفع bookingشروط On / arrival On / check-out بشرطهAfter بيحتفظ والحجز ).snapshot)،
الضريبية والفاتورة اترفض)، / عليه (اتوافق سطر على واعتراض تلقائي، وقبول وقبول، ومراجعة، بيطلع، كاملة: بدورته الشهري الكشف
واتدفع. ومختلفة)، واستبدال، (رفع،
التحويل وإشعار اللستة، adviceالمدفوعات: رجعتRemittance ودفعة .07.32R)،
): والقيود ولصالحكAdjustmentsالخصومات مدفوع)، حجز إلغاء بعد عليك فلوس أو بحجز، مربوط مش قيد أو ضيف، (نقل ضدك
(تصحيح).
كاملة. بدورته قيد على والاعتراض سطر، على هوتليانا مع التواصل
).Export والتصدير8 بيانات"، "مفيش حالة + تقارير
 التغيير وطلب العرض، Ownerالبنك: بس (للقراءة الدفع وشروط تأكيد)، ومكالمة بس،
النطاق: برا
.  البوابة: من الدفع شرط تعديل أبدًا مسموح العقد.مش من جزء لأنه الحساب مدير مع بيتغير
.  قيد: يعدّل أو بنفسه قيد يعمل مسموحالمورد القيود.مش بتعمل اللي بس هوتليانا
).Finance 25 Sep. note Credit الخصومات: على المورد من فاتورة أو (قرارمفيش بس بتتخصم الخصومات
 ZATCAإعدادات خالص: للمورد ظاهرة .مش بسZATCA هوتليانا شغل

---

**p. 253**

  البلدية: مكانمفيشرسوم أي في
.OV 07.38.  مثلاً): (بكارت لهوتليانا البوابة من إلكتروني فيدفع بسMVPمش البنكي بالتحويل السداد
).AI agents الذكي Hisabالوكيل بموافقة): واعتراض (قبول الـ" دهspecبرا في (موجود الـspec
.Not allowed": P2) حقيقي صلاحية objectطلب request شاشةaccess من
):REF (من الصلاحيات ومفاتيح بيستخدمه 08.Rمين
الأدوار الجاهزة اللي (عندها بيسمح)افتراضي المفتاحبإيه
والكشوف، والقيود، المالية، صفحات كل finance.viewيشوف
الشاشة على والتقارير والمدفوعات،
وOwner وAdmin، والـFinance، Auditor. مقفول:
 الـ لو فتحهOwnerإلا للشخص
finance.export وExport صفحة، أي من للتقارير،Excel/PDF
Remittance PDFو وتحميلDownload للكشف،
advice
 وOwner وAdmin، والـFinance، لوAuditor.
finance.viewاتفتحله (مقترح
finance.contact" Hoteliana" وCall note" a أوSend سطر أي على
) OV 07.12قيد
وOwner وAdmin، Finance،
قيد على 07.14الاعتراض OV على)، finance.disputeوالاعتراض
الكشف في 07.25سطر )OV نفس (مقترح:
للاتنين) المفتاح
وOwner وAdmin، Finance،
statement.acceptAccept الكشف 07.24قبول وOV the)،
الضريبيةrest الفاتورة استبدال أو ورفع "،
( 07.37  / OV 07.26 )
وOwner وAdmin، Finance،
Owner أبدًا تاني دور لأي مايتديش بس. حتى ولا البنكي، الحساب تغيير bank.changeطلب
مخصص دور
لما إلغاء) رسوم (تكلفة، للحجز المالي الجانب bookings.view_financialيشوف
المالية من حجز يفتح
Admin وFinance وOwner
guest.pii عند افتراضيًاFinanceمش (من 08.R في:REF الضيف اسم والتصديرEarningsيشوف والكشف
 هويةFinance ومابيشوفش المالي النص بيشوف
الضيف
الدور باسم مش بالمفتاح، بيتفحص .user.can)"finance.view"(الشرط
مقفول: مش مالوشمخفي لو كلمةfinance.view الـFinance، في bar" Top الداشبوردماتترسمش في المالية وكروت ،
ماتترسمش.
في (القايمة بيشرح سطر ومكانه يتشال، والزرار يظهر، الرقم يعمل: ومايقدرش بيشوف ).BR-07-90لو
الدخول: نقط
بيوص لّ على #منينفين
1"Top bar ← "Finance). قايمة 07.Dبيفتح OV صفحتهdropdown( بيفتح عنصر كل
2 Finance( · you needs )What  09.1C UI وكروتDashboard
الفلوس
فاتورة) قيد، (كشف، عنها بيتكلم اللي الصفحة بيفتح الكارت
3"Needs you ← September" "Review ←  tax؛07.23 August OverviewUpload  كروت07.20
OV 07.37  ← "invoice
في (الجدول مباشرة بتاعه العنصر بيفتح إشعار 4in-appإشعار)9كل

---

**p. 254**

بيوص لّ على #منينفين
5)deep عامل مش لو الإشعار. وجهة Loginنفس اللينكlogin: لنفس يرجع ← الإيميل في linkلينك
6) ← Earnings" in "See ←  07.21 ده الحجز على متفلترة الحجز(مقترح) 05/06صفحة الفلوسFlow قسم
7)"Flow 10: "Issue closed · entry 07.1 دهOV للقيد بقيد حادثة postedقفل
8 ← 01(07.36 )Flow changes البنكCompany تغيير نتيجة
907.32R" changes البنكيCompany الحساب بند ← بسOwner account" bank فيUpdate
10FIN-N-xxxx" ← 07.13 نفسهOV القيد / cases" كيسYour
11 statements" "Open / bookings" 11.18"Open مستحقةUI حاجة (مفيش
12 (مثلاًURL صفحة لأي مباشر
( /finance/statements/2026-09
UI صلاحية غير من الصلاحية. فحص بعد الصفحة، 11.4نفس
2 قواعد. البيزنس
2.1 عام
" :BR-07-01 المالية في مبلغ كل 15%شامل جنبهVAT ومكتوب VAT، ومنincl. الآلاف بفاصلة بتتعرض الأرقام الأعمدة. عناوين في
صحيح المبلغ لو كسور كسور18,450غير فيه لو عشريتين وبخانتين .)3,380.87)،
 مكة:BR-07-02 بتوقيت والتواريخ الأوقات كل الساعةUTC+3 بيخلص "اليوم" مكة.23:59:59). بتوقيت
:BR-07-03 مكان. كل في واحد والـرقم الداشبورد منOverview الرقم نفس بيقروا والتقارير service بيحسبFinance ومحدش ،
ده اختلفوا، رقمين لو .bugلوحده.
 :BR-07-04 والمدفوعات الكشف المورد شركة مستوى على بس، ظاهر اللي بيغيرّ الفندق فلتر الفندق. مستوى على مش الفنادق)، (كل
 المستحق المبلغ ومابيغيرّش
 القديمة):BR-07-05 (اللينكات كده: بيتحوّل اتشالت لشاشة رايح كان لينك أي
القديمالجديد
 07.20 UI 07.0Overview UI /  (الحساب)07.0A-D
 07.32 UI 07.5Payments UI /  (المدفوعات07.6
07.10  / 07.8  / 07.7  / OV القيد الأقرب: الجديدة والدفعة07.33الصفحة 07.4،
07.32
OV 07.1-07.3" account" the "Open / account" the to فيBack
07.13-07.15Bو
Adjustments UI 07.33
" القديمة):BR-07-06 الجاري الحساب (نصوص الـ في فيهاoverlays جملة أي اتسابت، اللي Y to X from went أوbalance
Taken from: September statement ·" reads" still balance your بيقول سطر ومكانها بتتشال، …" فين من هيتخصم :القيد
."Deducted from PAY-015" Oct 16 أوpaid payment" next from: أوTaken
)Payment terms( 2.2 شروط الدفع
:3 :BR-07-10 كل منعقد واحد دفع شرط ليه

---

**p. 255**

 check-out بعد:After بيتدفع والكشف فيه، خرج الضيف اللي الشهر بتاع الشهري الكشف بيدخل الحجز الكشفN تاريخ من يوم
. الحاليةN والقيمة العقد، من يوم15
.)daily payment arrival الضيف:On دخول يوم في بيتدفع حجز كل يوميةcheck-in دفعة في run)،
 booking :On اليومية الدفعة في تأكيده، يوم في بيتدفع حجز كل
:BR-07-11 الشرط  التأكيد لحظة الحجز على )snapshotبيتثبت القديمة الحجوزات كده، بعد العقد شرط غيرّت هوتليانا لو السعر. زي ،
 وصفحة الجديد. الشرط بتاخد والجديدة شرطها، على الحاليEarningsبتفضل العقد شرط مش هو، حجز كل شرط بتعرض
To change a term, talk to your :BR-07-12 المورد  يعدّل الشاشةمايقدرش البوابة. من الشرط ومكتوب07.36 بس، للقراءة
".account manager - it changes the contract
. :BR-07-13 بيجمع الشهري الكشف مختلفة. بشروط عقود عندها يبقى ممكن واحدة شركة اللي check-outالعقود بسAfter
.)BR-07-24 arrivalحجوزات وOn booking On الكشف، ومابتدخلش لوحدها، بتتدفع بتاعتهاإلا والتصحيحات الغرامات
 (دفعةBR-07-14 arrival ):On اللي النهارده حجوزات بتاخد اليومية الدفعة عنها ومااتبلّغش ميعادNo-showمااتلغتش لحد
  القطع ميعاد (مقترح)18:00الساعةالقطع. مكة بتوقيت بلاغ لو لـNo-show. بيتحول والغرامة المدفوع بين الفرق الدفع، بعد جه
" owed" الجاية.Refund الدفعة من ويتخصم لهوتليانا) (عليك
 BR-07-15 عقدNo-show( على arrival ):On بيتدفع بس بتظهرالغرامة الغرامة مابيتدفعش. والباقي الحجز، إلغاء سياسة حسب
.) 07.23P1 (زي الشهري الكشف في فيHTL-88010كسطر
 الدفعBR-07-16 بعد (إلغاء booking بيتحول):On يستحقها المورد اللي الغرامة ناقص المدفوع المبلغ اتدفع، ما بعد اتلغى الحجز لو
.)BR-07-60" owedلقيد الجايةRefund الدفعة من تلقائي ويتخصم ضدك،
بنوك):BR-07-17 شغل يوم مش الدفع (يوم  بتتعمل الدفعة رسمية، بنوك إجازة أو سبت أو جمعة جه الدفع يوم لو شغل يوم آخر في
 قبله العقد عن ماتتأخر عمرها عشان مثال(مقترح) الفعلي. التاريخ هو الشاشات كل في الظاهر والتاريخ 16، 2026 الدفعOct ← جمعة
.Oct 15الخميس
)Statement( 2.3 الكشف الشهري
:BR-07-20 واحد كشف الشهر في مورد شركة عقودلكل وكل فنادقها كل بيغطي check-out، After اللي للحجوزات الشهر، في خرجت
.Contract ده منcheck-out( فلتر1 فيه يوم). لآخر وHotel
 (الدورة):BR-07-21
."Open for review. الـ:1يوم في بيطلع، الكشف الساعةjob الشهري (مقترح)03:00 حالته
 يوم يوم1من لآخر 5 حاجة.):23:59( مايعملش أو سطر، على يعترض أو يقبل، ممكن المراجعة.
").Accepted automatically"( الساعة6يوم :00:00 بيتقبل ماتقبلش، لو تلقائيًا
).BR-07-17 الكشف16يوم (تاريخ 15 = (مع):N الدفع
 (المهلةBR-07-22 كاملة):5 أيام الـ (فشل سبب لأي متأخر طلع الكشف لو job بعد بتنتهي المراجعة مثلاً)، طلوعه5 ميعاد من أيام
الفعلي الدفع تاريخ بعده. اللي اليوم في التلقائي والقبول مابيتأخرش، ده بسبب .(مقترح
 الكشف):BR-07-23 (سطور
.)VAT حجز:Bookings كل check-out شاملAfter المورد، (تكلفة بمبلغه الشهر، في خرج
 earned you والـ:Penalties الإلغاء غرامات بـNo-show الشهر، في نهائية بقت اللي
أو:Deductions تسوية، أو ضيف، (نقل ضدك القيود owed بـRefund )،
 أو:Corrections "+" بـ بالحجز، مربوطة عليه)، اتوافق اعتراض أو الكشف، بعد اتعدل (حجز قبل شهر من تصحيحات
 supplied ضيفه:Not اتنقل حجز بمبلغrelocation بيظهر الحادثة0) رقم ومعاه
.Amount due = Bookings + Penalties − Deductions ± Corrections

---

**p. 256**

No- الغرامة):BR-07-24 بياخد كشف (أي  كشف بتدخل الغرامة نهائية فيه بقت اللي الـالشهر تسجيل تاريخ أو النهائي الإلغاء (تاريخ
 ← show العقد شرط كان مهما مثال(مقترح))، اتلغىHTL-88191. 11 سبتمبرSep كشف
. فاضي):BR-07-25 كشف (مفيش  تصحيح)، ولا قيد ولا غرامة ولا حجز (لا سطر ولا مافيهوش الشهر لو كشف قيودمابيطلعش فيه لو
 فيه لو حتى بيطلع الكشف بس، تصحيحات حجوزات0أو
You owe Hoteliana" بالسالب):BR-07-26 (كشف لو due لـAmount بيتحول والمبلغ حاجة، مابيتدفعش صفر، من أقل طلع
."Amount due 0 · 1,200 carried as owed to بيتعرضBR-07-60( والكشف Hoteliana،
 مفتوحة):BR-07-27 حادثة عليه (حجز لو بمبلغه. عادي الكشف بيدخل الحجز الكشف، طلوع لحظة حجز على مفتوحة حادثة فيه لو
 بعدها. اللي الدفعة أو الكشف بيدخل القيد كده، بعد بقيد اتقفلت (مقترحالحادثة الحوادث مابيستناش .الكشف
Undo. (القبول):BR-07-28  القبول كسطرنهائي بعده كشف في بتتصلّح غلطة وأي مابيتغيرش، الكشف بعده مفيشCorrection.
."accept
): التلقائي):BR-07-29 (القبول بواسطة بيتعمل إنتsystem "قبلته عن مختلف شكله السجل. في كده وبيتسجل النصS1،
."Accepted automatically · 6 Oct"
" الباقي:BR-07-30 يقبل يقدر المستخدم اعتراض، عليه سطر فيه لو rest the بيبقىAccept الكشف يفضلAccepted"). والسطر
 review" يومUnder التلقائي القبول ماقبلش، لو المراجعة6". تحت يفضل والسطر برضه، الباقي بيقبل
"Contact يوم:BR-07-31 بعد أو تلقائي) أو (يدوي القبول بعد زرار5 Dispute: السطور على ومكانهبيختفي" Hoteliana،
".The review window closed on 5 Oct. To raise a line, contact Hoteliana). ( 07.12 الجدولOV فوق بيظهر ده السطر
2.4 الاعتراض على سطر في الكشف
 :BR-07-35 الباقي. بيوقف ما عمره سطر على ميعادهالاعتراض في بيتدفع الكشف
الاعتراض):BR-07-36 وقت الدفع (مبلغ  بيتدفع الكشف بيه طلع اللي لقدّامبالمبلغ بيتحسم والاعتراض ،
 عليه: كسطراتوافق الجاي الشهر لكشف بيتضاف الفرق بالحجزCorrection مربوط
 بيظهر.اترفض: والسبب تغيير، أي مفيش
 جزء على agreedاتوافق للباقي.):Partly بيظهر والسبب الجاي، للكشف بيتضاف عليه اتوافق اللي الجزء
⚠ التصميم أرقام بيخالف فيده 07.23B /  07.23E /  (بتدفع07.23F 17,890 = 18,450 − شوف560 سؤال11). ،
.Q1
 :BR-07-37 يتحسم، ما بعد الواحد. السطر على مفتوح واحد اعتراض السطر نفس على تاني اعتراض بعدهامفيش الطريق البوابة. من
."Contact Hoteliana"
. :BR-07-38 يتبعت ما بعد الاعتراض ومايتسحبش مايتعدلش البوابة من زي 07.15(مقترح، وهو)OV بس مرفقات يضيف يقدر
."Under review"
Answer" :BR-07-39 بترد هوتليانا 2خلال )Sun-Thu( days بيفضلworking السطر المدة، عدّت لو review. وبيظهرUnder
reminded been has Hoteliana - overdue تنبيه بيتبعتله هوتليانا ومحاسب .(مقترح"،
"Dispute this entry" ← OV 07.1. سطور:BR-07-40 Deductions الكشف في قيود نفسههي القيد من بيتعمل عليها الاعتراض
. OV 07.25). ←  07.14 القيدOV وبقواعد من2.8) مش
)Tax invoice( 2.5 الفاتورة الضريبية
 :BR-07-45 الفاتورة إجبارية بس عشانها، بيتوقف ما الدفع مختلفةعمر لو ولا ناقصة، لو (لا
 :BR-07-46 واحدة فاتورة كشف لكل واحدة وفاتورة الشهر، لحجوزاتفي booking وOn arrival (صفOn ده الشهر في اتدفعت اللي
.) 07.34" arrival" on and booking فيon

---

**p. 257**

يرفع):BR-07-47 ينفع (إمتى  تترفع الكشف فاتورة يتقبل الكشف ما وهوبعد تلقائي). أو (يدوي review for بيقولOpen الكارت "،
On". ﬁnal" is statement the when it وفيUpload زرار، ومفيش بيقول07.34" العمود accept you فاتورةAfter
arrival booking/On تترفع للشهر (مقترح بعده اللي الشهر في يوم أول .من
 (التذكير):BR-07-48  تذكير بيتبعت ناقصة، الفاتورة لو أيام3كل بعد بيبدأ التذكير التذكير. نفس بتشوف وهوتليانا للمورد، من3 أيام
). الدفع اتدفعتاريخ أغسطس: (مثال 16 تذكيرSep ← و19 و22 25 تترفعSep فاتورة أي ما أول وبيقف
. (المطابقة):BR-07-49  بالكشف: الفاتورة بيقارن السيستم والإجمالي (هوتليانا) للمشتري الضريبي والرقم المشتري اختلافاسم أي
. notedبيتسجل · 120 by أوDiffers noted" · differs number VAT Buyer ويتابَع، مابيقفش") كلوالدفع الأوتوماتيكي التذكير
3 أيام على "Differsمابيشتغلش يدوي.(مقترح) بتتابعها هوتليانا ،
. (الاستبدالBR-07-50  أوReplace" invoice" corrected a Upload بيعمل جديدة" نسخة والقديمة بتتعلممابتتمسحش،
" بسSuperseded" الأخيرة النسخة على بتتعمل المطابقة الفاتورة. تاريخ في ظاهرة وتفضل
Company changes :BR-07-51 للمورد الضريبي الرقم ومايتعدلش الشركة، ملف من منجاي بيتصلح غلط، لو الرفع. شاشة في
.(Flow 01)
 :BR-07-52 الفاتورة رقم مختلفتينمايتكررش فترتين في المورد لنفس
)Payments( 2.6 المدفوعات
رقم:BR-07-55 ليها دفعة كل حجزPAY-xxx أو (كشف، إيه وبتغطي وتاريخ، arrival)، حجزOn أو booking، ورقمOn والمبلغ، )،
.)Remittance تحويل وإشعار البنكي، adviceالتحويل
) الـ:BR-07-56 advice Remittance ومايتعدلش هوتليانا من يتواصلصادر المورد غلط، رقم فيه لو 07.12. ومايصلّحشOV
الملف
 رجعت):BR-07-57 (دفعة أو اتقفل، (الحساب التحويل رجّع البنك لو مطابق):IBAN مش الاسم أو غلط،
بتبقى ."Returned"الدفعة
 بتتوقف المورد مدفوعات كل يتأكد. جديد حساب ما لحد
 بتتعاد الدفعة التأكيد، 2خلالبعد days هوتليانا.working في تاني شخص بموافقة ،
اللستة في بتفضل رجعت اللي جديدReturnedالدفعة كصف بتظهر والجديدة PAY-017"، of Re-payment .(مقترح)"
You owe صفر):BR-07-58 عن مابتنزلش (الدفعة  بتبقى الدفعة الدفعة، من أكبر الخصومات لو لـ0 بيتحول والباقي تحويل)، (مفيش
."Hoteliana
)Adjustments / Entries( 2.7 القيود
لهوتليانا):BR-07-60 (عليك عليك مبلغ أي owed Refund الدفعة) من أكبر قيد أو بالسالب، كشف أو الدفعة، من تلقائي بيتخصم
 نوعها كان أيًا مفتوحالجاية، فضل لو الدفعة. مبلغ ولحد التاريخ، حسب بالترتيب يوم60، يحوّل منه بيتطلب المورد نشأته، تاريخ من
( 07.38 بتتنبّه.OV هوتليانا ومالية )،
each with a reason and a :BR-07-61 بس الـهوتليانا سبب. ليه قيد وكل القيود، بتعمل اللي page بتقولAdjustments
". approver يعكسهsecond ولا قيد يعدّل ولا قيد يعمل مايقدرش المورد
 القيودBR-07-62 (أنواع
)Type( مربوط النوعالإشارةمثالبـ
Recovery−)INC-0087 حجز + التكلفةحادثة فرق ضيف: 500نقل إداريةSAR رسوم
Against  بحجزممكن مربوط أغسطسمش ملف على بالتليفون عليها متفق you−)ADJ-2026-0042تسوية
Refund owed−On booking اتدفعحجز ما بعد اتلغى )HTL-88230(حجز

---

**p. 258**

)Type( مربوط النوعالإشارةمثالبـ
In your لا أو بأقلحجز اتسعّرت ليلة favour+)ADJ-2026-0039تصحيح:
Reversal+ الاعتراض + الأصلي لصالحكالقيد اتحسم اعتراض أو)ADJ-2026-0043نتيجة
What it replaces · ADJ-. :BR-07-63 بحجز مربوط مش اللي القيد برضه الفلوس فيهبيحرّك لو محله بيحل اللي القيد وبيعرض
.("2026-0031
:BR-07-64 حاجة. فوق بتتكتب حاجة مفيش بتنزل اعتراض نتيجة أو تصحيح أي جديد هوكقيد ما زي بيفضل والقديم ،
حادثة:BR-07-65 من جاي اللي القيد 10 Flow بإيد) بيتكتب ومش الحادثة من معبيتعمل بيمشي والسبب بيها، مربوط وبيفضل ،
الفلوس
2.8 التواصل والاعتراض على قيد
. BR-07-70 اعتراضNote( مش  note" the "Send ( 07.12 OV المبلغ) ومابيحجزش فلوس، كيسمابيحرّكش بيفتح
. فيFIN-N-xxxx cases Your بمكالمة بترد وهوتليانا dayخلال"، واحدworking تصحيح قيد بتعمل هوتليانا حاجة، على اتفقوا لو
المبلغBR-07-71 بيحجز (الاعتراض  dispute" the "Send ( 07.14 لـOV القيد بيحوّل وDisputed) عليه"، المعترض المبلغ
."Held back فيبيتحجز ترد. هوتليانا ما لحد نهائي، كخصم ومابيتحسبش مابيتدفعلكش advice: فيRemittance بيظهر
). :BR-07-72 على يعترض ينفع بس ضدك قيد وRecovery( you، وAgainst owed، مافيهوشRefund لصالحك اللي القيد
" فيهDispute" note"، a بسSend
. قيد):BR-07-73 على الاعتراض (ميعاد  مسموح (مقترح)30لحد القيد تاريخ من يوم دفعة، من خلاص اتخصم كان القيد لو
  بس المدة، نفس في مسموح حجزالاعتراض كقيدمفيش بيرجع كسبه ولو خلاص)، اتخصم (المبلغ الجايةReversal الدفعة في
".the full entry. :BR-07-74 عليه المعترض المبلغ 1من كلهSAR القيد قيمة لحد الافتراضي
Answer due by 28 Sep 2026 · 5" : OV 07.14B :BR-07-75 قيد على الاعتراض على بترد هوتليانا 5خلال days (زيworking
.Q5". days .)"working  ⚠  بتقول07.33 2 days شوفworking
 (النتيجةBR-07-76
قيدلصالحك: بيبقىReversal الأصلي القيد الجاية. الدفعة في بيتدفع المحجوز والمبلغ الاعتراض، بمبلغ والاعتراضSettled "،
".Resolved in your favour"
بيبقىضدك: القيد فيSettled بيظهر والسبب هو، ما زي 07.15B" نهائيOV لخصم بيتحول المحجوز والمبلغ ،
 جزء بسبب.Reversal نهائي خصم والباقي عليه، اتوافق اللي بالجزء
".Call Hoteliana والطريق:BR-07-77 القيد، نفس على تاني اعتراض مفيش يتحسم، ما بعد الواحد. القيد على مفتوح واحد اعتراض
)Payments paused( 2.9 إيقاف المدفوعات
 للمورد:BR-07-80 بتظهر اللي الأسباب للمورد. المدفوعات توقف ممكن هوتليانا
": check" account حسابbank مراجعة
": change" account مفتوحbank بنك تغيير طلب
": expired" letter انتهىbank البنك خطاب
": back" came payment رجعتa دفعة
": review" الماليةFinance من مراجعة
. :BR-07-81 الإيقاف: وقت  بتضيع حاجة ومفيش عادي، بتكمّل والكشوف والاعتراضالحجوزات والقبول والمراجعة بيطلع، الكشف
بس التحويل هو بيقف اللي شغالين. كلهم الفاتورة ورفع

---

**p. 259**

 :BR-07-82 البيع المدفوعاتمابيتأثرش بإيقاف
:BR-07-83 في بتتدفع ميعادها عدّى اللي الدفعات كل الإيقاف، رفع بعد (مقترح) يومية دفعة برقمهاأول واحدة وكل ،
)Bank account( 2.10 البنك
:BR-07-85 الحساب تغيير بسOwnerللـ  ( منbank.change بيتعمل changes). Company 01( البنكيFlow الحساب بند ،
.) OV البنك خطاب 01.6Jومعاه
محتاج:BR-07-86 التغيير 3 حاجات: موقّع بنك وخطاب ، هوتليانا من تأكيد الـمكالمة رقم على Owner الطلب قبل عندها المسجل
 و الطلب)، في اللي الرقم تاني(مش شخص هوتلياناموافقة في
1") :BR-07-87 يتبعت، الطلب ما أول بتتوقف المدفوعات والسببBR-07-80( change، account bank المعتاد التأكيد. لحد
.working day
 بيبقى:BR-07-88 الجديد الحساب الموافقة: بعد وActive إيميل"، بيتبعتلها القديمة الاتصال بيترفعجهة والإيقاف اتغير، الحساب إن
:BR-07-89 الحساب صاحب اسم للشركة القانوني الاسم يطابق لازم الطلب مختلف، لو هوتليانا. من بيترفض بسبب .(مقترح
2.11 الصلاحيات في الشاشات
 مايقدرشBR-07-90 المستخدم لما الزرار مكان بيظهر (اللي
السطر اللي بيظهر الزرارالمفتاحمكانه
"Accept statement" / "Accept the rest"statement.acceptOnly people who can accept statements can do this - ask"
".the Owner
"Upload tax invoice" / "Replace"statement.acceptUploading tax invoices needs statement access - ask the"
".Owner
"Dispute this entry" Owner" the ask - access dispute needs dispute a (سطرDispute"finance.dispute".Raising
Call Hoteliana" / "Send a note" /"
""Contact Hoteliana
finance.contactContacting Hoteliana about money needs contact access"
".- ask the Owner
Export" / "Excel" / "PDF" / "Download"
"PDF" / "Download
finance.exportRemittance advice: "Downloading وفي بيتشال، needsالزرار
."export access - ask the Owner
Request a change" / "Update bank"
"account
bank.change".Only the Owner can change the bank account"
. لـ:BR-07-91 بس بيظهر الضيف اسم فيهguest.pii بيتكتب الضيف وعمود والإقامة، والفندق الحجز رقم بيشوف مالوش اللي
.Guest hidden" بيتقفلGuest بالاسم والبحث reference"، booking by والـSearch عمودExport"). بيشيل
2.12 التقارير والتصدير
Bookings 8 BR-07-95: وكلهم تقارير، الكشوف أرقام :بنفس statement وAccount month، and hotel by وEarnings by،
Cancellations month وcheck-out )aging(، dates وDue received، وPayments recoveries، and وDeductions and،
.VAT وpenalties summary،
 تقرير:BR-07-96 أي فلاتر وFrom وTo، on، based وDate Hotel، الأقصى. (مقترح)24المدى شهر  القديمة التواريخ فيمفتوحة.
.)date picker" قاعدة من (استثناء closedالتقارير are days الـPast في
" on based "Date عليه:BR-07-97: بيتفلتر اللي التاريخ بيحدد
.VAT hotel by Earnings وCheck-out: month، check-out by وBookings وCancellations، summary،

---

**p. 260**

.Payments statement Account date: وPayment received،
Aging date: Due كاتب التصميم .)Check-out(مقترح؛
Deductions date: Posted .(مقترح
. summary VAT الإجماليBR-07-98: = الشهر15/115 مستوى على عشريتين، لخانتين التقريب
المدى:BR-07-99 في بيانات مفيش لو dates these in "Nothing ( والـ07.36E Excel/PDF)، مكتوب والسبب مقفولين
.("Export stays off until there is data")
Your ﬁle الـ:BR-07-100 Export بيطلّع الحالي بالفلتر ظاهر اللي من أكتر لو (مقترح)5,000. صف بالإيميل بيتبعت الملف is،
".being prepared. We will email it to {email} within 10 minutes
.) OV 07.9. :BR-07-101 فيه الملف بس المورد فيتكلفة ثابت (النص فاتورة ومش دفعه، الوكيل اللي مع مايتطابقش
)Happy path( 3 الفلو. الأساسي
Abdullrahman). شركةالسيناريو: Al-Safwah وعندهاJewar عقود3، check-out وAfter arrival، وOn booking، المستخدمOn
سبتمبرOwner( شهر مع2026. .BR-07-17،
 .1الدخول
بيشوف الـFinance" في bar" Top محتاجاه حاجة فيه لو تنبيه رقم وعليها .(مقترح)،
".Finance علىبيعمل: بيدوس
. بيفتحالسيستم: 07.D بـOV الزرار تحت فيه8px ليه. ومحاذي مجموعات3 وMONEY وDOCUMENTS، العنصرSETTINGS،
 متعلّم وactiveالحالي عليهStatements)، وbadge" مراجعة، محتاجة اللي الكشوف بعدد invoices عليهTax بعددbadge"
الناقصة. الفواتير
".Overview بيدوسبعدها:
. 2: UI 07.20  Overview
بيشوف
.STATEMENT TO كروت4 PAYMENT وNEXT YOU، TO وDUE HOTELIANA، OWE وYOU REVIEW،
: things(قسم )2 you" أغسطسNeeds وفاتورة سبتمبر، كشف
".Coming up · Next paymentsجدول
" termsكارت عقد.Payment لكل
بيحسبالسيستم: payment Next = نوع" أي من مجدولة دفعة أقرب وBR-07-60( ).Q3،
".Review September بيدوسبيعمل:
. 3: UI الكشف 07.23فتح
بيشوف:
".Open for review · until 5 Octالحالة
.Amount due أرقام4 )12( 20,130 وBookings +1,420، وPenalties −3,100، وDeductions 18,450،
."How this statement worksصندوق
Scheduled الفاتورة وكارت والخصومات، الغرامات وجدول الحجوزات، yetجدول uploaded الدفعNot وكارت ·")،
(.18,450 · Al Rajhi ···· 4417
بيسجلالسيستم: viewed Statement السجل في بس" مستخدم لكل فتح أول .(مقترح:

---

**p. 261**

 .4المراجعة
بيدوسبيعمل: أو بالعقد، أو بالفندق بيفلتر 12 all Show حجز.(مقترح)" أي بيفتح أو ،
Filtered: Al Noor Makkah Hotel · the amount due is السيستم: تحتها بيظهر فوق اللي الكروت بس. الجداول بيغيرّ الفلتر
statement whole the for .(مقترح)"
 .5القبول
".Accept statement بيدوسبيعمل:
Bookings بيفتحالسيستم: 07.24 OV كله الكشف العنوانبأرقام الفلتر. كان مهما statement this وفيهAccept /?"،
".Accept statement" due Amount / Deductions / وزرارينPenalties وCancel،
  القبول .6تأكيد
".Accept statement" بيعمل
السيستم:
.statement.accept"  لسه الكشف إن reviewبيتأكد for عندهOpen المستخدم وإن
 لـ الحالة والشخص.Acceptedبيغيرّ الوقت وبيسجل "،
.supplier_user · Statement accepted · Open for review → السجل في Acceptedبيسجل
 إشعار المالية.in-appبيبعت مستخدمي لباقي
:07.23A الـبعدها: بتبقىoverlay والصفحة بيتقفل،
".Accepted · 3 Oct"
".You accepted it on 3 Oct at 11:20. 18,450 SAR is paid on 16 Oct to Al Rajhi ···· 4417"
."Upload tax فيه الفاتورة invoiceكارت
" وDisputeأزرار بتختفي، statement" بيختفي.Accept
accepted statement "September Toast: (مقترح)."
 الفاتورة .7رفع
".Upload tax invoice" بيعمل
بيفتحالسيستم: 07.26 OV : SAR" 18,450 DUE AMOUNT · 2026 الحقولSEPTEMBER وFile". number، ،Invoice
 dateو وInvoice VAT، incl. وTotal number، VAT بس).Your (للقراءة
. الفاتورة 8تعبئة
.XML بيرفعبيعمل: أوPDF
لوالسيستم: XML الملف من والإجمالي والتاريخ الرقم بيملأ الحقول(مقترح)، من بيتحقق لحظيًا.8. بالكشف الإجمالي وبيقارن )،
✓ Matches the مطابق statementلو
. 9الحفظ
".Upload" بيعمل
السيستم:
).Version الفاتورة 1بيحفظ
✓ Uploaded · Matchesالحالة
بتقف. التذكيرات

---

**p. 262**

 في سبتمبر بيتحدث07.34صف
السجل. في بيسجل
Invoice INV-JS-2026-0931 · 2 Oct 2026 · 18,450 SAR incl. VAT | Check:" : 07.23C بتبقىبعدها: الصفحة
".Matches the statement ✓ | Uploaded 3 Oct · Abdullrahman
 (يوم قبله16الدفع شغل يوم آخر أو .10،
السيستم:
 بتتعمل.PAY-017الدفعة
".Payment "Paid · 18,450 SAR · 16 Octالكشف
في جديد .07.32صف
".Paid في الكشف بتبقى07.21حجوزات
.Remittance advice" إيميل + sentإشعار الـPayment ومعاه
.system · Payment sent · Scheduled → Paidالسجل
. التحويل 11إشعار
".Remittance advice منبيعمل: بيدوس07.32
بيفتحالسيستم: 07.11 OV : وPayment on، وPaid reference، وBank to، وPaid وLines، وTotal، back، ،Held
CSV(و / )PDF وFormat ".Download،
. 12التحميل
".Download" بيعمل
".Remittance downloaded وبيسجلالسيستم: المختار، بالشكل الملف بينزّل
 الـبعدها: بيتقفل.overlay
. الشهر نفس في تانية 13دفعات
).BR-07-14 Oct(حجز اليومية12 الدفعة في الدخول يوم بيتدفع
 bookingحجز On التأكيد. يوم بيتدفع
".Paid في صف بيظهر واحد وفي07.32كل برقمه، بيبقى07.21
. 14 arrivalفاتورة booking/On للشهرOn
صف1من بعده، اللي الشهر arrival on and booking on · 2026 فيSeptember بيبقى07.34" ومعاهMissing "،
".Upload"
07.26نفس بعنوانOV SAR 4,620 · ARRIVAL ON AND BOOKING ON · 2026 SEPTEMBER .(مقترح"
)Alternative ﬂows( 4 الفلوهات. البديلة
) 07.23D: تلقائيA1 قبول ← حاجة عمل حد مفيش
 .1. statement.accept" الساعة4يوم 09:00 تذكير(مقترح) tomorrow: ends review statement: لمستخدميSeptember
. 2."Open for review الساعة6يوم الـ00:00 لسهjob: كشف كل بيقبل
. 3Nothing was sent back by 5 Oct, so it was Octالحالة 6 · automatically والنصAccepted accepted"،
."automatically on 6 Oct at 00:00. 18,450 SAR is paid on 16 Oct

---

**p. 263**

 .4.system · Statement auto-acceptedالسجل
. 5 + إيميلin-appإشعار
. 6 زيالنهاية: يعترض07.23A ومايقدرش الفاتورة، يرفع يقدر بالظبط:
)07.23E  ← 07.23B  ← OV 07.25: عليهA2 اتوافق ← حجز سطر على اعتراض
 .1.HTL-88205" 07.23في review( for بيدوسOpen علىDispute)،
. 2: OV 07.25
."LINE: "HTL-88205 · 20-24 Sep · 3 rooms · 9,240 SAR
EXPECTالحقول YOU وAMOUNT وREASON، وNOTE، .EVIDENCE،
. 3."Send السبب9,800بيكتب ويختار rate، ويرفعWrong ملاحظة، ويكتب ويدوسPDF"، dispute،
. 4السيستم
).8بيتحقق
".Under الاعتراض DSP-S-xxxxبيعمل بيبقى(مقترح) والسطر review،
هوتليانا. لمالية إشعار
.supplier_user · Line disputed · In statement → Under review · expected 9,800 )+560(السجل
. 5: 07.23Bالصفحة
".line under review 1"
Your dispute was sent · HTL-88205 · you expect 9,800 instead of 9,240 (+560). Hoteliana answers within"
".2 working days
."Accept the بقى الأساسي restالزرار
. 6 Acceptبيدوس ←  07.24 OV ← rest" the الكشفAccept لسهAccepted. والسطر review"، Under حاجةأو". مايعملش
.A1 ←
 .7: 07.23E" ← إشعار بتوافق. disputeهوتليانا your answered الكشفHoteliana بيفتح
Hoteliana agreed · HTL-88205 · the hotel rate was 9,800, not 9,240. The 560 SAR is added to your"
".October statement as a correction line, linked to this booking
."Agreed · +560 in Octoberالسطر
. النهاية: سطر فيه أكتوبر كشف بـCorrection بـ560 مربوط بمبلغهHTL-88205 بيتدفع سبتمبر وكشف 8.)BR-07-36،
)07.23F: اترفضA3 ← سطر على اعتراض
.6 خطوةA2زي لحد
Hoteliana did not agree · HTL-88205 · the contract rate for 24 Sep was" : الصفحة بسبب. بترفض 07.23Fهوتليانا
9,240 (season Rabi al-Awwal, 3 rooms × 4 nights). Nothing changes in your statement. Reason and evidence
".are in the booking activity
."Rejected · see reasonالسطر
بيظهرالنهاية: السطر. نفس على تاني اعتراض مفيش Hoteliana Contact disagree? "Still ←  07.12 OV .(مقترح)
: مرسوم)A4 (مش جزء على اتوافق ← اعتراض

---

**p. 264**

."Hoteliana agreed in بعنوان07.23Eنفس part،
HTL-88205 · 300 SAR of the 560 you asked for is added to your October statement. Reason for theالنص
."rest: {reason}
."Partly agreed · +300 in Octoberالسطر
) غرامةA5 على اعتراض الكشفPenalties: من
" الغرامة عليهHTL-88191سطر الحجوزاتDispute) سطور زي
.A2/A3". 07.25نفس والـOV بيقولLINE، SAR 1,420 · night 1 · fee زيCancellation والنتيجة
) خصمA6 على اعتراض الكشفDeduction: جوا من
 .1. جدول deductionsفي and السطرPenalties INC-0087، مباشرDisputeمافيهوش السطر" على بيدوس
. 2.)Entry · against you( OV 07.1بيفتح
. 3.Dispute this entry" ← OV 07.14  (A13)"
: A7 سطر من أكتر على الاعتراض بعد القبول
وحالته اعتراضه ليه سطر كل
" rest" the اعتراض.Accept عليها مش اللي السطور كل بيقبل
07.24 سطرOV بيضيف 2 statement later a in comes outcome their - open stay review under lines (مقترح."
) 07.23P3: مختلفA8 مبلغها فاتورة رفع
 .1.12,240 07.26في الإجماليOV والكشف12,360،
. 2This total is 120 SAR more than the statement )12,240 SAR(. You can خطأ (مش أصفر تحذير الحقل، stillتحت
."upload it - we note the difference and follow it up. Your payment is not held
 .3" شغالUpload"
 .4". النتيجة held not payment · tracked · SAR 120 by "Differs = بقىCheck والزرار invoice"، corrected a فيUpload
07.34 : noted" · 120 by ومعاهDiffers ".Replace"،
: الفاتورةA9 استبدال
 أوReplace" invoice" corrected a نفسUpload ← 07.26" بعنوانOV invoice، tax your سطرReplace ومعاه .1The"،
".current invoice INV-JS-2026-0611 stays on record as superseded
 الرفع وV2بعد النشطة، هي "Superseded علىV1 بتتعاد والمطابقة .2.V2"،
. الكارت )1(في versions Earlier اللستة بيفتح ‹" 3.(مقترح
)OV 07.37  ← 07.23P1: اتدفعA10 قديم كشف فاتورة رفع
. 07.23P1" 07.34من reminders( 3 · منMissing أو invoice) tax August "Upload منOverview أو
". 07.37 بعنوانOV SAR 21,300 · SEP 16 PAID · 2026 والقواعد.AUGUST الحقول نفس
 والـالنتيجة: بتقف، التذكيرات بيقلbadge القايمة في
: كشف)A11 كشاشة مرسوم (مش غلط فيها للمشتري الضريبي الرقم فاتورة
) للـ هوتليانا مراجعة (أو المطابقة الرفع، غلطPDFبعد لهوتليانا الضريبي الرقم بتلاقي

---

**p. 265**

."Replace". noted · differs number VAT "Buyer والزرارCheck:
."Buyer VAT number differs · tracked · payment not الكشف heldفي
)OV 07.13  ← OV 07.12  ← OV 07.1: قيدA12 على التواصل
 .1."ADJ-2026-0041 ← OV 07.1  ← "Call Hoteliana بيفتح07.33من
. 07.12 المباشرOV والخط الحساب، ومدير المبلغ، بيعرض: 966 11 000 0000 · 18:00 - 09:00 Thu, - الليSun والمرجع 2)،
 ملاحظة وخانة .اختياريةيقوله،
. بس اتصل غيرCloseلو بتتسجل حاجة مفيش opened". Contact 3.(مقترح"
. 4:"Send the ملاحظة كتب noteلو
كيس FIN-N-2291بيتعمل والقيد .مابيتغيرش،
".Your note is with Hoteliana · Reference FIN-N-2291 · sent today 10:24" : OV 07.13
 .5."‹ You sent a message about this line · FIN-N-2291 · follow it 07.1 بعدهاOV بيعرض
 .6."New entry on your فيالنهاية: بيظهر تصحيح قيد بتعمل هوتليانا اتفقوا، لو وإشعار07.33 account،
)07.15B  ← 07.15  ← 07.14B  ← 07.14A  ← OV 07.14: قيدA13 على الاعتراض
 .1."‹ Dispute this entry instead" : OV 07.1 OV ← entry" this منDispute أو 07.12"،
 .2". 07.14 بيعرضOV وEntry is، it وWhat والمبلغ، Pending، now: والحقولStatus
."wrong amount · not our booking · already paid · charge not agreed · other (إجباريReason
 dispute you القيدAmount كل (الافتراضي
 happened (إجباريWhat
 (اختياريEvidence
 .3 ملف 07.14Aبيرفع : " 📄 send to ready · MB 0.4 · ومعاهRelocation_invoice_HTL-88121.pdf الملف✕"، لشيل
. 4: 07.14B  ← "Send the dispute"
DSP-2026-0008 · Dispute sent to Hoteliana · The entry is now Disputed. 3,540 SAR is held out of your"
".next payment until Hoteliana answers
."Answer due by 28 Sep 2026 · 5 working days"
 .5"Add evidence الصف07.33في الحالةDisputed تبدأ، هوتليانا لما review". under · وDisputed 07.15"، بـOV بيسمح
بس.
. 6Resolved in your favour · Reversal entry ADJ-2026-0043 · + 1,200 SAR · Status now" : 07.15Bالنتيجة
).A14 Settled ضدكأو".
) 07.15B: علىA14 مبني مرسوم؛ (مش ضدك اتحسم قيد على اعتراض
."Not resolved in your favourالعنوان
."Hoteliana kept the entry as it was. Reason: {reason}. The held 3,540 SAR stays deducted"
.Closed by: }date{ · "Rejected وOutcome: "Settled"، now: وStatus }name{"،
Hotelianaالأزرار وCall ."Close"،
)OV 07.3: بحجزA15 مربوط مش قيد

---

**p. 266**

."Booking: "Not linked to a booking
."What it replaces · ADJ-2026-0031 · − 2,050 SAR"
."Effect on bookings: None"
الأزرار
.OV 07.12  ← "Call Hoteliana"
." )BR-07-05("  07.33 ← account" the Open لـ. اسمه adjustmentsيتغير (مقترحAll
." dispute" the اعتراضSee عليه لو بس بيظهر 07.15": OV entryمكانه. this اعتراضDispute مفيش لو
) OV 07.2: لصالحكA16 قيد
+" 980 ومفيشSAR ."Dispute"،
.) bookings.view_financial" ← note" a "Send ←  07.12 وOV booking، the عندهOpen (لو الحجز صفحة
) OV 07.38  ← 07.20N: سدادA17 ← لهوتليانا فلوس عليك
 .1.2,310 bookingحجز قيدOn ← الدفع بعد اتلغى owed بـRefund
. 2: 07.20N بيبقىOverview
".You owe Hoteliana 2,310 SAR ... It is taken from your next payment automaticallyبانر
".YOU OWE HOTELIANA 2,310كارت
 PAYMENT صافي.NEXT بقى
 now" it pay to "How ←  07.38 وOV البنك، IBAN: ومعاهكامل Copy مخفيه)" التصميم والمرجع(مقترح؛ والمبلغ، .3JEWAR-،
transfer the on it write - وNEG-2026-09 ."Done"،
 .4. Done" بس، بيقفل حوّل" المورد إن ومابيسجلش توصل الفلوس لما بتأكد هوتليانا
 .5."We received your transfer of 2,310 القيد ← التحويل بتطابق وإشعارSettledهوتليانا بيختفي، والبانر SAR"،
. 6."Settled · deducted from PAY-018 دفعةأو أول مايحولش: وBR-07-60 المبلغ، بتخصم بتعرض07.33)
 A18 وعدّى فلوس عليك مرسوم)60: (مش يوم
Please transfer 2,310 SAR to Hoteliana. It has been open for 60 days and there is no أحمر بيبقى paymentالبانر
."coming to take it from
."How to pay it الأساسي nowالزرار
 للـ هوتليانا.Ownerإيميل لمالية وتنبيه المالية، ومستخدمي
)07.20H: موقوفةA19 المدفوعات
Payments to you are paused · Since 22 Sep · reason: }reason{. Your bookings and الكروت فوق statementsبانر
."keep counting - nothing is lost
السبب حسب بيتغير الأخير :)BR-07-80السطر
."bank account check: "Your account manager will contact you; nothing is needed from you now
".bank account change: "Released as soon as your new bank account is conﬁrmed
bank letter expired: "Upload a new bank letter to release them." + "Upload bank letter" (Owner) ←
.Company changes
.a payment came back: "Update your bank account to release them." + "Update bank account" (Owner)

---

**p. 267**

."NEXT PAYMENT: "Paused · SAR 18,450 waiting · released after the checkكارت
".Status: Paused · 18,450 البانر فينفس 07.32 الكشفPayments جوا الدفع كارت وفي SAR،
".Payments to you are running وإشعار بيختفي، البانر يترفع: الإيقاف againلما
)07.32R: رجعتA20 دفعة
 بيرجّع .1.PAY-017البنك
. 2.Returned" )danger(الصف
. 3A payment came back · PAY-017 · 18,450 SAR for the September statement came back from your bankالبانر
on 17 Oct - the account is closed. Update your bank account; we pay it again within 2 working days after the
".new account is veriﬁed
 .4Owner: "Ask the Owner to update the bank. )A22(الـ changes Company ← account" bank "Update الـOwner: غير
."account
 .5."a payment came back Overviewالكشف Oct". 17 · "Returned بانرPayment بسببA19:
. 6."PAY-018 "Re-payment of PAY-017"  جديد صف التأكيد: "Paidبعد
: الدفعA21 قبل اترفعت والفاتورة اعتراض أي غير من كشف
.Paid✓ الـ pathده لـHappy بيوصل الكشف 07.23P2. : Aug" 2 · وفاتورةAccepted Matches"،
)Owner: البنكيA22 الحساب تغيير طلب
 .1 07.36 ← change" a (للـRequest بسOwner"
 .2" ( 01.6C ،UI وبند بيتفتح account متختارBank
 الـIBANبيدخل من (بيتملى والبنك الحساب، صاحب واسم الجديد، البنكIBAN وخطاب 01.6J)، والسببOV .3)،
. 4We will call the Owner on the number we have on ﬁle to conﬁrm. Payments". requestالمراجعة الرسالةSend
."wait until the change is conﬁrmed - usually 1 working day
 .5: 07.36
.Change requested · }date{ · Waiting for Hoteliana" شريط فيه البنك )info(كارت
ظاهر. لسه الحالي الحساب
".View request" change" a ومكانهRequest بيتشال،
 .6.Payments الإيقاف السببA19بانر change، account فيbank وOverview")
. وتوافق بتتصل 7هوتليانا
".Active · Veriﬁed }date{ · call-back by الجديد Hotelianaالحساب
 للـ القديمة.Ownerإيميل الاتصال ولجهة
" فيها اللي الشاشات وكل بيترفع، بتتحدث.4417الإيقاف
. 8."Request again وأو بالسبب، وإشعار تاني)، سبب مفيش (لو بيترفع والإيقاف يفضل، القديم الحساب بسبب: بترفض
: التقاريرA23
 .1" 07.35 ← تقريرOpen" أي على
 ( الافتراضي بالمدى بيفتح مقترحالتقرير فات، اللي ظاهرةالشهر والفلاتر .2)،

---

**p. 268**

 .3 ← on/Hotelبيغيرّ based بيتحدثواFrom/To/Date والكروت الجدول
. 4. Hoteliana_}report{_}from{_}to{.xlsx) ← أوExcel" "PDF" ( باسمfinance.export بينزل الملف
 .5. 07.35" ←" reports لـAll بيرجع
) OV 07.9 Export صفحةA24: أي من
فيExport" وEarnings" وStatements، وPayments، وAdjustments، .Overview،
07.9 OV بالاختيارات بيتفتح الصفحة حسب :على
" view" in rows N (الافتراضيThe
."A full year"
 payment" (منOne بسPayments"
CSV أوFORMAT: أوExcel، .PDF،
. guest.pii قايمةCOLUMNS عمودcheckbox: لـGuest. بس بيظهر
.5,000" ← rowsالزرار N Export من أكتر لو بالإيميل أو ينزل، الملف
A25: Earnings
 .1 بفلاتر07.21
.Search: Booking or guest
: والجايPeriod الحالي الشهر الافتراضي
.Date based on: Check-out / Due date / Booking date
وHotel term، وPayment .Status،
 Open" الحجز صفحة ← صف أي على هو" ثابت،بتاعته حجز (مش الفلوسS9 قسم على .2)،
 .3."Sep - Oct · 8 of 14 bookings · due to you 31,920 SAR · paid 8,570 SAR بيتحدثFooterالـ
 عقودA26 عنده مورد booking: On / arrival بسOn
."Statements خاصة07.22 فاضية حالة بيعرض ومفيش20،6 علىbadge)،
كارتOverview REVIEW: TO ومكانهSTATEMENT بيتشال، PAYMENT" ON-ARRIVAL NEXT .(مقترح"
) UI 11.18: لسهA27 مستحقة حاجة مفيش
لسه خرج محدش بس حجوزات عنده مورد
":You have business. None of it is due yet بيعرضOverview
.Upcoming: SAR 42,000 · 50 bookings
.Waiting to be settled: 0
.Paid: 0
.Entries against you: 0
."Your earliest checkout is 12 Oct 2026"
.)Q7" فيه⚠ الحالي النص cycle payment no is يتعدلThere ولازم غلط، وده

---

**p. 269**

)Exception ﬂows( 5 الاستثناءات. والأخطاء
finance.view: مالوشE1
.URL أو:Triggerالـ إشعار، أو مالية، لينك أي فتح
What this." بيظهر اللي  11.4 UI : have" not do you permission a needs screen This · permission وMissing
".Back to }dashboard/bookings{" ﬁnance see needs: والأزرارscreen access". for Owner the وAsk
.Top bar" بيتحفظ: وأصلاًاللي مفيش. الـFinance في ظاهرة مش
 عندهE2 (مثلاًfinance.view: فعل لينك على ودخل بس إيميل)statements/2026-09?action=accept من
بيظهر: والـاللي عادي، بتفتح الصفحة overlay سطرمابيتفتحش الزرار ومكان .BR-07-90،
: الوقتE3 نفس في الكشف نفس بيقبلوا اتنين
 المستخدم:Triggerالـ داسB statement ماAccept بعد قبلA"
This statement was already accepted by Abdullrahman at 11:20." : OV 07.24 (لـ بيظهر :)Bاللي فيToast/inline
."Nothing else is needed
. 07.23A بيتحفظ: الـاللي بس. الأول القبول لـoverlay بتتحدث والصفحة بيتقفل
: التلقائيE4 القبول بعد القبول
.6 يوم:Triggerالـ من مفتوحة كانت الصفحة وداس5 بعدAccept، يوم00:00
".Refresh." بيظهر اللي 00:00" at Oct 6 on automatically accepted was statement وزرارThis
 بيتحفظ: تغيير.اللي مفيش
: المهلةE5 نهاية بعد سطر على اعتراض
:Triggerالـ  07.25 عدّىOV والوقت مفتوح، يوم23:59 اتقبل5 الكشف أو ،
Contact." بيظهر: الـاللي جوا line a about Hoteliana Contact Oct. 5 on closed window review "The وزرارoverlay:
.OV 07.12  ← "Hoteliana
بيتحفظ: فياللي للملاحظة بتتنقل اتكتبت اللي البيانات مفيش. 07.12 OV .(مقترح
: السطرE6 نفس على بيعترضوا اتنين
Someone on your team already disputed this line )DSP-S-0012 by Faisal, 10:40(. Open it to" (للتاني بيظهر اللي
."add evidence
 بيتحفظ: بساللي الأول
: القيدE7 نفس على بيعترضوا اتنين
. OV 07.15  ← "Open the dispute." بنصE6نفس )DSP-2026-0008(، disputed already is entry وزرارThis
)07.26  / 07.25  / OV 07.14E: مقبولE8 مش الملف
.MB 10 :Triggerالـ من أكبر حجم أو مسموح، مش نوع
use a". بيظهر: الملفاللي تحت MB 10 to up PNG or JPG PDF, a use - MB 14 · الفاتورةHotel_invoice_scan.tiff وفي
".PDF or XML up to 10 MB
 بيتحفظ: بيتشالاللي الملف كلها. الحقول باقي

---

**p. 270**

تانيالحل: ملف يرفع Send الغلط الملف بس الاعتراض، في اختياري المرفق لأن شغال .مابيتبعتش"
: (شبكة)E9 النص في وقع الرفع
."Upload failed - check your connection" + "Retry بيظهر: واللي وقف، تقدم شريط
Waiting for the ﬁle to" بيتحفظ: الحقولاللي كل "Upload / جنبهSend" ومكتوب يتشال، أو يخلص الملف ما لحد مقفول
".ﬁnish
)timeout / 500: فشلE10 الحفظ
."overlay: "We could not send this. Nothing was lost - try again." + "Try again بيظهر اللي  11.8 UI الـinline في
بيتحفظ: الـاللي في يفضل اتكتب اللي كل عملoverlay ولو منRefresh، يرجع draft local .(مقترح)
ليه:Idempotency وملاحظة) وفاتورة، واعتراض، (قبول، إرسال كل request_id الإعادة نسختين. .مابتعملش
: متكررE11 فاتورة رقم
You already used INV-JS-2026-0931 for September 2026. Use the number printed on بيظهر: الحقلاللي تحت
."this invoice
 بيتحفظ: الحقولاللي كل
 لسهE12 لكشف فاتورة review: for Open قديم)API( لينك أو
".Upload the tax invoice after the statement is accepted - it may still change until then" بيظهر اللي
 ديE13 الشركة بتاع مش أو موجود مش الكشف متعدل)URL:
بيظهر اللي statements" "All + statement." this ﬁnd not could We تانية". شركة عند موجود إنه .مابنقولش
: مفتوح)E14 طلب (فيه البنك تغيير بيطلب وهو رجعت دفعة
A payment came back · … Your bank change request from }date{ is being بيظهر: بانراللي لـ07.32R بيتغير
".Update bank account." conﬁrmed is it after days working 2 within again it pay we - زرارchecked ومفيش
" الـE15 غير داسOwner: account bank لينكهUpdate فتح أو
بيظهر اللي know" name{ }Owner let We account. bank the change can Owner the Only للـ." إشعار .)Owner(مقترح:
)Company changes IBAN (فيE16: صالح مش
".Enter a valid Saudi IBAN: SA followed by 22 digits" بيظهر اللي
."This IBAN does not look right - check the digits غلطchecksumلو
 IBAN الحاليE17: زي
".This is already the account we pay into" بيظهر اللي
 E18 (الـ فشلت التأكيد مكالمة مابيردش)Owner:
بتحاولالسلوك: هوتليانا مدى3 على مرات 2 days (مقترح)working بيفضل الطلب Hoteliana. for وبيظهرWaiting We"،
."tried to call {Owner} on +966 5x xxx xx12. We will try again - or call your account manager
بسبب بيترفض الطلب محاولة، آخر conﬁrmبعد to you reach not could شغالWe لسه القديم الحساب لو بيترفع والإيقاف "،

---

**p. 271**

 والـE19 مفتوح البنك تغيير طلب تانيOwner: يطلب بيحاول
Request a" بيظهر: فياللي مقفول البند 01.6C UI : }date{" since open وفيRequest 07.36". : request" بدلView
".change
: التحميلE20 في فشل التقرير
". بيظهر: الجدولاللي مكان again "Try + report." this load not could هيWe ما زي بتفضل الفلاتر
: التقريرE21 في غلط التواريخ مدى
".To ← "The start date must be before the end date بعدFrom
".Pick up to 24 months at a time  من شهر24أكتر
  يصلح.مابيتحدثشالجدول ما لحد
 Export كبيرE22:
."  من صف5,000أكتر minutes 10 within }email{ to it email will We prepared. being is ﬁle الإيميلYour في واللينك
. بعد (مقترح)7بيخلص أيام
."This download link expired. Export the ﬁle again from خلص اللينك Financeلو
: شغالE23 وهو اتشالت الصلاحية
. 07.26 Ownerالـ شالTrigger: فاتحstatement.accept والمستخدم 07.24 أوOV
Your access changed while you were working. You can no longer accept بيظهر اللي  11.15 الإرسالOV عند
statements المكتوبة والبيانات .مابتتبعتش."
. UI 11.4 اتشال خالصfinance.viewلو
: اعتراضE24 بيكتب وهو خلصت الجلسة
. 11.12 OV ← والـLogin الكشف، لنفس بيرجع ← الـoverlay من بالبيانات بيتفتح draft local تترفع(مقترح) لازم المرفوعة الملفات
."Attach your ﬁle ومكتوب againتاني،
): قديمةE25 بيانات المستخدمstale: ورا من اتغير الكشف
 مفتوحة:Triggerالـ والصفحة حصل، التلقائي القبول أو اعتراض، على ردت هوتليانا
". بيظهر: الصفحةاللي فوق شريط "Refresh + it." opened you since changed statement علىThis بيتفحص بعدها فعل أي
بالنسخة اختلفتversionالسيرفر ولو .E3/E4)،
)job يومE26 ماطلعش الكشف الـ1: (فشل
STATEMENT TO REVIEW: "September statement is being prepared - you للمورد بيظهر اللي كارتOverview still،
."get 5 full days to review it
. السلوك بتتنبّهBR-07-22 هوتليانا
: بالسالبE27 كشف
."carried as owed to Hoteliana "0الكشف due وتحتهAmount 1,200"،
".Nothing to pay this month. :Overview  الدفع07.20N وكارت
 والغرامات الحجوزات بإجمالي الفاتورة عادي. شغالين والفاتورة .)Q10(سؤالالقبول

---

**p. 272**

: مرتينE28 (دفع كمان اتخصم والمبلغ وصل لهوتليانا التحويل
" قيدالسلوك: بتعمل هوتليانا settlement double of Refund · favour your إشعارIn الجاية. الدفعة في وبيتدفع المبلغ، بنفس
."You paid 2,310 SAR twice - we add it back to your next payment"
: زيادةE29 أو ناقص بمبلغ لهوتليانا التحويل
."Still owed: 310 بيفضل والباقي جزئي، بيتسدد القيد ← SARناقص
 قيد ← favourزيادة your بالزيادة.In
: الصفحةE30 فاتح وهو وقعت الشبكة
شريطSkeleton ومعاها بيانات، آخر أو date of out be may numbers - offline are You بتبعت اللي الأزرار كل بتستنى."
."Reconnect to ومكتوبالاتصال continue،
: جدولE31 أي تحميل في خطأ
". الجدول againمكان "Try + payments." load not could شغالWe الصفحة باقي
) اتقفلE32 الحساب suspended: أمنيaccount خروج أو
 11.14 UI /  11.13 الـOV الأمنيdrafts. الخروج في بتتمسح المحلية
"Send dispute" / "Accept: علىE33 مرتين ضغط
. ومعاه ضغطة، أول بعد بيتقفل بالـspinnerالزرار التكرار بيرفض والسيرفر request_id،
Esc بـE34 واتقفل كتابة فيه أوفرلاي أو✕:
 changes" شكلDiscard بنفس 03.11?" OV : editing" "Keep / الـDiscard" برا الضغط modal". بياناتمابيقفلوش فيه لو
6 حالات. مش موجودة في التصميم
السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
1 07.Dقايمة لمستخدمOV
 بسfinance.viewعنده
 07.D الـOV الـ8كل قراءة). (كلهم ظاهرين عناصر ظاهرةbadges
2" علىBadge لماPayments
رجعت دفعة
active Payments · 07.D BadgeOV "!" أحمر تتعاد(مقترح) الدفعة لما ويختفي ،
3" "Adjustments لماBadge
مااتفتحش ضدك جديد قيد فيه
07.D OV فتحها ماحدش اللي ضدك القيود بعدد (مقترح)رقم
4 صفحةLoading لأي مرة أول
مالية
spinner مشSkeleton07.20 والجدول، الكروت بشكل
5 صفرOverview كلها والفلوس
حجز ولا مالوش جديد (مورد
No money 11.19 الجديدUI للمورد الفاضية yet/الحالة
."- your ﬁrst booking starts it." + "See your contracts
11.18  مش
UI 11.18
6 فيOverview حاجة غير من
"Needs you"
Nothing needs you right سطر أو كله، بيتشال nowالقسم
(مقترح)✓
07.20

---

**p. 273**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
73" you" Needs من أكتر فيه
حاجات
 فاتورة3أول ← للمراجعة كشف ← ضدك (فلوس بالأولوية
و رجعت)، دفعة ← )5(ناقصة all See (مقترح)"
07.20
8: موقوفةOverview المدفوعات
الوقتو نفس في فلوس عليك
"You owe) 07.20H +  الإيقاف07.20N بعض: فوق وبعدهwarningبانرين الأول،
9: فيA20بانر فيOverview (مش ومعاهPayments بس)، رجعتOverview دفعة
Owner" account" bank للـUpdate
07.32R
10" up" (مفيشComing فاضي
جاية دفعات
No payments scheduled yet. Payments appear here"
".once a booking is due
07.20
115" up" Coming من أكتر
صفوف
Due و5أول Earnings in all "See ←  على07.21 متفلترة
date (مقترح)
07.20
12Coming" صفOpenزرار في
"up
 الكشف بتاع حجز07.23الصف صف الشهر. بتاع
 صف الحجز. Buildingصفحة (أكتوبر متفلترة07.21"
 check-outعلى أكتوبر
07.20
13All terms and bank"
"account
07.36  ←07.20
14STATEMENT TOكارت
" مفتوحREVIEW كشف ومفيش
None to review · next on 1 Nov" (neutral)"07.20
15: مالوشEarnings مستخدم
guest.pii
الضيف hiddenعمود والبحثGuest placeholder"،
"Booking reference
07.21
16: 03.0B ﬁlters"UI "Clear + ﬁlters." these matches نتايجEarnings"Nothing مالوش فلتر
17: المبلغ والحالة0الصف: due"، nothing · مجانيEarningsCancelled اتلغى حجز
neutral)
07.21
18On booking: حجزEarnings
الدفع بعد اتلغى
Refund owed −2,310"" + الحجز سطرPaidصفين:
"Deducted from PAY-018
07.21
19: ماخرجشEarnings لسه حجز
(After check-out)
)neutral(" statement" Oct in · والـUpcoming Due،
 = المتوقعdate كشفه دفع يوم
07.21
20 لموردStatements فاضي
After عقود check-outمالوش
No statements for your contracts · Your contracts"
are paid on arrival or on booking, so there is no
monthly statement. Every payment is under
"Payments." + "Open payments
07.22E
21: غيرStatements من شهر
فيهم شهرين بين كشف
October 2026 · no check-outs · رمادي noصف
 statement ضاعت(مقترح)" حاجة إن مايفتكرش المورد عشان
07.22
22Hotel:  المبلغ ده. الفندق فيها اللي الكشوف (مبلغمايتغيرشبيعرض فلترStatements
"whole تحته ومكتوب كله)، statementالكشف
07.22
23: كشفStatements
" الحاليBuilding" للشهر
أول Novصف 1 issued · building · 2026 "،October
"Open ومفيش النهارده، لحد والمبلغ للمراجعةOpenوالعدد
 ←  متفلترة07.21
07.22
24"Showing 5 of 12زرار all (مشShow الصفحة نفس في الجدول بيفرد 12الكشف"
25  من أكتر لو جديدة). :50صفحة بـpagination
07.23

---

**p. 274**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
فلتر مع 25الكشف
Hotel/Contract
chip "Filtered: … · وفوقهم بتتفلتر، والجداول Clear".الكروت
 due وAmount Accept كله للكشف دايمًا
07.23
حادثة فيه حجز سطر 26الكشف:
مفتوحة
 )warning( open" "Incident والمبلغBadge الحجز، جنب
هو ما )BR-07-27زي
07.23
27"Not والنص0المبلغ INC-0087، · relocated ومفيشGuest سطر"، suppliedالكشف:
" القيد)Dispute" من (الاعتراض
07.23
جدول Julyفي · "Correction deductions: and سطرPenalties 28Correctionالكشف:
"Dispute" }reason{ · HTL-87980 · وعليهstatement
سطر أي زي
07.23P1
29 monthجدول this check-outs "No والكشفBookings: بـ."، بس0الكشف (قيود حجوزات
برضه )BR-07-25بيطلع
07.23
07.23 +  بالسالبE2707.20N 30الكشف
الدفع waitingكارت SAR 18,450 · Paused · موقوفة".Status المدفوعات وقت 31الكشف
عادي الكشف باقي
07.23
الدفع isكارت account the · Oct 17 · رجعتReturned والدفعة 32الكشف
closed" + "Update bank account" (Owner)
07.32R  + 07.23
الـ عدّى اعتراض 332الكشف:
working days
)warning(السطر overdue" answer · review ،Under
."Hoteliana has been remindedونص
07.23B
جزء على اتوافق اعتراض 34الكشف:
منه
A407.23E
 بنتايج اعتراض من أكتر 35الكشف:
مختلفة
lines answered: 1 2 بحالته سطر واحدBannerكل
."agreed (+560 in October), 1 rejected
07.23E
36: 07.25 متوقعOV مبلغ
السطر مبلغ
Enter the amount you expect - it is the sameخطأ
."as the statement
OV 07.25
37Reason: "Penalty" · rooms" or nights "Wrong · rate" 07.25Wrong قايمةOV
missing or wrong" · "Not our booking" · "Guest
"Other" "Other · no-show" a not - stayed .(مقترح"
 إجباريNOTEبيخلّي
OV 07.25
38 07.24 عليهاOV سطور وفيه
اعتراض
line under review stays open - its إضافي 1سطر
Accept." statement later a in comes والزرارoutcome
"the rest
OV 07.24
39: 07.24 فيOV لازق العنوان
✕
 07.24 والـ16pxمسافةOV العنوان بين التصميم✕ مراجعة (من
40Open وقت الفاتورة forكارت
"review
Not uploaded yet · Upload it when the statement is"
)BR-07-47( ﬁnal زرار." غير من
07.23
41: 07.26 مختلفOV الإجمالي
الرفع قبل
 07.26 أصفرOV A8تحذير أحمرمش. خطأ

---

**p. 275**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
42 07.26 OV : قيمXML فيه
اتكتب اللي عن مختلفة
الـ من بتتملى XMLالحقول غيرّها المستخدم ولو This،
differs from the ﬁle (18,450). We use what is in the
ﬁle (مقترح."
OV 07.26
07.26 future"OV the in be cannot date invoice المستقبل."The في تاريخ 43الفاتورة:
فترة نهاية قبل تاريخ 44الفاتورة:
الكشف
This invoice is dated before خطأ (مش theتحذير
statement period ended (30 Sep). Check it is the
".right one
OV 07.26
)1(" versions والمبلغ،Earlier والتاريخ، الرقم، لستة: ← ‹" القديمة النسخ عرض 45الفاتورة:
}name{و by }date{ · وSuperseded "View"،
07.23C
46" 01.6 OV فيPDFمعاينةpreview drawer ( للـ✕ تحميل أو بس)، الحاليةViewالفاتورةXML للفاتورة
47: دفعات ولا كشوف مفيش yet.لو needed invoices tax invoicesNo وفاضيTax فلتر
You upload one for each statement and one a month
".for bookings paid on booking or on arrival
07.34
48Tax invoices: "Upload tax
" يختارinvoice ما غير من فوق
فترة
dropdown( "?Which period 07.26 أولىOV بخطوة
بس المختلفة أو الناقصة بالفترات
OV 07.37
49: invoices حاجةTax مفيش
ناقصة
✓ All tax invoices are ومكانه07.34 بيتشال، الأصفر inالبانر
50 KPIs الحالةPayments: في
الفاضية
yet" payments no · 0 YEAR THIS وPAID LAST"،
" = وPAYMENT —"، PAYMENT أوNEXT جاية دفعة أقرب
 في"—". اللي الأرقام 07.32Eمش
07.32E
51: ماPayments بعد اتعادت دفعة
رجعت
PAY-018 "Re-payment" "Returnedصفين وPAY-017
"of PAY-017" "Paid
07.32R
520: مبلغهاPayments دفعة
 الدفعة أكل (الخصم
Deducted in full" : في سطر دفعة. صف 07.33مفيش
from the September statement · nothing
"transferred
07.32
53 advice مبالغRemittance فيه
محجوزة
"Held back · 3,540 SAR · DSP-2026-0008 disputed"
للاعتراض ولينك
OV 07.11
54: advice عرضRemittance
السطور
الملخص تحت وBooking/Entryجدول وWhat، ،Amount،
 الكشف (مقترح)بترتيب
OV 07.11
55 advice لدفعةRemittance
Returned
" 07.11 }date{علامةOV · (للأرشيفReturned شغال والتحميل فوق،
56: وYear /، owed Refund / you Against / )Recovery فلاترAdjustmentsType
Reversal( / favour your وIn وStatus، Hotel، (مقترح
07.33
57: a" with only one posts Hoteliana adjustments. فاضيAdjustmentsNo
".reason - you see it here the same day
07.32E
58: 07.1 ملاحظةOV عليه القيد
مبعوتة
You sent a message about this line · FIN-N-2291 ·"
 ‹" it الكيسfollow ← واللينك (موجود)،
OV 07.1

---

**p. 276**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
59: entry" this ومكانهDispute بيتشال، ·" dispute the 07.1See اعتراضOV عليه القيد
OV 07.15  ← "DSP-2026-0008 · Disputed
OV 07.3
60: 07.1 عليهOV عدّى القيد
 يوم30
The dispute" entry" this والسطرDispute بيتشال،
window closed on {date}. Call Hoteliana if something
".is still wrong
OV 07.1
61: 07.1 again"OV "Try + now." right available not is ﬁle 07.1"The متاحOV مش المرفق
62 07.12 الـOV بيكلمOwner:
العمل ساعات بره
Outside working hours - leave a note and weالسطر
."call you back on the next working day
OV 07.12
63Send the" : OV 07.12
" فاضيةnote والملاحظة
Write your note ﬁrst, الضغط عند مابيتقفلش. orالزرار
."close and just call
OV 07.12
64Add" : OV 07.15
"evidence
You cannot change a dispute once تحت رفع itمنطقة
sent ويروحis بيتسجل جديد مرفق كل الملف. قواعد ونفس …"،
لهوتليانا
OV 07.14A
65: 07.15 عنOV اتأخر الرد
الميعاد
Answer due by 23 Sep 2026 · overdue - Hoteliana"
has been reminded" (warning)
OV 07.15
66: وكارت بيختفي، nothingالبانر · 0 HOTELIANA OWE اتسددت07.20NYOU الفلوس
settle وإشعارto "،
07.20
67: من07.20N جزئي خصم
الدفعة
You owe Hoteliana 1,310 SAR · 1,000 wasالبانر
."taken from PAY-018 on 12 Oct
07.20N
68: 07.38 جنبCopyزرارOV وIBAN" والمبلغ، والمرجع "Copied 07.38"Toast البياناتOV نسخ
69: مالوشReports المستخدم
finance.export
" وExcel"07.35.1 شغالPDF" بيفضل الشاشة على التقرير بيتشالوا.
70"Reports: "no data بتبقى 0الكروت "—"، أو الأوسع المدى أرقام زيمش
 الحالي07.36E
07.36E
71Reports: Account
 بعيدstatement لمدى
. balance قبلOpening الحركات كل من مترقّمFrom الجدول
50بـ صف (مقترح
07.35.1
72 Aging متأخرReports: وفيه
هوتليانا من
OVERDUE · 18,450 · September statement · due 16"
Paused · )danger( إيقافOct" السبب ولو bank،
)warning( change" كـaccount مش لوحده ويتحسب ،
"متأخر
07.35.4
73Reports: Earnings by hotel
  من شهور3بأكتر
" من07.35.2 بتتحسب الشهور وFrom/Toأعمدة للمدىTOTAL،
74: معReports مابقاش الفندق
(اتشال )accessالمورد
)"no longer ومعاه07.35.2 باسمه القديمة التقارير في yoursبيظهر
75Owner: ظاهر البنك مخفيIBANكارت و4417 a)، مشBankRequest المستخدم
Only the Owner can change the bank" مكانهchange
".account
07.36

---

**p. 277**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
76: forشريط Waiting · Sep 26 on requested "Change مفتوحBankinfo: تغيير طلب
Hoteliana · payments wait until it is conﬁrmed" +
""View request
07.36
77: approved:شريط not was change bank "Your اترفضBankdanger: الطلب
Company )Owner( again" "Request + بيفتح}reason{."
 القديمةchanges بالقيم متعبي
01.6G  Flow 01
78: بنكيBank حساب مفيش
جديد (مورد خالص
No bank account yet · Add one so we can pay you.""
. )Owner( account" bank موقوفةAdd والمدفوعات
"no bank accountبسبب
07.36
79: يخلصBank قرب البنك خطاب
(T-30)
warning: "Your bank letter expires on }date{.شريط
Upload a new one to keep payments running." +
"Upload bank letter" (Owner)
07.36
80: وعليه ظاهر، بيفضل stillالصف bookings · }date{ termsEnded انتهىPayment عقد
"paid on this term
07.36
81: terms عقدPayment شرط
اتغير
The payment term of }contract{ changed toإشعار
{term} from {date}. Existing bookings keep their
"Changed }date{ فيterm والصف عليه07.36."
07.36
82 بالنموذج09.1Cالداشبورد
الجديد
PAYMENTالكروت وNEXT REVIEW، TO ،STATEMENT
 HOTELIANAو OWE وYOU OPEN، (بدلDISPUTES
07.20  ← "Open ولينك الجاري)، ﬁnanceالحساب
UI 09.1C
وفوقها الحالية، بالحالة بتفتح sinceالصفحة changed اتغيرThis أو اتمسح عنصر بيفتح 83إشعار
."the notiﬁcation - here is where it stands now
صفحة أي
84 ليه فنادقaccessمستخدم على
بس )out_of_scopeمعينة
finance.view   الشركة. مستوى على :(مقترحالمالية
 الـ كلها. الشركة علىscopeبيشوف مابيطبقش الفنادق بتاع
المالية
UI 11.5
85 الأول والسطر الفندق، بيتضمن الملف Alاسم فندقExportFiltered: فلتر وفيه
"Noor Makkah Hotel
OV 07.9
86 الكشفExport صفحة من
("Download PDF")
Draft - وPDF الفلتر، كان مهما السطور، بكل هوتليانا من موقّع
review for open ماتقبلش لسه لو مائية علامة (مقترح"
07.23
87 و بس، قراءة الصفحات 11.6كل فعلUI لأي الماليةAuditorExport اتفتحله
عنده لو finance.exportشغال
UI 11.6
بتفتح والقايمة كارت)، = (صف لكروت بتتحول 88)768pxالموبايلfull-الجداول
overlays full-screen والـwidth sheets،
07.21
)State machine( 7 الحالات.
7.1 الكشف Statement( حالة): المراجعة
إيه/مين اللي منرهاّبيغي  ← الحالةاللونلـ
BuildingneutralBuilding ← — حجزsystem أول check-out: الشهرAfter في

---

**p. 278**

إيه/مين اللي منرهاّبيغي  ← الحالةاللونلـ
Open for review ·
until {5th}
warningBuilding ← Open for
review
1 job يومsystem:
Accepted · {date}successOpen for review ←
Accepted
statement.accept بـsupplier_user
(Accept / Accept the rest)
Accepted
automatically ·
{date}
neutral يبان عشان (مقترح،
المستخدم؛ قبول عن مختلف
(S1
Open for review ←
Accepted automatically
00:00 يومsystem الساعة6:
سطرsystem ولا غير من خلص الشهر شيءBuildingBR-07-: لا ← كشف— (مفيش
(25
.Open for review من رجوع لـAcceptedمفيش
7.2 الكشف حالة: الدفع
الحالةاللونالانتقالمين
Due }date{ / Scheduledneutral← الطلوعsystem بعد
PausedwarningScheduled ↔ Paused system / رجعتhoteliana_user دفعة (بنك،
Paid }date{successScheduled ← Paid + system run( payment البنك تأكيد
Returned }date{dangerPaid ← Returned رجّعsystem (البنك
Paid }date{ )re-payment(successReturned ← Paid تانيhoteliana_user شخص (موافقة
Nothing to payneutralAmount due ≤ 0← لوsystem
)Line( 7.3 سطر في الكشف
الحالةاللونالانتقالمين
In statementneutral—system
Under reviewinfo (Waiting for
Hoteliana)
In statement ← Under reviewsupplier_user
( finance.dispute )
Agreed · +X in {month}successUnder review ← Agreedhoteliana_user
Partly agreed · +X in
{month}
successUnder review ← Partly agreedhoteliana_user
Rejected · see reasondangerUnder review ← Rejectedhoteliana_user
PaidsuccessIn statement / Agreed / Rejected
← Paid
 يتدفعsystem الكشف (لما
7.4 الفاتورة الضريبية
الحالةاللونالانتقالمين
After you acceptneutral—)Open for review لسهsystem (الكشف

---

**p. 279**

الحالةاللونالانتقالمين
Missingwarning Missing ← accept you (بعدAfter
القبول
system
Missing · N reminderswarning كلMissingsystem نفسها ← أيام3
✓ Uploaded · MatchessuccessMissing ← Matches) + supplier_user ( فحصstatement.accept
system
Differs by X · notedwarningMissing ← Differssystem + فحصsupplier_user
Buyer VAT number differs ·
noted
warningMissing/Matches ← Buyer VAT
differs
system / hoteliana_user
Supersededneutral )Replace( Supersededsupplier_user ← جديدةAny (نسخة
ResolvedsuccessDiffers ← Resolved جديدةhoteliana_user فاتورة غير من المتابعة (قفل
(مقترح
)Payment( 7.5 الدفعة
الحالةاللونالانتقالمين
Scheduledneutral← معروفsystem الاستحقاق يوم
PausedwarningScheduled ↔ Pausedhoteliana_user / system
PaidsuccessScheduled ← Paidsystem
ReturneddangerPaid ← Returned البنكsystem (رد
)"Re-payment of PAY-xxx )checker( جديدRe-paidsuccess—hoteliana_user (صف
7.6 صف في (Earnings الحجز من ناحية )الفلوس
الحالةاللونالانتقال
 لسه مستحق ومش اتأكد Upcomingneutralالحجز
Due on arrival / Due on bookingneutral booking On / arrival الدفعOn قبل
In }Mon{ statementneutral: check-out الكشفAfter ودخل خرج
اتدفعت فيها اللي Paidsuccessالدفعة
موقوفة Pausedwarningالمدفوعات
رجعت فيها اللي Returneddangerالدفعة
Cancelled · nothing مجاني dueneutralإلغاء
Penalty · in }Mon{ أو بغرامة statementneutralNo-showإلغاء
Refund owedwarningOn دفع بعد bookingإلغاء

---

**p. 280**

)Entry( 7.7 القيد
الحالةاللونالانتقالمين
PendingwarningPosted ← (معhoteliana_user )checker / (منsystem
حادثة
In {Mon} statement / Taken from next
payment
neutral← Pendingsystem
DisputedwarningPending/In statement ←
Disputed
( finance.dispute ) supplier_user
Disputed · under reviewinfoDisputed ← Under reviewhoteliana_user
Settledsuccess← hoteliana_user / التحويلsystem أو الحسم أو الدفع بعد
 الدفعsystem بعد }date{success← لصالحكPaid (قيد
)-Dispute DSP( 7.8 اعتراض على قيد
الحالةاللونالانتقال
Disputed (Sent)warningsupplier_user ←
Under reviewinfo hoteliana_user ← فتحهSent
Resolved in your favoursuccess)Reversal (+ hoteliana_user ← review قيدUnder
Resolved in partsuccess hoteliana_user ← review Under +( جزئيReversal
Rejecteddanger hoteliana_user ← review (بسببUnder
)Owed( 7.9 عليك لهوتليانا
الحالةاللونالانتقال
Open · deducted from your next ← system owed( Refund الدفعة من أكبر خصم أو سالب، كشف أو paymentwarning،
Partly settled · X still owedwarning ← جزئيOpen خصم
Transfer requesteddanger system ← بعدOpen يوم60
Settledsuccess← اتطابق تحويل أو كامل، خصم
7.10 الحساب البنكي
الحالةاللونالانتقال
Active · Veriﬁed {date}success—
Change requested · Waiting for Hotelianainfo Owner ← طلبActive بعت
checker( + )call-back hoteliana_user ← requested Active(الجديدsuccessChange
Change rejecteddangerChange requested ← hoteliana_user
حساب مالوش Missingdangerمورد
Bank letter expiringwarningT-30

---

**p. 281**

7.11 المدفوعات على مستوى المورد
الحالةاللونالانتقال
 بانر)Running—— (مفيش
Paused · }reason{warning: Paused ↔ Running أوhoteliana_user( انتهىsystem، خطاب / رجعت دفعة / بنك طلب
في⚠ موجودة مش هنا كتير حالات 00.S REF review( for وOpen automatically، وAccepted review، ،Under
.)Q9 وDisputedو وReturned، وMatches، وDiffers، وBuilding، للـSettled، تتضاف لازم فوقglossary). اللي بالألوان
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Amount you OV 07.25
expect · incl. VAT
بالكتير،0رقم عشريتين وخانتين نعم،
999,999.99و
Enter the amount you expect." / "Use"
numbers only, up to 2 decimals." / "Enter the
amount you expect - it is the same as the
".statement
Reason OV reason" a القايمة."Choose 6من 07.25نعم)37#
Note OV  لولا، 07.25Reasonإلا
Other
it" "Keep / wrong." is what Hoteliana 1,000Tell بالكتير حرف (مقترح
".under 1,000 characters
Evidence OV أوPDF أوJPG وPNG 07.25لا10،
وMB 3، بالكتير ملفات (مقترح
Use a PDF, JPG or PNG up to 10 MB." / "You"
".can attach up to 3 ﬁles
Reason OV our not / amount 07.14نعمwrong
booking / already paid /
charge not agreed / other
".Choose a reason"
Amount you OV 07.14
dispute · incl. VAT
وخانتين1من القيد، قيمة لحد نعم
عشريتين
."Enter an amount between 1 and 3,540 SAR"
What OV 07.14
happened
little" a "Add / happened." what Hoteliana لـ10منTell 1,000 حرف نعم(مقترح)
".more detail (at least 10 characters)
Evidence OV أوPDF أوJPG وPNG 07.14لا10،
وMB 3، ملفات (مقترح
"use a PDF, JPG or PNG up to 10 MB"
Add evidence OV و القواعد، للاعتراض5نفس ملفات 07.15لا
 (مقترح)كله
."This dispute already has 5 ﬁles"
File 07.37 / OV up" XML or PDF a "Use / ﬁle." invoice the أوPDFAdd وXML 10، MB 07.26نعم(مقترح)
".to 10 MB
Invoice OV 07.26
number
لـ1من و-40 وأرقام (حروف حرف نعم
للمورد ومايتكررش و/)،
Enter the invoice number as printed." / "You"
".already used {no} for {period}
Invoice date OV المستقبل. في ومش صحيح، 07.26نعمتاريخ
الفترة نهاية قبل لو تحذير
Pick the invoice date." / "The invoice date"
".cannot be in the future
Total incl. VAT OV < 0 عشريتين. وخانتين 07.26نعمالاختلاف،
خطأ مش تحذير
Enter the invoice total." / "Use numbers only,"
".up to 2 decimals

---

**p. 282**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Your VAT OV 07.26
number
الشركة، ملف يبدأ15من رقم بس للقراءة
بـ 3وينتهي
Your VAT number الملف في ناقص لو is(مفيش.
missing from your company proﬁle. Add it
(".under Company changes
Note OV لـ (إجباري 07.12لا
Send the"
" بسnote
call" just and close or ﬁrst, note your 1,000".Write بالكتير حرف (مقترح
What goes in OV 07.9
the ﬁle
افتراضي) اختيار (فيه واحد— نعماختيار
Format OV (افتراضي PDF)Excel— / Excel / 07.9نعمCSV
Columns OV واحد (عمود 07.9نعم
الأقل) على
 لـGuest بس بيظهر
guest.pii
".Pick at least one column"
One payment OV اختار لو 07.9نعم
One"
"payment
payment" a اللستة."Pick من دفعة
Format OV CSV— / 07.11نعمPDF
Reports: From / To ≤ والمدىFrom شهر،24، Toنعم
مفتوحة القديمة والتواريخ
The start date must be before the end date." /"
"."Pick up to 24 months at a time
Reports: Date based التقرير— onنعم)BR-07-97حسب
Reports: واحدAll— فندق أو Hotelلا
Filters: Earnings ≤ حجز2 ورقم حروف، أوHTL- Searchلا
 (لـ بسguest.piiاسم
")Nothing matches— نتيجة (مفيش
Bank change (Company
changes): IBAN
SA + رقم22 حرف)،24 نعم
 mod-97و وchecksum صح،
الحالي
Enter a valid Saudi IBAN: SA followed by 22"
digits." / "This IBAN does not look right -
check the digits." / "This is already the
".account we pay into
Bank change: Account
holder
لـ2من مش120 لو تحذير حرف. نعم
القانوني الاسم زي
This." / name" holder account the تحذيرEnter
name differs from your company's legal name
".({name}). Hoteliana may reject the change
Bank change: الـ— من ومايتعدلشIBANبيتملى Bankنعم،
Bank change: Bank أوPDF أوJPG وPNG letterنعم10،
(بتتراجعMB ومختوم وموقّع ،
يدوي
Add a signed bank letter." / "Use a PDF, JPG"
".or PNG up to 10 MB
Bank change: حرف500— Reasonلا
9 الإشعارات. والإيميلات والسجل
افتراضيين مستلمين
عنده حد كل = المالية" .finance.view"مستخدمي
عنده حد كل = .statement.accept"المقبلين"

---

**p. 283**

مينالقناةRequires #الحدثبيستلم
؟action
actor · action · old →( السجل
(new
(إيميل وباقيin-appالمقبلين طلع)، 1الكشف
المالية )in-appمستخدمي
in-app +
email
 · issued Statement · للمقبليننعمsystem
Building → Open for review
بكرة بتخلص 2المراجعة
)09:00،4(يوم
+ ماتقبلشin-app لسه لو المقبلين،
email
sent reminder Review · نعمsystem
Statement · }name{ قبلin-appلاsupplier_user اللي عدا ما المالية اتقبلمستخدمي 3الكشف
accepted · Open for review →
Accepted
+ تلقائيOwnerالمقبلينin-app اتقبل 4الكشف
email
auto-accepted Statement · فاتورةsystem (بيفتح لا
· Open for review → Accepted
automatically
سطر على 5اعتراض
اتبعت
) + بعت ماليةin-appاللي
هوتليانا
In · disputed Line · in-appلاsupplier_user
statement → Under review · 9,240
→ expected 9,800
6Hoteliana"
answered your
" (اتوافقdispute
اترفض / جزء
+ المقبلينin-app + بعت اللي
email
Line · }name{ لاhoteliana_user
dispute decided · Under review →
Agreed/Partly agreed/Rejected ·
reason
المورد (داخلي). هوتليانا اتأخرمالية اعتراض على 7الرد
" السطرoverdueبيشوف على
internal—system · Dispute answer overdue
الناقصة الفاتورة 8تذكير
 أيام)3(كل
وهوتلياناOwnerالمقبلين ،
بتشوفه
in-app +
email
#N reminder invoice Tax · نعمsystem
invoice Tax · هوتلياناin-appلاsupplier_user مالية + المالية اترفعتمستخدمي 9الفاتورة
uploaded · Missing →
Matches/Differs · INV-… V1
invoice Tax · اتبدلتنفسهمin-appلاsupplier_user 10الفاتورة
replaced · V1 → V2 (V1
Superseded)
(مبلغ مختلفة 11الفاتورة
/ اسم) / ضريبي رقم
+ المقبلينin-app
email
من (متابعة لا
هوتليانا)
system/hoteliana_user · Invoice
mismatch noted · Matches →
Differs by X
فيه والإيميل المالية، اتعملتمستخدمي 12الدفعة
PDF Remittance لأصحاب
 بسfinance.export
in-app +
email
Scheduled · sent Payment · لاsystem
…-→ Paid · PAY-017 · TRF
+ الماليةOwnerin-app مستخدمي + رجعت 13الدفعة
email
Owner Paid · returned Payment · للـنعمsystem
→ Returned · reason
+ الماليةOwnerin-app مستخدمي + اتعادت 14الدفعة
email
sent Re-payment · لاhoteliana_user
· PAY-018 for PAY-017
+ الماليةOwnerin-app مستخدمي + اتوقفت 15المدفوعات
email
السبب لو نعم
فعل محتاج
دفعة (خطاب،
لا كده غير رجعت)،
hoteliana_user/system · Payments
paused · Running → Paused ·
reason

---

**p. 284**

مينالقناةRequires #الحدثبيستلم
؟action
actor · action · old →( السجل
(new
رجعت 16المدفوعات
تشتغل
 + + الماليةOwnerin-app مستخدمي
email
Payments · لاhoteliana_user/system
resumed · Paused → Running
+ الماليةin-app ضدكمستخدمي جديد 17قيد
email
checker( )+ }name{ لاhoteliana_user
· Entry posted · — → Pending ·
−3,540 · reason
— · posted Entry · الماليةin-appلاhoteliana_user لصالحكمستخدمي جديد 18قيد
→ Pending · +980
اتبعتت 19ملاحظة
(FIN-N)
FIN-N- · sent Note · الحسابin-appلاsupplier_user مدير + بعت اللي
…-2291 on ADJ
قيد على 20اعتراض
اتبعت
+ هوتلياناin-app مالية + بعت اللي
email
 (تأكيد
· disputed Entry · لاsupplier_user
Pending → Disputed · 3,540 held
على جديد 21مرفق
اعتراض
· added Evidence · هوتلياناinternal—supplier_user مالية
…-DSP
قيد على 22الاعتراض
اتحسم
+ بعتin-app Ownerاللي
email
· resolved Dispute · لاhoteliana_user
Under review → In your
…-favour/Rejected · Reversal ADJ
0 · opened amount Owed · الماليةOwnerin-appلاsystem مستخدمي + (اتفتح لهوتليانا 23عليك
→ 2,310
دفعة من 24اتخصم
جزئي) / (كامل
· deducted amount Owed · الماليةin-appلاsystem مستخدمي
2,310 → 0 (PAY-018)
25 يوم60عدّى
تحويل اطلب
 + +Owner المالية مستخدمي
هوتليانا مالية
in-app +
email
Open · requested Transfer · نعمsystem
→ Transfer requested
لهوتليانا 26التحويل
وصل
 + + الماليةOwnerin-app مستخدمي
email
received Transfer · لاhoteliana_user
· Open → Settled
Owner + تأكيد) (إيميل اتبعت بنك تغيير 27طلب
المالية )in-appمستخدمي
in-app +
email
Bank · )Owner( لاsupplier_user
change requested · Active →
Change requested
+ Ownerin-app فشلت التأكيد 28مكالمة
email
Call yourنعم
account
("manager
hoteliana_user · Call-back attempt
failed · #N
Owner + القديمة الاتصال اتوافقجهة البنك 29تغيير
 + المالية(إيميل) مستخدمي
in-app +
email
Bank · )checker( لاhoteliana_user
change approved · ····4417 →
····9023
+ اترفضOwnerin-app البنك 30تغيير
email
change Bank · لاhoteliana_user
rejected · reason
قرب البنك 31خطاب
) /T-30يخلص
خلص
Ownerin-app +
email
letter Bank · نعمsystem
expiring/expired

---

**p. 285**

مينالقناةRequires #الحدثبيستلم
؟action
actor · action · old →( السجل
(new
term Payment · الماليةOwnerin-appلاhoteliana_user مستخدمي + اتغير عقد دفع 32شرط
changed · {old} → {new} · from
{date}
33 بالإيميلExport
جاهز
· requested Export · طلبهemailلاsupplier_user اللي
{page}, {rows}
34Remittanceتحميل
 تقرير كشفPDF/
———supplier_user · Downloaded ·
{document}
السجل قواعد
بيسجل سطر actor_typeكل api( / system / hoteliana_user / والوقتsupplier_user والاسم، وUTC+3)، والعنصر، old)،
فيه.new لو والسبب ،
. hoteliana_user السيستم وإيقاف التلقائي مشsystemالقبول
ومايتمسحش. بس، للقراءة السجل
قوالب الـAdminالإيميلات (نفس فيengine بس والإنجليزي .MVP)،
 فيه إيميل linkكل يحطdeep وماينفعش للعنصر، كاملIBAN بس).4
)Acceptance criteria( 10 معايير. القبول
 مالوشبافتراض مستخدم finance.view لما، البوابة، يفتح يبقى الـFinance" في ظاهرة مش bar" وأيTop .1URL،
".see ﬁnance بيفتحfinance/* 11.4 فيهUI ومكتوب
 .2" عندهبافتراض مستخدم finance.view بس، يفتحلما 07.23 review( for Open مفيشيبقى)، statement ولاAccept
 سطورDispute" ومكانهم زرارBR-07-90"، ومفيش شرح.disabled، غير من
 عقدبافتراض check-out بـAfter 15 = N لما، يخلص، الشهر يوميبقى بيطلع الكشف 1 }Mon{" 5 until · review for .3"،Open
 يوم = الدفع لو16وتاريخ قبله شغل يوم آخر أو جمعة/سبت.16
. 4Accepted automatically · كشفبافتراض review for Open حاجة، عمل وماحدش تبقىلما الساعة يوم00:00 6 الحالةيبقى،
}Mon{ والسجل6 system"، = للمقبلين.actor إيميل + وإشعار ،
 .5This statement was مستخدمينبافتراض وA B الكشف، نفس فاتحين لما وبعدهA يقبل يدوسB Accept يبقى، يشوفB
}time{ at A by accepted السجل.already في تاني قبول ومفيش "،
 بـبافتراض كشف 18,450 due Amount علىلما، يعترض المستخدم ويكتبHTL-88205 9,800 السطريبقى، review .6"،Under
".Hoteliana answers within 2 working بيتدفع لسه ميعاده18,450والكشف في والنصBR-07-36 days)،
. بـبافتراض عليه اتوافق اعتراض 560 لما، يطلع، بعده اللي الشهر كشف سطريبقى فيه بـCorrection بـ560 مربوط 7،HTL-88205
مااتغيرش. القديم والكشف
. 8" بافتراض اترفض، اعتراض لما الإشعار، من الكشف يفتح المورد يشوفيبقى agree not did ومفيشHoteliana والسبب،
" السطر.Dispute" على تاني
 .9The review" يومبافتراض عدّى 5 اتقبل، الكشف أو لما الكشف، يفتح المستخدم مفيشيبقى وفيهDispute السطور، على
.OV 07.12." Hoteliana contact line, a raise To }Mon{. 5 on closed ولينكwindow
 .10" كشفبافتراض review for Open يفتحلما، المستخدم 07.34 الصفيبقى، accept you ومفيشAfter فاعلUpload"
ده. للكشف

---

**p. 286**

 .11Differs ومبلغهبافتراض اتقبل كشف 12,240 بـلما، فاتورة يرفع 12,360 والحالةيبقى، ينجح، والرفع الرفع، قبل أصفر تحذير يشوف
noted · 120 مابتتوقفش.by والدفعة "،
 موجودةبافتراض فاتورة V1 يدوسلما، ويرفعReplace V2" يبقى، "Superseded فيV1 وظاهرة versions" والمطابقةEarlier .12"،
 بس.V2على
. اتدفعبافتراض أغسطس كشف 16 Sep فاتورة، ومفيش لما تعدي، الأيام تذكيريبقى بيتبعت و19 و22 25 فاتورةSep ما أول وبيقف 13،
" والـ بتاعbadgeتترفع، invoices بيقل.Tax
. 14".You already used }no{ for }period{ بافتراض المورد، لنفس كده قبل اتستخدم فاتورة رقم لما تانية، لفترة يرفعه الخطأيبقى
حفظ. ومفيش
. ملفبافتراض 14 بصيغةMB TIFF فيلما، يحطه 07.14 OV يظهريبقى، MB 10 to up PNG or JPG PDF, a والملفuse 15"،
تفضل. الحقول وباقي مايتبعتش،
. 163,540 ضدكبافتراض قيد 3,540 Pending( لما)، كله، المبلغ على اعتراض يبعت القيديبقى وDisputed يعرض07.14B"،
".Held back 3,540 payment next your of out held is وفيSAR advice"، الجايRemittance
 بافتراض لصالحه، اتحسم قيد على اعتراض يفتحلما 07.15B OV قيديبقى، فيه جديدReversal في1,200 والقيد07.33) .17،
الجاية. الدفعة في بيتدفع المحجوز والمبلغ مااتعدلش، الأصلي
. 18."Send a بافتراض لصالحك، قيد يفتحلما 07.2 OV مفيشيبقى، entry this وفيهDispute note"،
. فيبافتراض ملاحظة كتب المستخدم 07.12 OV يدوسلما، note the Send كيسيبقى"، يتعمل مايتغيرش،FIN-N والقيد 19،
".You sent a message about this line و بيتحجز، مبلغ 07.1ومفيش يعرضOV
. 20 حجزبافتراض booking اتدفعOn 2,310 واتلغى، لما يتأكد، الإلغاء قيديبقى يتعمل −2,310 owed وRefund يظهر،07.20N،
 من يتخصم نوعهاوالمبلغ كان أيًا جاية دفعة .أول
. 21Partly" 1,310 عليكبافتراض الجاية2,310 والدفعة 1,000 بس، لما تتعمل، الدفعة الدفعةيبقى والباقي0 تحويل)، (مفيش
".settled
 مفتوحبافتراض عليك مبلغ 60 يوم، الـلما اليوم 60 ييجي، أحمريبقى البانر transfer للـPlease وإيميل لماليةOwner…"، وتنبيه .22،
هوتليانا.
. 23" بافتراض  07.38 OV مفتوح، يدوسلما المستخدم الـCopy جنب IBAN" الـيبقى، IBAN والكامل اتنسخ، ماDone غير من بيقفل
حوّل. إنه يسجل
. 24 بسبببافتراض المدفوعات وقفت هوتليانا check account bank يفتحلما"، المورد وOverview Payments والكشف، البانريبقى
و التلاتة، في "Pausedظاهر PAYMENT شغالين.NEXT الفاتورة ورفع والقبول "،
. 25."Update bank account" دفعةبافتراض PAY-017 رجعت، الـلما يفتحOwner 07.32 الصفيبقى، فيهReturned والبانر
."Ask the Owner to update the bank account الـ يشوفOwnerوغير
. الـبافتراض Owner بنك، تغيير طلب بعت لما يتبعت، الطلب بسببيبقى موقوفة المدفوعات change account وbank 2607.36"،
Hotelianaفيه for إيميل.Waiting بيوصلها القديمة الاتصال جهة الموافقة وبعد "،
. 27Only the Owner مستخدمبافتراض (مشAdmin Owner يفتحلما)، 07.36 مفيشيبقى، change a ومكانهRequest can"،
account bank the ياخدchange يقدر مخصص دور أي ومفيش .bank.change."،
 .28 منبافتراض شرطه اتغير عقد arrival لـOn check-out يومAfter 10 يفتحلما، المورد Earnings يبقى، قبل اتأكدت اللي الحجوزات
".After لسه10 arrival كدهOn بعد واللي check-out"،
 .29Guest مستخدمبافتراض مالوشFinance guest.pii يفتحلما، يعملEarnings أو الكشف أو Export الضيفيبقى، عمود
مافيهوشhidden والملف مقفول، بالاسم والبحث .Guest"،
 تقريربافتراض statement Account لما، حركات، مافيهوش مدى يختار يبقى dates" these in والكروتNothing و0"، .30Excel/PDF،
مكتوب. والسبب مقفولين

---

**p. 287**

 .31 بافتراض تقرير، يختارلما بعدFrom To من أكبر مدى أو 24، شهر، مايتحدثشيبقى والجدول تظهر الخطأ رسالة
. بافتراض summary إجماليهVAT لشهر 25,920 لما، يفتح، التقرير يبقى 3,380.87 = وVAT 22,539.13 = Net 32،15/115(
بخانتين).
. بافتراض فيهExport 7,000 صف، يدوسلما Export الرسالةيبقى، minutes 10 within }email{ to it email will 33"،We
 صالح بلينك يوصل أيام.7والإيميل
. 34No statements for your contracts…" + "Open كلهابافتراض عقوده مورد arrival On يفتحلما، Statements يشوفيبقى،
".Your ﬁrst statement is issued on 1 مشpayments November"،
 .35 بافتراض لسه، خرج محدش بس حجوزات عنده مورد يفتحلما Overview يشوفيبقى، 11.18 بـUI 0 > وأقربUpcoming
".empty ومشcheck-out account،
 .36no بافتراض سطر، ولا مافيهوش الشهر يوملما 1 ييجي، ويبقى إشعار، ومفيش بيطلع، كشف مفيش الرمادي07.22 الصف بتعرض
".check-outs
 الـبافتراض يومjob غير الكشف ماطلعش 2 لما، يفتحه، المورد المهلةيبقى }Mon{ 6 "until يوم5( التلقائي والقبول كاملة)، أيام .37،7
مااتغيرش. الدفع وتاريخ
. 38 ضغطبافتراض المستخدم dispute Send بسرعة، مرتين لما" يوصلوا، الطلبين (نفسيبقى اتعمل بس واحد اعتراض
(.request_id
 بافتراض  07.25 OV كتابة، فيه يدوسلما المستخدم أو✕ Esc يظهريبقى، changes الـDiscard برا والضغط .39modal?"،
مابيقفلوش.
. 40 بافتراض الأرقام، كل كارتلما نقارن PAYMENT فيNEXT وفيOverview الداشبوردPayments وفي 09.1C ونفسيبقى، الرقم نفس
التلاتة. في التاريخ
. 41" قايمةبافتراض 07.D صفحةOV على مفتوحة Statements لما، عليها، يبص المستخدم يبقى النشطStatements" العنصر هو
 والـOverview(مش وbadges)، الصح، بالأرقام بيقفلها.Esc برا الضغط أو
. الدفعبافتراض يوم 16 2026 Oct (جمعة)، الـلما run payment يشتغل، الخميسيبقى بيتعمل الدفع 15 الشاشاتOct وكل 42،
.Oct 15بتعرض
11 أسئلة. مفتوحة
في تعديل أو قرار (محتاجة والقواعد التصميم بين :)Figmaتعارضات
.560 − 18,450 = 17,890 الاعتراضQ1 وقت الدفع (مبلغ   و07.23B و07.23E بيدفعوا07.23F
  بيطالب الاعتراض بزيادةبس الـ560 من جزء مفيش يعني خلاف18,450، عليه
 الرفض حالة 07.23Fوفي المورد خلاف.560بيخسر) عليها مش اللي فلوسه من
في (مكتوب بيتدفع):BR-07-36اقتراحي الكشف لقدّام.18,450 بيتحسم والفرق ،
. الـ Ownerلو فعلاً: يحجز عايز  الحجز يبقى المبلغ بيقلل الاعتراض لما بس عليه المعترض السطر بقيمة مطلوب. تأكيد
 (التواريخ):Q2
2026" Oct 5 Oct": 5 Sun by Review اتنين .يوم
 16 2026 Oct المقترحةجمعة القاعدة موافقةBR-07-17. محتاجة قبله) شغل يوم (آخر
Oct 12 الجايةQ3 هي دفعة (أنهي  بتقولOverview Oct 16 payment وجدولNext (الكشف)، up" دفعةComing فيه
 arrival( On و4,800 Payments،  بتقول07.32 Oct 12 · 4,800 PAYMENT NEXT كلاقتراحي:. في نوع، أي من دفعة أقرب
الشاشات

---

**p. 288**

 عليكQ4 اللي (الفلوس
بتقول07.20N payment next your from بيقولtaken والكارت statement"، next your from deducted اقتراحي".
" payment" نوعnext (أي
.Nov 1 = بيقولF1قرار يوم60 بتقول والشاشة Nov، 30 on open بتاريخstill القيد 2". وSep 60،
.Copy····( 07.38 بيعرضOV IBAN هوتليانا مخفي
 قيدQ5 على الاعتراض على الرد (مدة
.working days 5 07.14 OV / بيقولوا07.14B
."working days 2 بتقول07.33
.working days الكشف في سطر على 2الاعتراض
للقيود؟ نعتمد رقم أي
 (الـQ6 القديمة):overlays
07.1 وOV و07.2 و07.3 و07.9 و07.11 و07.12 و07.13 و07.14* 07.15* لغة فيها لسه الجاري :الحساب
Everything not paid yet · from" went وbalance account…"، the to وBack account"، the وOpen balance"،
."9,500
الجديدة الشاشات عن مختلفة الأرقام
.07.23 / 07.33 −3,540 فيADJ-2026-0041 07.1 OV ↔ −3,100 فيINC-0087
. 07.32" lines 3 · 11,460 · Sep "8 فيPAY-014 07.11" OV ↔ 16" 14,980 · statement July · فيAug
.BR-07-06 حسب يتعدلوا وBR-07-05محتاجين
"There is no payment cycle تانيةQ7 شاشات في قديمة (نصوص   09.R وREF 09.1C وUI 11.18 بيقولواUI لسه
". disputeو no has portal وThe promised" date no · SETTLED BE TO شهريWAITING (كشف الجديد النموذج ضد ده
".Disputes يضيف والداشبورد يتعدلوا، محتاجين openاعتراض).
 (الصلاحيات):Q8
. Sep(قرار )26 مفتاحF7 فيه لوحدهinvoice.upload 08.R جواREF الرفع حاطط علىstatement.accept مشيت أنا
 (الـ08.R بيكسب).REF
. بيعرّف08.R finance.dispute للاعتراض قيد على يعترض مين بيقول ومش الكشف، في سطر المفتاحعلى نفس اقترحت
مظبوطين؟ الاتنين هل
If a state is not on this list, it does (الحالات):Q9 في موجودة مش الجديدة المالية حالات 00.S بتقولREF والقاعدة not،
.7". badge a فيget اللي بالألوان نضيفها محتاجين
لـS1وكمان مختلف لون طلب automatically واقترحتAccepted .neutral"،
 والفاتورة):Q10 بالسالب (الكشف بس والغرامات الحجوزات بإجمالي بإيه؟ ضريبية فاتورة يعمل المورد بالسالب، طلع الكشف لو
قرار فاتورة، مش only(والخصم deductions are recoveries فاتورة؟ مفيش ولا الضريبي")؟ للمستشار سؤال
 القبول):Q11 بعد اتغير المبلغ لو (فاتورة ما زي الكشف بمبلغ ده الشهر فاتورة يعني الجاي. للكشف بيروح الفرق عليه، اتوافق اعتراض لو
أيوه (افترضت اتقبل؟
Finance "never the guest's الضيفQ12 (هوية  وEarnings الضيف، اسم بيعرضوا والتقارير والكشف 08.R بيقولREF
. اقترحتidentity )BR-07-91(". hidden" صح؟Guest ده

---

**p. 289**

 (الـQ13 picker قاعدة):date )DECISIONS( supplier" the for closed are days والفلاترPast التقارير على تتطبق مينفعش
للمالية استثناء اقترحت
.07.35E  الشاشاتQ14 (تسمية   07.36E معUI بيتلخبط بيانات) غير من (تقرير 07.36 UI (البنك). اقتراحي
 بأرقامQ15 الفاضية (الحالات   و07.32E بيعرضوا07.36E يبقواKPIs لازم فاضية. حالة وهي أرقام مليانة أو0
.Due date. (تقريرQ16 :)Aging on" based مكتوبDate المنطقيCheck-out"
within 2 working days after the البنكQ17 (مدة   بيقول07.36 day working 1 usually و للتأكيد، بيقول07.32R"
" veriﬁed is account المكانينnew في يتقالوا الاتنين لازم بس متعارضين، مش الدفع. لإعادة
بيزنس أسئلة
 عقود:Q18 لو check-out ليهاAfter المورد نفس عند مختلفN  و15( 30 إزاي؟ بيتدفع الواحد الكشف مثلاً)، دفعاقتراحي: صف
الكشف نفس جوا تاريخ لكل
أو:Q19 (إلغاء الغرامة No-show كشف بتدخل الإلغاء) شهر ولا الـ الأصليcheck-outشهر نهائية بقت ما شهر اقترحت BR-07-؟
 .)24  بيحط07.23P1 عقدNo-show من arrival الليOn الموردين يعني الكشف، في arrival كشوفOn عندهم هيبقى بس
للغرامات؟
.Refund owed لدفعة:Q20 القطع ميعاد arrival (اقترحتOn لو18:00 يحصل اللي وإيه اقترحتNo-show)، الدفع؟ بعد اتبلّغ
 (اقترحت:Q21 قيد على الاعتراض مدة خلاص؟30 اتخصم قيد على يعترض ينفع وهل القيد)، تاريخ من يوم
 فيه:Q22 هل agreed" (قرار"Partly سطر على للاعتراض بس)؟F9 حالتين فيه والتصميم ذكره،
" "Done فيQ23: 07.38" نضيفOV it: transferred have (سبتهاI بس؟ تقفل نسيبها ولا التحويل، على تدور هوتليانا عشان
التصميم زي بس تقفل
 :Q24 فشلت التأكيد مكالمة لأن البنك تغيير رفض بعد الحساب3 لو أيوه (افترضت القديم؟ الحساب على ويدفع يترفع الإيقاف مرات،
دفعة مارجّعش القديم
الـ:Q25 ياخدAuditor اتفتحلهfinance.export لو تلقائي ؟finance.view
 الـ:Q26 اللي المستخدم مستوىaccess على الكشف لأن أيوه، (اقترحت كلها؟ الشركة مالية يشوف بس، معينة فنادق على بتاعه
الشركة

---

**p. 290**

