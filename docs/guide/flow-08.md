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

# Flow 08 · Team, Access & Activity

Activity & Access Team, 08: (Flow الفريق والصلاحيات
وسجل )النشاط
المصادر 12 1327:2Flow Section ( 08.21 ،08.25،08.21B،OV
 08.Rو فيREF هناك اتنقل اللي 26 وSep 08.R)، REF ( تعارض1334:44 فيه لو 08.R). وقراراتREF الشاشة، على يكسب
.11§ )DECISIONS(الـ فيPO مكتوب لقيناه تعارض كل الاتنين. على تكسب
1 الهدف. والنطاق
 موجود: ده الفلو ليه يدخل الشركة من مين بيحدد ده الفلو مراجع). مالية، ديسك، حجوزات، تسعير، (مالك، شخص من أكتر فيها شركة المورد
يتمسح. ولا مايتعدلش بشكل الحساب على حصلت حركة كل وبيسجل إيه، ويعمل إيه يشوف واحد كل البوابة،
النطاق ):MVPجوه
).08.0A–08.0E والدعوات الناس 08.0قايمة وفلاترهاUI
.validation) شخص 08.3دعوة → 08.2 → 08.1 الـOV بكل
).OV 08.4 / 08.5 / التفعيل إعادة الإيقاف، الدور، تغيير شخص: 08.6إدارة
).OV 08.7 / القبول، قبل الدور تغيير دعوة: منتهيةCancelإدارة دعوة 08.15،
).OV 08.8 / 08.8A / 08.8B ( الـ وقفل إنت Ownerحسابك
).OV الملكية 08.14نقل
).OV 08.17 ( الـ رؤية Auditorمدى
).OV 08.21 / 08.21B / 08.25 / 08.23 / مسح تعديل، إنشاء، القايمة، 08.22الأدوار: / 08.20 08.24،UI
).OV 08.10 / 08.11 / 08.12 / 08.13 / النشاط 08.9سجل UI +  08.9A–D + 2 08.16،page
النطاق: برا
). الـ الباسورد، الدعوة، لينك من الحساب 01تفعيل Flow ← me" Not ( 01.2D / 01.1C / 01.1B / 01.1 هناUI
والشخص. للدعوة بيحصل اللي إيه بس بنحدد
.Flow 11 كـ صلاحية فيهobjectطلب )DECISIONS( 2 Phase ← الشاشةApprove/Decline 11.7. فيOV
).REF 11.R ( Owner ← Phase الـ يحطها الشركة مستوى على إشعارات 2سياسة
.IP allow-list ← Phase 2 وSSO
  الحساب: من نهائيًا شخص مسح أبدًا موجود البوابةمش في حاجة أي عمل حد لأي
والمفاتيح: بيستخدمه مين
يعمل يشوف)act( الجزء)view(
والأدوارusers.view— الناس قايمة
 دعوة،Cancelدعوة،
دعوة دور تغيير
users.viewusers.invite
شخصusers.viewusers.change_role دور Activeتغيير

---

**p. 291**

يعمل يشوف)act( الجزء)view(
تفعيلusers.viewusers.deactivate إعادة / إيقاف
users.transfer_ownership مايتدّاشOwner( بس، الملكيةusers.view نقل
دور لأي
الـ Auditorمدى
(OV 08.17 )
users.viewusers.change_role
دور مسح / تعديل / إنشاء
مخصص
users.change_role مخصص مفتاح مفيش users.view(مقترح:
) REF في 08.Rللأدوار
والبحث الشوف النشاط: سجل
والفلتر
 + users.view بيتفلتر(مقترح) سطر كل
)BR-08-44 الـ بتاعهareaبمفتاح
—
 users.view— السجلExport(مقترح
عندها اللي الجاهزة users.viewالأدوار : (Auditor الباقي ،.
Finance تاب) Accessمايشوفوش & خالصTeam الـ في bar top مشHidden( ).Locked،
الدخول نقط
. 1.)People Accessتاب & الـTeam في bar" top ←  08.0 (تابUI
. 2. UI 08.20" الصفحةRolesتاب جوه
. 3. UI 08.9  ← Team & Access" logزرار هيدرActivity في
. 4. UI 08.0  ← "Who has something pending" رابط Accessالداشبورد: & كارتTeam تحت
. 5 teamإشعار your left or joined "Someone / team" your to added was "Layla ←  08.0 الشخصUI على مفلترة
 Drawer(  08.4 مفتوح).OV
 .6 للـ roleإشعار Layla's changed "Tariq يعملهOwner تغيير (أي )Admin" ←  08.16 السجلOV في ده للسطر
. 7 11.7 OV access" for Owner the للـAsk بيوصل اللي الإشعار بيفتحOwner": 08.4 طلبOV اللي للشخص
 .8. OV 08.16 11.15 التغييرOV سطر بيفتح السجل زرار اتغيرت): (الصلاحيات
 .9. OV 08.1  ← "Invite your team 11.19 زرارUI جديد): (مورد
 .10.Users 11.13 أمنيOV (خروج log activity the in are it, triggered who and itself, sign-out "The ←  08.9 مفلترةUI
 .11 فيها شاشة Xأي by أوchanged history" حجزView سعر، (عقد، 08.13" للسطرOV
. 12.Layla 08.23 زرارOV role Layla's "Change ←  08.4 لـOV
 link :Deep  .13/team/activity?who=&area=&when=&q=&page=،team/people/}userId{،team/roles،team
.(مقترح
2 قواعد. البيزنس
الموديل
 BR-08-01 بالمفتاح دايمًا الشرط أيuser.can)"key"( ممنوع "..."(. === )role الباك.if أو الفرونت في
Front :)Built-in فيهBR-08-02 مفاتيح. لستة = الدور جاهزة7 أدوار
.Admin only read · مخصصةAuditor أدوار وفيه الـCustom. يعملها الـOwner) أو
:11 للـBR-08-03 (المرجع المفاتيح كتالوج والـAPI منUI المصفوفة — 08.R) فيREF التعارضات تصحيح بعد

---

**p. 292**

#المفتاحOwnerAdminRevenueReservationsFront
office
FinanceAuditorا
x
م
1hotels.view✓✓✓✓✓✓✓"
2hotels.request✓✓✓––––"
 s
م
3contracts.view✓✓✓––✓✓"
 s
4contracts.edit✓✓✓––––"
 s
م
5contracts.lifecycle✓✓–––––"
 d
 s
 )
6rates.view✓✓✓✓–✓✓"
7rates.edit_draft✓✓✓––––"
 )
ز
8rates.publish✓✓✓––––"
 s
9inventory.view✓✓✓✓––✓"
 y
 )
10inventory.edit✓✓✓––––"
 y
11inventory.stop_sell✓✓✓✓–––"
12inventory.overbooking✓✓✓––––"
 )
13bookings.view_counts✓✓✓✓✓✓✓"
 s
 )
14bookings.view_operational✓✓–✓✓–✓"
 t
 s
15bookings.view_financial✓✓–✓–✓اختياري
(Off)
"
 y
16guest.pii✓✓–✓✓–– (مقفول
)R1في
"
y
17bookings.confirm✓✓–✓–––"
 s

---

**p. 293**

#المفتاحOwnerAdminRevenueReservationsFront
office
FinanceAuditorا
x
م
18bookings.reject✓✓–✓–––"
 s
19bookings.cancellation✓✓–✓–––"
 s
20bookings.amendment✓✓–✓–––"
 s
21bookings.charge_override✓✓–––––"
 a
 e
م
22bookings.price_override✓✓–––––"
 e
 )
23finance.view✓✓–––✓اختياري
(Off)
"
24finance.export✓✓–––✓–"
 e
25finance.contact✓✓–––✓–"
 a
 y
 )
26finance.dispute✓✓–––✓–"
 t
 e
م
27statement.accept✓✓–––✓–"
 s
28invoice.upload✓✓–––✓–"
 s
29bank.change✓––––––م
 ا
 ب
30users.view✓✓––––✓"
31users.invite✓✓–––––"
 e
32users.change_role✓✓–––––"
 s
33users.deactivate✓✓–––––"
 e

---

**p. 294**

#المفتاحOwnerAdminRevenueReservationsFront
office
FinanceAuditorا
x
م
34users.transfer_ownership✓––––––م
 ا
 ب
checkbox عنinvoice.upload اتفصل الأدمنstatement.accept بقرار Sep( )26 الأدوارF7 وبمحرر 08.21 فيهOV اللي
 الـ واحد. والـAdminلكل الاتنينFinance عندهم
. bank.change : بسOwner  نصDECISIONS( + 08.R الـREF جدول إن رغم حاططREF)، والـAdmin شوفFinance
.11§
). doing not is "Seeing BR-08-04 العنصر ← الشوف مفتاح مالوش لو العمل. مفتاح غير الشوف مفتاح مايترسمش": لوHidden(
 سطر ومكانه يتشال والزرار يظهر الرقم ← العمل ومش الشوف )Locked(عنده }action{" can }who{ Only غيرDisabledزرار. من
ممنوع. سبب سطر
 BR-08-05  نتيجةguest.pii أو السجل في سطر (حتى ضيف اسم فيه مكان أي ضمنيًا. بيفتحه تاني مفتاح مفيش لوحده. مفتاح
المفتاح مالوش لو بيتخفى .)BR-08-45بحث)
.Hoteliana الـBR-08-06 حتى دور، ولا الـOwner أو للوكيل، البيع سعر تاني، مورد بيشوف: markup،
Admin والـOwnerالـ
فيهBR-08-07 الحساب بالظبطOwner واحد  غير من حساب مفيش دايمًا. اتنين.Owner، ومفيش ،
 الـBR-08-08 Owner بنفسه.: دوره ومايغيرش مايتشالش، الـمايتوقفش، في متقفل ده الـAPI في مش نقلUI، الوحيد: الطريق بس.
.)BR-08-30الملكية
 الـBR-08-09 ناقصAdmin حاجة كل = وusers.transfer_ownership bank.change بسOwnerالـ. بيشيل أو بيدي اللي
.Adminدور
مشBR-08-10 حد أي مفاتيحOwner وعنده users.* Admin( مخصص) دور أو الـمايقدرش على: حاجة أي يعمل أيOwner ،
.)"not the owner, not another admin, not himself" : REF نفسهAdmin أو 08.R،
 BR-08-11 صلاحيات: تصعيد (الـمفيش عنده. مش نفسه هو مفتاح فيه دور يدّي مايقدرش حد، دور بيغير أو بيدعو اللي عمليًاAdmin
فيها اللي المخصصة الأدوار بيحمي ده بس حاجة، كل users.change_roleعنده (مقترح.)
": Access & Team in themselves on act can "Nobody ولاBR-08-12 نفسه. مدى يغير ولا نفسه، يوقف ولا دوره، بيغير حد ولا
الـ .Ownerحتى
Owner )in-app + يعملهBR-08-13 تغيير أي للـAdmin إشعار بيروح مخصص) دور تفعيل، إعادة إيقاف، دور، (دعوة، الفريق على
)."Every change you make is logged in Activity and sent to Abdullrahman" : UI 08.0E وبيتسجلemail(
الدعوة
" BR-08-14 دور. + اسم + إيميل = الدعوة افتراضي دور زرارمفيش invitation: the السطرSend وجنبه دور، يتختار ما لحد مقفول
".Nothing is sent until a role is chosen - there is no default and no half-access"
 Owner BR-08-15 أبدًا الدعوة في خيار مش  only"( transfer · لشخصOwner بتتنقل الملكية بسActive"). موجود
Flow 01 الموردBR-08-16 ملف في المتسجلة الشركة دومينات = المسموحة الدومينات الشركة. دومين على يكون لازم الإيميل
مرفوضCompany شخصي إيميل دومين وأي ،outlook.com،hotmail.com،googlemail.com،gmail.com)،
،yandex.com،gmx.com،protonmail.com،proton.me،aol.com،icloud.com،yahoo.com،live.com
mail.com يديرها لستة .))Hoteliana(مقترح:

---

**p. 295**

 يظهرBR-08-17 اللي هو يفشل واحد (أول ده بالترتيب بيشيك السيستم الإرسال قبل
 صح .1الصيغة
. مسموح 2.)BR-08-16الدومين
. 3.Locked  الإيميل أصلاً ده الحساب كشخصعلى أوActive
. كشخص ده الحساب على 4.Deactivatedالإيميل
. 5  مفتوحةفيه دهدعوة الحساب على الإيميل لنفس
.  على تانيالإيميل مورد موظفينحساب دومين أو وكيل، حساب أو 6.Hoteliana،
. بيدعو للي مسموح 7.)BR-08-18الدور
بعد بيتقارن وtrimالإيميل lowercase أو. النقط تجاهل غير من .)tag(مقترح:
Only the Owner can give this الـBR-08-18 Admin يدعو مايقدرش أوAdmin خيارOwner لهAdmin. بيظهر بسطرLocked
."role
 الدعوةBR-08-19 لينك بعدtoken بيخلص واحدة، مرة استخدام واحد، أيام7 ساعة)168 أي ومابيدّيش الإرسال، وقت من
."nothing until he accepts بيظهر الشخص يتقبل. ما لحد ومعاهInvitedصلاحية
BR-08-20 أوتوماتيك: تذكيرات الساعةتذكيرين يوم تاني الأول للمدعو: بـ09:00 الانتهاء قبل والتاني مكة، بتوقيت 48 ساعة (مقترح؛
token. بيقول remindersالتصميم 2 and days 7 وafter 09:00" yesterday · 1 sent الـ")Reminders مابيغيرش التذكير
الانتهاء. تاريخ ولا
Resend بيعملBR-08-21 (يدوي): يبقىtoken الانتهاء وتاريخ فورًا، يموت القديم اللينك جديد، الـ7 وقت من أيام Resend .(مقترح)
أقصى 3حد فيResend 24 الدعوة لنفس ساعة .(مقترح
 BR-08-22 القبول: قبل الدعوة دور تغيير القبول. عند هيتفتح اللي هو الجديد والدور اللينك، نفس إيميل داسمابيتبعتش لو إلا
.Resend
 Cancel الدعوة:BR-08-23 الـ الإلغاءtoken وسطر الدعوة سطر فيه يفضل والسجل القايمة، من يختفي والصف فورًا، يموت
) BR-08-24 شخص: مش المنتهية مفيشالدعوة يفضلuser الصف اتدّت. مفاتيح ولا اتعمل، invitation حدExpired ما لحد
" listيدوس the from him مابيتلمسشRemove والسجل بس، القايمة من بتشيله ودي again"، him دعوةInvite بتعمل
نضيفة. جديدة
أقصىBR-08-25 حد 20 للحساب اليوم في دعوة الـ(مقترح) في الناس لعدد أقصى حد ومفيش MVP، .(مقترح)
والإيقاف الدور تغيير
BR-08-26 بيسري الدور تغيير الجاي الطلب شايلةمن الجلسة الجاي). الدخول من (مش اتغير،permission_version ولو ،
  الشخص جديد. من المفاتيح بتقرا وبيشوفمابيخرجشالجلسة 11.15، صلاحيتهOV برا طلعت عليها هو اللي الشاشة لو
What she already did keeps her old role BR-08-27 بدوره بتفضل كده قبل عملها الشخص اللي الحاجات السجلوقتها في
.("next to it
 BR-08-28 سطر):Deactivateالإيقاف وكل والتاريخ الاسم تتفضى. المفاتيح وكل الأجهزة، كل على تقع الجلسات كل يتقفل، الدخول
  السجل همفي ما زي يفضلوا عمل لحد أبدًا مسح مفيش الأقلsign-in. على واحدة مرة
. BR-08-29 التفعيل ):Reactivateإعادة يرجع الشخص الدور الـبنفس مدى وبنفس عليه، كان اللي كانAuditor لو لوAuditor
والباسورد الإيميل بنفس بيدخل جديدة؛ دعوة مفيش للدور. الحالية بالمفاتيح بيرجع ← اتعدل) مخصص (دور اسمه/مفاتيحه اتغير الدور
القديم.
الملكية نقل

---

**p. 296**

BR-08-30 الملكية نقل إعداد: مش الـحدث، شخصOwner بيختار (مشActive مشInvited مشDeactivated، )،Locked،
. على ويعلّم كامل، اسمه understandيكتب I إيميله على بيتبعت اللي التحقق كود يدخل وبعدين تحقق)…"، إعادة خطوة في(مقترح:
 الـ يبقى:transactionنفس المستلم والـOwner يبقىOwner، القديم شيء").Admin "لا (مش
عملBR-08-31 يكون لازم المستلم sign-in الأقل على واحدة مرة .(مقترح)
 الـBR-08-32 طرف من رجوع مفيش تانيOwner بنقل يرجّعها يقدر بس الجديد المالك القديم:
 الـBR-08-33 لو إيميلهOwner فقد أو يستلم، حد ومفيش ماشي Hoteliana في السطر الشركة. سجل من تتأكد ما بعد بتنقل اللي هي
. hoteliana_user  = Actorالسجل
Auditorالـ
finance.view الـBR-08-34 عندهAuditor البوابة. كل على بس للقراية اختيارية2 مفاتيح  افتراضيًاOff
الـbookings.view_financialو الـOwner، أو Admin يفتحهم لوحده شخص منلكل 08.17 OV .  guest.pii للـ مقفول
").stays off for an auditor in Release 1 فيAuditor 1 Release بسطرToggle( ومقفول ظاهر
المخصصة الأدوار
. BR-08-35 الجاهزة الأدوار وماتتمسحش .ماتتعدلش وOwner changed be "Cannot غيرAdmin: ومن الباقي:Duplicate"
 بيفتحDuplicate" 08.21" الدورOV بمفاتيح مليان
" الأقلBR-08-36 على واحد ومفتاح الحساب، في فريد إجباري اسم المخصص: الدور role مفتاح،Create يتعلّم ما لحد مقفول
".Pick at least one thing this role can do. Create role stays off until you doوتحته
.users.transfer_ownership BR-08-37 مفتاحين  أبدًا الأدوارمايظهروش محرر في وbank.change
 BR-08-38 (مقترح): المفاتيح متعلّماعتماديات العمل ما طول وبيقفله أوتوماتيك بتاعه الشوف مفتاح بيعلّم عمل مفتاح أي
. rates.view  ← rates.publish وrates.edit_draft
. inventory.view  ← inventory.overbooking وinventory.edit وinventory.stop_sell
. contracts.view  ← contracts.lifecycle وcontracts.edit
. bookings.view_operational  ← bookings.confirm/reject/cancellation/amendment
. bookings.view_financial  ← bookings.price_override وbookings.charge_override
 guest.pii ←  أوbookings.view_operational الأقلbookings.view_financial على منهم (واحد
. finance.view  ← invoice.upload،statement.accept،finance.export/contact/dispute
. users.view  ← users.invite/change_role/deactivate
. hotels.view  ← hotels.request
.bookings/rates/inventory/contracts وbookings.view_counts مفتاحhotels.view أي مع بيتعلّموا
Changes apply to everyone with this"( )BR-08-26( BR-08-39 على بيسري مخصص دور تعديل فورًا عليه اللي الناس كل
.("role the moment you save
BR-08-40 مايتمسحش. ناس عليه اللي ناسالدور "عليه Invited + مفتوحةActive (دعوة Deactivated عشان (مقترح:
. الدور) نفس ترجّع التفعيل مابتعدّشإعادة المنتهية الدعوة
الـBR-08-41 من نهائي المسح بمفاتيحه.UI موجود كان الدور إن فيه بيفضل والسجل ،
أقصىBR-08-42 حد الدور20 واسم للحساب، مخصص دور 40–2 حرف .(مقترح
النشاط سجل

---

**p. 297**

السجلBR-08-43 مفيشAppend-only ولاEdit: ولاDelete، الـClear، حد: لأي ولاOwner، السطرHoteliana، صاحب ولا ،
بيفضلوا والاتنين جديدة، بحركة بيتصلح الغلط
فيهBR-08-44 بيتخزن سطر كل occurred_at،actor_role_at_time،actor_type،actor_id )،UTC(
screen/API/system( entity_id،entity_type،area،action_key source،new_value،old_value)،s(
وbatch_id،permission_used)،job فيه، لو وip device اختياري. بتاع الشوف مفتاح عنده لو بس للمشاهد بيظهر سطر
Rates ← rates.viewInventory ← inventory.viewBookings ← بتاعتهareaالـ ( bookings.view_counts،
(users.view  ← Finance ← finance.viewHotels/Contracts ← hotels.view / contracts.viewUsers
.(مقترح
:guest.pii) (عمودBR-08-45 السجل جوه الضيوف أسماء touched it record الـThe البحث، مالوشExport"، لمن بتتخفى
 بس المرجع سطورHTL-88191بيظهر في المبالغ الاسم. غير من مالوشFinance) لمن بتتخفى أوfinance.view
bookings.view_financial .(مقترح)
BR-08-46 = بيظهر اللي الدور الحركة وقت النهاردهدوره دوره مش ،
 4 فاعلينBR-08-47 أنواع   (يظهرsupplier_user team مجهولhoteliana_user")،your مش ووظيفته، (بالاسم
release operations" Hoteliana · Tarek system")،Reem automation"( · زيSystem sale"، الـStop لما أوتوماتيك
.Hoteliana apiيعدي)، JW-441"( token · API · تجميعChannel ممنوع وsystem"). تحتapi
Kept وبعدهاBR-08-48 المورد، اتفاقية مدة طول بيتحفظ السجل المدة: 5 الأقل على سنين بتقول الشاشة until:(مقترح؛
.)11" — ends شوفContract قرار، محتاج
Newest. 20 الصفحةBR-08-49 في سطر 08.9 UI : 20" page الـper في بيتحفظوا والصفحة والفلتر الافتراضيURL")، الترتيب
."Last 30 الافتراضيةﬁrst والفترة days"،
 Export آخرBR-08-50 / بالفلتر ظاهر (اللي المستخدم بيحدده اللي بيطلع العقد30: بداية من حاجة كل / يوم أوCSV أوPDF
 Excel من أكتر لو صالح5,000. كلينك بالإيميل بيتبعت ← سطر 7 أيام الـ(مقترح) السجلExport. في كسطر بيتسجل نفسه
.) OV BR-08-51 بيتسجل الصلاحية تغيير سطر مفتاح مفتاح had( never / kept / بسgained الدور اسم مش 08.16)،
 الـBR-08-52 حدث بيتسجلsign-in الدعوة قبول بعد الأول log activity the in appears sign-in ﬁrst كلHis بعدsign-in").
. في بيتسجل Usersكده أمنيsign-in(مقترح خروج + متكرر فشل + ناجح
)Happy path( 3 الفلو. الأساسي
)Reservations وقبوله3 شخص دعوة يدعوOwner.أ
 يشوف  08.0 تابUI 4 People: كروت .1،
بالعددChips فلترة 1 Deactivated · 1 Expired · 1 Invited · 5 Active · 8 جدولEveryone ")،
SEEN( كارتLAST وتحته reaches)، role each What يعمل".
) someoneيدوس Invite يفتحالسيستم:". 08.1 OV فاضيModal(
. 2hint "It has to be a Jewar Al-Safwah address - a personal" يشوف  08.1 OV : EMAIL" بالـWORK
" refused is أدوارmailbox ولستة ONE"، PICK · REACH THEY SHOULD +WHAT المخصصة + المسموحة الجاهزة (الأدوار
 (للـAdmin بسOwner only "transfer Owner دايمًا). مقفول يعمل:" والإيميل. الاسم يكتب الـالسيستم: على بيعملblur
.)E1–E6 5) الإيميلcheck خطواتBR-08-17 فورًا6–1 الحقل تحت الخطأ ويعرض
 .3answers bookings, sees availability ·: يختاريعمل: Reservations لـالسيستم:". يحوّل 08.2 بملخصهOV المختار الدور
Inventory · ورابطBookings role"، another وكارتPick see"، not will and will Khalid (What بالمساحات ،"
Send the…". أخضر؛Inventory وسطرUsers رمادي)، supplier another see never will زرارHe
.Active" يبقىinvitation

---

**p. 298**

 يعمل invitation" the Send .4السيستم".
).BR-08-17 الـ كل السيرفرchecksيعيد على
ينشئ
id, auditor_reach?, invited_by, sent_at, expires_at = sent_at + 7d, token_hash, status=open}
.)"invited you to }Company{ on Hoteliana }Inviter الدعوة إيميل مقترحSubjectيبعت
.Khalid Al-Amri · Reservations  · "Invited a person" · سجل users.inviteسطر
.Owner )BR-08-13( ← دعا اللي للـAdminلو إشعار
Expires · In 7 days · }weekday day": لـ يروح  08.3 OV way" its on is invitation والدور،The والإيميل الاسم
" وزرارينmonth{ else"، someone (يرجعInvite 08.1" وOV فاضي) team the to يظهرBack الجديد والصف (يقفل،
 معInvited الجدول أول في ثانيتينhighlight
 اللينكالمدعو يفتح 01 Flow ( 01.1 UI الباسورد. يحط الـالسيستم:) يتعملtoken يتحرق، الدعوةuser بالدور، .5،accepted
sign-in = يبقى سجلActiveالصف سطر invitation، the "Accepted وأولActor( الجديد)، الدور = دوره نفسه، الشخص
Someone joined or" :11.20 إشعار teamيتسجل. your joined عندهمKhalid اللي لكل دهusers.view" الحدث واختاروا
"(.left your team
شخص3 دور تغيير .ب
 .1Last الجدول Laylaمن "Manage ←  08.4 OV بـDrawer( يتقفل والحالة،✕ والدور والإيميل الاسم بس):
A new role takes effect the moment by ولستةAdded REACHES"، SHE WHAT والسطرCHANGE you"،
."Deactivate her account" · "Cancel" · "Save the new again in sign not does she - it وأزرارsave role…"،
 .2 جديد دور roleيختار new the يبقىSave الحاليActive" غير الدور لو بس
. 3"SHE GAINS" / "SHE LOSES}New{ → }Old roleيدوس new the "Save ←  08.5 OV Modal( عنوان تأكيد):
"Who picks them up" nowبالمساحات، هتخسرها)،Right اللي المساحات في المفتوح (شغلها
Losing an area الناس كل المفاتيح: من ده)،Active(بتتحسب العمل مفتاح عندهم اللي log والتحذيرThe is"،
…".the part people miss
 .4 role" the يغيرChange السيستم: ← يزودrole_id" سجلpermission_version، سطر بمفاتيحusers.change_role،
had gained/kept/never ( 08.16 نفسهOV للشخص إشعار }New{)، to changed role "Your email: + للـin-app وإشعار ")،
."Toast "Layla Hassan is now }New{ غيرّOwner اللي لو Admin لـ. يرجع  08.0 معUI
 .5. OV 11.15 أولLaylaجلسة المفتوحة: صلاحيتهاrequest في مابقتش شاشة على هي لو المفاتيح. بيقرا كده بعد
التفعيل3 وإعادة الإيقاف .ج
 .1Deactivate her account" ← OV 08.6Can you" ← OV 08.4من
".Deactivate instead her وزرارDeleting her"،
 والـdeactivated_at،deactivated_by،status=deactivatedالسيستم الجلسات كل يمسح tokens، يفضيّrefresh .2،
 سجل سطر personالمفاتيح، a البوابةDeactivated فاتح لو الشخص 11.14". الـUI في الجدولrequest في الصف الجاي.
".nothing while deactivated". Toast: "Layla Hassan was deactivated وDeactivatedيبقى
. 3: مرسومة (مش التفعيل Mariamإعادة صفManage على Deactivated" ←  08.4 بحالةOV الأدوارDeactivated لستة بدل
Modal". onlyسطر read · Auditor deactivated: was she when role وأزرارHer وClose"، her" Reactivate التأكيد
Reactivate Mariam Zaki?" · "She can sign in again with her own password and gets" :) OV شكل 08.6بنفس
". her "Reactivate / "Cancel" · before." as reach same the with back, only read · السيستم:Auditor
."Your access to }Company{ is سجلstatus=active سطر person، a للشخصReactivated إيميل back"،

---

**p. 299**

الملكية3 نقل .د
 .1. OV 08.14  ← "Hand the account to someone else 08.8من إنتOV (حسابك
. 2becomes · }Name). من شخص OWNERيختار THE BECOMES "WHO وآخرActive( بدوره بس، ملخصsign-in يظهر
".To get it back
 .3 في الكامل الاسم CONFIRMيكتب TO NAME FULL HIS "TYPE بعدmatch( المستلم اسم مع ويعلّمtrim كابيتال) فرق غير ومن
" }Company{" of owner the be longer no will I understand الزرارI name{". }First to ownership يبقىTransfer
 يتحققواActive الاتنين لما بس
  التحقق خطوة ← الزرار مرسومةيدوس مش :(مقترح، you is it "Conﬁrm بكودModal الـ6" إيميل على اتبعت أرقام صالحOwner .4،
 دقايق.10
 .5 المستلمtransactionالسيستم واحدة): القديمOwner الاسمينpermission_version++،Admin، فيه سجل سطر للاتنين،
 الـ لكل وإشعار للاتنين، إيميل والمصدر، والوقت Adminsوالدورين لـ. يرجع  08.0 والـUI بقىOwner القديم وبيشوفAdmin
.UI 08.0E
مخصص3 دور إنشاء .هـ
 .1START FROM · 08.20 تابUI role "Create ← أوRoles جاهزDuplicate" دور على 08.21" بـOV مليان أو (فاضي)
."Copy of {Role}
 NAMEيكتب ROLE (مجموعة: المفاتيح يعلّم .2،"،
."things ticked · no rates, no money, no people. Nobody has this role yet }n). لايفPEOPLE يتحدث الملخص سطر
.( OV 08.21B )
 .3Custom role" سجلCreate سطر يحفظ، السيستم ← role" a ويرجعCreated بالمفاتيح، 08.22" الجدولUI في الجديد بالدور
."Toast "}Role{ created · assign it from Manage a person) people 0 و·
النشاط3 سجل .و
 .1KEPT" log" "Activity ←  08.9 كروتUI TODAY: الفاعلين،ENTRIES بتقسيم
وفلاترChips")،UNTIL بحث، مساحات، (SORT والجدول ،)،
.("Open
 .2.)Apply" من 08.10يفلتر OV ← entries" }n{ · الـApply قبل لايف بيتحسب (العدد
. 3 من 08.11يبحث لايفOV نتايج ← بمرجع }q{ TOUCHED THAT وENTRIES فريقه من بالترتيبHoteliana" بعض، مع
. سطرOpen" على 08.13" OV :)Drawer( NEW" → OLD · CHANGED وتفاصيلWHAT 4Nights"،
). بـRecorded ومكة،UTC لوDevice
. OV صلاحية تغيير 08.16السطر
. 5" ← log" the "Export ←  08.12 والأعمدةOV والصيغة النطاق يختار entries: }n{ كبيرExport لو إيميل (أو يتنزّل ملف
)Alternative ﬂows( 4 الفلوهات. البديلة
Only the Owner can Admin · شخصA1 بيدعو   08.1 والـOV بيتفتح شايفAdmin وAdmin Locked" بسطرOwner"
."Owner "Tariq invited Khalid Al-Amri as role this زيgive الفلو باقي للـ3". إشعار الإرسال: بعد Reservations.أ.
What the Auditor can see" ←" A2 التغيير.Auditor· أو الدعوة في يختار لما only read · رابطAuditor يظهر
" )Modal(  08.17 فيهOV ﬁnance "see وToggles: money" booking "see وOff( افتراضيًا)، identity guest مقفولsee
 reach" the Save مستوى على بيتخزن المدى محفوظ. والاختيار للدعوة/الإدارة يرجّعه الدورالشخص" مش

---

**p. 300**

Manage Mariam" )Active( ← OV 08.4  ← "What the Auditor can see" ←"  A3 موجودAuditor·
 reach the "Save ←  08.17 سجلOV سطر ← وusers.change_role" مفتاح، مفتاح للشخصpermission_version++
Invited ← OV A4 · Khalid" Manage صف على 08.7،"
Cancel the expires it وتحتIf ACCEPTS"، HE BEFORE ROLE THE وأزرارCHANGE invitation""،
."· "Resend the email" · "Save the new role
BR-" Resend:Expires يتحدثA4.1
."Resent an سجل08-21 سطر invitation)،
الدورA4.2 تغيير  emailed" not was he · accepts he when }Role{ get will "Khalid Toast ← role" new the "،Save
.Changed the role on an invitation" )old → سجل new(سطر
Cancel Khalid's invitation?" · "The link stops" :) OV 08.24 Modal Cancel: A4.3 بشكل مرسوم، (مش تأكيد
". invitation the "Cancel / it" "Keep · him." for opened ever was Nothing now. يختفيworking الصف بعدها
."Toast "Invitation cancelledو
Expired ← OV 08.15 : "Remove him from the list" / "Close" / "Invite" A5 · Tariq" صفManage على
."him again
 again" him "Invite ←  08.2 (مثلاًOV بيدعو للي مسموح مابقاش القديم الدور لو القديم. والدور والإيميل بالاسم مليان
The role on the old) كانتAdmin دعوة بيعيد وسطرAdmin يختار، ولازم فاضي الدور ← اتمسح المخصص الدور أو
". one pick - available longer no is بيتشالinvitation القديم والصف جديدة دعوة بيعمل الإرسال
Remove Tariq from the list?" · "This only tidies the list. The Modal" ← list" the from him صغيرRemove
."invitation stays in the activity log." ← "Remove
You are an Admin - you manage everyone except the owner and Admin · القايمةA6 بيشوف 08.0E الهيدر).UI
 admins الـother صف Abdullrahman…". "View "Owner: ←  08.8A بس،OV (قراية الـClose صفوف التانيينAdmins").
. OV 08.8B  ← "Your account }name{" شكلView بنفس هو08.8A" صفه مرسوم). (مش
Hand the account to someone" A7 حسابهOwner· بيفتح 08.8 OV .) locked" · Owner · role وYour وClose"،
"else ←( .د3
Auditor · بيفتحA8 Access & بيشوف.Team 08.0 للقرايةUI كاملة someone وInvite role" Create ؛مايترسموش"
You are an Auditor - Team & Access X" بتبقىManage X" وبتفتحView 08.4" وسطرOV أزرار، غير ومن أدوار لستة غير من
.)BR-08-44/45". you for read-only (حسبis بالكامل متاح السجل
person has this role - A9 · دورEdit" على }Role{" "Edit  08.25 OV ← وسطرCustom }n"،
 Modal ← changes" "Save ← load." page next her on change the gets She }names{. والدور بتتشال مفاتيح فيه لو تأكيد
."people lose: }keys{. It applies on their next page load." · "Cancel" / "Save changes مرسوم (مش ناس }nعليه
" سجل roleسطر a المتأثرين.Edited عدد + مفتاح مفتاح
:Custom" A10 · دورDelete" على
Change }First{'s" ناس 08.23عليه OV }Role{" yet deleted be (اسمcannot الناس بلستة
أوrole واحد) شخص (لو role" this with people Open بيفتح أكتر، (لو 08.0" UI الدور) على مفلترة .(مقترح)
"Deleted a حد 08.24مفيش OV deleted" "}Role{ Toast ← role" "Delete ← }Role{?" سجلDelete سطر role"،
بمفاتيحه.
" Duplicate · جاهزA11 دور  "Duplicate" ←  08.21 باسمOV }Role وcopy }Role{" of Copy · FROM والمفاتيحSTART
.)E15" اسم الاسمcopyمتعلّمة. بنفس دور فيه لو يتغير لازم

---

**p. 301**

API A12 team· your السجلNot في 08.9D" UI .) team your Not = سطورWHO ← والـHoteliana والـSystem
."… Hoteliana, the system and the API · وعنوان Showingبس،
A13 08.9B· من).UI 08.10 OV below" pick - person حتىOne الناس كل فيها (قايمة ،Deactivated"
See her رابطdeactivatedبعلامة من أو account") her فيOpen 08.16" OV بالعكس. من 08.4(مقترح: رابطOV
" عليها.)activity مفلتر السجل بيفتح
Finance. "Only sign-ins and money changed what "Only = SHOW · سطور".A14 بيجيب مبلغBookings فيها اللي
 changes مساحةaccess = بسUsers"
 A15 started· contract the since ".Everything من أكتر لو الاتفاقية). (توقيع المورد حساب تفعيل تاريخ من سطر،5,000
 بالـ عادي بيشتغل والـpaginationالجدول إيميلExport، بيروح
Source = "Hoteliana · }name{ · }job A16 السجلHoteliana· في  بيفتحOpen" 08.13" الـOV الشكل، بنفس
Hoteliana's own lines can be hidden, but they cannot be سطورtitle{ بسHoteliana". الفلتر من تتخفى ممكن
.("removed from the record
 Hoteliana · الشركة.A17 عن نيابة ملكية نقل عملت الـ لسهOwner (لو القديم بيبقىActive بيتعملهAdmin) أو لوDeactivate،
 + السجل في السطر Actorماشي. =  والقديمhoteliana_user الجديد للمالك إيميل السبب.
If you lose access to this mailbox, Hoteliana restores it after checking who" : OV 08.8   Owner · إيميلهA18 فقد
.Sign-in )Flow 01( are طريقyou عن بيتواصل زرار؛ مفيش 11(". )Flow Hoteliana الـAsk صفحة من
 Admin · إيميلهA19 فقد   08.8B OV : invitation" new a you sends الـAbdullrahman تنفيذيًا: الحسابOwner". يوقف
هيعدي مش القديم الإيميل (لأن الجديد الإيميل ويدعو خطوةBR-08-17القديم 3 ده السجل). في جديد شخص إيميل تغيير (مقترح؛
الـ في مش موجود .)MVPشخص
)Exception ﬂows( 5 الاستثناءات. والأخطاء
#Trigger اللياللي بيظهر الـ)English(
 /بيتحفظ
بيرجع
Recovery الـ
إرساليصلح الحقلمفيش addressتحت email valid a غلط"Enter إيميل E1صيغة
مش أو شخصي E2دومين
الشركة دومين
Use a {Company} work address - personal"
"mailboxes are refused
فعلاً الشركة لو الإيميل. —يغير
تاني دومين Askبتستخدم
Hoteliana to add your
Ask" (رابطdomain
category
(""Something else
الحساب على E3الإيميل
(Active/Locked)
" + }email{" }Role{ as team your on already رابطis
"Manage {First}"
الشخص يدير —يروح
الحساب على E4الإيميل
Deactivated
"belongs to {Name}, who is deactivated {email}"
" زرار }First{+ عندهReactivate (لو
)BR-08-10 بـusers.deactivate ممنوع ومش
— دعوةReactivate بدل
لنفس مفتوحة E5دعوة
الإيميل
"Already invited on {16 Sep} - expires {23 Sep}"
"Resend the invitation+ زرار
—Resend (A4.1)
تاني مورد على E6الإيميل
Hotelianaوكيل
This email belongs to another company on"
address different a Use Hoteliana. — نذكر." ممنوع
نوعها أو التانية الشركة اسم
—Ask أو تاني، Hotelianaإيميل

---

**p. 302**

#Trigger اللياللي بيظهر الـ)English(
 /بيتحفظ
بيرجع
Recovery الـ
E7 دورAdmin بيبعت
 عنAdmin/Owner
 الـ مباشرةAPIطريق
 403  الـmissing_permission في ممكنUI؛ مش
أصلاً
اتعمل— شيء لا
بين اتغير أو اتمسح E8الدور
 الـ والإرسالModalفتح
This role was changed or الأدوارBanner لستة فوق
" again pick - ago moment a واللستةdeleted
تتحدث
الاسم
والإيميل
محفوظين
تاني يختار
E9 again" Try today. invitations 20 sent have اليوم20You في دعوة
".tomorrow
—بكرة
E1024 3الـ فيResend مرات
ساعة
Sent 3 times today - you ومكانه يتشال canالزرار
"resend again at {time}
—يستنى
E11 الدعوة صف theفي check · delivered not للمدعوBouncedالإيميلEmail
Delivery ·" : OV 08.7 + )danger( فيaddress"
"Failed - the address bounced
الدعوة
بس مفتوحة
عمليًا ميتة
 صحCancel بإيميل ودعوة
قديم لينك فتح E12المدعو
) لينكResend(بعد أو
Expired أوCancelled
" expired invitation "This : 01.1B UI 01 (أوFlow
was replaced by a newer one - use the latest…"
cancelled "…was / email" — تفاصيل") أي مابيذكرش
 الشركة اسمهاعن غير
دعاه اللي —يكلم
اتقبل لينك فتح E13المدعو
كده قبل
"Already activated" + "Sign in" UI 01.1C—Sign in
بيدعوا الفريق من E14اتنين
نفس في الإيميل نفس
اللحظة
unique يشوف يدوسE5التاني ما بعد (الـSend
 علىconstraint email + للدعواتaccount_id
المفتوحة
واحدة دعوة
بس
—
الأدوار (مع مكرر دور E15اسم
من المخصصة، أو الجاهزة
كابيتال) فرق غير
"A role with this name already الاسم الحقل—يغير existsتحت
ناس عليه دور E16مسح
: Race( بعد عليه اتعينّ حد
) OV 08.24فتح
 الأول أدوارهم موجوديغير يرفضالدور ويتفتح409السيرفر 08.23 الحاليينOV بالناس
اتعمله لشخص دور E17تغيير
Admin منDeactivate
الوقت نفس في تاني
Layla was deactivated by }Name{ a خطأModal
moment ago. Reactivate her ﬁrst to change her
"role." + "Close
جديد من الصف تغييريفتح مفيش
نفس دور بيغيروا E18اتنين
الشخص
changed }Name{" :)record ياخد الـ409التاني (نسخة
Layla's role to {Role} {n} seconds ago." + "Keep
OV 08.5" instead mine "Apply / (بيعيد}Role{"
الجديدة بالقيم
—يختار
E19 (عنOwnerالـ يحاول
) أوAPIطريق دوره يغير
نفسه يوقف
The only owner" · state_readonly  403
cannot change their own role. Transfer the
".account instead
ملكية —نقل
E20 يلمسAdmin يحاول
/نفسهOwner/Admin
طريق APIعن
Only the Owner" · missing_permission  403
"can change the owner or an admin
——

---

**p. 303**

#Trigger اللياللي بيظهر الـ)English(
 /بيتحفظ
بيرجع
Recovery الـ
المكتوب الاسم ملكية: E21نقل
مطابق مش
"Type }Full name{ exactly as الحقل shownتحت
مقفول والزرار
—يصلح
المستلم ملكية: E22نقل
 /Deactivateاتعمله
 التأكيد قبل اتقفل
can no longer receive the account - {Name}"
" else someone تتحدثpick واللستة
تاني حد نقليختار مفيش
التحقق كود ملكية: E23نقل
انتهى / غلط
That code is not right" / "That code expired -"
" code new a "Send + one" new a أقصىsend (حد
قفل5 ثم محاولات 15 دقيقة )(مقترح
نقليعيد مفيش
أي وقت شبكة E24فشل
Team & فيSave
Access
Could not save - check your أحمرToast
 again try and والـconnection مفتوحModal" يفضل
بالقيم
تغيير مفيش
(العملية جزئي
(atomic
"Try again"
بيدير اللي E25الشخص
منه users.*اتسحبت
الـ فاتح Drawerوهو
OV 11.15  ← 403 تغيير— يرجعSaveالـمفيش
E26 وسطSession انتهت
Modal
 11.12 لـOV يرجع الدخول بعد 08.0؛ (الـUI
 الـModal من بيرجعوا الدعوة في والإيميل الاسم مابيرجعش،
(local draft
local draftيكمل
الجدول مكان "Tryفي + log" the load not تحميلCould فشل E27السجل:
"again
الفلاتر
الـ في محفوظة
URL
Try again
E28 was nothing - ﬁnish not did export "The فشلExportالسجلToast:
"downloaded" + "Try again
—Try again
نتيجة مفيش E29السجل:
للفلتر/البحث
"Nothing matches these ﬁlters" + "Clear ﬁlters"—Clear
ضيف باسم بحث E30السجل:
غير guest.piiمن
وسطر الضيوف، أسماء في مابتدورش Guestالنتايج
names are not searchable in your role - search
"by booking reference
بالمرجع —يبحث
بـ مرتبط سجل سطر E31فتح
 مابقاشrecord أو اتمسح
الصلاحية في
 08.13 منOV عادي بيفتح (القيمsnapshot السطر
Open زرار السطر)؛ في محفوظة theالقديمة/الجديدة
 grid الـnight أو صلاحية مفيش لو يتشال مشrecord"
"The record is no longer ومكانه availableموجود،
——
E32 link Deep  لحدteam
users.viewمالوش
"This screen needs see users" UI 11.4—"Ask the Owner for access"
6 حالات. مش موجودة في التصميم
أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
error تحتInline )E3( EMAIL" رابطWORK + }First{ الـManage يقفل أصلاً" الحساب على 1الإيميل
" ويفتحModal 08.4 invitation؛OV the السطرSend نفس وجنبه مقفول
OV 08.2

---

**p. 304**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
شخص على 2الإيميل
Deactivated
"Reactivate }First{ + 08.2 )E4(OV ثانويInline زرار
08.2 )E5(OV ثانويInline زرار + invitation the (بيعملResend يقفل)A4.1" ما غير من الإيميل لنفس مفتوحة دعوة 3فيه
08.2 )E6(OV تفاصيلInline أي غير من تاني مورد/وكيل على 4الإيميل
08.1 )E2(OV مسموحInline مش 5دومين
6 خيارAdmin بيشوف
Admin/Owner
سطر الوصف وتحت ورمادي، ظاهر roleالكارت this give can Owner the "؛Only
مايتختارش
 08.1 (خيارOV
 بنفسOwner
الشكل
08.4 بحالةOV أدوارDeactivated لستة غير (من Modal تأكيد شخصReactivate تفعيل 7إعادة
"?}Name{ .ج3(
+ OV 08.4
OV 08.6
8 08.24 ModalOV تأكيد دعوةCancel)A4.3
9 08.7 تحديثToastOV + وExpires sent" يتصفّرReminders تمResend"
delivered "Not danger عمودBadge في جنبSTATUS" فيInvited وسطر الدعوة، 10Bouncedإيميل
OV 08.7
UI 08.0B
11 دخولLockedشخص (فشل
من قفل أو )Hotelianaمتكرر،
LAST SEEN "locked }date{ · Hoteliana can" + "Locked neutral فيBadge
Too many failed sign-ins. Hoteliana 08.4"؛unlock سطرOV فيه
 is it who checking after it وزرارunlocks Hoteliana." "Ask مليانةCase(
) — user the to متاحينlinked والإيقاف الدور تغيير
عادي
UI 08.0D
12 08.8A الكلامOV بنفس · locked is it بيفتحAdminWhy تانيAdmin
"Only the owner changes another admin
OV 08.8A
13 08.4 08.4OV بسOV قراية شخصAuditor)A8 أي بيفتح
الـ غير الناس من فاضي 14الجدول
 جديد)Owner (حساب
Owner: "Only you so far. Invite the الـ صف تحت الصفوف مكان peopleفي
"who answer bookings and set prices." + "Invite someone
UI 11.19
15 (مثلاًChipفلتر صفر عدده
(Expired 0
"No expired invitations 08.0C بـChipالـUI يظهر الجدول0 عادي؛ ويتداس
16 box الجدولSearch فوق email or name a )"Search + 25 pagination من شخص25أكتر
(مقترح
UI 08.0
Active ← Admins ← بالاسمOwner Deactivated ← Expired ← للجدولInvited الافتراضي 17الترتيب
(مقترح
UI 08.0
18" work" فيOpen
 = 08.5/08.6 صفرOV
" 08.5 nowالصفOV يقولRight }Area{" in open يتشالNothing والتحذير
08.5 بيحسبOV GAINS/LOSES اسمSHE من مش الفعلية، المفاتيح من مخصص لدور دور 19تغيير
الدور
OV 08.5
20Owner( من/إلى Adminتغيير
بس)
Admin can invite, change and deactivate 08.5 إضافيOV بسطر
"everyone except you
OV 08.5

---

**p. 305**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
حد ومفيش ملكية 21Activeنقل
الـ Ownerغير
Nobody can receive the account yet - invite 08.14 اللستةOV بدل
someone "Invite + in." sign they until wait and وسطرsomeone "؛
 موجودHoteliana
OV 08.14
email{ }masked to code 6-digit a sent "We · you" is it "Conﬁrm الملكية"Modal نقل في التحقق 22خطوة
"Send a new code" · "Cancel" / "Conﬁrm the transfer·
UI 01.2C
للـ الملكية نقل 23Ownerبعد
القديم
Banner success: "}Name{ is now the owner. You 08.0Eيرجع معUI
."are an Admin
UI 08.0E
info وBanner الداشبورد في the you handed owner{ "}Old Access: & يفتحTeam مرة أول الجديد 24المالك
"account on {date}. You are now the owner." + "Close
UI 09.1
25Toggle: reach الـAuditor
" money booking منsee
"see ﬁnanceغير
08.17 مستقلين)OV (مفتاحين مسموح
اعتمادية مفاتيح 26BR-الأدوار:
(08-38
tooltip "Needed بـ ويتقفل يتعلّم الشوف مفتاح عمل، مفتاح يعلّم byلما
لوحده)}action{ (مايتشالش يتفك الشوف العمل، يشيل لما "؛
OV 08.21B
08.21 الـOV جدولcheckboxesإضافة في اللي مجموعاتهاBR-08-03 في مرسوم)" "(مش الأدوار محرر في الناقصة 27المفاتيح
28 فيهCancel دور محرر على
تغييرات
OV 03.11?" 03.11 changes"OV بشكلDiscard
من مفاتيح بيشيل دور 29تعديل
عليه ناس
A9 08.24 ModalOV تأكيد
30 role" وCreate ومكانهمDuplicate" يتشالوا -" roles custom 20 have الأقصىYou مخصص20الحد دور
"delete one to create another
UI 08.20
دوره شخص تفعيل 31إعادة
اتعدّل المخصص
"She gets }Role{ as it is today: }summary{ Modal.ج3 يقول التأكيد
مفيهوش جديد حساب 32السجل:
قليلة أحداث غير
Nothing happened on your account الفترة في سطور صفر لو عادي؛ inالجدول
"{period}
UI 08.9
كتير بقيم سطر 33السجل:
"(and 14 more
 الـ نفس جوه التغييرات كل يفتح حدDrawerالضغط بالتاريخ)، ثم بالغرفة (مجمّعة
ثم500 سطر change this Export (مقترح)"
OV 08.13
34 when }email{ to it email will We prepared. being is export "Your كبيرExportالسجلToast:
." ready is السجلit في وسطر
OV 08.12
شخص من سطر 35السجل:
Deactivated
" 08.9 عاديUI صغيرBadgeالاسم "deactivated الاسمneutral جنب
36 سطر منView-asالسجل:
Hoteliana
The company itself sees nothing in الـ في الأدمنMVPمايظهرش (قرار
 =Actor MVP أي لكن — وقتتغيير") اتعمل يظهرView-as بيه) اتسمح (لو
hoteliana_user مفتوح (سؤال
—
مفتاح مالوش المشاهد 37السجل:
 معينةarea
" الـChips وعددAREA مابتظهرش، بتاعتها DAYS 30 الليLAST على بيتحسب
بس يشوفه يقدر
UI 08.9
38 الـ أعمدةExportالسجل: فيه
PII
مالوش فيguest.piiلو وسطر بس، بالمرجع بيطلع الضيف عمود ،
Guest names are left out - your role does not include" : OV 08.12
"guest identity
OV 08.12

---

**p. 306**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
39 للـ عملهOwnerإشعار بتغيير
Admin
Notiﬁcations "Tariq changed Layla's role · Reservations → فيItem
OV 08.16  ← "Revenue manager" + "Open the change
OV 11.1
whatإيميل "See + }Name{" by · }Role{ to changed role "Your دورهin-app اتغير نفسه 40الشخص
 -style 08.8B OV ← reach" can حسابهyou شاشة
OV 11.1
)State machine( 7 الحالات.
Person (supplier_user)
منإلىإيه/مينBadge
)Invitation accepted(Active)Flow success = 01المدعوActive
ActiveDeactivated(BR-08-10) users.deactivateDeactivated = neutral
DeactivatedActive(Reactivate) users.deactivatesuccess
ActiveLockedHoteliana neutral = أوSystemLocked متكرر) دخول (فشل
LockedActive)Hoteliana )unlock(success (إعداداتHoteliana القفل مدة انتهاء أو
LockedDeactivatedusers.deactivateneutral
Invitation
منإلىإيه/مينBadge
—Open
("Invited")
users.inviteInvited = warning
Opentoken) Open
جديد
Resendwarning
الشخص ويظهر OpenAcceptedالمدعوActiveيختفي،
OpenExpired danger" = invitation" كاتبةExpired (الشاشة EXPIRED بعدSystem"INVITE أيام7
)"Expired invitation← على توحد لازم
القايمة من OpenCancelledusers.inviteيختفي
ExpiredRemovedRemove him") users.invite
("from the list
يختفي
جديدة Expired(دعوة
(Open
"Invite him again"warning
Role
منإلىمينBadge
—Built-inSystem)Badge" مشBuilt-inنوع عادي، (نص
—Customusers.change_role"Custom"

---

**p. 307**

منإلىمينBadge
Custom جديدةCustomEdit— مفاتيح (نسخة
Custom (0 people)DeletedDelete—
.B = Owner = حدث:Ownership قبلownership.transferred حالة). (مش بعدB دور. أي
.)immutable( recorded entry واحدة:Activity حالة
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Invite · FULL 80–2 حرف و(مقترح) ومسافات حروف ، و'  و-  NAMEنعم؛.
trim
Enter their full name" / "Use 2 to"
"80 characters
Invite · WORK
EMAIL
254صيغةE1–E6 مسموح،≤ دومين حرف، نعمBR-08-17
Invite · sent" is nothing - role a مشPick بيدعو؛ للي مسموح واحد؛ RoleنعمOwnerدور
"without one
Auditor reach · see
ﬁnance / see
booking money
افتراضيOff— لا
Manage · New عند roleنعم
الحفظ
يختلف ما لحد مقفول الحاليالزرار عن يختلف لازم
Transfer · WHO
BECOMES THE
OWNER
account" the receives who نفسهsign-inشخص"Pick مش الأقل، على مرة نعم
Transfer · TYPE HIS
FULL NAME
as" exactly name{ }Full المستلمType اسم نعم)case-insensitive=
"shown
Transfer · I
…understand
مقفول يتعلّمالزرار نعملازم
Transfer ·
Veriﬁcation code
"That" / right" not is code صالح6That أرقام، دقايق،10 5 محاولات نعم(مقترح)
"code expired - send a new one
Role · ROLE الجاهزة،40–2 مع الحساب في فريد حرف، NAMEنعمcase-
مسافاتinsensitive بس مش ،
Give the role a name" / "A role"
with this name already exists" /
""Use 2 to 40 characters
Role · ≤ ممنوع1 مفتاح؛ Permissionsنعمbank.change
 اللي⊇؛users.transfer_ownershipو مفاتيح
BR-08-38)؛BR-08-11بيعمل
Pick at least one thing this role"
can do. Create role stays off until
you do." / "You cannot give a key
"you do not have: {key}
Log · 100–2 حرف اسم(مقترح) الغرفة، اسم المرجع، في بيدور Searchلا؛
) (لو الضيف اسم guest.piiالشخص،
hint "Type at: من بحث،2لأقل مفيش
"least 2 characters

---

**p. 308**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Log · Date rangeA (لو dateلا
range you
("pick
To ≤ الـFrom المستقبل؛ في مش الحساب؛ بداية قبل مش ؛
 picker الموحدdate
Pick an end date after the start"
"date
Log · One اختار personOneلو
"person
person" a (حتى"Pick الحساب أشخاص )Deactivatedمن
Export · Scope /
Format
من— 3واحد / نعمCSV·PDF·Excel
Export · column" one least at ≤"Pick عمود؛1 وWhen Who" متعلّمين متقفلين Columnsنعم(مقترح)"
9 الإشعارات. والإيميلات والسجل
مينالقناةRequires الحدثيستلم
؟action
)actor · action · old →  new( سطر السجل
person a "Invited  users.invite · "user (الدعوة)Email—· اتبعتتالمدعو دعوة
{name, email, role}  → —
اتبعتت دعوة
Adminبواسطة
OwnerIn-app + السطر) Emailلا(نفس
الدعوة تذكير
(2×)
reminder invitation an "Sent · المدعوEmail—"system
→ old expires · invitation" an "Resent · ResendالمدعوEmail—user
new
· invitation" an on role the "Changed · إيميل)——user (مفيش دعوة— دور تغيير
role old → new
 invitation an "Cancelled · دعوةCancel———"user
)"Khalid's دعاIn-app انتهتاللي الدعوة
invitation expired
· Invite him
again")
expired "Invitation · لا"system
عندهم اللي اتقبلتكل الدعوة
 (حسبusers.view
في )11.20اختياراتهم
Email +) In-app
اختياري
(المدعوuser invitation the لا"Accepted
)ﬁrst( in" "Signed · Sign-inأول———user
(لوOwnerالشخص دور تغيير
 عمله)Admin
In-app + keys ·  users.change_role · Emailلاuser
gained/kept/never had + role old → new
مدى تغيير
Auditor
 (لوOwnerالشخص
(Admin
In-app + · reaches" person a what "Changed · Emailلاuser
keys
"Yourالشخص إيقافEmail:
access to {Company} was
 off )"turned + (لوOwner
(Admin
Email / "Deactivated  users.deactivate · In-appلاuser
a person" · Active → Deactivated

---

**p. 309**

مينالقناةRequires الحدثيستلم
؟action
)actor · action · old →  new( سطر السجل
)Emailالشخص + تفعيلOwner إعادة
)Admin(لو
Email / Deactivated · person" a "Reactivated · In-appلاuser
→ Active
الـ كل + الجديد + ملكيةالقديم نقل
Admins
In-app + Email
أمانRequired( ،
أوuser · لاhoteliana_user
users.transfer_ownership  · Owner:
A → B · A: Owner → Admin
تعديل / إنشاء
دور مسح
 (لوOwner +Admin عمله)
التعديل عند عليه اللي الناس
· role" a Deleted / Edited / "Created · In-appلاuser
keys
 عمل Exportاللي لوEmail( السجلExport
كبير)
scope, · log" activity the "Exported · Emailلاuser
format, rows
حساب قفل/فك
من شخص
Hoteliana
أوhoteliana_user / "Locked · In-appلاsystem + OwnerالشخصEmail
"Unlocked a person
.)"Account, sign-in and security دور تغيير إيقاف، ملكية، (نقل الأمان إيميلات منRequiredكل ومابتتقفلش 11.20 (فئةUI
)Acceptance criteria( 10 معايير. القبول
 .1Nothing is sent until a" Owner فاتحGiven 08.1 OV دورWhen مايختارش invitation the "Send وجنبهThen مقفول
".role is chosen - there is no default and no half-access
 .2Only the Owner Admin فاتحGiven 08.1 OV الأدوارWhen لستة يشوف Admin وThen بسطرOwner مقفولين ظاهرين
.Admin role this give والـcan بيرجعAPI"، اتبعت403 لو
 .3 Active  khalid@jewaralsafwah.com الحسابGiven على Owner الدعوةWhen في يكتبه يظهرThen
Reservations" as team your on already is ورابطkhalid@jewaralsafwah.com Khalid" إرسالManage ومفيش "،
 .4Already invited on 16 Sep - expires 23 منGiven الإيميل لنفس مفتوحة دعوة 16 When تانيSep يدعوه حد يظهرThen
."Resend the invitation" وزرارSep
 .5This email belongs to another company on Hoteliana. Use a تانيGiven مورد على الإيميل يدعوهWhen الرسالةThen
." address التانيةdifferent الشركة اسم غير من
 .6Then "Use a Jewar Al-Safwah work address - personal mailboxes are إيميلGiven @gmail.com يدعوهWhen
."refused
 اتبعتتGiven دعوة 16 When 10:20 يعديSep قبول168 غير من ساعة الحالةThen invitation يفتحExpired واللينك .7،
 01.1B ومفيشUI اتعملuser،
 .8 Resend اتعملGiven القديمWhen اللينك يفتح المدعو بيشتغل،Then اللي هو بس الجديد واللينك اتبدلت، الدعوة إن يشوف
 الـ وقت = الجديد الانتهاء 7وتاريخ + أيامResend
. 9 بدورGiven مفتوحة دعوة When لـReservations يتغير الدور منFinance 08.7 OV ياخدThen يقبل ولما جديد، إيميل مفيش
.Finance
 .10 دعوةGiven لينك مرةWhen يتقبل يودّيThen تاني فتحه 01.1C ومايعملشUI تانيuser
 .11 Reservations Layla شاشةGiven وفاتحة Owner When لـBookings دورها يغير Then manager أولRevenue ليهاrequest
. OV بمفاتيح بيتعامل كده managerبعد وبتشوفRevenue ومابتخرجش، 11.15،

---

**p. 310**

 .12 دورGiven تغيير يتحفظWhen المفاتيحThen فيه واحد سجل سطر had والسطورgained/kept/never والجديد، القديم والدور
القديم بدورها لسه ليها القديمة
. 13 Layla اتعملهاGiven When أيDeactivate تحاول Then ترجعrequest deactivated وتشوفaccount 11.14 غيرUI من
inزرار وقعتSign الأجهزة كل على جلساتها وكل ،
. 14 When Deactivated Layla السجلGiven يفتح حد هيThen ما زي باسمها موجودة سطورها كل
 .15see Deactivated Mariam كانتGiven بـAuditor When On ﬁnance" تتعملsee Then ترجعReactivate بـAuditor
On جديدةﬁnance" دعوة غير ومن ،
 .16Hand the account Owner وحيدGiven حسابهWhen يفتح مفيشThen picker زرارrole ولا ويظهرDeactivate to،
."someone else
 أيGiven When يبعتclient الـrequest دور يغير يوقفهOwner أو الوحيد الـThen يرفضAPI الـ403 من الطلب لو حتى .17)،
 نفسهOwner
 .18 When Admin دورGiven يغير يحاول الـAdmin أو نفسه أو تاني Then الـOwner في أوامر مفيش UI والـView( بس)، يرفضAPI
.403
 .19Abdullrahman منGiven ملكية نقل لـAbdullrahman When Ahmed يتأكد فيThen واحدةtransaction
للاتنينAdmin وإيميل والمصدر، والوقت والدورين الاسمين فيه سجل وسطر ،
 .20 When  08.14 OV المستلمGiven اسم عن مختلف المكتوب الاسم مقفولThen النقل زرار
 Auditor جديدGiven يتفتحWhen ما غير من يتدعى 08.17 OV Then  وfinance.view bookings.view_financial .21،Off
 ومايتفتحشguest.piiو مقفول
. desk Night عليهGiven When يدوسLayla حد Then يظهرDelete 08.23 وزرارOV باسمها role Layla's والدورChange 22"،
مايتمسحش
. cover Weekend عليهGiven 0 Then role" "Delete الـWhen كل ومن اللستة من يختفي الدور فيهpickers والسجل 23Deleted،
" role بمفاتيحهa
 .24" دورGiven محرر يعلّمWhen rates "See Then rates" تلقائيًاPublish ويتقفل يتعلّم
 .25. users.transfer_ownership الأدوارGiven محرر يتفتحWhen مفيشThen لـcheckbox ولاbank.change
 .26 النشاطGiven سجل (حتىWhen مستخدم أي سطرOwner يمسح أو يعدل يحاول أوUI) )API مفيشThen لكده،endpoint
ترجع محاولة .405وأي
. 27Revenue Ahmed وهوGiven ليلة سعّر manager اترقىّRevenue ثم When القديمAdmin السطر يتفتح يقولThen
."manager
 .28The" sale Stop الـGiven بعد أوتوماتيك When السجلrelease في يظهر الـThen automation · "System والفلترactor
.Hoteliana" itself تحتsystem ومش بيجيبه،
 .29 Auditor غيرGiven من guest.pii يعملWhen أو يبحث أو السجل يفتح Then والمرجعExport ظاهر، ضيف اسم أي مفيش
بس
. 30 فلترGiven When 2 page + يعملRates لحدRefresh اللينك يبعت أو يفتحواThen الصفحة ونفس الفلتر نفس
 .31Exported the Export لـGiven سطر20 When يتنزلCSV عمودThen فيه الملف time the at role وسطرTheir activity"،
" السجلlog في اتضاف
 .32 Admin الفريقGiven في تغيير أي عمل يتحفظWhen الـThen إشعارOwner بيوصله email + بالتغييرin-app

---

**p. 311**

11 أسئلة. مفتوحة
اللي كتبناه لحد التعارضالقرار / #الموضوعالفراغ
08.R بيقولREF keys 31 فيهThe الجدول بس المفاتيح،33" 1عدد
34 + invoice.uploadومع بقواF7( الأدوار) محرر
REF. الـ في34اعتمدنا الـBR-08-03 تحديث محتاج
08.Rجدول حاططREF والـAdmin 2bank.change،Finance
Owner السطر نفس F7ونص + بيقولواDECISIONS
only
 بسOwner
ناقص الأدوار 3محرر
مفاتيح
 08.21/08.25 فيهمOV 26 ناقصcheckbox بس؛
،contracts.edit،hotels.request
،inventory.view،contracts.lifecycle
،inventory.overbooking
،bookings.charge_override
،bookings.price_override
finance.dispute،finance.contact
(جدول يتضافوا )BR-08-03لازم
4 ofﬁce ناقصFront
UI 08.20من
فيها الأدوار بس6قايمة جاهزة 6 والـbuilt-in REF")،
7 08.0و فيهمUI
7"( UI 08.20/08.22 ofﬁceيتضاف فيFront
"(built-in
5Night deskanswers bookings ·" UI في 08.0/08.4وصفه
UI sale Stop · details وفيGuest 08.20"،
OV only" details guest and وفيArrivals 08.25"،
 identityمتعلّم guest + arrivals + bookings بسSee
Layla "Reservations → Revenue 08.5و بيقولOV
Night desk" وهيmanager
مفاتيح على يعتمد المطور التصميم؛ في تتوحد لازم الداتا
الفعلية الدور
6Who picks them"
OV 08.5" فيup
Ownerبيقول or ofﬁce Front والـReservations, "،
bookings.confirm ofﬁce مالوشFront
ثابت مش المفاتيح، من بيتحسب السطر
"المفتوح 7الشغل
لشخص
"Who has something pending 08.5/08.6 وOV
Flow في الطابور شخص. "بتاعة" حجوزات فيه إن 05بيفترضوا
ومفيش assignmentمشترك
" فيه هل قرار: القرار:handlerمحتاج لحد للطلب؟
وهو الشخص هيخسرها اللي المساحة في عناصر = العدد
)soft فتحها حد claimآخر
08.R REF so, if - Owner role the "Is 12: 8Ownerدعوةrule
: OV conﬁrmation stronger the 08.1"؛require
"Owner · transfer only"
)BR-08-15 الدعوةOwner في خيار مش
9 scope لكلHotel
شخص
You have Rates - but not for this") UI 11.5
Team &") وhotel شخص، لكل فنادق نطاق فيه إن بيفترض
 فيهAccess يتحدد مكان أي مفيهاش
Hotels · All hotels حقل نضيف (أ) قرار: /محتاج
 وpick الدعوة في 08.4" ونضيفOV
 = الـhotel_scope على الـuser (ب) أو كلMVP،
 و 11.5الفنادق ليهاUI مايتوصلش
سجل 10صلاحية
الأدوار وإدارة النشاط
للسجلusers.viewاستخدمنا الـ في مفتاح REFمفيش
users.change_roleو للأدوار (مقترح)
الاتفاقية مدة سنين5اقتراح: رأيZATCA محتاج endsالشاشة)؛ Contract · UNTIL عقد؟KEPT أنهي السجل". حفظ 11مدة
قانوني
12 منView-as
Hoteliana
MVPالأدمن in nothing sees itself company "؛The
Everything that moved … on 08.9و بيقولUI
"your account
 بيسمحView-asلو لو مشكلة. مفيش بس، للقراية
يظهر لازم التغيير بتغيير،
13MFA MFA #15: مفاتيحCross-module لأصحاب إجباري
(مفتوح والفريق الفلوس
القرار لحد مقترحة الملكية نقل في التحقق كود خطوة

---

**p. 312**

اللي كتبناه لحد التعارضالقرار / #الموضوعالفراغ
شخص إيميل 14تغيير
موجود
"sends you a new invitation الـ جديدMVPفي شخص = 08.8B)A19 بيقولOV
في نصية 15أخطاء
التصميم
08.16 OV amendmentsment" "؛answer
23 Sep) "Tuesday 23 September" OV 08.3
 أربعاء)؛2026 08.0E صفUI Active وعليهTariq
" EXPIRED" بيقولINVITE السجل sell"؛ (الاسمStop
Open the saleالجديد 08.0")؛Stop فيهUI
the supplier reference والـpermission بيقولREF"
"never sees this table
والرابط التاريخ، من بيتحسب اليوم التصميم؛ في تتصلح
يتشال
16OV 08.17An Auditor always sees … see arrivals and guest"
"Guest identity stays off" وdetails
" details" هناguest
 (ملاحظاتbookings.view_operational
 الـ تغيير محتاج الاسم/الهوية. غير من لـlabelالحجز)
Every". notes" booking and arrivals وجملةsee
"other preset is ﬁxed until custom roles arrive
موجودة المخصصة (الأدوار قديمة
17 عداداتChips
في المساحات
OV 08.10
المساحات )1,084مجموع ومفيش1,284≠ )،
Cases ولاContracts
"Contractsنضيف وAREA Cases" (مقترح"
يطابق لازم والمجموع
18 بيشوفFinance
في ضيوف أسماء
الكشف
 07.23 بيعرضUI Farouk لدورLina الليFinance"
guest.piiمالوش
) 07( إنFlow القرار أو بس، المرجع ويظهر يتخفى الاسم
قرار محتاج — الكشف في مسموح الرئيسي الضيف اسم

---

**p. 313**

