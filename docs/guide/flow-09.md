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

# Flow 09 · Dashboard

Dashboard 09: (Flow )الداشبورد
المصادر Section  523:3215 ( 09.0 09.1–09.6،09.1A–E،09.1،UI وOV 09.R)، REF ( وشاشات1361:44 )،
there is no disputed ﬁgure. The في الجديدة 12المالية Flow ( 07.20 UI وحالاتها). محسوم تعارض  09.R بيقولREF
Flow 12 + dispute no has وكارتportal بيقولMoney" cycle payment no is There ده الكلام الجديدةاتلغى". بالمالية
Flow 12 )BR-09-20 → وDECISIONS دفع، ومواعيد شهري، كشف فيه علىDispute): بيتبني الداشبورد الكشف. في سطر على
.BR-09-24)
1 الهدف. والنطاق
موجود: ده الفلو ليه شخص لكل تقول إنها شغلها الدخول. بعد صفحة أول دي  اتساب لو أكتر يكلّف اللي بالترتيب دلوقتي، محتاجه اللي ،إيه
:  الداشبورد والفريق. والفلوس البيع حالة وبعدها مابيعدّش بس، ومتفلترة.بيقرا للصفحة بتودّي ضغطة وكل بتاعه، الموديول من جاي رقم كل
النطاق ):MVPجوه
you" needs المفاتيحWhat حسب تركيبات بخمس وOwner/Admin" manager، وRevenue وReservations، ،Finance،
ofﬁceو Front ( 09.1 مفاتيحه09.1A–D،UI من بيتركب مخصص دور وأي )،
(.UI 09.1E ) "Nothing needs you"
Today at the desk" )Frontكروت
.ofﬁce)
 09.1 OV 09.3، ،OV 09.2 ،OV
. OV 09.4  Something moved
.Chart Analytics ( 09.0 معUI 09.5) وOV والمقارنة الفترة 09.6 الـOV ورا الأرقام
النطاق برا
 نفسه الداشبورد جوه أكشن Publishأي بتاعته. للصفحة بيودّي زرار كل مفيش.)…): مقترح: (استثناء
الـ في مش ← المستخدم من ترتيبها أو الكروت .MVPتخصيص
 04( )Flow list منWin جزء مش you: needs What التزام.(مقترح)" مش اقتراحات لأنها
.MVP) ← السوق/المنافسين الـMizanتحليلات بعد
 والمفاتيح: بيستخدمه مستخدممين كل Active الداشبورد. بيشوف نفسه للداشبورد مفتاح وكلمفيش كارت كل شوفItem؛ مفتاح ليه
المصادر جدول من عمل ).BR-09-05ومفتاح
الدخول: نقط
. 1.Deep link ← الـ 01(بعد )Flow Sign-in من جاي لو إلا دايمًا، الداشبورد
. الـDashboardتاب في bar" واللوجوtop 2،
. 3."Open the dashboard 11.0 زرارOV
 .4."Go to my dashboard" OV 11.6 UI dashboard" to وBack 11.15"،
 .5" ← analytics" the "Show ←  09.0 وUI today؛ you needs what to يرجعBack
 .6."Show the analytics" UI 11.17 UI analytics" the وShow 11.18"،

---

**p. 314**

 link :Deep  dashboard/analytics?period=&compare=&hotels=،dashboard .7.(مقترح
2 قواعد. البيزنس
المبدأ
 BR-09-01 الداشبورد ولاqueriesمالوش حالةthresholds نسخة ولا الـ بيسأل بتاعته. الـservice (نفس رقم كل بتاع الليquery
النتيجة ويعرض بتستخدمها) ورا الصفحة
 BR-09-02 ← صفحته عن مختلف الداشبورد في رقم لو الصح هي والاختلافالصفحة "تصليح"Bug، ممنوع قديمة. قراءة أو المصدر في
الداشبورد على
BR-09-03 رقم كل عليه ومتفلترة صفحته الـبيفتح نفس الليالي، (نفس فلترblocker غير من لستة بيفتح رقم الحالة). نفس .Bug،
Bug عددBR-09-04 you needs تابWhat عدد = you" الـNeeds = الإشعارات في اختلافbadge" أي الجرس. على
.( REF 11.R )
والموديولات الداشبورد بين (العقد المصادر جدول
BR-09-05
الـبيفتح الليالمصدرQuery بيقوله
On Request"
bookings
need an
"answer
Bookingsstatus = pending_supplier_responseBookings ·
needs an
answer
cancellation"
needs you to
conﬁrm the
"charge
Change requeststype = cancellation · state = awaiting_chargeChange
requests ·
cancellations
amendments"
need your
"decision
Change requeststype = amendment · state = awaiting_supplierChange
requests ·
amendments
rooms"
cannot be
"sold at all
Sellability engineblockers.length > 0 · next 14 nights مفلترCalendar
والـ الليالي على
blocker
nights you"
stopped
"yourself
Inventorystop_sale = true · set_by = supplierRestrictions
lens
nights"
"running low
Inventoryfree_rooms <= low_thresholdNight grid
nights sold"
"out
Inventoryfree_rooms = 0Sold lens
rate changes"
are not
"published
Rate servicepublish batches · status = heldChanges
waiting to
publish

---

**p. 315**

الـبيفتح الليالمصدرQuery بيقوله
statement to"
" (جديد،review
(Flow 12
Financestatement.status = open_for_reviewUI 07.23
tax invoice"
"missing
(جديد
Financestatement.paid = true · tax_invoice = missingOV 07.37
dispute"
"answered
(جديد
Financedispute.state in (agreed, rejected) · unseenUI 07.23E/F
a payment"
"came back
(جديد
Financepayment.state = returnedUI 07.32R
you owe"
"Hoteliana
(جديد
Financebalance < 0/ UI 07.20N
OV 07.38
payments to"
you are
"paused
(جديد
Financepayment_hold = trueUI 07.20H
entry posted"
against your
"account
Financemovement.type = deduction · posted after last visitAdjustments
UI 07.33
Hoteliana"
needs
information"
(Flow 10)
Content/Correctioncorrection.state in (required, rejected)UI 10.9
report on a"
booking issue
waiting on
you" (Flow
10/11)
Casescase.status = waiting_on_supplierCase detail
UI 11.25
room is"
waiting on
"Hoteliana
Requestsrequest.state = waiting_hotelianaRequest detail
a contract"
ends in N
days" (Flow
10)
Contractsend_date - today <= warning_windowUI 10.0
Upcoming /"
Next payment
/ Due to you /
"You owe
FinanceUI 07.20 07.20زيUI

---

**p. 316**

الـبيفتح الليالمصدرQuery بيقوله
Who has"
something
"pending
perكل
user
الشخص الـطابور الشخصqueriesنفس على ،
Today at the"
"hotels
Bookings/ departure_date = today  / arrival_date = today
in-house
OV 09.1
)Tiersالترتيب
 BR-09-06 الترتيب بيتكتب مش الـبيتحسب بس: مدخلين الـtier: الانتظار. وعمر الـtier نفس جوه الأول يطلع والأقدم الأول، يكسب
.)SAR 3,540 Tier tier. بيعدّي ما عمره تانيtier عدّاد (ساعة بـ18 فلوس سؤال تغلب دقيقة
:tiers 6 الـBR-09-07
Tierالمعنىأمثلة
متعلّقQuote بسعر)،amendment فيهReport حجز على response بيخلصSupplier 1عدّاد
آخرdue في كشف 24"، التلقائي القبول قبل ساعة (مقترح
تتسعّر،Cancellation معلوماتHoteliana محتاجة ردكcorrection مستني 2حد
(required/rejected
yourself stopped you بتتباعNights مش 3حاجة
review to آخرStatement (قبل ساعة)،24 owe 4فلوسYou
Entry posted against you
5 published not changes بتوعكDraftsRate
مستنية وحاجات 6إعدادات
Hoteliana
Contract ending
 BR-09-08 منالعمر بيتحسب ومنdue_at الأول)، للانتهاء (الأقرب عدّاد عنده للي created_at / ومنasked_at مستني، للي
.drafts ومنposted_at للفلوس، للـheld_since
كلBR-09-09 الـItem بيقول لايفdeadline عدّاد مالوش: إنه أو بتاعه ⏱ 18 11:00 today expires · left أوmin waiting")،
02m أو1h 13"، 11:20 أوSep 11:04"، today since أوheld meanwhile"، sells nothing but deadline, no ممنوع".
مزيّف استعجال
 منBR-09-10 بيتحسب العدّاد السيرفرdue_at بتاعة الساعة ومن السيرفر، من جاي اللي مشoffset التحميل) عند بيتحسب
الجهاز ساعة
)Severityالخطورة
4 BR-09-11 واللون مستويات، الموديول حسب مش الخطورة :حسب
Severityاللونأمثلة
Problemdangerpayment came back Request بتتباع،On مش غرف هيخلص،
Needs an
answer
warningnights you
statement to review

---

**p. 317**

Severityاللونأمثلة
warning، فاتحة) (نسخة Watch(مقترح
tax invoice missing
InformationWaiting for Hoteliana" حاجةneutral وأي =؛
REF 00.S حسبinfo (أزرق)
payments paused
.)"this one is good out Sold مشكلةBR-09-12 مش معلومة news،
 مقفولvsمخفي
 الكارت/الـBR-09-13 ← الشوف مفتاح مالوش Item موجود.مايترسمش إنه تلميح أي ومفيش
Waiting for someone الـBR-09-14 ← العمل ومش الشوف عنده يقدرItem بمين سطر ومكانه يتشال والزرار حقيقي، الرقم يظهر،
 rates publish have not do you · publish can "who ( 09.1B UI ممنوعDisabledزرار). شرح غير من
الـBR-09-15 Item يعمله مايقدرش المشاهد اللي عددبيتحسب في you need things Six بيفرّق" والعنوان بيتحسب، (مقترح:
Locked information" your for is more one · you need things الـ")Three الليItems. بتاعتهاSeverity أوInformation
."for your في informationبتتعد
داشبوردات الخمس
الـBR-09-16 نفس الدور):layout اسم حسب (مش المفاتيح حسب مختلفة كروت ،
.Today at the hotels" chip حاجة:Owner/Admin كل
 Supply manager: Revenue ضيوف، أسماء غير من أرقام وتسعير، غير من مقفول؛Bookings/Money زرار ورا مخفيين (مش
موجودين مش
. إجابة:Reservations محتاج اللي Supply + hotels" the at "Today + )Locked( rates عندهunpublished
 وrates.view فبيشوفinventory.view sold، be cannot كمانrooms التصميمLocked" الشيل). مفتاح مالوش لو
.)12# 11 09.1B غلطUI ده الكارت؛ من شايله
 Money بالكاملFinance: الفلوسitems
 desk the at "Today ofﬁce: أساسيFront كارت desk" your on Also مالوش".  ولاinventory.view
.)11 كارتrates.view ← Supply (التصميممايترسمش 09.1D شوفUI غلط، ده راسمه؛
الـ:Auditor نفس Items الشوف، مفاتيح حسب الأزرار بسطرLockedكل }action{ can }who{ · only وعنوانRead "،
teamالقايمة your on waiting is What .(مقترح"
 مخصص: القواعد.دور بنفس مفاتيحه من بيتركب
": shell empty an gets "Nobody خالص.BR-09-17 مايترسمش مخفية عناصره كل كارت
)Freshnessالحداثة
 triggers 3 للتحديث:BR-09-18 بس
 .1.focus ) visibilitychange  → للـ يرجع التاب visible(لما
.  للداشبورد (ويرجع يعمله المستخدم أكشن أي 2بعد
. 3 Poll دقيقة الشاشةكل على عدّاد أي فيه ما طول
" itself" refreshes page the · HH:MM updated تحديثLast كل مع بيتحدث

---

**p. 318**

Something" OV 09.4: BR-09-19 رقم لو شايفه (منالمستخدم إيده تحت اتغير أوpoll focus ← صمت) في يظهرمايتغيرش
here were you while moved عادي. بتتحدث تحميل) أول (أو ظاهرة ماكانتش اللي الأرقام التغييرات. بلستة الـ" Items(مقترح:
اللي 1الجديدة معTier فورًا بتظهر بيكلّفhighlight تأخيرها لأن ،
 12الفلوس يكسب)Flow
YOU" كارتBR-09-20 علىMoney بيتبني 07.20" UI : PAYMENT" مصدره)،NEXT + تاريخ + (مبلغ
"no date promised…" REVIEW TO الجملSTATEMENT cycle". payment no is وThere
.بتتشال
Disputed lines · }n{ · }amount{ SAR waiting for" :)"One deliberate absence الـBR-09-21 سطر (بدلDisputes
. )info( لوHoteliana" بس بيظهر 0. > عليهاn المتنازع السطور على مفلتر الكشف بيفتح
" الـBR-09-22 Dispute سطر على الكشف باقي مابيوقفش بيعرضDECISIONS( والداشبورد PAYMENT)، الليNEXT بالمبلغ
  ما زي فعلاً بيحسبهFinanceهيتدفع
Dispute it on the }Month{ statement before }5" الـBR-09-23 account your against posted "entry بيقولItem
وOct{ المراجعة، في لسه الكشف لو question(" Finance category )Case it" about Hoteliana Ask اتقبل الكشف لو .(مقترح
" wrongالجملة looks number the if Hoteliana بتتشالcall
invoice Tax كـBR-09-24 بيظهر فيWatch: 4 معTier )DECISIONS( it" for held never are ومابيبقاشPayments ،
 Problem أبدًا
Supply
nights 14 next the supply, "Your لـBR-09-25 مكة) (بتوقيت النهارده من يوم13": 4 أرقام: ،
 low running الافتراضيlow_threshold،Watch( المخزون، إعدادات من غرف4
.sold out التصميم 4(مقترح؛ left fewer or )Information()،")rooms
 وBR-09-26 الكارت بين الأسماء sold be cannot والـWhy والتقويم API" الـ codesنفس البيعblocker محرك من
). ( 10.C سببREF مابيحسبش الداشبورد
Today at the hotels
 بيعرضBR-09-27 request on arriving ". أبدًا تكلفة ولا أسعار الـمفيش في
.)"Guest · عندهDrawer لمن بس الضيوف أسماء الغرفةguest.pii. ونوع المرجع يشوف مالوش اللي HTL-88198؛
 it for room a hold not do - yet conﬁrmed not is request on arrival "An الحجزBR-09-28 Request": بـOn بيظهر
."not conﬁrmed )warning( Request" "On وسطرBadge
Analytics
Analytics BR-09-29 الأرقام الحساب). (مابتعيدش الموديولات نفس بتقرا المورد شاملةتكلفة ولاVAT الوكيل بيع سعر مفيش ؛
.markup
 كلهاBR-09-30 للصفحة واحدة فنادق واحدة، مقارنة واحدة، فترة بعض: مع بتتحرك الأرقام كل 09.5 مفيشOV بفترةChart).
لوحده
" الافتراضيةBR-09-31 الفترة months 12 الافتراضيةLast والمقارنة year" last period same رمضان).The (عشان
فيBR-09-32 الفلوس أرقام out"( and in بتحتاجMoney الـfinance.view ؛
 manager والـRevenue والسعر الحجم بيشوف blockers خالص فلوس غير والـمن (التايلز مابتترسمشCharts دي
What happened" RATE AVERAGE "YOUR بيحتاجBR-09-33 rates.view" . CLOCK" THE BEFORE وANSWERED
. bookings.view_counts" request every بيحتاجواto

---

**p. 319**

 يشوفBR-09-34 مين analytics the عندهShow حد أي أوrates.view": finance.view .(مقترح ofﬁce مالوشFront
← مايترسمش الرابط
 كلBR-09-35 وراChart جدول ليه 09.6 مشOV والجدول الـfallback)، جزء ده CSV؛ Export للجدول،accessibility.
.)CSV" numbersو the كلهاExport للصفحة
".BR-09-36 "Volume and rate are two charts on purpose - never one with two scales
 الـBR-09-37 do"( to you telling are months twelve these )"What (مشInsights الأرقام نفس على ثابتة قواعد من بتتولّد
مفيش لو بتاعه. المكان بيفتح واحد وكل مرة)، مكتوب Insightنص مايترسمش القسم ← يستاهل .(مقترح
Bookings SLA Request On والـBR-09-38 الداشبورد في بتظهر اللي Analytics الحجوزات محرك من الـجاية المعتمدةbands.
"SLA started · 6 hours بعدBK-5 الوصول أيام7): ساعة24 أيام7–2 ساعات4 كاتب48 (التصميم واحدة. ساعة ساعة:
).11" — hoursو three for rooms شوفheld غلط، أمثلة
)Happy path( 3 الفلو. الأساسي
 الصبحOwner.أ3 الداشبورد بيفتح
 .112:00–17:59 "Good" 12:00" الدخوليشوف: بعد 09.1 UI : }First{" morning, (قبلGood
hotels · contract }n{ · }Company{ · }Weekday day Month بعدهاafternoon evening"، Good سطر(مقترح)" year)،
}date{ to وزرارactive analytics"، the وShow departures"، 3 · arrivals 4 · hotels the at "Today وChip Last"،
."updated 10:42 · the page refreshes itself
 الـالسيستم: كل بيجيب الباقي،sources مايوقعش واحد (فشل مستقل واحد كل بالتوازي، .)E2 كارتSkeleton كل ما لحد
يوصل.
. 2How this order عنوانيشوف: }n information your for is more }m{ · you need ورابطthings الشرح، وسطر is"،
كلdecided مرقّمة. ولستة النص،Item"، العدد، الترتيب، رقم الـBadge: سطر الخطورة، الأكشن.deadline وزرار الشرح، سطر ،
 .3). يعمل them" علىAnswer Request" On يفتحالسيستم:. مفلترةBookings answer an needs 05( ويرجعFlow يرد ما بعد
 تحديث 2← والـtrigger اتقفل.Item) لو يختفي
. 4."Close" ← )tiers 6 يعمل decided" is order this "How ←  09.2 OV بالـModal( ثابت
. 5 يعمل why" علىSee 3" sold be cannot "rooms ←  09.3 كلOV والـblocker: يشيله، ومين والتواريخ والغرف بعدده
Price them" / "Open the night" / "Open ظاهرةblockers صفر اللي purpose on zero at shows وأزرارstill the")،
."calendar on these nights" / "See every blocker
 .6" تحت: كارتيشوف Supply كارت4( أرقام)، )BR-09-20( كارتMoney pending، something has وشغلهWho شخص (كل
).users.view" يوصلها؛ المشاهد اللي المساحات في pendingالمعلق ورابطnothing مفيش)، لو Access" & (لوTeam
. 7.)Alt A5( OV 09.4 اتغيرت حاجة فاتحلو وهو
)UI 09.1D ofﬁce.ب3 اليومFront بتبدأ
 .1."Good morning, Noura · … · Front ofﬁce · the deskالهيدر
. 2ref …" TODAYكارت "ARRIVING leaving": 3 · arriving 4 · desk the at ليالي،Today وجبة، غرفة، (اسم، أوref،HTL-…"
.OV 09.1  ← "See the whole day". flags  الوكيل،⚑ ملاحظات من وOpen TODAY")، زرارLEAVING
 .3.)Information desk" your on الـAlso (غالبًاItems": صلاحيتها من اللي
 .4.operational view) الحجزOpen" صفحة ← وصول على 05" بالـFlow
Analytics.ج3

---

**p. 320**

 .1vs · }period). analytics" the "Show ←  09.0 UI الـالسيستم:. يقرا params الافتراضيquery وإلا الهيدرBR-09-31،
."Export the today }time{ at read · types room }n{ · hotels و}n{ numbers"،
 .2OF يشوف
Charts: Room-nights CLOCK( THE BEFORE ثمANSWERED وفرق؛ واتجاه بسهم واحد كل
Next 14 nights
Money
."What these twelve months are telling you to out and ثمin do؛
 .3Last 12 months" / "This contract term" / "Last 90 days" / "Year to date" / ← الفترةيعمل: يدوس 09.5 يختارOV
") pick you range والمقارنةA "Nothing") / before" immediately period "The / year" last period same والفنادقThe
 hotels"( 3 بنسبتهAll واحد فندق أو Apply" والـالسيستم:". تتحدث، الصفحة كل يتحدثURL
 .4" يعمل table" as أيShow على Chart" كل تحت مقترح مرسوم، مش )Chart(الرابط ←  09.6 OV ← CSV" as أوExport
".Close"
 .5" ← today" you needs what to الداشبوردBack
)Alternative ﬂows( 4 الفلوهات. البديلة
manager Revenue · A1 ( 09.1A الهيدر).UI }Name · availability and rooms rates, · manager مفيشRevenue "،
Supply + drafts + waiting hotels the at "Today (مالوشChip القايمةbookings.view_operational" on)،
Bookings and money are not yours to answer - they do not appear, and. مفيشHoteliana الشرحMoney، سطر
" either button locked a behind hidden not are كارتthey pending." something has بسWho مساحاته في الناس فيه
rate changes are not amendments + cancellation + Request On (. 09.1B UI ) Reservations · وA2 بأزرار،
Three". Locked بسطرpublished" rates publish have not do you · publish can who someone for العنوانWaiting
."things need you · one more is for your information
Tier 4 →( "September statement is ready - review by 5 Oct Finance · A3 ( 09.1C بعدUI — 12) القايمة.Flow
1 آخرTier في ساعة24 September invoice"؛Review tax August "Upload ← missing" is August for invoice "؛Tax
" account" your against posted back"؛entry came payment فيه،a (لو زرارProblem" details، bank للـUpdate
Hoteliana answered وللـOwner بس، سطرFinance account bank the change can Owner the your")؛Only
" "dispute كارتInformation( مرة). يتفتح ما لحد يفضل الجملةMoney، كامل. identity guest's the never تفضلand
All clear ·): you needs Nothing · A4 ( 09.1E (ولا).UI فاضية المشاهد قايمة لما حتىItem واحدInformation، كارت
Every On Request" + now right you needs يوصلهاNothing المشاهد اللي المساحات بس (بيذكر الحالة من بيتولّد سطر
.(".booking is answered, no change request is waiting, everything priced is published, and no room is blocked
) أصفار.5مش كروت التانية الكروت تفضلPending
"Nothing needs you · }n{ things for your فيه Informationلو مشItems ← بس clear العنوانAll information؛
.(مقترح)
 A5 09.4· OV .) poll/focus لـTrigger: مختلف رقم رجّع Item ظاهر. كارت أو القديمةالسيستم: بالأرقام يحتفظ
answered an On Request }Who" ويفتح الشاشة 09.4على OV }n{" open was this while changed بلستةthings
A held quote expired · HTL-88131 ·
 looking "Keep 10:40". at agent the to back went rooms معthe تفضل القديمة والأرقام يقفل ← فوقBanner" صغير
" ← Refreshالقايمة · changed has list The now؛(مقترح)" جديدRefresh من يرسم
  أكشن نص في كان المستخدم للداشبورد.Modalلو يرجع ما لحد مايظهرش الإشعار تانية)، صفحة من

---

**p. 321**

 A6 يوصل· العدّاد الـ00:00 ← يتحولItem )neutral( back" went rooms the · ثانيتينExpired
.Refresh (مقترح ← poll في يدخل أكّد، السيرفر لو ← فوري 09.4 بعدOV ويختفي
" ← Owner · فيA7 شخص بيدوس "Open pending". something has مفلترةWho الصفحة (نفس ده الشخص طابور
" ← person = أوhandler area بتاعته) لو(مقترح) pending. زرارnothing مفيش
Drawer (. 09.1 OV ) hotels" the at "Today · بـA8 (يتقفل بس✕ أرقام،4 TODAY ،LEAVING
.) stay includes today وCloseوتحت list" bookings the "Open علىBookings( مفلترة
Locked "Only the Owner Admin · نفس.A9 بالظبطOwner 09.1 الـUI إلا بتحتاجItems)، اللي بتبقىbank.change
."can change the bank account
" BR-09-16 Auditor. · الـA10 كل Locked: لوMoney؛Items بس له؛finance.view اتفتح hotels the at غيرToday من
.) (مالوش guest.piiأسماء
Revenue manager.OF WHAT YOU Analytics · لـA11
…" SOLD غيرOPENED من EARNED. YOU وWHAT out" and in الـMoney softer". 3% is rate "Your يفضلInsight
only · }n{ }Hotel Analytics · واحد.A12 لفندق الـ والـKPIs الـCharts واحد؛ لفندق الهيدرheatmap بس؛ ده الفندق بغرف
."room types
" A13 والنسب".Nothing· الأسهم %12 year last وخطvs ماتظهرش، year") last point الـSame من يختفي
.Chart
 CSV numbers. the Export · الـA14 كل فيه الفلوسdatasets أرقام مقارنة. لكل عمود وفيه الحاليين، والفلتر بالفترة الصفحة بتاعة
. مالوش لو finance.viewبتتشال
 link Deep · لـA15 إشعار من الـ.Item صفحة على بيودّي الإشعار إشعارات.entity وجهة مش الداشبورد الداشبورد). (مش نفسها
)Exception ﬂows( 5 الاستثناءات. والأخطاء
#Trigger اللياللي بيظهر الـ)English(
بيتحفظ
Recovery الـ
(مشSkeleton—— والكروت القايمة شكل بنفس تحميل)Spinner E1أول
E2 (مثلاًSource فشل واحد
(Finance
Could not load money الكارت/الـ مكان بسItemsفي بتوعه
things need you · }n". again "Try + now" العنوانright
. checked be not could money يشتغل(مقترح)" الباقي
again للكارتTry الباقي
بس ده
E3 الـ فشلتsourcesكل
نت مفيش
top again" "Try + dashboard" your load not والـCould bar"،
شغال
again —auto-؛Try
 يرجعretry النت لما
E4 10:42" updated يتحولLast could" · 10:42 updated قطعPollLast (نت فشل
)warning( refresh" المحليةnot الساعة من تكمل والعدّادات ،
المتظبطة
الأرقام
القديمة
لوحده يرجع
الصح هي لوجBR-09-02الصفحة بالفرقclient-side). الداشبورد في E5الرقم
telemetry( (مقترح))
—Bug upstream
E6entity على والـItemضغط
ما قبل تاني حد بإيد اتقفلت
تفتح الصفحة
Layla conﬁrmed this (مثلاً الحالية الحالة بتعرض ورا 1الصفحة
") — ago الداشبوردminute مسؤولية مش
الداشبورد —يرجع؛
triggerيتحدث
(1/2
فاتح وهو اتغيرت E7الصلاحية
الداشبورد
ظاهر كان كارت لو الجديدة؛ بالمفاتيح الكروت بيرسم الجاي التحديث
Your access changed - some cards 09.4اتشال، يقولOV
see to yours longer no are (مقترح)"
——

---

**p. 322**

#Trigger اللياللي بيظهر الـ)English(
بيتحفظ
Recovery الـ
11.30 ثمOV بدقيقتين، قبلها 11.12 الـOV الـpoll؛ عند بيقف خلصت E8الجلسة
401
— in يرجّعهSign
للداشبورد
E9: داتاAnalytics غير من فترة
خالص
No bookings in this period yet" + الصفحة مكان "Pickفي
"another period
الفترة الفلتريغير
E10: داتاAnalytics غير من مقارنة
سنة (أول
مكانها year{الأسهم last period same }the for data والـNo "،
 المقارنةChart خط غير من
—Compare with:"
"Nothing
E11 range مختارAnalytics:
غلط
09.5في OV : date" start the after date end an "؛Pick
" مقفولApply"
—يصلح
E12 range Analytics: من أكتر
 شهر24
months"—يقصرّ 24 to up Pick (مقترح"
E13 was nothing - ﬁnish not did export "The فشلExportToast:
"downloaded" + "Try again
—Try again
E14 الـ مكان againفي "Try + load" not could chart "This لوحدهChart"؛Chart: فشل
شغال الباقي
—Try again
الجهاز—— ساعة على مايعتمدش غلط)BR-09-10العدّاد الجهاز على E15الساعة
E1630 tabالـ من أكتر مخفي
دقيقة
 ← يرجعpollمفيش لما (بيوفر)؛ الخلفية في +focus تحديث
 09.4 تغييراتOV فيه لو
——
6 حالات. مش موجودة في التصميم
أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
1 بعدMoneyكارت
Flow 12
زي4 تايلز 07.20 "UI ،:
STATEMENT TO REVIEW · {Month} ·
"Last payment }date{ · }PAY-ref{ · }amount{ }date{ by وتحتReview SAR"؛
…" ﬁnanceو السطرOpen cycle". payment no is يتشالThere
UI 07.20
التايلز +تحت )info( Hoteliana" for waiting SAR 9,240 · 1 · lines الـDisputed 2Disputesسطر
صفرOpen لو يختفي "؛
UI 07.23B
3Payments pausedMoney: "Payments to you are paused · since }date{ · info كارتBanner فوق
Information)
UI 07.20H
4You owe HotelianaItem Tier 4 Watch: "You owe Hoteliana {amount} SAR · taken from your next
) finance.contact now it pay to how "See + "payment" ←  07.38 (بـOV
UI 07.20N
5A payment came
back
Item Tier 4 Problem: "A payment of {amount} SAR came back · {bank} ····
Only the Owner can change / )Owner( details" bank "Update + سطر}last4{"
" account bank (غيرهthe
UI 07.32R
6Statement to
24 آخرreview في
ساعة
1ينتقل بعدّادTier ⏱ 12m 5h in automatically ويفضلaccepted Review"،
"{Month}
item UI 09.1
1

---

**p. 323**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
اتقبل 7الكشف
أوتوماتيك
statement was accepted automatically · }Month Information واحدItem يوم
"paid on {16 Oct}" + "Open the statement
UI 07.23D
8Hoteliana
answered your
dispute
Hoteliana agreed · +560 SAR goes into Information يتفتحItem ما لحد
"Hoteliana did not agree · see why" أوOctober
UI 07.23E/F
9Auditor dashboardRead only · }Reservations teamعنوان your on waiting is كلWhat بسطرItem"،
"or Owner} can answer it
UI 09.1B
(item 4)
مخصص 10Nightدور
(desk
09.1B مثلاًUI بالمفاتيح: Requestبيتركب لوOn بزرار غيرهbookings.confirm ومن Locked،
11Front لـSupplyكارت
ofﬁce
) rates.view / inventory.view (مالوشمايترسمش—
12Today at the"
" غيرhotels من
guest.pii
(Auditor)
"Guest · HTL-88198 · Standard Room · Room Only · 4 09.1 nightsالأسطرOV
ولا وصول 13مفيش
النهارده مغادرة
Drawer: departuresالـ or arrivals no · hotels the at "Today الـChip: "Nobody"؛
."arrives or leaves today. {n} guests are staying
OV 09.1
14 الـItems نفس في كتير
Tier
09.1 7أقصىUI وبعدهاItems ظاهرة، more }n{ Show الكلي(مقترح)" هو العنوان في العدد ؛
(مفيش جديد 15حساب
عقود) ولا فنادق
)Flow 11 11.19 يعرضUI 11.19الداشبورد UI here القايمةStart بدل
الهيدر }Companyسطر · }n{ )warning( contract" active no · 3؛hotels Tier انتهىItem الوحيد 16العقد
Nothing can be sold · your contract ended on {date}" + "Copy to a new
"period
UI 10.1
الهيدر }nسطر }date{ ends next · contracts active بدل(مقترح)" active contract عقد من 17أكتر
…"to
UI 09.1
09.1 Makkah"UI Noor بدلAl 3" واحد"hotels 18فندق
19Item "Hoteliana
needs information"
(Flow 10)
Tier 2 Needs an answer: "Hoteliana needs {n} details on {Hotel}" + "Open the
"request
UI 10.9
20Item Case "Waiting
"on you
Tier 2: "Hoteliana is waiting for you on {CASE-ref} · {subject}" + "Open the
"case
UI 11.25
21 Report ردItem بعدّاد
(Flow 10)
"Tier 1: "Hoteliana needs your answer on {ISS-ref} · ⏱  {time} leftUI 10.7
22Item "contract
"ends in N days
"Tier 6 Watch: "{Contract} ends in {n} days · {date}" + "Open the contractUI 10.0
23 حسابAnalytics
 من أقل شهور3عمره
info: "You have }n{ weeks of history. سطر الصفحة Year-on-yearفوق
"Nothing." months 12 after start الافتراضيةcomparisons والمقارنة
UI 09.0

---

**p. 324**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
24Analytics: Charts
داتا غير من
") سببهChartكل بيقول فاضي period this in bookings Request On محاورNo مش
فاضية
UI 09.0
25: رابطAnalytics
"Show as table"
dataset 09.6 كلOV بيفتحChartتحت نصي رابط 09.6 الـOV لنفس
26 09.4 بتغييرOV
واحد
"One thing changed while this was 09.4 openالعنوانOV
27Who has"
something
" لشخصpending
Deactivated
09.1 المشتركUI الطابور في بتظهر عناصره مايظهرش؛
281 09.1 المفردUI 1صيغة you needs النصوصcancellation كل في بعددItem…")
)State machine( 7 الحالات.
 item الموديولDashboard في الحقيقية الحالة بس، (عرض
الـBadge الحالةالانتقالTrigger
Listed← الـ )BR-09-11(حسب العنصرsourceالـSeverity رجّع يظهر
Listed الـ سطرSeverityنفس + can بس"who الشوف عنده )Locked(—المشاهد
Listed → Tier danger → 24hwarning <= now - المراجعةdue_at لكشف 1ترقية
Listed → المصدر— في اتقفلت الحالة أو حد) أي (من اتعمل Goneاختفاءالأكشن
Listed → يختفيneutral ثم لحظيًا due_at >= خلصnow Expiredعدّاد
 state :Page  loading →  ready → ( يحصلstale_notice لما )BR-09-19 →  بعدready لماpartial_error؛Refresh
 يفشل؛source يفشل؛error الكل لما فاضية؛all_clear القايمة لما جديدfirst_run لحساب
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Analytics · THE
PERIOD
من— الافتراضي5واحد months؛ 12 نعمLast
Analytics · A range
you pick (From/To)
pickerالـ date (هنا الموحد مفتوح اختارهFrom)؛الماضي لو
≤ To To؛≤ 24≥ شهر From؛(مقترح)
الحساب بداية تاريخ
Pick an end date after the start date" /"
"Pick up to 24 months" / "Your account
"starts on {date}
Analytics ·
COMPARE IT WITH
من— الافتراضي3واحد year؛ last period نعمSame
Analytics · WHICH
HOTELS
hotels" }n{ الموردAll فنادق من واحد فندق أو نعم"
)hotel فيه لو نطاقه scope(ومن
—

---

**p. 325**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Export the numbers
/ Export as CSV
BOM with UTF-8 غير(مقترح) من الأرقام —،
آلاف فواصل
—
9 الإشعارات. والإيميلات والسجل
  أحداثالداشبورد كلمابيطلّعش بتاعته. إشعارات ومالوش فيItem متعرّف وإشعاره موديوله، في حدث من جاي 11 الفلوFlow وفي
بتاعه.
actor = user · الـالسجل: وفتح الداشبورد فتح Overlays .مابيتسجلش numbers the وExport CSV as بيتسجلواExport
datasets{ hotels, compare, }period, · analytics" Exported .(مقترح)
نشاطTelemetry سجل (مش   age{ tier, }type, }n{،dashboard_item_clicked ،something_moved_shown
page_value{ dashboard_value, }source, dashboard_mismatch .(مقترح
)Acceptance criteria( 10 معايير. القبول
 .1Then On Request On فاضلهGiven و18 دقيقة بمبلغcancellation ساعة من مستنية 3,540 When يتحمّلSAR الداشبورد
 والـRequest واحد أول بعدهcancellation
 .2 اتنينGiven فيamendments When 2 يتعرضواTier فيThen الأقدم الأولasked_at يطلع
 When manager Revenue الداشبوردGiven يفتح أيThen مفيش عنItem كارت أو أوBookings بيلمّحMoney مقفول زرار ولا .3،
لوجودهم
. 4 Reservations ومالوشGiven وفيهrates.publish منشور18 مش تغيير القايمةWhen يشوف الـThen بالعددItem ظاهر
ratesوالسطر publish have not do you · publish can who someone for زرارWaiting ومفيش .Publish"،
. 5 When ofﬁce Front الداشبوردGiven تفتح كارتThen desk the at وكارتToday حاجة، أول أيSupply" ومفيش مرسوم، مش
مكان أي في تكلفة أو سعر
. أيGiven مفيش للمستخدمItem يتحمّلWhen الداشبورد واحدThen كارت now right you needs كروتNothing ومفيش 6"،
بأصفار
. 7 3 بتتباعGiven مش غرف يدوسWhen Then why" See  09.3 الـOV نفس بيعرض codes والـblocker التقويم، في اللي
.0 بـblockers ظاهرة صفر اللي
 .8 رقمGiven 3 When sold" be cannot يتداسrooms والـThen دي الليالي على متفلتر يتفتح التقويم التقويمblocker مش ده،
كله
. 9.poll عدّادGiven وعليه مفتوح الداشبورد دقيقةWhen تعدي بيحصلThen poll عدّادGivenو؛ مفيش مفيشThen
 .10 Layla علىGiven ردت Request والـOn الداشبوردOwner فاتح الـWhen يرجعpoll ويظهرThen صمت، في مايتغيرش الرقم
" 09.4 وOV بالتغيير، now بيحدّثRefresh
 .11 الخلفيةGiven في التاب يرجعWhen Then فورًاfocus يتحدث الداشبورد
 .12Oct Then Item Tier 4 "September 2 لحدGiven للمراجعة مفتوح سبتمبر كشف 5 Finance When يومOct الداشبورد يفتح
 Oct 5 by review - ready is statement يفتحWhenو"، 5 Then 10:00 بقىOct 1 التلقائيTier للقبول بعدّاد
 .13Disputed lines · 1 · }amount{ SAR waiting for عليهGiven متنازع سطر كارتWhen يتعرضMoney سطرThen
. UI 07.20" = وHoteliana ظاهر، PAYMENT" فيNEXT اللي الرقم
 invoice Tax ناقصGiven يظهرWhen Watch = Severity ومعاهThen it for held never are ومشPayments .14.Problem"،

---

**p. 326**

 .15Money "Could Finance Source وقعGiven يتحمّلWhen الداشبورد Items والـThen الحجوزات ومكانSupply عادي، شغالين
."not load money right now" + "Try again
 .16.6 عددGiven When 6 = you" needs الإشعاراتWhat يفتح تابThen 6 = you" والـNeeds الجرسbadge على
 .17."Money in and out" Analytics لـGiven When manager تتفتحRevenue مفيشThen EARNED YOU ولاWHAT
 .18 Given  09.5 واختارOV only Suites وRawdah Then" Apply When before" immediately period الـThe كل والـKPIs
 والـCharts دي، والفترة ده للفندق بتتحسب الاختيارURL فيه
 .19Export When sold" "Room-nights Chart يفتحGiven 09.6 OV الـThen أرقام نفس فيه الجدول وChart شهر، شهر بالظبط
" CSV بينزّلهas
 .20 Auditor مالوشGiven guest.pii يفتحWhen 09.1 OV بسThen الغرفة ونوع المرجع ضيف، اسم مفيش
 .21" وصولGiven Request النهاردهOn فيWhen يظهر Then hotels the at عليهToday conﬁrmed not · request ومشon
."arriving · في conﬁrmedمحسوب
11 أسئلة. مفتوحة
اللي كتبناه لحد التعارضالقرار / #الموضوعالفراغ
1 09.R REF : portal" The ﬁgure. disputed no is الداشبوردDisputethere في
dispute no (has الجديدة والمالية ،"،
) L8/F9 07.25Finance فيهاOV
 الكشفDispute سطر على
Money 12 يكسب:Flow سطر فيDisputes
 الـBR-09-21( يتحدثREF. محتاج
2No payment"
"cycle
UI 09.1/09.1C/09.1E فيMoneyكارت
There is no payment cycle… no 11.18و بيقولواUI
16: promised يومDECISIONS"؛date يتدفع شهري كشف
). 12 يكسبFlow فيBR-09-20 تتعدل الكروت
التصميم
3On Request 11.3 OV : hours" 6 · started "Each"؛SLA الـSLAAnalytics:
Bookings hours three for rooms held BK-5:"؛one
 1h / 4h / الوصول24h قرب حسب
 بيقرا فيdue_atالداشبورد الأرقام المحرك؛ من
وتتصلح أمثلة التصميم
4 ofﬁce وكارتFront
Supply
 09.1D راسمUI out( )sold مالوشSupply لدور
inventory.view
مايترسمش )BR-09-13الكارت
5 بيقولREFالـ severity follows يحددColour ما غير من ألوانSeverity"
Watchلون
warning = Watch فاتح (مقترح)
6Statement review
أنهي Tierفي
)Flow 12 4 وTier 1، آخرTier في 24 ساعة قبلREFالـ(مقترح) (اتعمل مايعرفوش
7Who has"
something
"pending
)Flow 08 #7" قرار للطلباتownershipمحتاج سؤالhandlerبيفترض (نفس طلب لكل
Sep" 12-15 · low running والنهاردهnights 17" التصميمSep في 8تواريخ
)"next 14 كارت في nights(ماضي
تتصلح مثال، داتا
9rate changes" 18"
vs "3 rate changes
"held
 من واحد serviceالرقم الـRate برقمينbatchنفس كارتين في
10 أوrates.view finance.view يشوفREFالـ(مقترح) مين مابيقولش للأدوارAnalyticsAnalytics

---

**p. 327**

اللي كتبناه لحد التعارضالقرار / #الموضوعالفراغ
11Win youبرا needs What كارت(مقترح)" ممكن الداشبورد؛ في مذكورة listمش
Information "This week's win list · {n}
 لأصحابlines الـrates.edit_draft" لو
 عايزPO
12Reservations
"cannot be soldو
09.1B عارضUI مش sold be cannot والـrooms "،
 بـREF بيربطه الليrates.view عندهReservations
(تسعير نفسه الشيل المفتاح؛ حسب Lockedيظهر
13entry posted"
against your
"account
call Hoteliana if the number بيقول looksالتصميم
 معwrong 12"؛ هوFlow الطريق الكشفDispute سطر على
 أو المراجعة، القبولCaseأثناء بعد
BR-09-23

---

**p. 328**

