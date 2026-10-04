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

# Flow 03 · Hotel supply contracts

contracts supply Hotel 03: (Flow عقود )التوريد
المصادر section Figma  523:3211 03( شاشاتFlow في03.*)، 12 Flow ( على3662:62744 وبتكسب الأحدث وهي ،
 03.Rالقديم)، REF ( 10.R)،1166:3085 REF ( 08.R)،1388:6334 (الصلاحيات)،REF 11.R والنشر)،REF (الحفظ
Flow 12 < REF  10.0/10.1/10.2 وملفUI وDECISIONS، module، Supply reviewed( تعارض). فيه لو الغلبة ترتيب
  يتأكد. ما لحد المقترح القرار ومعاه مفتوحة) (أسئلة الفلو آخر في مكتوب لقيته تعارض كل الشاشات. باقي الفلو:< فكلتقسيم كبير، الفلو
 ثابتة: لأجزاء متقسّم قسم
 العقودA قايمة عقدB إنشاء الجنسياتC وأسعار المواسم الإلغاءD سياسة الـE والـRelease Cut-off · القيودF
 )Restrictions( · إنهاء،G إيقاف، نشر، (تعديل، الشغال العقد انتهاءAmend الـH، طابور Request On · السعرI حساب
الليلة وتقييم
1 الهدف. والنطاق
موجود ده الفلو ليه
 والمخزون الأسعار صاحب هو .)D2المورد Hoteliana  بتعدّل ولا بيبقىمابتوافقش العقد العقود. على Live اللحظة في يأكد المورد اللي
المراجعة. فيها
 + ليلة بيخلي اللي الوحيد الوعاء هو Requestالعقد منOn سياسات. + قيود
 عقد بيع.Activeغير مفيش
 النسخة (نفس تشغيلي تعديل ← تفعيل ← إنشاء كله: العقد عمر بيغطي ←Amendالفلو إيقاف/استئناف ← جديدة) (نسخة تجاري
جديدة. لفترة نسخ ← إنهاء أو انتهاء
النطاق ):MVPجوه
.Draft + Resume الفلاتر + العقود attentionقايمة الحالةNeed حسب الصف أوامر + sell مسحStop + كله للعقد
بـ واحدة صفحة على عقد تسعير10إنشاء بنوعين بالترتيب، بتتفتح أقسام room per price Fixed / supplements + )،Base
).Shared pool / Per room type / Free  تأكيد Blockونوعين / وAllotment Request مخزونOn موديلات وتلات sale)،
) seasonsالمواسم بس.Rate المواسم جوه الجنسيات وأسعار الكاملة، بأسعارها
 + والـ لوحده)، موسم ولكل (للعقد، بالشرايح الإلغاء cut-offسياسة & والقيودRelease nights، الوصول/المغادرة).Min قفل
 الشغال العقد modeصفحة محجوزة،Edit بتغييرات publish & جديدة،Amend،Terminate،Pause،Discard،Review بنسخة
.Activity & soon only،Expiring read versions،Terminated،Expired
.SLA الـ Requestطابور On والـ الرفض، أو بالتأكيد والرد بالعقد، الخاص
النطاق: برا
. الليلة مستوى على pricesالتعديل sale،Bulk،Change لليلة،Stop الـRelease لليلة، list )Win ← 04 إزايFlow بنقول بس هنا
تعديلاتها. بيعرض الموسم وإزاي عليها بيأثر العقد
.Flow 06. الحجوزات صفحة من وقبوله نفسه الحجز 05تفاصيل والتعديلFlow الإلغاء طلبات
.Flow ناقصة غرفة أو فندق 02طلب
). Hotelianaإيقاف Hoteliana( by العامةPaused العقد انتهاء وشاشات 10) Flow ( 10.0/10.1/10.2 بسUI بنحدد هنا
والقايمة. العقد صفحة على بيظهروا إزاي

---

**p. 105**

.agents agentالـ AI الـMawsim" ملف ← الجاية السنة مواسم بيقترح اللي
(مشLater غير):MVP عملة (انظرSAR معينة،Q1 لغرفة إلغاء سياسة stay)، window،Max منBooking الدفع شروط إعداد ،
 من (بتتحدد المورد الـHotelianaناحية في بس)،Admin قراءة للمورد وبتظهر Excel، الموردImport ناحية من الأسعار لشيت
(من والصلاحيات بيستخدمه 08.Rمين REF بالدور): مش بالمفتاح دايمًا الشرط ،
الأدوار الجاهزة اللي الفعلالمفتاحعندها
المفتاح
اللي وكل عقد وأي العقود قايمة يشوف
Activity & والـ versionsجواه،
contracts.viewRevenue،Admin،Owner
Auditor،Finance،manager
يكمّل عقد، يمسحDraftينشئ ،Draft،
Copy to new period
contracts.editRevenue،Admin،Owner
manager
يعملActivateيفعّل ،Pause،Amend)،
Terminate،Resume
contracts.lifecycleAdmin،Owner
العقدrates.viewRevenue،Admin،Owner جوه الأسعار يشوف
،Reservations،manager
Auditor،Finance
أسعار/مواسم /Supplementsيعدّل
محجوزة) (تغييرات شغال عقد في جنسيات
rates.edit_draftRevenue،Admin،Owner
manager
Review المحجوزة التغييرات &ينشر
(publish
rates.publishRevenue،Admin،Owner
manager
المخزونinventory.viewRevenue،Admin،Owner يشوف
Auditor،Reservations،manager
inventory.editRevenue،Admin،Owner الغرف عدد يغيرّ
manager
 sellinventory.stop_sellRevenue،Admin،Owner كلهStop العقد أو غرفة، (ليلة،
Reservations،manager
 الحدOverbookingيشغّلinventory.overbookingRevenue،Admin،Owner ويحدد
manager
On bookings.confirmReservations،Admin،Owner طلب Requestيأكد
On طلبbookings.rejectReservations،Admin،Owner Requestيرفض
  والـ والسياسات القيود عقدSLAيغيرّ في
شغال
rates.publish للحجزrates.edit_draft
) REF  فيللنشر مخصص مفتاح مفيش 08.R(مقترح،
Revenue،Admin،Owner
manager
 مقفول): مش (مخفي العرض مالوشقاعدة لو التابcontracts.view contracts"، supply Hotel تاباتمايترسمش شريط في
Only the Owner or an عندهProperty لو contracts.view. الزرار الفعل، مفتاح عنده ومش مثلاًيتشال رمادي، سطر ومكانه
 contract." a terminate or pause amend, activate, can Admin ممنوعDisabledزرار شرح غير من
OV 03.14RO ( Read حاجة:Auditor كل only الـRead شكل بنفس بتتفتح الصفحات وكل خالص، فعل زرار أي ومفيش only،
كنموذج
On وReservations ofﬁce عندهمFront مش القايمةcontracts.view بيشوفوا فمش الـReservations، على بيرد
).Q7. منRequest Bookings 05( منFlow مش 03.23)، (انظرUI

---

**p. 106**

 manager عندهRevenue عندهcontracts.edit ومش الـcontracts.lifecycle يبني يقدر زرارDraft: بس كامل،
"Ready for activation. Only the Owner or an Admin can activate - ask contract" ومكانهActivate بيترسم مش
it." review to زرارthem + admin" an (إشعارNotify للـin-app والـOwner Admins .)مقترح،
الدخول نقط
. 1My Hotels · Hotel supply contracts · Hotel Library · الناف تابProperty ← contracts" supply (التاباتHotel
.property/contracts). agreement & Company · الرابطRequests
 .2"Create a contract for( UI 03.0B contract"زرار supply وفيCreate القايمة، هيدر في 03.0A وفيUI الفاضية)، (الحالة
 Suites" مسبقًا).Rawdah متحدد بالفندق
 .3 Hotels My 02( المتقبل):Flow الفندق صف contract" "Create ←  03.1 مسبقًاUI متحدد والفندق
.( /property/contracts/new?hotel={id} )
 .4 ← لفندق وصول طلب قبول 02بعد الإشعار):Flow approved" لينكAccess فيه contract" a فوقCreate اللي نفس
. 5 ← 09الداشبورد كارت):Flow soon ending Contract / answer an need Request On / attention بفلترNeed القايمة
.UI 03.23) attention Need ( 03.0H علىUI أو العقد على مباشرة أو
 .6 والإيميل: طلبالإشعارات Request جديد،On انتهى،SLA العقد ينتهي، قرب العقد يخلص، قرب نشرHoteliana زميل العقد، وقّفت
) عمل Amendأو ← link العقدDeep على الطابورproperty/contracts/}id{ على أو
).OV 03.23R ( نفسهproperty/contracts/}id{/on-request الطلب على أو يفتحon-request/}bookingId{)
 .7 Availability & Rates 04( لينك):Flow contract" وOpen التقويم، هيدر من →" night بترجعOpen الموسم تفاصيل من
للتقويم
. 8 Bookings 05( بيعرض):Flow الحجز v1.3" لينكContract 03.3A ديOV النسخة على
 .9"See what is UI 10 :Flow  10.0 UI /  10.1 UI period" new a for "Renew ← period new to وCopy 10.2،
.Flow 04 blocker drawer ← blocking sale"
 .10anchor link لـDeep :Draft  بيفتحproperty/contracts/}id{/edit 03.1 عندهUI وقف اللي القسم نفس على
.( #section-6
2 قواعد. البيزنس
عام
BR-03-01 = الواحد العقد واحدة فترة + واحد فندق الـ إنشاء بعد أبدًا مايتغيرش الفندق جديد.Draft. عقد يتعمل الفندق لتغيير ؛
"Activates the بيبقىBR-03-02 العقد Live  التأكيد فيلحظة activate & Review من. موافقة الثابت.Hotelianaمفيش النص
moment you conﬁrm the review - no Hoteliana approval."
 BR-03-03 الأسعار كل 15%شاملة وبالريالVAT الثابتSAR السطر 15%"). VAT include prices جدولAll أي فوق يظهر
آلاف وبفاصل كسور، غير من صحيحة أرقام الأسعار .)1,030أسعار.
.Saudi time والـBR-03-04 المواعيد كل والـSLA والـRelease مكةCut-off بتوقيت جنبهUTC+3 يظهر والوقت )UTC+3(")،
."Weekend الافتراضيBR-03-05 إند الويك الأحد. بيبدأ الأسبوع Fri · فيThu أيامه يحدد يقدر عقد وكل days"،
01 BR-03-06 والتواريخ العقد مدة :شاملة date." 'to' the of night the is night last the - inclusive to, and يعنيFrom
. 2027 Aug 31 - 2026 Sep = ليلة365
بياخدBR-03-07 حجز أي والـSnapshot الإلغاء، وشرايح العقد، نسخة من: والـRelease المستخدم،SLA، الجنسية وسعر والسعر، ،
  التأكيد. وقت الدفع، وشرط أبدًا ده الحجز مابيلمسش كده بعد تعديل الـأي على حجز كل بتسوّي والمالية بتاعهSnapshot،

---

**p. 107**

 بتقراBR-03-08 الشاشات كل بنفسها. بتتباع" مش الليلة "ليه سبب بتحسب شاشة مفيش المحركblockers][ من
.( REF 10.R )
.)2 BR-03-09 sell جوهStop المورد من قرار Active للعقد، حالة مالوشمش نفسه العقد status". "sell ( 03.R خطوةREF
 contract" whole sell "Stop = sale اللياليStop كل على
 BR-03-10 Pause العقد = المورد من الوكلاءيختفي عن sell Stop العقد = مابيلمسوشظاهر الاتنين بتتباع. ليلة مفيش بس
المؤكدة الحجوزات
 BR-03-11 تحضرّHoteliana ممكن موقّعDraft أسعار شيت من للمورد loading الـCT-8،Assisted القايمةDraft). في بيظهر ده
.Live شيب وعليه Hoteliana"عادي by وPrepared بس، يفعّلهالمورد اللي عقدHoteliana تعدّل ولا تفعّل مابتقدرش
القايمة
BR-03-12 عقود بتعرض القايمة كلها الحالةالشركة الافتراضي: الترتيب المربوطة. الفنادق كل على ،Scheduled،Active،Draft
."Ending حالةTerminated،Expired،Paused كل وجوه soonest")،
"Expired and Terminated are hidden by default - tick :Terminated BR-03-13 الافتراضي الحالة فلتر وExpiredبيخفي
.( OV 03.0E ) them to see the archive."
 النسخةBR-03-14 رقم الفندق، اسم العقد، اسم في: بيدور البحث v1.3 ). دايمًا البحث في بتطلع والمنهية المنتهية لوالعقود حتى
"A terminated or expired contract still answers a search - it has to, because bookings sold on الفلتر من itمخفية
are still alive."
Everything · Covering today ·. BR-03-15 على بيشتغل الفترة فلتر الإنشاء تاريخ مش بيغطيها، العقد اللي الخياراتالفترة
Ending. pick you range date A · over Already · days 90 next the in Ending · days 90 next the in الترتيبStarting
.Newest ﬁrst · Hotel name (الافتراضيsoonest
 BR-03-16 بيعرض الفندق فلتر في المربوطة Hotelsالفنادق بسMy عقوده عدد فندق كل وجنب
:) OV 03.0G BR-03-17 attention بيجمعNeed أنواع5
 soon عقد:Expiring نهايتهActive على فاضل (افتراضيcontract_expiry_warning_threshold يوم30 .1،
Hoteliana للكل، أو مورد لكل فيه بتتحكم الكود في ثابت .)مايتكتبش
 .2 changes محجوزة:Unpublished تغييرات عليه عقد mode نسخةEdit أو Draft) ماتنشرتشAmend لسه
 .3. nights ليلة:Sold-out الـ0 في متاح (مقترح30 الجاية ليلة
 .4. SLA past / auto-rejected Request الـ:On عدّى طلب آخرSLA في (مقترح24 ساعة
 .5 Stock ≥ 2 فيها:left فاضل غرفة الـ2 من ليلة أي في (مقترح)7 الليلة شاملة الجاية ليالي كارت alerts". الليلةStock = فوق
.)"rooms with ≤ 2 left tonight"بس
). كارتBR-03-18 attention" المشاكلNeed وعدد العقود عدد بيعرض issues" 4 · contracts 2 من أكتر اختيار بيقبل الفلتر
."Show these العدد بيقول والزرار 3"نوع،
.URL. الـBR-03-19 :Pagination (مقترح)25 صف الـ في بيتحفظوا والصفحة والترتيب الفلتر
أوامر الصف حسب الحالة
BR-03-20 بالحالة بتتحدد الأوامر وبالصلاحية صلاحية مالوش أمر أي بعض. مع :مايترسمش
الأوامر الحالةبالترتيب
ActiveOpen · Edit operational settings · Amend commercial contract · Pause · Stop sell whole contract ·
Copy to new period · Terminate · Activity & versions

---

**p. 108**

الأوامر الحالةبالترتيب
Active + Expiring soon"Extend the term, or change type or currency" وActiveزي contract"، commercial تحتهAmend يتكتب
Active · amendingOpen · Continue amendment v1.4 · Discard amendment · Pause · Stop sell whole contract ·
Terminate · Activity & versions
ScheduledOpen · Edit operational settings · Amend commercial contract · Pause · Stop sell whole contract ·
Copy to new period · Terminate · Activity & versions
PausedOpen · Resume · Terminate · Activity & versions
DraftContinue draft · Delete draft
ExpiredView · Copy to new period · Activity & versions
TerminatedView · Activity & versions
Paused حالة byأي
Hoteliana
Hoteliana أصفر سطر وفوقهم العادية، →"الأوامر up Follow · Hoteliana by إيقافPaused يرفع أمر أي ومفيش
الإنشاء
Contract basics · 2 Pricing model & base · 3 Rooms · 4 1 BR-03-21 الإنشاء واحدة صفحة ( 03.1 بـUI أقسام10)
.Extra children · 5 Meal plans · 6 Inventory · 7 Rate seasons · 8 Restrictions · 9 Policies · 10 Review & activate
Hotel · Term · Type ·( "LIVE SUMMARY" عليه قسم (كل الأقسام ناف فيه ويمين🔒شمال مقفول)، لو
(.Rooms on sale · Seasons · Stock
BR-03-22 الفتح ترتيب
" 🔒  تفتح: الصفحة ما أول فعلاً فاضية الحقول وقسمكل الأقسام1 مفتوح. بس بسطر10،9،8،6،5،4،3،2 مقفولة
Sections 2, 3, 4, 5, 6, 8, 9 and 10 - unlocks once the hotel and contract term are set."
.) UI 03.1A  المدةبعد + الأقسامالفندق و6–2: تتفتح10–8
Unlocks). 7قسم seasons( ماRate لحد مقفول بيفضل تكمل6–1) و8 يتقرروا9 يتختار أو حاجة (يتضاف الرسالةNone
when every other section is done - sections 1-6, plus Restrictions and Policies (add them, or choose
."Go to Policies ↓" لينكينNone(." ومعاها ↓" Restrictions to وGo
"Complete every section to activate - seasons are optional." للتفعيل اختيارية المواسم
BR-03-23 قسم: كل اكتمال شروط
يبقى  ✓ القسملما
Contract basics 1 + ولو النوع، + إند الويك + العملة + المدة + الاسم + Requestالفندق الـOn الانتهاءSLA: سلوك
Pricing model & base 2: فيو،Base وجبة، (غرفة، كامل الأساس صف + الموديل سعرينWeekend،Weekday: لو بسFixed الموديل
Rooms 3: ليهاBase متعلّمة غرفة كل + الأساس غرفة Fixed: كاملSupplement. بسعر الأقل على واحد صف
Extra children قيمةBase ليه متعلّم صف كل بس: بيتعلّمFree مسموح. صفوف صفر محسوبة). 4(مقترح
Meal plans 5Supplement ليهاBase متعلّمة وجبة كل + الأساس وجبة بس: وBasis
Inventory 6✓ :On Request .)Overbooking (+ الأرقام + outالموديل sold لوWhen الحد
Rate seasons التفعيل ويقفل تحذير عليه القسم أسعار) أو تواريخ غير (من ناقص موسم فيه لو 7اختياري.

---

**p. 109**

يبقى  ✓ القسملما
Restrictions 8"None on the أو الأقل، على واحد contract"قيد
Policies 9)BR-03-33 أو محفوظة إلغاء contract"سياسة the on والـNone محتاجهSLA، لو
). BR-03-24 التلقائي الحفظ بيبدأ الفندق اختيار بعد hotel"( a pick you once autosaves · yet saved not بعدهاDraft
"Draft autosaved just now"). كل بيحفظ (مقترح)10السيرفر ثواني الـ وعند تعديل آخر من حقلBlur أي من 11.R المؤشرREF
· saved_draft  · unsaved_local. / "Saving…" / retrying" - saved ومايتدمجوشNot منفصلة الأربعة الحالات
. published  · publish_failed
"Pick a hotel ﬁrst - a draft زرارBR-03-25 draft" Save بتقول ضغطة أول الفندق اختيار قبل فوري. حفظ وبيعمل دايمًا، موجود
belongs to one hotel."
 BR-03-26 ربطهاالفندق: حالة اللي الفنادق بس فيApproved Hotels عليهMy اللي الفندق منPause. رخصةHoteliana أو
Pending / Rejected / Suspended  المنتهية (الرخصة عادي بيظهر البيعمنتهية ربطهHoteliana،مابتوقفش اللي الفندق بتقرر).
Al Safa City, Jabal View and Palm District are not linked yet - request access سطرمايظهرش القايمة وتحت from،
.Open Hotel Library" + Hotel Library ﬁrst."
24). BR-03-27 البدايةالمدة: الأقصىpicker الحد الأقل). على واحدة (ليلة البداية < النهاية
 (مقترح) جاهزةشهر اختصارات 12. 2027 Summer · 1448 Hajj · 1448 Ramadan · جدولmonths من الهجري (تواريخ
).Calendars & seasons ‹ Conﬁguration ‹ في Adminالمواسم
Two contracts can BR-03-28 الفندق نفس على تاني عقد مع تداخل أوActive( أوScheduled Paused منع): مش .تحذير
 intended." is that if only Continue both. see agents وزرارoverlap; anyway" معContinue التداخل معDraft. أو تاني
 تحذيرExpired/Terminated مابيطلعش
.)Q1 BR-03-29 العملة: بعد بتتقفل مؤكد حجز بـأول تتغير وبعدها الـAmend، في بس. MVP بسSAR (انظر
."One price all week" BR-03-30 إند: الويك منأيام لـ0 3 أيام لو(مقترح) أيام،0. priced" is week the علىHow بيتقفل
BR-03-31 العقد نوع
.)Instant Block / Allotment فورًا بيتأكد والحجز الليلة، في غرف بعدد بيلتزم المورد (الافتراضي):
Inventory. Request :On لازم المورد. تأكيد مستني حجز وكل بيه، ملتزم مخزون مفيش وSLA الـ انتهاء قسمSLAسلوك
"On Request: no stock is committed. You set a response SLA in Contract basics; every لسطر bookingبيتحول
waits for your conﬁrmation."
. BR-03-32 الخيارات:SLAالـ بالدقايق. للعقد، واحدة قيمة 15 · 30 · 60 · 120 · (مقترح)240 دقيقة والافتراضي دقيقة30،
 arrives." request the when starts Countdown الـ يخلصSLAلما واحد اختيار
: بيتبلغAuto-reject" والوكيل بترجع، المحجوزة والغرفة أوتوماتيك، بيترفض الطلب
"If you don't answer in 30 minutes, the request goes to Hoteliana's team, who call :"Escalate to Hoteliana"
you." for hotel طابورthe في ويظهر عليها يرد يقدر المورد اللي الطلبات من بيختفي الطلب بيشوفهHoteliana والمورد Read،
."With Hoteliana" بحالةonly
"After release = Switch الـBR-03-33 عقدSLA في كمان مطلوب لوBlock Request" On to Switch = out sold أوWhen
 Request" On قسمto في بيظهر الحقل دي الحالة في 9. اسمPolicies تحت SLA" Request الاختيارينOn ونفس القيمة (نفس
 ناقص Blockerلو  مقفولCONFIRMATION_MODE_INVALID والتفعيل

---

**p. 110**

التسعير
Pricing model · ﬁxed once the BR-03-34 واحدة مرة بيتختار التسعير الموديلموديل نفس على بتمشي والمواسم للعقد،
.)Copy to new active" is contract مايتغيرش التفعيل بعد بـ. جديدAmendحتى عقد = تغييره period؛
:Base + supplements BR-03-35
"The cheapest sellable الأساس costصف Weekend · cost Weekday · View · Meal · Room ده تتباع. غرفة :أرخص
room; every other price is measured from it."
الأساس = تانية غرفة Supplementكل ≤ الأساس0 غرفة الأرخص). هو الأساس (لأن locked" · room قسمBase في ،3
 قسم من يتغير بس.2وسعرها
Adults are priced by the room itself - a Triple or والـTripleالـ Quad لوحده غرفة للكبارنوع زيادة سرير (مش بسعره
a Quad is its own room type in Rooms."
"Weekday & priced" is week the :"How week" all price أوOne الأساسي) السعر في بتتجاهل إند الويك (أيام
 الافتراضيweekend" (سعرين). weekend & الـWeekday إندSupplement. والويك الأسبوع في المبلغ نفس
"Change a price here and every room built on it moves  يتغير، الأساس الفرقلما بنفس بتتحرك عليه مبنية غرفة :كل
with it."
"no base and no room supplements - every room gets its own full price in :Fixed price per room BR-03-36
"No extra bed and no Rooms" + غرفة = صف كل واحدة. وجبة + واحد سعرفيو + سعرWeekday + كامل كاملWeekend
 sold." as exactly room the is price this - لوحدهsupplements كصف مختلفة، وجبة أو بفيو مرة كذا تتضاف ممكن الغرفة نفس
  فيو).بسعره. + وجبة + (غرفة بنفس صفين مفيش 4قسم children( وقسمExtra 5) plans( مابيظهروشMeal ده،) الموديل في
  بتتباعيعني زيادة أطفال عقدمفيش على مابيطلعوش).Fixed زيادة بطفل (البحث
Child 0 - 5 sharing the parents' bed · Child BR-03-37 children Extra supplements( + ثابتةBase صفوف تلات بس):
Free bed extra an with 11 - 6 Child · bed extra no sharing, 11 - صف6 كل الليلةSupplement. في
.  دي الحالة = عليه متعلّم مش صف الجنسيات. ولكل ليلة كل المبلغ نفس منمابتتباعشمسموح). الغرفة في المسموح الأطفال عدد
المكتبة في الغرفة العقد.Contentبيانات من مش )،
Room Only · Bed & Breakfast · Half Board · Full Board · Iftar BR-03-38 plans Meal supplements( + بسBase
"Base · وجبةSuhur كل Basis. person( أوPer room )Per + قسمSupplement في المختارة الأساس وجبة بتبقى2.
.) عليهاincluded" متعلّم تفضل ولازم person المبلغPer = (مقترح5-0الأطفال الوجبات في بيتحسبوا مش
 BR-03-39 list قسمPrice تحت غرفة5 كل سعر بيعرض بس، قراءة جدول الأسبوع: أيام الغرفةفي ضيوف لعدد
. وسطر guest"نفسها، per are meals · price every to base{ the of weekday − }weekend adds weekend بحثthe فيه
". وملخص الفيو، أو SAR"بالغرفة }min{ From · types room }m{ · sale on rooms }n{ بتظهر عليها متعلّم المش الغرفة
.{Room} - not on sale in this contract"
المخزون
 BR-03-40 number one · pool الإقامة:Shared منه. بيسحب غرفة نوع وكل العقد، لكل الليلة في للغرف واحد رقم بتاخد3 ليالي
"a room type with a cap :)"Max from this room · optional"(  الـ من ليلة كل من ممكن3غرفة غرفةCap. نوع لكل اختياري
No cap = that room can take the whole pool." .Pool≥ Cap more." has pool the if even cap its at الـstops
 BR-03-41 type room رقمه:Per ليه غرفة نوع كل room." Standard a uses never booking Deluxe علىA الوجبات كل
 الرقم الوجبة). على مش الفعلية، الغرفة على (المخزون رقمها من بتسحب الغرفة الليلة0نفس معروض مش ده النوع = مسموح
(.NO_INVENTORY  Blocker)

---

**p. 111**

"When sold out does not apply: BR-03-42 quantity no · sale :Free مخزونه على حجز كل بيأكد والفندق كمية، مفيش
.Rates & Availability out." sell can الوحيدةnothing الأداة sale منStop
 BR-03-43 out sold (للـWhen وPool type room بسPer
sale" Stop تتباع. غرفة آخر ما لحظة بتتقفل الليلة (مقترح: .الافتراضي
.SLA: Request" On to الـSwitch جوه يرد والمورد الليلة، يطلب يقدر الوكيل
"Maximum conﬁrmed = stock + limit." overbooking" Controlled الليلة: في حد مفتوح1لازم يبقى ممكن ومش .،
 للحد الأقصى أو10الحد غرف حاجة20 وأقل فيهم، الأقل المخزون، من (مقترح)1% الـ في الـPool. على الحد كلهPool
Maximum pool"( the across night a 2 + 50 = conﬁrmed فيMaximum type)؛ room لوحدهPer نوع كل على الحد
.(conﬁrmed = 20 + 2 for Standard Room"
 BR-03-44 المباع 3حماية Rule 04.R REF / ليلة):CT-3 أي في المخزون Request أيOn مستنية).
 أقل صفمرفوضرقم أو غرفة نوع Fixed. مستقبلية حجوزات عليه مايتمسحش يتباع)، فيبطل علامته (يتشال بس ويفضليتقفل ،
.Not on sale · }n{ future bookings"ظاهر
التفعيل
I conﬁrm these BR-03-45 activate & بيفتحReview وDrawer له، يرجع بلينك قسم كل ملخص فيه إجباريCheckbox
rates, stock and rules on behalf of {Company}. Conﬁrmed bookings under this contract are contractually
"Tick the conﬁrmation to activate." زرارbinding." contract" الـActivate ما لحد مقفول Checkbox يتعلّم شرح سطر ومعاه
 البدايةBR-03-46 لو التفعيل: بعد المستقبلActive في البداية لو يبدأScheduled. والبيع يوم00:00، مكة بتوقيت
).Q4). البداية ( 10.R (انظرREF
 واحدةBR-03-47 عملية التفعيل بـatomic key) idempotency تفعيل. نص يبقىمفيش كله يا حاجة.Live: ولا يا
) REF 03.R ( Amend التعديل مقابل الـ
BR-03-48
الحقلالطريقالنسخة
settingsنفس operational Edit ← publish & الـReview المواسم، الجنسياتSupplementsالأسعار، أسعار ،
النسخة
settings operational منEdit والليلة &، والـRates Overbookingالمخزون
Availability
نفس
النسخة
الـ السياسات، الـSLAالقيود، انتهاء سلوك days،SLA، اسمWeekend ،
العقد
Review & publish ← Drawers ← الـEditنفس
النسخة
سريانAmendنسخة بتاريخ جديدة نسخة ← العقد مدة
جديدة
)Block / On جديدةAmendنسخة نسخة ← العقد Requestنوع
جديدة
Amendنسخة جديدة، نسخة ← مؤكد حجز أول بعد العملةومقفولة
جديدة
جديد— عقد ← التسعيرمستحيل موديل
جديد— عقد ← الفندقمستحيل

---

**p. 112**

 BR-03-49 مؤكد حجز أول منقبل بتتعدل والنوع والعملة المدة العقد: على mode حجزEdit مفيش لأن النسخة) (نفس عادي
"Locked since ﬁrst conﬁrmed booking · change via: Snapshotمحتاج قديم. مؤكد حجز أول وجنبهمبعد بيتقفلوا
لـAmend" تفسير (ده 03.3. وUI 03.1Q انظرOV .)Q5؛
"Operational changes go live only after Review & publish. :Live فيBR-03-50 التغييرات mode Edit ومشمحجوزة
then." until published as v1.3 seeing keep النشرAgents بعد booking" next the علىfrom بتفضل المؤكدة والحجوزات ،
.)"Bookings re-priced 0"سعرها
 BR-03-51 Draft المحجوزة التغييرات للعقد الـواحد بعد وبيفضل السيرفر، على ومحفوظ يوزر)، لكل (مش كله للفريق ومشترك
) عندهRefresh يوزر أي والخروج. منrates.publish الليالي تغييرات يلغيه. أو ينشره يقدر Availability & Rates 04( بتدخلFlow
الـ .Draftنفس
 BR-03-52 :Amend from" "Effective وبكرة≤
 بتبقى الجديدة النسخة القديمة. النسخة على بتفضل قبله المؤكدة وبعدهاScheduledالحجوزات السريان، تاريخ لحد النشر من
والقديمةActive .Superseded،
 BR-03-53 بسAmend مفتوح واحد الـ وأثناء العقد. على الوقت نفس في settings،Amend operational علىEdit عادي شغال
الحالية النسخة
 تفعيلBR-03-54 أول النسخة: رقم كلv1.0 منشورAmend. 0.1 v1.3( ← v1.4 التشغيلي النشر بسمابيغيرش). الرقم،
 نشر رقم السجلPUB-YYYYMMDD-NNNNبياخد في
دورة الحياة
 BR-03-55 المورد):Pause (من طلبات العقد. مابيشوفوش الوكلاء اختياري. السبب وقت، أي في يرجع فوري، Request المستنيةOn
الـ ممنوعةSLAبتكمل الجديدة والطلبات بتاعها، بالظبطResume الإيقاف قبل لحالتها ليلة كل بيرجّع مخزون، (أسعار، sells ،Stop
.Resume  الـزائدقيود) أثناء الإيقاف. أثناء اتنشر تغيير أي الـPause لحد بتتباع حاجة مفيش بس وينشر، يعدّل يقدر المورد
 BR-03-56 Hoteliana by Paused ( 10.R REF حاجة غيرتانية) الموردPause Blocker  أولوية،HOTELIANA_PAUSED بأعلى
roomنطاقه · contract · hotel · فترةsupplier ومعاه و/أوpause_window) blocked_stay_dates المورد مايقدرش).
) اللييرفعه السبب وبيشوف كتبتهHoteliana، الاتنينreason_visible_to_supplier لو الداخلية. الملاحظة ومابيشوفش
إيقافResumeموجودين، ويفضل بس هو إيقافه بيشيل المورد Hoteliana من إيقاف من أكتر فيه لو Hoteliana. بيكسب، ،الأوسع
UIوالـ يعرضهم .كلهم
). BR-03-57 :Terminate البيع بيقفل ومايرجعش. نهائي النهارده من today"( closes contract The والتأكيد إجباري، السبب
الـTERMINATEبكتابة لحد بتتخدم المؤكدة الحجوزات طلباتCheck-out. الإنهاء). تاريخ بعد لو (حتى Request On المستنية بتتحوّل
 .Hotelianaلـ بيتبلغوا.Hoteliana حجوزات عندهم اللي والوكلاء
BR-03-58 (الساعة:Expiry ليلة آخر بعد أوتوماتيك بيحصل 00:00 بيوقف النهاية). لتاريخ التالي اليوم في مكة بس الجديد .البيع
. والقيود والمخزون الأسعار بعده حاجة. ومابيمسحش مؤكد حجز أي onlyمابيلغيش عندRead بيظهر الانتهاء تحذير
 (افتراضيcontract_expiry_warning_threshold يوم).30
. BR-03-59 بتتباع ليلة العقد مدة جوه تاريخها لو ومخزونبس سعر ليها لو حتى :Blocker،  حجزOUTSIDE_CONTRACT_TERM
 بعدها: وبيخلص المدة جوه حاليًابيبدأ ممنوع انظرC10( .)Q6،
 BR-03-60 period new to بيعمل:Copy جديدDraft العملة، النوع، بيتنقل: اللي مابيتلمسش. الأصلي والعقد الفندق، نفس على
الـ المخزون، الوجبات، الأطفال، وأسعارها، الغرف التسعير، موديل إند، وسياساتهاSLAالويك وأسعارها المواسم أسماء السياسات، ،
 اللي جنسياتها. وعليهامابيتنقلشوأسعار (فاضية المواسم تواريخ (فاضية)، المدة dates": بتتنقلPick (القيود القيود تواريخ )،
.}Name{ )copy(". تواريخInactive غير ومن الـ الليالي، على التقويم تعديلات sells)، الاسمStop

---

**p. 113**

Release & cut-off
 BR-03-61 period :Release day" أوSame days" of "Number لـ1( (مقترح)60 الوصول قبل time) ساعةRelease
 (افتراضي مكة للأيام،18:00بتوقيت لـ14:00 day مثالSame 18:00."). at check-in before days 3 الـReleased بعد
: للفندق.Release بترجع ماتباعتش اللي الغرف
 BR-03-62 release :After sale" أوStop طلبات) ومفيش بتتقفل، (الليلة Request" On to يردSwitch والمورد يطلب (الوكيل
الـ الـSLAجوه Release). اختياري none"( Default: · لوOptional الوصولNone). يوم لحد مستمر البيع ،
Not used - الـBR-03-63 علىRelease بيشتغل فيAllotment بس. sale عقدFree وفي Request قسمOn بيظهرRelease،
release." to allotment no is there .(مقترح
BR-03-64 الـCut-offالـ ساعة نفس = بعدهاRelease Blocker.  لوRELEASE_PASSED sale Stop = release الليلةAfter أو ،
.After release = Switch to On Request Requestتتحول لوOn
سياسة الإلغاء
Free :) OV 03.16M ( Charge. شريحةBR-03-65 كل شرايح: before" days }N{ least at "Cancelled + الـCharge أنواع
· (charge a share of the stay) "% of stay" · (charge a number of nights) "Nights" · (no charge) cancellation"
.(charge a set amount in SAR) "Fixed amount"
 BR-03-66 No-show شريحة آخر دايمًا بيتحسب ونصها no-show"، or days, tier{ last of }N والـUnder الافتراضيCharge،
. ✕ 100" stay عليهاof للتغيير. وقابل last" ومفيشalways
"A cancellation policy needs at least two tiers - remove one :)No-show BR-03-67 صفين الأدنى (شريحةالحد
."4 tiers is the maximum" :No-show valid." being stops policy the and more الأقصى شاملة4الحد صفوف
 منBR-03-68 صحيحة أرقام الشرايح أيام لـ1 (مقترح)365  تكرار، بدون الـتنازلية Charge. لازم هو ما زي يفضل أو نقربيزيد ما كل
 الوصول منعمن مش تحذير .(مقترح،
 BR-03-69 من بتتحسب الأيام الحساب: نقطة الساعة الوصول (مقترح)14:00يوم مكة بتوقيت الـ لياليNights. أول بسعر بتتحسب
 الـ والأطفال). الوجبات (شامل الإقامة إجمالي على بيتحسب % الـ كلها. الإقامة بيتحسب الإقامة، من أكبر الليالي عدد لو بالترتيب. الإقامة
 amount الإقامة.Fixed قيمة عن مايزيدش
"This season's policy wins on its own dates. Outside BR-03-70 الموسم: وسياسة لوحده، سياسة ليه يبقى يقدر موسم كل
"CANCELLATION BY policy." contract the to back falls booking every dates{ قسم}season في جدول9 بيظهر
 العقدSEASON" سياسة جنب
BR-03-71 الأسبقية: العقد. سياسة < الموسم سياسة  عادية: وليالي موسم بيعدّي حجز سياسة هي بتتطبق اللي السياسة ليلة
.Snapshot. الوصول كله الحجز على انظر الـ)Q8(مقترح، في بالنتيجة بيحتفظ الحجز
Bookings keep the policy in force at conﬁrmation - BR-03-72 على بيأثر السياسة تغيير بس الجديدة :الحجوزات
changing tiers later affects new bookings only."
"No cancellation or release policy on this contract. :) UI 03.1Q BR-03-73 العقدNone مستوى على مسموح
"Bookings on nights outside a season will have no policies." own their have still can تحذيرSeasons ومعاه
. contract." this from terms التشغيليcancellation المعنى arrival until cancellation (مقترح)Free مع (تعارض
activation" before انظرRequired ).Q2،
)Restrictions( القيود
Every( Minimum nights + Applies on القيدBR-03-74 type Room rooms( واحدAll نوع أو المدةDates (جوه
.Active/Inactive) + only days Weekend / range the in والمغادرةday الوصول قفل أيام

---

**p. 114**

"Minimum nights is at least 1. With 1 there is no rule = BR-03-75 nights منMinimum لـ2 (مقترح30 . أو0 خطأ1
Minimum one." adding of instead None سريعchoose زرار ومعاه 2" Use مغادرة،استثناء:. أو وصول أيام بيقفل القيد لو
.MVP 1 = nights لازمة) ليه (القيد مسموح (مقترح) stayمفيش. الـMax في
BR-03-76 قيد: غير من الليالي واحدة ليلة أدنى يومحد كل مفتوحين والمغادرة والوصول ،
BR-03-77 بيكسب الأحدث القيد التداخل: = "الأحدث" أيامه. باقي على بيفضل والقديم بس، المتداخلة الأيام على الإنشاء وقت
 )created_at( والتعديل مابيغيرش، الترتيب انظر القديم)Q9(مقترح، القيد في بتظهر أحدث قيد فيها اللي الأيام rule". وسطرNewer
"On 20 - 25 Sep a newer rule applies instead (All rooms · min 4 nights). This rule still covers every other date."
 الجدول في applies"والصف rule newer a Sep: 25 - مع20 بيتداخل واحد غرفة نوع على القيد rooms". بسAll ده النوع على
On other days the booking sells as if BR-03-78 only days بس:Weekend العقد بتاعة إند الويك ليالي على بيتطبق القيد
 exist." didn't rule this الجديدة الأيام بيتبع القيد بعدين، اتغيرّ إند الويك لو
"Do BR-03-79 الوصول/المغادرة: يومقفل على الضغط Popover ( 03.RSP1/2/4 فيهOV وCheck-in) وCheck-out the،
 range" this in }Weekday{ every on التقويمsame رأس في اليوم اسم على الضغط 03.RSP5/6. فيOV دي الأسبوع أيام لكل
.)"A date you set on its own keeps its own setting."(  بإعدادهالفترة. بيحتفظ لوحده اتظبط اللي اليوم
 BR-03-80 أقدم.:Inactive قيد ومابيحجبش الحجز، ولا البحث على ومابيتطبقش محفوظ القيد
. BR-03-81 للإقامة: الأدنى الحد حساب تحقق لازم الإقامة لياليها من ليلة أي على أدنى حد أعلى انظر الوصول)Q10(مقترح، قفل
المغادرة يوم على المغادرة وقفل الوصول، يوم على بيتفحص
 BR-03-82 على بيسري القيود على تغيير أي الجديدة والحجوزات الجديد والـالبحث التعديل، الحجز، التسعير، البحث، في: بيتفحص بس.
.Amendment
"Check-in is not · "Minimum stay is 3 nights for the selected dates." ثابتةBR-03-83 الوكيل عند الرفض رسايل
.( RESTRICTION_FAILED  Blocker) "Check-out is not allowed on 25 Sep." · allowed on 23 Sep."
 BR-03-84 الموسم قيود dates" these for restriction الـAdd نفس بيفتح الموسم صفحة من منDrawer متعبّية والتواريخ
). it."الموسم of part only covers rule the if them Shorten Ramadan. season the from ﬁlled فيDates بيتسجل القيد
كمان. الموسم في وبيظهر العقد بتاع القيود جدول نفس
المواسم
A season has its own prices - set every BR-03-85 الموسم كاملة أسعاره العقدليه بأرقام مربوط ومش دي، للتواريخ
number for these dates. Nothing here is tied to the contract's numbers; nights outside the season keep the
prices." contract 12( مثالFlow بيلغي 03.R REF only" base to: Apply · 240 + انظرbase ).Q12،
 العقدBR-03-86 هيكل نفس supplements + الموسمBase أساس ← أطفالSupplements + العقد) عن تختلف (ممكن
.) OV 03.12S ( "Add a room to this season" ← غرفةFixedوجبات لكل صف
BR-03-87  أبدًا تاني موسم مع مايتداخلش الموسم only." season one in sit can night A التانية المواسم بتاعة الأيام مقفولة
"Save الـ pickerفي ( 03.14P OV أو تاني مكان من تواريخ تغيير (مثلاً حصل التداخل لو )Copy). ←  03.13 مقفولOV والحفظ
stays off until no night overlaps."
20. موسمBR-03-88 غير من الليالي الأقل. على واحدة ليلة العقد، مدة جوه الموسم rate" contract الأقصىBase المواسم عدد
(مقترح .للعقد
A change made on the rate الـBR-03-89 من ليلة تعديل calendar Rate 04( Flow بس) دي لليلة الموسم على :بيكسب
calendar wins over the season for that night only."
 إلغاءBR-03-90 سياسة خاصة، قيود أسعار، التقويم)، على (بيظهر لون تواريخ، العقد)، نفس في متكرر مش (إجباري، اسم ليه: الموسم
جنسيات أسعار خاصة،

---

**p. 115**

أسعار الجنسيات
. BR-03-91 الجنسيات أسعار بس المواسم السعر.جوه نفس بتدفع الجنسيات كل الموسم برا
 اسمBR-03-92 المجموعة: you" to only طريقةShown + دول + price") season the "Adjust ±( الليلة،SAR في للغرفة
 أو اتغير) لو الموسم سعر مع room"بتمشي per price يتعدلFixed ما لحد ثابت بيفضل غرفة، لكل كامل (سعر
. BR-03-93 الموسم. نفس في بس واحدة مجموعة في بخطأالدولة ممنوع الحفظ 03.12NX فيOV تبقى ممكن الدولة نفس
تاني موسم في مجموعة
Meals, extra children, restrictions BR-03-94 والسياسات والقيود والأطفال الوجبات الموسم بالجنسيةبتاعة ومابتتغيرش
and policies are the season's own - they do not change by nationality."
 الموسمBR-03-95 سعر = مجموعة أي في مش اللي الجنسيات الوكالة). بلد = (الافتراضي الرئيسي الضيف بجنسية بيبحث الوكيل
.)Flow  بيسجل اتطبقالحجز اللي الجنسية الفرقسعر بيدفع الوكيل بيها: اتبحث اللي غير طلعت الضيف جنسية لو 05،N1.
الـBR-03-96 بعد المجموعة سعر 1 محددهSAR المورد اللي للبيع الأدنى الحد من أقل لو غرفة. لكل 04 تحذيرFlow )،
. الأقصى04.6Iزي المجموعات عدد منع. مش (مقترح10 للموسم
On Request طابور الـ
Free .)B-L2 BR-03-97 طلب كل واحدة غرفة holdبيحجز الـ)Soft انتهاء أو الرد لحد المخزون من فيSLA بسAllotment،
 وعقدsale Request فعمودOn يتحجز، مخزون مفيهمش بيبقىHeld"
"The queue is ordered by the SLA clock by .)"Expiring soonest" تصاعديBR-03-98 الفاضل بالوقت الافتراضي الترتيب
default on purpose."
). BR-03-99 :Conﬁrm المورد تأكيد رقم HCN وقتهااختياري) pending(" )Reference later or now بيبقىAdd الحجز
 مباعةConﬁrmed بتتحسب المحجوزة والغرفة فورًا،
"Declining releases the request immediately and the agent is told. Nothing is BR-03-100 إجباري:Decline السبب
held, and the night keeps the stock and status it had - a decline is not a stop sell."
.)PO-6 الـBR-03-101 انتهاء أو الرفض SLA ماليًاIncidentمش المورد على ومابيأثرش
حساب السعر وتقييم الليلة
 BR-03-102 السعر حساب ( 03.R خطوةREF شامل8 الأساسVAT، غرفة سعر موسم:Supplement): فيه (لو ← الغرفة
× Per person الوجبة ← الزيادة الطفل ← الموسم) (جوه الجنسية سعر ← العقد) أسعار بدل الكاملة الموسم roomأسعار أوPer مرة،
 دي لليلة الغرفة سعر على (بيكسب التقويم من الليلة تعديل ← الضيوف) أوWeekdayعدد Weekend حسب الليلة ويكيوم وأيام
الليالي. مجموع = الإقامة إجمالي العقد. إند
 BR-03-103 الليلة تقييم ترتيب ( 03.R REF :) العقد1 حالة 2 sale Stop ← والموسم3 المدة ←4 العقد على والوجبة الغرفة
Blockers 5 والتأكيد المخزون القيود6 الـ7 Release ← السعر8 9 Snapshot المحرك الشروط. كل الـبيقيّم كل ويرجّع
 ( 10.R والـREF الثابتةBadge)، الأولوية حسب الأول بيعرض والـHOTELIANA_PAUSED حاجة)، أول كلهمDrawer بيعرضهم
يشيله مين حسب متقسمين
)Happy path( 3 الفلو. الأساسي
عنده يوزر contracts.editالسيناريو: +  contracts.lifecycle أوOwner( عقدAdmin بيعمل Block) / ،Allotment
supplementsتسعير + مخزونBase pool، وينشره.Shared سعر بيعدّل وبعدين ويفعّله، متقبل، فندق على ،
. القايمة1 فتح

---

**p. 116**

"One contract per hotel and period. Contracts are supplier- + "Hotel supply contracts". يشوف  03.0 هيدرUI
4 ."Create supply contract" + them." publish you moment the live go and زرارmanaged + status" أساسيSell زرار
Need attention · )allotment / night, all active · 24( Rooms on sale · )across 3 hotels · 3( Active contractsكروت
Search · Hotel · Status ·). 2( · issues 4 · )contracts · alerts Stock 2( · with rooms ≥ 2 tonight فلاترleft شريط
PERIOD · ALLOTMENT / NIGHT · attention Need · أعمدتهPeriod جدول الفندقCONTRACT. + (الاسم
"Actions + "Showing 7 of 7 contracts". STATUS · RELEASE · OUT SOLD WHEN · CONFIRMATION ·  تحت⋯
change with the contract state - open ⋯  on any row to see what you can do."
."Create supply contract" يضغطيعمل:
 يفحصالسيستم: مفيشcontracts.edit (لو الأقل على متقبل واحد فندق فيه إن يفحص يفتحA2. 03.1). علىUI
 property/contracts/new لسه.Draftمفيش. السيرفر على بيتعمل
) UI 03.1. فاضية2 الإنشاء صفحة
"One page. Base contract rates cover every night of the term; seasons + "New supply contract" العنوانيشوف:
Draft not saved yet · activate." & review you until live is Nothing only. dates their for them المؤشرoverride
"Complete tooltip hotel" a pick you once زراريautosaves draft". وSave activate" & ومعاهReview (مقفول
ﬁrst" 9 and 8 1-6, قسمsections فاضية1). حقوله وكل مفتوح hotel Approved hotel"( linked a Contract)،Choose
Weekend name Block"( Annual Makkah term)،e.g. Contract end"( - Currency)،Start days)،Select"(
"Hotel not listed? Request access or add it from type)،Select"( Contract Block( / لينكAllotment افتراضيًا). متعلّم
 Library" الـHotel القفل. بسطر مقفولة الأقسام باقي SUMMARY. كلهLIVE
."Approved hotel" يضغطيعمل:
)OV 03.1P. الفندق3 اختيار
"Only hotels linked in My Hotels can be contracted. Each contract + "Choose an approved hotel" Modal يشوف
). hotel." one to الفندقbelongs اسم قايمة: contract" active paused"،1 تحت:1
 مربوطة المش الفنادق Library"سطر Hotel زرارOpen hotel". this يختارUse ما لحد مقفول
.Use this hotel" ← "Al Noor Makkah Hotel" يختاريعمل:
الـالسيستم: يقفل الحقلModal يملى "، ★ 4 · Makkah · Hotel Makkah Noor Al السيرفرDraftين. على  Draft( = ،status
Draft autosaved just. null = الـcreated_by،version يحدّث لـURL). يبقىproperty/contracts/}id{/edit المؤشر
.LIVE SUMMARY: Hotel = Al Noor Makkah). السجلnow" created". "Draft الـDraft،actor(
. الاسم4
."Makkah Annual Block" يكتبيعمل:
 الـالسيستم: عند يتحققBlur تلقائي.BR ويحفظ الحقول) جدول في
)OV 03.1Q. المدة5
"Start and end dates. Every night in between must belong to the base rate or a + "Contract term" يشوف
picker). season." date End / date اختصاراتStart + 12 2027 Summer · 1448 Hajj · 1448 Ramadan · الـmonths
"365 nights · Thu · Fri weekends · the term locks ملخص سطر متعلّم. إند والويك مقفولة، فاتت اللي الأيام afterالموحّد:
the ﬁrst conﬁrmed booking (Amend to change)."
."Conﬁrm term" ← Aug 2027 31 ← Sep 2026 01 يختاريعمل:

---

**p. 117**

 (وإلاالسيستم: البداية بعد النهاية يتحقق: 03.1Q2 والمدةOV عقود24)، على يدوّر شهر. علىActive/Scheduled/Paused
) فيه (لو متداخلة الفندق 03.1Q3نفس E3،OV يحفظ. ← مفيش الأقسام). و6–2يفتح 10–8 ( 03.1A خفيف،UI بأنيميشن
. لقسمScrollويعمل الـ1 (مايقفزش). بس Term SUMMARY: LIVE = 27" Aug 31 - 26 Sep (تعديلات01 مايتسجلش السجل
 والمسح).Draft والتفعيل الإنشاء بس حقل، كل بتتسجل مش
) OV 03.1R. العملة6
"Every price in this contract uses one currency. It locks after the ﬁrst conﬁrmed + "Contract currency" يشوف
Settlement currency of your) SAR · Saudi Riyal booking - change it later only through Amend contract."
).Q1 agreement" .)Hoteliana وUSD( انظرEUR
 يعمل SAR" Use يحفظالسيستم:.
)OV 03.1S. إند7 الويك أيام
"Weekend prices apply to the nights of these days. Everything else is a weekday." + "Weekend days" يشوف
Thu · Fri selected - the Saudi weekend. Seasons and وFri…Satشيبس Fri، + سطرThu افتراضيًا. متعلّمين
restrictions can still target single weekdays."
 يعمل weekend" Save الـالسيستم:. يحفظ. ديpicker الأيام بيعلّم الفلو كل في
. العقد8 نوع
"Block = you commit rooms per night. On Request = no علىيعمل: يسيبه Block" / السطرAllotment (الافتراضي).
stock, every booking waits for your conﬁrmation."
 قسمالسيستم: يبقى1
)2 .9 base & model (قسمPricing
"Chosen once for the contract + "Fixed price per room" يشوف model" :"Pricing supplements" + (متعلّمBase
All prices + - its seasons use the same model. Fixed price means every room gets its own full price instead."
· "Weekday price" · "Select view ⌄ " · "Select meal ⌄ " · "Select room ⌄ ". 15%" VAT الأساسinclude صف
."Weekend price"
.Standard Room · Room Only · City · 400 · 500 يعمل
Standard Room · City View · Base صحيحةالسيستم: (أرقام يتحقق قسم0 يحفظ. 2). الأساس3✓ غرفة يتملى:
.1 · Standard Room" = LIVE SUMMARY: Rooms on sale). SAR" 500 / 400 · locked · room ( 03.1C الـUI
)3 .10 (قسمRooms
"Every room type the hotel has, with its view. The base room is locked here - change its price in section يشوف
One :"How the week is priced" ."Request missing room" + 2. Every other room is the base plus a supplement."
Room · Supplement on the base · Sells at · weekday /. week all price | weekend & جدولWeekday
. الغرفweekend كل
 ويكتبيعمل: الغرف على يعلّم واحدةSupplement لكل يسيب100،120 …). Suite، متعلّمRoyal مش
). السيستم at" الـSells + الأساس = لحظيًا بيتحسب Supplement weekend( / "-weekday بتفضل عليها متعلّم المش الغرفة
.Supplement✓ 3/ -". قسم
)4 .11 children (قسمExtra

---

**p. 118**

.Child 6 - 11 with extra bed = يعلّميعمل: Free = 5 - 0 +50،Child = bed extra no 11 - 6 +100،Child
قسمالسيستم: يحفظ. 4 يتعلّم✓ ).(مقترح:
)5 .12 plans (قسمMeal
Iftar + يعمل Only Room included( · +45)،Base person Per +90،B&B person Per Board يسيبHalf Board. وFull
.Suhur
= 3×Triple B&B = 500 + 45. الـالسيستم: يحسب list :Price SAR" 400 From · types room 6 · sale on rooms مثال9
✓ 5. قسم635
)6 .13 (قسمInventory
"Pick how the + Free sale · no quantity | Per room type | Shared pool · one number :"Inventory model" يشوف
| Switch to On Request | Stop sale :"When sold out" here." appear it for ﬁelds the - rooms you gives وhotel
.Controlled overbooking
When sold ← Deluxe Room City View = 12 يعمل pool Shared ← types" room all · night a "Rooms = 50 ← لـCap
.2 ← overbooking Controlled = الحدout
). يعرضالسيستم: غرفةSells" لكل night" a 50 to up · plans meal more"،3 has pool the if even 12 at يعرضstops
 =LIVE SUMMARY: Stock✓ 6. pool" the across night a 2 + 50 = conﬁrmed Maximum · 1 ≥ · قسمRequired
."50 rooms / night"
)8 .14 (قسمRestrictions
 يشوف type." room one or rooms all for - out or in check can guests days the and nights اختيارينMinimum
No restrictions yet - every night. contract" the to "Add | contract" the on "None + restriction" سطرAdd
sells with a 1-night minimum, and check-in / check-out are open every day."
"Save ← All rooms · 01 - 30 Sep 2026 · 2 nights · Every day ← OV 03.RS  ← "+ Add restriction" يعمل
.)A18. فيrestriction" (التفاصيل
.✓ 8. بـالسيستم: يتضاف الصف }user{" · }date{ وUpdated Delete · Edit + Active قسمStatus
)9 .15 (قسمPolicies
"Cancellation, release & cut-off. Add a policy, or choose None - seasons can still have their own." يشوف
.Release & cut-off · Optional · Default: none" tiers" the Set · Required · policy وCancellation
يعمل policy" cancellation "Edit ←  03.16 OV ← cancellation Free · days 7 1: 1،Tier Nights · days 3 2: No-،Tier
100 stay of % show: ← policy" بعدينSave cut-off". & release "Edit ←  03.17 OV ← 3 = days of ،18:00،Number
."Save" ← After release = Stop sale
"3 days before · قسمالسيستم: يعرض9 Edit" · tiers Structured · 100% d 3 < · night 1 d 3-7 · d 7 until وFree
).UI 03.1E (  hotel" the to return rooms unsold Then · قسم18:00 9. يتفتح7قسم✓
.16 seasons (قسمRate اختياري7 ،
. لاينيشوف: تايم شهر12 SEP … جدولAUG + result) Room Standard · rule Price · Nights · Dates · صفSegment
No seasons yet - the base. price" Contract · 365 · season a without night Every · rate contract سطرBase
."Add season" + contract rate covers all 365 nights. Add Ramadan, Hajj or summer only if prices differ."

---

**p. 119**

Feb - 09 Mar 2027 18 ) OV 03.14P ← يعمل season" الموسمAdd صفحة ← 03.12 الاسمOV ← التواريخRamadan)
.)A26–A30. الأساس 640← / 740 ← season" لـSave يكرر nights. ten وLast وHajj فيSummer (التفاصيل
Seasons 4 · 103 :LIVE SUMMARY والسيستم: بلونه، الجدول في صف موسم كل rate" contract لـBase نازل الـ262 ليلة.
.nights"
) UI 03.1F. المراجعة17 قبل
"All 9 sections complete · Review & activate is the last step." الأقساميشوف: كل
).10 يعمل activate" & قسمReview في أو (فوق
)OV 03.2. المراجعة18
"Everything below goes live the + "Review & activate" + "}CONTRACT NAME{ · }HOTEL{" يشوف بعنوانDrawer
 contracts." supply approve not does Hoteliana conﬁrm. you الـmoment يقفل لينك سطر وكل برقمه قسم كل ملخص
· 5 · Extra children · 4 · Contract basics · 2 · Pricing model & base · 3 · Rooms · 1 ويعملDrawer للقسمScroll
+ "Back to editing" + Checkbox. Policies · 9 · Restrictions · 8 · seasons Rate · 7 · Inventory · 6 · plans الـMeal
."Activate contract"
."Activate contract" ← ) OV 03.2 · confirmed ( Checkbox الـيعمل: يعلّم
الإرسال): (قبل لسهالسيستم الفندق كاملة، الأقسام كل السيرفر: على نهائي فحص متداخلة،Approved ومش المدة جوه المواسم ،
.contracts.lifecycle الـ المدة، جوه عندهSLAالقيود لسه اليوزر محتاجه، لو موجود
)OV 03.2L. التفعيل19 جاري
الـيشوف: نفس والزرارDrawer بـActivating…"، مقفولةSpinner حاجة وكل ،
فيالسيستم: واحدةTransaction Active = (أوstatus المستقبل)،Scheduled في البداية لو v1.0 = ،published_at،version
Contract activated ·. التقويمpublished_by ليالي يبني ليلة365، السجلBlockers
.)9. PUB-…" · v1.0 · Manual · }user{ · Active → Draft قسمStatus (انظر إشعارات
. التفعيل20 بعد
"Makkah Annual Block is live.) الـالسيستم: يقفل علىDrawer يروح 03.3، UI ( وتوستproperty/contracts/}id{
).Scheduled now." it book can (أوAgents 2026." Sep 01 on selling starts It scheduled. لوis
"Al Noor Makkah Hotel · 01 + "SUPPLY CONTRACT · Makkah Annual Block · Active · v1.0 · History" هيدريشوف:
Rates & Availability" + Sep 2026 - 31 Aug 2027 · Allotment / Block · SAR · published v1.0 on {date} by {user}"
Conﬁrmed bookings · On Request · waiting · Rooms left tonight · Above + settings" operational ."Edit كروت4
 صندوقstock AMEND". ≠ الأقسامEDIT كل only. الإنشاءRead ترتيب بنفس
. ونشره21 تشغيلي تعديل
."Edit operational settings" يعمل
 يدخلالسيستم: mode Edit ( 03.3B والمقفولةUI تتفتح، للتعديل القابلة الحقول تفضلCurrency،Term)، حجز) أول بعد
بسطرها. مقفولة
.420 ← 400 يغيرّيعمل: cost للأساسWeekday
Held change · the السيستم: يحفظ محجوز تتعلّمكتغيير الخلية السيرفر، على changed" · SAR 420 → وسطر400 base،
goes up 20 SAR on weekdays, so every room built on it moves by + 20 SAR too. Nothing is live until you

---

**p. 120**

"Discard · "View changes only" + "Edit mode · 1 change held - nothing is live yet" فوقpublish." الشريط
."Review & publish" · changes"
"Bookings re-priced 0 يعمل publish" & "Review ←  03.3C جدولOV Effect: · After · Before · وChange ·،
 ←Restriction conflicts price" their keep bookings nights"،Conﬁrmed base 262 · 262 affected None"،Nights
."Publish changes"
"Prices published · Base weekday 400 → 420 · }user{ فيالسيستم: ينشر Transaction واحدة، النسخة يسجلنفس ·،
Base weekday cost 420 + "Published · 1 change is live · still v1.0" : UI 03.3E. PUB-…" · v1.0 · لـManual يرجع
SAR from the next booking. Recorded in Activity with your user and time."
 الفلو: العقدنهاية الجديدةActive للحجوزات الجديد بالسعر وبيتباع
)Alternative ﬂows( 4 الفلوهات. البديلة
A القايمة.
) UI 03.0A. عقدA1 ولا مفيهوش الحساب
 حالة:Trigger بأي عقد أي مالهاش الشركة
"A contract is created + "No supply contracts yet"). (ولاالخطوات: مابتظهرش الأربعة الكروت attention النصNeed في
See my + "Create supply contract" + for a hotel in My Hotels. Create the ﬁrst one for any of your hotels."
.(My Hotels ←) approved hotels"
.My Hotels) (الخطوةالنهاية: الإنشاء يدخل يروح2 أو
. متقبلA2 فندق ولا مفيش
.Approved يضغط:Trigger contract" supply فندقCreate ولا مالهاش والشركة
"A contract + "No approved hotel yet" مايفتحشالخطوات: 03.1 يفتحUI شكلModal. (نفس صغير 03.1P فاضيOV
needs a hotel you are linked to. Request access in Hotel Library - you can contract it as soon as Hoteliana
"2 requests are waiting for: approves." + Library" Hotel (أساسيOpen طلباتCancel" فيه لو سطرPending.
Hoteliana - you'll get a notiﬁcation when one is approved."
) النهاية Library Hotel 02( يقفلFlow أو
)UI 03.0H  ← OV 03.0G ( Need attention. بـA3 فلترة
"NEED ATTENTION · 3 Popover ← Need attention شيبالخطوات: يضغط Any" attention: كارتNeed أو
Expiring soon · Umrah Q3 ends in 14 show" to what Pick · (مثلاًCONTRACTS وعدد مثال جنبه نوع وكل أنواع، بالخمس
."None right now" 1" · أنواعdays يعلّم 3"). these عددهاShow اللي الأنواع ومعاها0. للاختيار قابلة ومش رمادي بتظهر
 يبقىالسيستم: الشيب يتفلتر، الجدول issues" 4 attention: "Need + ﬁlter" والـClear يتحدثURL،
.Tooltip). ( وجنبهاattention=expiring,unpublished المشكلة أيقونة عليه بيظهر الصف
 النهاية contracts" 2 of 2 ."Showing تغييرCancel" غير من بيقفل
. البحثA4 / الفترة / الفندق / الحالة فلتر
 03.0Eالحالة OV :) MULTI-SELECT" · STATUS 7"،CONTRACT statuses بعددهاAll حالة وكل وExpired،
.Apply" · "Clear" افتراضيًاTerminated متعلّمين مش

---

**p. 121**

"Only 03.0Fالفندق بحث):OV hotels" linked contracts"،Search 7 · hotels عقودهAll بعدد فندق وكل hotels،
here." appear Hotels My in بـlinked بيظهر عقود: عليه ولسه بعدين ربطه اتشال فندق linked(" longer no .(مقترح)
"Which contracts do you want to see · By the period the contract covers - not by when it :) OV 03.0Lالفترة
A. created." وwas بعددها، الخيارات pick" you range date الـA بيفتح الموحدpicker 03.0M OV .) السطرORDER"
contract that is over never disappears. It moves out of the default view, keeps its versions, and stays
."Apply · 8 contracts" it." outlive sold it bookings the - الزرارreachable
03.0Kالبحث OV :) version." a or hotel, a name, contract A · contracts your Search من بيبدأ (مقترح) ،حرفين
. 300ms النتايجDebounce (مقترح). }period{" · active · v1.3 · }Name{ · "}Hotel{ + Badge + عنOpen" ثابت سطر
المنتهية
.A5 نتيجةالنهاية: مفيش بالنتيجة. الجدول
)UI 03.0B. للفلترA5 نتيجة مفيش
"Hotel: Rawdah Suites · Status: Active · Period: Ramadan + ﬁlters" these matches contract الفلاترNo ملخص
 )1448" + ﬁlters" all فندقClear فلتر فيه لو + }Hotel{" for contract a متحددCreate والفندق الإنشاء (بيفتح
المتفلترة (مش الكاملة الأرقام على بتفضل فوق الكروت
)03.0C4  … OV 03.0C. الصفA6 أوامر
"Reversible ·. :Trigger  العقد⋯ اسم بهيدر: بيبدأ المنيو صف. أي على }Hotel{" · (زي}Status{ تحته شرح سطر ليه أمر كل
.(agents stop seeing it, bookings untouched"
Amend commercial . UI 03.3B  ← Edit operational settings Open/View ←  03.3 المناسبةUI الحالة (أو
Copy to . OV 03.0D  ← Stop sell whole contract . OV 03.18  ← Pause contract ←  03.22 العقدOV صفحة فوق
 period new ← .A33 Terminate ←  03.21 OV . versions & Activity ←  03.3A OV . draft Continue ←  03.1 علىUI
. OV 03.0J  ← Resume . OV 03.0I  ← Delete ناقص قسم draftآخر
).Draft نفسه الصف على (أوOpenالضغط draft للـContinue
)OV 03.0D sell Stop كلهA7. للعقد
) :Trigger contract" whole sell (يحتاجStop العقدinventory.stop_sell صفحة من أو المنيو من
"Every night in the chosen range + "Stop sell on the whole contract?" + "}NAME{ · ACTIVE" :Modal الخطوات
Active." stays contract The selling. stops (افتراضيFrom }date{" · وToday (افتراضيTo) contract" of end · )،}end{
)}N بالـ صندوقpickerالاتنين مقفولة. فاتت اللي والأيام الموحد MEANS" SELL STOP المؤكدةWHAT (الحجوزات سطور بالأربع
Stop · "Cancel" .)Pause الـ Requestمابتتلمسش، الـOn بتكمل الموجودة عنSLA الفرق وقت، أي في يرجع ممنوعة، والجديدة
.sale"
). السيستم sale Stop محتاج ومش (دهPublishفوري زيLever تشغيلي 04 ليلةFlow لكل بيتسجل
Blocker ."Contract stop sell · }from{ - }to{ · Open → Stop sale · }user{". source = contract" السجلwhole
.) توستSTOP_SALE الليالي. على Undo" }to{. - }from{ for on is sale "Stop لمدةUndo( (مقترح10 ثواني
"Open sale again" + "Stop sale on the whole contract · }from{ - }to{" أصفرالرجوع: شريط يظهر العقد صفحة على
).Open sale" ← "Open sale again for }from{ - }to{? Nights you stopped one by one stay stopped." Modal( تأكيد
  واقفة كانت اللي الـقبلالليالي sell واقفةStop بتفضل الشامل
.Stop sale" العقدالنهاية: عمودActive والقايمة الفترة، في بيع مفيش بيعرضSTATUS، شيبActive" وجنبه
)OV 03.0I ( Draft. مسحA8

---

**p. 122**

.( contracts.edit ) "Delete draft" :Trigger
"It was never published, so nothing changes for + "?"}Name{"Delete the draft " + "DRAFT · }NAME{" الخطوات
 removed." is draft this only linked; stay rooms its and hotel The agents. ← draft" "Keep · draft" (أحمر).Delete
"Draft السيستم delete الـSoft في (يفضل لـDB (مقترح)30 يوم الشركة مستوى على السجل مكان). أي في ومايظهرش للتدقيق،
 }user{" · }name{ · توستdeleted deleted.". Draft (مقترح).Undoمفيش
 تتحدثالنهاية: والعدادات يختفي الصف
)OV 03.0J Resume القايمةA9. من
.) contracts.lifecycle ( Paused :Trigger صفResume" على
"Every night returns to exactly the state it had before + "?"}Name{"Resume " + "PAUSED · }NAME{" الخطوات
the pause - prices, stock and stop-sells included. Agents see the contract again immediately; existing
."Resume contract" · "Keep paused" ← bookings were never affected."
 السيستم Paused status ← (أوActive أوScheduled مابدأش، لسه لو الإيقافExpired أثناء خلصت المدة لو فيE
. بتبقى الإيقاف أثناء اتنشرت اللي التغييرات السجلLiveالاستثناءات). دلوقتي. Active" → Paused · resumed إشعارContract
للفريق.
Your pause is lifted. Hoteliana's pause is still on - الصفالنهاية: فيهActive لو Hoteliana. by توستPaused كمان:
 book." can't still يفضل.agents الأصفر والشيب
F + E + D + B الإنشاء. والسياسات والقيود
) UI 03.1B2  / UI 03.1B ( On Request. اختيارA10
.Contract type يختار:Trigger Request" فيOn
"No inventory guarantee - every booking requires supplier conﬁrmation. Set how لـالخطوات: يتغير النوع تحت السطر
On Request SLA" :"ON REQUEST · HOW FAST YOU ANSWER" below." right answer you بلوكfast يظهر
"When the SLA + "Countdown starts when the request arrives." + )"30 minutes to افتراضيDropdown( answer"،
:expires" "Auto-reject" | Hoteliana" to Escalate افتراضي (مفيش الاختيار(مقترح) حسب يتغير تحته السطر يختار). لازم ؛
"SLA is measured in Saudi time (UTC+3). Overdue requests show in Need attention and in the :Auto-reject
On Request queue."
"If you don't answer in 30 minutes, the request goes to Hoteliana's team, who call the hotel for :Escalate
you. Measured in Saudi time (UTC+3)."
"On Request: no stock is committed. You set a response SLA in Contract قسمالسيستم: 6 لـInventory يتحول
 conﬁrmation." your for waits booking every basics; + answer" to minutes 30 · SLA ويتعلّمResponse بس)، (قراءة
"No stock · = LIVE SUMMARY: Type = On Request · Stock out"✓ sold والـWhen الـRelease مايظهروش.
.On Request"
9 لـ رجع في:Blockلو كاتبها كان اللي البيانات الـInventory في (محفوظة ترجع كده قبل الـDraft قسمSLA). في ويظهر محفوظ يفضل
محتاجه لو ).BR-03-33بس
.SLA 30 min · then escalate to Hoteliana" الـالنهاية: عادي؛ الفلو كمّل بيعرضReview
(OV 03.1O3  / 03.1O2  / UI 03.1O ) A11. Fixed price per room
.2 يختار:Trigger room" per price قسمFixed في

---

**p. 123**

الخطوات
. 1"Switch to ﬁxed الـ أو الأساس في بيانات كتب كان الوجباتSupplementsلو أو الأطفال أو Modal مرسوم (مش تأكيد
The base, room supplements, extra children and meal plans you entered will be + price per room?"
"Keep base + supplements" ← cleared. Seasons keep their names and dates; their prices are cleared too."
. · clear" and طولSwitch على يتحول حاجة: مكتبش لو
 .2"Fixed price per room: no base and no room supplements - every room gets its own full price يعرض2قسم
model." same the follow Seasons Rooms. والأقسامin و4 5 الناف ومن الصفحة من هييختفوا ما زي بتفضل والأرقام ،
.)10،9،8،7،6،3،2،1(
 .3"Add each room with one meal plan and one view and type its full price - no supplements, no extra :3قسم
Request missing + "Add room" + beds. Add the same room again to sell it with a different view or meal."
.Room · Meal · view · Weekday · total · Weekend · total. جدولroom"
 .4"Pick the room, one + "Add a room" + "FIXED PRICE · ROOMS · INCL. VAT" : OV 03.1O3  ← "Add room"
View at." sells it price full the type then view, one and plan اختيارmeal (شيبس)،Room one pick · plan ·،Meal
"}Room{ is already in this one سطرpick موجودة: الغرفة نفس لو الفندق). مكتبة في بس دي للغرفة المتاحة (الفيوهات
Weekday · total price + Weekend + contract with {…}. This adds it again as its own row with its own price."
."Add room" ← "No extra bed and no supplements - this price is the room exactly as sold." + · total price
 خطأ ← كده قبل موجود فيو) + وجبة + (غرفة .5.)Eنفس
 بعلامةالسيستم: يتضاف الجديد الصف added" الجلسةJust لمدة 03.1O2 قسمUI في المخزون الغرفة6). على بيتحسب
 بتاعة الصفوف (كل Roomالفعلية الـStandard الرقم). نفس من بتسحب بيعرضReview 1 · 2 · 3 · 6 · 7 · 8 · بس.9
).A13( العقدالنهاية: بموديلFixed كلها المواسم Fixed؛
)UI 03.1M. واحدA12 بسعر الأسبوع تسعير
."One price all week" = "How the week is priced" :Trigger
"One rate covers every night of the week. The weekend days you set in Contract basics are السطرالخطوات:
 price." base contract's this for عمودignored cost قسمWeekend في الغرف2 جدول الرقم). نفس على يتقفل (أو يختفي
.)"+ 120 SAR → 520 SAR every night"( Room · Price per night · incl. VATيبقى
Use one price all week? The weekend فيهالسيستم: كان لو cost مكتوبWeekend مرسومModal (مش صغير
. dropped." be will base( the on SAR )500 typed you prices ← rates" two "Keep · price" one بيفضلUse إند الويك
 الـ في والتقويمpickerمتعلّم القيود (عشان
 والعكس).ملاحظة: واحد، بسعر والعقد بسعرين يبقى ممكن (الموسم لوحده موسم كل في موجود الاختيار نفس
. التانيةA13 المخزون موديلات
 type room Per ( 03.1N UI :) night." a rooms of number own its has type room each · type room جدولPer
"Standard 20 · Deluxe City View 12 ·. it from draw that Rooms · night / Rooms · type بالأرقامRoom توضيحي سطر
"Required · ≥ 1 :Overbooking). room." Standard a uses never booking Deluxe A 8. View Haram Partial لوDeluxe
 Room" Standard for 2 + 20 = conﬁrmed Maximum نوع· لكل (الحد
"Free sale · no ﬁxed quantity - the hotel conﬁrms each booking against its own stock." :( UI 03.1L ) Free sale
When sold = الثابتة سطور التلات sale+ Free sale≠ Free + بيتباع،Open = sale فورًا؛Stop بيقف
Not used on free sale." معنىout مالوش out" sold قسمWhen يختفي. يعرضRelease

---

**p. 124**

 الـ في الموديلات بين الـ:Draftالتبديل في بتتحفظ القديم الموديل في اتكتبت اللي الأرقام بسDraft التفعيل عند ترجع. لها رجع ولو
بيتحفظ. المختار الموديل
A14. When sold out
"The night closes the moment the last room goes. No overbooking, no requests - the :( UI 03.1J ) Stop sale
safest setting, and the one to use when the hotel cannot ﬁnd an extra room at short notice."
"Agents can still request a sold-out night. You answer inside the On :( UI 03.1K ) Switch to On Request
Request SLA set in Policies - if the hotel ﬁnds a room you conﬁrm, otherwise you decline and nothing is
.)BR-03-33 قسمoversold." ← فيه9 يظهر SLA" Request "On + expires" SLA the (إجباريين،When
) + overbooking حقل:Controlled night" per limit (إجباريOverbooking محتاج1 المحسوب. السطر
"Only the Owner, an Admin or a Revenue inventory.overbooking الاختيار عنده، مش اليوزر لو سطرمايترسمش؛ وتحت
manager can turn on overbooking."
) UI 03.1Q ( Policies = None Restrictions وA15.
.9 يختار:Trigger contract" the on قسمNone في قسم8 و/أو
"No restrictions on this contract - nights outside a season sell with a 1-night minimum, and :8 قسمالخطوات:
No :9 restrictions." own their have still can Seasons day. every open are check-out / قسمcheck-in
"Bookings + policies." own their have still can Seasons contract. this on policy release or أصفرcancellation تحذير
on nights outside a season will have no cancellation terms from this contract."
 القسمينالسيستم: لو7 يتفتح كاملين6–1
 /Remove all 3 restrictions from this contract?" واختار مكتوبة قيود/سياسة فيه كان :Noneلو مرسومModal (مش
. contract?" this from release and policy cancellation the "Remove ← them" "Keep · المواسمRemove" (قيود
 ).مابتتمسحشوسياساتها
)Request missing room". ناقصةA16 غرفة
.) OV 03.1O3 قسم:Trigger في اللينك أو3 الموسم صفحة في (أو
. يفتحالخطوات: منDrawer الغرفة طلب 02 Flow متحدد، والفندق الصفحة يسيب ما غير جدولمن في رمادي صف الإرسال: بعد
 Hoteliana"الغرف for waiting · Requested · name{ للتعليم.}Room قابل مش
Room added to }Hotel{: }Room{. You can price it in }Contract{." تقبل:Hotelianaلما وإشعار للتعليم، قابل يبقى الصف
العقد فيActiveلو محجوز تغيير = إضافته mode، لسهEdit بس اتضافت الغرفة لو عليهاROOM_NOT_MAPPED. بس عادي بتتسعّر ،
 الربط.Blocker لحد ومابتتباعش
) OV 03.11. حفظA17 غير من خروج
 (ناف،:Trigger الصفحة يسيب يحاول Back السيرفر، على ماتحفظش لسه تغيير وفيه التاب) قفل وكاتبأو، فندق ماختارش لسه
حاجة
Nothing is live yet. A draft keeps + "Save this draft before you leave?" + "LEAVING THE CONTRACT" الخطوات
.Save draft & leave" · "Keep editing" · "Discard" ← everything you entered and shows in the list as Draft."
 leave & draft فندقSave مفيش لو التنقل. ويكمّل يحفظ ← hotel." one to belongs draft a - ﬁrst hotel a والـPick
 يفضلModal
). الـDiscard لو ← الـDraft بيمسح (مش محفوظة نسخة لآخر بيرجع كده: قبل اتعمل تتحفظDraft حاجة مفيش ماتعملش: لو

---

**p. 125**

.) REF 11.R التاب/الـ الـRefreshقفل من يترجع المحلي والشغل الافتراضي، المتصفح تحذير storage: يرجعLocal لما
محفوظةملاحظة: حاجة كل لو now" just autosaved Draft الخروج غير)، .Modalمن
)RSB  ← RSDP  ← OV 03.RS. قيدA18 إضافة
.)A26 :Trigger restriction" قسمAdd في (أو8 dates" these for restriction الموسمAdd من
الخطوات
. 1"Minimum nights and the days guests can + "Add restriction" + "RESTRICTIONS · {CONTRACT}" Drawer
 dates." those on wins rule newest the rule, older an overlap dates Where out. or in فاضيةcheck الحقول
"Dates must type Room rooms"( افتراضي)،All Dates end"( - nights)،Start Minimum 3"( سطرe.g. sit)،
"Pick dates above - the( Check-in & check-out }term{." · term contract the on،inside days،Applies
 here." shows range your of (متعلّمActive)،calendar
 .2"Contract term }term{ · dates outside it can't be + Dates ← picker ( 03.RSDP OV :) dates" the الشهرPick
."Apply" ← picked"
 .3 يوم كل الفترة، بأيام يظهر Out"التقويم · مفتوحينIn
. 4All rooms · 01 - 30 Sep"This rule replaces ". 4يكتب أزرقnights سطر النطاق: نفس على أقدم قيد مع بتتداخل الفترة لو
(.OV 03.RSB ) " on 20 - 25 Sep only. The older rule stays as it is on its other dates."· min 2 nights
 .5."Save restriction" ← يوم على .A19يضغط
). فيالسيستم: الحقول). (جدول يتحقق عقدDraft في طول. على يحفظ Active: محجوز: تغيير أولBR-03-50( يتضاف الصف
.20 - 25 Sep: a newer rule تحته يتكتب الأقدم القيد applies"الجدول.
).Restriction held - publish to make it live." الـالنهاية: وتوستDrawer يقفل added." (أوRestriction
)RSP6  … OV 03.RSP1. والأسبوعA19 اليوم أوامر
)"All rooms · min 4 nights on this rule") + يوميوم: على الضغط التاريخPopover بعنوان 2026" Sep 23 النطاقWed
Guests can leave on this day /) Check-out + (Guests can arrive on this day / Closed - no arrivals) Check-in +
."Apply" · "Cancel" ← "Do the same on every Wednesday in this range" Checkbox + (Closed - no departures
"Closed by the Friday setting for this range. Turn it on here to open this الأسبوع بإعداد مقفول سطر):RSP3يوم
date only."
"Applies + الأسبوع يوم RSP5/6اسم :) Mar" 09 - Feb 18 · Friday "Every + range" this in Fridays الاختيارين3 نفس
to every Friday in the range. A date you set on its own keeps its own setting."
يتلونالسيستم: التقويم في اليوم تلقائيIn يتحدث الجدول في القيد ملخص شطب). أحمر = مقفول Sep" 23 check-in "No،No
(.check-in Fri · No check-out Sat"
) RSE1W  / RSSW  / OV 03.RSW. بسA20 إند الويك ليالي على قيد
"The rule covers Thursdays and Fridays only - the weekend days set in ← Fri" Thu, · only days سطرWeekend
 rule." no were there if as sell days Other basics. التقويمContract في التانية الأيام rule" in للضغطNot قابلة ومش رمادي
.)"…on Thu 24 and Fri 25 Sep بس إند الويك أيام على بيبقى التداخل only"سطر
Set weekend days in Contract basics to use this." إند ويك مالوش العقد 0لو ده الاختيار أيام): ومكانهمايترسمش
)RSE3  / RSE1  / OV 03.RSE. قيدA21 تعديل

---

**p. 126**

"Last updated by }name{ · }date{ · created }date{. Changes apply + "Edit restriction" Drawer الصفEdit" على
."Save changes" · "Cancel" + "Delete restriction" only." searches and bookings new متعبّيةto الحقول نفس
.)BR-03-77 دي الأيام أحدث: قيد عليه اللي rule"القيد الشرحNewer وسطر للضغط، قابلة ومش التقويم في
Active ← الـInactive الـToggle: القيد بـInactive. الجدول في بيفضل Badge "Inactive" منهNeutral( أقدم قيد ومابيحجبش )،
أيامه على
 ← السيستم مباشرDraft حفظ ← محجوز.Active تغيير
)OV 03.RSD. قيدA22 مسح
"It is removed from the + "Delete this restriction?" ← Drawer أوDelete" الصف من restriction" الـDelete من
"New searches and bookings stop following it. Conﬁrmed bookings keep the rules + contract straight away."
"Cancel" ← they were booked with. This can't be undone - to pause a rule instead, edit it and set it to Inactive."
."Delete" ·
 فيالسيستم: فيDraft يتمسح. :Active: away" الـstraight مع فعليًا ويتمسح محجوز كتغيير بيتعلّم يعني قاعدةPublish (عشان
 mode بعلامةEdit مشطوب بيظهر الصف held"). · دي.Deleted الأيام يغطي بيرجع الأقدم القيد النشر. لحد
) 16D  / 16E  / 16C  / 16B  / OV 03.16. شريحةA23 إضافة/تعديل/مسح إلغاء: سياسة
"POLICIES · CANCELLATION · Cancellation policy · Structured tiers, Drawer ← "Edit cancellation policy" فتح
. contract." this under booking every to جدولapplied Charge · least at Cancelled · صفTier جديد): (عقد مرة أول
."% of stay 100" No-show 1 فاضيTier
No-show). إضافة tier" قبلAdd جديد صف ← :No-show -" ·  ⌄ charge Choose · before days · 2 "e.g. ( سطر16E
.4 tiers is the maximum" no-show"يتحدث or tier, new the يوصلUnder لما صفوف4. tier" ومكانهAdd يختفي
of stay % · )charge a number of nights( Nights · )no charge( Free cancellation :) 16M  / 16B ( الـ Chargeنوع
 =Free). stay( the of share a )charge · amount Fixed SAR( in amount set a النوعcharge حسب بيتفتح بعده اللي الحقل
.("-"
"A cancellation. 16Dمسح :)  داخلي✕ وتوست فورًا يتشال ← الصف على Undo" · removed 2 السطرTier صفين: فاضل لو
No- valid." being stops policy the and more one remove - tiers two least at needs والـpolicy قبل✕ شريحة آخر على
show .يختفي
 policy" ويحفظSave يتحقق ← يحجزDraft أو .)Active) تعديلCancel" فيه لو ← changes?" بشكلDiscard
. OV 03.11
.)"6-3" قسم في :9ملخص 100%" d 3 < · night 1 d 3-7 · d 7 until فيFree التعارض ملاحظة (انظر بخصوصQ12 و7-3
)16SSUM  / 16SHAJ  / 16SLTN  / OV 03.16SRAM. لموسمA24 إلغاء سياسة
"Add restriction :Trigger POLICIES" · الموسم7 صفحة في dates" these for policy غلطSet مكتوب التصميم في (الزرار
."CANCELLATION BY SEASON" dates" these انظرfor أوQ12، →")، season in جدولEdit من
"Only for + "Cancellation policy for }Season{" + "}SEASON{ SEASON · CANCELLATION" Drawer الخطوات
 contract." the in it to next shows one this - policy contract the keeps night other Every الجدول.}dates{. نفس
"This season's policy wins on its own dates. Outside }dates{ every booking falls back to the contractسطر
 مرسومpolicy." (مش + policy" contract the الموسم.Use سياسة لإزالة
"Contract policy · All other nights · …" :9 جدولالسيستم: الموسم. على يحفظ SEASON" BY قسمCANCELLATION في
.{Seasons without own} · their dates · Same as the contract policy" / "{Season} · {dates} · Own policy · …" /

---

**p. 127**

( 17D  / 17B  / OV 03.17 ) A25. Release & cut-off
"When unsold block rooms go back to the hotel, and what agents + "POLICIES · RELEASE & CUT-OFF" Drawer
"Released 3 + (Stepper) Days before check-in ."Number of days" | "Same day" :Release period see after that."
After .)"18:00 · Saudi time )UTC+3(" 18:00." at check-in before days time Release ساعة،Dropdown( نص كل
"What agents see for released nights." + "Switch to On Request" | "Stop sale" :release
"Inside the release window the night simply closes. Agents see it as unavailable - no :( 17B ) Stop sale
requests reach you, and nothing can be conﬁrmed at the last minute."
"Inside the release window agents can still request the night. You  Request On to الشرحSwitch مرسوم (مش
 you." without conﬁrmed is nothing - SLA Request On the inside الـanswer + قسمSLA في يظهر متحدد9 مش لو
"Released on the check-in day at 14:00." + "Days before check-in · Not used · same day" :( 17D ) Same day
."Default: none" ← الـ مرسومReleaseشيل (مش  release" يرجعRemove القسم
 ← حفظ/حجز.Save"
C المواسم.
) OV 03.14P  / OV 03.12 ( )Base + supplements. موسمA26 إضافة
 :Trigger season" قسمAdd في يتفتح7 ما (بعد
الخطوات
. 1"RATE SEASON · BASE + SUPPLEMENTS · SAME STRUCTURE AS THE الموسم كاملOverlayصفحة
A season has its own prices - set every number for these dates. + "{Name} season" + CONTRACT"
 prices." contract the keep season the outside nights numbers; contract's the to tied is here تابينNothing
."Nationality prices" | "Season prices"
 .2:) OV 03.14P ( picker ← Dates 1 · COLOUR & DATES NAME, :SEASON name الجديد)،Season في (فاضي
"Nights that belong to another season are + "Pick the ﬁrst and last night" + "SEASON DATES · {NAME}"
. one." another overlap can't season a - وعليهاlocked التاني الموسم بلون المقفولة الأيام locked" · لو}Season{
دي الشهور في مواسم free."مفيش is night every so months, these in falls season other "No ( ،03.16P
03.17P .) ← dates" ."Apply colour (لوحةSeason (مقترح)8 ألوان مقفول تاني موسم في المستخدم اللون Shows،
.on the rate calendar"
 .3Hint 2 - 5 · DATES THESE FOR العقد:PRICES أقسام نفس 5–2 (مقترح)، بداية كنقطة العقد بأرقام مبدئيًا وعليهامتعبّية
dates" these for them change - contract the from الأساسCopied Room/Meal/View. أساس على مقفولين
.)"Supplements can differ from the contract." (مقترح) للتغييرالعقد قابلة والأسعار تختلفSupplements، ممكن
.what every room sells at during {Season}" Price list
 .4"Add restriction for + "Same as contract · Min stay 1 night · no other rules" :RESTRICTIONS & RULES · 6
.) OV 03.RSS dates" these ←( الموسم،A18 بتواريخ
 .5+ "Own policy · free until 14 days, then 100% of the stay" 7 · :POLICIES policy" contract the as أوSame
.A24زرار
. 6."Save season"
.)Active) (وإلاالسيستم: تداخل مفيش المدة، جوه التواريخ الاسم، يتحقق: 03.13 يحفظOV موجودة. الأسعار كل يحجزDraft)، أو
Base contract ."}Name{ · }dates{ · }nights{ · Base }wd{ / }we{ · }result{ · والجدول لاين التايم في يظهر Edit"الموسم
 الليالي.rate" بعدد ينقص

---

**p. 128**

.7 قسمالنهاية: على للعقد يرجع
)OV 03.12S  / OV 03.12B ( Fixed price. عقدA27 في موسم
"A season has its own prices - type the full price of every + "RATE SEASON · FIXED PRICE PER ROOM"الصفحة
 dates." these for القسمrow DATES" THESE FOR PRICE FULL · SOLD AS ROOMS · 2 العقد: صفوف (غرفةكل
"Add a room to this OV 03.12S  ← "Add room" total× · وWeekday total · Weekend .إجباري
"}Room{ is already in this season with }view{. This adds it again as its own (نفسseason" والسطر03.1O3 row)،
with its own season price."
."Season only" Tag (مقترح): العقد في ومش بس الموسم في مضاف وعليهصف بس، الموسم تواريخ في بيتباع
).Base 3الأقسام · RULES & 4،RESTRICTIONS · عنPOLICIES مختلف (ترقيم
)D / RO / F / الموسمA28 تفاصيل details. الجدولSeason من 03.14) OV …  بلاحقات03.17 B،
.)"Edit" (مش:Trigger الموسم صف على الضغط
"{Season} · {dates} · {nights} nights · Base {wd} / + "RATE SEASON · {CONTRACT}" Drawer :( OV 03.14 ) Live
 … SAR" الغرفة}we{ سويتش View. Haram Partial Room Deluxe · View City Room Deluxe · Room كلStandard
"Changed on the rate calendar }n{ المتعلّمة weekendالغرف / Weekday · rule الموسمPrice في المختارة الغرفة (سعر
640. nights" }N{ أوof season" the follow all · بالكهرمانيNone التقويم من المعدلة والليالي سعرها، ليلة كل الموسم: تقويم
. → ."800 season this Outside · struck price old · calendar rate the on Changed · price Season قايمةLegend:
+ "Changed by {name} · {date, time}" + "{Day date} · {Room} · {Meal}" :"CHANGED ON THE RATE CALENDAR"
"A change made on the rate calendar. SAR" 800 → "640 + →" night ."Open price" season to all السطرReset
."Open on rate calendar" · "Edit season" ← wins over the season for that night only."
"Both changed nights (27 Feb, 5 Mar) are back to the Ramadan price. Held as a :( 03.15B  / OV 03.14B ) Reset
"1 night is : 03.15B publish." you until draft + يدخلUndo" العقد mode. فيEdit المحجوزة). التغييرات عدد يزود (أو تلقائي
: live." it make to calendar rate the from Publish price. season the on (انظرback التقويم،Q12 من أو العقد من النشر
 الـ نفس المشتركDraftالاتنين
Rate calendar changes · After the contract is live" + "RATE SEASON · DRAFT CONTRACT" :( OV 03.14D ) Draft
+ "Once the contract is live, any night changed on the rate calendar shows here in amber, with the old price." +
 season." Edit from it change - rule season the follow here "Prices ← season" بسEdit
+ Reset + only Read ( 03.14RO OV :) ENDED" CONTRACT · ONLY READ · SEASON غيرRATE من ظاهرة التعديلات
"Open ← "Read only - this contract has ended, so seasons and prices can't be changed. History stays visible."
 calendar" rate بسon
"Price per night · + "This row · weekday / weekend" + "Price rule · Fixed price per row" :( OV 03.14F ) Fixed
Standard Room · Room Only · City View - the ﬁrst of the contract's 7 rows · each row has its own season price"
"A ﬁxed-price season has a typed price for every row - change them from +  الصفوف سويتش مرسوم+ مش (مقترح،
Edit season."
 →" night "Open ← 04 ديFlow والغرفة الليلة على calendar" rate on "Open ← 04 وفلترFlow الموسم في ليلة أول على
الغرفة
. مسحهA29 أو موسم تواريخ تعديل
) تواريخ الموسمEdit" صفحة ← فاتتDates ليالي فيه الموسم لو بس،A40. الجاية الليالي على مسموح التغيير حجوزات: عليه أو
ترجع الموسم من خرجت اللي الليالي بسعرها. بتحتفظ rate"والحجوزات contract تعديلاتBase الموسم. سعر تاخد دخلت واللي ،

---

**p. 129**

  خرجت اللي الليالي على الموسمبتفضلالتقويم على بتكسب كانت ما زي الأساس على (بتكسب
Its }n{ nights go back + "?"}Name{"Remove the season " :Modal ← "Remove season"  تأكيده مرسوم (مش مسح
to the base contract rate. {k} conﬁrmed bookings on these nights keep the price they were booked at. Its own
 ← too." removed are policy cancellation and restrictions ← season" "Keep · season" فيRemove تغييرActive.
محجوز
).This season is over - it stays for your records." فاتت: وسطرليالي مايترسمش، (الزرار فاتت لياليه كل موسم يمسح مايقدرش
 فاتت ليلة لآخر يتقصرّ والموسم بس، الجاية الليالي بيشيل المسح ← فات نصه .(مقترح)موسم
)NE  / NA  / N0  / OV 03.12N. الجنسياتA30 أسعار
.)Flow 12 تاب:Trigger prices" الموسمNationality صفحة في
"Every nationality pays the season prices. Add a group only + "No nationality prices in this season" :) N0فاضي
.Add nationality prices" + if the hotel prices some nationalities differently."
"Agents search with the lead guest's nationality. Nationalities you don't list pay the season :) مجموعات Nفيه
Nationality prices · }Season{ · }n{ nationality." every for same the cost children extra and Meals جدولprices.
HOW IT night" per room per SAR weekend, / weekday · :groups GROUP الدولNATIONALITY عدد + (اسم
"All other. DIFFERS price"( season the on SAR 40 "− / room" per price )"Fixed ثابتEdit· صف آخر
 prices" Season · كتيرnationalities العواميد ثابتScroll. عمود وأول بس، الجدول جوه أفقي
"Pick the countries + "}SEASON{ SEASON · NATIONALITY PRICES · Add nationality prices" Drawer :) NAإضافة
Who pays · 1 price." season the keeps else Everyone season. the from differs price their how خطواتand ثلاث
"A country can be in one group per price this name( Group you" to only "Shown + متعددCountries بحث
" ○  Adjust the season price · Add or take off an amount per room per night") How the price differs · 2 .(season"
:(Fills in as you type) Prices for this group · 3 .(" ○  Fixed price per room · Type a full price for every room" /
. VAT INCL. · PRICE GROUP · CHANGE · VAT INCL. · PRICE SEASON · فيROOM
  زيالغرف غرفة، لكل مش للمجموعة، واحدة خانة بيعرضNE(مقترح: اللي الصفوف)40 كل على في خانةFixed. وWeekday:
.Save nationality prices" · "Cancel" غرفةWeekend لكل
+ "Changes apply to new bookings only; conﬁrmed bookings keep their price." + "Edit }Group{" :) NEتعديل
.Save changes" + "Remove group"
"Guests from its }n{ countries pay the season + "?"}Name{"Remove the group " مرسوم (مش مجموعة مسح
.Remove group" · "Keep group" ← prices from the next booking. Conﬁrmed bookings keep their price."
 اتغير: الموسم مجموعاتسعر فيFixed سعرها. على بتفضل publish & سطرReview بيظهر
.Nationality groups · 2 follow the new price · 1 ﬁxed (Pakistan) keeps its price"
price المجموعة:Fixed إنشاء بعد للموسم اتضافت لغرفة  دي للغرفة مابتتباعش والمجموعة فاضية الخانة سعر على بتقع ولا
"Pakistan has no price for Deluxe Room · Haram سعر) يتكتب ما لحد الموسم سعر على تقع (مقترح: تحذيرالموسم وعليها
View - guests pay the season price."
 منالسيستم: يتحقق (وإلاBR-03-93 يحفظ/يحجز03.12NX season"). بعضSave مع التابين بيحفظ الصفحة أسفل في
G العقد. الشغال
( UI 03.3B2 ) A31. View changes only
+ "Showing the 2 changed items only" ← modeفي :Edit only" changes بسView المتغيرة الأقسام تعرض الصفحة
Base room · weekday cost 400 → 420 SAR. Inventory · Stop sell on 14 Sep for Standard Room.ملخص

---

**p. 130**

 unchanged." is else بعلامةEverything الخلايا + مشطوبCHANGED") والقديم sections" all الكاملShow العرض يرجّع
 الـملاحظة: sell منStop ليلة على Availability & الـRates نفس في اتحجز لو هنا بيظهر Draft 04( الـFlow sell). الشاملStop
 A7( محجوز) هنا.مش بيظهر ومش
( OV 03.3D ) A32. Discard held changes
"The contract + "Discard the {n} held changes?" + "EDIT MODE · {n} CHANGES HELD" ← "Discard changes"
"Discard · "Keep editing" ← stays exactly as published (v1.3). Nothing was live, so agents notice nothing."
.changes"
"3 of these الـالسيستم: يمسح الـDraft في ده ويتقال زمايله، تغييرات (حتى كله المشترك تانيModal يوزر من تغييرات فيه لو
.Held changes discarded · }n{ changes · }user{". Sara." by made were منchanges يخرج mode). السجلEdit
A33. Copy to new period
/ UI 10.0  / UI 03.20  / UI :Trigger period" new to صفCopy من منActive/Scheduled/Expired أو 03.19،
. UI 10.1
"Rooms, seasons and rules come across · you + " to a new period"}Name{"Copy " :Modal مرسوم (مش الخطوات
}Name{( Contract prices." and dates set + term Contract الأصليpicker( لنهاية التالي اليوم يبدأ مقترح: name،
✓ )names and prices, dates to pick( Seasons✓ Rooms & prices قايمةcopy(" + هيتنقلCheckbox) اللي بإيه
."Create draft" · "Cancel" ← (✓ Nationality prices✓ Policies✓ (as inactive) Restrictions
"Draft created ينالسيستم: جديدDraft الأصليBR-03-60 على يسجل }name{")، draft new to الجديدCopied وعلى
4 seasons need dates for the new term." v1.3" }original{ يفتحfrom 03.1. وقسمUI الجديد، على تحذير7 عليه
."Base contract rate" عليها تواريخ غير من dates"والمواسم الـPick في بتدخل ومش
 النهاية يتمسح.Draft أو تواريخ ياخد موسم كل ما لحد مقفول التفعيل عادي؛
(UI 03.18B  ← OV 03.18 ) A34. Pause
"Agents stop seeing it + "{NAME} · ACTIVE · Pause this contract?" Modal ← ( contracts.lifecycle ) "Pause"
"e.g. renovation( "Reason · optional" time." any Reversible immediately. + MEANS" PAUSE "WHAT سطور4(
."Pause contract" · "Cancel" ← ) 3-4" floors ماكسon (مقترح200، حرف
السيستم Active status ← ليلةPaused كل حالة يحفظ فورًا، للـsnapshot السجلResume البحث. من العقد يشيل )،
}reason{" · Paused → Active · paused لـContract إشعار Hoteliana. in-app( للأدمن) .(مقترح)
"Paused since }date{ - agents + 03.18Bالصفحة UI :) Badge "Paused" + }name{" by }date{ شريطpaused
Existing bookings are unaffected and still honoured. Resume restores every night + cannot see this contract"
."Resume contract" + to exactly the state it had before the pause - prices, stock and stop-sells included."
Rooms · "new requests blocked" On Request · waiting · "honoured while paused" Conﬁrmed bookingsالكروت
Edit operational ."{n} day · since {date} · {time} KSA" Paused for · "- · hidden from agents" left tonight
.)BR-03-55 متاحsettings"
. OV 03.0J  ← "Resume contract"  الصفحةResume من
( UI 03.21B  ← OV 03.21 ) A35. Terminate
"Irreversible. The contract closes today + "{NAME} · ACTIVE · Terminate this contract?" Modal ← "Terminate"
On amended." or resumed be never can and + الفعلية3 بالأرقام سطور }n honoured bookings }m؛conﬁrmed
"Hotel Hoteliana to handed waiting readable؛Request .)rooms/seasons/rules Reason إجباريDropdown(

---

**p. 131**

"Commercial reasons" · "Contract replaced by a new one" · "Hotel closed or renovating" · relationship ended"
 · لوOther" إجباري نص (+ Other الأولى) عدا ما مقترحة .(الخيارات conﬁrm" to TERMINATE الحروف،Type لحالة (حساس
 بالظبطTERMINATEلازم "Cancel" · contract" والسببTerminate الكلمة لحد مقفول (أحمر،
On Request). السيستم status ← فورًاterminated_at،Terminated يقف البيع الآن، = طلباتCONTRACT_TERMINATED
 طابور ← (مشHotelianaالمستنية أيAuto-reject أوDraft). محجوزة تغييرات Amend مفتوح السجل:بيتلغي وبيتسجل.
).9. }reason{" · Terminated → Active · terminated (قسمContract إشعارات
"Terminated on }date{ - + "terminated }date{ by }name{" + )Danger( "Terminated" Badge :) UI 03.21Bالصفحة
Reason: {reason}. {n} conﬁrmed bookings were honoured to check-out; no new bookings were + irreversible"
· "honoured after termination" Conﬁrmed bookings records." for Kept termination. after الكروتaccepted
.Activity & versions. Versions · by Terminated · after الأقسامDeclined كل only". غيرRead فعل زرار أي مفيش
( UI 03.22B  ← OV 03.22 ) A36. Amend
. UI 03.19 :Trigger contract" commercial "Amend ( أوcontracts.lifecycle Amend") · term منExtend
الخطوات
. 1"Term, type or currency change = a + "{NAME} · V1.3 → V1.4 · Amend the commercial contract" Modal
new version with an effective-from date. Prices, stock and rules are edited elsewhere, not here."
 .2"v1.3 keeps selling until this from" "Effective date."،picker(
 changes" :"What term Contract | Type | Currency أكتر أو واحد (اختيار  مسموح واحد من أكتر .3.)(مقترح:
 :Term date" end (أوNew date start مابدأشNew لسه لو
: Block Type: ↔ Request لـOn للتحويل SLA. Request: لـOn للتحويل إجباريين. الانتهاء سلوك + موديلBlock
.)Draft قسم (بيتفتح إجباريين والأرقام الـInventoryالمخزون في
:Currency unchanged" · الـSAR في (مقفول ).Q1،MVP
 .4"New bookings / "Bookings conﬁrmed before }date{ keep v1.3 - their snapshot never الأثر changes."سطور
Finance settles each booking on the / from {date} use v1.4. Both versions stay in Activity & versions."
version it was conﬁrmed under."
 .5."Start amendment · v1.4 draft"
 + نسخةالسيستم: ينشئ Draft الصفحةv1.4 03.22B. UI :) Badge amending" · "Active + History" · draft شريطv1.4
Term extended to 30 Sep + }date{" from effective · draft v1.4 · contract commercial the ملخصAmending
2027. v1.3 keeps selling until the effective date; bookings conﬁrmed before it keep v1.3 (snapshot). Nothing
. publish." you until agents for )changes + amendment" "Discard · v1.4" publish & المتغيرReview الحقل
."Changed in the v1.4 draft · was 31 Aug 2027"
"Effective + v1.4 publish & شكلReview نفس مرسوم، (مش 03.3C OV :) v1.4" publish & التغييراتReview جدول
"I conﬁrm this amendment on behalf of Checkbox + "Bookings on v1.3 {n} · untouched" + from {date}"
."Publish v1.4" · "Back to editing" ← {Company}."
v1.3 النشر بعد Scheduled = تعرضv1.4 والصفحة السريان، تاريخ لحد }date{" from effective · scheduled جنبv1.4
Amendment effective · Contract السريانActive يوم مكة00:00. Active وv1.4 Superseded والسجلv1.3 version،
."Base contract rate". System" · v1.4 → بسعرv1.3 بتتبني الجديدة الليالي اتمدّت، المدة لو
· "Keep amendment" ← "Discard the v1.4 draft? v1.3 stays exactly as it is."  amendment مرسومDiscard (مش
."Discard"

---

**p. 132**

( UI 03.19 ) A37. Expiring soon
. contract_expiry_warning_threshold النهارده:Trigger
"After the end + "Ends in }n{ days · }date{". القايمةBadgeالـ في soon" "Expiring بدلWarning( شريطActive) الصفحة:
date the contract becomes Expired and read only. Extend the term through Amend (new version, effective
. period." new a to it copy or choose( you date a from + period" new to "Copy · Amend" · term كارتExtend
."Nights left {n} · then expires (read only)"
UI مابتتعملش النهاية بتعدّي حجوزات فيه BR-03-59لو من (مثلاً النهاية بعد ومخزون سعر ليها ليالي فيه لو 10.0)،Copy).
.outside contract term"بيعرضها
(UI 03.20 ) A38. Expired
 سيستم،:Trigger النهاية00:00 بعد يوم مكة
"Nothing can be + "Expired on }date{ - read only" + "expired }date{" + )Neutral( "Expired" Badgeالصفحة
edited. Bookings, versions and activity stay here for your records and for Finance. Copy it to a new period to
· )"}n{ still in house" again." it sell + period" new to الكروتCopy bookings. Conﬁrmed out"( checked أوall
Occupancy · Cancelled room-nights"( 186 of )"92% · الأقسامVersions كل only". بتفتحRead والمواسم ،
. OV 03.14RO
.Bookings)  ماخلصتش لسه اللي عاديالحجوزات بتتخدم منCancel/Amend/HCN(
A39. Scheduled
.Scheduled أو:Trigger المستقبل، في بدايته عقد تفعيل بنسخةAmend
"Starts selling on }start{ at 00:00 Saudi time. You can Badge "Scheduled" Neutral( أزرق شريط + مرسوم) :(مش
. then." until everything change الكروتstill in Starts }n{ 0 bookings Conﬁrmed · days يومActive·
."Contract started · Scheduled → Active · System" والسجلActiveالبداية تلقائي،
. فاتA40 نصه عقد / فات نصه موسم
. قيد (موسم، تقويم أي في فاتت اللي onlyالليالي رماديRead عليها ومتعلّم موسمPast" مدة تقليل بس. الجاية الليالي على التعديل
ممنوع. النهارده قبل لتاريخ
On Request H طابور. الـ
) UI 03.23. الطابورA41 فتح
.Need attention كارت:Trigger waiting" · Request أوOn إشعار، أو العقد، صفحة في
"}n{ requests waiting · }SLA{ + "On Request queue" + "SUPPLY CONTRACT · ON REQUEST QUEUE" يشوف
minutes to answer each · sorted by time left. Each request holds one room until you answer or the SLA
"Search booking ID,( Search. …" كروتexpires; today. Answered · SLA Past · Waiting )avg( · rooms فلاترHeld
Request · Agent · Stay · Room · meal · view · Guests · Cost ·. guest" or )agent · Sort · date Stay · جدولRoom
."Past SLA" Answer · left Time · حيHeld عداد الفاضل الوقت mm:ss. يفضل)، لما (مقترح)25أصفر وأحمر%
Any / Arriving in the next 7 nights / Arriving this month / A( STAY DATE 03.23Bالفلتر OV :) غرفةROOM لكل بعدد
) + pick you range )date · ORDER ﬁrst( value Highest / ﬁrst request Newest / soonest ←Expiring الثابت السطر
."Apply · {n} requests" · "Clear"
الضيف: اسم والجدول البحث في بيظهر عنده لو كدهguest.piiبس غير hidden"؛ details Guest .(مقترح

---

**p. 133**

) OV 03.23R. A42 طلب تأكيد
"}Room{ · }Meal{ · + "Answer the request" "Answer" ← Modal LEFT" }mm:ss{ · }AGENT{ · حي}REF{ (العداد
← Conﬁrm ."Decline" | "Conﬁrm" :Decision {dates} · {nights} nights · {guests} · {cost} SAR supplier cost."
"Send · "Cancel" ← "Add now or later (Reference pending)" + "Supplier conﬁrmation number · optional"
.answer"
← Soft يفحصالسيستم: لسهbookings.confirm الطلب الـWaiting، الحجزSLA، ماخلصش. لسه الـConﬁrmed hold،
Reference). الوكيل من بتتسحب الفلوس Bookingsمباع، / 05 Flow عليه الحجز تأكيد: رقم غير من لو فورًا. بيتبلغ الوكيل
.On Request conﬁrmed · }ref{ · Waiting → Conﬁrmed · }user{"). الـpending" عداد ويدخل HCN 05( السجلFlow
 و الطابور، من يختفي today"الصف يزيدAnswered
)OV 03.23R2. طلبA43 رفض
"Hotel closed or · "No room available at the hotel" "Decline" ← reason" a Select · reason (إجباريDecline
 (+ renovating" · dates" these for valid not "Rate · accepted" not mix "Guest · (الخياراتOther" إجباري) نص
"Declining releases the request immediately and the agent is told. Nothing is held, and the night. سطرمقترحة)
.Send answer" ← keeps the stock and status it had - a decline is not a stop sell."
 يفحصالسيستم: الحجزbookings.reject الـDeclined. hold، بيتبلغSoft الوكيل تترجع، الوكيل عند المحجوزة الفلوس يتفك،
.On Request declined · }ref{ · Waiting → Declined · السجل }reason{"بالسبب.
Also stop sale on }room{ Checkbox :"No room available at the hotel" الـ داخل مرسوم):Modalاقتراح (مش السبب لو
.inventory.stop_sell }dates{" عندهfor لو افتراضيًا) متعلّم (مش
 الـA44 ردSLA. غير من خلص
"The hotel didn't عند:Auto-reject الطلب00:00 العداد: من Expired الـAuto-rejected( hold)، يتبلغSoft الوكيل يتفك،
 time" in أحمرanswer يبقى الطابور في والصف auto-rejected", · SLA لمدةPast (مقترح)24 ساعة في يظهر يختفي. بعدين
"On Request expired · Waiting →). attention Need overdue"( min 42 · auto-rejected Request السجلOn
.Expired · System"
Hoteliana to لطابور:Escalate بيتحول الطلب الـHoteliana hold، Soft قراريفضل لحد يبقىHoteliana المورد طابور في والصف ،
 Info Hoteliana" مقفولWith only ومعاهRead you.") for hotel the calling is Hoteliana المورد يرد منمايقدرش بعدها
."Conﬁrmed by Hoteliana on your behalf"  لو(مقترح)البوابة Hoteliana. الحجز أكدت: وبيتسجلConﬁrmed العقد على
.bookings.confirm (مقترح):5آخر دقايق إشعار action" عندهمrequires اللي لكل
)Exception ﬂows( 5 الاستثناءات. والأخطاء
العامة 11.Rالقاعدة REF فشل أي المستخدم): شغل عليهامابيمسحش ومتعلّم هي، ما زي بتفضل الحقول ،unsaved.
الـ بعد أيRefreshوبتفضل Modal. مكتوبة بيانات فيه برا بالضغط .مايتقفلش
E-B الإنشاء: والتفعيل
) OV 03.1Q2. البدايةE1 قبل النهاية
.Start date ≥ End date :Trigger

---

**p. 134**

"Fix بالأحمريظهر: الحقل تحت date." start the after be must date والزرارEnd term" سطرConﬁrm ومكانه مقفول يبقى
.the dates ﬁrst - the term can't end before it starts"
 يتحفظ: شيء. لا الحل: لحظيًا يختفي الخطأ تاريخ؛ أي يغيرّ
. (مقترح)E2 الحد من أطول المدة
 :Trigger من أكتر شهر24
 يظهر term." the shorten or contracts two into it Split months. 24 to up cover can contract مقفولA والزرار
)OV 03.1Q3. شغالE3 عقد مع تداخل
 عقد:Trigger مع بتتداخل المدة الفندقActive/Scheduled/Paused نفس على
"}Name{ · }term{ at }Hotel{. Two contracts + "An active contract already overlaps these dates" أصفريظهر: تحذير
. intended." is that if only Continue both. see agents overlap; can + "Cancel" · anyway" Continue عقد: من أكتر لو
قايمة في كلهم يتعرضوا
 anyway الـ:Continue في ويتسجل المدة، يحفظ Draft  true = الـoverlap_acknowledged في العقود. بأسماء بيظهرReview
"Overlaps }Name{ )}term{( - agents will see أصفر both."سطر
 للـ:Cancel يرجع اختارها.picker اللي بالتواريخ
. قيودE4 أو مواسم اتعمل ما بعد المدة تغيير
 :Trigger برا بقت القيود أو والمواسم المدة يقصرّ
"Summer · 01 Jul + يظهر مرسومModal (مش term" new the outside fall restrictions }m{ and seasons قايمة}n{
 outside" nights 31 · 2027 Aug 31 )- + "Cancel" · term" Change جزئيًا برا اللي المواسم التأكيد: بعد للمدةبتتقص.
 بالأحمر بتتعلّم كليًا برا واللي it"الجديدة، remove or dates its change - term the الشيءOutside نفس القيود التفعيل. وتقفل
 الـE5 نوع لـDraft. اتغير Request وفيهOn أوOverbooking مكتوبينRelease
"On Request contracts have no stock, so the overbooking limit and release you set :6 قسميظهر: في معلومات سطر
 ignored." الـare في بتفضل البيانات التفعيل.Draft في ومابتتحفظش
. صفرE6 أو فاضي سعر
 أو:Trigger فاضية سعر خانة سالب0 أو كسر أو
. ⚠ الخانةيظهر: تحت 0." above price a "Enter / decimals." no - only SAR مايتعلّمشWhole والقسم
الـيتحفظ: في بيتحفظ القسم باقي فاضية.Draft بتتحفظ الغلط الخانة ؛
 Supplement الأساسE7. من أرخص غرفة بيخلي
 :Trigger سالبSupplement
"A supplement can't be negative - the base room is the cheapest one. Pick a cheaper base room in يظهر
section 2 instead."
 صفE8 مكررFixed.
 موجودة:Trigger الفيو + الوجبة + الغرفة نفس
"Standard Room · Bed & Breakfast · City View is already in this contract at فييظهر: 03.1O3 الاختياراتOV تحت
 instead." price row's that Change SAR. 590 / و490 room" مقفول.Add

---

**p. 135**

 الـE9 Cap. الـ من أكبر حدPool / ناقصOverbooking
"Set a limit of at least 1 room a night - overbooking is / "A cap can't be above the pool (50 rooms a night)."
"The limit can be at most {max} rooms a night for this stock." / never unlimited."
. ناقصةE10 أقسام وفيه التفعيل
 يضغط:Trigger activate" & يكملReview ما قبل
الـيظهر: عليهاDrawer الناقصة الأقسام بس عادي، بيفتح السبب⚠ وسطر set" isn't out sold When · Inventory · وفوق6 )،
.Back to editing" activate" to things 2 الـFix بلينكات. وزرارCheckbox contract" مكانهمActivate بيترسموا؛ مش
)Validation. السيرفرE11 من فشل التفعيل
اتوقف:Trigger الفندق ربط جدت: مشكلة لقى النهائي الفحص منSUPPLIER_HOTEL_INACTIVE اتشالت غرفة اتداخل، موسم )،
صلاحيته اتشالت اليوزر الفندق، مكتبة
 + الـيظهر: منDrawer يرجع أحمرActivating…" بانر ويعرض live." went nothing - activate بلينكCouldn't الأسباب قايمة
Al Noor Makkah Hotel is no longer linked to your account. Contact Hoteliana or pick مثلاً واحد، anotherلكل
Ramadan overlaps Last ten nights on 10 - 14 Mar." / hotel in a new contract."
 الـيتحفظ: هو،Draft ما زي كامل Draft = status يفعّلالحل:. ويرجع يصلّح
 / تقنيًاE12 فشل التفعيل 500. / فصل)Timeout النت
 يظهر safe." is draft Your activation. the conﬁrm couldn't "We + again" الـTry لو نجحTimeout. يكون ممكن والطلب
 يعمل الـPollالسيستم بنفس العقد حالة على key لقاهidempotency ولو الخطأ، يعرض ما قبل علىActive يكمّل 03.3 عادي.UI
مزدوج. تفعيل ممنوع
 الـE13 فشلAutosave.
"Your changes UI 11.8 أحمريظهر: يبقى المؤشر retrying" - saved كلNot ويعيد (مقترح)15 ثانية بعد شريط3. محاولات:
.Refresh tab." this close don't - trying keep We'll yet. saved aren't + now" محفوظRetry الشغل الـLocal. بعد ويرجع
Draft. E14 الـ نفس بيعدّل تاني يوزر
.Draft الـ:Trigger نفس فاتحين اتنين
فوقيظهر: شيب draft" this editing also is Sara (مقترح) مستوى على بيكسب حفظ آخر الحقل: نفس غيرّوا الاتنين لو الحقل.
 توست يشوف والتاني القسم)، editing."(مش were you while 45 to night a Rooms · Inventory changed ويتحدثSara
  عنده. بيظهراستثناء:الحقل أوتوماتيك؛ مابتتحلش المخزون أرقام conflict  11.10 خلية.UI خلية
 الـE15 فاتحهDraft. وأنا تاني يوزر من اتمسح
· "Save my version as a new draft" + "This draft was deleted by }name{ at }time{." Autosave: Modal أوليظهر: عند
. يختار.Leave" ما لحد مايضيعش المحلي الشغل
Draft. الـE16 على لسه وأنا تاني يوزر من اتفعّل العقد
"Open the live contract" + "}Name{ was activated by }user{ at }time{. Your last changes weren't included." يظهر
.Discard my changes" · mode(بيفتح Edit محجوزة، كتغييرات المحلية تغييراتي وفيه )مقترح
. الإنشاءE17 أثناء خلصت الجلسة

---

**p. 136**

Checkbox 11.12 الـOV على يرجع التفعيل: نص في كان لو يرجع. المحلي والشغل القسم، لنفس ويرجع دخول يسجل والـDrawer:
متعلّم مش
. العملE18 أثناء اتشالت الصلاحية
. contracts.lifecycle الـ:Trigger شالOwner أوcontracts.edit
 يظهر  11.15 عندهOV لسه لو الـcontracts.edit. يحفظ يقدر زرارDraft: بس شالواActivate لو السطر. ومكانه يختفي
.Read only contracts.edit : }time{." at saved was draft Your contracts. edit longer no can تبقىYou والصفحة
Draft فتحE19 محاولة منDraft. link مبقاشDeep والعقد
"This draft no longer UI 11.x على يروح ← اتفعّل 03.3لو وتوستUI live." already is contract اتمسحThis لو
.Back to contracts" + exists."
E-C المواسم: والجنسيات
) OV 03.13. متداخلةE20 الموسم تواريخ
"A night can sit in one + ""}Season{"}n{ nights already belong to " + "DATES OVERLAP · CAN'T SAVE" يظهر
season only. You picked {dates} for {Season}, but {dates} are part of {Other} ({dates}). Choose dates that don't
.Ramadan · your dates / Overlap · blocked / Another season · locked / Free season." another تقويمtouch
"Use these + "End {Season} on {date} · Back to {range} · {n} nights - the nearest free range" :"HOW TO FIX IT"
"Open + "Move }Other{ instead · Open that season and change its start date ﬁrst, then come →" أوdates back"،
 →" .season overlaps." night no until off stays "Save + dates" to "Back · season" (مقفولSave
 season →:Open  كـ الحالي الموسم بيحفظ الـ جوه (مقترح)Draftمسودة تواريخ غير من التاني الموسم ويفتح
. أسعارE21 غير من / مكرر اسم / اسم غير من موسم
"Set a weekday and / "Another season in this contract is already called Ramadan." / "Give this season a name."
 + sale." on room every for price بالأحمرweekend الناقصة الصفوف
) OV 03.12NX. مجموعتينE22 في دولة
" in this season. A}Group{"}Country{ is in " + "}Country{ is already in another group" :Drawer الـيظهر: فوق أحمر بانر
 it." ﬁx you until saved is Nothing here. or there it remove - season per group one in be can بتاعcountry والشيب
."3 countries are already in other groups: Pakistan )South Asia(, …". حقل في أحمر Countriesالدولة دولة من أكتر لو
 التانية.الحل: المجموعة ويعدّل يقفل أو يختفي. البانر ← هنا من الدولة يشيل
 الجنسيةE23 مجموعة سعر الأدنى0. الحد تحت أو
 ≥ :0 discount." the Lower SAR. 0 above stay must price group مقفولThe والحفظ
"GCC nationals would sell Standard Room below your minimum of 620 أصفر تحذير للبيع: الأدنى الحد SAR."تحت
مسموح. والحفظ
. طريقةE24 غير من / دول غير من مجموعة
"Choose how this group's price differs." / "Add at least one country."
. حجوزاتE25 عليه موسم تعديل

---

**p. 137**

. في publishيظهر & :Review price" their keep }Season{ in bookings conﬁrmed }n{ · 0 re-priced مفيشBookings
منع.
E-D/E/F السياسات: والقيود
. تنازليE26 مش أو الأيام عدد بنفس شريحتين
"Tiers must go from the most days before arrival to the fewest - Tier / "Two tiers can't start on the same day."
 days." 7 than fewer be must و2 أحمر والحقل policy" مقفولSave
 قيمةE27 غلطCharge.
"Enter a share between 1 and 100%." :100–1 stay" خارجof
"Charge at least 1 night." :1 > "Nights"
"Enter an amount above 0 SAR." :0 ≥ "Fixed amount"
"Pick what this tier charges." charge" متسابChoose
. تحذيرE28 (مقترح، قبلها اللي من أرخص شريحة
 anyway?" Save less. pay would later cancel who guests - 2 Tier than less charges 3 مسموحTier والحفظ
 Release المتبقيةE29. الفترة من أطول
 < :Trigger check-in before الباقيةDays الأيام < شغال عقد في أو المدة، أيام عدد
"A 30-day release is longer than what's left of this contract )14 nights( - every remaining night is (تحذير يظهر
 window." release the inside مسموح.already والحفظ
. غلطE30 الأدنى الحد / المدة برا القيد تواريخ
.E4). أصلاًpickerالـ مايسمحش picked" be can't it outside بعدينdates اتغيرت المدة لو
Enter the 0/1 nights Minimum ←  03.RSK OV .)BR-03-75( < :30 30." most at be can nights فاضيMinimum
minimum number of nights."
. الفترةE31 في الوصول أيام كل بيقفل قيد
 مقترح (تحذير، يظهر range." this in start can stay no - Sep 25 - 20 of day every on closed is والحفظCheck-in
مسموح.
 قيدE32 only. إندWeekend ويك مفيهاش فترة على
 apply." never would rule this - Friday or Thursday no has Sep 22 - و20 restriction" مقفولSave
. للعقدE33 المتبقية المدة من أطول أدنى قيد
"A 7-night minimum can't be met in the last 5 nights of the contract - those nights won't sell."تحذير
E-G العقد: الشغال
. المحجوزE34 + المباع تحت المخزون تقليل
 يكتب:Trigger 20 = فيهاPool ليالي وفيه مؤكد/محجوز23

---

**p. 138**

"See the }n{ + "You have 23 rooms sold or held on 14 Sep. The pool can't go below that on any night." يظهر
Apply 20 only on nights with room for رقمnights" لحد مقفول الحفظ والأرقام). الليالي قايمة (يفتح (مقترحأو يختار
.Review ← الـit" في عددها وبيتعرض مسموح رقم أقل على بتفضل التانية الليالي
. مستقبليةE35 حجوزات عليها غرفة علامة إلغاء
"It has 6 future bookings - they stay conﬁrmed and will + "Stop selling Deluxe Room City View?" :Modal يظهر
 ←be honoured. The room stays on the contract as not on sale; it can't be removed while bookings exist."
."Stop selling" · "Keep selling"
Edit mode. فيE36 وأنا نشر تاني حد
 في:Trigger اتنين mode الـEdit نفس على نشرDraft وواحد المشترك،
 التاني: عند بانريظهر refreshed." is view Your }time{. at changes }n{ published بقيمةSara اتنشرت خلية على تغييرات ليه لو
11.10تانية UI : خليةconflict خلية Theirs / Mine محجوزة. بتفضل تعارض مالهاش اللي التغييرات مابيتحلش). المخزون
 أبدًا. أوتوماتيك
)UI 11.9. فشلE37 النشر
. يظهر see." agents what still is v1.3 agents. for changed nothing - failed السببPublish + again" التغييراتTry
 ذري: النشر محجوزة. نشربتفضل نص .مفيش
. الفترةE38 حسب جزئيًا نجح النشر
"Published: 01) ( 11.R REF : others." for fail and periods some for succeed can publish فترةA لكل بتعرض الشاشة
Review &: review" for Held · Jan( 14 on conflict )stock Aug 31 - Jan 01 Failed: · Dec 31 - Sep فيPO(قرار.
).Flow 04 النشرpublish للعقد الـall-or-nothing في بس الجزئي منBulk؛
. النشرE39 عند قيود تعارض
"1 conflict · Min 7 nights on 20 03.3Cفي صفOV conflicts" Restriction قيد (مثلاً فيه لو 7: فترةMin على باقية5 ليالي
 met" be can't Sep 25 النشر لينك. + (تحذير).مسموح
 Terminate سببE40. غير من / الصح الكلمة غير من
"terminate" contract"الزرار سطرTerminate ومعاه مقفول continue." to reason a pick and TERMINATE كتبType لو
Type TERMINATE in صغيرة capitals."بحروف
 Pause/Terminate/Amend اتغيرتE41. حالته لعقد
. OV 03.21 عمل:Trigger زميل فاتحPause وأنا
. يظهر again." try and state its Check }time{. at }user{ by paused was contract "This + بتتنفذReload" حاجة مفيش
 Resume الإيقافE42. أثناء خلصت المدة ما بعد
"This contract ended on }date{ while it was paused. Resuming won't make it sellable - it : OV في 03.0Jيظهر
.Expired ← "Resume and close" · "Keep paused" + becomes Expired and read only."
: Amend غلطE43. سريان تاريخ

---

**p. 139**

"The effective date must be inside the بكرة later."قبل or tomorrow be must date effective النهايةThe بعد
current term (ends {date})."
"The new end date must be after the effective جديدة date."نهاية
}n{ conﬁrmed bookings stay after }new end{ - they stay on v1.3 and will تحذير موجودة: حجوزات لقبل المدة beتقصير
 (مسموح).honoured."
"Bookings conﬁrmed before }date{ stay on v1.3 as لـ النوع Requestتغيير حجوزاتOn وفيه جايةAllotment
 Request." On sell }date{ from Nights (مسموح).Allotment.
 Amend وفيهE44. تاني مفتوحAmend
 contract"الأمر commercial ومكانهAmend بيظهر، مش v1.4" amendment ."Continue link لـDeep يفتحAmend ← جديد
An amendment is already open - ﬁnish or discard it وتوست ﬁrst."الموجود
 نسخةE45 سريان تاريخ والـScheduled. وصل اتأخرJob
). شيب بتعرض بدلActivating…"الصفحة الـScheduled" ما لحد (زيJob يخلص edge القديمةCT-2 النسخة على بيمشي البيع
v1.4 couldn't start on time - Hoteliana) تبقى الجديدة ما Activeلحد لـ تنبيه فشل: لو فعلاً. Hoteliana بيشوفOps( والمورد
is on it. v1.3 is still selling."
 contract whole sell Stop فاتتE46. ليالي فيها فترة على
"Tonight's release has passed - stop sale: لوpickerالـ فاتت. اللي الأيام بيمنع To = الـFrom بعد النهارده = تحذيرCut-off
covers from tomorrow."
On Request E-H الـ:
 الـE47 والـSLA. خلص مفتوحModal
. OV 03.23R وصل:Trigger العداد أثناء00:00
"This request expired at }time{ and was }auto-rejected / handed to أحمريظهر: العداد والـExpired" يتحولModal،
 sent." was Nothing Hoteliana{. + ."Close" answer" يختفي.Send
: السيرفر:Race على بـ الانتهاء بعد وصل الإرسال لو (مقترح)5 ثواني  الرسالة بنفس يترفض أكتر: يتقبل.
. الطلبE48 نفس على رد زميل
. يظهر }time{." at request this declined{ / }conﬁrmed already "}Name{ + الطابورClose" من يختفي الصف
)Withdraw. الطلبE49 سحب الوكيل
"The agent withdrew this request at }time{. فورًايظهر: الطابور من يختفي الصف الـRealtime ولو مفتوحModal)،
 answer." to Nothing + الـClose" hold. يتفك.Soft
 Conﬁrm مخزونE50. ليها ماعادش بتاعته الغرفة طلب على
من:Trigger طلب Request" On to بعدSwitch out Sold بيأكد والمورد ،
 يظهر: غرفة. لقى الفندق إن معناه التأكيد منع؛ مفيش الـلكن لو Request On to Switch = out sold When التأكيد صفر: والمخزون
No stock is left on 14 Sep. Conﬁrm :Modal.  المخزونبيعمل فوق مؤكدة كارتزيادة في بتتعرض stock" الـAbove في تحذير
room." extra an you given has hotel the if only .(مقترح)

---

**p. 140**

 Decline سببE51. غير من نصOther غير من
"Tell the agent why in a few words." / "Pick a reason to decline."
. E52 الشكل غلط تأكيد رقم
"Use letters, numbers and - only )up to 40(."  من (مقترح)40أكتر حرف مسموحة غير رموز فيه أو
عام-E
. صلاحيةE53 غير من عقد فتح محاولة
). missing_permission ←  11.4 النطاقUI في مش فندق أو تانية شركة عقد 11.5. UI ( عقدout_of_scope
"This contract has ended - it's ) entity_readonly ( UI 11.6  ← Deep link منExpired/Terminated يعدّل وحاول
read only."
. الصفحةE54 أو القايمة تحميل فشل
. المحتوى مكان contracts."رسالة your load couldn't "We + again" الأولTry التحميل تفضل. اتحملت اللي الكروت
 الجدول.Skeleton بشكل
 link Deep لطلبE55. Request اتقفلOn
."Open the queue" + )Declined / Expired / }name{ Conﬁrmed by + answered." already was request حالتهThis
6 حالات. مش موجودة في التصميم
أقرب شاشة السلوكيتبني المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
عليها
وضغط متقبل فندق ولا 1مفيش
Create
"A contract needs a hotel you are + "No approved hotel yet" Modal
linked to. Request access in Hotel Library - you can contract it as
. approves." Hoteliana as soon + Library" Hotel "Open · فيهCancel" لو
 بعددهاPendingطلبات سطر
OV 03.1P
2 Badge "Scheduled" الفترةNeutral( تحت + days") 12 in زيStarts المنيو القايمةScheduledصف. في
(BR-03-20) Active
OV 03.0C
3 03.0C2 only"المنيوOV Read · "View + versions" & بسActivity القايمةTerminatedصف في
4Active · Badge أصفرActive" شيب + v1.4" فيهAmending المنيو amendingصفContinue.
"Amend commercial v1.4" وamendment amendment" بدلDiscard
contract"
OV 03.0C
5Paused عليه byصف
Hoteliana
 أصفر Hoteliana"شيب by الحالةPaused جنب المرئيTooltip بالسبب
)UI 10.2  ←( "Paused by Hoteliana · Follow up سطر أوله →"المنيو
 +OV 03.0C
UI 10.2
6 Aug"شيب 31 - Sep 15 · sale جنبStop فيهActive" المنيو sale. عليهOpen sellصف شاملStop
Stop sell whole contract" بدلagain"
OV 03.0C
7Hoteliana جهّزتهDraft
(Assisted loading)
Hoteliana"شيب by هيدرPrepared وفي الصف في 03.1 وسطرUI ،
Hoteliana prepared this draft from your signed rate sheet. Check
every section - only you can activate it."
UI 03.1

---

**p. 141**

أقرب شاشة السلوكيتبني المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
عليها
8 again"فتح sale بعدOpen
 sell شاملStop
"Nights you stopped one + "Open sale again for {from} - {to}?" Modal
"Open sale" · "Keep stopped" + by one stay stopped."
OV 03.0D
9Stop sell / Delete بعدUndo
tier
. 03.16D فيه10توستOV ثواني نهائيUndo" الفعل بعدها
10 manager الـRevenue خلّص
lifecycle ومالوشDraft
"Ready for activation. Only the الـ الـDrawerفي مكان والزرارCheckbox
Notify an + Owner or an Admin can activate - ask them to review it."
"Admins notiﬁed." ← توستadmin"
OV 03.2
الـ في أحمر Drawerبانر live." went nothing - activate قايمةCouldn't + فشل 11)Validationالتفعيل
Back to بلينكات editing"الأسباب
 +OV 03.2
UI 11.9
safe." is draft Your activation. the conﬁrm couldn't "We + again" تقنيًاTry فشل 12التفعيل
)idempotency الـ key(نفس
OV 03.2L
13 activate" to things 2 "Fix +  مفيش⚠ لينكات؛ + الأقسام على ولاCheckbox ناقصةReview أقسام وفيه
Activate
OV 03.2
now." it book can Agents live. is Block Annual أوMakkah التفعيلis بعد 14توست
scheduled. It starts selling on 01 Sep 2026."
UI 03.3
Badge أزرقScheduled" شريط + 00:00 at }start{ on selling عقدStarts 15Scheduledصفحة
"Starts + then." until everything change still can You time. كارتSaudi
in {n} days"
UI 03.3
16Draft modelتغيير فيPricing
أرقام فيه
The base, room + "Switch to ﬁxed price per room?" Modal
supplements, extra children and meal plans you entered will be
cleared. Seasons keep their names and dates; their prices are
"Switch and clear" · "Keep base + supplements" + cleared too."
OV 03.11
17One price all لـ weekتغيير
Weekendوفيه
The weekend prices you typed + "Use one price all week?" Modal
"Use one price" · "Keep two rates" + will be dropped."
OV 03.11
18 daysتغيير عقدWeekend في
شغال
Weekend days · Thu · Fri → Fri · Sat · modeفي الـEdit يعرضReview،
Affects {n} future nights · nights with their own price keep it ·
restrictions set to weekend days only follow the new days"
OV 03.3C
19 priced" is week the علىHow مقفول week" all price وسطرOne إندNo أيام0الويك
 night." every price one - days واختيارweekend only" days فيWeekend
مايترسمش القيود
OV 03.1S
20 قيودNone"اختيار وفيه
سياسة
Remove the / "Remove all 3 restrictions from this contract?" Modal
· "Keep them" + cancellation policy and release from this contract?"
"Remove"
OV 03.RSD
21 لعقدRelease sale أوFree
On Request
 :Releaseقسم release." to allotment no is there - used زرارNot غير من
Edit
OV 03.17
22After release = Switch to
On Request
"Inside the release window agents can still request the night.سطر
You answer inside the On Request SLA - nothing is conﬁrmed
 you." الـwithout + قسمSLA في يظهر ناقص9 لو
OV 03.17B
03.17 release"زرارOV فيRemove 03.17 القسمOV ← none" الـDefault: 23Releaseشيل

---

**p. 142**

أقرب شاشة السلوكيتبني المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
عليها
24Sold( Block عقدSLA في
out/After release = On
(Request
 SLA"بلوك Request "On + expires" SLA the قسمWhen في شكل9 بنفس
UI 03.1Bبلوك
UI 03.1B
مش / الأيام بنفس 25شريحتين
تنازلي
 03.16 الحقلOV تحت وE26خطأ policy") مقفولSave
03.16C أصفرOV مسموحE28تحذير والحفظ قبلها) اللي من أرخص 26شريحة
والرجوع الموسم سياسة 27إلغاء
العقد لسياسة
Ramadan will ← policy"زرار contract the فيUse 03.16S* OV تأكيد
use the contract policy again."
OV 03.16SRAM
28: فوقOverbooking الحد
الماكس
The limit can be at most {max} rooms a night for this stock."UI 03.1E
29 مايترسمش managerالاختيار Revenue a or Admin an Owner, the لليوزرOverbooking"Only متاح مش
can turn on overbooking."
UI 03.1J
30 03.1N وUI يكتبSells"مسموح، night" a rooms 0 - sale on type"Not room رقمPer لنوع0:
لسه مطلوبة 31Requestغرفة
(missing room
 رمادي Hoteliana"صف for waiting · Requested · قابل}Room{ مش
للتعليم
3 03.1A قسمUI
بس متضافة 32غرفة
ROOM_NOT_MAPPED
"Waiting for Hoteliana to map this شيب وعليها عادي تتسعّر Infoالغرفة
room - it won't sell until then."
UI 03.1A
الفندق مكتبة من اتشالت 33غرفة
عقد في وهي
This room was removed from the تحذير عليه الصف العقد: hotelفي
library - it no longer sells. {n} future bookings stay conﬁrmed."
NOT_ON_CONTRACT  Blocker
UI 03.3
03.0I E35OV حجوزاتModal عليها غرفة علامة 34إلغاء
03.3B E34خطأUI + nights" }n{ the المباعSee تحت مخزون 35تقليل
36 مدة بقتDraftتغيير والمواسم
برا
 + 03.13 E4OV بالأحمرModal برا المواسم
37Copy to new period"4 Modal " period"}Name{"Copy new a to " )A33( + تحذيرDraft + جديد
seasons need dates for the new term."
OV 03.22
(بعد تواريخ غير من 38موسم
(Copy
الموسم dates"صف فيPick محسوب ومش بالأصفر، rate" contract ،Base
Ramadan has no dates - pick them or remove مقفول theوالتفعيل
season."
7 03.1E قسمUI
Modal " season the "?"}Name{"Remove + to back go nights }n{ موسمIts 39مسح
the base contract rate. {k} conﬁrmed bookings on these nights keep
the price they were booked at. Its own restrictions and cancellation
"Remove season" · "Keep season" + policy are removed too."
OV 03.RSD
رمادي فاتت اللي النهاردهPast"الليالي لقبل البداية تغيير تقويم؛ كل في ومقفولة فات نصه 40موسم
 بسRemoveممنوع؛ الجاي بيشيل
OV 03.14
season" مايترسمشRemove your for stays it - over is season فاتThis كله 41موسم
Read only الأسعارrecords." وكل
OV 03.14RO

---

**p. 143**

أقرب شاشة السلوكيتبني المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
عليها
42 موسم Fixedتفاصيل من بأكتر
صف
 /Standard · RO · City / Standard · B&B · التقويم فوق صفوف Cityسويتش
…) الغرف سويتش زي
OV 03.14F
43 عقدReset في الموسم تعديلات
Edit mode ومفيشActive
"Held as a draft until you يدخل modeالعقد وتوستEdit أوتوماتيك
Review & publish" + لينكpublish."
OV 03.14B
Modal " group the "?"}Name{"Remove + }n{ its from جنسياتGuests مجموعة 44مسح
countries pay the season prices from the next booking. Conﬁrmed
"Remove group" · "Keep group" + bookings keep their price."
OV 03.12NE
الأدنى الحد تحت مجموعة 45سعر
للبيع
 أصفر04.6I مسموحE23تحذير والحفظ
للموسم اتضافت جديدة 46غرفة
 سعرFixedومجموعة مالهاش
ليها
Pakistan has no price for }Room{ - guests pay تحذير + فاضية theالخانة
season price."
OV 03.12N
سعر تغيير بعد الجنسيات 47أسعار
الموسم
Nationality groups · 2 follow the new price · 1 ﬁxed في :Reviewسطر
Pakistan) keeps its price"
OV 03.3C
48 onlyقيد فترةWeekend على
إند ويك مفيهاش
03.RSW E32خطأOV
03.RSB الوصولE31تحذيرOV أيام كل بيقفل 49قيد
03.RSD مشطوبOV held"الصف · ومعاهDeleted النشر، لحد عقدUndo" في اتمسح 50Activeقيد
51 03.3D فيOV زيادة 03.3Dسطر OV : Sara." by made were changes these of زميلDiscard"3 تغييرات وفيه
52Edit refreshed."بانر is view Your }time{. at changes }n{ published +Sara في وأنا نشر modeزميل
 خليةconflict خلية
UI 11.10
agents what still is v1.3 agents. for changed nothing - failed فشلPublish 53النشر
"Try again" + see."
UI 11.9
03.3C conflict"صفOV 1 · conflicts لينكRestriction + تفاصيل + بالأصفر الـ في قيود 54Reviewتعارض
55 publish & لنسخةReview
Amend
"Effective from + "Review & publish v1.4" 03.3Cنفس بعنوانOV
 }date{" + untouched" · }n{ v1.3 on "Bookings + Checkbox + تأكيد
"Publish v1.4"
OV 03.3C
56Discard amendment"Keep + "Discard the v1.4 draft? v1.3 stays exactly as it is." Modal
"Discard" · amendment"
OV 03.3D
57 نشرScheduledنسخة (بعد
(Amend
شيب الهيدر 2026"في Oct 01 from · scheduled جنبv1.4 وفيv1.3" ،
Scheduled" Status 03.3A الصفOV
/ UI 03.22B
OV 03.3A
والـ النسخة سريان 58Jobيوم
اتأخر
)E45( Scheduled 03.2L بدلActivating…"شيبOV
59← Block النوعAmend لتغيير
On Request
 03.1B 03.22فيUI بلوكOV expires SLA the When + إجباريSLA
60On النوعAmend لتغيير
Block ← Request
When sold الـ v1.4في قسمDraft أرقامInventory + (موديل إجباري يتفتح
(out
UI 03.1N

---

**p. 144**

أقرب شاشة السلوكيتبني المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
عليها
61Paused by وفيهResume
Hoteliana
"Your pause is lifted. Hoteliana's pause is still on - agents stillتوست
can't book."
OV 03.0J
62 03.0J E42OV Modal close" and المدةResume"Resume نهاية بعد
63Paused عليه عقد byصفحة
Hoteliana
"Hoteliana paused new bookings on حاجة كل فوق أصفر thisشريط
Follow up with + "Paused since }date{" + المرئيcontract." السبب
. Hoteliana" · sale" blocking is what See بكل قايمة إيقاف: من أكتر فيه لو
 السبب الفترة، (النطاق، وEditالإيقافات شغالينPublish
UI 10.2
64Amend وفيهTerminate
محجوزة تغييرات أو مفتوح
The open v1.4 amendment and 2 held : OV في زيادة 03.21سطر
changes will be discarded."
OV 03.21
65Scheduled 03.21نفس السطورOV بس honour." to nothing - yet bookings لعقدTerminate"No
Terminated بعدهاBadgeوالـ
OV 03.21
66Paused 03.21 الـOV والهيدرModalنفس PAUSED"، · لعقدTerminate"}NAME{
67 لسهExpired ضيوف وفيه
مقيمين
 + bookingsكارت :Conﬁrmed out" checked }m{ · house in still لينك}n{
للحجوزات
UI 03.20
68On طابور في Requestبحث
guest.piiبدون
مخفي الضيف hidden"اسم details نتايجGuest مابيرجعش بالاسم والبحث ،
موجود) الاسم إن (مابيكشفش
UI 03.23
69 waiting" requests "No + contract this for bookings Request On RequestطابورNew فاضيOn
 countdown." SLA their with here كارتshow + today يفضلAnswered
+ UI 03.23
UI 11.16
مع 70Hotelianaطلب
(Escalated)
"Hoteliana is calling the hotel for you." + "With Hoteliana" Infoالصف
Answer"ومفيش
UI 03.23
لـModalالـ يتحول auto- was and }time{ at expired request مفتوحThis وهو انتهى 71طلب
Close" + rejected. Nothing was sent."
OV 03.23R
03.23R 10:40."OV at request this conﬁrmed already "Sara + الطلبClose" نفس على رد 72زميل
والـ يختفي، :Modalالصف }time{. at request this withdrew agent الطلبThe سحب 73الوكيل
Nothing to answer."
OV 03.23R
74"No room بسببDecline
available"
 اختياريCheckbox }dates{" for }room{ on sale stop عندهAlso (لو
( inventory.stop_sell
OV 03.23R2
75 مخزونهاConﬁrm ليلة على
صفر
No stock is left on 14 Sep. Conﬁrm only if the hotel has givenتحذير
you an extra room."
OV 03.23R
76SLA in-appإشعار action" :"requires Noor · min 5 in expires آخرHTL-9238 الـ5إشعار من دقايق
Answer" + Umrah · Deluxe Haram View · 14 Sep"
Flow 09
notiﬁcations
الصفحات onlyكل مفيشRead غيرEdit، المنيو في أوامر ولا وOpen/View 77Auditorالحساب
Activity & versions
OV 03.14RO
ربطه اتوقف 78الفندق
) التفعيلSuspended( بعد
"Your link to }Hotel{ is suspended by Hoteliana العقد على أحمر -شريط
Blocker nothing on this contract sells."
. بتتخدمSUPPLIER_HOTEL_INACTIVE المؤكدة الحجوزات
UI 10.2
لو يبيع). بيكمّل المورد (قرار: البيع على تغيير بيبقىHotelianaمفيش ← توقف قررت انتهت الفندق 79رخصة
(63#) Paused by Hoteliana
UI 10.2

---

**p. 145**

أقرب شاشة السلوكيتبني المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
عليها
الحقل تحت alreadyتحذير is Hotel Makkah Noor Al at contract الفندقAnother نفس على مكرر عقد 80اسم
Block." Annual Makkah called مسموح والحفظ (مقترح)
UI 03.1
81 sellملخص صفحةStop في
العقد
 +Stop sale on the whole contract · 15 Sep - 31 أصفر Aug"شريط
Open sale again"
UI 03.18B
الشريط (شكل
82 11.R صغيرSkeletonREF مؤشر + بشفافية ظاهر الجدول فلتر: بعد الجدول/الأقسام. بشكل والقايمةLoading للصفحة
03.12 وOV الاختيار، في مقفولة المستخدمة Tooltipالألوان Hajj" by متكررUsed لون 83السيزون
84 03.1E season"UI يختفيAdd contract." one for maximum the is seasons وصل20 موسم20حد
85Draft 11.x exists."UI longer no draft "This + contracts" to link"Back اتمسحDeep لعقد
)State machine( 7 الحالات.
)Contract status( 7.1 حالة العقد
بيعالتعديلالحجوزات الحالةاللونمعناهاجديد
المؤكدة
لا)contracts.editكاملمفيش أبدًا ماتفعّلش DraftNeutralلسه
في وبدايته ScheduledNeutralاتفعّل
المستقبل
يوم (من لسه
البداية)
)Edit modeكاملمفيش
Amendبتتخدم + mode المدةEdit جوه وشغالأيوه، المدة ActiveSuccessجوه
 soon لـExpiring (عرض
(Active
Warning وفاضلActive
threshold
أيوهActiveزيبتتخدم
Active · amending
لـ )Active(عرض
Warning
("Amending")
نسخة Amendفيه
Draft
على أيوه
الحالية النسخة
Activeزيبتتخدم
مابتتباعش والتغييرات (مخفي)كامل، وقفهلا PausedWarningالمورد
Resumeلحد
بتتخدم
تاريخ بعد خلصتلا ExpiredNeutralالمدة
النهاية
Read للأبد onlyبتتخدم
تاريخ من ونهائيلا بدري TerminatedDangerاتنهى
الإنهاء
Read بعد حتى onlyبتتخدم
التاريخ
 حالةOverlay (مش  Hoteliana" by "Paused منفصلWarning( شيب Blocker،  HOTELIANA_PAUSED . sale" (شيب)Stop
= ومابيغيروهاش الحالة جنب بيتعرضوا الاتنين ليالي. قرار
7.2 الانتقالات
منإلىإيه/مينالشرطالسجل
أوcontracts.editيوزر فندق، يختار to شيء)DraftCopy (لا
)Assisted loading( period أوnew Hoteliana،
created ApprovedفندقDraft

---

**p. 146**

منإلىإيه/مينالشرطالسجل
deleted contracts.editيوزرمفيشDraft ← draft Draft(ممسوحDelete
DraftActiveActivate ← كاملة، الأقسام contracts.lifecycleيوزركل
البداية
Contract activated ·
Draft → Active
· activated النهاردهContract < فوقالبداية اللي DraftScheduledنفس
Draft → Scheduled
ScheduledActive · started 00:00—Contract البدايةSystem يوم مكة
Scheduled → Active
ScheduledPausedcontracts.lifecycle—Contract paused
ScheduledTerminatedcontracts.lifecycle—Contract terminated
ActivePausedPause ← contracts.lifecycle—Contract paused ·
Active → Paused
PausedActiveResume ← · resumed وبدأContract المدة جوه contracts.lifecycleلسه
Paused → Active
· resumed مابدأشContract PausedScheduledResumeلسه
Paused → Scheduled
PausedExpired · expired أوSystem—Contract المدة، نهاية عند النهايةResume بعد
Paused → Expired
ActiveExpired · expired 00:00—Contract النهايةSystem بعد يوم مكة
Active → Expired
Active / Paused /
Scheduled
TerminatedTerminate ← contracts.lifecycleسبب
TERMINATE
Contract terminated
· X → Terminated
Expired /
Terminated
— draft new to تاني—Copied البيع periodنهائي. new to جديدCopy (عقد
)Version( 7.3 حالة النسخة
الحالةاللونالانتقال
)Amending( DraftWarning ← amendment Start ← Publish ← أوScheduled ممسوحةDiscard،
ScheduledNeutralActive السريانSystem يوم
ActiveSuccess ← بقت أحدث Activeنسخة ← العقدSuperseded العقدExpired/Terminated؛ بحالة نسخة آخر تفضل
SupersededNeutraldiff onlyنهائي، فيRead بيتشاف 03.3A، بـOV
)Edit mode( 7.4 Draft التغييرات المحجوزة
Discard ← held. تغييرnone (أول ← held changes( )n ← Publish ←  النسخة،published (نفس )PUB-id ←  أوnone
Draft ← ←  أوnone held. ← failed Publish ←  فاضلةpublish_failed (التغييرات again العقدTry الـTerminated.
أوتوماتيك بيتلغي

---

**p. 147**

7.5 طلب الـ Request (On من جهة )العقد
الحالةاللونالانتقال
Needs an) Waiting
(answer"
Warning) Conﬁrm ← Decline · Conﬁrmed ← SLA · Declined ← Expired أوAuto-reject(
With ← Withdrawn · Terminate· (Escalate) With Hoteliana
Hoteliana
 SLA لحظيPast (عرض
المعالجة قبل
)Problem"( Danger الـ ما لحد يعالجهJobثواني
With Hoteliana"Waiting for) Info
(Hoteliana"
Declined Hoteliana تأكد Hoteliana · ترفضConﬁrmed
ConﬁrmedSuccess)Flow في الحجز عمر (باقي هنا 05نهائي
DeclinedDangerنهائي
auto-) Expired
(rejected
Neutralنهائي
WithdrawnNeutralنهائي
7.6 القيد والموسم
 القيد Active )Success( ↔ Inactive بالـNeutral( عقدDeleted؛Toggle) في (نهائي). بيبقىActive تغيير أي النشرHeld لحد
).Read only الموسم (جوهDraft العقدDraft Past · changes Held · فاتت،Live لياليه (كل
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Approved ربطه hotelنعم؛Approvedفندق
الـ إنشاء بعد Draftمايتغيرش
Choose a hotel you are linked to."
Contract 60–3 حرف حروف(مقترح) nameنعم،
و ومسافات وأرقام
Give the contract a name (3-60 characters)."
Contract term · past." the in be can't date start time≤"The Startنعم)Makkah
Contract term · < المدةStart شهر24، Endنعم
(مقترح
A / "End date must be after the start date."
contract can cover up to 24 months."
currency." contract the SAR"Choose Currencyنعم)MVP(
Weekend افتراضية (قيمة daysThuنعم
(· Fri
days." weekend 3 to up 3–0"Pick أيام (مقترح
Contract Block / أوAllotment typeنعمOn
Request
—
On Request SLA لو Requestنعم أوOn
Switch to On
Request
240 / 120 / 60 / 30 / 15
 (مقترحدقيقة
Set how fast you answer requests."
When the SLA
expires
أوAuto-reject to فيهEscalate لو SLAنعم
Hoteliana
"Choose what happens when a request isn't
answered in time."

---

**p. 148**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Pricing supplements + أوBase modelنعم
room per price ؛Fixed
التفعيل بعد مقفول
—
Base · Room / Meal /
View
متاح الفيو الفندق؛ مكتبة )Baseنعممن
دي للغرفة
Pick the base room, meal and view."
Base · Weekday صحيح 100,000–1رقم cost)BaseنعمSAR
(مقترح)
Whole SAR only - no / "Enter a price above 0."
decimals."
Base · Weekend costWeekday لو &نعم
weekend
price." weekend the القاعدةEnter نفس
How the week is
priced
/ week all price نعمOne
Weekday & weekend
—
Room base the - negative be can't supplement صحيحA متعلّمة100,000،0رقم غرفة لكل supplementنعم
room is the cheapest one."
Fixed row · Room /
Meal / View
the in already is view and meal room, مكررThis نعممش
contract."
Fixed row · Weekday
/ Weekend total
0." above price a صحيحEnter نعم100,000–1رقم
Extra child
supplement
Free." it mark or supplement, child the صحيحFree"Enter رقم أو متعلّم10,000–1 صف لكل نعم
Meal plan · room." per or person per room"Choose Per / person متعلّمةPer وجبة لكل Basisنعم
Meal plan ·
Supplement
غير متعلّمة وجبة لكل نعم
الأساس
supplement." meal the صحيحEnter 10,000–1رقم
Inventory room Per / pool model)BlockنعمShared
type / Free sale
"Choose how the hotel gives you rooms."
)Pool( Rooms a صحيح 5,000–1رقم night)Poolنعم؛(مقترح)
≤
"You have 23 / "Enter at least 1 room a night."
rooms sold or held on 14 Sep. The pool can't
go below that on any night."
Max from this room
(Cap)
a rooms )50 pool the above be can't cap 1"A ≥ Cap ≥ لاPool
night)."
Per) Rooms / night
(room type
صحيح نوع؛5,000–0رقم لكل نعم
المباع+المحجوز
Enter 0 or more rooms."
When sold outPool / Per roomنعم
(type
Stop sale / Switch to On
Request / Controlled
overbooking
"Choose what happens when rooms run out."
Overbooking limit
per night
1 ≥ limit ≥ ,10(min من20% لو Overbookingنعم
 (مقترحالمخزون)
Set a limit of at least 1 room a night -
overbooking is never unlimited."
Restriction · Room
type
rooms— العقدAll على نوع أو نعم
Restriction · term." contract the inside dates الماضيPick في مش المدة، Datesنعمجوه

---

**p. 149**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Restriction ·
Minimum nights
(أو30–2 وصول/1 قفل فيه لو نعم
مغادرة
Minimum nights is at least 1. With 1 there is
/ no rule - choose None instead of adding one."
"Minimum nights can be at most 30."
Restriction · Applies
on
days Weekend / day نعمEvery
 إندonly ويك فيها الفترة (لازم
"20 - 22 Sep has no Thursday or Friday - this
rule would never apply."
Restriction · Check-
in / Check-out per
day
closed— / لاopen
Restriction · (افتراضيToggle— Active)Activeنعم
Cancellation tier ·
days before
صحيح مش365–1رقم تنازلي، نعم،
مكرر
Tiers / "Two tiers can't start on the same day."
must go from the most days before arrival to
the fewest."
Cancellation tier ·
charge type
/ stay of % / Nights / نعمFree
Fixed amount
"Pick what this tier charges."
Cancellation tier ·
value
Nights ≤ 1 · % 100–1 (غير· )Freeنعم
0 < Fixed
"Enter a share / "Charge at least 1 night."
"Enter an amount / between 1 and 100%."
above 0 SAR."
tiers." two least at needs policy cancellation شاملة4–2"A الشرايح—No-show عدد
Release / day Same / periodلاNone
Number of days 1–60
(مقترح
Enter 1 to 60 days."
Release كلHH:MM دقيقة،30 فيه لو timeReleaseنعم
Makkah time
"Pick a release time."
After On to Switch / sale فيهStop لو releaseReleaseنعم
Request
"Choose what agents see after release."
Season 40–2 حرف مكرر(مقترح) مش nameنعم،
العقد في
Another season / "Give this season a name."
in this contract is already called Ramadan."
Season تداخل، مفيش المدة، datesنعم1جوه
ليلة
""Last ten nights"5 nights already belong to "
Season لون أول (افتراضي colourنعم
فاضي)
تاني— موسم في مستخدم مش
Season every for price weekend and weekday a العقدSet أسعار قواعد pricesنعمنفس
room on sale."
Nationality group
name
في40–2 مكرر مش حرف، نعم
الموسم
Give the group a name."
≤ واحدة1 مجموعة في دولة كل Countriesنعم،
الموسم في
Pakistan is / "Add at least one country."
already in another group"
How the price differs." price group's this how Fixed"Choose / differsنعمAdjust

---

**p. 150**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Adjust صحيح والناتج0رقم لكل1، لو amountAdjustنعم
غرفة
The group price must stay above 0 SAR.
Lower the discount."
Fixed group price per
room
room." every for price a صحيحEnter لو100,000–1رقم Fixedنعم
Stop sell · From / From To≤ Toنعم≥
From ≤ Toالمدة،
Pick dates inside the contract term."
Pause · characters." 200 under reason the ≥"Keep 200 حرف Reasonلا(مقترح)
Terminate · و القايمة، بنصOther"من Reasonنعم
200إجباري
Pick a reason."
Terminate ·
Conﬁrmation text
capitals." in TERMINATE بالظبطTERMINATEيساويType نعم
Amend · Effective
from
later." or tomorrow be must date effective نعم≤"The
Amend · What
changes
changes." amendment this what الأقلChoose على نعمواحد
Amend · New end
date
< from الكليةEffective المدة لو، Termنعم
 ≥ شهر24
"The new end date must be after the effective
date."
Review · conﬁrm
checkbox
activate." to conﬁrmation the يتعلّمTick نعملازم
OR · decline." or conﬁrm Decline"Choose / DecisionنعمConﬁrm
OR · Supplier
conﬁrmation number
40(." to )up only / and - numbers, letters, ≥"Use /40 - و وأرقام حروف حرف، لا
OR · Decline القايمة، بنصOther"من لو reasonDeclineنعم
200
"Pick a reason to decline."
)list( ≤— 2 حرف Searchلا(مقترح)
9 الإشعارات. والإيميلات والسجل
الافتراضية in-appالقناة بس. المهمة للأحداث الإيميل الفعل. مفتاح عندهم اللي لكل التصميم مقترحة، هنا الإشعارات (كل
}date{ }time{ · }Event{ · }Detail old → : OV 03.3A) مرجع.) عليه اللي عدا ما السجلمابيحددهاش منActivity صيغته
.new} · {Actor} · {Manual / Bulk / System} · v{n} · PUB-…"
مينالقناةRequires الحدثيستلم
؟action
actor · action ·( سطر السجل
(old →  new
 Draft → — · created Draft · اتعملDraft——لاUser
 منDraft اتعمل
Hoteliana
(Assisted)
Owner + Admins + Revenuein-app +
email
"Reviewنعم
and
(activate"
Hoteliana · Draft prepared by
Hoteliana · — → Draft

---

**p. 151**

مينالقناةRequires الحدثيستلم
؟action
actor · action ·( سطر السجل
(old →  new
 جاهزDraft
 طلبRevenueو
تفعيل
Owner + requested Activation · Adminsin-appنعمUser
 → Draft · deleted Draft · اتمسحDraft——لاUser
Deleted
Revenue + Admins + (غيرOwner اتفعّل العقد
الفاعل
Draft · activated Contract · in-appلاUser
→ Active/Scheduled · v1.0 ·
…-PUB
بدأ Scheduledالعقد
(Active
Owner + Admins + · started Contract · Revenuein-appلاSystem
Scheduled → Active
Revenue + Admins + (غيرOwner تشغيلية تغييرات نشر
الفاعل
/ published Prices · in-appلاUser
Restriction added / Policy
· {new} → {old} {ﬁeld} · changed
…-PUB
عدّى محجوزة تغييرات
 غير24عليها من ساعة
نشر
التغييرin-app"Publishنعم عمل rates.publishاللي
(or discard"
—
 لتغييراتDiscard
محجوزة
عمل اللي هو مش لو التغييرات عمل اللي
Discard
discarded changes Held · User in-appلا·
changes {n}
 sell كلهStop للعقد
Open sale
Owner + Admins + Revenue +
Reservations
Open · sell stop Contract · in-appلاUser
{to}-{from} · → Stop sale
Revenue + Admins + Pause؛Owner
(admin in-app) Hoteliana Supply
Active · paused Contract · in-appلاUser
{reason} · → Paused
· resumed Contract · فوقin-appلاUser اللي Resumeنفس
Paused → Active
Paused by
 / رفعHoteliana
الإيقاف
Owner + Admins + Revenue +
Reservations
in-app +
email
فيه (لو نعم
من طلب
 زيHoteliana
ملف رفع
Hoteliana · Paused by Hoteliana
/ {reason visible} · {scope} ·
Pause lifted
 v1.3 · started Amendment · Adminsin-appلاUser + بدأAmendOwner
→ v1.4 draft
 + Revenue + Admins + اتنشرAmendOwner
Finance
in-app +
email
· published Amendment · لاUser
{date} v1.4 Scheduled from
 · effective Amendment · Revenuein-appلاSystem + Admins + سرىAmendOwner
v1.3 → v1.4
 · discarded Amendment · Adminsin-appلاUser + اتلغىAmendOwner
v1.4 draft → Deleted

---

**p. 152**

مينالقناةRequires الحدثيستلم
؟action
actor · action ·( سطر السجل
(old →  new
TerminateOwner + Admins + Revenue +
Finance + ؛Reservations
حجوزاتHoteliana عندهم اللي الوكلاء ؛
(من )Hotelianaجاية
in-app +
email
terminated Contract · User لا·
{reason} · Terminated → {old}
 soon (يومExpiring
الـ ،thresholdدخول
 ويوم7وبعده أيام،
النهاية) قبل واحد
Owner + Admins + Revenuein-app +
 مرةemail (أول
مرة وآخر
Renewنعم
(or extend"
—
ExpiredOwner + Admins + · expired Contract · Revenuein-appلاSystem
Active → Expired
On Requestطلب
جديد
عندهم اللي كل
 الفندقbookings.confirm على
 (صوتin-app
اختياري
 الـemail لو
60 ≤ SLA
 (مقترحدقيقة
· received Request On · نعمSystem
— → Waiting
SLA فوقin-appنعم— اللي الـ5آخرنفس في دقايق
in-app بس)agent (عداد والفريق الوكيل)، (بوابة الوكيل اتأكد طلب
+ email
· conﬁrmed Request On · لاUser
{ref} · Waiting → Conﬁrmed
in-app اترفضالوكيلagent طلب
+ email
· declined Request On · لاUser
{reason} · Waiting → Declined
Auto- خلصSLAالـ
(reject
Owner + Admins +الوكيل؛
(Need attention) Reservations
· expired Request On · (للموردSystem in-appلا
Waiting → Expired
 خلصSLAالـ
(Escalate)
in-app لـ Opsin-appنعم الموردHoteliana (طابور)؛
Hoteliana
System · Escalated to Hoteliana
· Waiting → With Hoteliana
 Hoteliana أكدت
متصعّد طلب رفضت
Owner + Admins + Conﬁrmed/Declined · Reservationsin-appلاHoteliana
on your behalf
 ناقص التأكيد رقم
Reference)
(pending
Reservations + Front ofﬁceFlow) in-app
(05
نعم—
 سعرAnomaly (هبوط
% ≤ أو60
refundable → non-
(refundable
 لـ in-appنعم Supplyadmin الموردHoteliana (مش بس
Hoteliana
admin) System · Anomaly raised
(side
ليلة لكل يوم سجل
 sale( سعرStop ليلة،
ليلة
———User · Night stopped · Rates &
· {room} · {date} · Availability
sell Stop → (منOpen 04 ،Flow
 في العقدActivityبيظهر
Every publish, amendment and rule change, with who and when. A booking :( OV 03.3A ) Activity & versions
 conﬁrmation." at force in version the جدولkeeps VERSIONS By( · Status · Effective · )Version + مرتبACTIVITY
"Bookings snapshot the contract version, تحت ثابت سطر النشر. ورقم النسخة فيه سطر وكل الأحدث، cancellationمن

---

**p. 153**

tiers, release and SLA in force when they were conﬁrmed - later edits never touch them. Finance settles each
 snapshot." own its on نسخةbooking على الضغط بيفتحSuperseded Diff new( → old حقل) لكل زي SP3.a(مقترح، فيOV
 الأدمن) واليوزر والتاريخ بالنوع فلتر .(مقترح. 50 سطرPagination
).agents عليه:Source سطر كل Agent / Hoteliana / System / Bulk / Manual agent( الـAI ملف باسمه، بيتكتب
)Acceptance criteria( 10 معايير. القبول
القايمة
. 1 عندهاGiven شركة منهم7 عقود وExpired فلتر،When،Terminated غير من القايمة تفتح مايظهروشThen دول الاتنين
contracts"و 7 of 5 الكاملةShowing الأرقام بتعرض والكروت ،
. 2Badge عقدGiven اسمهTerminated Block" يكتبWhen،Taiba البحث،taiba" في بـThen النتايج في يظهر العقد
 مخبيهTerminated" الحالة فلتر لو حتى
 .3 فلترGiven Suites Rawdah = وHotel Active = وStatus 1448 Ramadan = نتيجة،Period ومفيش تتحمل،When الصفحة
"Create a contract for Rawdah تظهرThen ﬁlters" these matches contract وNo الفلاتر وملخص ﬁlters" all وClear
.Suites"
 .4 عقدGiven يوزرWhen،Active manager يفتحRevenue يشوفThen،⋯ وOpen settings operational وEdit sell وStop
.Terminate وCopy versions & وActivity مايشوفش، وAmend وPause
 .5.Open · Resume · Terminate · Activity & versions عقدGiven يفتحWhen،Paused بالظبطThen،⋯ الأوامر
 .6My عقدGiven يضغطWhen،Draft draft Delete ويأكد، فيThen يفضل والفندق الوكلاء، عند أثر أي ومفيش يختفي، الصف
.Hotels
 Given attention فيهNeed أنواع،5 يختارWhen soon" وExpiring changes" "Unpublished ← 2" these .7Then،Show
 والـ بس دي العقود يعرض وبعدURLالجدول الفلتر، فيه النتيجةRefresh نفس
. 8 يوزرGiven ofﬁce يفتحWhen،Front تابThen،Property contracts" supply أصلاًHotel مرسوم مش
 الإنشاء .9 فتحGiven يوزر contract" supply تفتح،When،Create الصفحة غيرThen مسبقة قيمة أي (مفيش فاضية الحقول كل
Draft not saved yet · autosaves once Block / وقسمAllotment كنوع)، والمؤشر1 القفل، رسالة عليها التانية والأقسام مفتوح، بس
hotel" a pick .you .10 بس،Given فندق اختار يستنىWhen ثواني،10 الـThen القايمةDraft في ويظهر السيرفر على يتحفظ ،Draft
 المدة10–2والأقسام لحد مقفولة لسه .11 ومدة،Given فندق اختار When المدة، يأكد الأقسامThen تتفتح،10،9،8،6،5،4،3،2
 ولينكين7وقسم برسالته مقفول يفضل ↓" Restrictions to وGo ↓" Policies to ."Go .12 Given 2026 Aug 15 date وEnd
 2026 Sep 01 When،Start يأكد، يحاول يظهرThen date." start the after be must date مقفولEnd والزرار .13 فيهGiven
 علىActiveعقد Noor منAl 01 2026 لـSep 31 2027 الفندق،When،Aug لنفس متداخلة مدة يختار بالاسمThen التحذير يظهر
 و anyway"والفترة ضغطContinue ولو تتحفظContinue، المدة .14 أقسامGiven وقسم6–1 كاملة 8 = وقسمNone فيه9
قسمWhenسياسة، يتحفظ قسمThen،9 يتفتح7 .15 تسعيرGiven 400/500 وBase +120 View Haram ،Supplement
Given .16 .610 الأسعار،When تتعرض Then at" "Sells = 520 / 620 والـSAR list، بيعرضPrice للغرفةB&B ضيوف2
"A supplement can't be negative - the base room is the cheapest مكتوبSupplement الـWhen،50 يظهرThen،Blur
"When مايتعلّمشone." والقسم .17 عقدGiven Request النوع،When،On يختار بلوكThen (افتراضيSLA يظهر و30 دقيقة)،
Given .18 expires" SLA وقسمthe يتختار، لازم لـInventory يتحول committed…" is stock no Request: ويتعلّمOn
"On Request ⚠ Request On to Switch = out sold عقدWhen في يروحWhen،Block غيرReview من قسمThen،SLA عليه9
"Set a limit of at Then set" isn't مقفولSLA والتفعيل .19 Given overbooking حد،Controlled غير من الحقل،When يسيب
"Maximum conﬁrmed = 50 + unlimited." never is overbooking - night a room 1 الإدخالleast بعد يظهر المحسوب والسطر
 pool" the across night a .2 .20 Given room per price الموديل،When،Fixed يختار الأقسامThen و4 الصفحة5 من يختفوا

---

**p. 154**

 و room"والناف، يفتحAdd 03.1O3 نفسOV وإضافة City، · B&B · برسالةStandard ممنوعة مرتين .21) Given أسعارDraft فيه
 When،Base لـ يغيرّ Then،Fixed اختار ولو المسح، تأكيد يظهر supplements" + base تتغيرKeep حاجة مفيش .22 الـGiven في
 ماتحفظش،Draft لسه تعديل تاني،When تاب على يضغط يظهرThen 03.11 وOV leave"، & draft التنقل،Save ويكمّل يحفظ
 editing"و الـKeep يقفل .Modal .23 كاملة،Given الأقسام كل يفتحWhen زرارThen،Review contract" ماActivate لحد مقفول
 الـ الأقسامCheckboxيعلّم فيه والملخص (شاملة9–1، 4 · children فيExtra .)Base .24 بعدGiven البداية يوم،12 يفعّل،When
Contract يبقىThen العقد قبلScheduled بتتباع ليلة ومفيش يبقى00:00، البداية ويوم البداية، يوم مكة ويتسجلActive لوحده
 .started" .25 Given أثناءTimeout Activating…" فعلاً، فعّل والسيرفر يضغطWhen اليوزر again" تاني،Then،Try تفعيل مفيش
Then تروح 03.3والصفحة بنسخةUI السجلv1.0 في واحدة .26 بدقيقة،Given التفعيل قبل اتوقف الفندق ربط يفعّل،When
live." went nothing - activate والـCouldn't السبب، مع هوDraft ما زي .27 Given manager الـRevenue خلّص When،Draft
"Ready for activation. Only the Owner or an Admin مايشوفشThen،Reviewيفتح ولاCheckbox ويشوفActivate can،
.Notify an admin" وactivate…"
–10 والجنسيات المواسم .28 موسمGiven nights ten منLast لـ10 19 يفتحWhen،Mar لموسمDates الأيامThen،Ramadan
When 19 عليهاMar ومعلّم مقفولة locked" · nights ten ."Last .29 اتكتبGiven Mar 14 - Feb 18 طريقة)،Ramadan (بأي
"Use these يحفظ، Thenيحاول  03.13 بـOV يظهر " to belong already nights nights"5 ten وLast season""" وSave مقفول،
Ramadan · →" يحطdates 18 Mar 09 - .Feb .30 ليلةGiven 27 التقويمFeb من اتعدلت 640 → تفاصيلWhen،800 يفتح
"Reset all Room بالكهرمانيThen،Standard الليلة 640 → القايمة800 وفي 10:05"" Feb, 02 · Sara by وChanged to،
"READ price" يرجّعهاseason مع640 محجوز كتغيير ."Undo" .31 عقدGiven موسم،When،Expired تفاصيل يفتح الشاشةThen
ENDED" CONTRACT · غيرONLY من season ولاEdit .Reset .32 مجموعةGiven Asia" فيهاSouth فيPakistan ،Ramadan
"Pakistan is already in another group" يضيفWhen لـPakistan nationals" ويحفظ،GCC الموسم نفس في يظهرThen
Ramadan تتحفظ حاجة .33ومفيش مجموعةGiven GCC ومجموعة40− 690/790 Fixed سعرWhen،Pakistan فيStandard
 640يتغير → وينشر،660 Then تبقىGCC و620 تفضلPakistan ماتتغيرش690 المؤكدة والحجوزات .34، جنسيتهGiven الضيف
 ليها،Indonesia مجموعة ومفيش فيWhen يبحث الوكيل وبراThen،Ramadan الموسم، سعر = السعر بنفسRamadan الجنسيات كل
السعر
A والقيود السياسات .35 فيهاGiven سياسة No-show + 1 بس،Tier علىWhen يدوّر لـ✕ 1 الـThen،Tier ويظهر✕ موجود مش
Add tier" Then tiers…" two least at needs policy .cancellation .36 Given شرايح3 الجدول،When،No-show يشوف
"Two tiers can't start on Then و maximum"مختفي the is tiers ظاهر4 .37 Given 7 = 1 وTier 7 = 2 يحفظ،When،Tier
 day." same مقفولthe والحفظ .38 Given سياسةRamadan ليه days" 14 until فيWhen،free لياليه كل حجز Ramadan يتأكد،
"All rooms · 01 - 30 Sep · min الـThen سياسةSnapshot فيه براRamadan وحجز العقدRamadan، سياسة فيه .39 قيدGiven
"Minimum وبعده2" الأول، اتعمل 4" min · Sep 25 - 20 · rooms يبحثWhen،All الوكيل 21 - 23 (ليلتين)،Sep بـThen يترفض
dates." selected the for nights 4 is وبحثstay 10، - 12 يتقبلSep (ليلتين) .40 اتعملGiven الأحدث القيد When،Inactive
 يبحث 21الوكيل - 23 القديمThen،Sep القيد بيتطبق 2 ويتقبلmin .41) Given 0 = nights يكتبها،When،Minimum يظهرThen
 03.RSKخطأ وزرارOV 2" يحطUse .2 .42 قيدGiven only days بـWeekend Fri · علىThu 20 - 25 يشوفWhen،Sep
Fri الأحد–الأربعاءThenالتقويم، rule" in علىNot القديم بيستبدل القيد إن بيقول والسطر 24 وThu 25 بسFri .43 يومGiven
.44 بإعداد Friday"مقفول يفتحWhen،every 19 ويفتحFeb مقفولةThen،Check-in تفضل التانية والجمع بيتفتح بس ده اليوم
 Given 3 = أيامRelease و18:00 sale Stop = release الساعةWhen،After بـ18:00 الوصول قبل مكة أيام،3 الليThen الغرف
 عليها والليلة بترجع طلباتRELEASE_PASSEDماتباعتش ومفيش
Edit mode · 1 الشغال العقد .45 عقدGiven v1.3 يغيرّWhen،Active 420 → 400 cost فيWeekday mode الشريطThen،Edit
 yet" live is nothing - held بيشوفواchange لسه والوكلاء .400، .46 محجوز،Given تغيير يعملWhen اليوزر يوم،Logout بعد ويرجع
 عندهThen زميل لأي وظاهر محجوز لسه التغيير rates.publish . .47 Given publish & ينشر،When،Review تفضلThen النسخة
14 ويتسجلv1.3 المؤكدةPUB-id، والحجوزات 0"، re-priced بسعرBookings الجاي والحجز .420، .48 Given على23 مباعة غرفة

---

**p. 155**

 الـWhen،Sep يخلي يحاول 20 = ومعاهاThen،Pool بالرسالة يترفض الحفظ night" 1 the ."See .49 مؤكد،Given حجز بأول عقد
"Locked since ﬁrst conﬁrmed booking · change via يفتحWhen mode Then،Edit وTerm بسطرCurrency مقفولين
.Amend" .50 Given بـAmend Oct 01 from جديدةEffective ونهاية 30 2027 ينشرWhen،Sep Then،v1.4 Scheduled ،v1.4
Given .51 .v1.3 لحدv1.3و بيبيع 30 وSep 01، Active v1.4 00:00 وOct Superseded قبلv1.3 والحجوزات 01، علىOct
.52 ."Continue amendment v1.4" مفتوح،Amend يفتحWhen Then،⋯ contract" commercial ومكانهAmend موجود مش
 عقدGiven يعملWhen،Active اختياري،Pause بسبب هي،Then ما زي المؤكدة والحجوزات فورًا، الوكلاء بحث من يختفي العقد
Sep Stop 14 Requestوطلبات الـOn بتكمل المستنية ممنوعةSLA الجديدة والطلبات .53، عقدGiven كانPaused الإيقاف وقبل
Paused by يعملWhen،sale Then،Resume 14 يفضلSep sale لحالتهاStop ترجع التانية الليالي وكل .54 عليهGiven عقد
"Your pause is lifted. Hoteliana's pause is still on وHoteliana المورد،Pause من يعملWhen المورد توستThen،Resume
 book." can't still مابيتباعشagents لسه والعقد .55 Given يكتبWhen،Terminate صغيرة،terminate" بحروف الزرارThen
 و capitals."مقفول in TERMINATE "Type .56 Given وفيهTerminate طلبات6 Request مستنية،On When يأكد، العقدThen
لـTerminated بتروح الستة والطلبات (مشHoteliana، أوAuto-reject محجوزة تغييرات وأي بتتخدم، المؤكدة والحجوزات Amend)،
 .57بيتلغوا نهايتهGiven على فاضل عقد يوم30 افتراضي)،threshold تفتح،When الصفحة Then Badge soon" وشريطExpiring
 days" 30 in معEnds period" new to وCopy Amend" · term ولوExtend Hoteliana، الـ غيرّت لـthreshold يظهر28 البانر
"Copy to .28عند .58 انتهى،Given عقد يفتحه،When Then only" read - }date{ on ومفيشExpired ولاEdit، وAmend new،
 بيعملperiod" مايتلمسشDraft والأصلي جديد .59 Given period new to الـWhen،Copy يفتح،Draft الجديد فاضية،Then المدة
 وعليها تواريخ غير من وأسعارها بأسماءها dates"والمواسم والقيودPick تاخدInactive، المواسم ما لحد مقفول والتفعيل تواريخ، غير من
 تتمسح أو .60تواريخ Given contract whole sell العقد،Stop لنهاية النهارده من When يأكد، يفضلThen العقد وظاهر،Active
 المؤكدة والحجوزات الفترة، في بتتباع ليلة وشيب23ومفيش مابتتلمسش، sale") القايمة.Stop في يظهر
 Requestالـ On .61 فيهGiven طابور طلبات،6 يفتحWhen 03.23 والطلبThen،UI حي، والعداد تصاعدي، الفاضل بالوقت الترتيب
 الـ عدّى SLAاللي SLA" ."Past .62 عليهGiven فاضل طلب When،04:50 تأكيد، رقم غير من يأكد الحجزThen وعليهConﬁrmed
When pending" وReference يختفي، والصف today"، يزيدAnswered يتبلغ1 والوكيل .63، Given سبب،Decline غير من
 answerيضغط Then،Send decline." to reason a تتبعتPick حاجة ومفيش .64 رفضه،Given طلب يتسجل،When الرفض
When the SLA expires = الـThen hold (مشSoft والحالة المخزون بنفس تفضل والليلة يتفك، sale .)Stop .65 عقدGiven
عليه،Auto-reject" ماتردش وطلب يوصلWhen العداد الطلبThen،00:00 فيExpired يظهر والطلب يتبلغ، والوكيل Need،
 attention auto-rejected" Request ."On .66 Given Hoteliana" to يوصلWhen،Escalate العداد يروحThen،00:00 الطلب
 الموردHotelianaلطابور عند والصف Hoteliana"، زرارWith غير من .Answer .67 Given الطلب، نفس فاتح وأنا الطلب أكد زميل
 أبعتWhen Then،Decline 10:40." at request this conﬁrmed already بيتسجلSara رفض ومفيش .68 يوزرGiven
.Answer طابور،When،Auditor أو موسم أو عقد أي يفتح مفيهوشThen والطابور خالص، فعل زرار أي مفيش
 السعر حساب .69 Given 640 = weekday · Only Room · Room Standard · +45،Ramadan person Per حجزWhen،B&B
GCC لـB&B ليلة2 كبار 2027 Feb 21 الليلةThen،Sun سعر 640 + 90 = 730 شاملSAR .VAT .70 وجنسيةGiven الليلة نفس
 يتسعّر،When)،40−( الحجز Then 600 + 90 = بيسجل690 والحجز nationals"، GCC price: ."Nationality .71 الليلةGiven نفس
 640( weekday · Standard · وحجزRamadan لـB&B) طفل2 + كبار زيادة8 بسرير سنين يتسعّر،When)،100 السعرThen
Thu 640 + 100 + 3×45 = 875 (الطفلSAR الوجبة11-6 في بيتحسب person الحجزPer في بيتعرض والتفصيل .72)، ليلةGiven
.500 عقد في موسم أي برا إند) 400/500(ويك When،Base Only Room السعرThen،Standard

---

**p. 156**

11 أسئلة. مفتوحة
القرار المقترح لحد التعارضالتأكيد / #السؤالالمصدر
Q1 وUSDالعملة
الـEUR في ؟MVP
03.1R بيعرضOV USD/EUR rate" daily Hoteliana's at ،Converted
"SAR only in MVP" Supply CT-9 DECISIONSبينما وSAR"
 بسSAR يظهرواUSD/EUR
"Coming بسطر later"مقفولين
الـ من يتشالوا Modalأو
الإلغاء Q2سياسة
ممكن ولا إجبارية
؟None
03.16 OV activation" before وقسمRequired 9 بينماRequired" ،
None 03.1Q UI /  بـ03.3BN بيسمحوا
 بـ Noneنسمح الأحدث)،Flow(
Free cancellationومعناها
arrival" ونشيلuntil ،
. OV 03.16 منRequired"
 =  هل تأكيد: مجانيNoneمحتاج
؟Non-refundableولا
Q3: قيمةSLAالـ
الـ ولا المورد
 بتاعةBands
؟Hoteliana
Bookings spec BK-3/BK- عقدSLAالتصميم لكل المورد30 يحدده دقيقة)
) SLA الوصول5: قرب حسب 7 h 4 d: 2–7 · h 24 d: · ≥ 48 h 1 فيh:
Supply Conﬁg
 SLAالـ = الفعلي (قيمةالأقل من
). الـ مايقدرشBandالعقد، والمورد
  الـ من أكبر قيمة الأصغرBandيحط
Q4:Scheduled
يحجز يقدر الوكيل
البداية؟ قبل
10.R REF date" start term the on starts - yet بينماNot ،
Aug 28 03.3A بيسجلOV Active" → Draft · activated يومContract
. بيبدأ 01لعقد بشهورSep قبلها بيبدأ لرمضان الحجز السوق وفي
 قبلREFاتّبعنا بيع (مفيش
 قوي:البداية). بديل مقترح
 المدةScheduled جوه ليالي يبيع
والـ التفعيل، يوم Scheduledمن
قرار محتاج بس. عرض يبقى
Q5المدة/العملة
أول قبل النوع
 ولاEditحجز
؟Amend
"locked since : OV 03.1Q  / UI 03.3  .Amend: 03.R REF دايمًا
the ﬁrst conﬁrmed booking"
 حجز أول بعدهEditقبل عادي.
Amend
Q6: بيبدأC10 حجز
المدة جوه
بعدها وبيخلص
 الـ في بالمنع 10.RMVPنكمّل REF /  10.0 بيمنعUI البروتوتايب مفتوح؛ سؤال
Q7Reservations
والطابور
 03.23 وUI العقد، صفحة جوه مالوشReservations
contracts.view
Bookings منReservations يرد
). 05( لـFlow نضيف أو
 فتحReservations صلاحية
 03.23 بسUI
حجز Q8سياسة
موسم بيعدّي
عادية وليالي
الحجز على الوصول ليلة مصدرسياسة أي في محدد مش
الأشد البديل: كله.
الأحدث Q9"القيد
بآخر ولا بالإنشاء
تعديل؟
created" والتعديلcreated_atبالإنشاء 03.RSE1/RSE3)، بيعرضواOV updated" وLast
الأسبقية مابيغيرش
Q10Min nightsالـ
يوم على بيتحسب
أي ولا الوصول
ليلة؟
 الإقامة في ليلة أي على أدنى حد 03.Rأعلى واضحREF مش

---

**p. 157**

القرار المقترح لحد التعارضالتأكيد / #السؤالالمصدر
Q11: مينPaused
يرجّع؟ ومين يوقف
Paused · Blocked by Hoteliana · Leaves by: Hoteliana : REF 10.R
) OV pause" the الشاشاتlifts 03.18. 03.18B،OV 03.0J،UI
"Paused by supplier" :Supply ويرجّع يوقف المورد specبتخلي
 hold"و منفصلينDistribution
 منفصلتين (منPausedحالتين
Paused و يرجّعه) هو byالمورد،
Hoteliana ،Blocker(
 محتاجHoteliana ترفعه). بس
REF نص 10.Rتعديل
نصوص في Q12أخطاء
التصميم وأرقام
في (تتصلح
(Figma
"Deluxe City )1( Review  03.2 مفيهوشOV children" Extra · و4 560،
Ramadan · Deluxe) بينما720" Rooms 560" / ."660 موسم2( تفاصيل
REF 03.R) City 790" / الموسم890 صفحة بينما 800" / ."900 مثال3(
"Triple occupancy · extra bed" 240" + base · Ramadan وSeason
 والـ كاملة، أسعاره (الموسم غرفةTripleقديم نوع )4 night" 1 d في3-7
 وبعدها night"ملخص 1 days ."3-6 )5(  03.16SLTN مكتوبOV
)6( ."Outside 18 Feb - 09 Mar" Ramadan" for policy وCancellation
) 03.RSP6 OV Friday" every to الأربعApplies على الموسم7 صفحة
UI 03.19  )8( ."Add restriction for these dates" زرارهPOLICIESقسم
Shared pool · 50 / UI 03.3  )9( ."published v1.1" History" · وv1.3
"40 rooms / LIVE SUMMARY وnight" 40" of 17 tonight left والـRooms
"SLA in UI 03.1B .night" )10(  03.1K UI Policies" in set وSLA
"Publish from the rate calendar" OV 03.15B  (11) .Contract basics"
 مشSpecالـ بالقواعد بيمشي ده
 دي الـ10بالأرقام فيSLA):
On basics لعقدContract
 وفيRequest لعقدPolicies،
): Block .)BR-03-33( نفس11(
 أيDraftالـ من ينشر المشترك
مكان
صلاحية Q13مفتاح
والسياسات القيود
شغال عقد في
 rates.edit_draft 08.R+ ليهمREF مفتاح مفيهوش
 ماrates.publish لحد
مفتاح يتضاف
contracts.rules
لكل الدفع Q14شرط
Afterعقد
check-out / On
arrival / On
(booking
: من ويظهرHotelianaبيتحدد وDECISIONS، الحقلFinance مفيهوش التصميم عقد. لكل شرط
قسم في بس قراءة 1للمورد
Payment terms · After
check-out (monthly
statement(" (مقترح
Q15 sell للعقدStop
ولا فوري كله:
لحد محجوز
؟Publish
Stop 03.0D زرارهOV sale" غيرStop من وReview 03.3B2، بيعرضUI
 محجوزsell كتغيير ليلة
 فوري تشغيليLeverالشامل
Flow 04 sell منStop الليلة
Flow قرار 04حسب
الموسم Q16صفحة
ولا فاضية الجديد:
العقد؟ من متعبّية
بداية كنقطة العقد بأرقام الهيكلمتعبّية نفس الموسم إن مقابل فاضية" تبدأ الإنشاء "شاشة قاعدة
"إنشاءHintوعليها مش لأنها ،
 تأكيد محتاج عقد".
فيها الموسم Q17قيود
booking
window or a
cut-off"
"Add a minimum stay, a booking window or a بتقول الموسم cut-صفحة
 والـoff" فيهDrawer، nights وMin وCTA/CTD بس، 10.C فيهREF
BOOKING_WINDOW_CLOSED
cut-off window وBooking
. Laterللموسم لـ النص نغيرّ
Add a minimum stay or
closed check-in / check-out
days that apply only on
these dates."
لـ الأقصى Q18الحد
Overbooking
 المخزون)20%،10(min من بيقول unlimited"التصميم رقمnever غير من
(مقترح
Q19Scheduled →
 ولاTerminate
؟Delete
Delete والسجلTerminate اتنشر، (العقد 03.0A بيديUI لـTerminate الـScheduled بيقترحBaseline. كان
يفضل لازم

---

**p. 158**

