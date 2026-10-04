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

# Flow 04-W · Win list

list Win 04-W: (Flow قايمة )الفرص · Sub-ﬂow من
Flow 04
 المصادر  04.W وUI 04.W1 وUI 04.W0 وUI 04.WS وOV 04.WA وOV 04.WD فيOV 12 Flow ( و3719:*
Review of وملاحظة3735:* 12)، الـFlow عن list وWin DECISIONS، list( وWin module)، Supply 26( وSep 24-)،
.)W3 Sep 26 وW1( وW2
1 الهدف. والنطاق
ليه
).No account managers needed" Hoteliana أسعار يقترحوا موظفين غير من أكتر يبيع المورد عايزة
 ومعاها ده، المورد من ومحجزوش كتير عليها دوّروا الوكلاء اللي والتواريخ بالغرف أسبوعية قايمة بيبني ضمنالسيستم يدخّله اللي السعر
.3أرخص
(بيتعمل سطر يطبق بيقرر: Draftالمورد يتجاهله. أو الشبكة)، على  أبدًا. لوحده بيتغير سعر أي مفيش
النطاق: في
وضع و الأسبوعية، ask"القايمة I when وضعOnly و والإعدادات.Off، ،
كـ سطر اختياري.Draftتطبيق بسبب سطر وتجاهل ،
الأسبوعي. والإيميل تلقائيًا، السطور اختفاء
النطاق: برا
( منافسين أسعار أو منافسين، أسماء أو رقمي، نهائيًاترتيب ).ممنوع
).AI agents اقتراحات أو أوتوماتيك، stayتطبيق Min / Release / sale شغلStop (دي Agent الـNabd" ملف في
السوق تسعير الـMizanاقتراحات بعد ).MVP،
):Win list لأن (مقترح، 08.Rالصلاحيات للـREF مفتاح مالوش
. القايمة يشوف  rates.view +  منinventory.view قريب وده حجوزات، وأرقام طلب فيها (القايمة
 زرارbookings.view_counts مايشوفش الاتنين معندوش اللي اليوزر list".) خالص.Win
. rates.edit_draft  :Apply
. rates.edit_draft   والإعداداتDismiss
.)Flow 04 بعد :Applyالنشر  (منrates.publish
) فوقالنطاق: اللي الأرقام بس. اليوزر نطاق في اللي الفنادق سطور بتعرض القايمة hotels" 3 بس.your دي الفنادق على بتتحسب
الدخول: نقط
. 1 6"زرار · list هيدرWin في 04.1 مفتوحةUI لسه اللي الأسبوع سطور = (الرقم
. 2 الاتنين 06:00إيميل ← list" Win your "Open ←  04.W محتاجUI لو الدخول (بعد
. 3."Your Win list is ready · 6 lines" In-appإشعار

---

**p. 197**

  الداشبورد في .4.(مقترحكارت
. 5. مباشر /rates/win-listلينك
2 قواعد. البيزنس
 :BR-04W-01 القايمة المورد حساب مستوى فندقعلى = سطر كل عقد. لكل مش فنادقه)، (كل فيline
× (Fixed
 :BR-04W-02 بيبنيها السيستم اتنين مكة06:00كل بتوقيت  في الوكلاء بحث من أيام7آخر ده المورد من بحجز ماانتهاش اللي
"Built automatically from agent searches every Monday - no one at Hoteliana writes it."
 فيه:BR-04W-03 لو بس بيطلع السطر ≤ في50 بحث أيام7  والمورد دي، والتواريخ الغرفة على أرخصمش ضمن ده3 للبحث
: :BR-04W-04 الأسبوع.10أقصى في سطور  الترتيب التاريخ(مقترح) في الأقرب وبعده الأول، الأعلى الطلب
≤ High :BR-04W-05 بيتعرض الطلب بس :شرائح demand" أوHigh demand" البحثMedium رقم مش W3، :(مقترح).
.149 و150 بحث، منMedium لـ50
 :BR-04W-06 بيتعرض الموقع بس :شريحة 3" أوTop 5" أوTop 5" top in Not سعرممنوع. أو منافس، اسم أو الرقمي، الترتيب
).Not in top 5 أول في المورد لو مابيطلعش السطر إن (بما هي3منافس. عمليًا هتظهر اللي الشرايح 5، وTop
 المستهدف:BR-04W-07 السعر less" or أرخص540 ضمن المورد يدخّل سعر أعلى = 3) لكلVATشامل، السعر أساس وعلى
.)Everyoneالجنسيات
:BR-04W-08 الـ تحت ينزل مستحيل priceالهدف selling المورد.minimum بتاع الـ يدخّله اللي السعر لو 3 الحد، من أقل السطر
خالص .مابيطلعش
:BR-04W-09 outتواريخ Sold أبدًا مابتتقترحش  W2( مابتتقترحش وكمان الليالي(مقترح)). sale: وStop ،HOTELIANA_PAUSED،
فاتت اللي والليالي مابدأش، لسه اللي والعقد
 BR-04W-10 لما:·
 عليه أيام7يعدّي
.Draft الشبكة من أو هنا من سواء أقل، أو للهدف يوصل المورد سعر W1أو (مقترح)). عند بيتحسب الـالنشر: عند مش
دي. التواريخ على تخلص الغرفة أو
 :BR-04W-11 بيعملApply" بسDraft ينشر. المورد ما لحد بيشوفه وماحدش الشبكة، على
"Prices here are the price for everyone; in a season with nationality prices, those الجنسيات:BR-04W-12 أسعار
 rules." own their by it with move الـgroups يعني بتفضلFixed
"Only when BR-04W-13 · week" (افتراضي،Every email" by and portal the in 06:00 at Monday أوOn I)،
"It only changes what .)"No list, no emails"( ask" own"( its on sent is nothing - button list“ my ”Get أوA "Off")،
own." their on change never prices your - you send we (مقترح) الإعداد الحساب: مستوى .على
"We keep counting searches, so it is ready the moment you وضع:BR-04W-14 في Off السيستم البحث، يعد :بيفضل
turn it on."
.)"It takes a few seconds" BR-04W-15 · now" list my وضعGet في ask I when آخرOnly من فورًا القايمة بيبني أيام7:
"Built today at 10:14 · you can ask كل(مقترح) واحدة مرة ومعاها24: القايمة نفس بيفتح اليوم نفس في التاني الضغط ساعة.
again tomorrow."
BR-04W-16 اختياري:Dismiss· السبب ده. الأسبوع قايمة من السطر بيشيل floor" my at already is أوPrice "Rooms،
: elsewhere" sold أوare dates"، these for interested أوNot Other"، (نص). الغرفة(مقترح) نفس
 من أكتر اتغير الهدف لو إلا الجاية، القوايم في تاني .%5مابترجعش

---

**p. 198**

 KPIs · فوقBR-04W-17
 hotels" 3 your · days 7 last · 640 · BOOKING YOUR WITHOUT حجزDEMAND غير من البحث (إجمالي
."LINES THIS WEEK · 6 · sent Mon 28 Sep, 06:00"
."LAST LIST · 2 of 5 applied · + 5 bookings since"
: الإجماليملاحظة: البحث رقم 640 شرايح. السطور بينما كرقم، هنا بيظهر نفسه(مقترح)) المورد حساب إجمالي لأنه رقم يفضل
السوق. بيكشف ومش
 عمود:BR-04W-18 كمانDEMAND" فيه bookings" your of نفسه.2 المورد رقم ده دي). والتواريخ الغرفة على المورد (حجوزات
"The Win list starts: :BR-04W-19 القايمة عقد مالوش المورد لو حاجة أي أوActiveمابتعرضش Scheduled رسالة(مقترح).
once you have a live contract."
)Happy path( 3 الفلو. الأساسي
 .1 مكة06:00الاتنين
Win list ·). القايمةالسيستم: يبني إشعارBR-04W-02..09 يبعت الصلاحياتIn-app). عندهم للي إيميل + الرقم9 يحدّث
.6"
 .2الدخول
 يضغطيعمل: 6" · list فيWin 04.1 الإيميل).UI لينك (أو
Back to يروح  04.W UI : Monday" every · Weekly · list Win · AVAILABILITY & وRATES والوصف، وSettings"
TO BE IN THE 3 CHEAPEST | YOUR POSITION | DEMAND | DATES | HOTEL · والـrates" والجدولKPIs، ROOM،
."Built | Dismiss / وApply الاختفاء، قواعد تحت: بالفندق. متجمع automatically…"،
 .3.Apply
."Al Noor Makkah Hotel · Standard Room · Room only · 12-20 Oct · 540 or less" يضغطيعمل: علىApply"
AL NOOR MAKKAH HOTEL · STANDARD ROOM · 12-20 OCT · Apply 540 SAR as a draft? · : OV 04.WA  يروح
We add it to your rate calendar as a draft. Nothing changes for agents until you review and publish.
"Now · 610 SAR · weekday · rules." their by price new the follow season the in prices والمقارنةNationality
 only" وRoom Oct"، 12-20 on SAR 540 · وDraft respected"، · SAR 500 · minimum الأزرارYour وCancel".
."Create draft"
 .4.Create draft
."Create draft" يضغطيعمل:
Draft. السيستم: من يتأكد الهدفrates.edit_draft إن التحقق يعيد
دي التواريخ على دي الغرفة بيبيع اللي العقد منطقQ-04W-01على بنفس prices) يسجّلChange list. Win = ،source
.Draft created"). id بيتعلمline السطر
"N changes not published · يروح  04.1 والشهرUI العقد على 2026 عليهاOctober والليالي والهيدرDraft)، Review،
Win list: 540 on Standard Room · 12-20 Oct saved as a draft. Nothing is live until you وpublish" :Toast،
publish."
 .5النشر
publish & فيReview 04 (خطواتFlow في9-7 السطر 04.7). جنبهOV مكتوب list" Win From .(مقترح)

---

**p. 199**

 النشر .6بعد
 القايمةالسيستم: من بيختفي السطر ← للهدف وصل السعر وBR-04W-10 KPI)، LIST" بيعدّهLAST الجاي الأسبوع
.applied"
4 الفلوهات. البديلة
"Dismiss this line? · It disappears from this week’s list. Telling us why is : OV 04.WD  ← "Dismiss" .A1: Dismiss
"Line :Toast ."Win list · 5" ← lines." better send us helps and الأسبابoptional + العدّادDismiss" يختفي. السطر
 ← dismissed." + "Undo" 10( ثواني، .)مقترح حاجةCancel" ولا
:A2 أقصى.Other" (اختياري، نص حقل يظهر 200 حرف .)(مقترح
Settings .A3: "Settings" ←  04.WS يختارOV ← حالتهDone" بيفتح اختيار كل week. Every ←  04.W وUI Only،
. UI 04.W0  ← ask I when ←  04.W1 وUI Off،
"No list yet · You asked for the Win list only when ask I when Only .A4:  04.W1 UI : Badge request" وOn you،
 searches." of days 7 last the uses and seconds few a takes It it. need + now" list my "Get ← الكارتLoading جوه
list…" your "Building ←  04.W الفاضيةUI الحالة أو بالسطور، A7 ده). الوضع في إيميل مفيش
"The Win list is off · You switched the Win list off on 14 Sep. We Off .A5:  04.W0 UI : Badge وOff" keep،
on." it turn you moment the ready is it so searches, counting + on" it بيرجعTurn ← week Every وبيبني(مقترح) ،
 آخر من فورًا في7القايمة الهيدر زرار الاتنين. يستنى ما بدل أيام 04.1 بيبقىUI list" رقمWin غير من
3 of these nights already have an Apply وفيهA6: اللياليDraft نفس على قديم   04.WA سطرOV بيضيف
."Create draft" ← unpublished change (560). Creating this draft replaces it."
"Back + "Nothing to suggest this week · Your prices are competitive where agents search." : سطرA7 ولا مفيش
 rates" والـto ظاهرةKPIs. بتفضل
) لعقدA8 سطر price: الـ.Fixed بيعرض السطر line View"( City · Breakfast & Bed · Room الـStandard كامل. سعر والهدف
 بيعملApply للـOverride بسline دي
"Weekdays )7 nights( · 610 إند.A9 وويك داي ويك فيها الفترة شوف: الاقتراحQ-04W-02 04.WA. السطرينOV بيعرض
"2 nights are already at or. و540" 540" → 710 · nights( )2 أصلاًWeekend سعرها ليلة أي ولو
below 540 and stay as they are."
"Pakistan keeps its ﬁxed season price )790(." : OV 04.WA مجموعاتA10 فيه موسم جوه الفترة في.Fixed: إضافي سطر
5 الاستثناءات. والأخطاء
"Your price is اتبنت.E1 القايمة ما ساعة من اتغير السعر فتح: عند 04.WA لوNow"،OV جديد. من بيتقري
apply." to Nothing target. the below or at - 530 والزرارalready بيختفيClose" والسطر ،
"This target is now below your minimum selling price )560(, so it can’t be : الهدفE2 من أعلى وبقى اتغير الأدنى الحد
applied." + line" مقفولDismiss والزرار ،
 التواريخE3 out: أوSold sale القايمةStop ساعة من فاتت أو  sale." for open longer no are dates بيختفيThese والسطر
التحميل إعادة عند
The contract for these dates has ended." ← Ended/Terminated .Paused بقىE4 العقد أوEnded: أوTerminated
"Hoteliana paused this contract - the new price sells once the .)Apply(مفيش Paused ← سطرApply ومعاه مسموح،
pause is lifted."

---

**p. 200**

"Only someone who can change مالوشE5 زرارين.rates.edit_draft: وApply والسطرDismiss مرسومين، مش
prices can apply these lines."
"We couldn’t build your list. Try again in a few  :E6 now" list my Get من أكتر أخد أو فشل (مقترح30 ثانية
."Try again" + minutes."
."Try again" + "We couldn’t create the draft. Nothing changed." : OV 04.WA فشلE7 draft: .Create جوهBanner
 بيفضلPopupالـ
This line was already applied by Sara M. at 09:12 - see the عملواE8 يوزرين السطر.Apply: نفس على بيشوف التاني
."Open rates" + draft in Rates & Availability."
. REF 11.R) الإيميلE9 الإشعار.Bounced: جنب بيظهر failed حسبDelivery
 الساعةE10 اتأخر.06:00: والبناء تخلص القايمة لما بيتبعتوا والإيميل الإشعار 06:00" Sep, 28 Mon الحقيقيsent الوقت بيكتب
 لحد(مقترح) مااتبنتش لو بيتسجل12:00: ده الأسبوع week"، this list إيميلNo غير ومن
6 حالات. مش موجودة في التصميم
أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
1"Get my list بعدLoading
now"
. 04.W1 لـSkeletonUI سطور3 list…" your مقفولBuilding الزرار
2 سطور weekمفيش أوEvery
(Get my list
"Nothing to suggest this week. Your prices are competitive where
."Back to rates" + agents search."
UI 04.W
3 من (أقل جديد أيام7الحساب
بحث)
Your ﬁrst list comes on Monday once there is a week of searches."UI 04.W1
04.W0 BR-04W-19UI + contracts" عقد.Open ولا 4Liveمالوش
5 اتعمله ولسهApplyسطر
مانتشرش
Review & + )Neutral( "Draft created" ومعاه ظاهر بيفضل Badgeالسطر
 ›" وزرارpublish بيتشال.Apply،
UI 04.W
04.W KPIبيختفيUI LIST" الجاي.LAST الأسبوع بيعدّه للهدف ووصل اتنشر 6سطر
7 لها اتعمل السطور أوApplyكل
Dismiss
"Back to + "You’re done for this week · 4 applied · 2 dismissed."
.rates"
UI 04.W
8Dismiss 04.WD بيتسجلOV سبب ومفيش مكانه، بيرجع بعدUndoالسطر
9Create draft 04.1W الشبكةToastمنUI فيUndo 04 بيرجعFlow والسطر تانيApply")، بعدUndo
من أقل فنادق شايف 10يوزر
الحساب
.your 2 hotels" 04.W والـUI وKPIsالسطور بس، فنادقه على
11 من الإعداد weekتغيير لـEvery
 ask I when الأحدOnly يوم
04.WS تعدّيOV ما لحد ظاهرة بتفضل الحالية القايمة مابيتبعتش. الاتنين 7إيميل أيام .(مقترح
 عقد من أكتر في غرفة على 12سطر
 التواريخActive لنفس
"Makkah Annual Block · now 610" :)Radio 04.WA العقدOV اختيار فيه
590"و now · Block Rooms Makkah حاليًا الأرخص العقد الافتراضي: .(مقترح.
OV 04.WA
04.W الهدف).UI تحت يفضل (عشان ريال لأقرب لتحت صحيحبيتقرّب مش رقم 13الهدف
04.W العقد.UI بعملة والهدف مشالسطر العقد 14SARعملة

---

**p. 201**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
15 list عقدWin وقت الهيدر في
Ended
.)72# 6§ Flow 04.1E ظاهرUI 04مش
04.W UI كارت) = (سطر كروت بيتحول 16الموبايل.(مقترح)الجدول
)State machine( 7 الحالات.
:Win الـ listسطر
مينBadge / منإلىالسبب
عادي) (السطر (البناء— —Openالسيستم
OpenDraft createdCreate Neutral created" draftالموردDraft
Draft للـUndo— فيDraft مسحه أو createdOpenReview،
Draft والسعر(بيختفي) createdWonنشر،
واتنشر(بيختفي) الشبكة من للهدف وصل OpenWonالسعر
Open / Draft createdDismissedDismissالمورد(بيختفي)
Open / Draft createdExpired أيام7السيستم(بيختفي)
Open / Draft outالسيستم(بيختفي) أوSold sale، انتهىStop العقد أو createdRemoved،
Weekly · every Monday" الـ listإعداد الحسابWin (على  week Every ⇄ ask I when Only ⇄ الـOff الهيدرBadge. في
).Neutral( وInfo( request")، "On وNeutral( "Off")،
 الشرايحBadges
Warning = demand وHigh Neutral، = demand Medium .(مقترح
Info = 5 وTop Neutral، = 5 top in Not .(مقترح
 ديDangerمفيش الشاشة في
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Win list setting
( OV 04.WS )
✓Every week / Only when I ask / Off—
 Contract واحد، من أكتر (لو
مقترح
✓ أوActiveعقد أوScheduled الغرفةPaused بيغطي
والتواريخ
Pick the contract to change"
Dismiss حاجة— ولا أو واحد reason✗اختيار
Other 200 under it 200أقصىKeep حرف text✗(مقترح
characters"

---

**p. 202**

9 الإشعارات. والإيميلات والسجل
مينالقناةRequires الحدثيستلم
؟action
جاهزة الأسبوعية القايمة
(Every week)
inventory.view  + عندهم rates.edit_draftاللي
القايمة في الأقل على واحد فندق على
 Email + (الاتنينIn-app
(06:00
 مهمة✗ مش (فرصة
إجبارية
Get my list now"
خلص
سابIn-app (لو طلبه اللي
الصفحة
✗
الأسبوع في سطور مفيش
ده
إيميل مفيش —،(مقترح)
ده بتقول والشاشة
—
(مقترح): الإيميل
.Your Win list · 6 chances this week" :Subjectالـ
.Open your Win أول و3الجسم: والتواريخ، والغرفة، (الفندق، سطور less" or وزرار540 list")،
 ترتيب.مفيش رقم ومفيش منافسين، أسعار أو أسماء
السجل:
winlist.built السطور).system( عدد ،
.)Draft 610 → winlist.draft_created الـsupplier_user( والـline، 540،
winlist.dismissed الـsupplier_user( والسببline، ،
.)Every week → winlist.setting_changed Off،supplier_user(
.)expired / target reached / sold winlist.line_removed والسببsystem( out،
10 معايير. القبول
 .1 الإعدادGiven week الساعةWhen،Every الاتنين،06:00 يوم مكة آخرThen من تتبني القايمة والهيدر7 وإيميل، إشعار ويتبعت أيام،
."Win list · N" 04.1في يبقىUI
. 2 عليهاGiven وتواريخ غرفة حجز،49 غير من بحث تتبني،When القايمة مايطلعشThen السطر
 .3 Given مؤهلين،14 سطر تتبني،When القايمة تظهرThen بس10
 .4 أرخصGiven ضمن المورد يدخّل اللي السعر هو3 الأدنى480 والحد تتبني،When،500 القايمة مايطلعشThen السطر
 .5 تواريخGiven out تتبني،When،Sold القايمة عليهاThen سطر مفيش
 سطر،Given أي يتعرض،When شريحةThen الموقع 5 top in Not / 5 Top / 3 شريحةTop والطلب Medium) / .6)،High
.API الـ أو الإيميل أو الشاشة في ترتيب رقم أو منافس سعر أو اسم أي responseومفيش
. 7 سطرGiven على540 20-12 يضغطWhen،Oct ثمApply draft" يتعملThen،Create يفضلDraft والوكيل الشبكة، على
.Draft لـ يروح واليوزر النشر، لحد القديم السعر 04.1يشوف UI متعلّمة والليالي أكتوبر على
. 8 Given منDraft list بقىWin والسعر اتنشر القايمة،When يفتح موجودThen مش السطر
 .9 ونشر،Given الشبكة من للهدف السعر نزّل المورد القايمة،When يفتح اختفىThen السطر
 .10 عليهGiven عدّى سطر أيام،7 القايمة،When يفتح موجودThen مش السطر
 .11.1 Given بسببDismiss elsewhere" sold are When،Rooms يأكد، ينزلThen والعدّاد يتسجل، والسبب يختفي، السطر
 .12 Given سبب،Dismiss غير من When يأكد، عاديThen ينجح

---

**p. 203**

 .13"Get my list الإعدادGiven ask I when الاتنين،When،Only ييجي والشاشةThen قايمة، ولا إيميل مفيش 04.W1 فيهاUI
.now"
 .14"Nothing Given ask I when يضغطWhen،Only now" list my آخرThen،Get من تتبني القايمة تظهر7 أو ثواني، في وتظهر أيام
.to suggest this week…"
 الإعدادGiven الـWhen،Off يفتح list Then،Win  04.W0 وUI القفل بتاريخ on" it فيTurn بيتعد والبحث إيميلات، ومفيش .15،
الخلفية
. 16 Given يضغطWhen،Off on" it آخرThen،Turn من فورًا تتبني القايمة الاتنين7 ومايستناش أيام
 .17.Settings معندوشGiven يوزر القايمة،When،rates.edit_draft يفتح أزرارThen مفيش وApply وDismiss
 .18"Your price is already … Nothing to Given بقىNow" يفتحWhen،Apply 04.WA يظهرThen،OV
 ومفيشapply." بيتعملDraft
 .19 فيهGiven موسم GCC − و40 Fixed يتعملWhen،Pakistan ويتنشرApply Then،540 يبقىGCC و500 يفضلPakistan،
الثابت بسعره
. 20.source = Win list تطبيق،Given أي يخلص،When سعرThen أي مفيش فيهLive السجل وسطر نشر، غير من اتغير
11 أسئلة. مفتوحة
:Q-04W-01 عقد من أكتر في الغرفة لو الـActive التواريخ، نفس على فيDraft اختيار (مقترح: عقد؟ أنهي على يتعمل 04.WA ،OV
الأرخص والافتراضي
 الفترة:Q-04W-02 لكل واحد الهدف less" or على540 20-12 فيهاOct اللي 15 وThu 16 الـFri هل يحطApply). على540
  ليلة؟ نوع لكل يتحسب الهدف ولا داي)؟ الويك من أكتر ينزّلها (وده كمان إند الويك سعرهاالاقتراح:ليالي ليلة وأي ليلة، نوع لكل الهدف
أصلاً
 للـ:Q-04W-03 مفتاح مفيش الصلاحيات: list فيWin 08.R نضيفREF هل بالاقتراحrates.winlist. نمشي ولا
( rates.view +  وinventory.view للعرض، للـrates.edit_draft )؟Apply
 النص:Q-04W-04 يوزر؟ لكل ولا الحساب مستوى على الإعداد you" send we what changes only يوزر،It لكل إنه بيوحي
."You switched the Win list off on 14 Sep" بتقولOffوشاشة
.)On request( "Only when I الـ:Q-04W-05 فاهمbaseline كان 04.W1 "عقدUI إنها Request On إنها الصح ask"وضع".
Sold out لعقود مختلفة حالة فيه Requestهل عقودOn الاقتراح: مخزون)؟ مفيهاش (اللي Request والـOn عادي، القايمة بتدخل
فيها. معنى مالوش
 رقم:Q-04W-06 640" · BOOKING YOUR WITHOUT قرارDEMAND بينما حقيقي، بحث رقم شرايح.W3 تبقى الأرقام بيقول
مسموح؟ الإجمالي هل
 :Q-04W-07 3" أولTop في المورد لو مابيطلعش السطر بس القاعدة، في موجودة شريحة حالة3 فيه هل 3. Top يبقى لما (مثلاً تظهر
 3 الفترة)؟Top من جزء على
.500 / 400 :Q-04W-08  04.W بيقولUI weekday" · SAR 610 لـNow Room Standard (سبتمبر الشبكة بينما أكتوبر، في
 التصميم في أكتوبر في موسم (مفيش تاني؟ سعر فيه أكتوبر ولا بس؟ مثال بيانات

---

**p. 204**

