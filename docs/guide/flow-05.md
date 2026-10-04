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

# Flow 05 · Bookings

Bookings 05: (Flow )الحجوزات
1 الهدف. والنطاق
 موجود: ده الفلو الـليه طلبات على ويرد فنادقه، على اتعمل حجز كل يشوف لازم المورد Request رقمOn ويدخّل تخلص، المهلة ما قبل
  الفندق مسارHCNتأكيد على السكن يسجّل الوكيل عشان غرفة لكل Masar) ويبلّغNusuk مؤكد.Hoteliana)، حجز ينفّذ هيقدر مش لو
بنفسه. مؤكد حجز بيلغي ما عمره المورد
النطاق ):MVPجوه
 /05.0B  / 05.0A  +( الحجوزات 05.0قايمة بالـUI chips والـstatus والترتيب، والفلاتر، والبحث، والـExport، Pagination،
).page 2 وصفحات05.0C
.)On Request answer"شريط your for waiting الـrequests (كروت الجدول فوق
حجز Requestصفحة On  05.1 الـUI عدّاد SLA: وتأكيد 05.2، OV /  05.2S /  بسبب05.2B ورفض 05.3، OV /  ،05.3A
).Expired( UI 05.6) 05.5والنتيجة UI وRejected(
 مؤكد حجز 05.4صفحة UI pending( ناقصة)،05.4P)،reference (أرقام تمام)،05.11 (كله مفتوحة)،05.4B (قضية
 ورقمها05.11C اتلغت (غرفة اتستخدم).05.11G)،Void جنسية (سعر
. 05.10S  / OV  التأكيد أرقام 05.10إضافة/تعديل
 مشكلة عن 05.12التبليغ OV ←  05.13 قضيةOV (بيفتح incident هيتنفذ).Fulﬁlment مش الحجز إن السبب لو
الصلاحيات ،bookings.confirm،bookings.view_financial،bookings.view_operational،guest.piiفصل
.bookings.reject
) الحجز snapshotلقطة بسBooking للقراية
(مش النطاق ):MVPبرا
مؤجل). مش نهائيًا، (ممنوع مؤكد حجز يعدّل أو يلغي المورد إن
).P2 /  من التأكيد أرقام جماعيExcelاستيراد لصق
).P2( Madinah linked bookingالـ
).MVP النظام سعر بدل تاني سعر الـbookings.price_overrideاقتراح في موجود الـkeys في شاشة مالوش بس
CSV / pack data (الفاوتشرMasar منفصل الـV2 في الباك هو الوكيل).MVP جانب وده ،
 خانةPMSربط أوتوماتيك. reference" booking بسYour يدوي
) التمديد الوكيل.Extensionطلبات من جديد حجز = التمديد الديزاين؛ من اتشالت
الأدوار): بأسماء مش (بالمفاتيح، بيستخدمه مين
الأدوار الجاهزة اللي الغرضالمفتاحمعاها
)REF 08.R  (المفتاح من
حجز)bookings.view_countsالكل سجل (مفيش بس عدد يشوف
الغرفة، (الإقامة، تشغيليًا الحجز يشوف
 الخاصة) الطلبات التأكيد، رقم
bookings.view_operational،Reservations،Admin،Owner
ofﬁce Auditor،Front

---

**p. 205**

الأدوار الجاهزة اللي الغرضالمفتاحمعاها
)REF 08.R  (المفتاح من
الفندق، (المرجع، ماليًا الحجز يشوف
رسوم التعديلات، التكلفة، الإقامة،
الإلغاء)
bookings.view_financial،Reservations،Admin،Owner
)optional( Auditor،Finance
الهوية ورقم الضيف اسم يشوف
والجنسية
guest.pii،Reservations،Admin،Owner
Front ofﬁce
On bookings.confirmReservations،Admin،Owner Requestيأكد
On Requestيرفضbookings.rejectReservations،Admin،Owner
في مفتاح 08.Rمفيش المؤقت:REF القرار . الفندق تأكيد رقم يضيف/يعدّل
 — bookings.confirm مفتوحة(مقترح) أسئلة شوف
Reservations،Admin،Owner
مفتاح المؤقتمفيش القرار bookings.confirm. حجزأو على مشكلة عن يبلّغ
bookings.cancellation (مقترح)
Reservations،Admin،Owner
 saleيعمل أوStop الرفض جوه من
التبليغ
inventory.stop_sellRevenue،Admin،Owner
Reservations،manager
نفسها (عنصرالصفحة الـBookings" في معاهnav المستخدم لو بتظهر bookings.view_operational) أو
معاهbookings.view_financial لو (زيbookings.view_counts. بس manager الـRevenue عنصر nav): ،مايترسمش
بس والتقويم الداشبورد في له بتظهر والأرقام
  على كمان بتتفحص الصلاحيات فيالنطاقكل ولا خالص، تاني فندق حجوزات مابيشوفش واحد فندق نطاقه مستخدم (الفندق).
العدادات.
الدخول: نقاط
بيوصلملاحظة على منفين فين
Bookings" Top 05.0 علىUI chip navالـ،All"
"Newest ﬁrst"الترتيب
 فيه Requestلو فوقOn الشريط مستني،
بيظهر الجدول
answer"الداشبورد an need Request "On ( 09.R ،REF
(status = pending_supplier_response  query
"Needs chip) UI 05.0A
) answer" وترتيبan
"Answer deadline ﬁrst"
)R rule معاه الفلتر بيحمل 9.09الرقم
Today at the Drawer the at hotels"الداشبوردToday
 أوhotels" مرسوم) (مش
"Arriving بفلتر today"القايمة
عشان بالفلتر، القايمة (مقترح:
 جديد)Drawerمانبنيش
يحتاج
bookings.view_operational
 4" · today "Arrivals / 3" · today هيدرDepartures في
الصفحة
Stay بفلتر القايمة datesنفس
 /Arriving today" =
"Departing today"
 على الصفحة بتفتح يفتح، ما قبل اتقفل الحجز 05.1لو مباشرةUI ده للحجز booking"إشعار Request On "New إيميلin-app( أو
)05.6 / 05.5 / حالة 05.4آخر
 / 05.4 أوUI pending"إشعار05.4P numbers conﬁrmation التذكيرHotel

---

**p. 206**

بيوصلملاحظة على منفين فين
 05.4B صفحةUI أو رد قضيةHotelianaإشعار على
UI 11.25القضية
 link Deep  bookings/}reference{ (مثلاً
( /bookings/HTL-88214
النطاق برا 11.5لو ←UI موجود مش لو حالته؛ حسب الحجز صفحة
Booking not found"
 المؤكد الحجز 06صفحة :Flow booking" the التغييرOpen طلب صف من
) ← الحجز cases"صفحة "Your ( 11.24 بحجزUI مربوطة قضية
 /Cancellation عليه الحجوزات قايمة في asked"صف
Review" ← asked" زرارAmendment
Flow في الطلب 06صفحة
 /06.7  / UI 06.1 )
( 06.10  / 06.8
الحجز صفحة مش
2 قواعد. البيزنس
عام
 طريقBR-05-01 عن الوكيل من بيتعمل الحجز الحجزHoteliana صفحة مباشرة؛ الوكيل بيشوف ولا حجز مابيعملش المورد بس.
).11 agent"بتقول Hoteliana a by والـbooked البحث في الوكالة (اسم شوفExport. تعارض،
Thu مكةBR-05-02 بتوقيت الأوقات كل كدهUTC+3 وبتتعرض 11:35")، at 09:40"،today تانيtomorrow يوم وأي 24،
 11:35" الـSep بيبعتbackend. بـtimestamps بيعرضهاUTC والفرونت المستخدم3، جهاز توقيت على يعتمد ما غير من
). كسورBR-05-03 غير ومن آلاف بفاصل الضريبة، وشاملة بالريال المبالغ كل SAR" 4,620 برقمين يتعرض فعلاً كسر فيه المبلغ لو
عشريين
Instant - BR-05-04 العقد من جاي التأكيد نوع Instant sale( Free / بيوصلAllotment الحجز ← طول،Conﬁrmed على
.)"On request - you decide"( On Request) system" the by أوconﬁrmed
BR-05-05 المورد  يعدّل ولا يلغي بتروحمايقدرش مشكلة أي مؤكد. حجز issue" an اسمهReport والحدث ،
. supplier_cancelled بيبقىSUPPLIER_FULFILMENT_INCIDENT ما وعمره
المقفولBR-05-06 الحجز Cancelled / Expired / )Rejected only تانيRead ومايتفتحش لو الوكيل. من ولا المورد من لا ،
جديد من يحجز لازم الوكيل بعدين، غرفة فضي الفندق
SLA Request والـOn
backend. الردBR-05-07 مهلة الطلبSLA وصول وقت من بتتحسب sla_minutes) + arrived_at = الـrespond_by
 ← respond_byبيبعت جاهز؛ بنفسه المهلة مايحسبش الديزاينالفرونت في المثال وصل3. ده، الفندق على ساعات الرد11:35
.14:35لحد
. الـBR-05-08 رقم مصدر كاتبSLA الديزاين ما زي بيتعرض you" by not Hoteliana, by set · hours مين3 على تعارض (فيه
).1 شوف سؤال11بيحدده،
. BR-05-09 المفتوح الطلب الغرف holdبيحجز الـ)soft مخزون على الـAllotment على مش بس، sale المحجوزةFree الغرف
الـ في committedبتتحسب ( 04.R REF 3 تحتهاRule المخزون ينزّل مايقدرش والمورد يبيعها، يقدر تاني ماحدش يعني )،
رقمBR-05-10 20" of left فيrooms 05.1 UI بيتعرض ده الطلب غير وجنبهمن 2" needs booking الموردthis عشان ،
فعلاً موجودة الغرف هل يشوف
.Undo. BR-05-11 والرفض التأكيد مفيشنهائيين

---

**p. 207**

Expired يبقىBR-05-12 الطلب رد: غير من تخلص المهلة لما Expired الـ بعدها. يرفض أو يأكد يقدر ومحدش ترجع، والغرف لوحده،
"A 4,620 SAR booking was not answered ضاعتIncidentمش اللي القيمة بتقول الصفحة بس المورد، على ومابيتحسبش
(.in time"
 أوBR-05-13 رفض (بعد الغرف رجوع Expired بيغيرّ إلغاء) أو بس المخزون رقم تتباع ترجع الليلة متحققةلو. لسه البيع شروط كل
( 04.R REF 1B العقدRule مفيشActive): sale، الـStop جوه مش الـRelease، بعد أو سعرcut-off وفيه ماجاتش، لسه الليلة ،
  رجعت الغرفة إن بتقول شاشة أي كمانصالح. تقول لألازم ولا بتتباع الليلة هل
BR-05-14 الـ من الغرف بيطلّع التأكيد Allotment بتاع الفعلية الغرفةالغرفة نفس على الوجبات خطط وكل فورًا، Only ،Room
."one allotment, shared") Board،B&B الرقمHalf نفس بتشوف
"This booking was sold at 770 a night - you بتعرضBR-05-15 الصفحة اللقطة، سعر عن مختلف دلوقتي المنشور السعر لو
"A price change is not a reason to reject a booking that was already + have since raised Half Board to 830"
 sold." ده السطر لو بس فعلاًبيتعرض فرق فيه
الرفض
No availability · Rate error · The hotel is not :) OV 05.3A BR-05-16 الرفض سبب فيهاإجباري ثابتة قايمة من أسباب8
available · Operational issue · Room out of service · The hotel is overbooked · Outside our control · Other
 .reason reason" إجباريةOther الملاحظة بيخلّي
"Also stop sale. BR-05-17 الرفض غرف بياخد ما علىعمره علّم المورد لو إلا بتتباع تفضل والليلة للمخزون، ترجع المحجوزة الغرف
.on …"
الـBR-05-18 خانة sale Stop الرفض في افتراضيًا متعلّمة اتعلّمتمش لو sale. Stop على الحجز، ليالي لنفس الفعلية، الغرفة نفس
.)"auto · from incident" الوجبات خطط كـلكل بتتسجل مابيتلمسوش. والمخزون السعر sale. (مشStop المورد من عادي
).Picking a reason does not stop the sale by itself" مابيعملشBR-05-19 السبب اختيار sale لوحدهStop
The hotel is overbooked التحذيرBR-05-20 you" with disagrees calendar السببYour لما بيظهر availability أوNo
 serviceأو of out Room فاضيةو غرف فيه التقويم
 الفندق تأكيد ورقم )HCNالتأكيد
.N of M rooms have a number"). الـBR-05-21 HCN غرفة لكل line( بيعرضRoom الحجز
: OV 05.2 BR-05-22 التأكيد مشروط فيمش طرق ثلاث بالرقم.
 .1.Pending: some" or all - numbers the have تفضلI والفاضية غرفة، لكل خانة
 .2)"NUMBER FOR ALL 5 ROOMS" / "NUMBER FOR BOTH ROOMS": rooms" all for number واحدةSame خانة
 غرفة من أكتر فيه الحجز لو بس بيظهر الغرف. كل على ويتخزن
. later" it add now, conﬁrm - yet issued يبقىNot الزرار number": the without يبقىConﬁrm والحجز 3"Conﬁrmed،
.· reference pending"
الـBR-05-23 مهلة (منHCN module BK-8،Bookings  عند التذكير نص():  المدة  للموعد h, 24 + ،min)confirmed_at
. عندOverdueوالتأخير h() 24 − check-in h, 48 + حاجةmin)confirmed_at وأقل h 4 + الـconfirmed_at
بيبعتbackend وhcn_reminder_at كاتبhcn_due_at (الديزاين بيعرضهم. الفرونت 18:00"؛ at today reminder دهone ،
شوف قاعدة، مش للقيمة ).11مثال
 BR-05-24 بيتبعت التذكير بس الناقصة للغرف only"( 2 Room فيfor ويفضل you")، رقم.Needs ياخد غرفة آخر ما لحد
 تبقىBR-05-25 الغرفة ناقص: والرقم يعدّي الموعد لما لوحدهOverdue بيفتح والنظام Incident، missing" الموردHCN على
  المتأخر الرقم فورًا). بتتحسب نظام، يتضاف(حقيقة ممكن والـلسه محسوبIncident يفضل

---

**p. 208**

. يتعدّلBR-05-26 ينفع اتضاف اللي الرقم numbers" the الـEdit تاريخ لحد check-out) السجل(مقترح) في سطر تعديل: كل
 new( → بيتعملold والفاوتشر بيوصلهV2)، والوكيل needed"، update والجديدةMasar القديمة بالقيمة
: منBR-05-27 جزئي (إلغاء اتلغت غرفة لو 06 أوFlow يبقىHoteliana رقمها مسار،Void)، ومن الفاوتشر من ويتشال بيتشطب،
."N of في مابتدخلش الملغية الغرفة تاني. M"ومايتعدّلش
مرجعBR-05-28 نفس مش حاجة؛ كتب المستخدم لو فاضي مش الرقم: فحوصات Hoteliana ( فيHTL-… تاني حجز على تكراره )؛
 = الفندق غيرنفس من الحجز نفس في غرفتين على تكراره مسموح؛ والحفظ بس تحذير = number" بسSame تحذير
Note) BR-05-29 reference" booking الـYour (رقم مابيشوفوشPMS والوكيل غرفة، لكل مش كله الحجز ومستوى اختياري،
Hoteliana" وto اختياري مابيشوفهاش .الوكيل
الحجز )Snapshotلقطة
 BR-05-30 (بالـ الإلغاء سياسة الإشغال، الوجبة، ليلة، لكل السعر بيتحفظ: التأكيد عند النشرtiers دفعة رقم العقد، نسخة والمواعيد)،
( الـPUB-YYYYMMDD-NNNN SLA)، اتستخدمت. لو الجنسية سعر ومجموعة الرئيسي الضيف وجنسية التأكيد، نوع كده، بعد تعديل أي
"The booking keeps the rate and the policy it was sold at - that never الحجز مابيلمسش العقد أو التقويم :في
changes."
) BR-05-31 بيكتب اسم) تغيير جزئي، (إلغاء الحجز على مسموح تغيير أي جديدة نسخة القديمةv2( ومابيمسحش
الجنسية سعر
. BR-05-32 موجودة الجنسيات أسعار بس المواسم بتعرض:جوه الصفحة جنسية، مجموعة سعر اتستخدم اللي السعر لو
."Saudi · GCC nationals price used" :"Nationality"في
700 · 700 · 600 SAR per room per night · GCC nationals price: rate"في مختلفYour لو ليلة لكل السعر
(.Ramadan 740 · 740 · 640)"
."This booking keeps the GCC nationals price"العنوان
 العادي: الموسم سعر دفع الضيف لو أو المواسم، ليبلبرا أي .مفيش
Guest منBR-05-33 يبلّغ المورد المكتوبة: غير الضيف جنسية إن الدخول وقت اكتشف الفندق لو issue" an بسببReport
). differs" (قرارnationality الوكيل على قضية وبتتسجل الفرق يدفع اللي هو والوكيل السعرN1، مابيعدّلش المورد
مشكلة عن التبليغ
 BR-05-34 التبليغ يفضلمابيلغيش الحجز الحجز. ماConﬁrmed لحد وHoteliana ترد، الضيف،Hoteliana نقل تقرر: اللي هي بس
من إلغاء أو استبدال، الموردHotelianaأو على مالي قيد هيتسجل وهل ،
 ممكنBR-05-35 التبليغ مع sale نطاقStop بنفس اختياري عليهBR-05-18 بيتعلّم بس incident"، from · وبيتشالauto
تتقفل القضية لما واحدة بخطوة
 BR-05-36 Hoteliana خلال بترد العمل ساعات في ومشساعتين الديزاين، في نص ده — السعودية) (بتوقيت فيSLA بيتحسب
الفرونت
 BR-05-37 حجز لكل بس واحدة مفتوحة قضية مفتوحة،(مقترح) قضية فيه لو issue". an ويسمحReport الموجودة القضية بيفتح
جديدة قضية مش رسالة، بإضافة
العرض في الصلاحيات
 ← BR-05-38 صلاحية غير من مقفول: غير مخفي يشوف ومش يشوف مايترسمش. العنصر ← ومكانهيعمل يتشال والزرار تظهر، البيانات
  يقدر. مين بيقول ممنوعDisabledزرارسطر شرح غير من

---

**p. 209**

BR-05-39  يظهرguest.pii الاسم غيره: من بيفتحه. تاني مفتاح ومفيش لوحده مفتاح hidden" والجنسيةGuest الهوية ورقم ،
.Guest phone والـ مقفول، بالاسم والبحث مابيترسموش، الغرف عمودExportوأسماء مافيهوش ولاGuest
).OV 11.15 ( BR-05-40 من بيسري صلاحية سحب الجاي الطلب
القايمة
BR-05-41 الـ20 (قرار الصفحة في صف بندtodo من2 الصفوف عدد واختيار 100)، / 50 / 20 popover: والـ(مقترح) الفلتر، ،chip.
الـ في بيتحفظوا الصفحة ورقم .URLوالترتيب،
chips: All · Needs an answer · Conﬁrmed · Cancelled · Rejected · Expired · Cancellation asked · الـBR-05-42
2 = 47( All asked .Amendment asked" وCancellation asked" Amendment من علىConﬁrmedجزء ومابيتجمعوش
.(1 + 3 + 3 + 38 +
كلBR-05-43 عدد chip بيتحسب التانيةبعد الفلاتر dates،Hotel .)Search،Booked،Stay
الـBR-05-44 بيطلّعExport now" right stands it as list the of snapshot A أكتر بس. يشوفها يقدر المستخدم اللي وبالأعمدة ،
 5,000من الإيميل على بيتبعت ← صف كل(مقترح) السجلExport. في بيتسجل
)Happy path( 3 الفلو. الأساسي
 طلبالسيناريو: Request On بعدين التاني الرقم ويضيف واحدة، لغرفة برقم يأكده المورد لغرفتين،
. (نظام الطلب 1وصول
) بحالة الحجز يعمل غرفتينpending_supplier_responseالنظام: ويحجز hold، ويحسبsoft ليلة، كل على
 إشعارrespond_by ويبعت action"، "requires email( + عندهin-app مستخدم لكل الفندقbookings.confirm) على
ده
.Needs an answer → — · booking.requested  · systemالسجل
. 2.) UI 05.0 ( يفتح Bookingsالمستخدم
الهيدر والـBOOKINGS"يشوف: badge، answer" an need و2 4"، · today وArrivals 3" · today وزرارDepartures ،
.Export"
الشريط answer"يشوف your for waiting are requests الفندق،2 المرجع، الاسم، طلب: لكل كارت وتحته Request" ،On
الحجم، الإقامة، والوجبة، VAT"الغرفة INCL. · TOTAL left"،YOUR min 21 · today 14:35 by arrived،Respond
.Open and وزرار11:35" decide"،
"Needs an chip  من أكتر لو مهلة. بأقرب مترتبة يظهر3الكروت طلبات، 3 كروت ولينك(مقترح) requests" 5 all يطبّقSee
.answer"
| STATUS | YOUR TOTAL · INCL. VAT | ROOMS | STAY | HOTEL & ROOM | GUEST | تحت REFERENCEالجدول
الصف. زرار
Cancellation/Amendment الحالة حسب الصف answerزرار an Needs ← Conﬁrmed؛Decide" ← asked؛Open"
.View" ← ← Rejected/Expired/Cancelled؛Review"
 .3. UI 05.1  ← "Decide" decide"يضغط and أوOpen
left"يشوف minutes 21 - today 14:35 by الـAnswer وشرح وSLA، you"، by not Hoteliana, by set · hours ،3
.2 rooms are held on 24, 25 and 26 September while the request is open…" الـ holdوسطر

---

**p. 210**

DECIDE"قسم YOU ليلةBEFORE لكل 2": needs booking this · 20 of left rooms موجود12 لو السعر فرق وسطر ،
(.BR-05-15)
 DETAILS" (لوGUESTS"،BOOKING REQUESTS")،guest.pii وSPECIAL ANSWER"، احتمالاتYOUR بالتلات
.(If you conﬁrm / If you reject / If you do nothing)
 request"الزرارين the وReject (ثانوي) booking" this (أساسيConﬁrm
).rule 7 REF 09.R بتعمل والصفحة دقيقة، كل بيتحدث الفوكسrefetchالعدّاد له يرجع التاب لما
. 4.)Modal( OV 05.2  ← "Conﬁrm this booking"يضغط
I have the numbers الهيدر SAR"يشوف: 4,620 · ROOMS 2 · AL-SAYED NOUR · الافتراضيHTL-88214 والاختيار -،
).ROOM 1 · STANDARD ROOM · NOUR AL-SAYED" some" or غرفةall لكل بخانة
.)"Not issued yet - add it later" الغرفة رقم 1يكتب الغرفةJOM-2026-44182" ويسيب تحتها2 (السطر فاضية
.NOTE TO HOTELIANA" REFERENCE"اختياري BOOKING وYOUR
Conﬁrming is ﬁnal. A cancellation after this follows the policy التقويم أثر left"يشوف 10 → 12 · 24 وTHU …،
on the booking - Non-refundable on this one."
 .5."Conﬁrm booking"يضغط
.idempotency key ويعرض الزرار يقفل بـloadingالفرونت: الطلب ويبعت عليه،
لسهbackendالـ الحالة يتحقق: وpending_supplier_response respond_by، < معاهnow والمستخدم ،
 صالحة.bookings.confirm الأرقام وقيم الفندق، على
= الحالة منConﬁrmedيحفظ: تتحول الغرف لـheld؛ اللقطةconﬁrmed الغرفةHCN؛v1؛ 1 = added والغرفةNumber 2،
.hcn_reminder_at وhcn_due_at؛Pending
" الفاوتشرHotelianaيبلّغ يوصله (الوكيل والوكيل غرفةV1 رقم وفيه من1 يخرج الأصلي الإشعار you)؛ فيNeeds الفريق لكل
.task "Add the missing number" )requires يتفتح اللحظة؛ action(نفس
· supplier_userالسجل ·  booking.confirmed · Conﬁrmed → answer an booking.hcn_added؛Needs
.Room 1: — → JOM-2026-44182
toast "Booking conﬁrmed. Hoteliana") على 05.4Pيروح UI number"( a have rooms 2 of 1 · معConﬁrmed
agent the told has .(مقترح)."
 .6. OV 05.10  ← "Add the missing يضغط التاني. الرقم يطلّع الفندق numberبعدين
 غرفة غرفة؛ لكل خانة وغرفة1يشوف القديم، الرقم فيها فاضية.2
".Save the numbers" ويضغطJOM-2026-44183يكتب
ويشيلbackendالـ يحفظ، غرفةPending: عن الفاوتشر2 ويعمل التذكير، ويوقف الوكيل.V2، ويبلّغ ،
.Room 2: — → JOM-2026-44183 · booking.hcn_addedالسجل
على 05.11يروح UI complete"( is booking والزرارThis Edit"،
").Add the numbers" numbers بدلthe
خريطة (الأزرار كل زرار  ← بيفتح إيه  ← الحالة بعد )الحفظ
بعد الزرارالمكانبيفتحالحفظ
"Export"UI كبير لو إيميل أو بيتنزّل، 05.14ملف 05.0هيدرOV

---

**p. 211**

بعد الزرارالمكانبيفتحالحفظ
Arrivals today · N" / "Departures"
"today · N
UI بفلتر— الصفحة datesنفس 05.0هيدرStay
"Open and decide" / 05.1— صفUI / "Decide"كارت
"Open" / حالته— حسب الحجز "View"صفصفحة
عليه "Review"صف
Cancellation/Amendment
asked
Flow في— الطلب 06صفحة
)Row actions( 05.9— ⋯صفOV
05.8— الفلاترOV "Search"شريط
Hotel" / "Stay dates" / "Booked" /"
""Sort
05.15 OV /  /05.16 الفلاتر شريط
05.18  / 05.17
(popover)
يتفلتر الجدول
"Pick a date range"05.17  / يتطبق 05.16Dالفلتر OV /  05.16جوه05.17D
"All 05.7— أيOV ﬁlters"popoverجوه
يرجع ده أي—Anyالفلتر "Clear"popoverجوه
"Back to 05.0 (منUI الفلاتر بنفس حجز صفحة bookings"أي
)URLالـ
—
"Conﬁrm this booking"UI 05.1OV 05.2—
Conﬁrm booking" / "Conﬁrm"
"without the number
05.2B  / OV 05.2—/ 05.4P  / UI 05.4
 الأرقام05.11 حسب
"Reject the request"UI 05.1OV 05.3—
يتختار 05.3Aالسبب 05.3OV السببOV قايمة
"Reject the request"OV 05.3—UI 05.5
"Open Rates & Availability"UI الغرفة على متفلتر 05.5التقويم
والليالي
—
Add the numbers" / "Add the"
missing number" / "Add the
"conﬁrmation numbers
05.4B  / 05.4P  / UI 05.4OV 05.1005.11 أو05.4P
"Edit the numbers"/ 05.11C  / UI 05.11
05.11G
 الصفحة، 05.10نفس الحاليةOV بالقيم
"Numbers updatedو
(مقترح)
"Report an 05.13 ثمOV 05.12 مؤكدOV حجز صفحة issue"أي
UI 05.4B
"‹ Follow this issue"OV 05.13 11.25 (تفاصيلUI
القضية
—
"Back to the booking"OV 05.13UI 05.4B—
"‹ Issue open · ISS-2026-0184"UI 11.25— 05.4BهيدرUI

---

**p. 212**

بعد الزرارالمكانبيفتحالحفظ
" لـ ←لينك Access & 05.6Team alerts"UI the gets who (نص)Check
Notiﬁcations (مقترح)
—
"Copy reference"OV 05.9—Toast "Reference
"copied
"Export this booking"OV 05.9— أعمدةPDF (نفس للحجز
المسموحة التفاصيل
(مقترح)
)Alternative ﬂows( 4 الفلوهات. البديلة
) OV 05.2S — A1 الغرف لكل الرقم بنفس التأكيد
 .1" 05.2في يختارOV rooms all for number ويظهرSame تختفي غرفة لكل الخانات ROOMS". BOTH FOR (أوNUMBER
"(.NUMBER FOR ALL N ROOMS"
 .2".Hoteliana stores it against Room 1 and Room 2. Untick to type one per تحته السطر الرقم. roomيكتب
. 3.)Void" ← booking" يبقىConﬁrm بس رقمها بعدين، اتلغت غرفة لو (عشان منفصل كسطر غرفة كل على يتخزن الرقم
 .4. UI 05.11النهاية
. لغرفة يتنقل كتبه اللي والرقم ترجع، غرفة لكل الخانات العلامة: شال 1لو بس 5.(مقترح
)OV 05.2B — A2 رقم غير من التأكيد
 .1The booking shows as Conﬁrmed ·". laterيختار it add now, conﬁrm - yet issued ويظهرNot تختفي الخانات
…" 18:00 at today reminder one get you tasks, your in appears It pending. منreference (الساعة
.( hcn_reminder_at
 .2."Conﬁrm without the يبقى numberالزرار
. 3 05.4النهاية UI number"( a have rooms 2 of الـ0 شغالينtask"). والتذكير
 — A3 التأكيد وقت موجودة الأرقام كل
 غرفة لكل رقم bookingيكتب "Conﬁrm ←  05.11 ومفيشUI مباشرة، تذكيرtask ولا
)UI 05.5  ← 05.3A  ← OV 05.3 — الرفضA4
 request" the "Reject ←  05.3 الهيدرOV NIGHTS. 3 · ROOMS 2 · AL-SAYED NOUR · العنوانHTL-88214 .1You"،
."cannot take this booking
 .2."Use this reason required" · it? take not you can يفتحWhy ← 05.3A" بالـOV ويضغط8 يختار واحد. كل وشرح أسباب
 .3checkbox" في التلاتة من السبب يظهرBR-05-20لو غرف: فيه والتقويم you with disagrees calendar الـYour وتحته بالأرقام،
Rates and rooms are kept - you can open it again" September 26 - 24 for Room Standard on sale stop وAlso
 time (الـany بسcheckbox." للتلاتة بيظهر التحذير بس سبب، لأي بيظهر
 .4.)Other reason" optional" · Hoteliana to لوNote (إجباري
 .5 request" the الـReject ← الحالةbackend" الـRejected: ترجع، الغرف sale، متعلّم،Stop لو يتطبق وتاخدHoteliana تتبلغ
للوكيل الطلب

---

**p. 213**

 .6" 05.5النهاية UI : availability" no - today 12:14 at وقسمRejected ROOMS"، YOUR TO HAPPENED لكلWHAT
saleليلة stop on now · (أوunchanged sale" on still · وunchanged ماعلّمش)، لو untouched" is rate وزرارThe "،
".Open Rates & Availability"
 .7Stop booking.rejectedالسجل · reason=no_availability · Rejected → answer an فيهNeeds ولو sale:؛
.inventory.stop_sale_set  · Open → Stopped · 24–26 Sep · Standard Room · all meal plans
) UI 05.6 — ردA5 غير من خلصت المهلة
 .1 الـrespond_byعند لـjob الحالة بيحوّل والـExpired ترجع، والغرف 1B، ليلةRule لكل يتقيّم
. 2 تانيHoteliana مكان على وتدوّر للوكيل الطلب تاخد
 .3."Needs you) expiredإشعار Request "On email( + مشin-app action، منrequires يخرج القديم والإشعار الناس، لنفس
. 4were 05.6الصفحة UI : taken" never were rooms 2 ليلةYour لكل free…"،
".STOP IT HAPPENING time whole وthe time"، in answered not was booking SAR 4,620 وقسمA AGAIN"،
 .5were free the whole time"" يبقى السطر الغرف: رجوع بعد بتتباع مش ليلة فيه 1لو stopped still night · back بدلroom
.BR-05-13)
 .6.Needs an answer → Expired · booking.expired  · systemالسجل
Instant — حجزA6
 .1  لوحده يأكد النظام ← بيحجز systemالوكيل the by conﬁrmed - الـInstant من تطلع والغرف فورًاAllotment")،
. 2task "Add the conﬁrmation للموردinfoإشعار booking "New التفضيلاتin-app( حسب اختياري الإيميل numbers"؛
.bookings.confirm action( لأصحابrequires
 .3 القايمة في بيظهر وتحتهConﬁrmedالحجز pending" الخطواتReference نفس هنا من الأساسي6". الفلو في
 — مباشرةA7 القايمة من الأرقام إضافة
tag الصف⋯ على 05.9 OV ← number" conﬁrmation the "Add ←  05.10 والـOV للقايمة يرجع الحفظ بعد القايمة. فوق
.)"of 2 numbers in 1" pending يبقىReference (أو الصف من يختفي
."Edit the conﬁrmation numbers  ده منبيتشالالأمر 05.9 لـOV ويتحول أرقام، ليها الغرف كل لو
 — غلطA8 اتكتب رقم تعديل
 .1 numbers" the "Edit ←  05.10 الحاليةOV بالقيم
  ويحفظ غرفة رقم .2يغيرّ
. 3Hotel reference updated · الجديدbackendالـ الرقم الفاوتشرv2: التاريخ، في محفوظ والقديم للوكيلV2 إشعار Masar،
" needed الوكيل).update (جانب
 .4.Room 1: JOM-2026-44182 → JOM-2026-44192 · booking.hcn_changedالسجل
. 5A saved number cannot be removed. Type  اتحفظ: ما بعد الخانة) (تفضية رقم مسموحمسح مش الرسالة(مقترح) the؛
."correct number, or report an issue if the room has no reservation at the hotel
) OV 05.10S number Same — الإضافةA9 مرحلة في
."…Each number you save clears that room's pending flag مؤكدA1نفس حجز على بس
)05.4B  ← 05.13  ← OV 05.12 — مشكلةA10 عن التبليغ

---

**p. 214**

 .1Report an issue" ← OV 05.12 : "You cannot cancel or change a conﬁrmed booking yourself. Tell Hoteliana"
".what is wrong and they handle it with the agent
 .2CAN YOU OFFER REQUIRED" · WRONG IS وWHAT (قايمة)، REQUIRED" · IT وDESCRIBE ANYTHING"،
:"INSTEAD? · OPTIONAL · PICK ONE
"Deluxe Room City View has 8 free on 24 - 26 Sep" + nights" same the on room different محسوبA سطر
الليالي كل على كفاية إتاحة فيها الفندق نفس في غرفة (أعلى
" Sep" 29 - 27 on free 16 has Room "Standard + nights" different on room same الطولThe بنفس فترة (أقرب
إتاحة فيها الإقامة بعد
".Nothing - the hotel cannot take them at all"
 ده الاختيار إتاحة: فيها بديلة غرفة مفيش مايترسمشلو .(مقترح
. 3.) inventory.stop_sell" September 26 - 24 for Room Standard on sale stop "Also معاهCheckbox (لو
 .4Reporting that you cannot honour a booking may affect your (من تحذير 10.Rسطر مرسومREF مش supplier،
." — settlement and التنفيذ.performance عدم أسباب من النوع لو بس بيظهر
 .5" Hoteliana" to الـSend ← قضيةbackend" يفتح الـISS-YYYY-NNNN ويطبّق incident، from · "auto sale متعلّم،Stop لو
لـ .Hotelianaويبعت
. 6."Follow this issue ›" / "Back to the 05.13 OV : it" has وHoteliana الملخص، المرجع، booking"،
 .7.Conﬁrmed ‹". 05.4Bالنهاية الـUI ISS-2026-0184: · open "Issue chip + "Conﬁrmed" لسهbadge الحجز
 Hoteliana — القضيةA11 على ترد
 البديل على وافق الوكيل استبدال: أو كحجزHotelianaنقل (بيظهر الجديد الحجز بتعمل نفسConﬁrmed عند يكون وممكن جديد،
". يبقى القديم القديم. وتلغي وجنبهCancelledالمورد) ISS-2026-0184 · Hoteliana by أيCancelled مابيعملش المورد
خطوة.
" من الحجزHotelianaإلغاء ترجعCancelled: والغرف 1B، والـRule incident)، from · "auto sale يتشال.Stop ما لحد يفضل
".Closed · no entry المورد على خطأ غير من postedقفل
 المورد على بقيد 10.8قفل UI posted" entry · closed فيIssue بيظهر والقيد بالقضية.Finance"، مربوط
".in-app + email "Hoteliana answered ISS-2026-0184الإشعار
لـchipالـ يتحول )neutral( ›" closed Issue .(مقترح)
)Flow 06 — (نتيجةA12 مؤكد حجز من غرفة إلغاء
Rooms" : UI  تبقى الحجز صفحة النظام: يطبّقه أو الجزئي الإلغاء يأكد المورد ما 05.11Cبعد
"Room 2 cancelled" cancelled 2 Room · 2 of الغرفة1 ورقم 2"، void" number · cancelled وقسمRoom مشطوب،
بيشرح
)UI 05.11G — جنسيةA13 بسعر حجز
"GCC nationals  الليبل بتعرض التفاصيل مختلف. أكشن الـBR-05-32مفيش عمودExport). فيه used Price بقيمة(مقترح)"
".Season priceأو
)OV 05.8 — البحثA14
 .1".Search" ← popover "Find a booking" "Reference, guest name, hotel or the agent who booked it"
 .2."N بيكتب وهو تظهر النتايج ← msبيكتب 300 debounce لحد(مقترح) 8)، نتايج و(مقترح) MATCHES،

---

**p. 215**

 .3" ← الحجز صفحة ← نتيجة على matchالضغط ﬁrst the أوOpen نتيجةEnter" أول ← يقفلCancel
. 4 الـ بس مش الحالات كل في بيدوّر الحاليchipالبحث
 — الفلترةA15
Narrow the list · Filters stack with the status chips" OV 05.7) فلترPopover لكل 05.15 – واحدة05.18 مرة كله أو
.("above the table." ← "Apply ﬁlters
Stay dates: Any stay date / Arriving today / Departing today / This month / Pick a date range ← OV 05.16D :
" dates these in night any with الفترةBookings جوه منه ليلة أي لو بيطلع (الحجز
Booked: Any time / Today / Last 7 days / Last 30 days / Pick a date range ← OV 05.17D  "Bookings made on
."these days
 ﬁrst Newest (افتراضيSort: ﬁrst rate Highest / ﬁrst deadline Answer / soonest معArriving بس (بيظهر
.( bookings.view_financial
.)"bookings عدده جنبه اختيار 41كل
)OV 05.14 ( Export — الـA16
 .1."Export" ← Modal "Export the bookings"
 .2Every booking that still needs an answer" /" view in bookings N "The FILE: THE IN GOES (افتراضيWHAT
.)"Everything for all 3 hotels hotel this for الفندقEverything فلتر (لو يبقىAll"
 .3.FORMAT: CSV / Excel (.xlsx) / PDF
 .4 chips COLUMNS: المستخدم على الممنوعة الأعمدة الفلوس. عمود + الجدول أعمدة = الافتراضي وتتشال؛ تتعلّم كـمابتترسمش
.chips
 rows" N باسمExport بيتنزّل الملف ← bookings-YYYYMMDD-HHmm.csv" .5.(مقترح
) — ماجاشA17 ضيف — مرسومNo-show مش
check-out issueمن an نوعReport )no-show(" arrive not did Guest من(مقترح)" مسموح الـ00:00، يوم لحدcheck-in
 Hoteliana h. 48 السياسة. حسب والفلوس بتأكد،
)Exception ﬂows( 5 الاستثناءات. والأخطاء
 — الصفحةE1 فاتح والمستخدم خلصت المهلة
. UI 05.1: علىTrigger وهو صفر وصل العدّاد
لـ يتحول البانر )danger(الشاشة: rejected." or conﬁrmed be longer no can It 14:35. at expired request والزرارينThis ،
.UI 05.6 ويظهر bookingsيتشالوا، to بعدBack تبقىrefetch". الصفحة
This request فاتح كان 05.2لو أوOV الـ05.3 الـModal: جوه بالرسالة معلّق يبقى والزرار مفتوح، يفضل نفسهاModal
 saved was Nothing 14:35. at زرارexpired + "Close." ←  05.6 UI الملاحظة) (الأرقام، كتبه اللي الحجزمابيتحفظش. لأن
اتقفل
 ضغطE2 المستخدم — (سباق)Conﬁrm بثواني المهلة بعد
. 409 request_expired backendالـ رد السيرفر. بتوقيت الحَكَم هو

---

**p. 216**

← "Modal: "Too late - this request expired at 14:35:00 and could not be conﬁrmed." + الـ في "Closeالرسالة
.UI 05.6
 — الوقتE3 نفس في رد الفريق من تاني حد
 Trigger أكدت مريم الصفحة14:10: نفس فاتح وأحمد
Mariam Zaki already conﬁrmed this booking at 14:10." زرار أي ضغط أحمد already_answeredلو والرسالة409 +،
.05.11 / UI 05.4  ← ""See the booking
" أول مع ماضغطش: لسه شريطrefetchلو يظهر دقيقة) أو (فوكس 14:10 at Zaki Mariam by لآخرAnswered تتحدث والصفحة
?"  فيحالة. كتبها أحمد اللي مابتضيعشModalالأرقام مفتوح مع له تتعرض booking: the to numbers these الحجزAdd لو
 أرقام غير من .(مقترح)اتأكد
)Withdrawn — الردE4 قبل الطلب سحب الوكيل
." answerالرسالة to nothing is There 13:02. at request this withdrew agent رجعتThe الغرف تتشال. والأزرار
.)6". )danger(الـ "Cancelled" وتحتهbadge: agent the by شوفWithdrawn مرسوم، (مش
 — شغالE5 وهو اتسحبت الصلاحية
. OV 05.2 الـTrigger شالOwner: فاتحbookings.confirm وأحمد
". missing_permissionالرد الشاشة403 11.15. OV working" were you while changed access كتبهYour اللي
ومابيتحفظش. ينسخه، يقدر كنص له بيتعرض (الأرقام)
Only the Owner, an Admin or Reservations can answer السطر ومكانهم الزرارين غير من تتعرض الصفحة القفل: thisبعد
."request
)Deep link — النطاقE6 برا الفندق
 11.5 UI : hotel" this for not but Bookings, have You الحجزمايتذكرش". تفاصيل ولا الضيف اسم
 — غلطE7 المرجع / موجود مش الحجز
بسيطة bookingsصفحة to "Back + hotels." your on exist not does "HTL-99999 + found" not Booking مانقولش".
تاني. مورد عند موجود الحجز لو
 — E8 التأكيد/الرفض وقت السيرفر أو الشبكة فشل
." + ورسالةModalالـ اتكتب، اللي بكل مفتوح يفضل again try - sent was Nothing Hoteliana. reach not يرجعCould الزرار
شغال.
الـ بنفس keyالإعادة idempotency مرتين. ومابيأكدش النتيجة نفس بيرجع التاني الرد فعلاً، وصل الأول الطلب فلو ،
  من أكتر اتأخر الرد 15لو ثانية :(مقترح window" this close not do - working بعدهاStill فشل ولو وعرضrefetch." للحالة
الحقيقة.
 — مزدوجE9 ضغط
.backend والـ ضغطة، أول من بيتقفل keyالزرار الـidempotency في بيحمي
)OV 05.10 — فشلE10 الأرقام حفظ
." الـ جوه againرسالة Try saved. not were numbers "The بالقيمModal: تفضل الخانات

---

**p. 217**

Number جزئي (فشل لأ وغرفة اتحفظت غرفة againلو try - saved not was 2 Room saved. 1 وغرفةRoom تتعلم1."
.added
 — متكررE11 رقم
This number is already on HTL-88190 at this hotel. Save الخانة تحت أصفر تحذير الفندق: نفس في تاني حجز anywayعلى
." twice it issued really hotel the مسموح.if والحفظ
".This is the Hoteliana reference. Type the number the hotel gave you: مرجع نفس خطأHotelianaعلى
 منE12 اتلغى الحجز — الأرقامHoteliana إضافة فاتح وهو
This booking was cancelled by Hoteliana at 15:20. Numbers can no longer be" : 409 booking_cancelled
."added." + "See the booking
 — رقمهاE13 بيكتب وهو اتلغت الغرفة
".Room 2 was cancelled at 15:20 - its number was not saved يرجع room_cancelledالحفظ بس409 دي للغرفة
تتحفظ. التانية والغرف
 sale Stop — الرفضE14 مع فشل
The request is rejected, but the stop sale on  والـيتمالرفض الأهم)، (هو sale صفحةStop يفشل: 05.5 تحذيرUI بشريط
WHAT". Availability & Rates "Open + Availability." & Rates in nights the Close apply. not did Sep 26 - القسم24
."still on sale" ROOMS YOUR TO يعرضHAPPENED
 مع السلوك saleنفس والـStop بتتفتح، القضية التبليغ: في sale مشابهةStop برسالة بيفشل
inventory.stop_sell — مالوشE15 المستخدم
Only someone who can stop sale can close these nights - ask the Owner checkboxالـ السطرمايترسمش ومكانه or،
."an Admin
Modal — فيE16 وهو خلصت الجلسة
session_expired 11.12 OV الحجز. لنفس يرجع الدخول بعد الـ. في اللي والملاحظات محليًاModalالأرقام تتحفظ مكانها وترجع
 device this on الـrestored بعد logout). ماترجعشsecurity
 — القايمةE17 في قديمة بيانات
Something moved - 2  أو تاني، حد من (اتأكد اتغيرت حجز وحالة القايمة فاتح المستخدم بعدExpiredلو يظهرrefetch):
"need an answer). Refresh changed. bookings إيده(مقترح)" تحت تتغير الصفوف ما بدل 7.09 rule وعددR الشريط
فورًا بيتحدثوا
 — التحميلE18 فشل
". الجدول مكان في رسالة againالقايمة: "Try + load." not could يفضلواBookings والفلاتر الهيدر
".This booking could not load." + "Try again" + "Back to الحجز bookingsصفحة
 الـE19 — كبيرExport أو فشل
This export has 8,240 rows. We will email it to" 5,000كبير صف يبقى(مقترح) الزرار ﬁle): the me والرسالةEmail
minutes 10 within you@company.com .(مقترح)."

---

**p. 218**

 againفشل Try failed. "Export والـToast مفتوحModal." يفضل
."Nothing to export with this ﬁlter الزرار صف: rowsصفر 0 Export مقفول السطرومعاه"
 — فشلE20 التبليغ
 05.12 اتكتبOV اللي بكل مفتوح يفضل again Try sent. not was report ومفيشYour sale." اتطبقStop
) اتوقفE21 العقد — مفتوحPaused طلب فيه وهو اتعلّق الفندق أو خلص أو
This contract is paused by  عليهالطلب يترد ينفع لسه شريط(مقترح) بس. الجديد البيع بيوقف الإيقاف — فوقinfo
).serviceable request this answer still can You Hoteliana. الحجز أكد، ولو عاديConﬁrmed."
)Sold out ← On Request الطلبE22 — Request خلصOn والمخزون
"rooms left of 20 · this booking needs 2 0" الـ في موجودة مش القسمAllotmentالغرف DECIDE. YOU يقولBEFORE
. Hotelianaويظهر gave you allotment the outside rooms 2 promises Conﬁrming (مقترح)." (المورد مسموح التأكيد
" والـ الفندق)، leftيعرف الصفر.rooms تحت مابينزلش
6 حالات. مش موجودة في التصميم
السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
11.17 UI why" and yet, None / جايBookings النص جديد". (حساب خالص حجوزات 1مفيش
 فيه لو البيع: محرك أولBlockersمن يعرض للإصلاح؛3 لينك مع
Everything is on sale - no agent has مفيش bookedلو
". Analytics in demand "See + فاضي.yet." جدول مفيش
UI 11.17
2" الجدول مكان في واحد answer.سطر an needs answerNothing an "Needs فاضيchip
New On Request bookings show up here and on your
." مايترسمشdashboard فوق والشريط
UI 05.0A
3Cancelled / Rejected / فاضيchip تاني
Expired / Cancellation asked /
(Amendment asked
) + bookings" cancelled الـNo حسب (بالاسم فيهchip." لو
."Clear ﬁltersفلاتر
UI 05.0C
ﬁlters" "Clear + matches" (زيNothing 03.0B" حاجة).UI مالقاش البحث أو 4الفلتر
.""No booking matches "HTL-99البحث
OV 05.8
5 والجدولSkeleton الشريط شكل بنفس مش5 صفوف)، مرةLoading أول
.spinner
UI 05.0
6 05.0 فوقهUI صغير ومؤشر خفيفة بشفافية ظاهر يفضل صفحةLoadingالجدول أو فلتر بعد
عمود يظهرGUESTالجدول: hidden البحثGuest (رمادي). مالوش" 7guest.piiمستخدم
". hotel or reference "Search الحجز:placeholder صفحة
Guest details are hidden for كارتGUESTSقسم مكانه
your role. Only people with guest access see names
05.10 / OV 05.2." numbers ID فيand الغرف أسماء
" ROOMتبقى STANDARD · 1 اسمROOM غير من
UI 05.1

---

**p. 219**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
مالوش 8مستخدم
bookings.view_financial
" VATعمود INCL. · TOTAL الكروتYOUR في مايترسمش.
"Your rate" TOTAL" الحجزYOUR صفحة مايترسمش.
WHAT THIS" youو to وقسمTotal السعر فرق وسطر
" مايترسموشCOST ﬁrst" rate "Highest مايظهرش.Sort
 في 05.2الهيدر المبلغOV غير من
UI 05.1
مالوش 9مستخدم
bookings.view_operational
(Finance)
HOTEL" الحجز REQUESTSصفحة وSPECIAL
WHAT CHANGED IN" NUMBERS وCONFIRMATION
" CALENDAR الفندق،YOUR المرجع، يشوف مايترسموش.
مفيش الإلغاء. رسوم التعديلات، السياسة، التكلفة، Addالإقامة،
".the numbers
UI 05.11
10 معاه ومالوشviewمستخدم
reject / bookings.confirm
(Front ofﬁce)
Only the Owner, 05.1في ومكانهمUI يتشالوا، الزرارين
an Admin or Reservations can answer this request. It
Open and" 14:35 at فوقexpires الكروت بدلOpen."
."decide
UI 05.1
11 ومالوشbookings.confirmمعاه
 مخصص)bookings.reject (دور
" bookingيظهر this ومكانConﬁrm بس، سطرReject"
You can conﬁrm but not reject. Ask an Admin to"
".reject
UI 05.1
12AuditorYou are an Auditor -. حاجة onlyكل الأزرارRead مكان
."bookings are read-only for you
Open the ( مفيشstate_readonly إلا⋯). الصف على
."Copy reference" وbooking
UI 11.6
والـHotelفلتر والعدادات مايترسمش، دهExport الفندق على واحد فندق نطاقه 13المستخدم
Everything for Al Noor Makkah الـ خيار يبقىExportبس.
".Hotel
OV 05.7
1415 Requestطلب منOn أقل والمهلة
 (مقترح)دقيقة
Respond by بلون والكارت والنصdangerالعدّاد 14:35،
".less than a minute left". left min 9 · دقيقةtoday تحت
UI 05.1
15)h 24 left" h 20 · 09:40 tomorrow by Respond من أكتر لو بعده". أو بكرة طويلSLAالمهلة
."Respond by Thu 1 Oct 09:40يومين
UI 05.0
زي 05.6صفحة بالعنوانUI this withdrew agent الوكيلThe من اتسحب 16)Withdrawnالطلب
taken never were rooms 2 …"،Your
"Cancelledالـ وتحتهbadge agent" the by "،Withdrawn
". قسم COSTومفيش THIS منWHAT يخرج القديم الإشعار
.Needs you
UI 05.6
(بعد بتتباع مش الليلة بس رجعت 17الغرف
غير من أوstopرفض إلغاء)Expired، أو ،
Blockers: "1 room الـ من سبب ليلة لكل الليالي، قسم backفي
· still stopped" / "back · inside release, not bookable"
/ "back · night already started" / "back · no rate on
A". ended contract · "back / night" تحتthis والسطر
".returned room only sells if the night itself is on sale
UI 05.6
05.1 atقسمUI sold was booking خالص.This مايترسمش موجود…" مش السعر 18فرق
since" have you - night a 770 at sold was booking طلعThis (مش البيع بعد نزل 19السعر
".lowered Half Board to 700. You are still owed 770
UI 05.1

---

**p. 220**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
Hudaفي · )adult( Al-Sayed Nour · 1 "Room أطفالGUESTS: فيه 20حجز
1" 7( )child, Salem · السطرadult( يبقىChildren".
 check-in at 7 age · الغرفةchild لو only". طفلAdults وجه
warning "This room شريط يحصل): المفروض is(مش
adults only but the agent booked a child. Report an
".issue if the hotel cannot take them
UI 05.1
رقم مابعتش (الوكيل ناقصة ضيف 21بيانات
هوية)
" agentالقيمة the by provided سببNot مش (رمادي).
رفض.
UI 05.1
22Special 05.1 مشUI خالص، يتشال requestsمفيش".Noneالقسم
23 05.2في OV / بتعمل05.10 الخانات قايمة الـscroll جوه فيه 5حجز أكتر أو غرف
N والـModal checkbox، number العنوانSame فوق. ثابت
."of 5 rooms have a number
OV 05.10
rooms" all for number العنوانSame مايترسمش. واحدةHOTEL" غرفة 24حجز
" NUMBER (مفردCONFIRMATION
OV 05.2
الغرفةBadge )danger( بدلProblem" فوقPending بانر اتأخرت". 25)Overdueالأرقام
The hotel numbers were due at 12 Sepالصفحة
14:12. Hoteliana has logged it - add them as soon as
."Add the numbers." them issues hotel لسهthe والزرار
UI 05.4
26 من أقل بعد مفيش72الوصول ولسه ساعة
رقم
Guests arrive in 2 days. Without the + سطر25نفس
."numbers the agent cannot register them on Masar
UI 05.4
27 غلطHoteliana الرقم إن قالوا الوكيل أو
(HCN Disputed)
Problem" + "Hoteliana says this number الغرفةBadge
← "Correct the number". }reason{ rejected: الزرارwas
 05.10 ديOV الغرفة على
UI 05.4P
28 القايمة pendingفي "Reference + الحجزConﬁrmed صفحة جديدInstantحجز".
Conﬁrmed at 11:35 by the 05.4زي الهيدرUI بس
Conﬁrmation type · Instant - conﬁrmed by", وsystem
."the system
UI 05.4
"In-house "Chip مشneutral( badge، status كل(مقترح)) بدأت. 29)In-houseالإقامة
Report an" onlyحاجة إلاRead numbers the وAdd/Edit
".issue
UI 05.11
numbers the "Edit out". "Checked يتشالChip خلصتReport" 30)Completedالإقامة
issue لحدan يفضل h" 48 + check-out بعدها(مقترح) ،
Issues after check-out go والسطر throughيتشال
."Finance
UI 05.11
31 (من كله اتلغى 06الحجز أوFlow
(Hoteliana
Badge "Cancelled". "Cancelled on 10 Sep at 10:12 ·
by Hoteliana ·" policy the under agent the (أوby
وISS YOU-…")، TO BACK CAME زيWHAT وكل06.2" ،
."Back to bookings. غيرVoidالأرقام أزرار مفيش
UI 06.2
issue" an يبقىReport ISS-2026-0184" issue to تاني"Add يبلّغ عايز وحد مفتوحة 32قضية
) القضية 11.25ويفتح رسالةUI خانة مع
UI 05.4B

---

**p. 221**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
)neutral(الـ ›" ISS-2026-0184 · closed "Issue اتقفلت،chip 33القضية
Closed ·" النتيجة postedوسطر entry no · أوClosed
".entry posted - see Finance
UI 10.8
34 sale ماStop بعد شغال لسه القضية من
اتقفلت
The stop sale from ISS-2026-0184 الحجز صفحة isفي
" it "Lift + Sep." 26 - 24 on يحتاجstill واحدة، (خطوة
.( inventory.stop_sell
UI 05.5
35 القضيةHoteliana في المورد من رد بتطلب
(waiting_on_supplier)
 يبقىchipالـ )warning( reply" your needs · والحجزIssue
.Needs في youيرجع
UI 11.25
جديد لحجز اتنقل 36re-الحجز
(sourced/replaced
Cancelled by Hoteliana · replaced by HTL-القديم
Replaces HTL-88214 )ISS-2026-". سطر88240 الجديد:
."0184)
UI 05.4B
في الرقم نفس الأساسي والسعر الجنسية 37سعر
ليلة
المختلفة الليالي بيعرض والقوس دي، لليلة واحدة مرة السعر يظهر
بس.
UI 05.11G
سعر (بيدفع مجموعة مالهاش جنسيته 38الضيف
الموسم)
" 05.11 Egyptian"UI · ليبل.Nationality أي غير من
rate" ليلةYour كل بيعرض 770" · 770 · 830 per ليلةSAR كل مختلف (سعر موسمين على 39حجز
2 × )830 + 770 + night per والإجماليroom 770"،
."rooms
UI 05.11G
40: واحدPagination صف فيها صفحة آخر
 واتأكد/اتنقل
" 2 page · 05.0 فضيتUI لو قبلها للي ترجع 41-40الصفحة ممنوع.Showing
05.0 بـPopoverUI 20 / 50 / 100 لصفحة(مقترح) يرجّع التغيير الصفوف.1. عدد 41تغيير
42 في التواريخ 05.17Dمنتقي OV بالماضي يسمح (استثناءلازم الماضيBookedفلتر في بفترة
Today / Last 7 closedمن days الـpast تبقىpresets").
".Next 7 nights" month This / days 30 Last / مشdays
مقفولة مستقبلية فترة
OV 05.17D
43Stay 05.16D مدىOV أقصى مسموحين. والمستقبل 366الماضي ليلة datesفلتر.(مقترح)
44 وGuestعمود phone" كـGuest بيظهروا معchips" بس شخصيةExport بيانات فيها بأعمدة
Modal: "This ﬁle contains. الـguest.pii في سطر
." + company your inside it Keep names. سجلguest
. bookings.exported · pii=true
OV 05.14
ومعاهPDF يتقفل CSV use - rows 500 to limited is PDFPDF منExport لأكتر 500 صف 45(مقترح
".or Excel
OV 05.14
46 تنبيهات بتاع Requestالإيميل رجعOn
(bounced)
" الإشعار bouncedجنب mariam@… to (منEmail
 11.R REF status فيdelivery 05.6). السطرUI
" alerts" the gets who تحذيرCheck يبقى
UI 05.6
47 الحسابHoteliana وقفت
(account_suspended)
. 11.14 11.14UI وصولUI مفيش
سطر هو. ما زي بلقطته يفضل noالحجز is room "This البيعinfo: بعد العقد من اتشالت غرفة على 48الحجز
longer on the contract. The booking keeps what was
".sold
UI 05.11

---

**p. 222**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
غرف مع الرقم نفس ليها كان واحدة غرفة 49إلغاء
)Same numberتانية
05.11C الملغيةUI الرقم.Voidالغرفة بنفس محتفظة التانية والغرف ،
يبقى الحجز تتلغي، غرفة آخر (مشCancelledلما · واحدةConﬁrmed واحدة اتلغت غرفه كل 50حجز
(.0 rooms
UI 06.2
)State machine( 7 الحالات.
بيشوفها المورد ما (زي الحجز حالة أ)
الحالة
(Badge)
المفتاحاللونبتدخلها الداخلي
من
إيه/مين اللي بتخرجبيحركها منها لـ
Needs an
answer
pending_supplier_responseWarningOnطلب
Request
جديد
Conﬁrmed /
Rejected /
Expired /
Cancelled
(Withdrawn)
Conﬁrm/Reject:
: supplier_user . Expired
. respond_by عندsystem
: طريقWithdrawn عن الوكيل
Hoteliana
 ConﬁrmedconfirmedSuccessتأكيد
أو المورد،
Instant
النظام من
In-؛Cancelled
 (تاريخhouse
 06إلغاء أوFlow بعدHoteliana
قضية
RejectedrejectedDangerرفض
المورد
— (نهائي)supplier_user
ExpiredexpiredNeutralالمهلة
خلصت
— (نهائي)system
كامل، CancelledcancelledDangerإلغاء
الوكيل أو
سحب
الطلب
— )24الوكيل  system (نهائي)Hoteliana/
h)
 وIn-house out مشChecked كـstatuses: وبيتعرضوا التاريخ من بيتحسبوا neutral. chip الـ(مقترح) يفضلBadge؛
."Conﬁrmed"
chip "Issue open ·" review under · issue Fulﬁlment ( 10.R الـREF المورد على يفضلBadge): وجنبهConﬁrmed
. )Info( الوسطىISS-…" الحالة بيشوف الوكيل
.Flow 06 tags asked: Amendment / asked علىCancellation )Warning( منConﬁrmed وبتيجي
الحالة مابيغيرش الجزئي بتتعلّمConﬁrmedالإلغاء الملغية والغرف ،
 غرفة لكل الفندق تأكيد رقم ب)
الحالةاللونمنلـTrigger
Not due—
(مايتعرضش
لسه Onالطلب
Request
 Pendingالتأكيد

---

**p. 223**

الحالةاللونمنلـTrigger
Problem / added Number رقم غير من PendingWarningالتأكيد
(Overdue) / Void
 يضيف عندsystemالمورد
 / الغرفةhcn_due_at إلغاء
Number / Void / )Disputed( الرقمProblem addedSuccessإضافة
)v2 added (تعديلNumber
إلغاءHoteliana / يعترضوا /الوكيل
يعدّل المورد / الغرفة
Problem · overdueDangerفات
hcn_due_at
Number added )late( / (الـ متأخر يضيف VoidIncidentالمورد
محسوب) يفضل
Problem · rejected by
hotel/Masar
DangerDisputedNumber added يصحح )v2(المورد
Room cancelled ·
number void
Hoteliana / 06 اتلغت—Flow Neutralالغرفة
of 2 rooms have a number" / "1 of 2 numbers in" / "Both rooms have their حالة أسوأ بيعرض الحجز 0عنوان
".number" / "1 room active · 1 number void
→ )Info( in_review  → )"Info "Waiting for Hoteliana( open  REF 11.R) القضية Caseج) / منIssue
waiting_on_supplier answer( an "Needs )"Warning →  resolved →  closed "Handled( Neutral القفل لازم").
.relocated · replaced · cancelled_by_hoteliana · closed_no_entry · والنتيجة وليه، بمين closed_entry_postedيتسجل
 الـ saleد) هناStop من بيتعمل اللي
الرفض saleمن عاديStop supplier = التقويم.set_by من بيتشال )،
 التبليغ incidentمن from · بخطوةauto وبيتشال بالقضية، مربوط it، لوLift لوحده يتشال أو فيHoteliana" ده اختارت
 يشيله)القفل اللي هو المورد لوحده، مابيتشالش .(مقترح:
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Search
( OV 05.8 )
2 يبدأ عشان الأقل على حروف أقصى(مقترح) لا100؛
(مع الضيف اسم (جزئي)، المرجع في بيدوّر حرف؛
الفندق؛guest.pii بس)، ؛case-insensitive
الزيادة المسافات بيتجاهل
hint "Type at least 2— حرفين من أقل (لو
"(characters
Hotel أو— واحد اختيار بس؛ النطاق ﬁlterلاAllفنادق
Stay dates
(range)
date" start the after date end an to".Pick ≤ أقصىfrom 366؛ ليلة مسموح(مقترح) الماضي لا؛
Booked future" the in be cannot dates today".Booking ≤ to ≤ مقفولfrom المستقبل )range(لا؛
من ﬁrst؛4واحد rate معHighest Sortلا"
 بسview_financial
—
Page 20— / 50 / 100 sizeلا(مقترح)

---

**p. 224**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Conﬁrmation
mode
( OV 05.2 )
من issuedواحد not / all for same / room نعمper
per room. الافتراضيyet
—
HCN per (الفاضي roomلا
(Pending
40–1 حرف و(مقترح) وأرقام إنجليزي حروف ؛
 . _ ومسافة مشtrim؛(مقترح) للمسافات؛
تحذيرHTL-…نفس = الفندق نفس في تكرار ؛
Use letters, numbers, - / _ . only (max 40).""
/ "This is the Hoteliana reference. Type the
This." / you gave hotel the تحذيرnumber
number is already on HTL-88190 at this
hotel. Save anyway if the hotel really issued
".it twice
Same number
for all rooms
غرف لو خانة2بيظهر متعلّم، لو FOR؛ لاNUMBER
ROOMS N ALL إجبارية"
Type the number, or untick Same number"
".for all rooms
 فيHCN
 05.10 (بعدOV
اتحفظ ما
Type" removed. be cannot number saved A الحفظ بعد —(مقترح)مايتفضاش
".the correct number, or report an issue
Save the
 أيnumbers بدون
تغيير
جنبه كده غير تغيير؛ فيه لو بس يشتغل —Nothingالزرار
."to save yet
—
Your booking
reference (PMS)
characters" 40 under it 40أقصى."Keep حرف لا(مقترح)
Note to
Hoteliana
(conﬁrm)
characters" 500 under note the 500أقصى."Keep حرف بعد(مقترح) حروف عداد لا400؛
Rejection
reason
( OV 05.3A )
reject" to reason a من."Pick نعم8واحد
Note to
Hoteliana
(reject)
 لولا، نعم
Other
reason
characters" 10 least at - why Hoteliana 500–10".Tell إجباري لو حرف (مقترح
Also stop sale
(reject)
مع يظهر متعلّم؛ مش لاافتراضي
 بسinventory.stop_sell
—
What is wrong
( OV 05.12 )
wrong" is what (شوف."Pick ثابتة قايمة سؤال11من نعم)4
Describe 20" least at - happened what 1,000–20Describe حرف itنعم(مقترح)
".characters
Offer من— حاجة3واحد ولا أو insteadلا
Also stop sale
(issue)
متعلّم— مش لاافتراضي
Export viewافتراضي— in bookings N scopeنعم"The
Export (افتراضيCSV PDF / 500؛Excel ≤ صفPDF formatنعم
(مقترح
PDF is limited to 500 rows - use CSV or"
".Excel

---

**p. 225**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Export (عمود columnsنعم
على واحد
الأقل)
column" one least at Reference؛chips".Pick ومقفول متعلّم دايمًا (مقترح)
9 الإشعارات. والإيميلات والسجل
سطر السجل old( · action · actionactor مينالقناة؟Requires الحدثيستلم
(→  new
On
Request
جديد
عنده مستخدم كل
 الفندقbookings.confirm على
in-app +
email
،إجباري(
مايتقفلش:
فيه
(deadline
نعم،
due_at = respond_by
booking.requested  · system
Needs an answer → — ·
Onتذكير
Request
%50عند
المهلة من
(مقترح)
نفسهمin-app
الـ (نفس
( +thread
email
system نعم·
booking.sla_reminder
أخير تذكير
15عند
باقية دقيقة
(مقترح)
نفسهمin-app
الـ (نفس
(thread
system نعم·
booking.sla_reminder_final
من يخرج الأصلي الإشعار Needsالفريق: أكد المورد
 + للكلyou (جانبهم)Hoteliana الوكيل
— supplier_user للمورد—·
Needs an · booking.confirmed
answer → Conﬁrmed (+ mode,
rooms)
supplier_user فوق——· اللي رفضنفس المورد
Needs an · booking.rejected
answer → Rejected · reason, note
Stop sale
الرفض من
———· supplier_user
· inventory.stop_sale_set
Open → Stopped · room, nights, all
meal plans · source=rejection
…-HTL
الطلب
Expired
+ bookings.confirmأصحابin-app
email
system ·  booking.expired لا·
Needs an answer → Expired
الوكيل
سحب
الطلب
hoteliana_user / api bookings.confirmأصحابin-appلا·
Needs an · booking.withdrawn
answer → Cancelled
حجز
Instant
جديد
أصحاب
bookings.view_operational
in-app
email)
اختياري
system ·  لاbooking.confirmed
Conﬁrmed · instant → — ·

---

**p. 226**

سطر السجل old( · action · actionactor مينالقناة؟Requires الحدثيستلم
(→  new
 التأكيد أرقام
مطلوبة
bookings.confirmأصحابin-app
(task)
نعم،
due_at = hcn_due_at
—
+ الأرقامنفسهمin-app تذكير
email
الـ (نفس
)،thread
للغرف
الناقصة
بس
system نعم·
· booking.hcn_reminder
rooms=[2]
الأرقام
اتأخرت
(Overdue)
+ Ownerنفسهمin-app
email
system نعم·
· booking.hcn_overdue
Problem → ؛Pending
HCN · incident.created
missing
الغرفtaskالـ كل لو يخرج فاوتشر— (الوكيل: اتضاف)V2— رقم
خلصت
· supplier_user
Room N: · booking.hcn_added
— → value
supplier_user اتعدّل———· رقم
Room · booking.hcn_changed
N: old → new
اتلغى رقم
(Void)
———· system
Room N: · booking.hcn_voided
value → void
الرقم
عليه اتعترض
(Disputed)
+ bookings.confirmأصحابin-app
email
hoteliana_user نعم·
· booking.hcn_disputed
Number added → Problem
عن تبليغ
مشكلة
Hoteliana——· supplier_user
open → — · incident.reported
· type, offer, stop_sale
Stop sale
القضية من
———· supplier_user
· inventory.stop_sale_set
Open → Stopped · auto · from
…-incident ISS
Hoteliana
على ردت
القضية
+ للكل)in-app مرئية (القضية كله الحساب
email
hoteliana_user نعم· رد: محتاجة لو
old → new · incident.updated
القضية
اتقفلت
+ كلهin-app الحساب
email
hoteliana_user لا·
 n_review → · incident.closed
closed · outcome, entry yes/no
اتلغى الحجز
من
Hoteliana
+ view_operationalأصحابin-app
email
hoteliana_user لا·
· booking.cancelled
…-Conﬁrmed → Cancelled · ISS

---

**p. 227**

سطر السجل old( · action · actionactor مينالقناة؟Requires الحدثيستلم
(→  new
Export———· supplier_user
scope, · bookings.exported
format, rows, pii=true/false
 الحجز نفس على الأحداث واحدthreadكل  ( 11.R والـREF حالةthread)، آخر على بيفتح
كده. غير بتقول تفضيلاته لو حتى والفندق، المنطقة على صلاحية عنده للي بس بيوصل الإشعار
  مافيهوشالإيميل المبلغ ولا الضيف اسم الـ(مقترح) (حماية ولينك. والتاريخ والفندق المرجع فيه الإيميل.)PII؛ صناديق في
 append-onlyالسجل الشخص دور وبيحفظ الأكشن.وقت،
)Acceptance criteria( 10 معايير. القبول
 .1When عندهGiven مستخدم وbookings.view_operational طلبينbookings.confirm وفيه Request مفتوحين،On
chip "Needs" ،Thenيفتح الشريط يشوف 2 answer your for waiting are وrequests مهلة، بأقرب مترتبين بكارتين
.2" answer عليهan
 .2Answer by وصلGiven طلب والـ11:35 3 ساعات،SLA يفتحWhen المستخدم 05.1 الساعةUI يشوفThen،14:14
.reload" left minutes 21 - today غير14:35 من دقيقة كل بينزل والعدّاد
 .3Number" لغرفتين،Given مفتوح طلب When لغرفة برقم يأكد المستخدم بس،1 يبقىThen الحجز وغرفةConﬁrmed 1،
 وغرفةadded 2"، علىPending" ويروح 05.4P"، ويتفتحUI للغرفةtask، بس2
 .4 اختارGiven المستخدم rooms all for number رقم،Same وكتب When" يأكد، منفصل،Then كسطر غرفة كل على يتخزن الرقم
."Both rooms have their number 05.11والصفحة تقولUI
. 5Conﬁrmed · اختارGiven المستخدم ،When يضغط ،Then الحجز
. hcn_reminder_at" pending علىreference يتجدول والتذكير
 .6 مفتوح،Given طلب يضغطWhen المستخدم request the سبب،Reject يختار ما غير من والرسالةThen" مايتبعتش الرفض
." reject" to reason a تظهرPick
 .7Tell Hoteliana why - at least 10 اختارGiven المستخدم ،When ملاحظة، غير من يرفض يظهرThen
".characters
 .8 علىGiven وعلّم رفض المستخدم ،When يتم، الرفض واللياليThen ماتتخصمش، الغرف الغرفة26–24 على تتقفل
."unchanged · now on stop sale وصفحة مايتغيرش، والسعر الوجبات، خطط لكل 05.5الفعلية تقولUI
. 9 غيرGiven من رفض المستخدم ،When التقويم، يفتح للإتاحةThen رجعوا والغرفتين بتتباع لسه الليالي
 لحدGiven رد مفيش توصلWhen،respond_by الساعة الحالةThen،14:35 منExpired يخرج والإشعار ترجع، والغرف .10،
" you وإشعارNeeds الفريق، كل عند يتبعتexpired
 .11Too late - this request فاتحGiven المستخدم 05.2 خلصت،OV والمهلة يضغطWhen ،Then يظهر
." conﬁrmed be not could and 14:35:00 at تتحفظexpired حاجة ومفيش
 .12Mariam Zaki already الطلب،Given نفس فاتحين مستخدمين When يضغط والتاني يأكد الأول ،Then ياخد التاني
.Conﬁrmed." 14:10 at booking this يفضلconﬁrmed والحجز
 .13 علىGiven بعض ورا ضغطتين ،When يوصلوا، الطلبين Then واحد سجل وسطر واحدة مرة يتأكد الحجز

---

**p. 228**

 .14 مستخدمGiven ofﬁce غيرFront (من يفتحWhen)،bookings.confirm 05.1 ومكانهمThen،UI موجودين مش الزرارين
".Only the Owner, an Admin or Reservations can answer this request. It expires at 14:35"
 غيرGiven من مستخدم ضيف،When،guest.pii باسم ويبحث القايمة يفتح العمودThen hidden بالاسمGuest والبحث .15"،
."placeholder "Search reference or والـ نتايج hotelمابيرجعش
. 16 مستخدمGiven Finance غيرview_ﬁnancial( من مؤكد،When)،view_operational حجز يفتح والسياسةThen التكلفة يشوف
 الضيوف أسماء ولا الخاصة الطلبات ولا التأكيد أرقام ومايشوفش
. 17" غيرGiven من مستخدم القايمة،When،bookings.view_financial يفتح عمودThen VAT INCL. · TOTAL مشYOUR
 و ﬁrstموجود، rate الـHighest في مش والـSort" فلوسExport، عمود مافيهوش
. 18deep عندهGiven مستخدم بس،bookings.view_counts البوابة،When يدخل "Bookings الـThen في مش والـnav" link،
."This screen needs bookings.view_operational" UI على 11.4بيوديه
. 19This booking was sold at 770 a بـGiven اتباع حجز دلوقتي770 المنشور والسعر يفتحWhen،830 05.1 يظهرThen،UI
830 to Board Half raised since have you - مايظهرشnight السطر نفسه، السعر ولو "؛
 .20.v1 مؤكد،Given حجز When وينشر، العقد في السياسة أو السعر يغيرّ المورد اللقطةThen ونسخة والسياسة السعر بنفس يفضل الحجز
 .21Saudi · GCC nationals price" مجموعةGiven بسعر حجز رمضان،GCC في الحجز،When يفتح "Nationality تقولThen
" قوسينused بين الأساسي والسعر معروض ليلة لكل والسعر
 .22 موسم،Given أي برا حجز الحجز،When يفتح جنسيةThen سعر ليبل أي مفيش
 .23N" غرفةGiven اتلغت،2 حجز من الحجز،When يفتح رقمهاThen void number · cancelled فيRoom ومابيدخلش مشطوب،
 M والـof عليهEdit"، متاح مش
 .24 Given الفندق، نفس في تاني حجز على مكتوب تأكيد رقم يحفظ،When عاديThen ويتحفظ التحذير يظهر
 .25This is the Hoteliana reference. مرجعGiven كتب المستخدم Hoteliana تأكيد، كرقم يحفظ،When بـThen يترفض الحفظ
".Type the number the hotel gave you
 .26Incident رقمGiven وPending عدّى،hcn_due_at الـWhen يشغّل النظام ،Then تبقى الغرفة ويتفتحProblem "HCN،
 …" والبانرmissing at"، due were numbers hotel مسموحةThe لسه المتأخرة والإضافة يظهر،
 .27You cannot cancel a مؤكد،Given حجز زرارWhen على يدوّر المستخدم ،Then والسطر مكان، أي في إلغاء زرار أي مفيش
." issue an Report use - yourself booking ظاهرconﬁrmed
 .28chip معGiven مشكلة عن بلّغ المستخدم ،When يتبعت، التبليغ يفضلThen الحجز ويظهرConﬁrmed "Issue،
."auto · from incident ISS · والـopen sale-…"، متعلّمStop
 .29 حجز،Given على مفتوحة قضية يضغطWhen المستخدم ،Then جديدة قضية مش القضية نفس يتفتح
 فيهاGiven القايمة حجز،47 علىWhen يروح bookings 47 of 21-40 "Showing ،Then والـ فيهURL" والـpage=2 .30،
 الصفحةrefresh نفس بيفتح
 .31 فلترGiven ،When الـ على يبص ،Then على محسوبة الأعداد Suites بسRawdah
 .32 فلترGiven ،When التاريخ، منتقي يفتح مقفولThen والمستقبل مفتوحة فاتت اللي الأيام
 .33Guest Export لـGiven صفوف8 غيرCSV من مستخدم من ينزل،When،guest.pii الملف مافيهوشThen ولاGuest
 وفيهphone السجل8، في ويتسجل بالظبط، صفوف
 .34 واحد،Given فندق نطاقه مستخدم يفتحWhen link تاني،deep فندق في لحجز Then  11.5 الحجزUI عن تفصيلة أي غير من
 .35 Given بيأكد، وهو فصلت الشبكة تاني،When يضغط يرجع الـThen نفس key idempotency مرتين، مايتأكدش والحجز بيتبعت،
ماضاعش كتبه واللي

---

**p. 229**

11 أسئلة. مفتوحة
اقتراحي الوضعالمؤقت في #السؤالالمصادر
الـ مهلة بيحدد 1Onمين
؟Request
hours · set by Hoteliana, 3" : 05.6 / UI 05.1
On): you by الفندقnot على 03" Flow ( عقد03.1B
" "لازمRequest المورد،SLA يحطه
On Request" = CONFIRMATION_MODE_INVALIDو
: BK-3 module Bookings missing". حسبSLA شرايح
.)d: 24 h · 2–7 d: 4 h · ≤ 48 h: 1 h الوصول 7بُعد
respond_by يبعتbackendالـ
بينsla_sourceو واحدة أقل = القيمة SLA؛
. وشريحة Hotelianaالعقد الشاشة(مقترح) في النص
من .sla_sourceيتولد
عند بيحصل اللي 2إيه
المهلة؟ انتهاء
D7: "Escalate to العميلExpiredالديزاين قرار لوحده.
Auto-" أوHoteliana والـAuto-reject العقد، في (إعداد
 اتشالrelease
 الاتنين الفرقExpiredللمورد بعدها؛ يرد ومايقدرش
Hotelianaعند تأكيد. محتاج بس. /الوكيل
3 05.1 بيقولUI
go straightالغرف
" sale on بعدback
الرفض/الانتهاء
a"( UI 05.6 عكس 04.Rده REF 1B وRule
returned room only sells if the night itself is still
.("on sale
go back فيREFالـ النص يكسب. يتعدّل05.1
".to your allotment
4Report anأنواع
"issue
Overbooked · room unavailable · : OV 05.12
guest details wrong · rate or policy wrong · other.
REF 10.R : hotel_overbooked ·
room_out_of_service · hotel_closed ·
N1: "Guest. other · قرارoutside_our_control
."nationality differs
  بمجموعتين: واحدة أنفذقايمة هقدر (الـمش بتوع5
Incident.10 ← وR الأداء) تحذير + غلط البيانات
Guest details wrong · Guest nationality)
differs · Rate or policy wrong · Guest did not
 )arrive ← تحذيرCase غير من عادي
في مفتاح 5مفيش
 08.R لإضافةREF
 للتبليغ ولا التأكيد رقم
مشكلة عن
 ومفيش31 مفتاح ولاbookings.hcn
 bookings.report_issue . ofﬁce الليFront هو
الفندق من الرقم بيستلم عادة
. مفتاحbookings.confirmمؤقتًا الأحسن
 لـbookings.hcn_editجديد
.Owner/Admin/Reservations/Front ofﬁce
BK-8الديزاين 18:00". at today reminder التذكيرone الأرقام: تذكير 6وقت
min)conf + 48 h, arrival, h(min والتأخير24 المدة)، نص
.h 4 h( 24 أدنى− بحد
BK- والـBK-8 يكسب، 18:00 إن تأكيد محتاج مثال.
 اتقفل8 module بيقولBookings مستنيD4 لسه
6 شاشةPOالـ ومفيش مرسومةOverdue).
(.25#
يشوف المورد 7هل
الوكالة؟ اسم
booked by a Hoteliana الحجز agent".صفحة
".OV 05.8 : "the agent who booked it
."Agency 05.14 عمودOV فيه
 عمودHotelianaمايشوفش يتشال الطرف). هي
 بالوكالة.Agency والبحث
8Guestعمود
Export" الـphone في
الـ من تحتMVPيتشال للتفاصيل يتضاف أو تفاصيل، شاشة أي في معروض مش
.guest.pii
9UI 05.0C
Closed · rejected"
" expired بيعرضand
 (فيهم7 صفوف
) ومفيشCancelled
Closed اسمهchip
.chips: Cancelled 3 · Rejected 3 · Expired "Closedمفيش لشكل05.0C"؛chip مرجع 1الـ
" نضيف أو المقفولة. "Closedالصفوف بدلchip
التلاتة.
في متضاربة 10أرقام
الديزاين
الـ نفس من العدد بس؛ 05.7.queryمثال OV / 05.15 : 48" والقايمةbookings .47"،

---

**p. 230**

اقتراحي الوضعالمؤقت في #السؤالالمصادر
11OV 05.17D
) بيستخدمBooked(
 المستقبلpresets
Next 7 nights",")
(""Whole season
past days closed for the بيقولDECISIONSو
".supplier
 والمستقبلBookedفلتر مفتوح الماضي استثناء:
).42# 6مقفول
12: UI 05.11C
بقى 2,310الإجمالي
 غرفة إلغاء تحت2بعد
Non-سياسة
refundable
 سطر ·يظهر 2 Room · charge غرفةCancellation على الإلغاء رسوم للمورد2المفروض تفضل
" pending Charge · SAR التفاصيل2,310 في
المالية
13 05.11G نصUI
You raisedقديم
"Half Board to 830
فبراير حجز على
.copy فعلي فرق فيه لو بس يظهر leftover.)BR-05-15السطر
14 فيBadges مش
REF 00.S
،"
Room cancelled ·
."number void
Number added" ←"
Issue open" ←
void" ←
)Neutral( للـSuperseded" نضيفهم أو glossary،
رسميًا
15No-show No-show module: فيBookings المورد تقرير من بيجي
شاشة مفيش البوابة؛
.Report an issue" )§4 في A17(نوع
16On  Requestتأكيد
خلص المخزون ما بعد
".R: "On Request needs no stock.03). تحذير سطر مع E22مسموح ده هل تأكيد محتاج
.overbookingبيتسجل
17: مينInstantحجز
إشعاره؟ بيستلم
لأصحابin-app محدد.،view_operational مش
اختياري والإيميل
18 saleالـ بتاعStop
لوحده يتشال القضية:
تتقفل؟ القضية لما
R: "can be lifted in one step when the case.10
."closes
في تذكير وسطر أوتوماتيك)، (مش بخطوة يشيله المورد
الحجز.

---

**p. 231**

