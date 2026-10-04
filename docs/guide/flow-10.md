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

# Flow 10 · Business exceptions

exceptions Business 10: (Flow استثناءات )البيزنس
الشاشات مصدر
Section  523:3216 :  10.0 لحدUI و10.10 10.1، وOV و10.2، و10.3، و10.4، و10.7، و10.8، .10.9،
". 12 :Flow  10.6 فيOV اتنقلت الأحدث. النسخة وهي 26، سببSep فيها واتضاف differs، nationality وكمانGuest
: 10.9B رخصةOV يرفع مابقاش المورد
 القواعد  10.R REF ( و1388:6334 10.C) REF ( 1383:6638 الـ). مع اختلفت شاشة الـREFلو الليREF، هو
بيكسب.
السيستم في حدث أو إشعار، أو إيميل، من بتتفتح البوابة. جوه زرار من بيفتحها ماحدش كلها دي 00.Eالشاشات قسمREF ،
"(.BUSINESS EXCEPTIONS · TRIGGERED BY HOTELIANA OR THE SYSTEM"
1 الهدف. والنطاق
. موجود: ده الفلو ليه يعرف لازم المورد وليه بتتباع، مش الحاجة ومين يحلها، يقدر شغال لسه اللي أوإيه الأول، من العقد هيبني ده، غير من
لازمة. مالهاش قضايا يفتح أو حجوزات، يلغي
 بيغطي مواقف:5الفلو
. 1 العقد وليهانهاية لبعض3، بدائل ومش مختلفة أشكال
).Ending يخلص soonقرّب
).Expiredخلص
ونهائي بدري ).Terminatedاتنهى
 كمان منوفيه )Paused(الإيقاف مؤقت.Hoteliana وده ،
. 2.Hoteliana إيه:Hoteliana وقفت مع والمتابعة إيقاف، كل وتفاصيل بنطاقاتها، النشطة الإيقافات كل
 .3 بتتباع: مش دي العروض الـليه محرك واحدةBlockers لليلة الكامل والفحص يشيله، يقدر مين حسب متقسم الشاشة، على
. مؤكد: حجز ينفّذ هيقدر مش تبليغالمورد بيعمل incident علىFulﬁlment بقيد تتقفل والقضية المراجعة، تحت يبقى والحجز 4)،
 ومعاها غيره، من أو saleالمورد اختياري.Stop
. 5 Hoteliana الفندق: عن أكتر معلومات محتاجة والـ بسبب، والرفض ونسخه، بحالته طلب وكل تصحيح، طلبات بيتشالBlocker
لوحده
 النطاق وكمان:):MVPجوه فوق، اللي كل
 ونتايج قيد، غير من اتقفلت وقضية بس، إقامة ليالي على وإيقاف الحاجة، نفس على إيقاف من أكتر مرسومة: المش Relocatedالحالات
.Replacedو
من القيد على والاعتراض القضية، على معلومات .Financeإضافة
النطاق: برا
مايقدرش: المورد

---

**p. 329**

 زرار مفيش مؤكد. حجز حجزCancelيلغي على مكانConﬁrmed أي في
إيقاف .Hotelianaيشيل
) المسؤول مين القضية.Liabilityيحدد عن
).P2. المورد: أداء مفيشتقييم ولاScore نسبة ولا الـGreen/Yellow/Red في بعدينMVP تتحسب علشان بتتخزن النتايج
.Finance القضية قرار على اعتراض فورم الـP2 في منMVP. القيد على باعتراض أو القضية، على برد بيكون الاعتراض
 الفندق: رخصة اتشالرفع 12 .)Flow بتحدّثها.Hoteliana اللي هي
").Hoteliana never asks for your contract with the hotel الفندق: مع المورد عقد أو الحق إثبات ممنوعطلب
. المورد: من العقد وإنهاء جديدة نسخة وعمل فيالتجديد نفسها الفورمات 03 عليها.Flow بتودّي اللي الشاشة بس هنا
(من 08.Rالصلاحيات الـREF في صراحة موجودة مش مقترح المعلّمة والمفاتيح ):REF،
الأدوار الأكشنالمفتاحالجاهزة
 العقد صفحات 10.0يشوف لحدUI
) الإيقاف10.3 وتفاصيل
وOwner contracts.view،Admin،
managerو ،Revenue
وFinanceو Auditor،
"What Hoteliana pausedيشوف
Why these rooms cannot beو
OV 10.4" وsold
contracts.view  rates.view أو  inventory.view أو
فيهم واحد أي (مقترح:
Front ماعدا الأدوار ofﬁceكل
period" new a for "،Renew
Start versionو new a وCreate a"،
"new contract with this hotel
 كدهcontracts.edit بعد (والتفعيل
)Flow فيcontracts.lifecycle 03،
وOwner ،Admin،
Revenue managerو
UI 10.5 بتصلّح اللي الشاشة بتاع أوrates.edit_draftالمفتاح الـ، فيFixزراير
أوinventory.edit أوinventory.stop_sell، ،
contracts.edit
المفتاح حسب
Ask" Hoteliana" with up وFollow
" قضيةHoteliana (بتعمل
.  دي الحاجة يشوف حد كله(مقترح)أي الحساب بيشوفها القضية
(REF 11.R )
—
 في الحجز صفحة 10.6يشوف لحدUI
10.8
 أوbookings.view_operational
" سطرbookings.view_financial you. to بيحتاجValue
bookings.view_financial
المفتاح حسب
Add" issue" booking a وReport
"information
وOwner bookings.cancellation،Admin، بيه خاص مفتاح مفيش لأن (مقترح،
Reservationsو
"Checkbox "Also stop the وOwner saleinventory.stop_sell،Admin،
managerو ،Revenue
Reservationsو
Open" entry" the وOpen
"statements
وOwner وAdmin، finance.viewFinance،
 اتفعّلتAuditor(و لو
"Dispute this وOwner وAdmin، entry"finance.disputeFinance،
"More information requiredيشوفhotels.viewالكل
it" وCorrect them"، وAdd "،Edit"،
"Send to Hotelianaو
وOwner hotels.request،Admin، (مقترح)
Revenue managerو

---

**p. 330**

Only the Owner, an Admin or Reservations can report a زي سطر ومكانه بيتشال، الزرار ومايعملش: يشوف bookingاللي
 issue زرار." شرح.Disabledممنوع غير من
ofﬁce ماعندوش:Front ولاcontracts.view والـrates.view العقد فصفحات status، Sell خالص لينكمابتظهرلوش وأي ،
. UI على يودّيه ليها 11.4مباشر
):Entry الدخول pointsنقط
يّبيود #منينعلى
1)Threshold" 10.0 إيميلUI أو daysإشعار }n{ in ends الـContract (عند
2"Contract 10.1 إيميلUI أو endedإشعار
3"… Hoteliana 10.2 كده،UI غير لو عقد. النطاق لو 10.4 إيميلUI أو pausedإشعار
OV عليه 10.1مفتوح
4"Contract 10.3 إيميلUI أو terminatedإشعار
5): لـ بتتحول العقد، صفحة أو10.0نفس أو10.1 العقد 03صفحة 03.3،Flow الحالةUI حسب بيتغير البانر
10.3 أو10.2
العقود 03قايمة :)Flow days 28 in "Ends أوBadge أوExpired"، أوPaused، 6،
Terminated
العقد صفحة
7is contract expiring "Review (: 02.6 UI ) Hotels أوMy }contract"،
"More info أوpaused needed"،
10.0 أوUI أو10.2، 10.9،
8Why these offers cannot be" OV youالداشبورد needs وWhat 09.3"،
"sold
 10.5 مفلترةUI
10.4 ديOV لليلة 04التقويم الليلةFlow حالة 04.4): OV ← reason" every See 9(مقترح"
10.5 AvailabilityهيدرUI & لينكRates status: Sell 10(مقترح"
11Report a booking): المؤكد الحجز 05صفحة 05.4،Flow وUI زرار05.11
"issue
OV 10.6  ← UI 10.6
12"Hoteliana decided on 10.8 نسخةUI (أو أوRelocated أوReplaced HTL-88231إشعارNo
(entry
13"Fulﬁlment issue" ← "Open the case ← 10.8 مصدرهFinanceUI قيد
14"Hoteliana needs more information about 10.9 إيميلUI أو }hotel{إشعار
15"All details accepted · }hotel{ is selling 10.10 againإشعارUI
16Fulﬁlment cases" "Your ( 11.24 نوعهاUI قضية ← follow-up) أوPause
issue
UI 10.7 10.1 أوOV
17"Suspended ← "See why: 10.1 الفندقOV بنطاق 02.7 فندقUI كارت
2 قواعد. البيزنس
) REF (من العقد حالات 10.Rأ.
فيهBR-10-01 3 منفصلة، نهايات لبعض: بدائل ومش
: تاريخهExpired في خلص

---

**p. 331**

: ونهائيTerminated بدري اتنهى
.Hoteliana: منPaused مؤقت إيقاف
saleالـ جوهStop المورد من قرار للعقدActive حالة ومش ،
 Transitions بس:BR-10-02 المسموحة
Draft → Scheduled → Active
Active ⇄ Paused
Active → Expired
Active → Terminated
 بيرفضهTransitionأي السيرفر تاني
 بيه:BR-10-03 بتسمح حالة كل اللي
بتخرج منها الحجوزاتإزاي بيعالتعديلالمؤكدة الحالةجديد
بداية تاريخ من بيبدأ Scheduledلسه.
المدة
البداية تاريخ توصل مفيشلما كامللسه
أوPause أوExpiry، المدةكاملبتتخدم، جوه Activeأيوه،
Termination
والتغييرات Paused)Hotelianaممنوعكامل،
بتستنى
الإيقافHoteliana ترفع بتتخدم
تاريخ بعد للّيالي Expiredمقفول
النهاية
Read جديدة نسخة أو طولتجديد، على onlyبتتخدم
بعد اللي الليالي ومنها onlyبتتخدم، الإنهاءRead تاريخ من Terminatedمقفول
التاريخ
ده Finalمفيش،
 BR-10-04 بتتباع الليلة العقد مدة جوه الإقامة تاريخ لو الـبس كفاية. مش لوحدهم والمخزون السعر اسمهBlocker.
. OUTSIDE_CONTRACT_TERM
 BR-10-05 التحذير يفضلبانر لما بيظهر النهايةcontract_expiry_warning_threshold تاريخ على يوم
الافتراضية و30القيمة Hoteliana، الموردين. لكل أو مورد لكل بتحددها الكود في ثابتة ماتتكتبش
}n". بيبقىBadgeالـ days }n{ in ends · الـActive
".default 30 days · this supplier: 28 القيمة بتعرض daysالشاشة
": جدولBR-10-06 بيظهر التحذير، نافذة جوه renew you after only sell they - term contract the outside فيهNights
Show all الغرفة حسب متجمعة النهاية، تاريخ بعد بس ومخزون سعر ليها اللي وبعدها10الليالي بتظهر، صفوف
. }n{ مايظهرش.(مقترح)" الجدول كده، ليالي مفيش لو
. بيبقىBR-10-07 العقد Expired النهاية00:00الساعة تاريخ بعد اللي اليوم في مكة بتوقيت  ليلة(مقترح) آخر نفسه النهاية تاريخ
تتباع ينفع إقامة
:Expired بعدBR-10-08
 والقيود والمخزون onlyالأسعار جايةRead اللي التواريخ لكل

---

**p. 332**

ظاهر القديم التاريخ
 والفلوس التأكيد وأرقام والتعديل والإلغاء الحجوزات مستمرةخدمة .كلها
".outside و "-" بيعرض النهاية بعد termالتقويم
BR-10-09 بعدها ويخلص المدة جوه بيبدأ اللي ):C10الحجز
Check-out )"A booking that starts before the end date and ends after it is كده قبل المؤكد الـالحجز لحد بيتخدم
.honoured to check-out.")
.)1 الجديد الحجز البروتوتايب ده، النوع من كله مفتوحبيمنعه (سؤال يتاخد القرار ما لحد
:BR-10-10 Terminated
تنصيص علامتي بين بيظهر متسجل سبب ومعاه نهائي،
 صالحة، بتفضل الإنهاء تاريخ قبل المؤكدة بعدهالحجوزات اللي لليالي .حتى
. جديد.Resumeمفيش عقد الحل
يفضلBR-10-11 العقد المستقبل: في تاريخ ليه الإنهاء لو بانرActive وعليه ده، التاريخ لحد }date{ on Terminates .(مقترح)"
Hoteliana من الإيقاف )Pause(ب.
 الإيقافBR-10-12 غيره:Override ومفيش البيع، على
 مخزونمابيمسحش ولا أسعار
 حجز.مابيلغيش
 مستخدم.مابيقفلش أي ولا المورد
 والفلوس.BR-10-13 والحجوزات، المستقبلية، والتغييرات والمخزون، الأسعار، كاملة: التعديل صلاحيات عنده المورد الإيقاف، أثناء
  بس مسموح، بيتباعالنشر تغيير يترفعمفيش الإيقاف ما قبل
Published changes go on sale when Hoteliana lifts the pause on) النشر مراجعة 04شاشة سطرFlow بتعرض
}scope{ (مقترح)."
. BR-10-14 من):Scopeالنطاق واحد :4 أوsupplier أوhotel، أوcontract، تواريخroom، فترة عليه يكون ممكن فيهم نطاق أي
 holdالـ تانيةDistribution نطاقات ليه الأدمن عند كـsupplier×hotel بيتعرض وHotel plan، كـrate بيتعرض ومعاهContract
 عليها اللي .(مقترح)الغرف
BR-10-15 منفصلين: تواريخ حقلين فيه
: فيهاpause_window ممنوع البيع اللي الفترة
: تتباعblocked_stay_dates مينفعش اللي الليالي
سطرين في الاتنين بتعرض الشاشة واحد. ولا أو الاتنين، أو منهم، واحد liftedممكن until → 2026 Sep 12 window: "،Pause
".Blocked stay dates: None - the pause covers the whole termو
BR-10-16  الحاجة: نفس على إيقاف من أكتر فيه لو
بيكسب اللي هو الأوسع
  ضيق إيقاف الأوسع.مابيرفعشرفع
  الإيقافاتالشاشة كل بس.بتعرض واحد أول مش النطاق، على

---

**p. 333**

 معاهBR-10-17 إيقاف كل
وscope .target،
: افتراضيًاreason_visible_to_supplier ظاهر
 internal_note الـ: في بيرجع ولا للمورد، بيظهر ما البوابةAPIعمره بتاع
مثلاًset_by كفريق، بيظهر Operations: · Hoteliana الموظف اسم غير ومن .(مقترح"،
. وset_at وlifted_by، lifted_at،
لوBR-10-18 السببHoteliana خفت ask to up Follow Use reason. a share not did Hoteliana .(مقترح."
 الـBR-10-19 كود Blocker  HOTELIANA_PAUSED أولوية تانيأعلى شرط أي وبيكسب المحرك، في
 Badge العقدBR-10-20 Hoteliana by نطاق"Paused كله: العقد بيغطي نشط إيقاف فيه يكون لما بيظهر أوcontract أوhotel
 غيرsupplier ومن محددةblocked_stay_dates،
Part of this contract is paused by Hoteliana" +" يفضل العقد معينة، ليالي على أو غرفة على الإيقاف بانرActiveلو وعليه
sale blocking is what See .(مقترح)"
.) CTR-N-3108" BR-10-21 المورد المتابعةمايقدرش الإيقاف. يرفع 10.2 OV بتعمل فيقضية) cases بمرجعYour
إيقاف لكل بس واحدة مفتوحة متابعة قضية فيه
 القضية لنفس بتتضاف الرسالة مفتوحة، لسه والأولى تانية متابعة بعت .(مقترح)لو
 يترفع:BR-10-22 الإيقاف لما
  يرجع لوحدهالبيع المورد من أكشن أي غير من منشورة، نسخة آخر على
.Draft لسه اللي بتفضلDraftالتغييرات
إشعار. يوصل
بسبب أوتوماتيك بتتقفل المتابعة liftedقضية Pause .(مقترح)"
Hoteliana paused new bookings on your BR-10-23 كله: المورد مستوى على البوابةإيقاف صفحات كل فوق ثابت أزرق بانر
details "See + open." stay ﬁnance and rates bookings, Your "}reason{". account: .(مقترح"
Blockers )Sellability الـ محرك engine(ج.
غرفةBR-10-24 كل blockers][ بتتباع.. الليلة يبقى فاضية القايمة
  بيقيّم يفشلكلالمحرك شرط أول عند ومابيقفش الشروط،
 كلBR-10-25 معاهBlocker وcode وscope، وtarget، وsince، cleared_by، أوsupplier( أوhoteliana
. وstructural fix_link)،
 BR-10-26 بنفسها. السبب بتحسب شاشة ومفيش التقويم، 10.5 والـUI والداشبورد، فمينفعشAPI، القايمة، نفس بيقروا كلهم
يختلفوا شاشتين
):UI 10.5  + REF 10.R  + REF 10.C ( BR-10-27 بيقراه المورد اللي ← الأكواد جدول

---

**p. 334**

مين الاسميشيله اللي الكودبيظهر
القسم( في
(UI 10.5
زرار الحل  ← المعنىالوجهة
HOTELIANA_PAUSEDPaused by
Hoteliana
pause" the ←Open نطاق" أي على Hotelianaإيقاف
OV 10.1
ACCESS_NOT_APPROVEDHotel access not
approved yet
لسه الوصول Hotelianaطلب
ماتقبلش
" ←Open the request"
)Flow 02( ACC-درج
ROOM_NOT_MAPPEDRoom is not
mapped yet
مربوطة مش Hotelianaالغرفة
الفندق بكتالوج
" ←Follow up"
 10.2 (موضوعOV
("Room mapping"
MORE_INFO_REQUIREDMore information
needed
request" the ←Open مفتوح" تصحيح Hotelianaطلب
UI 10.9
NO_RATENo price Flow" ← rates" لليلةOpen سعر setYouمفيش
 دي04 الليالي على
NO_INVENTORYNo rooms ←" inventory" صفرOpen leftYouالمخزون
Flow 04
STOP_SALEStopped by youYou sale المورد،Stop من
قضية من أو
Lift stop sale" ←"
 04 قضيةFlow من (ولو
("Open the case"
RELEASE_PASSEDRelease date
passed
YouCut- الـReleaseالـ أو
 عدّىoff
Open release & cut-"
off" ← Flow 03
BOOKING_WINDOW_CLOSEDBooking window
closed
الـ برا الإقامة Youتاريخ
Booking window
Open booking"
window" ← Flow 03
RESTRICTION_FAILEDA restriction
blocks it
أوMinLOS You،
أوMaxLOS أوCTA، ،
إجبارية،CTD إقامة أو ،
كاملة الفترة أو
Open restrictions" ←"
Flow 03
NOT_ON_CONTRACTNot on the
contract
معروضة مش Youالغرفة
 الـ أو ديViewبالوجبة
العقد في
Open Rooms" ←"
Flow 03
OVERBOOKING_RULEOverbooking ruleYouSold الـ outقاعدة
الليلة قفلت
Open inventory &"
conﬁrmation" ← Flow
04 أو03
CONTRACT_EXPIREDContract has
ended
في خلصت Structuralالمدة
تاريخها
Renew for a new"
period" ← Flow 03
CONTRACT_TERMINATEDContract was
terminated
contract" the ونهائي"Open بدري Structuralاتنهى
UI 10.3  ←
OUTSIDE_CONTRACT_TERMNight is outside
the contract term
←" term" the المدةRenew برا الإقامة Structuralتاريخ
Flow 03
SUPPLIER_HOTEL_INACTIVEHotel is not
active with you
مش بالفندق Structuralالعلاقة
نشطة
" ←Open the hotel"
UI 02.2L

---

**p. 335**

مين الاسميشيله اللي الكودبيظهر
القسم( في
(UI 10.5
زرار الحل  ← المعنىالوجهة
CONFIRMATION_MODE_INVALIDConﬁrmation
mode does not
match
 الـ أو التأكيد Structuralطريقة
On بتاعSLA
 متحددRequest مش
Open conﬁrmation""
← Flow 03
BR-10-28 في 10.5التقسيم حسبUI دهcleared_by وبالترتيب ،
 .1.You can clear these now" (supplier)"
 .2.Hoteliana must clear these" (hoteliana)"
 .3.Structural - the contract has to change" (structural)"
العنوان في عدد فيه قسم screensكل own your inside all blocks, Seven مايظهرش"). الفاضي القسم
 BR-10-29 كـBlockerالـ بيظهر اللي التقويمBadge في دي: الأولوية حسب الأول هو
 .1HOTELIANA_PAUSED
 والربط وACCESS_NOT_APPROVEDالوصول وROOM_NOT_MAPPED، .2،SUPPLIER_HOTEL_INACTIVE،
)MORE_INFO_REQUIREDو
. وCONTRACT_TERMINATEDالعقد وCONTRACT_EXPIRED، 3،OUTSIDE_CONTRACT_TERM،
وCONFIRMATION_MODE_INVALIDو )NOT_ON_CONTRACT،
. 4) التجارية وNO_RATEالبيانات وNO_INVENTORY، وSTOP_SALE، OVERBOOKING_RULE،
. 5) وRELEASE_PASSEDالوقت BOOKING_WINDOW_CLOSED،
. 6) الإقامة RESTRICTION_FAILEDشروط
. في العرض 10.4ترتيب مختلف:OV الـ تشغيل ترتيب ده ثابتين.Checklist الاتنين
 BR-10-30 في الصفوف 10.5تجميع الـ:UI ونفس الكود نفس ليها اللي المتتالية الليالي واحد:Target صف بتبقى
.)"Nov · 9 20 - 12 والعددNIGHTSعمود الفترة بيقول
".after 31 Dec datesأو أوAll term"، in dates أوAll 2026"،
أقدمSINCEعمود = نسبيsince مكتوب المجموعة، في 2 أوdays ").today"،
Nights affected · in the next 90 فيBR-10-31 الافتراضية الفترة 10.5 وUI 10.4 UI هي الجايين90الـ يوم كارت (من
days تواريخ فلتر ومعاها .(مقترح")،
 BR-10-32  10.4 بيعرضOV لليلة) الكامل (الفحص بالترتيب17 شرط شرط وكل التفصيل✕، ومعاه
 .1Contract state is sellable
 .2Stay date inside the contract term
 .3Supplier-hotel relationship active
 .4Hotel access approved
 .5Room mapped to the hotel library
 .6No Hoteliana pause on any scope
 .7A rate exists for this night

---

**p. 336**

 .8Inventory available
 .9Not stopped by you
 .10Release and cut-off still open
 .11Booking window open
 .12MinLOS / MaxLOS satisﬁed
 .13CTA / CTD allow this date
 .14Mandatory / full-period stay satisﬁed
 .15Room offered with this meal & view on the contract
 .16Conﬁrmation mode valid
 .17Overbooking rule satisﬁed
."blockers on this night }nالعنوان
Clearing the missing rate on its own will  من أكتر فيه والـBlockerلو التنبيهcleared_by سطر بيظهر مختلف، بتاعهم
." too lifted be to has pause hotel-level the - sale on night this put الأكواد.not من بيتولّد والنص
 لكل زرار فاشلBlockerتحت، rates وOpen pause"، the وOpen Hoteliana")، with up فيهFollow لو منBlocker"
.Hotelianaنوع
Open الـBR-10-33 sale كـStop بيظهر قضية من جاي اللي ومعاهSTOP_SALE incident from · "auto الحلTag وزرار the"،
."case
."Updated }hh:mm{" + "Refresh. خلالBR-10-34 بيتحدّث المحرك 60 تغيير أي من بالكتير ثانية بتعرض(مقترح) الشاشة
)Fulﬁlment ينفّذه هيقدر مش المورد اللي الحجز incidentد.
BR-10-35 مؤكد. حجز بيلغي ما عمره اسمهالمورد والحدث ينفّذه، هيقدر مش إنه بيبلّغ ،SUPPLIER_FULFILMENT_INCIDENT
. supplier_cancelled  بيبقى ما وعمره
BR-10-36 متاح حجزالتبليغ على Conﬁrmed الـ يوم لحد التأكيد ساعة من لأ)، أو تأكيد رقم فيه (سواء Check-out .(مقترح)
حجز على متاح Requestمش هناكOn (الحل مستني لسه حجزReject على ولا بتاعتهCancelled")، الإقامة حجز على ولا ،
خلصت.
حجز. لكل بس واحدة مفتوحة تبليغ قضية
):Hoteliana BR-10-37 (منالأسباب 10.6 فيOV 12 وديFlow عندSetting،
الكودالنصالشرح
hotel_overbookedThe hotel is"
"overbooked
"The hotel cannot provide the rooms we hold"
room_out_of_serviceThe room is out of"
"service
"Maintenance, damage or a closed floor"
hotel_closedThe hotel is"
"closed
"Closure, renovation or an ofﬁcial instruction"
guest_nationality_differsGuest nationality"
"differs
The guest's passport is from a different country than the"
".booking. The agent pays the price difference

---

**p. 337**

الكودالنصالشرح
outside_our_controlOutside our"
"control
"Weather, an authority decision, or force majeure"
other"Another reason""Explain it below"
لوحده المسؤولية مابيحددش بس ويظهر، بيتسجل السبب
happened "What BR-10-38 :إجباري"
لـ20من 2,000 حرف .(مقترح
reasonمع الأقلAnother على لازم 40" حرف .(مقترح)
BR-10-39 الحجز حالة Resolved → review" under · issue "Fulﬁlment → منConﬁrmed واحدة والنتيجة ،relocated،
أوreplacedأو cancelled_by_hoteliana، كمان. النص في اللي الحالة بيشوف الوكيل
 المراجعة:BR-10-40 تحت وهو
 مقفول الحالي الرقم وتعديل بيتبعت، جديد تأكيد رقم مفيش
 لـ بتروح ده الحجز على الوكيل من بتيجي اللي التعديل أو الإلغاء بيشوفهاHotelianaطلبات والمورد only، ومعاهاRead
open" is issue the while booking this handling is Hoteliana .(مقترح)."
 sale Stop التبليغ.BR-10-41 وقت اختياري فيه ماعدّتش. لسه اللي الحجز ليالي هي والليالي افتراضيًا، متعلّم للنطاق3 اختيارات
 .1B&B الوجبات لكل دي، للتواريخ نفسها، الفعلية فـالغرفة الفعلية، الغرفة على المخزون لأن بيه، والموصى الافتراضي ده وRO.
 بعض.HBو مع يتقفلوا لازم
. 2 only" room الغرفةThis الحجزView": في اللي
 .3": dates" affected the for hotel, whole مقفولThe نفسه الفندق لما
. inventory.stop_sell عندهCheckboxالـ المستخدم لو بس بيظهر
 الـBR-10-42 sale عليهStop التبليغ من بيتعمل اللي incident from · "auto بالقضية."Tag ومربوط
 فيه كان saleلو Stop الـ الليالي، بعض على أصلاً تجاري بسTag الباقية الليالي على بيتحط
 الـ saleرفع Stop القضية بتاع مابيرفعش أبدًا. التجاري
 BR-10-43 الـ تتقفل، القضية saleلما واحدةStop خطوة في أوتوماتيك بيترفع القضية بتاع عليها اللي الليالي لكل دي.Tag، القضية
. OV 10.6 في الموجود 10.7ده وUI
The case on HTL-88231 is still من بنفسه كده قبل يرفعه يقدر sale"(المورد stop )"Lift 04 تحذيرFlow ومعاه open.،
anyway sale stop the Lift .(مقترح)?"
حاجة مابيحصلهاش عدّت اللي الليالي
BR-10-44 والـ saleالتبليغ فيStop واحدةTransaction  واحد ولا يا يتسجلوا، الاتنين يا .(مقترح):
".This may affect your supplier performance and your settlement" BR-10-45 تحذير بيظهر التبليغ وقت
 الـScoreمفيش في نسبة ولا بعدين.MVP تتحسب علشان بتتخزن النتايج

---

**p. 338**

. Hoteliana النتيجةBR-10-46 بتقرر اللي هي  أوrelocate( أوreplace، cancel، المورد)، على قيد هيتسجل لو القضيةوبتقرر
 بتتقفل المورد على غلط مفيهاش قيداللي غير .من
BR-10-47 القضية: من بيتعمل اللي القيد
 منها، بإيدبيتولّد بيتكتب .مش
.Flow لـ الفلوس مع بيمشي والسبب بيها، مربوط 07بيفضل
الضريبة. شامل المبلغ
".Deducted from your next payout) الكشف في وStatementبيظهر الجاي،
 وسطوره الأصلي الحجز .مابيتعدّلوش
منBR-10-48 بيكون القيد على الاعتراض entry this "Dispute "Finance: ( finance.dispute سطر). على الاعتراض
.)Finance الكشف باقي (قرارمابيوقفش
BR-10-49 والحجز). والعقد، والغرفة، (الفندق، لوحدها السياق بتاخد القضية  أبدًا أسعار ولا ضيوف أسماء ومابتاخدش
.( REF 11.R )
 BR-10-50 differsسبب nationality (قرار"Guest الوكيل على بتتسجل والقضية الفرق، بيدفع الوكيل التنفيذ. في فشل مش
N1 كده علشان (مقترح).
" saleقسم the stop بيختفيAlso
بيختفي. الأداء تحذير
Fulﬁlment issue · بيفضل وعليهConﬁrmedالحجز Hoteliana، with open زيIssue 05.4B" بدلUI under،
".review
مفتوح )5(سؤال
BR-10-51 ممكن اتقفلت قضية تاني منتتفتح الـHoteliana في جديد سطر بيتضاف ساعتها وTimeline. ، مابيتعدّلش القديم .القيد
عكسي جديد قيد بيتعمل تصحيح، في لو
")More information التصحيح طلبات requiredهـ.
Rejected · لوحدهBR-10-52 حالته ليه طلب كل Accepted → review Under → Sent → أوRequired needs،
.Sent يرجعcorrecting وبعدها
 كفايةChecklist" مش بس" صح بيعلّم
BR-10-53 نسخة بيبقى إرسال أو رفع كل v3( الجديدة النسخة فوقها). بتكتب ولا القديمة بتمسح ما والسجلعمرها ،
واحدة كل ونتيجة بكلهم بيحتفظ
 BR-10-54 مكتوب. بسبب يبقى لازم الأدمن.الرفض عند بيرفضه والسيرفر ممنوع، سبب غير من رفض
 BR-10-55 التصحيح طلب الفندق مع المورد عقد بيطلب ما عمره ولا السياحة، رخصة Hoteliana( 12: بيطلبFlow بتحدّثها).
 حاجات Hotelianaبس منها تتأكد تقدر
BR-10-56 مفتوح طلب فيه ما طول أوRequired( أوSent، review، أوUnder الـRejected، Blocker)،
 MORE_INFO_REQUIRED على بيفضل اللي اختارتهHotelianaالنطاق كله المورد أو عقد، أو (فندق،
 يتقبل. طلب آخر لما لوحده دهبيتشال يطلب محتاج مش المورد
 حالتهاBR-10-57 اللي الطلبات التذكير: أوRequired بعدRejected رد غير من correction_reminder_after افتراضيًا)3( أيام
كل بيتكرر تذكير. أيام،3بيتبعتلها بالكتير3 مرات  .(مقترح

---

**p. 339**

 BR-10-58 القبول: اتقبلتبعد حاجة على تعديل أي لـEdit بيروح جديدةHoteliana") كنسخة الأول
  المقبولة النسخة على بيكمّل دهالبيع الوقت في
بيتحطBlockerومفيش التعديل. بدأ اللي هو المورد لأن ،
عملBR-10-59 المورد لو لسهEdit طلب على أوSent" review بتتعلّمUnder والقديمة جديدة، نسخة بتتعمل Replaced،
review before .(مقترح"
Check-in BR-10-60 التصميم في الطلبات أنواع sell you types وRoom hotel، this for contact وReservations and،
.check-out times
عندSettingالقايمة (القسمHoteliana إدخال فورم ليه نوع وكل .)8،
accepted" already زيDetails كده، قبل اتقبلت اللي الحاجات بيعرض it" sell you as address, and name "،Hotel
."Child and extra-bed sellو you plans وMeal rules"،
 إيدSettings في الكود):Hoteliana في ثابتة (ماتتكتبش
.30: افتراضيcontract_expiry_warning_threshold
.3: افتراضيcorrection_reminder_after
 والـ ظاهر، (افتراضي للمورد ظاهر السبب ولو الإيقاف، noteنطاقات بتظهرInternal ما عمرها
التبليغ. أسباب قايمة
 قيد فيها النتيجة أوتوماتيك.Hotelianaهل بيقرره ما عمره والسيستم لوحدها، قضية كل في ده بتقرر
)Happy path( 3 الفلو. الأساسي
A.3 العقد بّقر يخلص  ← تجديد
 .1.)28 علىالحدث: يفضل أيامend_date عدد (مثلاًcontract_expiry_warning_threshold
.contracts.edit" إشعارالسيستم: يبعت وإيميلin-app days 28 in ends Block Annual لأصحابMakkah
attentionيحط فيNeeds الفندق على Hotels" الداشبورد.My في وكارت ،
. 2 الإشعاريعمل: يفتح
:UI 10.0  يشوف
Hilton Makkah · Term 01 Jan Blockالهيدر Annual وMakkah days"، 28 in ends · "Active وBadge 2026"،
".Create a new version" SAR · 2026 Dec وزراير31 period"، new a for وRenew
. أصفر todayبانر from days 28 - 2026 Dec 31 on ends contract والشرحThis now." stops …"،Nothing
".Follow up with Hoteliana" periodوزراير new a for وRenew
.i/✓/ ✕ 6بلوك not": does what and date, end the on changes سطورWhat
".Nights outside the contract term - they sell only after you renewجدول
التحذير. نافذة إعداد سطر
.C10سطر
. 3."Renew for a new period" يعمل
.Draft. منالسيستم: التجديد ويزارد يفتح 03 كـFlow واحدة، خطوة في جديدة لفترة حاجة كل بينسخ
. 4.Flow 03 فييعمل: وينشر يكمّل

---

**p. 340**

.Active يبقىالسيستم: الجديدة) المدة (أو الجديد العقد أوScheduled
 Blockerالـ  الجديدة.OUTSIDE_CONTRACT_TERM المدة جوه بقت اللي الليالي من يتشال
في 10.0البانر لـUI يتغير contract new the "Open + 2027" Jan 01 starts term new · Renewed .(مقترح)"
.Activity الـ في logيتسجل
Hoteliana.3 B وقفت العقد  ← متابعة  ← اترفع الإيقاف
 .1.)SH.1 Distribution hold الحدث الأدمنHoteliana (من العقد على إيقاف حطت
السيستم:
 العقد.HOTELIANA_PAUSEDيضيف وليالي غرف لكل
".Paused by Hoteliana الـ لـBadgeيغير
".Hoteliana paused new bookings on Umrah Q3 إجباري إشعار emailيبعت + والـin-app مقفولToggle،
. 2: UI 10.2  يشوف
".See what is blocking sale" Q3الهيدر وUmrah Hoteliana"، by وزرايرPaused Hoteliana"، with up وFollow
Reason given to you: "…". Paused since 12 Sep." contractالبانر this on bookings new paused وHoteliana
."2026. This is a sale block only - it is not a cancellation, not a deactivation, and nothing has been deleted
.What the pause does not do" )4 ✓(بلوك
).✕  1✓ 5( "What you can still doبلوك
.Set Scopeبلوك pause": this of scope وThe وHotel، وRooms، window، وPause dates، stay وBlocked by،
. 3."Follow up with Hoteliana" يعمل
:OV 10.2  يشوف
".Umrah Q3 · paused since 12 Sep Hoteliana" with up وFollow 2026"،
."Ask for this pause to be lifted" about" this is متعبيّWhat
.Placeholder" message" ومعاهYour
."Attach a document (optional)"
": send" you سطرينBefore
."Cancel" وSend"
 .4."Send ويدوسيعمل: (اختياري) ويرفق يكتب
السيستم:
 قضية بالإيقاف.CTR-N-3108يعمل مربوطة
".Your وفي الإيقاف سجل على والمرفق الرسالة casesيحط
 لـ إشعار الإيقاف).Hotelianaيبعت حط اللي (الفريق
الـ في .Logيسجل
. 5: OV 10.3  يشوف
".Umrah Q3 · 15 Sep 2026, Hoteliana" to sent وMessage 14:20"،
 4" now": happens سطورWhat
requestزراير this فيFollow القضية على (بيودّي 11.25" وUI status)، sell to "Back ( 10.4 وUI ."Close)،

---

**p. 341**

 .6 الحدث الإيقافHoteliana رفعت
السيستم:
يرجعHOTELIANA_PAUSEDيشيل والعقد .Active،
."Hoteliana lifted the pause on Umrah Q3. It is selling إشعار againيبعت
".Pause بسبب المتابعة قضية liftedيقفل
.lifted_at وlifted_byيسجل
".Pauses active now 10.4في منUI يختفي السطر
".Lifted }date{ · by Hoteliana · الإيقاف سجل Operationsفي
C.3 ليه العروض دي مش بتتباع  ← الفحص الكامل لليلة  ← الحل
 .1."See what is blocking sale يدخليعمل: 10.5 منUI أو الداشبورد من
يشوف:
Every line here comes from the Sellability blocks" 17 · sold be cannot rooms these وWhy Blocker"،
".Engine - the same source the calendar and the dashboard read
.) UI 11.22  ←( "Ask Hoteliana) فوق pausedزرارين Hoteliana "What ←(  10.4 وUI
و التقسيم، بالأعمدة3شرح جداول وBLOCKER AFFECTS، IT وWHAT وWHY، وNIGHTS، وSINCE، .FIX،
. 2.)FIX زراريعمل: على (مش الصف على يدوس
 يفتحالسيستم: 10.4 الصف.OV في ليلة لأول
. 3: OV 10.4  يشوف
Makkah Annual Block · Hilton Makkah · every condition the 2026" Nov 12 · B&B · Room وDeluxe engine"،
."evaluates
night" this on blockers التنبيهThree وسطر "،
 بالـChecklistالـ شرط17
".Follow up with ratesتحت وOpen pause"، the وOpen Hoteliana"،
. 4."Open rates" يعمل
) يفتحالسيستم: 04 علىFlow والتقويم والوجبة، الغرفة نفس على 20–12 ويفتحNov prices، "Change ( 04.6* علىOV
دي. الفترة
. وينشر السعر 5يحط
.NO_RATE يشيلالسيستم:
 بسبب بتتباع مش لسه فيHOTELIANA_PAUSEDالليلة والصف 10.5، واحد.UI بيقل
. القايمةHotelianaلما الإيقاف، ترفع blockers][ والليلة فاضية تبقى 6.تتباع
D.3 مش هقدر ذّأنف الحجز  ← تبليغ  ← مراجعة  ← قفل
 .1: UI 10.6 المؤكديشوف: الحجز صفحة

---

**p. 342**

Open the agent" Makkah" Hilton · وHTL-88231 "Conﬁrmed"، وزرايرBadge issue"، booking a وReport
."thread
." itالبانر cancel not do - it Report booking? this honour وشرحCannot
Rooms الحجز referenceبيانات وBooking agent"(، Hoteliana )"A وAgent وHotel، plan، & وRoom وStay، &،
.Conﬁrmed وguests number، وConﬁrmation you، to وValue on،
."What reporting an issue doesبلوك
. 2."Report a booking issue" يعمل
):Flow 12( OV 10.6  يشوف
".HTL-88231 · Hilton Makkah · 24 - 27 Nov issue" booking a وReport 2026"،
."This is a report, not a cancellationبلوك
).Radio it" honour not you can "?Why اختيارات6(
."What happened"
."…The same physical room sale" the stop ومعاهAlso متعلّم، والافتراضي3" للنطاق، اختيارات
 الـ وTagسطر send، you "Before سطور3(
".Cancel" issue" the وReport
 .3."Report the issue يختاريعمل: overbooked is hotel الـThe ويسيب حصل، اللي ويكتب sale"، ويدوسStop متعلّم،
 السيستم واحدة):Transaction(
. 1 لسه الحجز إن عليهConﬁrmedيتحقق مفتوحة قضية ومفيش
. 2. SUPPLIER_FULFILMENT_INCIDENT  قضية issueيعمل وFulﬁlment الحدث،
. يبقى reviewالحجز under · issue ديFulﬁlment الحالة يشوف والوكيل 3"،
. 4" saleيعمل للياليStop الفعلية، الغرفة على 26–24 بـNov الوجبات، لكل incident، from · "auto بالقضيةTag مربوط
. 5.Critical لـ Cases(يبعت › )Operations خلالHoteliana الوصول لو القضية24. ساعة،
. 6.supplier_user الـ في logيسجل بفاعلActivity
. 4: OV 10.7  يشوف
".Issue reported · HTL-88231 · 15 Sep 2026, 09:41"
.Reported Reason" sent": you وWhat nights، وAffected sale، وStop issue، "Fulﬁlment وEvent by"،
 4" now": happens سطورWhat
."Close" booking" the وOpen
 .5 يشوف  10.7 الحجزUI يفتح لما
".Open the agent thread" review under · issue "Fulﬁlment وزرايرBadge information"، وAdd
Hoteliana is working on this booking." + "Reported 15 Sep 2026 · reason: … Do not cancel it and doبانر
."not send a new conﬁrmation number until the case closes
Outcome recorded بـTimeline التبليغ4 خطوات: progress in · outcome the deciding is وHoteliana ·"،
."Stop sale lifted · Lifts automatically when the case you against entry an without or وWith closes"،
."While the case is openبلوك
. 6.SAR 1,240" الحدث قررتHoteliana بقيدcancelled_by_hoteliana

---

**p. 343**

السيستم
".Cancelled by يبقى Hotelianaالحجز
 الشهر.ENT-2026-0418القيد كشف في ويظهر بيها ويتربط القضية من يتولّد
 saleالـ أوتوماتيك.Stop يترفع القضية بتاع
".Hoteliana decided on HTL-88231 وإيميلin-appإشعار
. 7: UI 10.8  يشوف
".Open statements" Hoteliana by "Cancelled وBadges posted" وزرايرEntry entry"، the وOpen
والمبلغ بالشرح البانر
 بـTimeline كلها5 خطوات
If you disagree, open the entry in Finance and use Dispute this here" got money the "How منها4( سطور،
.("entry
reference" Entry entry": وThe VAT، incl. · وAmount وSource، by، وPosted on، وShows .Status،
Hoteliana.3 E محتاجة معلومات  ← تصحيح  ← كله اتقبل
 الحدث فتحتHoteliana فندق3 على تصحيح طلبات Madinah الفندقHilton بنطاق .1،
Hoteliana" يحطالسيستم: إشعارMORE_INFO_REQUIRED ويبعت الفندق، عقود كل على action وإيميلRequires
".needs 3 details about Hilton Madinah
 .2: UI 10.9  يشوف
".More information required · {n} needed from you · {n} in review"
Hoteliana checked your details for Hilton Madinah - }n{ need you. Until they are accepted, everyالبانر
".Correct the }n{ details." sale from blocked stays hotel this on وزرارcontract
."See what is blocking sale." sellingبلوك not is Madinah Hilton why is ولينكThis
· for" asked Hoteliana وWhat والشرح، وحالته، اسمه، فيه طلب، لكل كارت on": والنسخasked الحالة، حسب وزراير vN"،
النتيجة
 behaves" request correction a "How سطور).4(
."Details already accepted"
 .3."Add them علىيعمل: )Required( times" check-out and يدوسCheck-in
:OV 10.8  يشوف
".Correct a detail · Check-in and check-out times · asked on 11 Sep 2026"
."What is being asked for"
."Anything the agent should know fromالحقول وCheck-in by، وCheck-out )optional(،
 3" it": send you سطور.After
."Cancel" Hoteliana" to وSend
 .4."Send to Hoteliana ويدوسيعمل: يملا
v1 · Sent - with Hoteliana since يعملالسيستم: يبقىv1 والطلب وSent، يعرضHoteliana، الكارت إشعار. يوصلها
".{date}

---

**p. 344**

.Under review من مراجع يبقىHotelianaلما الطلب يفتحه،
. 5."See why علىيعمل: correcting( needs · )Rejected sell" you types يدوسRoom
Every يشوف  10.9 وOV تنصيص، علامتي بين السبب 16:10: 2026, Sep 14 · Compliance · وHoteliana version,"،
".Follow up with Hoteliana" ومعاهاkept بالنسخ وView" now"، right blocks this وWhat it"، وCorrect
Rejected بيفتحView" نسخة على 10.9B" OV : 2" version · sent you وWhat وDownload"، والمحتوى، because"،
."…
 .6 يعمل it" "Correct ←  10.8 OV ويبعت ويعدّل نسخة، بآخر متعبيّ
يعملالسيستم: والحالةv3 .Sent،
. 7 الحدث مفتوحHoteliana طلب آخر قبلت
السيستم:
 لوحده.MORE_INFO_REQUIREDيشيل
".All details accepted · Hilton Madinah is selling إشعار againيبعت
 مفيش لو تتباع، ترجع الفندق عقود تانية.Blockersكل
. 8: UI 10.10  يشوف
."All clear · Nothing is open. Hoteliana accepted every detail"
."Hilton Madinah is selling again." + "Open sell statusالبانر
": closed" requests, بنسخه.The طلب كل
."Two things to keep in mind"
)Alternative ﬂows( 4 الفلوهات. البديلة
) UI 10.1: تجديدA1 غير من خلص العقد
. end_date التريجر بعد00:00 مكة بتوقيت
الخطوات:
. يبقىالسيستم: العقد عليهاExpired الليالي وكل وإيميلCONTRACT_EXPIRED، إشعار ويبعت 1،
. 2Still بتعرض isالصفحة else nothing - closed are sales New 2026. Dec 31 on ended contract وThis yours"."،
.The calendar after the end date" )Read ✓( و6 (، ✕ )3 وClosed" only(،
 .3."Open statements" periodالزراير new a for وRenew bookings"، وOpen العقد)، على مفلترة الحجوزات (قايمة
. 4This contract has ended - renew it to في التعديل زراير 03كل وFlow 04 ده للعقد سطربتتشال ومكانها change،
).UI ".prices ( والشاشةentity_readonly 11.6،
) النهاية بتجديدExpired وبيخرج جديدةA18، نسخة أو
)UI 10.3: اتنهىA2 العقد
 التريجر عملHoteliana المورد أو (منTerminate 03 الأدمنFlow من أو المورد، عند
الخطوات:
. عليهاالسيستم: الليالي كل الإنهاء، تاريخ من والعقدCONTRACT_TERMINATED only، إجباريRead وإشعار 1،

---

**p. 345**

 .2What termination: 2026الصفحة Sep 30 on early ended was contract وThis recorded."، وReason "…""،
التلاتة.does الحالات بين والمقارنة "،
 .3Start a new contract with bookingsالزراير وOpen Hoteliana"، with up وFollow statements"، وOpen this"،
"hotel 03( متختار).Flow والفندق ،
النهاية ودهTerminated .Final،
)UI 10.4: A3 الوقت نفس في إيقاف من أكتر
الخطوات
. 10.4 UI : active" }n{ · paused Hoteliana وWhat كروت4"، now active وPauses sellable، not وRooms 1Nights،
.)Longest days 90 next the in · وaffected pause،
 .2ACTION )"Open" وSCOPEجدول COVERS، IT وWHAT وSINCE، DATES، STAY وBLOCKED BY، وSET ←،
.OV 10.1 )
 .3."How overlapping pauses behaveبلوك
. 4 Hotelianaلما الغرفة موجود: لسه الفندق وإيقاف الغرفة إيقاف ترفع بتتباع مش فيتفضل 10.1. بيظهرOV الغرفة إيقاف بتاع
pause" that "Open + active." is Madinah Hilton on pause wider a selling: not Still Sep. 18 Lifted .(مقترح)"
) pause_window بسA4 إقامة ليالي على إيقاف غيرblocked_stay_dates: من
الخطوات
."Hoteliana blocked nights 10–20 Mar 2027 from sale on }scope{. Other nights sell as usualالبانر
يفضل .Activeالعقد
عليها بس دي الليالي التقويم، .HOTELIANA_PAUSEDفي
".Blocked stay dates · 10 - 20 Mar 10.1في OV : open" is selling - None · window وPause 2027"،
: المستقبلA5 في بتبدأ بيع فترة ليه إيقاف
الخطوات
كـ بيظهر البداية Octقبل 01 starts · pause فيScheduled 10.4" منفصلUI (قسم pauses Scheduled ).مقترح"
 البداية.Blockerمفيش لحد
 ما وقت يبدأ.Hotelianaإشعار ما يوم تاني وإشعار تحطه،
: كلهA6 المورد مستوى على إيقاف
الخطوات
صفحة كل على ثابت أزرق ).BR-10-23بانر
عليها العقود كل في الليالي .HOTELIANA_PAUSEDكل
".Scope "Your account 10.4 صفUI فيه
 والفريق والفلوس، والأسعار، شغالةالحجوزات، .كلها
OV 10.1 conﬁrmation the "Upload منA7: 10.2" أوUI
."Send what Hoteliana asked يفتحالخطوات: 10.2 علىOV والتركيز document a الموضوعAttach وعنوان for"،

---

**p. 346**

التصميمملحوظة: في السبب conﬁrmation مفتوحAllotment (سؤال الحق إثبات إلغاء مع بيتعارض 3…") بيظهر ده الزرار بس).
".Follow up with Hoteliana. إنهHotelianaلو الإيقاف على علّمت requested Document الوحيد(مقترح)" الزرار كده، غير
: قيدA8 غير من اتقفلت القضية
الخطوات
.Badge: "Closed · no entry posted" )Neutral(الـ
." sideالبانر your on not was issue the found Hoteliana you. against entry no with closed is case (أوThe
النتيجة). حسب
".No entry posted خطوةTimelineالـ فيه
".Open the زرار entryمفيش
 saleالـ اترفع.Stop
Replaced النتيجةA9 أوRelocated:
:Relocated
يبقى Hotelianaالحجز by "Relocated Neutral( .)مقترح
."Hoteliana moved the guests to }another hotel{. This booking is closed for youالبانر
onlyالحجز Read مطلوب. جديد تأكيد رقم ومفيش ،
".The بلوك نفس قيد، فيه entryلو
:Replaced
".Replaced by Hoteliana". "Hoteliana replaced the room with {room} at the same hotel"
Replaces فيه عادي كحجز للمورد وبيوصل جديد، بمرجع مربوط جديد حجز بيتعمل المورد، نفس عند البديلة الغرفة HTL-لو
88231 .(مقترح)"
) UI 10.7" مفتوحةA10 قضية على معلومات إضافة information: فيAdd
الخطوات فيهModal case the to information وAdd message"، وYour (إجباري)، )optional(" document a "،Attach
 وSendو Cancel" شكل" بنفس 10.2(مقترح، للـ)OV بتتضاف الرسالة وTimeline. إشعار.Hoteliana، يوصلها
"Guest nationality differs: سببA11
الخطوات
. 1Hoteliana charges the" 10.6في قسمOV يتختار، ده السبب لما sale، the stop سطرAlso ويظهر بيختفوا، الأداء وسطر
conﬁrmed stays booking Your difference. price the agent .(مقترح)."
 .2.) UI 05.4B ( "Issue open with Hoteliana" يفضل والحجز بالحجز، مربوطة قضية بيعمل بانرConﬁrmedالإرسال وعليه
. 3".Hoteliana closed the nationality issue on إشعار بيوصله المورد (عنده). الفرق بيدفع الوكيل HTL-88231النتيجة:
عليه. قيد ومفيش
Stop sale: غيرA12 من تبليغ
منالخطوات: العلامة يشيل sale the stop وAlso بيتسجل، التبليغ 10.7". بيقولOV requested Not · sale وخطوةStop "،
 saleالـ الـStop في موجودة.Timeline مش
 sale Stop كلهA13: الفندق على

---

**p. 347**

يختارالخطوات: dates affected the for hotel, whole بيعملThe السيستم sale". Stop للفندق الفعلية الغرف كل على كل في
".All rooms at Hilton Makkah · 24 - 26 Nov المورد الـعقود بنفس دي، للتواريخ .Tag  10.7 بيقولOV
)OV 10.8  ← OV 10.9: يصحّحA14 ← اترفض تصحيح طلب
 الخطواتالخطوات: زي و5 في6 .E.3  10.8 OV بالأحمر السبب سطر الفورم وفوق اترفضت، نسخة بآخر متعبيّ بيفتح
: كدهA15 قبل اتقبلت حاجة تعديل
."Edit" فيالخطوات: 10.10 أوUI accepted already يدوسDetails
Sale keeps running on the accepted version 10.8 بعنوانOV detail a Change وتحت(مقترح)" until،
".Hoteliana accepts this one
. MORE_INFO_REQUIRED  جديدة نسخة Sentبيتعمل غير، من
 اترفضت، شغالةلو تفضل المقبولة ومفيشالنسخة .Blocker،
: القيدA16 على اعتراض
.) 07.14 الخطوات entry" this "Dispute ← Finance ← entry" the "Open 07( 07.25،Flow أوOV
يبقى Disputedالقيد الكشف وباقي .مايتوقفش"،
".Entry disputed by }name{ · كمان القضية على بيتسجل }date{الاعتراض
 Hoteliana تانيA17: القضية فتحت
الخطوات
."Hoteliana reopened the case on HTL-88231إشعار
".Fulﬁlment issue · under فيهTimelineالـ بيتضاف }reason{ · }date{ · ترجعReopened والحالة review"،
جديد. بقيد بيتعمل تصحيح وأي هو، ما زي بيفضل القديم القيد
 saleالـ لوحده.Stop مابيرجعش
Expired: عقدA18 تجديد
منالخطوات: 10.1 يدوسUI 03 Flow ← period" new a for فيRenew بيظهر الجديد العقد النشر بعد Hotels. والقديمMy ،
.Expiredيفضل
 فيهاA19 الليلة الموردBlocker: ومن بس واحد
فيالخطوات: 10.4 العنوانOV 1 night this on الـblocker هو الوحيد الزرار تنبيه. سطر ومفيش .Fix"،
)Exception ﬂows( 5 الاستثناءات. والأخطاء
: الوقتE1 نفس في الحجز نفس عن بلّغ زميل
Sara already reported an issue on this booking at 09:41. Add بيظهر: يرجّعاللي التاني الإرسال والـ409 يعرضModal،
".Add information." instead case that to details وزرارyour
 ومفيشالمحفوظ: بس، الأول التبليغ sale مكررStop
: E2 الفورم فتح ما ساعة من اتعدّل أو اتلغى الحجز

---

**p. 348**

".This booking is no longer conﬁrmed )Cancelled by the agent at 09:30(. There is nothing to report" بيظهر اللي
".Open the bookingوزرار
 مفيش.المحفوظ:
: خلصتE3 الإقامة
The stay has ended. To raise a problem, ask Hoteliana." +" بيظهر: زراراللي issue booking a مكانهReport بيتشال.
".Ask Hoteliana
 الـE4 وتطبيق اتسجل التبليغ sale: فشلStop
We could not send the report. Nothing was بالتصميم ممنوع واحدة).Transactionده الاتنين في فشل السيرفر لو
." again try - يفضل.changed بالبيانات والفورم
"Report the issue" وقتE5 وقعت الشبكة أوSend:
بيظهر: فياللي اللي الرسالة نفس يفضلE4 المكتوب والنص ،
الـالحل: بنفس المحاولة إعادة key قضيتين.Idempotency فمفيش ،
: صلاحيةE6 مالوش
Only the Owner, an Admin or Reservations can (مقترح):bookings.cancellationمالوش ومكانه بيتشال، الزرار
."report a booking issue
Ask someone who can stop sales to close these الـ:inventory.stop_sellمالوش قسم sale ومكانهStop بيتشال،
nights .(مقترح)."
الفورم فاتح وهو منه اتسحبت لو  11.15 يقفلOV ما لحد يفضل المكتوب والنص ،
: مقبولE7 مش المرفق
بيظهر: الحقلاللي تحت MB 10 to up PNG or JPG PDF, Only ومعاه(مقترح)." .Remove،
: مفتوحةE8 والصفحة اترفع الإيقاف
 بيظهر: الصفحةاللي فوق شريط now just pause this lifted وزرارHoteliana الـRefresh." بعد 10.2،Refresh". بترجعUI
العادية العقد .Activeصفحة
?" فاتح كان 10.2لو وكاتبOV  anyway" message your Send writing. were you while lifted was pause وزرارينThe
وSend" Discard" .(مقترح)"
)Stale الـE9 Blockers: محدّثة مش
."Updated }hh:mm{ بيظهر: بتعرضاللي الصفحة
" دوسالحالة: rates موجود.Open لسه والصف ورجع، السعر وحط
. الحل خلالRefresh" بيتحدّث والمحرك القراية، يعيد 60" ثانية عندها.(مقترح) من الصف بتشيل شاشة مفيش
: E10 أسعار بيعدّل وهو خلص العقد
This contract ended at midnight. Changes to future" : UI 11.6  ← entity_readonly بيظهر: يرجّعاللي الحفظ
."nights are closed - renew to continue
 الـالمحفوظ: بسDraft مقروء بيفضل مااتنشرش اللي

---

**p. 349**

"Copy my unsaved الحل period" new a for اختارRenew لو الجديدة للنسخة بيتنقل ماتحفظش اللي والتعديل changes"،
.(مقترح)
 لهE11 اتعمل العقد تغييرTerminate: فاتح وهو
".This contract was terminated on بيظهر: نفساللي بنصE10 }date{،
: الطلبE12 نفس بيصححوا اتنين
"View version 3." بيظهر: يشوفاللي التاني بيبعت اللي ago minutes 2 detail this of 3 version sent وزرارينSara
".Send mine as version 4و
".Replaced before review بتتعلّمالمحفوظ: والقديمة كنسخ، الاتنين
 منE13 اتلغى أو اتقفل التصحيح طلب Hoteliana: بيعدّل وهو
 بيظهر اللي sending" needs Nothing request. this closed والـHoteliana يتقفلModal."
 الـE14 زرار بتاعة الوجهة عندهFix: مش صلاحية محتاجة
بيظهر: عموداللي في ومكانه بيتشال، الزرار manager Revenue "Needs أوFIX: Admin" an or Owner the Only زرار". مفيش
.Disabled
: اتشالE15 أو شركته، تبع مش إيقاف أو لحجز إيميل من لينك
".We could not ﬁnd this item. It may belong to another account or have been removed" :404 بيظهر اللي
: المتابعةE16 أو التبليغ فورم نص في خلصت الجلسة
. OV 11.12  بيظهر اللي
فيالمحفوظ: بيتحفظ النص sessionStorage الدخول. بعد وبيرجع تاني.، يترفع لازم المرفق
UI 10.5: تحميلE17 فشل
بيظهر اللي again" "Try + status." sell the load not could We الداشبورد في اللي الأرقام كأصفار". .ماتتعرضش
"Add information Hoteliana بيكتبE18: لسه والمورد قررت
". بيظهر اللي outcome" the "Open + Hoteliana." by Cancelled ago: moment a closed was case كتبهاThis اللي الرسالة
يتنسخ. ينفع يفضل والنص ماتتبعتش،
 رفعE19 المورد sale: مفتوحةStop والقضية بإيده القضية
."Lift" بيظهر: اللي تأكيد anyway sale stop the Lift open. still is HTL-88231 on case وزرارينThe on?" it وKeep
".Stop sale lifted early by }name{ رفعه: القضيةلو في بيتسجل
6 حالات. مش موجودة في التصميم
أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
termجدول contract the outside خالص،Nights مايظهرش سعر" ليها المدة برا ليالي ومفيش التحذير 1نافذة
حاجة مفيش ومكانه
UI 10.0

---

**p. 350**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
tomorrow ends · "Active البانرBadge ends". contract النهايةThis قبل واحد 2يوم
".tomorrow, 31 Dec 2026
UI 10.0
أخضر يبقى Janالبانر 01 starts term new the · التحذيرRenewed نافذة في وهو اتجدد 3العقد
". و2027 contract." new the يختفيOpen والجدول
UI 10.0
4 في 10.4صف تحتUI Oct 01 "Starts pauses": pauseScheduled بعدينScheduled (هيبدأ
 مفيش2026 قبلهاBlocker".
UI 10.4
}scope{بانر on sold be cannot Mar 10–20 العقدNights بس." معينة ليالي على 5إيقاف
Pause window · None - selling is" : OV 10.1. فيActive
"open
OV 10.1
10.1 وسطرOV الاتنين، بيعرض 12 from blocked is كمانSelling وليالي بيع فترة ليه 6إيقاف
".Sep to 30 Sep for nights 10–20 Mar only
OV 10.1
الصفحات كل على أزرق onبانر bookings new paused كلهHoteliana المورد على 7إيقاف
your account: "{reason}". Your bookings, rates and ﬁnance
. details "See + open." "stay ←  10.4 مابيتقفلشUI
UI 10.2
Activeالعقد والتقويمBadge العقد صفحة في بانر this. of عقدPart جوه غرفة على 8Activeإيقاف
contract is paused by Hoteliana: Deluxe Room · HB · 01 -
".15 Nov
UI 10.2
reason." a share not did Hoteliana you: to given ظاهرReason سبب غير من 9إيقاف
".Use Follow up to ask
OV 10.1
10.4في فيUI مايظهرش now active قسمPauses في يظهر اترفع". 10إيقاف
Lifted 18 Sep · by" days" 30 last the in Lifted :(مقترح"
"Hoteliana · Operations
UI 10.4
10.4 UI : sell" "Open + Hoteliana." by paused is إيقافNothing ولا 11مفيش
". أصفارstatus مابتظهرش الأربعة الكروت
UI 10.10
10.5 UI : "Open" + sale." on is publish you ولاEverything 12Blockerمفيش
". availability & جداولrates مفيش
UI 10.10
13UI 10.5 فاضيUI عنوان ومفيش مايظهرش، كله فيالقسم فاضي التلاتة من 10.5قسم
14 10.5 و25أولUI صف، more }n{ Show (مقترح)" من قسم50أكتر في صف
15UI فوق وHotelشريط وContract، (افتراضيDates، و90 يوم)، فيWho 10.5فلتر
clear الـcan في الفلتر URL. (مقترح)
UI 10.5
16OV saleالعنوان on is night الـThis كلهم17". شرط وفتح بتتباع 10.4الليلة
Fix
OV 10.4
17 والـBOOKING_WINDOW_CLOSED
MVP )C8( window الـBooking في مش
". في 10.4الشرط يبقىOV set window booking الكودNo
مابيتولّدش
OV 10.4
18UI 10.5 youالصف by وتحتهStopped incident" from · "auto والـTag sale"، فيStop قضية من
UI 10.7  ← "FIX "Open the case
UI 10.5
19" leastتحت at in happened what "Explain happened": reasonسببWhat كفايةAnother تفاصيل غير من
."40 characters
OV 10.6

---

**p. 351**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
 بس واحدة وغرفة غرفة، من أكتر فيه 20الحجز
المشكلة
 10.6في قسمOV بيظهر Checkboxes rooms?": لكلWhich
  افتراضيًا متعلّم والكل الـ(مقترح)غرفة، sale. الغرفStop على بيتحسب
المختارة
OV 10.6
الـ يوم لحد متاح اللياليCheck-outالتبليغ النهارده. من المتأثرة الليالي ظهرت. والمشكلة وصل) (الضيف بدأت 21الإقامة
Arrival was on 24 Nov -. الـ في مش عدّت saleاللي سطرStop
."Hoteliana treats this as urgent
OV 10.6
10.6في UI : yet" sent Not · number التبليغConﬁrmation ". تأكيد رقم غير من 22الحجز
The agent already holds a النص conﬁrmationمتاح.
The agent is waiting for a conﬁrmation" لـnumber يتغير
"number
UI 10.6
10.7في بانرUI Sep. 15 on cancel to asked agent مستنيThe تعديل أو إلغاء طلب عليه 23الحجز
." case the with it handling is ظاهرةHoteliana مش الرد وأزرار
UI 10.7
24RelocatedHoteliana moved". Hotelianaالـ by "Relocated البانرBadge
".Timeline: "Outcome: relocated." }hotel{ to guests الـthe
غيره من أو قيد مع
UI 10.8
25ReplacedHoteliana". Hotelianaالـ by "Replaced البانرBadge
." }room{ with room the عندreplaced لو البديل للحجز ولينك
المورد نفس
UI 10.8
26 posted entry no · "Closed سطرBadge with". case closed قيدClosedA غير من
." all at entry no with closes side your on fault بلوكno غير من
Entry
UI 10.8
10.8في الـUI بلوكStatus، في · "Disputed entry": اتعملهThe 27Disputeالقيد
 )Warning( checking" is الـHoteliana وفي جديدTimeline. سطر
UI 10.8
review under · issue "Fulﬁlment وBadge بسطرTimeline"، تاني اتفتحت 28القضية
". }date{" · ظاهرReopened القديم القيد
UI 10.7
10.8في بلوكUI entry، والمبلغThe بس، والحالة المرجع بيظهر مالوش" 29finance.viewالمستخدم
" entry" the "Open وRestricted". statements" بيتشالواOpen
UI 10.8
مالوش 30المستخدم
bookings.view_financial
" 10.6 youسطرUI to خالصValue مابيتعرضش
31"Guest nationality differs"Hoteliana الـ saleقسم وسطرStop بيختفوا، الأداء وتحذير
charges the agent the price difference. Your booking stays
".conﬁrmed
OV 10.6
32UI 10.5 11.4 11.4UI UI ofﬁce)missing_permission( لينكFront فتح
33 10.9 SepالحالةUI 13 since Hoteliana with - "Sent )Info(. تصحيح"Sent" فتحهSentطلب ماحدش ولسه
34Required الكارت وعلى تذكير، }date{إشعار · sent الـReminder الأحمرDot". بقاله تصحيح أيام3طلب
"Propertyعلى
UI 10.9
هيكل بنفس فورم ليه نوع 10.8كل OV : asked" being is تانيةWhat طلبات 35)Settingأنواع
 الحقولfor + it" send you الملفاتAfter أوPDF". أوJPG
MB وPNG 10،
OV 10.8

---

**p. 352**

أقرب السلوكشاشة المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
يتبني عليها
36"Room types you قايمة فيه ولينكCheckboxesفورم الرسمي، الفندق كتالوج من sellطلب
OV 02.R1  ← "Room not listed? Add a missing room"
OV 10.8
37Reservations contact for thisطلب
"hotel
10.8 وNameالحقولOV وPhone، Email،
38 قبولHoteliana غير من الطلبات كل قفلت
(إلغاء
Hoteliana closed the يتشالBlockerالـ 10.10 بنصUI
."open requests. Nothing is needed from you
UI 10.10
39 واحد،MORE_INFO_REQUIRED عقد نطاقه
فندق مش
Until they are accepted, }contract{ stays blockedالبانر
."from sale
UI 10.9
40UI 2الهيدر review in 1 · you from والبانرneeded need"، فيthree المتناقضة 10.9النصوص
needed from you" = Required +". يتحسبyou لازم العدد
in review" = Sent + Under وRejected review،
UI 10.9
41 10.9B PDFبيطلّعOV بعتها اللي واسم بالتاريخ النسخة فيه فيDownload(مقترح 10.9B نصOV كلها لنسخة
القضية لنفس بتتضاف الجديدة 10.3الرسالة بيقولOV تانيAdded بعت والمورد مفتوحة متابعته 42الإيقاف
"to CTR-N-3108
OV 10.3
43 10.2 "ScheduledالـUI بيبقىBadge يبدأ لما الإيقاف. بانر ومعاه إيقافScheduledالعقدPaused" وعليه
10.3 SepUI 30 on terminates · "Active السببBadge فيه أحمر بانر المستقبل". في بتاريخ 44الإنهاء
45 Hotelianaالحجز by قايمةCancelled في
)Flow 05الحجوزات
)Danger(الـ Hoteliana" by "Cancelled فيهBadge الحالة وفلتر ،
ده الاختيار
Flow 05
)State machine( 7 الحالات.
 العقد7.1
التريجرمين الـاللونللدخول الحالةBadge
DraftDraftNeutralإنشاءsupplier_user
البدايةsupplier_user تاريخ قبل ScheduledScheduledNeutralتفعيل
ActiveActive · النافذةActive (وفي
("ends in {n} days
أو وصل، البداية Successتاريخ
اترفع الإيقاف
system / hoteliana_user
PausedPaused by كلهhoteliana_user العقد بيغطي HotelianaWarningإيقاف
ExpiredExpiredNeutral بعد00:00
end_date
system
TerminatedTerminatedDangerTerminatesupplier_user أوhoteliana_user
( contracts.lifecycle )
)Pause الإيقاف7.2
. lifted  ← active  ← scheduled  الحالات
).system( pause_window.from: scheduled →  بتاريخactive

---

**p. 353**

.)system active →  منlifted لوhoteliana_user: أوتوماتيك أو عدّىpause_window.to،
.Lifted = الألوان Neutral = وScheduled )"Paused"(، Warning = وActive Neutral،
الـ7.3 مالوش:Blocker بيكونBadge لوحده. منactive قسمه:since بلون بيظهر الكود يتحقق. الشرط لما وبيتشال ،
You = Warning
Hoteliana = Info
Structural = Neutral
(مقترح
 التبليغ7.4 مع الحجز
الـاللون منإلىالتريجرBadge
ConﬁrmedFulﬁlment issue ·
under review
· issue بلّغFulﬁlment )supplier_userالمورد
under review
Warning
Fulﬁlment issue ·
under review
Relocated by
Hoteliana
 by قررتHotelianaRelocated
Hoteliana
Neutral
(مقترح
Fulﬁlment issue ·
under review
Replaced by
Hoteliana
 by قررتHotelianaReplaced
Hoteliana
Neutral
(مقترح
Fulﬁlment issue ·
under review
Cancelled by
Hoteliana
 by قررتHotelianaCancelled
Hoteliana
Danger
Fulﬁlment issue ·
under review
Conﬁrmed عاديHoteliana اتنفذ والحجز القضية قفلت
 غرفة) لقى (مقترح(الفندق
ConﬁrmedSuccess
· issue حالةFulﬁlment Resolvedأي
under review
 تانيHoteliana—Warning القضية فتحت
 بيشوفها7.5 المورد ما (زي القضية
.Reported ← Hoteliana is deciding ← Outcome recorded ← Closed المراحل
.Closed · no entry posted" )Neutral( الإضافيBadgeالـ  )Warning(" posted" أوEntry
 ←Recovery requested  ← Contest window  ← Liability  ← Guest resolved  ← Open ( الأدمن عند المراحل
) النص.Closed في اللي المرحلتين في بتتلم
 الـ7.6 sale القضيةStop بتاع
.("Tag "auto · from incident) on
←  اتقفلتlifted القضية بدريsystem: رفعه المورد أو .)supplier_user)،
: ←  عدّتexpired الليالي
 التصحيح7.7 طلب
الـاللونالتريجر الحالةBadge
RequiredRequiredWarning الطلبHoteliana فتحت
نسخة بعت SentSentInfoالمورد

---

**p. 354**

الـاللونالتريجر الحالةBadge
Under reviewUnder reviewInfo)system event فتحهاHotelianaمراجع
AcceptedAcceptedSuccess قبلتHoteliana
Rejected · needs correctingRejected · needs correctingDanger بسببHoteliana رفضت
Hoteliana الطلب لغت ClosedClosedNeutral(مقترح
: Sent ← جديدةRejected نسخة يبعت المورد لما
.Replaced before نفسها حالةالنسخة ليها أوSent أوAccepted، أوRejected، review،
الـ7.8 Blocker  النطاقMORE_INFO_REQUIRED على   مشon واحد طلب فيه ما طول ومشAccepted off،Closed
.)systemأوتوماتيك
review under · issue "Fulﬁlment وGlossary: Hoteliana"، by وCancelled Hoteliana"، by "،Relocated/Replaced
postedو وEntry وSent"، review"، وUnder وAccepted"، وRequired"، correcting"، needs · Rejected مش"
. فيموجودين 00.S تتضاف.REF ولازم مقترحة فوق اللي الألوان
8 الحقول. والتحقق
"Ask Hoteliana" مع8.1 المتابعة Hoteliana ( 10.2 وOV information) وAdd
رسالة الخطأ الحقل؟إجباريالقواعد)English(
What is this
about
 من (متعبيّ أيوه
السياق)
 only منRead إيقاف. من يتفتح لما
" Hoteliana" قايمةAsk بيبقى
".Choose what this is about"
Your /" characters." 10 least at of message a لـ10منWrite 2,000 حرف messageأيوه(مقترح)
"."Messages are limited to 2,000 characters
Attach a
document
 واحد أوPDF،(مقترح)ملف أوJPG لأ
MB وPNG 10،
".Only PDF, JPG or PNG up to 10 MB"
) OV 10.6 التبليغ8.2
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Why can you
?not honour it
the" honour cannot you why منRadioChoose واحد أيوه6،
".booking
What
happened
لـ20من مع2,000 حرف. reason علىAnother أيوه"
40الأقل (مقترح)
Tell Hoteliana what happened in at least 20"
characters." / "Explain what happened in at
".least 40 characters
Which  من أكتر roomsلو
 (مقترح)غرفة
room" one least at الأقل."Choose على واحدة غرفة
Also stop the
sale
(متعلّم لأ
افتراضيًا)
مع بس ومشinventory.stop_sellبيظهر ،
"Guest nationality مع differsبيظهر
—

---

**p. 355**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
الـ Stopنطاق
sale
الـ Stopلو
 متعلّمsale
stop" to what من."Choose الوجبات3واحد لكل الفعلية الغرفة والافتراضي ،
 القضية8.3 على معلومات إضافة
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Your characters" 10 least at of message a لـ10من."Write حرف2,000 messageأيوه
Attachmentلأ8.1زي8.1زي
) التصحيح8.4 10.8 النوعOV حسب
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Check-in بنظامHH:MMوقت بخطوات24 ساعة، fromأيوه15
 (مقترح)دقيقة
."Enter the check-in time"
Check-out time" check-out the byأيوهHH:MMوقت."Enter
Anything the agent should
know
characters" 300 under this 300".Keep بالكتير حرف لأ(مقترح)
Reservations contact ·
Name
name" contact the لـ2من."Enter حرف80 أيوه
Reservations contact ·
Phone
+966" e.g. number, phone valid a والافتراضيE.164صيغةEnter 966، أيوه(مقترح)
".5x xxx xxxx
Reservations contact ·
Email
address" email valid a صحيحة."Enter إيميل أيوهصيغة
Room types you hotel's" the from room one least at الرسميPick الكتالوج من الأقل على واحدة sellأيوهغرفة
".room list
بتطلب اللي (للأنواع ملف
مستند)
حسب
النوع
MB MB" 10 to up PNG or JPG PDF, أوPDF".Only أوJPG وPNG 10،
 فلتر8.5 10.5 (مقترحUI
رسالة الخطأ الحقل؟إجباريالقواعد)English(
النهارده لحد90الافتراضي النهارده من يوم. يوم540 Datesلأ
قدام
Pick dates from today"
".onward
Hotel / Contract / Who can
clear
متعدد— لأاختيار

---

**p. 356**

9 الإشعارات. والإيميلات والسجل
مينالقناةRequires الحدثبيستقبل
؟action
 ctivity log سطر الـ
 الـcontract.expiring (عند
بـThreshold النهاية قبل وتاني 7، أيام )مقترح
+ contracts.editأصحابin-app
email
أيوهact.expiry_warning
+ contract.expiredcontracts.viewأصحابin-app
email
Expired ← Active لأ·
+ contract.terminatedcontracts.viewأصحابin-app
email
(إجباري
· لأser/supplier_user
 ctive ← Terminated
(reason)
pause.set+ contracts.viewأصحاب
 النطاق)rates.view (على
in-app +
email
والـ (إجباري،
Toggle
مقفول،
Setوجنبه
by
("Hoteliana
active ← — · لأse.set
 window, stay dates)
pause.update · فوقin-appلأser اللي pause.updatedنفس
+ فوقin-app اللي pause.liftedنفس
email
active · pause.lift لأ·
← lifted
pause.followup_sent: )CTR-N-…( الفريقHotelianaالفاعلin-appلأe.create
 + الصلاحيةin-app أصحاب + case.repliedالفاعل ردتHoteliana(
email
فيها لو أيوه
سؤال
a_user · case.reply
incident.reportedأصحاب
.bookings.view_operational
 Ops Hoteliana: الوصولCritical( لو
(24h
· in-appلأking.report_issue
 ment issue (reason)
· )auto stop_sale.auto_from_incidentinventory.viewأصحابin-appلأry.stop_sell
 ) · open ← stopped
incident.info_addedHoteliana عندin-app
Hoteliana
— ser · case.add_info
incident.outcomeأصحاب
bookings.view_operational
in-app +
email
under · لأent.resolve
review ←
 elled_by_hoteliana
+ incident.entry_postedfinance.viewأصحابin-app
email
entry.post · لأnance(
 NT-…) · — ← SAR x
incident.closed_no_entryأصحاب
bookings.view_operational
)no — · in-appلأident.close
entry)
incident( from · stop_sale.lifted_from_incidentinventory.viewأصحابin-appلأuto
· stopped ← open

---

**p. 357**

مينالقناةRequires الحدثبيستقبل
؟action
 ctivity log سطر الـ
incident.reopenedأصحاب
bookings.view_operational
in-app +
email
← closed · لأreopen
under review
correction.required+ hotels.requestأصحاب
hotels.view
in-app +
email
← — · أيوهrection.open
 cker.add؛Required
 _INFO_REQUIRED
correction.sentHoteliana عندin-app
Hoteliana
— · correction.send ·
 jected ← Sent (vN)
correction.under_review——— view_start · Sent ←
Under review
+ correction.rejectedhotels.requestأصحابin-app
email
Under · أيوهction.reject
 ected (reason, vN)
Under · correction.acceptedhotels.requestأصحابin-appلأion.accept
 w ← Accepted (vN)
correction.all_accepted+ hotels.viewأصحاب
contracts.view
in-app +
email
blocker.remove · لأm
 EQUIRED · on ← off
+ correction.reminderhotels.requestأصحابin-app
email
(نفس أيوه
)Threadالـ
correction.remind
بتبقى فندق) أو قضية، أو (إيقاف، الحاجة نفس على المتكررة واحدThreadالأحداث حالة آخر على وبيفتح ،
Required by Hoteliana - pauses and terminations affect what  والإنهاء إجباريةالإيقاف الـإشعارات وجنبهToggle: مقفول،
(.UI 11.21 ) ".you sell
 من بتخرج youالحاجة Needs تتبعت. المتابعة أو يتبعت، التصحيح يتعمل: الأكشن لما يتقري." لما مشمش نفسه والإيقاف
you" بتتباع".Needs مش "حاجة مستوى في الداشبورد في بيظهر يشيله. مايقدرش المورد لأن "،
Stop sale. Append-onlyالـ منLog واحد الفاعل :4.  وsupplier_user وhoteliana_user، وsystem، الـapi، رفع
systemأوتوماتيك .Hotelianaمش،
)Acceptance criteria( 10 معايير. القبول
 .1Badge "Active · ends in 28 إن الـبفرض للموردThreshold 28 يوم، يفضللما 28 العقد، نهاية على يوم بانريظهر 10.0 والـUI
وإيميل.days إشعار ويوصل "،
 .2 إن بفرض Hoteliana الـ غيرّت لـThreshold 45 يظهر، بـالبانر النهاية قبل الكود45 في تغيير أي غير من يوم
. لما النهاية، بعد ومخزون سعر ليها ليالي وفيه التحذير نافذة في العقد جدولتظهر في term contract the outside وفيNights 3"،
عليها .OUTSIDE_CONTRACT_TERMالتقويم
. تبقىلما الساعة بعد00:00 مكة بتوقيت end_date يبقى، العقد وExpired يتقفل، جاية اللي الليالي على والتعديل 4الحجوزات،
 تفضل المؤكدة تأكيد). ورقم وتعديل، (إلغاء، تتخدم
. 5.Check-out إن بفرض بعدها، ويخلص النهاية قبل بيبدأ مؤكد حجز لما يخلص، العقد يفضل الـالحجز لحد صالح
. لهلما يتعمل العقد Terminate زراريظهر، ومفيش تنصيص، علامتي بين السبب صالحةResume الإنهاء تاريخ بعد والحجوزات 6،
. 7 لما Hoteliana عقد، توقف مايتغيروش والمخزون والأسعار وينشر، يعدّل يقدر والمورد بتتباع، ليلة يترفعمفيش الإيقاف ما لحد

---

**p. 358**

 .8 إن بفرض غرفة، على وإيقاف الفندق على إيقاف فيه لما يترفع، الغرفة إيقاف تفضل والغرفة بتتباع، مش 10.4 إيقافUI يعرض
الفندق.
. 9 يفتحلما 10.4 UI كل، بسيشوف واحد أول مش النطاقات، كل على النشطة الإيقافات
. إن عليهبفرض إيقاف blocked_stay_dates بس، بس دي عليهاالليالي اللي يفضلHOTELIANA_PAUSED والعقد 10.Active،
. 11 لما متابعة، يبعت فيتتعمل وتظهر بمرجع قضية cases وYour 10.3"، هوOV ما زي يفضل والإيقاف المرجع، يعرض
. 12 لما مفتوحة، والأولى تانية متابعة يبعت تتضاف القضيةالرسالة لنفس
. 13 لما Hoteliana الإيقاف، ترفع يرجع البيع تتقفل والقضية إشعار، ويوصل المورد، من أكشن أي غير من
. 14 يظهرinternal_noteالـ ما عمره الإيقاف بتاع الـ في يرجع ولا البوابة في بتاعهاAPI
. 15. ولما التقويم، 10.5 UI الليلة، نفس يعرضوا والداشبورد متطابقة، تكون منالأسباب جاية كلها لأنها blockers][،
. إن فيهابفرض ليلة وNO_RATE HOTELIANA_PAUSED يفتحلما، 10.4 OV الـيشوف، منهم17 واتنين شرط، حل✕ إن وسطر 16،
كفاية. مش لوحده السعر
. 17 لما دي، لليلة سعر يحط Blockerالـ  يختفيNO_RATE خلال الإيقاف60 بسبب بتتباع مش تفضل والليلة ثانية،
. يفتحلما 10.5 UI متقسمةBlockersالـ، تكون  حسب3 أقسام مايظهرشcleared_by الفاضي والقسم 18،
. زرارلما Fix عنده، مش صلاحية محتاج مايظهرش يقدرالزرار بمين سطر ومكانه 19،
. 20 زرارمفيش حجزCancel أي على البوابةConﬁrmed في
. 21" بسببلما يبلّغ overbooked is hotel ومعاهThe sale" Stop يبقى، الحجز review" under · issue الموردFulﬁlment عند
".Tag "auto · from incident والـ الوكيل، saleوعند بـStop الوجبات لكل الفعلية الغرفة على يتعمل
. 22. supplier_cancelled  لما يتبعت، التبليغ المسجل الحدث  SUPPLIER_FULFILMENT_INCIDENT ومش،
. 23."Not requested غيرلما من يبلّغ sale Stop مفيش، sale وStop بيتعمل، 10.7 يقولOV
. إن فيهبفرض sale Stop الحجز، ليالي من ليلة على تجاري لما تتقفل، القضية saleالـ يفضلStop التجاري اللي هو بس القضية وبتاع 24،
يترفع.
. 25."Add information لما الوقت، نفس في الحجز نفس عن يبلّغوا زميلين لـتتعمل يتوجه والتاني واحدة، قضية
. 26. UI 10.8 لما بقيد، تتقفل القضية يظهر منالقيد ويتفتح السبب، وفيه بالقضية، ومربوط الجاي، الكشف في
. 27."Badge "Closed · no entry posted لما المورد، على غلط غير من تتقفل القضية والـمفيش قيد،
. 28 يختارلما differs nationality Guest الـ"، saleقسم بيختفواStop الأداء وتحذير
. 29. MORE_INFO_REQUIRED لما Hoteliana فندق، بنطاق تصحيح طلبات تفتح الفندق عقود عليهاكل
. 30 لما تصحيح، يبعت بنتيجتهابتتعمل ظاهرة تفضل القديمة والنسخ جديدة، نسخة
. لما Hoteliana سبب، غير من ترفض يرفض كلالسيرفر البوابة، وفي الأكشن. Rejected ظاهر سبب 31.ليه
. 32."selling again لما يتقبل، مفتوح طلب آخر لوحدهBlockerالـ يتشال و 10.10، إشعارUI ويوصل يظهر،
. 33 لما متقبلة، كانت حاجة يعدّل  يكمّل ومفيشالبيع المقبولة، النسخة على بيتحطBlocker
. 34 إن فضلبفرض طلب 3 Required أيام، تذكيريوصل وإيميلin-app
. 35. UI 11.4  مستخدملما ofﬁce لينكFront يفتح 10.5 UI يشوف،
11 أسئلة. مفتوحة
الوضعالاقتراح / #السؤالالتعارض
1 ويخلص:C10 المدة جوه بيبدأ جديد حجز
بعدها
: 10.R وREF 10.0 البروتوتايبUI
كله بيمنعه
المؤكدة الحجوزات القرار. لحد ممنوع يفضل
الـ لحد Check-outبتتخدم

---

**p. 359**

الوضعالاقتراح / #السؤالالتعارض
2 10.R REF : sales:" New · بيتباع؟ScheduledالعقدScheduled
Active · yet ."Not  10.4 بيقولOV
Contract state is" تحتScheduled
"sellable
 الـREFالـ يكسب. يتعدّل،Checklist
 (زيBlockerويتضاف
اللياليCONTRACT_NOT_STARTED أو )،
OUTSIDE_CONTRACT_TERMتتحسب
3"…Allotment إيقاف conﬁrmationسبب
"Upload the signed conﬁrmationوزرار
اتلغى الحق قرارSupplyإثبات Sep، 24 )،PO
 10.Rو بيقولREF مابتطلبشHoteliana
الفندق مع المورد عقد
UI في السبب مثال 10.2يتغير
. 10.1و فيOV اختياري مرفق يبقى الرفع
 لو بس بيظهر أو طلبتHotelianaالمتابعة،
مستند
4 الـ saleرفع ولاStop أوتوماتيك القضية بتاع
المورد؟ من بخطوة
Lifts automatically when" : UI 10.7
the case closes". OV 10.6 : "lifts in
one step". REF 10.R : "can be lifted in
16: step ."one  10.8 اتقفلتUI القضية
Sep 18 والـSep sale اترفعStop
واحدة عملية في القفل وقت أوتوماتيك
 10.8تواريخ تتصلّحUI
5" differs" nationality فورمGuest جوه
"cannot honour"
: التنفيذ في فشل مش بيدفعN1ده الوكيل
الفرق)
يفضل ومفيشConﬁrmedالحجز Stop،
 منفصلsale لزرار يتنقل أو أداء. تحذير ولا
IN-8/IN-10 خلالSupply اعتراض أيام7: إمتى؟ بيتعمل 6القيد
: استرداد يتطلب ما 10.8قبل القيدUI
من والاعتراض بدقيقتين، القرار بعد اتعمل
Finance
الاعتراض، نافذة بعد القيد إما قرار: لازم
Contest 10.8وساعتها يعرضUI
}date{ until يبقىwindow الاعتراض أو "،
نفسه القيد على
فيbookings.cancellation مفتاح 08.Rمفيش التبليغREF صلاحية 7مفتاح
جديد(مقترح) مفتاح أو ،
31 (الـbookings.report_issue
هيبقوا )32مفتاح
hotels.request مفتاح(مقترح) التصحيحمفيش طلبات على الرد 8مفتاح
10.R فيهREF 5 أكواد 10.6 فيهOV التبليغ،6 أسباب 9عدد
"Guest nationality differsومنهم
الـ في الكود (زيREFيتضاف يتنقل أو )5،
10 والـBOOKING_WINDOW_CLOSED
MVP )C8( window الـBooking في مش
 الـ في مابيتولّدش 10.5MVPالكود وUI 10.4 بيعرضوهOV
11 وجودACCESS_NOT_APPROVED مع
عقد
بس الوصول قبول بعد بتتفتح العقود
 ( 02.5B وOV 10.5)، علىUI عقد فيه
قرار وكمان المراجعة. تحت وصوله لسه فندق
الأوتوماتيك 02القبول سؤالFlow )1،
اترجع أو اتسحب الوصول لو بس يحصل
اتعمل العقد ما بعد للمراجعة
12 فيCONFIRMATION_MODE_INVALID
REF 10.C
بينما للمورد، اسم غير من خام ككود بيظهر
Conﬁrmation mode 10.5 بيقولUI
"does not match
Conﬁrmation mode does notالاسم
" مكانmatch كل في
13Badge 10.4 بـOV بتبدأ والأولوية العقد، بحالة بيبدأ 10.4ترتيب الـOV أولوية مقابل
HOTELIANA_PAUSED
للـ وواحد للعرض واحد ثابتين: ترتيبين
Badge (BR-10-29)
14moves to Under" OV 10.8نص
"review
 يبقى toالنص moves request بيروحREFالـThe الأولSent:
."Sent - Hoteliana is notiﬁed

---

**p. 360**

الوضعالاقتراح / #السؤالالتعارض
15"Paused by supplier" CT-2 حالةSupply فيه
REF 10.R  . Paused by supplier
Stop منPausedبيقول والـHoteliana بس،
 حالة،sale مش المورد من
"pause فيهcontracts.lifecycleو
 بيستخدم saleالمورد كلمةStop بس.
 وصفpause من تتشال
contracts.lifecycle
قايمة في تظهر التصحيح 16Requestsطلبات
02( ؟Flow
الفندق صفحة مكانها 10.9لأ. هناك،UI مرسومة مش
"What needs youوالداشبورد
17SUPPLIER_HOTEL_INACTIVE
Structuralمتصنف
 لقسم يفضلHotelianaيتنقل أو بيشيله، اللي Hotelianaلكن للعلاقة)Resume(
Offboarding السببStructural لو

---

**p. 361**

