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

# Flow 11 · Notifications, system & empty states

Flow 11: Notiﬁcations, system & empty states
الإشعارات( وحالات النظام والحالات )الفاضية
1406:6333  Section المصادر
( 11.0/11.2/11.3/11.7/11.10/11.12/11.13/11.15/11.21/11.22/11.23/11.30 ،OV
11.4/11.5/11.6/11.8/11.9/11.11/11.14/11.16–11.20/11.24/11.25/11.25B–D وUI 11.1)، فيOV 12 ،Flow
 11.Rو REF ( الـ1419:6922 من المبدأ 11). Flow بتاعه.REF: لوجيك مالوش حالة بتعرض فيه شاشة كل تانيengine
الـ مع اختلفت الشاشة لو الـengineماسكها. هي الشاشة .Bug،
الأجزاء: لنفس متقسم قسم فكل كبير، ده الفلو
 الإشعارات.A.11
."Ask the Owner for access مسموحB.11 مش
 والتعارضC.11 والنشر الحفظ
 والخروجD.11 الجلسة
 الفاضيةE.11 الحالات
 الإيميلF.11 على بيوصل اللي إيه
.Hoteliana )Cases( اسألG.11
1 الهدف. والنطاق
 موجود: ده الفلو "شغلكليه السبب"، وده مسموحلك "مش محتاجاك"، حاجة "فيه للمورد: بيها بتقول البوابة اللي الطريقة يوحّد
و"اسأل السبب"، وده فاضية "الشاشة السبب"، وده خرجت "إنت Hotelianaماضاعش"، بتتكتب رسالة كل السؤال". وتابع السبب ،من
ثابت. نص مش
النطاق ):MVPجوه
وتاباتA.11 الإشعارات جرس Read: / All / you والـNeeds قناة.Thread، لكل التوصيل وحالة ،
)state_readonly(.11  11.6 ،UI 11.5 ،UI 11.4 UI وفاريانتB: ،
.)object Phase 2 وentity_readonly وaccount_suspended 11.7، OV بس (الـكشاشة
C: UI 11.8 .11 11.11 ،UI 11.10 ،OV 11.9 ،UI
.Conflict
OV 11.15 :D.11  11.30 الخروج،OV قرب 11.12 الجلسة،OV انتهت 11.13 أمني،OV خروج 11.14 اتقفل،UI الحساب
اتغيرت الصلاحيات
 Finance.11  11.18 ،UI 11.17 ،UI 11.16 UI 11.19،E: جديد.UI مورد
. OV 11.21  + UI 11.20  :F.11
. 11.25D  / 11.25C  / 11.25B  / UI 11.25  → UI 11.24  → OV 11.23  → OV 11.22  :G.11
النطاق برا
.object )Pending/Approved/Declined/Expired( ← Phase 2 )DECISIONS + REF 11.R كـ الصلاحية (طلب

---

**p. 362**

 (الطبقة الشركة إشعارات الـ2سياسة في )resolver ← 2 الـPhase غيرresolver؛ من دلوقتي بيتبني بعدينmigration
: وSMSقنوات وWhatsApp ومقفولة.Push دلوقتي، من الموديل في متعرّفة
.)3 digest كإعدادDaily 2 Phase شوف سؤال11(مقترح؛
 chatالـ معLive الـHoteliana موجود؛ مش ← القناةCase هو
والمفاتيح: بيستخدمه مين
الجزءيشوفيعمل
مستخدم الـActiveأي بتاع الشوف مفتاح عنده لمن بس بيوصل إشعار كل الإشعاراتarea.
BR-11-09)
في العمل مفتاح = الإشعار جوه الأكشن
الموديول
Not access" for Owner the أيAsk مستخدم": allowedأي
الـ ماعدا Ownerمستخدم
Save / Publish /
Conflict
الموديول في التعديل مفتاح ،rates.edit_draftصاحب
…(inventory.edit
= الـ المفتاح؛ Publishنفس
rates.publish
مستخدم— والخروجأي الجلسة
الصفحة مفتاح ←حسب hotels.viewBookings ← Hotels الفاضيةMy الحالات
finance.view  ← bookings.view_countsFinance
مفاتيحها = الحل أزرار
What reaches
your inbox
المستخدم بسنفس هو (إعداداته مستخدم أي
Ask Hoteliana
(إنشاء
BR- مستخدم Activeأي Auditorماعدا الـ(مقترح) المفاتيحcategory؛ حسب
(11-52
—
Your cases /
Case detail
Cases ماعدا مستخدم أي الحسابAuditorالرد: الـكل كل يشوف
(مقترح)
الدخول: نقط
. 1. OV 11.0  ← )Needs you الـ في barالجرس عددtop (عليه
. 2.link إشعار linkإيميل للـdeep الـentity نفس ← خلصت الجلسة لو الدخول بعد للجرس). (مش
. 3 09.1 UI ← القايمةItems (نفس
 .4. reason بيرجعrequestأي الـ403 من API ←  11.6 / 11.5 / 11.4 حسبUI
. 5 Save/Publishأي ←  11.11 UI / 11.10 OV / 11.9 / 11.8 النتيجةUI حسب
. 28 دقيقةIdle 11.30 401؛OV ←  11.14 UI / 11.13 / 11.12 حسبOV 6؛signed_out_reason
. OV 11.15 اتغيرpermission_version
 .7. UI Finance / Bookings / Hotels داتاMy غير من 11.18 / 11.17 / 11.16 جديدUI لحساب دخول أول 11.19؛
 .8. 11.0 OV inbox" your reaches "What ←  11.20 أيUI مقفولToggle؛ 11.21 الـOV في المستخدم قايمة من كمان
settings "Notiﬁcation bar top .(مقترح"
 .9UI Hoteliana" منAsk 11.0" 11.24،OV 09.3،UI OV /  Blocker 10.4 (بـOV الـcontext 10.2)،blocker
 " 10.6 ،OV
issue( )Booking issue booking a شاشةReport وأي allowed/Locked، فيهاNot Hoteliana Ask .(مقترح"
 links :Deep  settings/notifications،cases/}ref{،cases،notifications?tab= .10.(مقترح

---

**p. 363**

2 قواعد. البيزنس
A.11 الإشعارات
شايلBR-11-01 الإشعار }type,id{،due_at،deep_link،requires_action،priority،type ،entity
read_state،thread_key user( dismissed)،per user( .)per  وpriority due_at أولويات سلم من بييجوا
الداشبورد BR-09-07( 09 بإيدهFlow بيكتبهم ماحدش )،
BR-11-02 المستخدم ملك والقراية الحساب، ملك الحدث you" "Needs =  true = requires_action عنده والمشاهد
 العمل مفتاح الداشبورد) مع العدد لتوحيد عدد(مقترح you. الـNeeds = للعمل القابل الداشبورد عدد = فرقbadge أي الجرس. على
.Bug
منBR-11-03 بيخرج العنصر you Needs لما يتعمل الأكشن وبيخرج يتقري، لما مش الفريق)، في حد أي (من اللحظة نفس في للكل
عبرpush( أقربwebsocket/SSE في أو .)poll،
Thread Thread لكلBR-11-04 الـ:entity نفس على المتكررة الأحداث الـexpire…( نفس بتحدّث
 لفوق، جديدةوبترفعه صفوف الـمش Thread. على بيفتح حالة .آخر
On Dedup القنواتBR-11-05 عبر  (زيThread لوحده متعرّف حدث نفسه التذكير لو إلا للتذكير، تاني إيميل مايتبعتش إيميل اتبعت
.)Tax invoice reminder reminder وRequest
:"Read"). تابBR-11-06 All الأول، الأحدث itemsوالـ": فوقaction  top"( the at place their keep items تابaction
."Still needs action · Also in Needs you الـ أنا؛ قريته itemاللي بعلامةaction فيه بيظهر المقروء
Needs you" BR-11-07 بس أنا لي مقروء = أكشنه على الضغط أو الإشعار فتح القراية: read as all Mark مايغيرّش ماعدا الكل بيقرا
مرسوم مش .(مقترح،
 اللوحةBR-11-08 في الاحتفاظ مدة 90 يوم الـ(مقترح) items؛ عمرهاaction كان مهما تتقفل ما لحد بتفضل المفتوحة في20 عنصر
مع تحميل moreكل Load .(مقترح"
 BR-11-09 التوصيل: بتحكم عنالصلاحية إشعار مايستلمش مستخدم ليهarea ولو إعداداته. كانت مهما شوفها، مفتاح مالوش
.)Needs you كـ بيوصله الإشعار بس، فيinformationالشوف (مش
. BR-11-10 واحدالتوصيل: حدث كتيرdeliveries failure_reason{ sent_at, status, القنوات:}channel,
الحالاتpush،whatsapp،sms،email،in_app suppressed،failed،delivered،sent،queued. ممنوع.
.deliveries" واحدboolean الإشعار؛ على "Emailed الـBadge بيقرا
BR-11-11  سببsuppressed وليها عادية نتيجة ،folded_into_digest،channel_off
. not_enabled_on_account،action_completed_before_send
3"). BR-11-12 للمورد: بيظهر إيميلالفشل الإشعارBounced جنب بيظهر bounced address the - Failed · بعدEmail
Emails to }email{ are bouncing. Nothing reaches your inbox العنوانbounces لنفس متتالية اللوحةBanner في
Hoteliana "Ask + ﬁxed." is this until .(مقترح"
 تذكيرBR-11-13 Request On يفضل لما الـثلث: مدة SLA التصميم 6h(مقترح؛ عندSLA وتذكير left الـ)2h منSLA. نفسه
.)Flow 09 الحجوزات BR-09-38محرك
الـBR-11-14 في هدوء" "ساعات مفيش الإيميلات: مواعيد الـMVP للأحداث Required فورًا بتتبعت الاختيارية الأحداث .(مقترح)؛
B.11 مش مسموح
 BR-11-15 الدور. مش الرسالة، بيكتب اللي هو الـالسبب بيرجعAPI
: 403 {reason, required_key?, scope?, entity_state?}

---

**p. 364**

شكلمثال reasonالشاشةالرسالة
missing_permissionUI ﬁnance" see needs screen الناقص"This المفتاح 11.4اسم
out_of_scopeUI  وارفض الصلاحية، 11.5أكّد
الهدف
You have access to Rates - but not for this"
".hotel
state_readonlyUI مش الحالة 11.6اشرح
الشخص
You are an Auditor - the account is read-"
"only for you
entity_readonly الـBanner على (مشentity
صفحة
 مشobjectالـ
المستخدم
This contract has expired - nobody can edit"
"it
(فاريانت خروج account_suspendedشاشة
(UI 11.14
is" Hoteliana to access company's خالصYour تاني مكان ودّيه
"suspended
" BR-11-16 الرفض شاشة  بتسمّي ما المستخدمentityعمرها نطاق برا  ( 11.5 UI : scope" your in not - hotel غيرthis من
This page does not exist or is not part of your وأي linkالاسم). لـdeep أصلاًentity الحساب في مش عام404
" account موجود). إنه (مابنأكدش
" BR-11-17 الرفض شاشات البوابة (الـجوه bar الرجوعtop زرار خروج. مش موجود)، }area{ to أوBack قبلها، اللي للصفحة
" dashboard" to براBack من جاي لو
.) UI 11.6 ( Pause منBR-11-18 Hoteliana التعديل، مش البيع بيوقف رفض لشاشة ومابيودّيش
request object )Phase access for Owner the "Ask الـBR-11-19 في الشاشة:MVP" 11.7 OV لكن موجودة، 2(.مفيش
Admin: "}Name{ )}Role{( asks for }key labels{: request the Send بيعمل بس" إشعار email( + للـin-app ولكلOwner)
After account }First{'s "Open + "'}reason{'" ←  08.4 مفيشOV جزءApprove/Decline. تتتبع. حالة ومفيش you،
The Owner gets a notiﬁcation with a link to التصميمsend في Approved" → Pending الـ…) في ومكانهMVPمايترسمش
made is it as soon as change the see will you - release this in track to nothing is There account. your (مقترح."
 حدBR-11-20 Owner the كلAsk المفتاح لنفس واحد طلب 24": الشخص لنفس ساعة الـ(مقترح) مابيشوفشOwner. نفسه
."Ask ومكانه فوقه) حد (مفيش Hotelianaالزرار
 — السجلBR-11-21 في بيتسجل الطلب reason{ }keys, · access" for "Asked · user = actor التصميم(مقترح) جملة عشان
.)Flow 08" log" activity the in are decision the and request the منBoth العادي الدور تغيير = (القرار جزئيًا صح تفضل
C.11 الحفظ والنشر والتعارض
. published  → publish_failed  → saved_draft  → unsaved_local   4 مايتدمجوشBR-11-22 حالات
Refresh )IndexedDB BR-11-23 المحلي. الشغل بيمسح ما عمره الحفظ متعلّمةفشل بتفضل التغييرات بعدunsaved وبتعيش
.blur device( per user والـper كلdraft، السيرفر على بيتكتب ثواني10  التصميم seconds(مقترح؛ few الـ")every وعلى
. BR-11-24 idempotentالـ كل:Retry معاهbatch والـidempotency_key retry، بيعيد بس بيتطبقالفاشل مرتين التغيير نفس
مرة
 BR-11-25 الـ itemنتيجة per واحدة.:bulk "نعم/لا" مفيش مجموعة. كل وسبب فشل، كام اتحفظ، كام
Agents"( BR-11-26 شايفينه.Publishالـ الوكلاء اللي على نصه مابيقعش  تقول لازم النشر فشل شاشة دلوقتي شغالة نسخة أنهي
.("are seeing the version you published on 14 Sep 2026
per period: "Published · live now" / "Publish failed - بتقولBR-11-27 الشاشة لفترات. ويفشل لفترات ينجح ممكن النشر
 again "Publish failure". the at stopped publishing - attempted "Not / مش}reason{" اللي بيبعت بسlive"
BR-11-28 ليهrecordكل .version قديمة نسخة حفظ مايتدمجش الـبيترفض، عشان الحالية القيمة بيرجّع والرفض .diff،
BR-11-29 خلية خلية بيتحل الـالتعارض نفس في تعارض مالهاش اللي التغييرات شاشة. شاشة مش batch .بتتطبق

---

**p. 365**

 BR-11-30 كتابة. بآخر أوتوماتيك بيتحل ما عمره المخزون تعارض (الأسعار دايمًا. شخص بيستنى لأ ولا موجودة الغرفة بيحدد رقم
 القاعدة ونفس الشاشة، ).(مقترحنفس
).OV 08.13 (  diff BR-11-31 بيستخدم التعارض الـcomponentنفس النشاطdiff سجل بتاع
. الخروجBR-11-32 شاشة ← خلصت الجلسة إن للفشل الحقيقي السبب لو 11.12 مشOV 11.8) رسالتينUI سببين،
.) OV 03.11 ( "?unsaved ← "Discard changes فيهاBR-11-33 صفحة من الخروج
D.11 الجلسة والخروج
.Deactivated" BR-11-34 السلوك. بيحدد ممنوعالسبب أهمmodal واحد. عام عرضBug يتمنع: in back لشخصSign
الجلسات الشغلاللي الدخولالمحلي السببالشاشةتاني
بتقع
session_expiredOV 11.12" in" back ويرجعSign
المكان لنفس
بس ده الجهازالجهاز نفس على يرجع
security_logoutOV 11.13"Sign in and الأجهزة كل عمدًا verify"يتمسح
deactivatedUI الأجهزة بالتاريخكل محتفظ الحساب 11.14مفيشيضيع؛
 (منlocked فشلHoteliana أو
الدخول
فاريانت
UI 11.14
الأجهزة الفكيتمسحكل لحد مفيش
 (الشركة)account_suspendedفاريانت
UI 11.14
مستخدمي مفيشيتمسحكل
الشركة
permissions_changedOV والـ لوdraftمحفوظ، يتحفظ ينفع خروج 11.15مش
عنده editلسه
جلسة ولا
 30 = timeout Idle دقيقةBR-11-35  ( 11.12 OV : minutes" 30 for activity التحذيرNo 11.30"). عندOV دقيقة28
12. العداد بيصفّر الجهاز نفس على البوابة من تاب أي في نشاط أي دقيقتين. BroadcastChannelبعدّاد الأقصى(مقترح)) الجلسة عمر
 النشاط مع حتى كـ(مقترح)ساعة يتعامل يخلص ولما .session_expired،
 in back "Sign BR-11-36 بيرجّع الفلاتر" ونفس الشاشة الـنفس (من والـURL تاني:unsaved) جهاز على الجهاز. نفس على المحلي
 draftالـ بسserver
Hoteliana" Triggers جهاز،BR-11-37 أي من الباسورد تغيير الأمني: الخروج me not was الـThis إيميل من
. الـresetعملت أو للباسورد السجل2FA في بيتسجلوا عمله ومين نفسه الخروج
BR-11-38  11.14 وإمتىUI قفل مين بيقول }date{ on )Admin({ Saleh Bin Tariq | Owner }the by done was "،This
.)login" Ownerوالتواصل the "Contact الـmailto( لإيميل Owner و(مقترح) Hoteliana) غيرContact من عامة (صفحة
E.11 الحالات الفاضية
 BR-11-39 الفاضية الحالة حالة تقرير ونصها بالحل، وبتربط السبب بتسمّي الحالة: من مشبيتولّد ثابتstring،
 First-run بيعلّم،BR-11-40 سطر.steady-state في بيشرح  بـ والاختيار مختلفتين، شاشتين وتاريخه الحساب العددعمر بإن مش
. 11.19صفر UI الحساب ما طول بيظهر عقد عنده كان ما Liveعمره (مقترح) حاجة كل لو حتى أبدًا تاني مايرجعش نشر، أول بعد
خلصت.
· more_info_needed  · under_review  · none_submitted Hotels My الوصولBR-11-41 طلبات حالات بيقرا
. declined
 Bookings مفيشBR-11-42 لو البيع. محرك بيقرا علىblockers وبيودّي كده بيقول منAnalytics اتغير (السؤال لطلبsetup

---

**p. 366**

Finance بينBR-11-43 بيفرّق all at activity وno yet" eligible nothing exists, activity "، الجاية الفلوس بيعرض ودايمًا
on ← (بعدpipelineعشان صفر. مايبانش مليان 12 العقدFlow في الدفع شرط حسب الأهلية check-out: الشهر؛after كشف في
 ← الوصول؛arrival يوم ← booking on التأكيد.) يوم
F.11 إيه اللي بيوصل على الإيميل
. الإعداداتBR-11-44 user :per  channel × event_type × (بالمفاتيحuser الدور من الافتراضي
. الحلBR-11-45 ترتيب الـdefault من الشركة سياسة → للدور النظام 2( )Phase المستخدمOwner اختيار → يقدر المستخدم
 مفتوحيضيّق سابوه الأولانيين الاتنين اللي بس
 بيعلنBR-11-46 حدث كل وrequired_channels optional_channels حد.requiredالـ. أي من مايتقفلش
email  + in_app  ← due_at الـBR-11-47 required مكتوبة لستة مش :بيتحسب  true = requires_action فيهو
.On .required  true = غيرrequires_action من required  in_app ← فيdeadline (هو you وNeeds اختياريemail)
الأمان in_appأحداث +  email required بين. التعارض 11.20(حسم وUI 11.21 شوفOV ).11،
). أيBR-11-48 Toggle مقفول قفله ومين ليه بيقول ( 11.21 سبب.OV غير من رمادي سويتش مفيش
BR-11- بتاخدBR-11-49 نطاقه في الجديدة الأحداث يتغير، الدور لما بتقفdefaults نطاقه من خرجت اللي والقديمة الجديد، الدور
.(09
.default" defaults role my to "Reset للـBR-11-50 الاختيارية الاختيارات كل بيرجّع
Hoteliana G.11 اسأل
: Hoteliana "Ask بيعملBR-11-51 رسالةCase" مش
 t, message, attachments[], status, assignee (Hoteliana), timestamps, closed_by?, close_reason?}
 والمراجعBR-11-52 الأنواع
Category / مفتاح بيتفتحالإنشاء النوعالمرجعمن
A room is not"
matched to the hotel
"library
CASE-#####Blocker
ROOM_NOT_MAPPED  /
Request
hotels.view
A hotel request has"
"not moved
CASE-#####Request detailhotels.view
Something on my"
statement looks
"wrong
CASE-#####Finance / Statementfinance.view
A hotel is missing"
"from the library
CASE-#####Hotel libraryhotels.view
"Something (ماعدا مستخدم مكان)Auditorأي else"CASE-#####أي
Finance questionFIN-N-####Finance "Contact Hoteliana"
/ Adjustment
finance.contact
Contract follow-upCTR-N-####Pause details / UI 10.2contracts.view
Booking issue (cannot
honour)
ISS-YYYY-####Report )Flow 10( OV 10.6 + عملbookings.view_operational مفتاح
)Flow  10(حسبحجز
. الحالاتBR-11-53 open ·  in_review ·  waiting_on_supplier ·  resolved ·  closed دايمًا. الحالة شايف المورد

---

**p. 367**

BR-11-54 أوتوماتيك بيتلزق الشاشةالسياق من id المستخدم،contract الشاشة، فشل، اللي الشرط ،
الوقت
 BR-11-55  أبدًا: أسعارمابيتلزقش أو تواصل، بيانات ضيوف، أسماء الـIdentiﬁers لو بس. وشروط detail ضيفCase اسم بيعرض
/ guest.pii (زي مبلغ 11.25Bأو وUI 11.25C الـ)، من لايف بيتجاب المربوطةentityده مالوش لمن وبيتخفى
finance.view الـ، في Caseومابيتخزنش تعارض، .)11(حسم
We pre-selected the closest الـBR-11-56 category الفتح مكان من مسبقًا يغيرهامتختارة يقدر والمستخدم match.،
.(".Change it if we guessed wrong
 الـBR-11-57 Case ظاهر الحساب بسلكل لصاحبه مش
 BR-11-58 صمت:Caseالـ في مابيتقفلش والتفاصيل القايمة في بيظهر والسبب وليه، قفل مين بيسجل القفل
الرسالةBR-11-59 2,000–1 حرف المرفقات(مقترح) PNG؛ / JPG / أقصىPDF 10، (زيMB للملف 07.25 وأقصىOV 5)،
."nothing is taken from your device without you"  للرسالة .(مقترحملفات
 BR-11-60 فلوس. مابتمسكش الـالرسالة لو المراجعةCase في لسه كشف في سطر عن عنده5–1 والمستخدم الشهر) من
Hint: "Nothing is held: the entry stays on your account as it is. To hold the money while it ← finance.dispute
. OV 07.25  ← "is checked, dispute the entry instead." + "Dispute this line
 بعدBR-11-61 خلالresolved يرد يقدر المورد أيام7: يرجع ← بعدin_review رد7. غير من أيام بسببclosed أوتوماتيك
days" 7 in reply no - Resolved .(مقترح"
BR-11-62  بسclosed قراية = again this about بيعملAsk Case" بالقديم مربوط جديد .(مقترح
No longer needed" / "Solved on our" + يقفلBR-11-63 يقدر المورد بنفسهCase مفتوح case this إجباريClose سبب
"Other / side" مرسوم") مش .(مقترح،
"). النوعBR-11-64 حسب بيظهر المتوقع الرد زمن day working one within back calls الأحد–الخميسusually العمل أيام
 17:00–09:00 مكة بتوقيت مش(مقترح) توقع، نص ده ملزمSLA.
.)Case لماBR-11-65 matched not "Room الـCase يتحل، blocker" الغرفة على لوحده الـبيتشال من مش البيع، محرك (من
)Happy path( 3 الفلو. الأساسي
A.11 إشعار Request On لحد ما يتقفل
 .1requires_action = true حجزالسيستم: Request حدثOn ← اتعمل بـbooking.on_request.created
 SLAو + T0 = بيتعملdue_at in_app. Deliveries: . booking:HTL-88198 عندهمThread اللي لكل
وbookings.confirm لنفسهمemail، الـrequired الجرسbadge). على والداشبورد1 .1،
 .2Notiﬁcations · 4 things need you · nothing here is a الجرسيشوف: يدوس4 11.0". OV بس✕،Drawer(
HTL-88198 · Hilton Makkah · opinion تاباتsecond Read"، | All | 4 you السطرNeeds العنوان، عنصر: وكل Deluxe"،
Oct 15 - 12 · action")،Room "Needs الـBadge الأساسيEmailed"، الأكشن Answer"،
Open the dashboard" · "What reaches your"). ثانويnow رابط booking")، the والوقتOpen 22")، ago تحتmin
."inbox" · "Ask Hoteliana" · "My cases
 .3 يعمل now" الردAnswer قسم على الحجز صفحة ← 05" Flow هوالسيستم:). ليه مقروء الإشعار
. 4 (تذكير): الـالسيستم ثلث يفضل لما حدثSLA ← الـreminder نفس على وThread لفوق، يطلع لوحدهemail، متعرّف (حدث تذكير
. يعمل Layla الحجز. تأكد الـالسيستم: يتقفلThread منdone يخرج you، Needs اللحظة نفس في والـللكل -1، ويفضلbadge 5،
".A booking was conﬁrmed كـAll/Readفي

---

**p. 368**

 .6information "Expired and رد: محدش عندلو الـdue_at ← علىThread يتقفل (مشexpired item" وإشعارaction went)،
".back to Hoteliana
B.11 صفحة مش مسموحة
 .1. 403 }reason: missing_permission, required_key: finance.view{  :Finance. API بتفتحReservations لـlink
 يشوف  11.4 UI : have" not do you permission a needs screen This · permission بدورها،Missing الشرح .2What."،
What you }Role{ · today role Your · have do you بمفاتيحهاWhat وlabels" can)،
."do about it
 .3."Send the request يعمل access" for Owner the "Ask ←  11.7 (اختياريOV السبب يكتب ← متعلّم المطلوب والمفتاح
" ← السيستم للـBR-11-19 (إشعار والـOwner سجلAdmins سطر + Abdullrahman to "Sent الليToast للشاشة يرجع
قبلها.
C.11 حفظ bulk اتقطع
 عمل وداس46المستخدم التقويم في تغيير Save السيستم. بـbatch اتحفظوا،28؛idempotency_key فشلوا12 .14)،network
.2 validation
 .2Save failed · Your changes did not save. · Nothing was lost. All 18 changes are still on this" : UI 11.8  يشوف
Try the 12) الـscreen شريط وجدول4."، حالات، DO TO WHAT · FAILED IT WHY · WHEN · وأزرارWHAT مجموعة، لكل
."again" · "Review the 4 conflicts" · "Discard the unsaved changes
 .3 ← retry" ← again" 12 the للـTry الـ12 بنفس الجدولkey من يتشالوا ← نجح
 .4Apply mine on" conflicts" 4 the "Review ←  11.11 أوUI 11.10 يختارOV ← خلية لكل value newer the أوKeep
."top" ← "Save this resolution
 .5.inline ← )validation(" value" the بالخطأFix التقويم في للخلية يودّي
D.11 انتهاء الجلسة
 .1."You will be signed out in 2 minutes" + "Sign out now" / "Stay signed in" : OV 11.30 نشاط28 غير من دقيقة
 .2Your work," : OV 11.12 عند ← رد الـ30مفيش السيرفر؛ على تخلص الجلسة دقيقة يعرضclient
Sign back in" / "Copy my "precisely منdraft( السيرفر على المحلية)،X التغييرات عدد + ثانية happened this وWhy 2"،
."unsaved changes
 .3 01" Flow ← in" back الـSign لنفس يرجع ← والـURL متعلّمunsaved، يرجع المحلي
Hoteliana G.11 سؤال لـ
 .1Room is not mapped yet" ← "Ask Hoteliana" ← OV 11.22  )Drawer(: "Opened from: 09.3من غرفةOV على
A room is not matched to the hotel about this is (الـWhat متختارةcategory?"
you for this picked We · say…")،library to like you would و"What ،?"،
."What we attach, and what we do وAt( not،
 .2.Hoteliana )Admin الرسالة Sendيكتب يعملالسيستم:". Case  بمرجعopen لـCASE-20481 إشعار سجل، سطر queue(،
. 3What happens now"" يشوف  11.23 OV start" to need we everything have We · open is وCASE-20481 بتفاصيله
".See my cases" / "Close
 .4 الـHoteliana تمسك Case ←  إشعارin_review ← للمنinformation حاجةHoteliana تطلب
.)Tier 2 إشعارwaiting_on_supplier ← action فيrequires يظهر + للمنشئ you والداشبوردNeeds

---

**p. 369**

 .5. in_review" ← يفتح 11.25المورد UI email" the "Attach ← you" on أوWaiting ترجعReply" الحالة
. 6. closed  ← )BR-11-61 تحلHoteliana إشعارresolved ← مكتوبة بالإجابة
)Alternative ﬂows( 4 الفلوهات. البديلة
A.11
All: "On Request · HTL-88198 · 3 updates on this booking - Thread · A1 حدث من بأكتر 11.1 11.3،OV في).OV
created, reminder sent, answer still missing · Thread · 3 updates · Open the thread". "Open the thread" ←
Expires and goes back to✓) OV 11.3 : Timeline
}time{ · answers nobody If · وHoteliana delivered")، was it وHow وقت)، حالة، (قناة، ends" thread this "،How
."Answer now" / "Open the bookingو
information. "A booking was conﬁrmed · conﬁrmed automatically · Information · No action · Open· A2
.Needs you". booking مايدخلشthe
A3 · Dispute answered (Flow 12). "Hoteliana answered your dispute · September statement · HTL-88205 ·
 statement the Open · Information · October into goes SAR +560 · "agreed ←  07.23E (أوUI لو07.23F
. finance.view لـrejected بس بيظهر المبلغ بالسبب).
."Only }who{ can A4 كـ· بيوصل مكانهinformation والأكشن }action{،
Still needs action · Also in doing not is "Reading (. 11.2 OV ) tab Read · الـA5 item…". بـaction بيظهر المقروء
."read 5 min ago" you وNeeds
 A6 صلاحيتيentity· من خرجت أو اتمسحت ترجع الصفحة ← الضغط الإشعار. بعد شاشة403/404 ← الإشعارB.11 المناسبة.
يفضل نفسه
B.11
A7 · out_of_scope ( UI 11.5 ). "Out of scope · You have access to {Area} - but not for this hotel." · "What you
" الـhave ومفاتيح (دوره )area" · it" have you الحاليWhere والفندق (فنادقه، scope" your in not - hotel اسمهthis غير من
).Flow 08 §11 #9 · }area{" to "Back / hotel" this for Owner the Ask قرار". على scope(يعتمد فيhotel
Read-only state · You can see" .)edit Auditor (. 11.6 UI ) state_readonly · A8 (مثلاً أكشن يعمل بيحاول link لـdeep
Two other it set Owner the as reach, وYour ways"،
read-only goes screen الزرارa access". edit for Owner the بيفتحAsk 11.7" بطلبOV role my Change (مقترح"
."Back to dashboard" +  الـ لأن مفتاح، Auditorبدل عمل مفاتيح مايتدّاش
This entity_readonly · عقد.A9 والحقولExpired/Terminated عادي، بتفتح الصفحة وread-only: neutral، فوقBanner
" period new a to "Copy + selling." keep to period new a to it Copy it. edit can nobody - expired has (لوcontract
.( contracts.edit
 account_suspended · أي.A10 401/403 ← بـrequest غيرaccount_suspended من كاملة شاشة ← bar (فاريانتtop
Your company's access is suspended · Hoteliana suspended {Company} on {date}. Nobody in" :( UI 11.14
" means this "What · lifted." is it until in sign can company حاجةyour مفيش هي، ما زي المؤكدة الحجوزات واقف، (البيع
."Sign in". Hotelianaاتمسحت مفيشContact
C.11

---

**p. 370**

Saved as a draft. The publish did not go through." · "What is selling right" .) UI 11.9 failed Publish · جزئيA11
per period · "Publish the 2 remaining· ".now · Agents are seeing the version you published on {date}
."periods" / "Open the draft" / "See what is live
You opened it with 10 rooms · It is now 6 rooms it opened you since Changed · A12 ( 11.10 واحدة).OV خلية
- Layla, 3 minutes ago · You are saving 8 rooms" ← "Keep the newer value - 6 rooms" / "Apply mine on top - 8
."rooms" / "Cancel and look at it ﬁrst" ← "Save this resolution
." Conflict · فيA13 جزئي you need Three saved. were nights 40 of "37 (. 11.11 UI ) علىbulk أحمر المتعارضة والخلايا
System" وجدول BYالتقويم، CHANGED · VALUE CURRENT · VALUE YOUR · بـNIGHT معResolve) التعارض واحد. لكل
".sold out · System · 12 min ago · 0 out( الشكلsold بنفس بيتعرض
Discard }n{ unsaved changes? This cannot be undone." · "Keep changes unsaved the "Discard · ".A14 تأكيد
.server state" ← "Discard / لآخرthem" ترجع والشاشة يتمسح المحلي
D.11
 in signed Stay · من.A15 11.30 OV ← يتصفّرrefresh والعداد يقفل ← للجلسة
A16 · Security sign-out ( OV 11.13 ). "We signed you out for security. · The password on this account was
." one this including ended, was device every on session Every ago. minutes 2 الـchanged حسب بيتكتب (السبب
"trigger: "Hoteliana reset your password on {date}" / "Someone pressed This was not me on a sign-in code
 .)(مقترح me" not was "This / verify" and in "Sign ←( reset 01 الإيميلFlow من
A17 · Deactivated ( UI 11.14 ). "Account deactivated · Your access to this account has been turned off. · This
."was done by {who} on {date}. There is no sign-in to try…" · "Contact the Owner" / "Contact Hoteliana
Your sign-in is locked · Hoteliana locked your sign-in" Locked · منA18 (فاريانتHoteliana مرسوم11.14 مش ،
on {date} after {too many failed attempts | a security check}. · Your team and your work are not affected." ·
.""Contact Hoteliana
A19 · Permissions changed ( OV 11.15 ). "Permissions changed · Your access changed a moment ago. · The
Your }n{" changed "What · ago…" minute one role your changed الجديدOwner والدور والباقية، راحت اللي (المفاتيح
" changes (ينفعunsaved لأdraft" ولا draft a as "Save · out" signed not were you مفتاحWhy عنده لسه لو (بس
."Go to my dashboard" / "Copy my changesالتعديل
 مفتاح راحالتعديللو نفسه draft a as ويفضلSave يتشال، changes" my وCopy dashboard" my to "،Go
 الجهاز على تفضل المحلية 7والتغييرات أيام الصلاحية.(مقترح) رجعت لو
E.11
A20 · My Hotels ( UI 11.16 ). "No hotel is approved yet. Every request you sent is below, with exactly where it
بحالتهاstopped الطلبات لستة request." the "Track / days" }n{ for Hoteliana with · }date{ "Sent · review "؛Under
Browse the hotel" .)"More info needed · "Hoteliana needs }n{ details" / Declined why· "Answer"؛See
."library" / "Add a missing hotel" / "Track all requests
A21 · Bookings ( UI 11.17 ). "No bookings yet. That is not a mystery - {n} things are stopping agents from
Lift the stop clear to yours are }n{ all and الـbuying, لستة + بأزرارهاblockers."
blockers: "No bookings yet · Everything you opened is on") period new a to بدونCopy البيع. محرك نفس من
."sale. Agents have not booked it yet." + "Show the analytics

---

**p. 371**

Your account · You have business. None of it is due yet - that is a" .)Flow Finance · A22 ( 11.18 بعدUI 12،
YOU OWE( UI 07.20." account empty an not fact, بأسماءtiming التايلز
Bookings" REVIEW TO )STATEMENT + settled" be to waiting is nothing الدفعWhy شروط من بيتولّد
on after-check-out contracts go into the statement of the month they check out. Your earliest check-out is
{date}; its statement is issued on {1 Nov} and paid on {16 Nov}." / "On-arrival bookings are paid on their check-
There is no". analytics the "Show / statements" "Open / bookings" "Open · }date{." is ﬁrst the day: الجملin
…" cycle بتتشالpayment
A23 · Brand new supplier ( UI 11.19 ).Four steps to your ﬁrst booking": 1
3 "Build a supply
Done / Now / After. step( )Last sale" on it "Put لايف4 بتتحسب حالتها خطوة كل
."Invite your team" step Last / .)}previous{ for" asked be not will you وWhat
F.11
.Yours to choose" A24 11.20· UI .) off" switched be "Cannot وRequired( ومقفولة) )Toggles(،
" ← defaultsيغير role my to "Reset saved". are settings "Your Toast ← Save" الافتراضي يرجع ← تأكيد
How this setting was: A25 11.21· أي).OV على الضغط Modal ← Required والقناة،Toggle الحدث
Got it" "resolved default( System للدور،1 2 choice Your change)،3 can you وWhat /"،
.""Open my settings
G.11
Hoteliana is waiting for something from you." +" + Case · الكشفA26 عن 11.25 UI .) you" on البانرWaiting
."Attached to this case" + "How this one ends" + it without "Reply / email" the المحادثةAttach
A27 · Booking issue ( UI 11.25B ). "In review · Hoteliana is on it - nothing is needed from you right now." +
.)"… Also applied · Stop sale" + information تفاصيلAdd
A28 · Finance question ( UI 11.25C ). "Open · Reem Tarek has your message - she usually calls back within
.one working day." + "Nothing is held…" + (BR-11-60)
A29 · Contract follow-up ( UI 11.25D ). "Open · Hoteliana's contracts team has your request - they answer
."…within one working day." + "The pause stays on until Hoteliana lifts it
CASE · SUBJECT · LINKED TO you on waiting }n{ · cases "Your (. 11.24 UI ) cases Your · الجدولA30 ·"،
Open · UPDATE LAST · والترتيبSTATUS you)، on Waiting تحديث آخر وبعدين أول، و(مقترح) states، ﬁve وأزرارThe "،
Show the }n{ case" waiting the "Open / Hoteliana" بسAsk واحد فيه لو (بيظهر you" on Waiting أكتر لو waiting"؛
" بيفلترcases
 A31 الإرسال.category· قبل اختار لو والـcategory الشاشة)، من (هو يفضل المتلزق السياق تانية، اتختارتcategory اللي
لفريق بتروح اللي .Hotelianaهي
 Hoteliana Ask · سياقA32 غير من أو اللوحة (من 11.24 UI .) from" الـOpened مايظهرش، تتختار،category" ولازم فاضية
 automaticallyو فيهAttached Screen" / At / by بسRaised

---

**p. 372**

)Exception ﬂows( 5 الاستثناءات. والأخطاء
#Trigger اللياللي بيظهر الـ)English(
 /بيتحفظ
بيرجع
Recovery الـ
الـ "Tryجوه + notiﬁcations" load not "Could تتحمّلDrawer: فشلت E1اللوحة
 الـagain قيمةbadge"؛ آخر على يفضل
—Try again
E2 لـfallback كلpoll 60 ثانية (مقترح) أكتر لو إلا رسالة مفيش اتقطعrealtimeالـ؛
"Updates are delayed - reconnecting دقايق5من
—أوتوماتيك
E3Email bouncedEmail · Failed - the address العنصر bounced"جنب
Banner )BR-11-12( وبعدdanger( مرات3؛
in_appالـ
شغال
طريق عن الإيميل يصلح
Owner/Hoteliana
 والحاجة أكشن على E4الضغط
تاني حد من اتعملت
Layla conﬁrmed this 1 الـ الحالةentityصفحة بتقول
Needs ago منminute يختفي والعنصر you")،
——
E5reason غير403 من
)API الـBug( في
You cannot open this" + "Back to 11.4 عامةUI
خطأdashboard ولوج "؛
——
E6 link لـDeep مشentity
الحساب في
)BR-11-16 dashboard" to عام404—"Back
E7Send the request""
 لنفس11.7( اتبعت
 آخر في ساعة24المفتاح
Modal: "You asked for this }n{ hours ago. الـ Theفي
." it has يتشالOwner والزرار
—يستنى
E8"Send the request"
فشل
 again try - send not "Could والـToast: مفتوحModal"
بالسبب
again النصTry
E9 11.8 بعدUI الجديدة؛ بالأرقام بيتحدث محاولات3 تانيRetryStill فشل
failing. Your changes are safe on this device. Try
"again later or contact Hoteliana." + "Ask Hoteliana
المحليلاحقًا
E10 فشلdraftالـ السيرفر على
)autosaveيتكتب
Not saved to the server · kept الهيدر في صغير onمؤشر
this device" (warning)
بـretry أوتوماتيك المحلي
backoff (10s, 30s,
60s)
E11 متاحIndexedDB مش
(private mode)
Banner: "Unsaved work cannot be kept on this
".device in private browsing. Save often
——
E12 timeout ومشPublish
لأ ولا نجح عارفين
…" through" went publish your whether ثمChecking
idempotency periodنتيجة (الـper السيرفر من بـpublish
 فالـkey آمن)retry،
——
E13 conflict والقيمةResolve
بيقرر وهو تاني اتغيرت
It changed again - 11.10 الأحدثOV بالقيمة بيتحدث
"Layla set 5 rooms 10 seconds ago
تاني —يقرر
E14"Apply mine on top"
من أقل مخزون على
المحجوز
You cannot set fewer rooms المخزونValidation من
"than are already sold (7) on 12 Nov
القيمة —يغير
E15" in" back وهوSign
 ماDeactivateاتعمله وقت
برا كان
UI 11.14 01—— يرفضFlow

---

**p. 373**

#Trigger اللياللي بيظهر الـ)English(
 /بيتحفظ
بيرجع
Recovery الـ
E16 11.30 تابOV في ظاهر
نشاط فيه تاني وتاب
 التاباتModalالـ—— كل في لوحده يقفل
E17" changes" my والـCopy
 مقفولclipboard
 فيModalيفتح—— النص فيه اليدويtextarea للنسخ متعلّم
E18: الحقل areتحت details the - two or line a فاضيةCaseWrite رسالة
"already attached
—يكتب
E1910: Case من أكبر ملف
 / مسموحMB مش نوع
 من 5أكتر
This ﬁle is larger than 10 MB" / "Use a PDF, JPG or"
"PNG" / "Attach up to 5 ﬁles
الباقييغير
E20: عليه againالملف Try · failed مقفولSend"؛Upload النصCase" في وقع الرفع
يتعاد أو يتشال ما لحد
again الرسالةTry
E21 علىCase رد اتقفلCase:
بيكتب وهو
This case was closed by {who} {n} minutes ago:"
 again this about "Ask + "}reason{." بالرسالةCase( جديد
الرسالة—
E22 Auditor يردCase: يحاول
(API)
state_readonly  403——
E23: والـCase سياق من اتفتح
 كدهentity بعد اتمسحت
snapshot" case" this to الـAttached يعرض
"entity: "No longer للـidentiﬁers( والرابط available،
——
E24 again try - settings your save not "Could القيمToast: Save"؛ فشلSettings:
الشاشة على تفضل
—Try again
E25Settings: فتحSettings
اتغير الدور ما بعد
defaults بـ الجديدة تختفي؛ الصلاحية برا اللي )BR-الأحداث
"New for your role سطر11-49( مع
——
نفسه والمصدر فاضية E26حالة
فشل
Could not load }bookings{" + فاضية حالة "Tryمش
" نقولagain (ممنوع bookings" ماعرفناش)No لو
—Try again
6 حالات. مش موجودة في التصميم
أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
خالص فاضية 1Needsاللوحة
(you = 0
New action" + nowتاب right you needs "Nothing you: سطرNeeds
."items appear here and on your dashboard
UI 09.1E
2 starts" account your as here appear They yet. notiﬁcations جديدAllNo (حساب فاضي
".moving
OV 11.1
3 11.2 yet"OV anything read not have فاضيRead"You
4"Mark all as read"Toast "Marked }n{ تاب فوق نصي علىAllرابط مابيأثرش you؛ as؛Needs
"read
OV 11.1
5expired الـ في خطوة }time{آخر · Hoteliana to back went · "Expired  ✕ انتهىThread"،Timeline
" bookingوالأكشن the بسOpen
OV 11.3
6 11.3 خطوةOV }time{آخر · }Name{ by بالأكشنThread"Answered اتقفل

---

**p. 374**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
799 bar الجرسBadge"+99"top
8 11.0 اللوحة،BR-11-12(OV تابات فوق بيرتدBannerdanger) الإيميل
9Flow Oct" 5 by review - ready is statement )"September issued إشعاراتStatement 12أنواع
Tax invoice reminder ("Tax
invoice for August is still missing · Payments are never held for it" ·
"Upload"), Payment sent ("16 Oct · 18,450 SAR paid · September
back came Payment action( للـNeeds )،Owner
Dispute answered
OV 11.1
10 requestإشعار للـaccess
Owner (MVP)
Ahmed Saleh asks for see ﬁnance · 'I need to check…' ·"
"Information" + "Open Ahmed's account
OV 11.1
"See" + Abdullrahman" by · manager Revenue to changed role دوريYour تغيير 11إشعار
"what you can reach
OV 11.1
12custom role 11.4 desk"UI Night · today role الفعليةYour بمفاتيحها 11.4" لـUI
13 11.4 them"UI have not do you and keys, Two · needs screen this 11.4".What ناقصينUI مفتاحين
14Owner (الـ— حصلOwnerمايحصلش لو المفاتيح)؛ كل عنده ويتعرضBug 11.4E5، للـUI
15MVP قسم غير )Pending/Approved…(من send" you ومكانهAfter 11.7BR-11-19، الـOV في
 متعلّمcheckboxesالنص؛ المطلوب بس، الحالية الشاشة في اللي المفاتيح
OV 11.7
16Not شاشةOwnerالـ على
out_of_scope) allowed
entity_readonlyمستحيل؛
ممكن)
 entity_readonlyA9 بسBanner
17entity_readonly Banner + 10.1 neutralUI الـBanner على فيهentity لو الحل زرار
18account_suspendedA10UI 11.14
19Locked by HotelianaA18UI 11.14
20Admin }date{" on )Admin( Saleh Bin Tariq by done was وThis the" بواسطةDeactivatedContact
" يفضلOwner
UI 11.14
21unsaved 11.12 preciselyقسمOV work, يقولYour saved" was did you 11.12".Everything غيرOV من
22 11.12 الجلسةOV عمر بعد
 ساعة12الأقصى
Why this happened · Sessions last 12 hours at most. Nothing is"
".wrong with your account
OV 11.12
23 11.15 فيOV لسه والشاشة
صلاحيته
Toast info: "Your access changed - }summary{" +؛Modalمايظهرش
"Details
OV 11.15
24 واحد صف 46الجدول connection The · unsaved still · 11.8changes نتUI بسبب فشل كله
"dropped" + "Try the 46 again
UI 11.8
25 11.9 live"UI went كلهNothing والجدول attempted." failed"/"Not 11.9"Publish فشلتUI الفترات كل
26 11.10نفس بعنوانOV }night{ · }room{ · سطرRate غير من مخزونConflict"، مش سعر على
"Availability never resolves itself"
OV 11.10

---

**p. 375**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
27: Hotels طلبMy بعت ما عمره
)ﬁrst-run(مش
You have not asked for any hotel yet." + "Browse the hotel library" /"
""Add a missing hotel
UI 11.16
28: Hotels الطلباتMy كل
Declined
" 11.16 بالأسبابUI libraryاللستة hotel the أساسيBrowse
29: قديمةBookings حجوزات فيه
الفلتر في جديد ومفيش
)UI 03.0B ( "Nothing matches" + "Clear 03.0B فاضية؛UI حالة ﬁltersمش
30: نشاطFinance أي مفيش
خالص
No money has moved yet. Your ﬁrst payment date appears here"
"once a booking is conﬁrmed." + "Open bookings
+ UI 11.18
UI 07.22E
31on-booking: حجزFinance
 النهارده اتأكد
"Paid on conﬁrmation · }date{" 07.20 YOU"UI TO وDUE المبلغ فيه
32 11.19 خطوةUI تحت2
المراجعة
Ask for access to a hotel · Under review · {n} requests with · 2"
"Hoteliana" + "Track the request
UI 11.19
33Draft 3 11.19 خطوةUI
موجود
Build a supply contract · Draft · {contract} · {n}% complete" + · 3"
""Continue the draft
UI 11.19
34 11.19 مشUI لمستخدم
 بدريOwner (اتدعى
Your Owner is setting up وسطر مفاتيحه، بحسب والأزرار قراية، theالخطوات
"account
UI 11.19
35 11.20 عمودUI
WhatsApp
"tooltip "Coming 11.20 LATERعنوانUI · بـWHATSAPP "-" والخلايا later"،
36 11.20 الأحداثUI كتالوج من بالتقسيم9تتضاف choose) to Yours / 11.20Required ناقصةUI أحداث
37 11.20 وجنبهSave"UI تغيير، أول لحد مقفول changes" 11.20"No UI تغييرSave غير من
38 11.20 UI بتغييراتLeave
محفوظة مش
?"Discard changes"OV 03.11
39: the" from Hoteliana Ask stuck, is something When yet. cases فاضيةCasesNo لستة
screen where it happens - the details come with it." + "Ask
"Hoteliana
UI 11.24
40: الجدولChips فوق · Resolved · review In · Open · you on Waiting · بالحالةCasesAll فلترة
Closed (بالعدد) (مقترح
chips UI 08.0
41Case Resolved" + name{بانر }Hoteliana by · }date{ · "Resolved الإجابة؛success:
"Reply within 7 days to reopen it متاحReply" وتحته7" أيام
UI 11.25
42Case }reason{بانر · }who{ by · }date{ · "Closed مفيشneutral: ClosedAsk؛Reply"؛
"about this again
UI 11.25
43" }ref{ "Close سببModal: + )radio?" + the" "Close / open" it case"Keep this الموردClose من
"case
OV 08.24
44Case category "Statement
" wrong فيlooks لسه والكشف
المراجعة
"Dispute this line" + OV 11.22 11.25C BR-11-60UI داخلHint

---

**p. 376**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
45 detail مالوشCase لمشاهد
/ guest.pii
finance.view
Linked" Makkah" Noor Al · HTL-88214 · booking اسم؛Linked غير من
" ADJ-2026-0041 · مبلغentry غير من
UI 11.25B/C
46Admin منCase عنOwner
دخول مشكلة / محجوز
"Screen · Team & 11.22 elseOV "Something والسياقcategory Access"،
)State machine( 7 الحالات.
Notiﬁcation (per account event)
الـBadge منإلىTrigger
—Open
(requires_action)
warning" = action" (أوNeeds لوdanger ساعةdue_at > حدث
)(مقترح
neutral" = "Reminder" · neutral = —InfoحدثInformation"
OpenOpen )re-surfaced( الـreminder نفس على
Thread
warning
من youيخرج حدNeeds أي من اتعمل OpenDoneالأكشن
OpenExpired "Expired عدّىdue_at"neutral
.Open/Done). user( )per state :Read  unread →  read (فتح/أكشن all علىMark مابيأثرش
suppressed  → channel( )per :Delivery  queued →  sent →  delivered |  failed بالسببdanger( queued،
بالسببneutral( ،
Save state (per change): unsaved_local  (warning "Unsaved") → saved_draft  (neutral "Draft") → published
. published  → (success "Live") | publish_failed  (danger "Publish failed")
| signed_out_security  → :Session  active →  warning دقيقة28( active )Stay( |  active؛expired
 deactivated |  locked |  active؛suspended →  active +  خروجpermissions_changed (مش
Case
منإلىمينBadge
Hoteliana(" for )Waiting info = (إنشاءOpen" —Openالمورد
OpenIn review info" = review" (مسكهاHotelianaIn
Open / In reviewWaiting on you answer(" an )Needs warning = you" on حاجةHotelianaWaiting (طلبت
Waiting on youIn ردinfo reviewالمورد
In reviewResolved success" = (بالإجابةHotelianaResolved"
ResolvedIn review خلالinfo رد أيام7المورد
neutral" = بعدSystemClosed" أو7 أيام، الموردHoteliana أو ResolvedClosed،

---

**p. 377**

منإلىمينBadge
Hoteliananeutral المورد أو مكتوب مفتوحةClosedبسبب حالة أي
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
What do · 11.7
?you need
≤ مش1 الشاشة؛ في اللي من مفتاح نعم
Owner-onlyمفاتيح
"Pick at least one thing you need"
Why you · 11.7
need it
characters" 500 under it ≥"Keep حرف500  (مقترحلا
Conflict
resolution
من واحد 2اختيار /( newer نعمKeep
(Apply mine
" resolution" this الاختيارSave لحد مقفول
Conflict · Apply
 (مخزونmine
—allotment≤You cannot set fewer rooms than are already sold ({n})" /"
"Inventory cannot be higher than the contracted
"allotment
· Settings
 اختياريToggle
— مقفولRequired؛Boolean—
Case · about" is this what لمفاتيحه"Pick المسموحة اللستة Categoryنعممن
Case · /" attached" already are details the - two or line a حرف2,000–1Write Messageنعم
""Keep it under 2,000 characters
Case · /" PNG" or JPG PDF, a "Use / MB" 10 than larger is ﬁle 5This Filesلا≤
""Attach up to 5 ﬁles
Case · عند Replyنعم
الإرسال
 على2,000–1 واحد ملف أو حرف
الأقل
"Write a reply or attach a ﬁle"
Case · Close
reason
من نصOther؛3واحد بيطلب نعم"
200 ≥
"Tell Hoteliana why you are closing it"
9 الإشعارات. والإيميلات والسجل
On/Off" في (بيتعرض البوابة أحداث 11.20كتالوج الـ)UI — recipients بـ مفلترين دايمًا required = "Req" =؛BR-11-09.
 اختياري.default
(المستلمIn-appEmailRequires الحدث)بالمفتاح
action
Due
On Request needs an
answer
bookings.confirmReqReqنعمSLA
On Request (نفسReq reminderنفسهم
)Threadالـ
ReqنعمSLA
On Request expiredنفسهمOnOffلا—

---

**p. 378**

(المستلمIn-appEmailRequires الحدث)بالمفتاح
action
Due
Cancellation needs a
charge
ساعة24 bookings.cancellationReqReqنعم
(بعدها
السياسة
تتطبق)
Cancellation applied
automatically
نفسهمOnOnلا—
Amendment waiting
(name change…)
ساعة48 bookings.amendmentReqReqنعم
(بعدها
(Expires
Amendment expiredنفسهمOnOffلا—
Booking conﬁrmed
(instant)
bookings.view_operationalOnOffلا—
Booking cancelled by
the agent
bookings.view_operationalOnOnلا—
Hotel conﬁrmation
number missing
before arrival
الوصول bookings.confirmReqOnنعميوم
12:00
(مقترح
Booking issue case
needs your answer
(Flow 10)
منdueالـ bookings.view_operationalReqReqنعم
Hoteliana
Contract is endingcontracts.viewReqReqCopy toنعم
a new
(period
النهاية تاريخ
Contract paused /
resumed by Hoteliana
contracts.viewOnOnلا—
Stop sale applied
automatically (release
passed)
inventory.viewOnOffلا—
Win list is ready
(Monday 06:00)
rates.edit_draftOnOnلا—
Hotel / room request
decided
hotels.viewOnOnلا—
Hoteliana needs
information (room
request / correction)
hotels.requestReqOnنعم—
Statement is ready to
review
 (+ finance.view أكشن
( statement.accept
الشهر5الـ من ReqReqنعم
23:59
Statement accepted
automatically
finance.viewOnOnلا—
Dispute answeredfinance.viewOnOnلا—

---

**p. 379**

(المستلمIn-appEmailRequires الحدث)بالمفتاح
action
Due
Tax invoice missing
 أيام3(كل
invoice.uploadReq تذكيرReq (حدث
لوحده،
(DECISIONS
نعم—
Payment sentfinance.viewOnOnلا—
Payment came back+) finance.view
( bank.change
ReqReq)Ownerنعم—
Payments paused /
resumed
finance.viewOnOnلا—
An entry was posted
against you
finance.viewOnOnلا—
You owe Hotelianafinance.viewOnOnلا—
Case updated by
Hoteliana
 + الـOnOnلا— عليهCaseمنشئ ردوا اللي
Case waiting on you + الـReqOnنعم— ردواCaseمنشئ اللي
Someone joined or
left your team
users.viewOnOffلا—
Team change by an
Admin
OwnerReqReqلا—
Access request (MVP
notiﬁcation)
Owner + AdminsOnOnلا—
Your role / reach
changed
نفسهReqReqلا— الشخص
Ownership
transferred
الجديدReqReqلا— + Adminsالقديم
Sign-in from a new
device / password
changed / security
sign-out
نفسهReqReqلا— الشخص
Weekly summary of
your account
مستخدم—Offلا— كل
 اللي السجل 11سطور بيطلّعها:Flow
new  → old · Action · الحدثActor
Ask the Owner for accessuser · "Asked for access" · — → {keys, reason}
on{ → off channel: × }event · settings" notiﬁcation "Changed · user الإشعارات(مقترح) إعدادات تغيير
Conflict resolutionuser · "Resolved a conflict" · {cell, your value, current value, chosen}
Retry / Publish again)batch id …" "Published · بـuser العادي، النشر سطر (نفس

---

**p. 380**

new  → old · Action · الحدثActor
Security sign-outhoteliana_user · "Signed out every session" · }reason{ أوsystem أوuser
Session مابيتسجلش (ضوضاء) expired(مقترح
Case created / replied / closeduser · "Opened a case" / "Replied on a case" / "Closed a case" · {ref, category, reason}
Case status by Hotelianahoteliana_user · "Changed a case status" · old → new
)Acceptance criteria( 10 معايير. القبول
A.11
 Request On جديدGiven يتعملWhen عندهمThen اللي كل بيوصلهمbookings.confirm email + والـin-app .1badge،
 = عدد = الجرس youعلى الداشبوردNeeds عدد
. 2."Still needs action Layla ومارديتشGiven الإشعار قرأت تفتحWhen Then you وفيNeeds موجود، لسه العنصر عليهRead
 .3 Layla Given الحجز أكدت Noura اللوحةWhen فاتحة منThen يختفي العنصر you عندNeeds أولNoura (أو اللحظة نفس في
 ماpoll غير ومن حاجةNoura)، تعمل
 .43" 3 علىGiven أحداث When waiting( still reminder, )created, يفتحHTL-88198 Then واحدAll صف 3 مشupdates
" و threadصفوف، the حالةOpen آخر على بيفتح
. 5in-app" الإيميلGiven When الـbounced يفتح bounced address the - Failed · "Email Then وThread ظاهر،
.""Delivered
 .6 When manager Revenue حدثGiven يحصلFinance الإعداداتThen في الحدث شغّل لو حتى عنه إشعار أي مابيوصلوش
 .7.)dedup Thread إيميلGiven اتبعت يحصلWhen تذكيرupdate كحدث متعرّف مش تانيThen إيميل مفيش
see Reservations.11 Given 8. صفحةB بتفتح When الـFinance يرجعAPI missing_permission Then  11.4 بيسمّيUI
 الحاليةﬁnance مفاتيحها وبيعرض .9" Auditor يعدّلGiven بيحاول الـWhen يرجعAPI state_readonly Then  11.6 يظهرUI
Then Banner "This contract has للـ شاشة أي في عمل زرار أي Givenومفيش 10. عقدAuditor. When يفتحهExpired مستخدم أي
 it edit can nobody - رفضexpired لشاشة تحويل غير من .11" link deep تانيGiven مورد لحجز يتفتحWhen 404 عام،Then
  موجود الحجز إن تأكيد أي .12ومفيش Given  11.7 الـOV في When يدوسMVP Then request" the الـSend وكلOwner
 ورابطAdmin والسبب المفتاح فيه إشعار بيوصلهم 08.4 حالةOV ومفيش مكان.Pending، أي في
unsaved. 14. Given "Try 46.11 Given 13. وC تغيير النت12 من فشلوا يعملWhen للصفحةRefresh الـThen متعلّمين12 لسه
 again 12 بسرعةthe مرتين اتداس يستقبلWhen" السيرفر واحدةThen مرة تتطبق التغييرات .)idempotency Publish Given لـ15.
التانية3 في فشل فترات تظهرWhen 11.9 UI الأولىThen now live · التانيةPublished failed"، التالتةPublish Not"،
 بتاريخهاattempted الشغالة النسخة بتقول والشاشة .16"، bulk علىGiven و40 ليلة متعارضة3 37 Then Save والـWhen يتحفظوا،
When 8 أوتوماتيك3 اتكتبت منهم واحدة ومفيش قرار، يستنوا .17 منGiven اتغير مخزون لـ10 بواسطة6 بيحفظLayla والمستخدم
 Then وSave يترفض الحفظ 11.10 الـOV يعرض قيم3
 28.11 Given 18. دقيقةD When تعدّيidle Then  11.30 وOV يظهر، in signed الجلسةStay يمد .19" خلصتGiven الجلسة
unsaved. 20. Given محلية2و تغييرات in back "Sign الجهازWhen نفس على متعلّمينThen" والتغييرين والفلاتر الشاشة لنفس يرجع
تاني جهاز من اتغير يعملWhenالباسورد ده الجهاز Then request  11.13 خرجتOV الأجهزة وكل اتمسحت، المحلية والتغييرات .21،
 When Deactivated Layla أيGiven تعمل Then request  11.14 زرارUI غير من in وإمتىSign قفل مين وفيه .22، دورGiven
Save وشالAhmed اتغير شاشةrates.publish على وهو When يدوسPublish Then Publish  11.15 وOV ومابيخرجش، as،
. rates.edit_draft" draft عندهa لسه لأنه متاح

---

**p. 381**

 Given.11 23. عقدE نشر ما عمره جديد حساب يدخلWhen Then  11.19 UI خلصتGivenو؛ عقوده وكل كده قبل نشر حساب
 مشThen 11.19 العاديةUI الفاضية والحالات .24، Bookings وGiven فاضي 4 When يفتحblockers Then  11.17 بيعرضUI
 الـ 4نفس الأسماءblockers بنفس والداشبورد التقويم في اللي .25 50 ومفيشGiven مؤكد حجز لسهcheck-out يفتحWhen
no payment cycle". YOU TO "DUE Then أولFinance بيقول والسطر المبلغ، فيه جملةcheck-out" ومفيش ودفعه، كشفه وتاريخ
No Given مصدر26. وقعBookings الصفحةWhen يفتح again "Try + bookings" load not "Could مشThen bookings"،
."yet
 When.11 answer" an needs booking Request On "An Given 27. الـF أو الإيميل يقفل يحاول المستخدم Then الاتنينin-app
 بيفتح والضغط 11.21مقفولين، قفلهOV ومين بالسبب .28 Finance اتحولGiven When manager الإعداداتRevenue يفتح
 أحداثThen وأحداثFinance اختفت، بـRates ظهرت الدورdefaults .29 When defaults" role my to "Reset Given يتأكد
 ترجعThen الاختيارية الاختيارات كل الدورdefault
category "A room is not Case.11 Given 30. منG اتفتح 09.3 مشOV غرفة على When mapped  11.22 يتفتحOV الـThen
) والسياقmatched متختارة، أسماءAt…" ومفيش متلزق،
Given .32 أسعار ولا .31ضيوف Case بواسطةGiven اتعمل Faisal When يفتحAbdullrahman Then cases بيشوفهYour
Tier 2. 33. الـHoteliana حولت لـCase When you on يحصلWaiting إشعارThen action الداشبوردNeeds في ويظهر للمنشئ
 Case اتقفلGiven يتفتحWhen ومفيشThen ظاهرين، والسبب وإمتى قفله مين ofﬁce Front Given 34. (مالهاشReply.
 finance.view ) تفتحWhen 11.25C UI ظاهرThen بس والمرجع مخفي المبلغ .35 matched not Room Case اتحلGiven
 الـHotelianaو عملت When يتحدثmapping البيع محرك الـThen blocker  لوحدهROOM_NOT_MAPPED اتشال
11 أسئلة. مفتوحة
اللي كتبناه لحد التعارضالقرار / #الموضوعالفراغ
1 اختيارRequiredالإيميل ولا
الحرجة للأحداث
11.20 UI : Required · "Required Request "؛On
"You can still choose email" : OV 11.21
due 11.20اعتمدنا UI + (فيهBR-11-47
OV 11.21). required نصemail
يتعدل
2Ask the Owner for
access
Pending → 11.7 وOV 11.4 بيقولواUI
"Approved, Declined, or Expired after 7 days
: requestو a as them to الـDECISIONS"؛goes
object Phase 2
بسMVP إشعار = والنصوصBR-11-19 )،
تتعدل
3Daily digestSuppressed - folded into your daily" : OV 11.3
 11.20"؛digest فيهUI summary بسWeekly
digestمفيش الـdaily في MVP ؛(مقترح)
Phase للـfolded_into_digest محجوز
2
11.R REF : names," guest attached: الـNever في وأسعار 4Caseأسماء
Nour prices or details, 11.25B"؛contact فيهUI
Nasser" وAl-Sayed فيه11.25C" 3,540 وSAR
"Al-Amri
: بالمفاتيح،BR-11-55 ومتخفية لايف بتتجاب
مخزنة مش
5Finance empty
UI 11.18
There is no payment cycle… Hoteliana pays what"
Flow 12 +" owed الشهريis الكشف مع بيتعارض
(DECISIONS
 A22 12( يكسبFlow
6No" UI 11.19
payment setup before
you sell. Money comes
".after checkout
on booking contract's" each follows عقودMoney arrivalفيه وon
terms payment (مقترح"

---

**p. 382**

اللي كتبناه لحد التعارضالقرار / #الموضوعالفراغ
7OV 11.15Your role is now Reservations… see rates and"
 yours still are rates مالوشReservations"؛edit
rates.edit_draft
الفعلية المفاتيح من بتتبني الشاشة غلط؛ المثال
8UI مكتوبةReservationsمفاتيح bookings المفتاحcancel 11.4"؛
Handle" = bookings.cancellation
"cancellations
 الـ الأدوارlabelيتوحد محرر مع
9UI 11.5 الكتالوج؛restrictions.editفيه في ومش كمفتاح،
Team & Access scopeوالـ فيhotel موجود مش
 تحت (زيrates.edit_draftالقيود
Permission used · edit a" OV 08.13
Flow 08 #9 draft الـrate سؤالscope")؛
10Ask the" UI 11.6
"Owner for edit access
Auditorللـ
 يبقى )A8(الطلب role" my عملAuditorالـChange مفاتيح مايتدّاش
11OV 11.1Layla was added to your team · Reservations ·"
": you by اتدعت؟invited ولا اتضافت
 منفصلين (للـinvitedحدثين لوinviter" بس،
" Owner ← وAdmin تقبل)joined) (لما
12 الـSLA Request فيOn
OV 11.3
SLA started · 6 hours" vs Bookings BK-5"
(24h/4h/1h)
يتصلح المثال المحرك؛ من
ماعدا Auditorالكل مابيقولش؛REFالـ(مقترح) no "Create… يعمل"Auditor يقدر 13Caseمين
14Case "Statement looks
wrong" vs Dispute
 المراجعة )BR-11-60(أثناء بعدDispute 12بعد؛ المشكلةFlow لنفس طريقين فيه
Caseالقبول
صيغ4 15المراجع،FIN-N-،ISS-YYYY-،CASE-
( CTR-N-
typeاعتمدناها per نفس إنها تأكيد محتاج ؛
في Adminالمراجع

---

**p. 383**

ملحق قرارات: مطلوبة من الـ PO قبل التنفيذ
فلو. كل بتاع المفتوحة الأسئلة قسم في موجودة التفاصيل والقواعد. التصميم بنقرا وإحنا ظهرت اللي التعارضات أهم دي
اللي الملف ماشي #الموضوعالتعارضعليه
اًمؤقت
من للفندق 1الوصول
المكتبة
 24قرار فيSep spec كلهاSupply والشاشات أوتوماتيك، الوصول بيقول
ورفض عمل يومين مراجعة بتعرض
إيه ومكتوب هي، ما زي الشاشات
أوتوماتيك بقى لو يتغير اللي
2On الـ Requestمهلة
SLA)
set by Hoteliana". شاشة يحددها. المورد بيخلي بتقول05.1العقد
)24h / 4h / 1h spec الوصولBookings قرب حسب شرائح فيه
ومكتوب العقد، في بيحددها المورد
تعارض
3 العقد في اللي ولاAuto-rejectالإعداد لـEscalate الـHoteliana يخلصSLAلما
4Paused منفصلين (منPausedاتنين 10.R بيقولREF يوقفHoteliana المورد بتخلي والشاشات بس،
Paused و byالمورد)
Hoteliana
5Scheduled contract قرار 10.Rلازم بشهورREF قبلها بيتحجز رمضان إن والواقع البداية، قبل بيع مفيش بيقول
بسSAR فيه03.1R وUSD والقرارEUR الـSAR، في بس 6العملةMVP
7" سياسةNone" في
الإلغاء
قرار مسترد؟لازم مش ولا مجاني يعني
في سطر على 8الاعتراض
الكشف
07.23B/E/F في18,450بيتدفع الأرقام عليه؟ المتنازع المبلغ بيتخصم ولا كامل
متسقة مش
في يتسوى والفرق كامل، بيتدفع
بعده كشف
09.R وREF و09.1C ولا11.18 دفع دورة "مفيش بيقولوا Flow والماليةdispute". 9الداشبورد
 كده12 عكس
Flow 12
08.R بيقولREF ومكتوب31 33 ولا الفندق، تأكيد لرقم مفاتيح ومفيش الصلاحيات. 10مفاتيح
ولا مشكلة، عن listالتبليغ ولاWin المخصصة، الأدوار ولا النشاط، سجل ولا ،
شخص لكل الفنادق نطاق
فلو كل في مقترحة مفاتيح
11bank.change بسOwner للـ بيدّيها والـAdminالجدول بيقولواFinance والقرار والنص بسOwner،
الـ عند الضيوف 12أسماء
Finance
guest.pii غير من والـguest.piiتتخفي والـExportالكشف أسماء، بيعرضوا مالوشFinance
مقترح فيA27فلو 04 04.R)Flow وREF ليهinventory.edit شاشة ومفيش بيفترضوه، ليلة في الغرف عدد 13تعديل
العقد في مكان قيمتينلازم فيها والشاشات بتحدده، شاشة و420مفيش البيع)500 لسعر الأدنى 14الحد
15Booking window
MaxLOSو
REF 03.R الـ في 10MVPمايظهروش الـFlow برا وهما بيعرضهم، فيMVP ممنوعين أو
الـ في مش 16Statusحالات
glossary
Open approved وPartly pending، وReference pending، وCharge for،
وغيرهاreview ،
فلو كل في مقترحة ألوان
المستندات 17انتهاء
والاتفاقية
 يقرر والأدمن يبيع (بيفضل يبيع01.6القرار بيفضل المورد بيقول والقرار العقود، بيوقف المنتهي المستند بيقول

383 / 383
