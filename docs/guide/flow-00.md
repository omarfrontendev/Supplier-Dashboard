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

# Flow 00 · Portal-wide rules

rules Portal-wide 00: (Flow قواعد عامة على البوابة
)كلها
"BR-00-12" مش ده flowالفلو "حسبuser بيقول تاني فلو أي عليه. بيعتمد تاني فلو كل اللي المشترك السلوك ده "زيP4. أو
 هنا، عن مختلفة قاعدة كتب تاني فلو لو هنا. بسبيرجع الشاشة لنفس تكسب اللي هي نفسه الفلو في المكتوبة لازمالقاعدة وده ،
فيه. صراحة مكتوب يبقى
Chrome 11.Rالمصادر وREF 08.R وREF 00.S وREF 00.E وREF 09.R وشاشاتREF 11، وقسمFlow -،
.DECISIONS top" Shared ( CH.1 OV →  CH.5 الـOV وقرارات فيPO)،
1 الهدف. والنطاق
موجود ده الفلو ليه
والإشعار، والجلسة، والصلاحية، والحفظ، والخطأ، والفاضي، التحميل، الموقف: نفس في الطريقة بنفس تتصرف البوابة في شاشة كل عشان
والتصدير.
. 11.R بيقولREF own" its of logic no has 11 Flow حالة بتعرض نظام شاشة كل بيملكها. اللي هو تاني الشاشةمحرك لو
 المحرك، مع الـاختلفت هي .Bugالشاشة
النطاق ):MVPجوه
barالـ العامTop والبحث والتنقل، CH.1 الحسابOV ومنيو CH.4)، اللغةOV واختيار CH.3)، الصفوفOV وعدد )،
(.OV CH.5 )
Modalالـ وOverlays: وDrawer ماتحفظتشPopover اللي التغييرات وحارس القفل، وقواعد ،
بيانات فيها شاشة أي وخطأ.Loadingحالات نتيجة، ومفيش وفاضي، ،
).UI 11.11  / OV 11.10  / 11.9  / UI 11.8 ( Conflict والـ الحفظ والـDraftموديل والنشر
).OV 11.30  / OV 11.15  / UI 11.14  / 11.13  / OV الأربعة الخروج وأسباب 11.12الجلسة
).OV 11.7  / 11.6  / 11.5  / UI الرفض وأسباب المقفول، مقابل والمخفي المفاتيح، الصلاحيات: 11.4موديل
).REF والألوان الحالات 00.Sقاموس
).OV 04.6P2  / OV 04.6P1  / OV 03.0M pickerالـ الموحّدDate
والوقت. والتواريخ والفلوس الأرقام تنسيق
الـ في الحالة وحفظ والترتيب، والفلاتر، الصفحات، .URLالقوايم:
).Exportالتصدير
 /UI 11.20  / 11.3  / 11.2  / 11.1  / OV you"الإشعارات والـNeeds والتفضيلاتThreads، والتوصيل، 11.0،
(.OV 11.21
.)B/C/D( UI 11.25  / UI 11.24  / 11.23  / OV 11.22  :)Ask Hotelianaالقضايا
من إيقاف موقوفة، مدفوعات منتهي، مستند مستنية، (اتفاقية الحساب مستوى على العامة ).Hotelianaالبانرات
الـ بعد / النطاق :MVPبرا
.MVP. العربي فيRTLالواجهة CH.3: مكتوبةOV soon" الـcoming في مش

---

**p. 8**

.MVP وSMSقنوات وWhatsApp Push يوم، أول من الموديل في متعرفة الـومقفولة: في
 الشركة مستوى على الإشعارات policyسياسة :)Organisation 2 الـPhase غيرResolver. من تتضاف بحيث دلوقتي يتبني
.Migration
P6.6 الرفض شاشة من الحقيقي الصلاحية objectطلب request :)Access الشاشةP2 11.7. الـOV في موجودة (شوفMVP
الـ في سلوكها ).MVPعن
: agentsالـ منفصل.AI ملف ليهم
بيستخدمه: الأدوارمين بكل المورد، مستخدمي كل وOwner وAdmin، manager، وRevenue وReservations، ofﬁce، ،Front
).UI وFinanceو المخصصةAuditor، والأدوار 08.20–08.25،
 الفلو pointsمداخل خاصة:):Entry ومداخل البوابة. في شاشة كل
 إشعار أو إيميل من linkلينك )Deep ← وP5.7 دخول) مسجّل مش (لو صلاحية).P6 مالوش (لو
.OV 11.0  ← Top الـ في الإشعارات barجرس
.OV 11.22 Hoteliana" أيAsk من سببDrawer شاشة أو
. UI 11.24  ← "Your الحساب cases"منيو
).System & empty states" اتقفل الحساب أو اتغيرت، الصلاحية أو خلصت، الجلسة السيستم: 00.Eأحداث قسمREF
2 قواعد. البيزنس
عام
. BR-00-01 الواجهة بس الـإنجليزي في الـMVP من جاية اللي الخطأ رسائل حتى بالإنجليزي، بيتكتب للمستخدم ظاهر نص أي الـAPI.
بيرجّعAPI الجملةerror_code بيختار اللي هو والفرونت ،
"included / not included". BR-00-02 بيشوفها أو بيكتبها المورد اللي الأسعار كل الضريبة 15%شاملة اختيارVAT مفيش
."· incl. VAT" المورد بوابة في ضريبة تفصيل Dومفيش Row 12 كلFlow آخرهLabel). سعر
الافتراضيةBR-00-03 العملة SAR المواعيد كل مكة. بيخزّن)UTC+3بتوقيت السيرفر المستخدم. جهاز توقيت كان مهما ،UTC،
 بيعرض UTC+3والفرونت دايمًا
BR-00-04 بيبدأ الأسبوع الأحد الافتراضي إند الويك جمعة. + بيعلّمخميس عقد جوه تقويم أي بتاعه. إند الويك يحدد ممكن عقد وكل ،
الافتراضي مش ده، العقد إند ويك
 BR-00-05 في تتعمل ممكن لحاجة كاملة صفحة أوDrawerمفيش الرئيسيةModal للصفحات التابات الواحدة). الصفحة (مبدأ
 التفاصيل وصفحات الويزاردات تاباتبس. غير .من
واحدBR-00-06 مكان في بيتعمل فلتر أو عمود أو حالة أو تسمية في تغيير أي أوComponent Dictionary على وينعكس كل)
 مكتوب حالة نص مفيش شاشةHard-codedالشاشات. في
والـ Overlaysالتنقل
.Esc. الـBR-00-07 Drawer بيتقفل بس✕بـ بـ ولا برا بالضغط قفل مفيش
الـBR-00-08 بـModal بيتقفل أوCancel" أو✕ Esc بيقفله برا الضغط فيه. اتكتبت حاجة مفيش لو .بس
). أيBR-00-09 التغييراتOverlay حارس يظهر يمشي، أو يقفلها المستخدم وحاول ماتحفظش، إدخال فيها صفحة أو مفيشP2.4
 تأكيد غير من بيضيع شغل
والحفظ البيانات
.published  ← publish_failed  ← saved_draft  ← unsaved_local  BR-00-10 حفظ حالات أربع  أبدًا :مايتدمجوش

---

**p. 9**

BR-00-11 فشل اللي الحفظ  أبدًا المحلي الشغل عليهامايمسحش متعلّم بتفضل التغييرات بعدunsaved. موجودة وبتفضل ،
.blur الـRefresh كلDraft. السيرفر على بيتكتب (مقترح)10 ثواني الـ وعند
كلBR-00-12 ومعاهBatch بيتبعت نشر أو حفظ Idempotency-Key بتبعت المحاولة إعادة بس. فشلت اللي .العناصر
كلBR-00-13 ليهRecord version قديمة نسخة على الحفظ ومابيتدمجش. الـبيترفض عشان الحالية القيمة بيرجّع والرفض Diff،
يظهر
الـBR-00-14 Conflict بيتحل خلية مالهاشخلية اللي التغييرات شاشة. شاشة مش الـConflict نفس في Batch .بتتطبق
 الـBR-00-15 Conflict على لوحدهInventoryالمخزون بيتحل ما عمره يختار) إنسان لازم كتابة. بآخر
 BR-00-16 بيوصل ما عمره النشر فترةنصه لكل النتيجة بتقول والشاشة تانية، لفترات ويفشل لفترات ينجح ممكن للوكلاء.
الجلسة
بعدBR-00-17 بتخلص الجلسة نشاط30 غير من دقيقة بعد تحذير دقيقة28.  ( 11.30 بدقيقتين.OV قبلها يعني )،
 BR-00-18 الشاشة. بيحدد اللي هو الخروج سبب واحدModalممنوع عام نعرض ممنوع in". back متقفلSign لمستخدم
.(Deactivated)
 BR-00-19 الصلاحيات تغيير خروج والـمش مسجّل، بيفضل المستخدم التعديلDraft. صلاحية عنده لسه لو يتحفظ ينفع بتاعه
الصلاحيات
 BR-00-20 بيتفحص شرط كل الدور باسم مش :بالمفتاح  ممنوعuser.can)"rates.publish"( "Finance". === فيrole
الباك أو الفرونت في مكان أي
 BR-00-21 صلاحية مالوش يشوف العنصر ← خالص مايترسمش ومش يشوف صلاحية عنده موجود. إنه تلميح حتى ولا ←يعمل،
يقدر مين بيقول سطر ومكانه يتشال والزرار تظهر، البيانات
.Tooltip BR-00-22 زرار فيDisabledممنوع أو جنبه مكتوب سبب غير من
BR-00-23 بيسري الصلاحية سحب السيرفر على الجاي الطلب شايلةمن الجلسة الجاي. الدخول من مش ،
المفاتيحpermission_version قراءة بتعيد الجلسة اتغير، ولو ،
لوحدهاBR-00-24 مفتاح ليها والتليفون) والجنسية، الهوية، ورقم (الاسم، الضيف بيانات guest.pii بيفتحها. تاني مفتاح مفيش
. والإيميلاتضمنيًا والإشعارات، والتصدير، العام، والبحث الجداول، على بيطبّق ده
 BR-00-25 الرفض شاشة المستخدم نطاق برا عنصر اسم بتذكر ما الـعمرها في مش (فندق scope بيتكتب مثلاً hotel" غيرthis من
أصلاً يعرفه ماكانش المستخدم لو اسم
 BR-00-26 الإشعار تفضيلاته.مابيوصلش كانت مهما عليها، صلاحية مالوش منطقة عن لمستخدم
الحالات
). كلBR-00-27 بيستخدمBadge حالة Component badge" منStatus وواحد ألوان5 بس القاموسP7 في مش حالة أي
رماديBadgeماتاخدش عادي كنص وتتكتب ،
والقضايا الإشعارات
BR-00-28 you" "Needs =  true = requires_action ده قايمةنفس. you" needs What الداشبورد. في العدد في فرق أي
.Bug =
منBR-00-29 بيخرج العنصر you" Needs لما يتعمل الأكشن وبيخرج يتقري، لما مش اللحظة، نفس في الفريق .لكل
 الكيانBR-00-30 نفس على المتكررة الأحداث واحدThread الـ بيحدّثوا والانتهاء والتذكير الإنشاء لفوق،Thread. ويطلّعوه
الـ جديدة. سطور Threadومابيعملوش على بيفتح حالة .آخر

---

**p. 10**

BR-00-31 وليه أكشن (فيه الإجباري الإشعار Deadline مايتقفلش) الـin-app حد. أي من Toggle بيظهر المقفول ومين اتقفل ليه
.قفله
BR-00-32 Hoteliana" Ask بيعمل و)Caseقضية لوحدها، السياق بتاخد القضية رسالة. مش ولا، ضيوف أسماء بتاخد ما عمرها
. أسعار ولا تواصل وليهبيانات قفلها مين يتسجل ما غير من مابتتقفلش الحساب. كل بيشوفها
السجل
supplier_user / hoteliana_user( BR-00-33 النشاط سجل في سطر بيكتب حاجة بيغيرّ أكشن كل وactor_id actor_type،
api / وsystem الأكشن)، وقت الفاعل ودور timestamp، وUTC وaction_key، وentity_type، ،entity_id،
 وold_valueو وnew_value، source، system( / api / email_link / وportal وip)، السجلdevice (اختياري).
.Owner للـAppend-only حتى
 BR-00-34 السجل بيخزّن ما ولاعمره باسوردات، IDs ولاSession رقمTokens، ولا آخرIBAN، مقنّع: (يتخزّن كامل أرقام4
التصدير
BR-00-35 بيطلّع التصدير بس بيه بتسمح الصلاحية معاللي بس بيظهر الضيف عمود معguest.pii. بس الفلوس وأعمدة ،
 أوbookings.view_financial الصفوف،finance.view عدد الفلتر، إيه، (مين، السجل في بيتسجل تصدير كل الشاشة. حسب
 لأPIIفيه ولا
الأمان
 أوBR-00-36 (دعوة، إيميل في لينك أي أوReset me"، Not إيميل تأكيد أو غيرSingle-use، صلاحية أي ومابيدّيش مدة، وليه
بالظبط بتاعه الأكشن
 والـBR-00-37 الدخول رسائل Reset لأ.مابتكشفش ولا حساب عنده الإيميل هل
)Patterns( 5–3 الأنماط. المشتركة
 و3الأقسام و4 بتاعته5 والاستثناءات المصغّر، والفلو القواعد، فيه: نمط كل مرقّمة. بأنماط اتبدّلت ده الفلو في
Top bar P1 التنقل. والـ
:) UI / Top Bar ( Top bar الـP1.1 مكوّنات
العنصرالسلوكالصلاحية
الداشبوردالكل 09.0يفتح HotelianaلوجوUI
Dashboard")6 09.0الكل الدورUI حسب الكروت 09.R. قاعدةREF
Bookings")Flow معاه لو علىbookings.view_countsيظهر الحجوزات 05قايمة
 معاه لو الأرقامcountsالأقل. على بتفتح الصفحة بس،
سجلات غير من
Rates &
Availability"
)Flow معاه لو أوrates.viewيظهر 04التقويم
inventory.view
"Property""Hotel supply contracts" تابات فيها Hotels"صفحة وMy
Company Library"و وHotel وRequests" &،
agreement"
معاه لو hotels.viewيظهر

---

**p. 11**

العنصرالسلوكالصلاحية
Finance"Finance( OV 07.D  Popover. صفحة بيفتحمابيفتحش
:)menu وOverview وEarnings، وStatements، ،Payments،
Bank وAdjustmentsو invoices، وTax وReports، &،
payment terms
معاه لو finance.viewيظهر
Team & Access"Flow معاه لو 08users.viewيظهر
 التصميم في متعرّف مفتوحمش سؤال ← ماQ-00-01 لحد (أيقونة)Toggle.
الـ من يتشال MVPيتحدد:
—
 CH.1يفتحالكل (أيقونة)SearchOV
 CH.3يفتح OV : now" use in · و"العربيةEnglish (أيقونة)Languageright-
" soon coming · مكتوبto-left والسبب للضغط، قابل (مش
عليه
الكل
Notiﬁcations
نقطة + (جرس
(Unread
. 11.0يفتح تابOV على you" لوNeeds بتظهر الحمرا النقطة
Needs  مقروء. مش عنصر عددفيه = الجرس على you"الرقم
(مقترح) مقروء المش عدد مش
الكل
 +Avatar) Proﬁle
الشركة اسم + الاسم
OV CH.4يفتحالكل
).  يشوفها صلاحية مالوش المستخدم اللي ماتترسمشالقايمة فراغات.BR-00-21( غير من بعض جنب بيتلم الباقي عناصر، اتشالت لو
 حسب بيتعلّم النافيجيشن في النشط الـالعنصر من جزء URLأول (مثلاً تفاصيل صفحة جوه المستخدم لو حتى ،
 /property/contracts/CT-0142 ← نشط).Property"
من الأصغر الشاشات (مقترح)px1024على منيو في بتتلم النافيجيشن عناصر البوابة☰: مدعومDesktop-ﬁrst". عرض وأصغر ،
 (مقترح)px1280 رمادي شريط يظهر كده تحت screen.". wider a on best works الاستخدام.Hoteliana يمنع ما غير من
:) OV CH.4 الحسابP1.2 منيو
." · وتحته الكامل، الاسم الأول: السطر
 حالة سطر تحته عنصر وكل بالترتيب، مكتوبالعناصر مش المصدر من :محسوب
v1.4 waiting for agreement" & "Company ←  01.6 السطرUI accepted". v1.4 documents, proﬁle, أوlegal
 مستنيةacceptance" نسخة فيه لو (أصفر)
 started" "Getting ←  01.5 السطرUI . of done تخلصيختفي". الخطوات كل لما
."No cases yet"". cases" "Your ←  11.24 السطرUI . you on waiting · review قضاياin مفيش لو
."needs attention · linked . hotels" تابMy ← Hotels" السطرMy
 ← inbox" your reaches "What ←  11.20 (UI المنيو في مرسوم لينكمش غير تاني مدخل مفيش لأن هنا، نضيفه مقترح
.) OV 11.0جوه
.ends the session on this device" out" وتحتهSign
out" Sign بيقفل بس ده الجهاز على الجلسة ماتحفظش اللي المحلي الشغل ويمسح ، تأكيد شغلبعد فيه لو علىP2.4 ويروح )،
"You signed out." :Toast 01.2 ومعاهUI
:) OV CH.1 العامP1.3 البحث
. واحدة everything"خانة والفنادقSearch والإتاحة، والأسعار والعقود، التغيير، وطلبات الحجوزات، في: بيدوّر

---

**p. 12**

") بعد يدوّر (مقترح)2يبدأ حروف مع Debounce، (مقترح)ms300 (مثلاً منه جزء أو كامل حجز رقم يشتغل88198.
ده بالترتيب مجموعات في متقسمة وBOOKINGSالنتايج REQUESTS، وCHANGE وCONTRACTS، AVAILABILITY، & ،RATES
" HOTELSو (مقترح)5أقصى. مجموعة كل في نتايج وتحتها all، See الكلمة. نفس على متفلترة بتاعتها القايمة بيفتح
  نتايج مالهاش اللي التصميمتتشالالمجموعة (في فاضية تظهر مش REQUESTS، التصميم).CHANGE في غلط ده ← فاضية ظاهرة
Search only reaches what this account is allowed to.  يفتحهالبحث مسموح الحساب للي بس تحتبيوصل ثابت سطر
open. A hotel you have no access to will not appear here - request access from My hotels instead."
"HTL-88198 · Tue 22 - Fri 25 Sep ·. مع بس بيظهر الحجز نتيجة في الضيف يبقىguest.piiاسم السطر غيره من
 Conﬁrmed" · Only Room · Room Standard الضيف باسم والبحث نتيجة. مالوشمابيرجّعش لمستخدم (عشانguest.pii
موجود الاسم إن مايكشفش
).Drawer و تتنقل، والأسهم (مقترح)، البحث يفتح "/" وEnterالكيبورد: يفتح، (دهEsc يقفل مشPopover
 الـ يفتح نتيجة: على يتقفل.Drawerالضغط والبحث بتاعتها، الصفحة أو
”Check the reference, or search by hotel or contract name.""." + نتيجة مفيش " for matches سطر“No
. خطأ now." right available not is "Search + again" ماتتأثرش.Try تحت اللي الصفحة
 الصفحات:P1.4 جوه التنقل
 فوق رجوع رابط ليها التفاصيل toصفحات Back (مثلاً agreement"" & Company to Back بيرجع القايمة). حالة (الفلترلنفس
.URL) والـ الـScrollوالصفحة من
 فتحBackزرار صح: يشتغل لازم المتصفح في بيضيفDrawer الـdrawer= في والـURL الـBack، بيقفل حارسDrawer (بنفس
).P2.4التغييرات
.Bug).  الإشعار أو الداشبورد في رقم بتاعهكل الفلتر ومعاه الصفحة بيفتح ( 09.R قاعدةREF فلتر9 غير من قايمة بيفتح اللي الرقم
):Global banners العامةP1.5 البانرات
 الـ تحت barبتظهر Top على الصفحة، محتوى فوق الصفحات، تخصهمكل اللي للناس
)  واحد من أكتر فيه لو من1الترتيب موقوف الحساب أحمر: ميعادها،2،Hoteliana) عدّى الاتفاقية أحمر: مستنية3) الاتفاقية أصفر:
انتهى،4قبول، مستند أصفر: موقوفة،5) المدفوعات أصفر: من6) معلومة أزرق: Hoteliana) ظاهرين2أقصى. بانر "+ والباقي ،
" (مقترح).more قايمة بيفتح
  مطلوب أكشن فيه اللي بـمايتقفلشالبانر بـ✕ بيتقفل المعلوماتي البانر بعد✕. ويرجع (مقترح)24 ساعة موجودة لسه الحالة لو
 بيظهر بسالبانر بزرار البانر ← الجديدة الاتفاقية مثلاً: يخصه. اللي أو الأكشن يعمل يقدر للي accept" & للـReview وبزرارOwner ،
).UI 01.6N-R Owner" the to send & (زيReview للباقيين
Overlays P2 الـ.
 الأنواعP2.1
الـ النوعامتىالقفلURL
  أو اتنين)، أو (حقل قصير إدخال أو أب)Modalتأكيد، (بوب
اختيار
Modal. "Cancel" /  ✕ / الـEsc لو بس بيقفل برا الضغط
نضيف
مابيتغيرش
 (منDrawer
اليمين
بس✕?drawer=: أو أقسام، فيه فورم أو كيان، Threadتفاصيل
أو فلتر، أو pickerمنيو، قايمةDate أو Popover،
إشعارات
أومابيتغيرش برا Escالضغط

---

**p. 13**

الـ النوعامتىالقفلURL
بعد— (مقترح)5لوحده ثواني أو ✕، نجح أكشن Toastنتيجة
بس—Route طويل ويزارد أو رئيسية كاملةصفحة صفحة
.)BR-00-05( في تتعمل ممكن لحاجة كاملة صفحة Drawerمفيش
.Overlay. Overlayالـ بيتعمل منها اتفتح اللي الصفحة لكلفوق الصفحة من كاملة نسخة مش
):Stacking التراكبP2.2
. تراكب واحدDrawerأقصى فوقهModal واحد
Back to جوه من Drawerلو الـ العقد)، فتح حجز من (مثلاً تاني كيان فتح المستخدم Drawer  محتواه فوقبيبدّل ويظهر HTL-،
.Drawer مفيش88198" فوقDrawer.
 الـModalالـ فوق الـDrawer بيقفل بسModal
 والكيبورد:P2.3 الفوكس
). الـ جوهOverlayلما محبوس الفوكس الأساسي. الأكشن لزرار أو حقل لأول بيروح الفوكس يفتح، trap الفوكسFocus يتقفل، لما
فتحه. اللي للزرار بيرجع
). فيEnter Modal الأساسي، الأكشن = واحد حقل فيه خطير الأكشن لو إلا أوWithdraw( أوDiscard، لازمDeactivate، الخطير
 أو ماوس Enterضغطة + نفسهTab الزرار على
):Unsaved-changes guard ماتحفظتشP2.4 اللي التغييرات حارس
 يشتغل: امتى (الفورم حقل أي غيرّ أو كتب المستخدم ضغطdirty" وبعدين: أو✕)، أوCancel"، النافيجيشن، في رابط أو فيBack،
.Sign أو التاب، قفل أو أوRefreshالمتصفح، out"،
:OV 03.11 بيدعم الكيان طلبDraftلو أو أسعار، أو (عقد، شكلModal بنفس
Save this draft before you leave?"العنوان
Nothing is live yet. A draft keeps everything you entered."السطر
.Save draft & leave" / "Keep editing" / "Discard"الأزرار
):Ask Hoteliana مفيش أوDraftلو الشركة بيانات تغيير زي قصير (فورم
Discard your changes?"العنوان
What you typed here has not been sent."السطر
.Discard" editing"الأزرار (الأساسيKeep
). أو التاب الافتراضية:Refreshقفل المتصفح رسالة beforeunload نصها. نغيرّ مانقدرش
Could not save the draft. Your changes are still here." leave" & draft فشل:Save الـ خطأModal وعليه مفتوح يفضل
+ again" Try .مانمشيش.
 مابيشتغلش ديالحارس الحالة في الأمان. أو الجلسة بسبب الخروج لو بيحكمP5 اللي هو

---

**p. 14**

P3 حالات. أي شاشة فيها بيانات
المطلوب الحالةبالظبط
 وSkeleton الأعمدة، عدد (نفس الكروت أو الجدول شكل بنفس (مقترح)8 صفوف مش عدّىSpinner). لو النص. في ثواني10 مرةLoading أول
"Still loading…" Skeleton: الـ(مقترح) تحت سطر
 أوLoading فلتر بعد
ترتيب أو صفحة
% شفافية وعليه ظاهر يفضل القديم 50الجدول القديم الطلب تاني، الفلتر غيرّ المستخدم لو ماتتقفلش. الفلاتر فوقه. رفيع ومؤشر
) يتلغي الجديدةAbort( فوق ماتظهرش القديمة والنتيجة
مرة أول فاضي
جديد) (حساب
 زيبتعلّمشاشة خطوة، أول وفيها 11.19 UI بتتختار وتاريخه. الحساب صفربعمر العدد لأن مش ،
فيه كان ما بعد فاضي
بيانات
  بيقول واحد السببسطر ونصه الحالة، من أمثلةمتولد ثابت. مش 11.16 وUI الفنادق)، طلبات (حالات 11.17 (الـUI
 وBlockers البيع)، محرك من 11.18 الجاية)UI (الفلوس
أو للفلتر نتيجة مفيش
البحث
 ﬁlters." these matches زرارNothing + ﬁlters" كـClear ظاهرة النشطة الفلاتر + (زيChips واحدة واحدة تتشال
( UI 03.0B
بس المحتوى مكان load."في not could معروفThis لو السبب سطر + dropped." connection "The / is التحميلHoteliana في خطأ
Toast. responding." زرارnot + again") Try barالـ. شغالينTop الصفحة وباقي كـ مايظهرش الخطأ
الصفحة من جزء
فشل
شغالة تفضل التانية الأقسام الكارت. جوه الخطأ شكل بنفس لوحده ويفشل لوحده بيحمّل قسم أو كارت كل
وإنت اتغيرت حاجة
فاتح
فوقNotice page." this opened you since changed "Something + Refresh" . من شايفه المستخدم رقم مانغيرّش
) UI بصمت تحته ( 09.R قاعدةREF و7 09.4،
فوق رمادي back."شريط is connection the until device this on stay make you Changes offline. are الأزرارYou فصل النت
. سيرفر محتاجة جنبهاAccept،Conﬁrm،Publishاللي بيظهر connection") a والـNeeds يختفي الشريط يرجع: النت لما
 لوحدهاDrafts تتبعت
لو التحميل". في "خطأ (مقترح)3زي بعض ورا مرات شريط دقيقة: خلال it." on are We problem. a having is xx5السيرفرHoteliana
الجلسة نقفل ما غير من
من أزرق :Hotelianaبانر time(." )Makkah 03:00 to 02:00 from Oct 3 on unavailable be will وأثناءHoteliana مجدولة صيانة
 صفحة 03:00."الصيانة: at Back updated. being is Hoteliana أكشن أي غير من
مش الصفحة
)404موجودة
is no longer This. exist." not does page "This + dashboard" the to اتنقلGo أو اتمسح لكيان اللينك لو
".available
.)7  تنازلي بيعدّ اللي الكاونتر SLA( كل بتتسحب نفسها والداتا الشاشة، على ثانية كل بيتحدث دقيقة) ( 09.R قاعدةREF
تلقائيRefresh للـ التاب رجوع عند: Focus ظاهر. كاونتر فيه لو دقيقة وكل المستخدم، من أكشن أي وبعد ،
Conﬂict P4 الحفظ. والـ Draft والنشر والـ
:) 11.9  / UI 11.8 شريطP4.1 في (بتظهر الأربعة الحالات are" you فيWhere
إزاي الحالةالمعنىبتظهر
علامة عليه الحقل أو عدادunsaved"الخلية + (نقطة)  بسunsaved المتصفح في unsaved_localالتغيير
"changes
 والوكلاء الشغل، عنده saved_draftمشالسيرفر
شايفينه
Saved as a draft · 40 seconds ago"
11.9 جزءUI أو (كله فشل publish_failedالنشر

---

**p. 15**

إزاي الحالةالمعنىبتظهر
10:12" 2026, Sep 14 published · بيهLive يشتروا يقدروا publishedالوكلاء
."Live"  والنشر الحفظ منفصلين بتقولأكشنين ما عمرها الشاشة نشر. فيه مكان كل في تقصدSaved" وهي
 والمحلي:P4.2 التلقائي الحفظ
.) user_id + entity + فورًا محليًا بيتخزن تغيير أوIndexedDBكل بمفتاحlocalStorage version،
.blur كلDraft السيرفر على (مقترح)10 ثواني الـ وعند تغيير، فيه لو
"We restored 2 changes that: Refreshبعد على تاني فتح أو المستخدم ونفس الجهاز سطرنفس ويظهر ترجع، المحلية التغييرات
.Discard them" + were not saved yet."
  المحلي فيبيتمسحالشغل out Sign أمني خروج أو المستخدم، بتأكيد أوsecurity_logout Deactivated)، انتهاءوبيفضل. في:
) الصلاحيات.session_expiredالجلسة وتغيير
  الأول للمستخدم المحلي الشغل المتصفح: نفس على دخل تاني مستخدم مايظهرشلو أبدًا. له
):UI 11.8 فشلP4.3 الحفظ
".changes are still on this screen Nothing was lost. All save."العنوان not did changes والسطرYour
:error_code.  بنتيجة مجموعةجدول :كل DO TO WHAT / FAILED IT WHY / WHEN / منWHAT ومترجمة ثابتة أسباب
.Try again" ← "The connection dropped الشبكة mid-request"انقطاع
.Review the conflict" ← "changed these since you opened them " ← Conflict
"Fix the ← )"Inventory cannot be higher than the contracted allotment" ← (مثلاًValidation القاعدة بتاعة الجملة
 الخليةvalue" على (يودّي
"Discard theالأزرار Try الـagain بنفس بس الفاشلين (بيبعت key" وIdempotency the)، Review وconflicts the"،
 changes" unsaved (بتأكيد).
خلصت الجلسة إن الحقيقي السبب الخروجلو شاشة ← ديP5 الشاشة مش )،
):UI 11.9 فشلP4.4 النشر
 حاجة أي قبل الشاشة، في سطر on"أول published you version the seeing are Agents بيتصل." المورد اللي السؤال ده
عشانه.
" / - Publish failed" / "Published · live now". فترة لكل DOجدول TO WHAT / RESULT / ROOMS / النتايجPERIOD
.Not attempted - publishing stopped at the failure"
 again" Publish بيبعت مش بسLiveاللي . live" is what المنشورةSee النسخة على التقويم بيفتح
:) OV 11.10 الـP4.5 واحدConflict كيان على
. 409 يرجع الحفظ لما version_conflictبيظهر
.You are saving" / " , - It is now" / "You opened it with"المحتوى
value"الاختيارات newer the وKeep قيمتك)، (يلغي top" on mine "Apply something"( know you if Only not ")،does
 ﬁrst"و it at look and تضيع).Cancel أو بتتحفظ حاجة (مفيش
:  يختار.المخزونعلى لازم المستخدم متعلّم. افتراضي اختيار مفيش
  مفيش يختار. لازم برضه مثلاً): (سعر المخزون غير مكان.Last-write-winsعلى أي في صامت

---

**p. 16**

 top" on mine الـApply على جديد حفظ بيعمل الـversion نفس ← النص في تاني اتغيرت ولو الجديدة، الأحدثModal بالقيمة تاني
:) UI 11.11 Bulk فيهP4.6 جزئيConflict
".need you .nights were saved of "
NIGHT / YOUR VALUE / CURRENT VALUE / فيها اللي تحتConflictالخلايا وجدول نفسه، التقويم على أحمر بتتعلم
.Resolve" / CHANGED BY
.3  أوDraftاتطبقواالـ عشانLive الكل مابنرفضش المستخدم). اختيار حسب
:Diff الـP4.7
"Before →( Diff تغيير أي Conflictعرض بيستخدم الشركة) بيانات تغيير مراجعة أو النشاط، سجل أو الـComponentنفس،
). كلها.After" البوابة في التغيير لعرض واحدة طريقة
P5 الجلسة. والخروج
 الجلسةP5.1 قواعد
 بعد دقيقة30انتهاء أو كتابة، أو ضغطة، = النشاط نشاط. غير من Scroll المستخدم. بدأه للسيرفر طلب أو مشPollingالـ، التلقائي
.نشاط
).BroadcastChannel  في تابالنشاط (مقترحأي المتصفح نفس على التابات لكل الجلسة بيمدّ
 للجلسة عمر ساعة12أقصى (مقترح). تاني دخول وبعدها نشاط، فيه لو حتى
.  جهازالجلسات تاني.لكل جهاز على مابيأثرش جهاز جلسة انتهاء
):OV 11.30 التحذيرP5.2
"You have been inactive for 28. دقيقة28بعد نشاط غير من Modal minutes" 2 in out signed be will السطرYou
minutes. Anything you have not saved stays on this device and comes back when you sign in again."
.)0:00 ← العنوان في حي تنازلي 2:00عداد
 ← in" signed الـStay ويقفل الجلسة يجدد ← (الأساسي) .Modal now" out عادي.Sign خروج
. OV 11.12 ضغط المستخدم in"لو signed فعلاًStay خلصت الجلسة إن قال والسيرفر
 وضغط تاب، في ظهر التحذير in"لو signed التابات.Stay كل من يختفي التحذير تاني، تاب في
):REF 11.R (منP5.3 الأربعة الأسباب
الشغلالجلسات زرارالمحلي السببالشاشةالدخول
اللي بتقفل
session_expired"You were signed OV 11.12
out because your session
expired."
in" back Sign يرجع ← لنفس
الفلاتر ونفس الشاشة
نفس على بيرجع
الجهاز
ده الجهاز
بس
security_logout"We signed you out OV 11.13
"The + security." السببfor
password on this account was
(changed 2 minutes ago."
 verify" and in (دخولSign
 الجهازFA2 لو حتى إجباري
"This was not + (Trusted
UI 01.3N  ← me"
الأجهزة كل عمدًا بيتمسح
deactivated"Your access to this UI 11.14
+ account has been turned off."
وامتى مين
خالص دخول زرار .مفيش
 /Contact the Owner"
"Contact Hoteliana"
التاريخ بيتمسح.
على بيفضل
الحساب
الأجهزة كل

---

**p. 17**

الشغلالجلسات زرارالمحلي السببالشاشةالدخول
اللي بتقفل
permissions_changed"Your access OV 11.15
changed a moment ago."
الـ خروجDraftبيفضل. مش
لو يتحفظ ينفع
صلاحية عنده لسه
التعديل
حاجة ولا
الـ في مش خامس من:REFسبب اتوقفت كلها الشركة Hoteliana ( account_suspended ده المورد). مستوى على خروج :مش
Hoteliana suspended selling on" )P1.5 أحمرSUP-8 بانر الشاشة: والمالية. والإلغاءات للحجوزات مفتوحة بتفضل البوابة بيقول
 on account your . open stay ﬁnance and changes ".Bookings, + why" مفتوحSee (سؤال قفلQ-00-04. المقصود لو
نفسه الدخول
changes made ." 11.12 تفاصيل:OV بيعرض server the on saved Draft this before seconds - changes وrate
: browser this in only are that وزرارafter my." Copy changes للـunsaved مقروء نص (بينسخ الليلةClipboard" + الكيان
القيمة
The change is in the activity log with the) 11.15 تفاصيل:OV اتشال إيه فضل✕ وإيه
"Copy it." on name الأزرارOwner's draft" a as وSave التعديل)، صلاحية معاه لسه (لو dashboard" my to وGo my،
"You can no longer open this changes" كمان. الشوف صلاحية اتشالت :لو draft" a as يبقىSave والسطر مايظهرش،
screen. Copy your changes to hand them over."
"This was done by :Hoteliana 11.14 تفاصيلUI  2026." Sep 15 on Owner the by done was قفلهThis اللي لو
 …" on وHoteliana Owner" the يتشالContact
 النصP5.4 في الخروج
 طلب رجّعAPIأي session_expired 401 ←  11.12 يشوفOV المستخدم عشان تحتها تفضل (الشاشة الحالية الشاشة فوق
شغله).
.OV 11.13  ← 401 security_logout
.)Overlay deactivated 403 ←  11.14 (مشUI كاملة صفحة
 ← permission_version_changed غير403 من عادي يكمّل مسموحة لسه الحالية الشاشة ولو المفاتيح، قراية بيعيد الفرونت
. OV لأ ولو 11.15رسالة،
 المكان:P5.5 لنفس والرجوع الدخول
. next ← جلسة غير من البوابة جوه لينك 01.2أي ومعاهUI الدخولnext= بعد علىFA2. يروح
).Open redirect). يكونnext لازم داخليPath  بـ (يبدأ بس  من/ (حماية الداشبورد ويروح تتجاهل تانية حاجة أي
المناسبةnextلو الرفض شاشة ← عليه صلاحية مالوش لكيان كلامP6.4 غير من الداشبورد مش )،
):Trusted device الموثوقP5.6 الجهاز
days"خيار 30 for device this فيTrust FA2 01( بيسقطFlow FA2). بس، الباسورد .مابيسقطش
أو الباسورد، تغيير عند: لوحده me"بيتلغي أوNot أوsecurity_logout، الأجهزة.Deactivate، قايمة من يشيله المستخدم إن أو ،
P6 الصلاحيات.
:) REF 08.R (منP6.1 المفاتيح

---

**p. 18**

المجموعةالمفاتيح
Hotels &
contracts
contracts.lifecycle،contracts.edit،contracts.view،hotels.request،hotels.view
Ratesrates.publish،rates.edit_draft،rates.view
Inventoryinventory.overbooking،inventory.stop_sell،inventory.edit،inventory.view
Bookings
(شوف
،bookings.view_financial،bookings.view_operational،bookings.view_counts
guest.pii
Bookings
(عمل
،bookings.amendment،bookings.cancellation،bookings.reject،bookings.confirm
bookings.price_override،bookings.charge_override
Finance،statement.accept،finance.dispute،finance.contact،finance.export،finance.view
bank.change
Users،users.deactivate،users.change_role،users.invite،users.view
users.transfer_ownership
 في 08.Rالجدول فيهREF مفتاح33 بيقول والنص والشاشة31، 11.5". بتعرضUI الجدولrestrictions.edit في ومش
.Q-00-02 ←
ناقصة عشانمفاتيح تتضاف لازم 01 وFlow 00 (مقترحFlow يتبنوا وcompany.view ،company.request_change،
Flow. agreement.acceptو وOwner( بس)، وcases.create فيactivity.view، مكتوبة المؤقتة القواعد تتضاف، ما لحد
).1 القسم01 في بيستخدمه" "مين (جدول
 ← bank.change Owner تاني دور لأي ومايتدّاش بس، (قرار فيPO الجدول 08.R). معلّمREF وAdmin Finance دهyes"
الـ في يكسبREFغلط اللي هو والقرار ،
 :Auditor  وfinance.view bookings.view_financial والـoptional افتراضيًا، (مقفولين للشخص).Owner يفتحهم
. user.can)key, }hotel_id{(  Scopeالـ بتتدّى والحجوزات) والمخزون، (الأسعار، المفاتيح بعض معينة: فنادق .على
 مقفول:P6.2 مقابل مخفي
اللي الموقفيظهر
 نافيجيشن) عنصر أو تاب، أو عمود، أو (كارت، مباشرمايترسمشالعنصر لينك ولو 11.4. الشوفUI مفتاح مالوش
 الزرار تظهر. رمادييتشالالبيانات سطر ومكانه can، Admin an or Owner the Only أو العملOnly." ومش الشوف معاه
." can people with
منتهي (عقد للقراية الكيان بس العمل معاه
 مثلاً)
This contract has expired - nobody can edit وسطر يتشال، it."الزرار
(طلب حالة بسبب مؤقتًا ممنوع الأكشن
 مثلاً) مفتوح
Pending · CHG-00042" الـ أو Checkboxالزرار مقفول السبب :وجنبه
. الواجهة:P6.3 في المفاتيح أسماء في إلا التقني بشكلها للمستخدم بتظهر ما عمرها المفاتيح 11.4 بجملة:UI بتتكتب تاني مكان كل في
…"see guest identity" ← finance.view ← ﬁnance" وsee bookings.confirm، ← bookings" وconﬁrm guest.pii،
الفرونت في واحد ترجمة (جدول
):REF 11.R الرسالةP6.4 بيكتب الرفض سبب

---

**p. 19**

(denial_reason من الـ
(API
شكلالأزرار الشاشةالرسالة
missing_permissionUI 11.4"This screen needs a permission you do not
"What you do have" + الناقصhave." المفتاح
"Nothing is wrong with دوره your(مفاتيح
account."
"Ask the Owner for
 access" / to" >آخرBack
عليه صلاحية عنده قسم
out_of_scopeUI 11.5+ ".but not for this hotel - You have access to"
الـ في اللي scopeالفنادق
Ask the Owner for this
" Back to" / hotel"
state_readonlyUI 11.6+ "You can see this. You cannot change it."
"You are an Auditor…"
"Ask the Owner for edit
"Back to / access"
dashboard"
entity_readonlyUI 11.6
الكيان بنص
This contract has expired - nobody can edit
 الشخصit." مش (الكيان
" to" Back طلب (مفيش بس
يقدر محدش لأن صلاحية
 /account_suspended
deactivated
UI 11.14P5.3Sign inمفيش
.UI مهم منPause Hoteliana ← التعديل مش البيع بيوقف على 11.6مابيودّيش
: فتح المستخدم لو كاملة صفحة الرفض Routeشاشة مسموحة صفحة جوه أكشن على الرفض ولو ماRace. بين اتشالت الصلاحية
." + اتضغط وما اترسم أحمرToastالزرار to permission have longer no You الزرار. ويشيل المفاتيح قراية يعيد الفرونت
).OV 11.15 ( P5.3 ←  الشغلP6.5 أثناء الصلاحية تغيير
:MVP) P6.6 access" for Owner the "Ask ( 11.7 الـOV في
 و موجودة، objectالـالشاشة نفسهRequest الـP2 في الزرارMVP. request" the ماSend لحد (مقترح التالي بيعمل ييجيP2
""  للـin-appإشعاريبعت إيميل + (ولكلOwner معاهAdmin نصهusers.change_role ) for asks " لـ: لينك ومعاه
 08.5 ده.OV للشخص الدور) (تغيير
. السجل في سطر access.requestedيكتب
."You will see the change as soon as it is made . Sent to للمستخدمToast
"Status: Pending → Approved, Declined, or. مفيش Expired / Declined / Approved / الـPending في السطرMVP
.P2 days" 7 after Expired الـ من فيMVPيتشال ويرجع
 اختياريCheckboxالحقول وسبب افتراضيًا)، متعلّم (واحد منها جه اللي الشاشة من ناقص مفتاح لكل مقترح500 حرف
).entity_readonly  المستخدم الـهولو Owner (الـ أصلاً مايظهرش الزرار لوOwner: إلا حاجة، كل معاه
." خلال تاني الطلب نفس بيبعت (مقترح24حد ساعة : on" this for asked You . reminded been has Owner تذكيرThe ويتبعت
واحد.
)REF 00.S ( P7 قاموس. الحالات
اللونالحالات
· Success
أخضر
Active · Approved · Conﬁrmed · Linked · Valid · Paid · Live · Complete
· Warning
أصفر
Pending · Requested · Needs an answer · Invited · On Request · Paused · Expiring soon · Amending ·
Cancellation asked · Amendment asked

---

**p. 20**

اللونالحالات
· DangerRejected · Cancelled · Terminated · Suspended · Declined · Expired invitation · Problem
· Neutral
رمادي
Expired · Draft · Scheduled · Superseded · Locked · Handled · Deactivated · Not started · Available
· Info Hoteliana for حاجةWaiting فيها يعمل مايقدرش المورد حاجة (أي
← "Needs a  القديمة (اتغيرتممنوعةالأسماء 20 :)Sep force" "In ← وActive approved"، "Not ← وRejected decision"،
answer an وNeeds sell"، "Stop ← sale وStop Hoteliana"، "Pending ← Hoteliana for ،Waiting
.asked ← "Cancellation/Amendment requested"و
). القاموس في ومش التصميم في ظاهرة قرار،حالات (لازم الاقتراح:Q-00-03 القرار، لحد
الحالةفينالاقتراح في التصميم
 لـ answer"تتغير an للـNeeds (أصفر) 01.6MOwner اتفاقية)Waiting"OV (نسخة
 Hoteliana" for (أزرقWaiting 11.24 (قضية)Open"UI
 Hoteliana" for فرعيWaiting سطر + (أزرق) review" 11.24"In UI /  review"11.25B (قضيةIn
 answer" an (أصفرNeeds 11.24 UI /  you"11.25 on (قضيةWaiting
 (أخضرComplete" 11.24 (قضيةResolved"UI
 (رماديHandled" 11.24 (قضيةClosed"UI
 (أخضرValid" 07.36 بنكيVeriﬁed"UI (حساب
 Badge سطرApproved" + أخضر approved" 3 of 01.6H"2 approved"UI تغييرPartly (طلب
 غير عاديBadgeمن (نص 01.4D "Unknown"UI / you" (أجهزةNot
  بألوانها. للقاموس تتضاف لازم هي، ما زي القضايا أسماء يسيب عايز التصميم فريق المطور.Badgeمايتعملشلو دماغ من بلون
P8 الـ. picker Date دّالموح
 واحد الشكلينمكوّن البوابة. لكل
Thu 24 Sep): ليالي اختيار ( 04.6P1 OV /  تحت04.6P2 السطر فترة. = تانية وضغطة ليلة، = وضغطة واحد، شهر تقويم
5 weekdays · 2 weekend nights )Thu 24, Fri + "Sun 20 - Sat 26 Sep · 7 nights" night" weekend · أو2026
." Use. changed" already 3 · الزرار25(
"From and to, inclusive - the last night is the night of the إلى - من ( 03.0M خانتينOV وFROM): التقويمTO فوق
.Use 1 - 31 October" الزرارdate."to"
القواعد
).Su Mo Tu We Th Fr Sa(  يبدأ الأحدالأسبوع
 مقفولة فاتت اللي للضغطالأيام قابلة ومش (رمادي للمورد closed." are today before مشDays مكة، تاريخ = "النهارده"
الجهاز. تاريخ
.Weekend in your contract: Th, Fr"  إند والـالعقدويك متعلّم، بيقولLegend
.Already changed" والـ بنقطة، عليها متعلّم خاص سعر ليها اللي :Legendالليالي

---

**p. 21**

." Part of" موسم Seasonجوه مقفولة): التانية المواسم ( 03.14P عليهاOV المقفولة والليالي Tooltip)،
)". -  (Outside the contract" و مقفول، العقد: مدة Tooltipبرا
. اختصارات اللياليChips( اختيار في weekend"): وThis nights" 7 وNext nights" 30 وNext season" إلى:Whole - من في
. month" وThis nights" 30 وNext nights" 90 وNext contract" whole عندThe بيتقص الحدود برا بيطلع اللي الاختصار
."Trimmed to the contract end )31 سطر ويظهر Dec("الحد
Stop sale 7 أكتر أو ليالي تظهر ← (قرارChips عليها هيتطبق اللي الأيام يختار المستخدم عشان الأسبوع أيام 27 .)Sep rates وBulk
.Chips الـReleaseو نفس بيستخدموا الـPicker ونفس
 لوحدهPickerالـ حاجة بيطبّق ما عمره  itself." by anything applies never here range a بس.Picking الحقول بيملى هو
تلقائيًا. يتبدلوا ← "من" قبل "إلى" اختيار
  واحد: اختيار في فترة العقدأقصى يعرضمدة التقويم مختلفين، شهرين في التاريخين ضغط المستخدم لو مقترح). تاني، حد (مفيش
(مقترح). بعض جنب الشهرين
الليالي. وضع في الحالي الشهر قبل لشهر مابيروحش للشهور. ‹ › الأسهم
 و الأيام، بين تتنقل الأسهم وEnterالكيبورد: يختار، تطبيق.Esc غير من يقفل
). متاختارة فترة جوه المقفولة (مثلاًالليالي sale السطرStop في لوحدها بتتحسب skipped"): are nights closed في2 تفاصيلها
.Flow 04
P9 تنسيق. الأرقام والفلوس والوقت
النوعالشكلملاحظات
رقم
صحيح
 هندي (مش لاتيني أرقام دايمًا. آلاف 18,450فاصل
في فلوس
أو جملة
جدول
1,240 SAR"SAR 1,240"(  العملة. وبعده الأول مخلوطالرقم التصميم
). SAR"و (مقترح،620 ده على نوحّد ← الـQ-00-05) كروت في
 وKPI كبير الرقم تحتهSAR": صغيرة
كسور
الفلوس
). صحيح الرقم لو كسور غير SARمن خانتين620 كسر: فيه لو
(620.50 SAR )
 والتصدير) والمدفوعات، (الكشوفات، المالية في دايمًا خانتين
(مقترح)
بس المالية في أحمر بلون SARالخصم 3,540 حقيقية− ناقص بعلامة سالب)U+2212
مسافة15% غير من نسبة
الرقمي الشكل الناس12/09ممنوع بين ملخبط لأنه 2026) Sep الجداول12 في السنة نفس جوه Sep. تاريخ12
+ يوم
تاريخ
Thu 24 Sep 2026
2026 Oct 15 - شهرين12 عبر Oct. 2 - Sep عبر28 فترة.
28 Dec 2026 - 2 Jan 2027سنتين
ليلة آخر = الليالي اختيار في المغادرة. يوم = الإقامة في )P8"إلى"
الاتفاقية (قبول القانونية السجلات ساعة24في 14:35 دايمًا مكة توقيت وقت.
1 Sep 2026 · 10:42 (UTC+3)
وقت
نسبي
.3 h ago ساعة من agoأقل min من22 أقل ساعة24.
. التاريخyesterdayامبارح كده: بعد
 الكاملTooltipالـ والوقت التاريخ عليه
12m 3h in ساعةDue من أقل 42m. in منDue أقل تنازلي10. عد
أحمر دقايق:
الشاشة على ثانية كل بيتحدث

---

**p. 22**

النوعالشكلملاحظات
ليالي
وغرف
2 rooms · 3 nights"1 nights" صح night"مفرد/جمع مش1
E.164بيتخزن ( +966551234567 4567) 123 55 تليفون966
IBAN)4 4417مقنّع ···· ···· ···· 8000 1234SA03 6789 2345 0001 2000 (مجموعاتSA44
حجم
ملف
1.1 MB  / 240 KB
حجز،HTL-88198 تغيير،CHG-00042 طلب عقد،CT-0142 مراجع
/ CASE-20481 اتفاقية،HSA-2026-0142
 ISS-2026-0184 /  FIN-N-2291 /  قضايا،CTR-N-3108
 ENT- /  قيودADJ-
)Hover (أيقونة بضغطة للنسخ قابلة الـCopyالمراجع مع تظهر
).Q-00-06 الـHijriالـ في المورد بوابة في ظاهر مش (مقترح،MVP: المواسم أسماء في غير
URL P10 القوايم. الصفحات: والفلاتر وحالة الـ
الصفوف عدد ( CH.5 OV :) 10 / 20 / 50 / الافتراضي100 (مقترح)20. قايمة لكل مستخدم لكل بيتفتكر الاختيار ،localStorage.
مقترح).
 + الجدول 128"تحت of 21-40 صفحات.Showing أرقام + أسهم
. الـ في القايمة حالة :URLكل  متبعتq=&status=&hotel=&from=&to=&sort=-created_at&page=2&size=20 لينك
  بيفتح الفيولزميل فاتحه).نفس اللي (بصلاحيات
ترجع الصفحة ← ترتيب أو بحث أو فلتر أي .1تغيير
 الـ في الصفحة رقم URLلو خطأ. غير من صفحة، لآخر يروح ← قلّت) (البيانات صفحة آخر من أكبر
One الـ في فلتر الـURLلو برا (فندق مسموحة مش أو موجودة مش قيمته scope الجدول فوق وسطر بصمت، يتشال الفلتر ← مثلاً)
 applies." longer no it because removed was (مقترح).ﬁlter
. guest.pii القايمة في البحث 300ms معDebounce بس بيشتغل الضيف باسم البحث والاسم. المرجع في وبيدوّر (مقترح)،
 الفلوالترتيب: في مكتوب افتراضي ترتيب ليها قايمة كل العمود. جنب سهم الافتراضي. ← تنازلي ← تصاعدي العمود: رأس على الضغط
بتاعها.
 كـالفلاتر: بتظهر وكلChips الجدول، فوق ليهChip و✕ ﬁlters"، Clear واحد. من أكتر فيه لو
 التابات على (مثلاًالأعداد 4" you الـNeeds نفس من بتيجي مشQuery) القايمة، بتاع تاني.Query
.Thread scroll ممنوعInﬁnite الـ (عشان الجداول في وURL الإشعارات قايمة في بس مسموح والتصدير). more" الـLoad في
)Export( P11 التصدير.
. المرسومة 04.11الأشكال وOV 05.14، وOV 06.13، وOV 07.9، وOV 08.12، الهيكلOV نفس كلهم
. 1" FILE THE IN GOES (راديوWHAT The view بسin الظاهرة الصفحة مش صفحاته بكل الحالي الفلتر = (الافتراضي،
."Everything الشاشة حسب جاهز …"اختيار
. 2.("a printable copy") PDF / .xlsx  Excel / ("opens anywhere") CSV :FORMAT
 COLUMNS الفلوس، عمود + القايمة أعمدة نفس بيه: بتسمح الصلاحية اللي .3.بس
 .4.)"The ﬁle is your cost (مثلاً الشاشة حسب ثابت توضيح only…"سطر
. 5."rows Export" / "Cancel"الأزرار

---

**p. 23**

)Finance( OV 07.9  . guest.pii والصلاحية عمود):BR-00-35الأعمدة وGuest" phone" معGuest بس بيظهروا
 ← عمود فيه ودورGuestمرسوم مامعهوشFinance الحجوزاتguest.pii في الفلوس عمود المفتاح. أصحاب لغير يتشال العمود
.finance.export. مع محتاجbookings.view_financialبس نفسه المالي التصدير
rows. We will prepare it and email you a This export has لحدالحجم: (مقترح)5,000 صف  كده من أكتر مباشر. التحميل
1,000 وإشعارlink الخلفية، في بيتعمل ← صالحin-app." واللينك يخلص، لما إيميل + (مقترح)24 ساعة دخول ومحتاج أقصاهPDF
"PDF is limited to 1,000 rows - use Excel or (مقترح) صف وجنبه يتقفل الخيار أكتر ولو CSV."،
 اسمهالملف: (مقترحhoteliana___. بـCSV معUTF-8 عشانBOM الملفExcel في التواريخ (مقترح). العربي الأسماء يقرا
.CSV فيYYYY-MM-DD آلاف فاصل غير من الأرقام الزمنية. المنطقة فيه وعمود مكة بتوقيت والوقت
"Nothing to export - the current ﬁlter shows no rows." صف: وجنبهصفر مقفول الزرار
 فشل أحمرToast again." Try failed. export والـThe مفتوح.Modal يفضل
 سطرالسجل: = تصدير كل وفيهexport.created الصفوف، وعدد والفلتر، (المنطقة، سجلPII في كمان بيظهر ده لأ). ولا
.Hoteliana
.)"A snapshot of the list as it stands right now"  ديلقطةالتصدير اللحظة من
04.11التقويم OV اتنشرتش ما اللي التغييرات الملف): في عليها .متعلّم
P12 الإشعارات.
(منP12.1 الإشعار شكل 11.R REF :)  وtype وpriority، وrequires_action، وdeep_link، وdue_at، ،entity،
. read_stateو
والـpriorityالـ due_at الداشبورد أولويات سلّم من جايين ( 09.R الإشعار.REF على بإيد مكتوبين مش )،
 المستخدم. ملك والمقفول المقروء الحساب. ملك الحدث الكل. عند من العنصر يمسح واحد شخص أكشن بيخلّي اللي ده
):11.2  / 11.1  / OV 11.0 ( Panel الـP12.2
 تابات3 you" وNeeds العدد)، (مع وAll" Read"، على دايمًا يفتح you". علىNeeds وإلا عناصر، فيه لو (مقترحAll"
 you :Needs team." your or you from action an need الـThese بسلّم مترتبة ردك6 مستني حد ← بيخلص (عدّاد مستويات
فلوس ← بتتباع مش حاجة إعدادات/مستنيDrafts← ← الأولHoteliana الأقدم المستوى نفس وجوه )،
3 updates on this booking - :All الأول، الأحدث حاجة، كل فوق بتفضل الأكشن الـوعناصر واحدThread. سطر بيظهر
."Open the thread" + created, reminder sent, answer still missing"
"Reading is not doing. An action item leaves Needs you when somebody does the thing - and it leaves :Read
."Still needs action · Also in Needs you" once." at team whole the for وعليه هنا بيظهر مقروء أكشن عنصر
و والسياق، والمرجع العنوان، سطر: الشدةTagكل action" "Needs / "Information" / "Reminder" / sale" والـBlocking )،
Due 12m"( 3h in وDue Tag)، إيميلEmailed" توصيل فيه لو الأساسيDelivered الأكشن وزرار now"، ورابطAnswer )،
booking"ثانوي the النسبيOpen والوقت )،
نفسه الإشعار على deep_linkالضغط مقروء يتعلّم + بس ده .للمستخدم
.Needs you read" as all "Mark ( CH.2 OV بس. المقروء بيعلّم youعناصر): فيNeeds بتفضل
."My cases" dashboard"تحت the وOpen inbox" your reaches وWhat Hoteliana" وAsk
No فاضي you فاضيNeeds now." right you needs أصفارNothing كروت مش واحد، (سطر جديدAll (حساب فاضي
notiﬁcations yet. You will see bookings, requests and money here."
 تحميل: آخرأول (مقترح)50 و more"، تحتLoad

---

**p. 24**

 غير:Real-time من فوق بيظهر جديد عنصر Refresh أوWebSocket( كلPolling (مقترح)60 ثانية الـ لو والعنصرPanel). مفتوح
." ويظهر بحركة بيتشال السطر زميل، من صغيرToastاتحل  HTL-88198 (مقترحanswered
):OV 11.3 ( Thread الـP12.3
← Still waiting ← Reminder ← SLA started ← Booking created واحد الأحداثThreadكيان زمني: خط بيعرض واحد.
) بأوقاتها.Expires
delivered"قسم was it بحالتهHow توصيل كل In-app: وDelivered" Email، bounced" address the - وFailed Email،
.Not enabled on your account" reminder · digest" daily your into folded - وSuppressed WhatsApp،
"If it ends" thread this :"How instantly." everyone, for you Needs leaves it → answers team the on وAnyone
" and stops being an action item."expiredexpires, the thread closes on "
 Threadالـ على بيفتح حالة آخر دايمًا
 التوصيل:P12.4
. delivery = } channel, status, sent_at, failure_reason كتير توصيلات = واحد {حدث
 وin_appالقنوات email، وMVP( وsms)؛ وwhatsapp، ومقفولين).push، (متعرفين
.suppressed  / failed  / delivered  ← sent  ← queuedالحالات
فيsuppressed اتلمّت أو مقفولة، القناة سبب: وليها عادية نتيجة الإرسال.Digest قبل اتعمل الأكشن أو ،
: رجع اللي للموردBounceالإيميل بيظهر عمل) مستخدم إيميل ولو الإشعار. جنب Bounce (مقترح)3 بعض ورا مرات للمستخدم بانر
Emails toده
.Owner." address email your check to Owner the Ask bouncing. للـare وإشعار
.deliveries واحدBooleanممنوع الإشعارemailed" على Tag الـEmailed" من بيقرا
 القنواتDedup بين لوحده.Thread متعرّف حدث نفسه التذكير لو إلا للتذكير تاني مايبعتش إيميل بعت
:) OV 11.21  / UI 11.20 التفضيلاتP12.5
"These are your settings, not your company's." . user × event_type × channel   مستخدممتخزنة :لكل
 الحل للدور1ترتيب الافتراضي الـ2) سياسة Owner) 2( )Phase ← 3( يقدر المستخدم المستخدم. اختيار أوليضيّق) اللي بس
مفتوح. سابوه اتنين
Deadline + requires_action  = فيه معرّف حدث وrequired_channelsكل optional_channels requiredالـ.
بالإيد). قايمة مش (محسوب
Name off"قسم switched be :"Cannot answer an needs Request وOn expire، to about Request وOn change،
.Account, sign-in and وwaiting amount، charge a needs وCancellation ending، وContract security"،
Hotel choose"قسم to :"Yours conﬁrmed وBooking updated، وStatement posted، وEntry request،
).Digest( Weekly وapproved/declined team، your left or joined وSomeone summary،
 يفتحToggleالـ عليه والضغط قفل، أيقونة عليه المقفول 11.21 اتحسبOV الإعداد وإزاي قفله، ومين مقفول، ليه وإيه3: طبقات)،
يتغير. اللي
in the portal and by email … neither can be switched التصميم في تناقض  11.20 بتوصلUI الحرجة الأحداث بيقول
 وoff" 11.21، بيقولOV choice" your off, or on - ."Email ← Q-00-07 (مقترح. القرار لحد in-app والإيميل دايمًا، مقفول
 ليهاOnمقفول اللي للأحداث منDeadline أقل للباقي24 واختياري ساعة،
security" and sign-in Account, دايمًا email + ومقفولin-app (كود جديد).FA2 جهاز من ودخول الباسورد، وتغيير ،
 وSave" واحدة، مرة التغييرات بيحفظ defaults" role my to Reset بتأكيد

---

**p. 25**

  ده والحدث عليها، صلاحية مالوش منطقة عن إشعار بيوصله ما عمره المستخدم التوصيل: في بتتحكم قايمةمابيظهرشالصلاحية في
 أصلاً. عنده التفضيلات
الجديد. الدور افتراضي بتاخد عليه الجديدة الأحداث الدور: تغيير
 الإيميل:P12.6
. help@hoteliana.com المرسلno-reply@hoteliana.comمن واسم (مقترح)، ."Hoteliana" لـReply-To
 نفس = أساسي واحد زرار فيه إيميل deep_linkكل اللينك الإشعار. بتاع دخول بيسجّل والـمش الدعوة لينكات (إلا Reset والتأكيد).
 ضيوف أسماء ولا أسعار فيه ما عمره الإيميل اسم فيها مايبقاش الحجوزات إيميلات إن (مقترح) ويفضّل الصلاحية. مالوش لمستخدم
البوابة. جوه تبقى والتفاصيل خالص، الضيف
. الساعةDigest اختاره) المستخدم (لو يومي (مقترح)07:00 مكة
)Ask Hoteliana( P13 القضايا.
:) OV 11.22 القضيةP13.1 فتح
زرار Hoteliana"المداخل: أيAsk في سببDrawer وفيBlocker 11.0)، منيوOV وفي والحجوزات، والعقود المالية صفحات وفي ،
.Ask Hoteliana" ← "Your cases"الحساب
 فيه:Drawer
."Opened from: <screen · entity · condition>"
"We picked this for you from where you about?" this is What والأقرب راديو، مسبقًا الفتحمتختار مكان من
"A hotel / "A room is not matched to the hotel library"). drawer" this opened التصنيفات يغيرّه. يقدر المستخدم
"A hotel is missing from the library" / "Something on my statement looks wrong" / request has not moved"
 / else" (تصنيفاتSomething issue. وBooking question وFinance follow-up الشاشاتContract من مدخل ليها
).Flow 07 في 10بتاعتها وFlow
Short is ﬁne - the details are already say?" to like you would منWhat (إجباري، نص لـ10 مقترح2,000 حرف،
attached below."
 automatically" :"Attached وHotel وRoom، وContract، condition، وFailing وScreen، by، (الاسمRaised
Atو بس. .للقراية
 /Identiﬁers, the failing condition, and the screen you came from." :"What we attach, and what we do not"
"No guest names, no contact details, no prices."
. ﬁle" a (اختياريAdd MSG / EML / PNG / JPG / PDF 10لحد، وMB للملف (مقترح5 ملفات
."Cancel" / "Send"الأزرار
 قضية: يفتح يقدر مامين لحد (مقترح منه فتح اللي الكيان على الشوف صلاحية معاه مستخدم أي منيوcases.create من يتضاف).
): else"الحساب مستخدم.Something أي
).read-only: لأنهAuditor (مقترح، قضية ومايفتحش القضايا يشوف يقدر
."Open" + الإرسالP13.2 بعد 11.23 OV :) open" is والحالةCASE-20481 وامتى، ومين، بيه، والمرتبط والتصنيف، المرجع،
/ "See my cases" now" happens :"What … itself." by clears room this on blocker the resolved, is it الأزرارWhen
."Close"
"Case CASE-20481 sent to Hoteliana." كمانToast

---

**p. 26**

waiting on . القضاياP13.3 قايمة 11.24 الأعمدة):UI UPDATE LAST / STATUS / TO LINKED / SUBJECT / فوقCASE
 you الحساب". كل الافتراضيبيشوفها الترتيب بس. صاحبها مش you on بالحالةWaiting فلتر (مقترح). تحديث آخر وبعدين الأول،
. UI صف على الضغط 11.25والتصنيف.
):D  / C  / B  / UI 11.25 القضيةP13.4 تفاصيل
." linked to · المرجع Openedفوق:
Hoteliana is waiting for something from ← Waiting on you منReply"صندوق بجملة الحالةHoteliana من متولدة
Hoteliana is on it - nothing is needed ← In review ."Reply without it" / " Attach the + بالظبطyou." المطلوب
."Add information" + from you right now."
conversation" الاسمThe (للمورد: الاسم رسالة: كل بالترتيب، الرسايل ولـyou: :Hoteliana، Hoteliana" والوقت· ")،
"Captured when you opened it - nothing here was typed by hand." :"Attached to this case"
: ends" one this التصنيفHow من متولد
"To hold the money while it is + "Money held: No - a message does not hold money." :) مالية 11.25Cقضية
).Flow 07( Dispute ← instead." entry the dispute للـchecked, لينك
"The pause stays on until Hoteliana lifts it. You keep managing rates, inventory and :) عقد 11.25Dقضية
bookings in the meantime."
 والرد: ملفات، + نص حقل قضيةSend" على الرد you". on بيرجّعهاWaiting review" (مقترحIn أوتوماتيك
Closed / وسطر:Resolved مقفول، الرد by closed was case This on : ". + Reopen" (مقترح)14خلال يوم كده وبعد ،
 case" new a بالقديمةOpen ومرتبطة
 القواعدP13.5
. openالحالات ←  in_review ←  waiting_on_supplier ⇄  in_review ←  resolved /  الحالةclosed شايف المورد
 دايمًا.
: بصمت بتتقفل ما وليه.عمرها مين بيسجل القفل
 الـ في أسعار ولا ضيوف أسماء context_snapshotمفيش .)BR-00-32(  ⚠  11.25B بيعرضUI Al-Sayed" الهيدر،Nour في
: بيعرض11.25Cو Al-Amri" وNasser SAR" 3,540 و− بيعرض11.25، 1,240" SAR ← التصميم. في غلط يعرضده الهيدر
 بس معاهHTL-88214المرجع المستخدم لو بس يظهر القيد ومبلغ الـfinance.view)، من جاي لأنه القضية.Ledger من مش
(Q-00-08)
"We are checking with the agent whether the guest takes ⚠  و11.25C تانية11.25D قضايا من منسوخة رسايل فيهم
 room" Deluxe )the ← يتجاهلPlaceholder التصميم، في
← "Waiting on you" + من رد إشعارHotelianaأي ← (مقترحin-app عليها ردوا اللي لكل + القضية فتح للي إيميل
 true = ويدخلrequires_action you فتحها.Needs للي
 ليه تصنيف كل Preﬁxالمراجع: ( عام،CASE- حجز،ISS- مشكلة مالي،FIN-N- سؤال CTR-N- عقد). متابعة منPreﬁxالـ
.السيرفر
P14 سجل. النشاط كقاعدة مشتركة
القسم في بيكتب فلو والأكشن9كل الفاعل، بصيغة: الأحداث بتاعه الجديدةaction_key ← القديمة والقيمة )،
system = "Stop sale applied automatically" . :4الفاعلين  وsupplier_user وhoteliana_user، وsystem، api،
.Hotelianaمش
  دوره = السطر في الأكشن.وقتالدور

---

**p. 27**

.)Reset  لينك) (فتح الإيميل من مشالقراية أو إيميل، (تأكيد أكشن نفّذ اللينك لو إلا السجل، في حدث
6 حالات. مش موجودة في التصميم
السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
00-
01
(دور الداشبورد غير قسم أي مالوش مستخدم
 جدًا) ضيق مخصص
Your barالـ فيهTop سطرDashboard" يعرض الداشبورد بس.
role gives you access to the dashboard only. Ask the
"Ask the Owner for access" + Owner if you need more."
+ UI 09.1E
OV 11.7
00-
02
عليها صلاحية مالوش لصفحة مباشر لينك
مسجّل مش وهو
 ← 01.2 UI Login← ← الداشبورد)FA2 (مش المناسبة الرفض شاشة
UI 11.4
00-
03
) OV 07.D ( Finance menuالـ
 معاه بسfinance.viewلمستخدم
غير finance.exportمن
 كامل يظهر أزرارReports"المنيو بس يفتح، تتشالExport" جوه
Only people who can export ﬁnance canومكانها
download this."
OV 07.D
00-
04
ضيف اسم كتب المستخدم العام: البحث
guest.piiومعاهوش
”"." CH.1 "OV for matches مخفية“No نتيجة فيه إن مانقولش عادي.
00-
05
CH.1 خالصOV النتايج من تتشال فاضيةالمجموعة مجموعة العام: البحث
00-
06
now." right available not is "Search + again" الـTry جوه فشل العام: البحث
Popover
OV CH.1
00-
07
 CH.1 5أولOV + all" See متفلترةbookings القايمة ← q=" من أكتر العام: مجموعة5البحث في نتايج
00-
08
 ← CH.3 عليهOV للضغط، قابل soon"مش تحصلcoming حاجة مفيش "العربيةLanguage"زرار.
00-
09
العناصر agreement"نفس & بالبياناتCompany الصفحة بيفتح مش لمستخدم الحساب Ownerمنيو
 مقنّعة 01.6N-Rالحساسة UI .) started" لوGetting يظهر
للقراية ماخلصش، لسه
OV CH.4
00-
10
 CH.4 الحسابOV منيو من يختفي startedالعنصر خلصGetting
00-
11
 بالترتيب2أول سطرP1.5 + more") بيفتح1 فيهPopover 3 الوقت نفس في أكتر أو عامة بانرات
الباقي
UI 01.6Nبانر
00-
12
 ضغط والـBackالمستخدم المتصفح في
 تغييراتDrawer وفيه مفتوح
 التغييرات .)P2.4حارس editing" الـKeep بيرجّع الـURL لحالة
Drawer
OV 03.11
00-
13
Drawer محتواهDrawerالـDrawerأي يبدّل to Back فوق جوهDrawerفتح" من
00-
14
 يمين، تحت ثواني،5أخضر، يترجع✕ ممكن الأكشن لو جوهUndo". Toast أكشن بعد نجاح
)Mark as read (مثلاًToastالـ
—
00-
15
 loading…" الـStill تحت بعدSkeleton ثانية30. is منLoading"This أطول ثواني10
"Try again" + taking longer than usual."
Skeleton

---

**p. 28**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
00-
16
فوق رمادي offline…"شريط are تفضلYou التغييرات أسعارunsaved. بيعدّل والمستخدم فصل النت
. وجنبهPublish"محليًا مقفول connection" a لماNeeds
Back online. Your Toast الـ لوحدهDraftيرجع: يتبعت
changes were saved as a draft."
UI 11.8
00-
17
كاملة 03:00صفحة at Back updated. being is صيانةHoteliana في السيرفر
Refresh time(." غيرMakkah من bar Top بتعمل أكشنز.
دقيقة كل لوحدها
—
00-
18
 / exist." not does page أوThis longer no is booking اتمسح404"This كيان
"Go to the dashboard" + available."
 11.4 (نفسUI
التخطيط
00-
19
 11.7 للـOV دعوة عنده والمستخدم
 شويةOwner من مبعوتة
".The Owner has been reminded . You asked for this on"OV 11.7
00-
20
 11.7 والـOV نفسOwner هو
 شاشة (مثلاً )entity_readonlyالمستخدم
11.6 بسUI السبب بيظهر مايظهرش. الزرار
00-
21
 11.7 ToastOV to" Sent والـ تفضلModal." الشاشة يقفل. 11.4 11.7UI إرسالOV بعد
00-
22
)MVP in-appإشعار مشInformation( you، الـNeeds في "MVP صلاحيةOwnerالـ): طلب وصله
" ←s access' Open" + ﬁnance see for السببasks
OV 08.5
OV 11.1
00-
23
نص في والمستخدم خلصت Modalجلسة
 اتفاقية) بيقبل (مثلاً
11.12 OV يرجع الدخول بعد فوق. والـللصفحة Modal،
تاني يفتحه لما تتسترجع اتكتبت حقول فيه لو بس لوحده، مايتفتحش
(مقترح)
OV 11.12
00-
24
تاب في والمستخدم تاب، في خلصت جلسة
بيشتغل تاني
خلصت لو هتخلص. فمش مشترك، النشاط المتصفح نفس في لو
OV 11.12  السيرفر من تعرض12فعلاً التابات كل ساعة):
OV 11.12
00-
25
بعد مختلف بمستخدم تاني من الدخول
session_expired
  الأول للمستخدم المحلي .مايظهرشالشغل  لوnext يتجاهل
عليه صلاحية مالوش التاني المستخدم
UI 01.2
00-
26
Drawer فاتحDeactivated والمستخدم
شغل فيه
Save 11.14 11.14UI مفيشUI فورًا. كاملة صفحة ومفيشCopy
00-
27
Owner 11.14 بنصUI …" on Hoteliana by done was من.This الـHotelianaاتقفل من مش
 Owner" the وContact يتشال، Hoteliana" يفضلContact
UI 11.14
00-
28
الصفحات كل في أحمر بانر خروج. suspendedمش اتوقفتHoteliana كلها )Suspendedالشركة
Bookings, changes and . selling on your account on
Flow ← open stay ".ﬁnance + why" الإيقافSee تفاصيل
(10
UI 10.2
00-
29
شاشة في مش والمستخدم اتغيرت الصلاحية
متأثرة
." Your access was updated by Toastمفيش أزرقModal.
 + changed" what يفتحSee ← 11.15 المعلومةOV وضع في
OV 11.15
00-
30
الشوف صلاحية واتشالت اتغيرت الصلاحية
الحالية للشاشة
You can no. 11.15 غيرOV من draft" a as السطرSave
longer open this screen. Copy your changes to hand
"Copy my + "Go to my dashboard" + them over."
changes"
OV 11.15

---

**p. 29**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
00-
31
 بحركة يتشال Toastالسطر " HTL-88198 والعددanswered الـ." عنصرPanelالإشعارات: حل وزميل مفتوح
يقل
OV 11.0
00-
32
"Mark all as بس المقروء youبيعلّم علىNeeds والنقطة هو، ما زي يفضل read"الإشعارات
Needs فيه لو تفضل youالجرس
OV CH.2
00-
33
الـ :Panelجوه load." not could "Notiﬁcations + التحميلTry فشل الإشعارات:
. رقمagain" غير من يفضل الجرس
OV 11.0
00-
34
فقد المستخدم أو اتمسح لكيان إشعار
عليه صلاحيته
."is no longer available أو الرفض شاشة يفتح Thisالضغط
في يفضل نفسه Allوالإشعار
UI 11.4
00-
35
ده للمستخدم أصفر toبانر بيعملEmails المستخدم Bounceإيميل
are bouncing. Ask the Owner to check your email
".are bouncing Emails to" Owner." + للـaddress إشعار
 11.3 (قسمOV
التوصيل
00-
36
 غير من وقفل غيرّ المستخدم التفضيلات:
Save
)Draft 11.20 التغييراتUI غيرP2.4حارس من
00-
37
الجدول فوق save."خطأ not did settings "Your + فشلTry الحفظ التفضيلات:
 الـagain" المستخدمToggles. اختيار على تفضل
UI 11.20
00-
38
 من فتح (منDrawerالقضية: سياق مالوش
المنيو)
. account" Your from: الافتراضيOpened التصنيف
Raised else" ."Something automatically" فيهAttached
 وby وAt بسScreen
OV 11.22
00-
39
الأزرار فوق lost."خطأ was Nothing sent. not was case فشلYour الإرسال القضية:
. + again" يفضلواTry والملفات النص
OV 11.22
00-
40
الملف MB."تحت 10 to up · MSG or EML PNG, JPG, مسموحPDF, مش نوع أو كبير ملف القضية:
مايتضافش والملف
 01.6J (نفسOV
الرفع شكل
00-
41
الكيان نفس على مفتوحة قضية فيه القضية:
التصنيف ونفس
CASE-20462 is already open أصفر سطر الإرسال forقبل
Send a / "Open CASE-20462" + this. Add to it instead?"
new case"
OV 11.22
00-
42
Ask press you, blocks something When yet. cases فاضيةNo قايمة القضية:
Hoteliana from the screen where it happens - the
"Ask Hoteliana" + details come with it."
UI 11.24
00-
43
 و القفل، وسطر مقفول، "Reopen"الرد أو14( يوم) new a يردResolvedالقضيةOpen عايز والمستخدم
case"
UI 11.25
00-
44
الكيان صلاحية فقد المستخدم القضية:
المرتبط
 بس الحساب)، (ملك القضية يشوف TO"يفضل يبقىLINKED
لينك غير من نص
UI 11.24
00-
45
05.14 السببOV وجنبه مقفول التصدير صفوفزرار صفر التصدير:
00-
46
 link."سطر a you email and it prepare will يبقىWe والزرار  من أكتر صف5,000التصدير:
We are preparing Toast. export" الضغطPrepare بعد
your export. You will get an email."
OV 05.14
00-
47
in-appإشعار ready." is export bookings +Your خلص الكبير التصدير
This download has "Download" الانتهاء24( بعد ساعة).
expired. Export again."
OV 11.1

---

**p. 30**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني
عليها
00-
48
 عمود فيه والمستخدمGuestالتصدير
guest.piiمامعهوش
 05.14 قايمةOV في مايظهرش الملفCOLUMNSالعمود في ومايطلعش
00-
49
: pickerالـ قبلDate "إلى" اختار المستخدم
"من"
03.0M لوحدهمOV يتبدلوا التاريخين
00-
50
"Next 30: pickerالـ اختصارDate
 العقدnights" نهاية بيعدّي
"Trimmed to the contract end النهاية عند )31يتقص
Dec)."
OV 04.6P2
00-
51
: pickerالـ موسمDate من ليالي فيها فترة
مقفول
Stopped at 10 Mar - مقفولة ليلة أول عند تقف theالفترة
next nights belong to Ramadan."
OV 03.14P
00-
52
 الـ في صفحة رقم URLالقايمة: آخر من أكبر
صفحة
بصمت— صفحة لآخر يروح
00-
53
 longerيتشال no it because removed was ﬁlter الـOne في فلتر مسموحURLالقايمة: مش
applies."
—
00-
54
 11.10 بنصOV by removed was This . change اتعدّلConflictYour (مش اتمسح كيان على
"Close" / "Copy my change" + ".cannot be saved
OV 11.10
00-
55
 top" on mine تانيApply اتغيرت والقيمة
النص في
 11.10 11.10OV الأحدثOV بالقيمة تاني
00-
56
Toast now." prices new the book can Agents بالكاملPublished. ناجح نشر
" Live · published+ الحالة
—
00-
57
رمادي screen."شريط wider a on best works منHoteliana من أصغر px1280الشاشة
منع غير
—
00-
58
عليه ويظهر يتقفل الـSpinnerالزرار الرد. لحد ضغطة أول من صغير  بسرعة مرتين أكشن زرار ضغط حد
 key السيرفرIdempotency على التكرار يمنع
—
00-
59
)Rate limit( Toast try and seconds few a Wait requests. many Too رجع 429أكشن
again."
—
00-
60
Top bar Bar Top / الـUI من يتشال ← متعرّف يتحددMVPمش ما لحد الـToggle)Q-00-01 في
)State machine( 7 الحالات.
 بيتنشر7.1 كيان (لأي الحفظ حالة
منإلىكّالمحرالشكل/اللون
"unsaved"نقطة )Warning( قيمة غيرّ —unsaved_localالمستخدم
unsaved_localsaved_draft"Save أو تلقائي draft"حفظ
نجح
(Neutral · Draft) "Saved as a draft"
unsaved_local+ unsaved_local
خطأ
11.8 فشلUI الحفظ
saved_draftpublished Live الفتراتPublish")Success( لكل نجح

---

**p. 31**

منإلىكّالمحرالشكل/اللون
11.9 UI Problem( · الليDanger للفترات جزء أو كله فشل saved_draftpublish_failedالنشر
فشلت
publish_failedpublished again"Live نجحPublish
unsaved_local— Discard"— بتأكيد
 الجلسة7.2
منإلىكّالمحر
—active موثوقFA2دخول جهاز (أو
activewarning نشاط28 غير من دقيقة
warningactive in" signed نشاطStay أي أو
warningexpired) signed_out  ←( "Sign out أو كمان، now"دقيقتين
activeexpired أقصى12 عمر ساعة
activesecurity_endedReset أو باسورد، me"تغيير أوNot عملتHoteliana،
activerevokedDeactivate
activepermission_version++  + أو دور activeScopeتغيير
activesigned_out"Sign out"
 حساب7.3 (لكل الإشعار عنصر
منإلىكّالمحرTag
—) requires_action ( action" "Needs )Warning( أكشن فيه openحدث
open)re-surfaced( openتذكيرReminder"
من youيخرج للكلNeeds الأكشن عمل الفريق في حد opendoneأي
openexpired علىThreadالـ يقفل عدّىDeadlineالـexpired"
Information" أكشن غير من —infoحدث
). منفصلة المستخدم unreadحالة ←  أوread (بالفتح read as all الحسابMark حالة على مابتأثرش
 التوصيل7.4   queued ←  sent ←  delivered |  (السببfailed مالوشsuppressed (السبب). القاموس،Badge من
 نص نص)،Deliveredبيتكتب (أخضر نص)،Failed (أحمر (رماديSuppressed
 القضية:7.5
(Badge مقترح منإلىكّالمحر)P7
Hoteliana for Waiting ضغط)Info( —openSendالمورد
openin_review Hoteliana for Waiting + استلمهاHotelianaموظفIn
review"

---

**p. 32**

(Badge مقترح منإلىكّالمحر)P7
in_reviewwaiting_on_supplier answer an Needs حاجةHoteliana)Warning( طلبت
Hoteliana for ردWaiting waiting_on_supplierin_reviewالمورد
in_reviewresolved Complete الإجابةHoteliana)Success( + حلتها
السببHoteliana + قفلتها حالةclosed أي
إجباري
(Neutral) Handled
closed  / resolvedin_review Hoteliana for خلالReopen"Waiting يوم14
"Your export الكبيرة7.6 التصدير مهمة   preparing ←  إيميلready + (إشعار (بعدexpired ساعة24 (إشعارfailed
.(failed. Try again."
 الصلاحية7.7 طلب بسP2 للتوثيق ،  pending ←  approved |  declined |  expired أيام7(
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
)OV CH.1 ( Global يبدأ2 عشان الأقل على حروف searchلاTrim
 أقصى (مقترح100للمسافات. حرف
Type at least 2 من (أقل سطر2— حروف:
(characters."
List العام— البحث قواعد searchلانفس
Rows per page
( OV CH.5 )
(افتراضي نعم
(20
 10— / 20 / 50 / بس100
Date picker · يكون لما FROMنعم
موجود
حدود جوه (للمورد)، النهارده قبل مش
العقد/الموسم
This / "Pick a date from today onwards."
date is outside the contract."
Date picker · start the after be must date end ≤"The يتبدلوا)FROM (وإلا TOنعم
date."
Ask the Owner ·
( OV 11.7 ) permissions
على (واحد نعم
الأقل)
need." you thing one least at بسPick الناقصة المفاتيح من
Ask the Owner · characters." 500 under reason the (مقترح)500أقصىKeep حرف reasonلا
Ask Hoteliana · category
( OV 11.22 )
about." is this what القايمةPick من نعمواحد
Ask Hoteliana · need." you what words few a in us "Tell 10/ - (مقترح)2,000 حرف messageنعم
"Keep it under 2,000 characters."
Ask Hoteliana · MSG / EML / PNG / JPG / ﬁlesلا10،PDF
 للملف،MB (مقترح5 ملفات
"PDF, JPG, PNG, EML or MSG · up to 10
"You can attach up to 5 ﬁles." / MB."
Case مفيش لو replyنعم
ملف
 ﬁle." a attach or reply a 1"Write - حرف2,000
Notiﬁcation preference
toggle
صلاحية مالوش حدث مايتغيرش. —المقفول
مايظهرش عليه
—
Export · (افتراضي scopeنعم
(in view"
——

---

**p. 33**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Export · (افتراضي formatنعم
(CSV
 Excel use - rows 1,000 to limited is فوقPDF"PDF مقفول صف1,000
or CSV."
Export · على (واحد columnsنعم
الأقل)
column." one least at بسPick بالصلاحية المسموحة الأعمدة
Conflict resolution
( OV 11.10 )
اختيار resolution"لازم this نعمSave
يختار ما لحد مقفول
Choose how to resolve الزرار جنب it."(سطر
9 الإشعارات. والإيميلات والسجل
سطر السجل old( · action · actionactor مينالقناة؟Requires الحدثيستلمه
(→  new
الجلسة
خلصت
system ·  بسلاsession.expired المستخدمشاشة
إيميل + أجهزته)شاشة (كل أمنيالمستخدم خروج
You were
signed out
on all
devices"
أوsystem supplier_user لا·
· session.security_logout
reason
إيميل + Deactivatedالمستخدمشاشة
Your"
access to
was turned
"off
supplier_user أوOwner/Admin( لا)
· hoteliana_user
Active → · user.deactivated
Deactivated
الصلاحية
اتغيرت
المستخدمToastشاشة
in-app
supplier_user لا·
old> · user.role_changed
→ <role/keys
صلاحية طلب
(MVP)
 Admins + معاهمOwner
users.change_role
in-app +
email
: supplier_user الـ· في MVPلا نعمP2(
→ — · access.requested
Sign out———· supplier_user
session.signed_out
supplier_user ·  .draft_saved Draftحفظ———·
 new → قيمةold (لكل
نشر / نشر
فشل
supplier_user ·  /published شاشةToastلا / الأكشن صاحب
version n → · publish_failed
n+1
 supplier_user اتحلConflict———·
· .conflict_resolved
mine/theirs · value
+ (للكبير)in-app التصدير تصديرصاحب
 يجهزemail لما
supplier_user ·  export.created لا·
area, ﬁlter, rows, pii
+Toastفاتحها اتفتحت) قضية
Hoteliana
supplier_user ·  case.created in-appلا·
open →

---

**p. 34**

سطر السجل old( · action · actionactor مينالقناة؟Requires الحدثيستلمه
(→  new
Hoteliana
طلبت / ردت
حاجة
+ ردواin-app اللي + القضية فاتح
email
لو نعم
waiting_on_supplier
· hoteliana_user
· case.status_changed
in_review → waiting_on_supplier
+ ردواin-app اللي + اتقفلتفاتحها قضية
email
hoteliana_user ·  case.closed لا·
resolved/closed · reason
تفضيلات
الإشعارات
اتغيرت
———· supplier_user
· notification_pref.changed
channel off → on×event
إيميل
Bounce 3
مرات
system ·  Ownerالمستخدمin-appلاdelivery.bouncing
)Acceptance criteria( 10 معايير. القبول
 دورهGiven مستخدم Reservations البوابةWhen يفتح Then وFinance" Access" & الـTeam في مايترسموش bar ولوTop .1،
."see ﬁnance" الـfinanceكتب في يشوفURL 11.4 بالمفتاحUI
. 2 Given manager عندهRevenue الـ3 في فنادق scope لينكWhen من رابع فندق أسعار يفتح يشوفThen 11.5 بالفنادقUI
مكتوب مش الرابع الفندق واسم التلاتة،
. 3 Given Auditor When أكشن فيها صفحة أي يفتح زرارThen ولا ومفيش سطر، ومكانها مرسومة مش الأكشن أزرار غيرDisabled من
سبب
. 4 وعندهGiven أسعار شاشة في مستخدم تغييرات3 unsaved الـWhen يشيلOwner دورهrates.publish من يظهرThen
 11.15 وOV الجاي، الطلب في draft" a as ماضاعتشSave والتغييرات شغال،
 .5 نشاطGiven مالوش مستخدم دقيقة28 يعدّيWhen الوقت يظهرThen 11.30 وOV دقيقتين، بعداد in" signed يجددStay
التابات كل في الجلسة
. 6 محليينGiven تغييرين وفيه خلصت جلسة الجهازWhen نفس على تاني يدخل المستخدم الفلاتر،Then ونفس الشاشة لنفس يرجع
."We restored 2 سطر وعليهم راجعين changes…"والتغييرين
. تانيGiven جهاز من اتغير الباسورد طلبWhen أي تعمل الحالية الجلسة يظهرThen 11.13 وOV يتمسح، المحلي والشغل 7"Sign،
 verify" and بيطلبin موثوقFA2 الجهاز لو حتى
 .8.Sign in مستخدمGiven Deactivated لينكWhen أي يفتح يشوفThen 11.14 زرارUI أي غير من
 .9UI 11.11 Given edit علىBulk و40 ليلة زميل3 من اتغيروا منهم يحفظWhen Then والـ37 يتحفظوا، و3 أحمر، يتعلّموا
.CHANGED BY بـ VALUEيعرضهم وYOUR VALUE وCURRENT
. 10 Given ليلةConflict مخزون على يظهرWhen 11.10 OV وThen افتراضيًا، متعلّم اختيار مفيش resolution" this مقفولSave
يختار ما لحد
. 1112 النتGiven بسبب فشل حفظ يضغطWhen again" 12 the "Try الـThen بنفس بيتبعت الطلب key وللـIdempotency
 والـ تاني28بس، مايتبعتوش اتحفظوا اللي
. 12Agents are seeing the version you لنوفمبرGiven وفشل لأكتوبر نجح نشر تظهرWhen 11.9 UI سطرThen أول
."Not attempted" on published  أكتوبر فيه الفترات وجدول now""، live · ونوفمبرPublished failed" وديسمبرPublish
 .13 Given Request فيOn you عندNeeds مستخدمين3 يردWhen منهم واحد منThen يخرج العنصر you فيNeeds التلاتة عند
الرقم بنفس يقلوا الداشبورد وعدد الجرس وعدد اللحظة، نفس

---

**p. 35**

 .14"Still needs action · Also in إشعارGiven قرا مستخدم Request On تابWhen يفتح "Read" عليهThen ومكتوب يلاقيه
.Needs you" فيNeeds لسه وهو you،
 اتأخرGiven وبعدين تذكير عليه واتبعت اتعمل حجز الإشعاراتWhen يفتح يلاقيThen بـThread واحد updates" آخر3 على وبيفتح .15،
حالة
. 16"Email · Failed - the address عملGiven مستخدم إيميل Bounce الـWhen يفتح Thread بيعرضThen التوصيل قسم
.bounced"
 .17 مستخدمGiven Finance يفتحWhen 11.20 UI والأحداثThen ظاهرة، مش عليها صلاحية مالوش اللي الحجوزات أحداث
 وبتفتح قفل عليها 11.21الحرجة بالسببOV
. 18"A room is فتحGiven مستخدم Hoteliana" منAsk متربطةDrawer مش غرفة سبب الـWhen يفتحDrawer التصنيفThen
 matched…" وnot متختار، automatically" أوAttached ضيف اسم أي ومفيش والشاشة، والشرط والعقد والغرفة الفندق فيه
سعر
. 19 منGiven اتفتحت قضية Reservations When يفتحFinance 11.24 UI الحسابThen ملك (القضايا يشوفها
 Given لـHoteliana قضية حولت you on Waiting الإشعاراتWhen يفتح القضية فاتح فيThen يلاقيها you ترجعNeeds يرد ولما .20،
.Needs you review منIn وتخرج
 .21 مامعهوشGiven مستخدم guest.pii الماليةWhen أو الحجوزات يصدّر عمودThen فيGuest ومش الأعمدة قايمة في مش
. pii = false وسطر فيهexport.createdالملف، السجل في
. 22 فيهGiven تصدير صف12,000 التصديرWhen يضغط صالحThen بلينك إيميل + إشعار ويوصل الخلفية، في يتعمل ساعة24
 Given picker وسبتDate جمعة بتاعه إند الويك لعقد يفتحWhen الـThen Legend Sa" Fr, contract: your in .23،Weekend
مقفولة مكة) (بتوقيت فاتت اللي والأيام
. 24 الصفحةGiven على قايمة بفلتر3 الـWhen ينسخ المستخدم لزميلURL ويبعته الصفحة،Then ونفس الفلتر نفس يفتح الزميل
هو بتاعته بالصلاحيات
. 25 تغييراتGiven فيه فورم أي الـWhen في لينك يضغط المستخدم bar Top وThen يظهر، التغييرات حارس editing" فيKeep بيسيبه
تضيع حاجة ما غير من مكانه
. 26 Given مفتوحDrawer يضغطWhen المستخدم الـEsc برا أو Drawer الـThen مايتقفلشDrawer
 .27 Given فيBadge مش لحالة 00.S REF يرسمهاWhen المطور غيرThen من رمادي نص تظهر (والـBadge مشQA لون أي يرفض
القاموس من
. 28 البوابةGiven جوه لصفحة إيميل في لينك مسجّلWhen مش المستخدم Then Login ← ولوFA2 الصفحة، نفس ← مشnext
 الداشبوردPath يروح داخلي
11 أسئلة. مفتوحة
الوضع الحالي / #السؤالالاقتراح
Q-
00-
01
الـ من تتشال متعرّفة. الـToggle"أيقونةMVPمش في bar إيه؟Top بتعمل mode الـDark قفل ؟Sidebar؟
تتحدد ما لحد
Q-
00-
02
restrictions.edit. في النص المفاتيح: 08.Rعدد بيقولREF فيه31 والجدول و33
 في 11.5ظاهر لـUI مفاتيح وناقص الجدول. في ومش agreement & والقضاياCompany
والسجل
. في المفاتيح قرارP6.1اقتراح محتاج
REF الـPO وتحديث

---

**p. 36**

الوضع الحالي / #السؤالالاقتراح
Q-
00-
03
)"Closed" / "Resolved" / "Waiting on you" / "In review" / القضايا "Open"حالات
REF 00.S وWaiting"و فيVeriﬁed" مش
. في الربط تتضافP7اقتراح أو
بألوانها للقاموس
Q-
00-
04
 الشركة بس؟Suspendedإيقاف البيع ولا الدخول بيقفل 11.R) بيحطREF
 وaccount_suspended الخروج، مع مفتوحةSUP-8 تفضل البوابة بيقول
بس البيع يقفل إنه هنا SUP-اتكتب
(8
Q-
00-
05
SAR"اقتراح الفلوس1,240 1,240"شكل ولاSAR SAR" مخلوط1,240 التصميم ؟
Q-
00-
06
الـ في المواسمMVPمش أسماء غير للمورد؟ يظهر الهجري التاريخ
Q-
00-
07
في إجباريP12.5الاقتراح الحرجة: للأحداث 11.20الإيميل اختياريUI ولا 11.21) )؟OV
Q-
00-
08
REF بصلاحية والمبلغ بس، بالمرجع ضدالهيدر وده ومبالغ، ضيوف أسماء فيها القضايا 11.Rشاشات
finance.view
Q-
00-
09
) requestالـP2لحد الـAccess في للـMVP إشعار (اقتراحOwner: كفاية؟P6.6
Q-
00-
10
والموبايلpx1280اقتراح الموبايلP2، ودعم مدعوم شاشة عرض أقل
Q-
00-
11
 والأحداث07:00اقتراح مكة، فيهDigestالـ بتتلم أحداث وأي الساعة اليومي/الأسبوعي:
 choose" to بسYours

---

**p. 37**

