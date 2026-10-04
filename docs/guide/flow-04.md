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

# Flow 04 · Rates & Availability

Availability & Rates 04: (Flow الأسعار )والإتاحة
المصادر 04 Flow Section ( وشاشات523:3212 في04.*)، 12 Flow ( نسختين)،3662:62744 فيه لو بتكسب اللي وهي ،
 04.Rو REF ( و1226:3281 03.R)، REF ( و1166:3085 10.C)، وREF 10.5 وUI 10.4 بتتباع"،OV مش لـ"ليه
08.Rو وREF للصلاحيات، 11.R REF والتعارض. والنشر للحفظ الفلو: كل في البيانات فندقمثال Hotel Makkah Noor ،Al
Blockعقد Annual Makkah · HTL-2026-0142 supplements( + 2،Base overbooking + 50 pool ،Shared
).500 / 400 18:00 · before days 3 إندRelease ويك Fri، الأساسThu, الغرفة View، City · Room بسعرStandard
.Sun 20 Sep التصميم في 2026النهارده
1 الهدف. والنطاق
موجود ده الفلو ليه
 فيه بيدير المورد اللي الوحيد المكان اليوميده والبيع الفاضية، والغرف ليلة، لكل السعر Request: On / sale والـStop ،Release،
):  في ده كل الليلة. مستوى على عقدوالقيود لكل واحدة شهرية شبكة grid( month =Juniper-style والأعمدة الغرف، = الصفوف
الليالي.
.PUB-YYYYMMDD-NNNN بيتحفظ تعديل بعدDraftكل غير للوكلاء ومايوصلش publish & نشرReview كل رقمBatch. ليه
).Night override).  ده الفلو نفسه العقد مابيعدّلش is."( it as stays contract العقدThe فوق معينة ليالي على قيم بيحط هو
.Flow مكانها المخزون) نموذج المواسم، الغرف، العملة، النوع، (المدة، نفسها العقد 03شروط
النطاق ):MVPفي
العقود أنواع لكل الشهرية supplementsالشبكة + أوBase price وFixed pool، أوShared غرفة نوع لكل رقم أو sale وFree ،
.On Request أوAllotment
الشبكة على العقد مابدأش)،Scheduled،Activeحالات (لسه Ended only( منPaused)،Read .Terminated،Hoteliana
العرض rowsخيارات rooms،Show rows،meals،Show nights،Compact past days،Hide 7 last · Select،Pickup
.cells
.Not out،Allالفلاتر 4،Sold fewer متغير)،or (الرقم sale request،Stop published،On priced،Not
 و والشهور، والعقد الفندق contractsاختيار ended وInclude for"، الجنسيات).Prices (أسعار
).xlsx / csv / pdf( key وحدColour gone" وAlmost Export،
.) OV 04.6P1/P2) prices منChange حالاته بكل فترة، أو (ليلة 04.6A لـOV 04.6O اللياليOV ومنتقي
.) OV 04.5E/ES/EW الـ فترةsupplementsتعديل أو لليلة
Flow status Night ( 04.4/04.4F وOV breakdown)، Pool ( 04.6/04.6F (بيفتحOV بتتباع" مش و"ليه 10.4)، منOV
.(10
rates Bulk وBase( وFixed Request)، On / sale وStop حالاتهمRelease، بكل ،
.Booking publish & وReview والنشر، ID، وBatch versioning، وPeriod snapshot،
.) Flow 04-W NOW"كارت DOING الفرصWORTH وقايمة list، كـWin تحتsub-flow)
النطاق: برا
والإشغال الأطفال lensعدسة occupancy & :)Children decision (سؤالPending مشC9 .MVP)،

---

**p. 159**

.)"Not in the MVP scope until the client answers"( MVP window سؤالBooking الـC8: في ومش مفتوح،
  بيبقى نسبي تعديل أي المنتج. من اتشال (%): مئوية بنسبة بالريالتعديل بسمبلغ
.Release 2 ← تانية ليالي على ليلة nightنسخ Copy بس كفكرة عليه اتوافق مرسوم): مش
 push API / manager المواسم.Channel برا السوق حسب وأسعار الوكيل، حسب وأسعار المورد، من
.Flow 03 ده المخزون: نموذج أو عملته أو نوعه أو العقد مدة فيAmendتعديل
العربية ).RTLالواجهة
(من والصلاحيات بيستخدمه 08.Rمين REF بالدور): مش بالمفتاح دايمًا الشرط ،
الإجراءالمفتاحOwnerAdminRevenue
mgr
ReservationsFront
office
Finance
ويشوف الصفحة يفتح
الأسعار
rates.view✓✓✓✓✗✓
المخزون صفوف يشوف
Left / Sold / Pool /)
(Pickup
inventory.view✓✓✓✓✗✗
 ويعمل أسعار Draftيغيرّ
prices( Bulk،Change
،Supplements،rates
(Win list Apply
rates.edit_draft✓✓✓✗✗✗
ينشرrates.publish✓✓✓✗✗✗
Stop sale / Open sale /
On Request
inventory.stop_sell✓✓✓✓✗✗
inventory.edit✓✓✓✗✗✗ ليلة على الغرف عدد يغيرّ
  الـ لياليReleaseيغيرّ على
نفس (مقترح:
(inventory.edit
inventory.edit✓✓✓✗✗✗
 stay علىMinimum
 الليلة (مقترحمستوى
(rates.edit_draft
rates.edit_draft✓✓✓✗✗✗
Export+) rates.view
 عشانinventory.view
في تطلع المخزون صفوف
الملف)
✓✓✓✓✗✓
"Almost  حد gone"يغيرّ
(مقترح)
rates.edit_draft✓✓✓✗✗✗
 ofﬁce مالوشFront عنصرrates.view ← Availability & Rates مايترسمش مباشر لينك فتح ولو أصلاً، بار التوب في
."This screen needs rates.view" 11.4 برسالةUI
 عندهFinance ومعندوشrates.view بصفوفinventory.view بتظهر الشبكة ← وRates Request On / sale وStop
N وRestrictions صفوفRelease بس. pool وContract pool in وLeft وSold of وخيارLeft … فلاترPickup و out وSold
fewer or .مايترسموش

---

**p. 160**

"You (عندهAuditor حاجة كل بيشوف وrates.view inventory.view التعديل أزرار وكل مرسومة) سطرمش ومكانها are،
.( state_readonly ) an Auditor - the account is read-only for you"
 عندهReservations معندوشinventory.stop_sell بس فيrates.publish مشروحة دي الحالة الأسئلةBR-04-78. وفي
المفتوحة
You have Rates, but UI 11.5 نطاقه):Scopeالنطاق برا فندق على عقد فتح لو بس. عليها هو اللي الفنادق بيشوف اليوزر
.not for this hotel"
staff Hoteliana behalf( موظف):on Hoteliana المورد أسعار يدخّل ممكن بسDraftكـ و بإعداداته، المورد حساب من هو المورد
. hoteliana_user  = actor). بينشر (قراراللي 24 الـSep بيكتب السجل
):Entry الدخول pointsنقط
. 1. بار Availabilityالتوب & Rates فتحهم ده اليوزر وشهور وعقد فندق آخر بيفتح يوزر). لكل محفوظين فندق(مقترح: أول مرة: أول
 عقد وأول الحالي.Activeمربوط، والشهر عليه،
. العقد صفحة 03.3من لينكUI ← وحالاتها) Availability" & تابRates من أو Inventory & Rates الشبكة ← على 2مفلترة
 ده فوقالعقد الرجوع وزرار Block"، Annual العقد.Makkah لصفحة بيرجّع
. 3."Open rates" ← ) OV 03.0C…) ← العقود قايمة 03.0من الصفUI قايمة
. 4"Release الداشبورد 09.*من كارتUI you"): زيNeeds published" not changes أو3 Sep" 25 on out أوSold
.Highlight ← today" عليهاpasses والخلية المقصودة، والليلة والشهر العقد على الشبكة
 .5"Open sold"من be cannot rooms these "Why ( 10.5 الإصلاحUI زرار ← rates") أوOpen sale" stop أوLift
 أوinventory" cut-off" & release والـOpen والليالي، العقد على الشبكة ← مفتوح.Popup المناسب
 .6"1 room back · إيميل أو إشعار linkمن :)deep failed" وPublish you"، for changes prepared وHoteliana still،
.Your Win list is وstopped" ready"،
 .7. OV 04.WA listمن Win ( 04.W UI ) ← rates" to بعدBack أو draft"، فيCreate
. 8. UI 04.W  ← "Win list · الصفحة هيدر 6"من
. طلب Requestمن فيOn إلغاء أو 06 / 05 لينكFlow ← Availability" & Rates in night this See 9.(مقترح
. بالـ مباشر URLلينك 10:(مقترح
ct={id}&from=2026-09&to=2026-09&prices=everyone&rows=rates,inventory&night=2026-09-24&room={id}
 الـ في بيتحفظوا والعرض الفلاتر الـURLكل عشان والمشاركةRefresh
2 قواعد. البيزنس
2.1 الشبكة والعرض
: :BR-04-01 بتعرض الشبكة واحد الغرفعقد = والصفوف المختارة، الشهور ليالي = الأعمدة المرة. في إطلالة،Base + غرفة نوع
). إطلالةFixed + وجبة + غرفة عقدينline": بتجمع شبكة مفيش
"Rate · Room only · :BR-04-02 الأسعار كل 15%شاملة وبالريالVAT وكلSAR جنبهLabel)، مكتوب سعر VAT" incl. (مثلاً·
 VAT" اختيارincl. مفيش included"). ضريبةnot تفصيل ولا
). مكة:BR-04-03 بتوقيت والساعات التواريخ كل اليوزرUTC+3 جهاز بتوقيت مش مكة بتوقيت بيتحسب "النهارده"
). :BR-04-04 بيبدأ الأسبوع الأحد بتاعة إند الويك أيام = إند الويك (الافتراضيالعقد. Fri النهاردهThu, وعمود متظلل، إند الويك عمود
."today"عليه

---

**p. 161**

غرفة:BR-04-05 لكل المتاحة الصفوف وRate Inventory، cap( under Left / N of Left / وSold RQ)، / sale ،Stop
nightsو (منMin وRestrictions days)، · Release . ROWS" SHOW فيهم. بيتحكم يفضل الأقل على واحد صف لازم
.Keep at least one row" Tooltip (مقترح) وآخرظاهر ومعاهToggle، بيتقفل شغال
. :BR-04-06 time" next for kept · ROOMS :"SHOW N All الاختيار غرف. اختيار أو يوزر لكل غرفةبيتحفظ لازم
الأقل على واحدة
Ramadan · 18 Feb - صف:BR-04-07 فيه الغرف فوق وتحتهSeason العقد، في اختارها المورد اللي المواسم (ألوان زيLegend
/ UI 03.12 ( Flow 03). 740" / 640 · Mar و9 500" / 400 · rate فيContract الموسم صفحة ← الموسم شريط على الضغط
.( 03.12B
"B&B · for 2 guests · room + :BR-04-08 HB(" )B&B, غرفةmeals كل تحت للوجباتBase محسوبة صفوف بتفتح بس)
Fixed. contract" the from · 2 × الغرفة45 سعر = الحساب الفردsupplement. ضيوف2  دي الصفوف بس). فيللقراية
 كلmealsمفيش لأن وجبتهاline، فيها
 :BR-04-09 rows بيانات.Compact مابيشيلش بس. الصف ارتفاع بيصغّر
"GOOD TO KNOW · past nights are hidden - :BR-04-10 nights past Hide من تبدأ الشبكة سطرالنهارده: ويظهر the،
 + today" starts ومعاهاgrid فاضية الشبكة ← فاتت كلها المختارة الشهور لو passed.". have picked you nights the زرارAll
nights" past Show .(مقترح
 :BR-04-11 days 7 last · صفPickup لـSold: بيتحول week" past the in sold آخرrooms في اتباعت اللي الغرف (عدد أيام7
. inventory.view من مكة بتوقيت ليلة، من00:00لكل بيحتاج7 دلوقتي). لحد أيام
 بتتعرض:BR-04-12 فاتت اللي الليالي only مفيشRead (رمادي). الليPopup فيه بس قراية عرض بيفتح عليها الضغط عليها. تعديل
كان اللي والسعر Liveاتباع .(مقترح
عليها:BR-04-13 ومكتوب رمادي النهاية) بعد أو البداية (قبل العقد مدة برا اللي الليالي term" contract the ومفيشOutside ،
تعديل أي عليها
 :BR-04-14 CONTRACT" THE والـFROM المخزون، ونموذج إند، والويك والأساس، التسعير نوع العقد: من بيتقرا ملخص شريط
وRelease والمواسم، والقيود، والإلغاء، ↗"، contract Open هنا. من بتتعدل فيه قيمة أي مفيش
.)A4 :BR-04-15 KNOW" TO فيGOOD (النصوص العقد نوع حسب ثابتة جمل الشبكة تحت وA3
)Rule 2B REF 04.R ( 2.2 نوع العقد بيحدد الشبكة
:BR-04-16 بيتختار المخزون نموذج العقد في واحدة 6مرة والـ)Section الشبكة والـPopups. Bulk المورد بس. بيقروه مابيختارش
الشبكة من النموذج
pool Shared · صف:BR-04-17 it" from sells room every · overbooking +2 · night a rooms 50 · pool ،Contract
breakdown"وتحته the for night a tap · pool in غرفةLeft كل تحت cap". no · pool the from · ليهاSold الغرفة ولو ،
).BR-04-91( :Cap night" a 12 of · cap under Left في الملتزَم المحجوز = الأرضية الغرف. كل
. type room Per · صف:BR-04-18 مفيش غرفةPool كل تحت type". room this for held rooms · 20 of الغرفLeft
بعض من مابتستلفش على الملتزَم = الأرضية بس. دي .الغرفة
sale Free · مفيش:BR-04-19 ولاPool ولاLeft الصفوفRelease used". not · وInventory used" not · وRelease ،
. حدSold غير من بس sale الوحيدةStop الأداة هو  طول على بيتأكد الحجز
 contract Request On · :BR-04-20 used" not · وInventory used" not · وصفRelease RQ، / sale فيهStop مكتوب
 Request" On is night الـevery في الفندق رد مستني حجز كل (مثلاًSLA. 2 وhours شغالة، والقيود الأسعار sale). بيقفلStop
خالص الليلة
price Fixed · كل:BR-04-21 line بسعر واحدة إطلالة + واحدة وجبة + واحدة غرفة = كامل VAT"( incl. · price full · )،Rate
"ﬁxed price · weekday 490 · :line supplementsومفيش أيlineتغيير. مابيحرّكش تانيةline الـ كلLegend. تحت

---

**p. 162**

.weekend 590"
"base +. supplements + Base · عليها:BR-04-22 الأساس الغرفة 500" weekend · 400 weekday · تانيةBASE غرفة كل
"base + 620" weekend · 520 weekday · المواسم120 شهور في dates". its on season the follows price · وBASE
.120 · price follows the season on its dates"
:BR-04-23 out sold + العقدAllotment من النفاد سلوك ← sale يتحولStop أو Request، أوOn Overbooking، الـ لحد
.Overbooking الـlimit + المخزون = الأقصى (الحد ومستحيلlimit .)unlimited، sale Free ماهوش
) REF 03.R ( 2.3 الحسبة والأولوية
 السعر:BR-04-24 حساب ترتيب price room Base ← supplement room ← price الكاملةseason أسعاره ليه (الموسم
 child extra ← supplement للفردmeal أو (للغرفة، override الـnight override. منNight بيتعمل اللي
 هو ده وبيكسبالفلو خطوة .آخر
Sep: Standard City 24 الـ:BR-04-25 override Night الأساس الغرفة على التانية الغرف فيمابيحرّكش prices (ليلةChange
"Other لـView اتغيرت و520 View، Haram فضلتStandard في620 rates). Bulk الأساس مع بتمشي التانية الغرف لو، بس
.)BR-04-64 base" the follow متعلّمrooms
 في:BR-04-26 كده بعد اتعدّل الموسم لو 03 عليهاFlow اللي الليالي override، الموسمNight محرر بيكسب). (الأدق بسعرها بتفضل
يقول price"لازم own their have season this in nights 3 .(مقترح
بيع:BR-04-27 مفيش = سعر مفيش NO_RATE ده خطأ). مش والسيستم افتراضي، سعر يخترع .ماينفعش
Draft 2.4 التعديل والـ
 بيتحفظ:BR-04-28 الشبكة من تعديل أي العقدDraft مستوى على الـ Draft. ده الحساب يوزرز لكل ومشترك دهواحد العقد على
."N changes not published · Review & publish". بيقول(مقترح) الهيدر
 واحدة:BR-04-29 حالة في تتدمج ماينفعش للحفظ حالات أربع 11.R REF :)  وunsaved_local وsaved_draft
.Refresh وpublish_failed published فشل اللي الحفظ بعدمابيمسحش. موجود بيفضل والشغل المحلي، الشغل
 الـ:BR-04-30 كلDraft عند السيرفر على بيتكتب فيSave الـPopup اتقفلPopups. لو تلقائي. حفظ مفيهاش كتابةPopup فيه
.) OV 03.11 changes?" (نفسDiscard
عليها:BR-04-31 اللي الخلية علامةDraft عليها publish" you until live not - it changed You القيمة. بيشوف الوكيل
بس المنشورة
Saved as a draft - Standard Room · City View · Thu 24 Sep: 520, أي:BR-04-32 بعد يظهرSave الشبكةToast فوق
 publish." you until live is Nothing person. per 100 + Board Half + ."Undo" آخرUndo على بيشتغل ولمدةSave بس،
 (مقترح)10 ثواني الـ قبل كانت اللي القيم وبيرجّع المنشورةSave، القيم (مش ده
:BR-04-33 التغييرات: عدّ في واحد سطر = واحد واحدReviewتغيير نوع يعني أوRate، أوSupplement، status، أوSale ،
 أوRelease nights، أوMin )Rooms، واحدةline× فيSave واحد prices سعرChange فيه
الليلةsupplement لنفس 1 (زيchange 04.1W UI : 3 ← 4 بيعرضBulk(الـ). المفتوحةroom-nights الأسئلة شوف Q-،
(.04-05
.Terminated ماينفعش:BR-04-34 عقدDraft أو المدة، برا ليلة أو فاتت، ليلة على أوEnded
.)E10. الـ:BR-04-35 Draft انتهاء تاريخ دهمالوش ويتقال النشر عند بيتشال ده البند النشر، قبل عدّت فيه ليلة لو
) 04.3PD  2.5 منتقي الليالي picker( Date ·  04.6P1/P2 OV و،  04.1PD و  04.1PDF و  04.2PD و
"Click another :BR-04-36 واحد فترةمكوّن أو واحدة ليلة بيختار البوابة. لكل وClick يوم، أول تحتClick السطر فترة). يعمل تاني
day to make it a range. Days before today are closed."

---

**p. 163**

:BR-04-37 فاتت اللي الأيام مقفولة العقد مدة برا والأيام متعلّممقفولة، إند الويك Fr". Th, contract: your in )،Weekend
أو (منشور خاص سعر ليها اللي بنقطةDraftوالليالي متعلّمة changed") متعلّمAlready والنهارده .)"Today")،
Whole season" ."Whole season" اختصارات:BR-04-38 weekend" وThis nights" 7 وNext nights" 30 وNext
.  كده وغير موسم، جوه المعروض) الشهر (أو المختارة الأولى الليلة لو (مقترح)بيشتغل العقدبيختفي نهاية عند بتتقص الاختصارات كل
5 weekdays · 2 weekend nights )Thu 24, Fri 25( · 3 + "Sun 20 - Sat 26 Sep · 7 nights" تحت:BR-04-39 الملخص
."Use 20 - 26 Sep" changed" الزرارalready Sep". 24 أوUse
 في:BR-04-40 Rates (قاعدةمسموح المواسم. برا ليالي + موسم أو موسمين، تعدّي الفترة locked" are seasons بتاعةother
DECISIONS تواريخ منتقي تخص الموسم محرر  في03.14P 03 الشبكةFlow مش ،
 :BR-04-41 العقد. مدة باقي = فترة أقصى أقصى(مقترح) واحد366: اختيار في ليلة
)"Change one night" 2.6 prices (Change قرار 27 Sep بديل،
 لغرفة:BR-04-42 بيتفتح (مثلاًline الغرفة اسم العنوان: واحدة. ROOM" BASE · VIEW CITY · ROOM أوSTANDARD
"Room-only price = VIEW" CITY · BREAKFAST & BED · ROOM وSTANDARD prices")، والوصفChange Base،
"Full price for this room and meal plan. Fixed- = is." it as stays contract The pick. you nights the وfor Fixed،
price contract - no supplements."
"Season BR-04-43 واحد· حقل SAR" · night this for "Price + 500" (أوContract 740" أوRamadan
"Weekday 790" التاريخ.Weekday/Weekendمفيش). تحت السطر contract(" your in Fri )Thu, night أوWeekend
.night"
"Price per night BR-04-44 كلهاWeekdays· أو واحد:Weekend حقل SAR" · weekdays · night per أوPrice
."Both are weekend nights" SAR" · weekend السطر· weekdays". are 3 أوAll
:)Radio BR-04-45 إجباري· اختيار
"Price per night · all) ← night" every for price (تحتهاOne same" the pay weekend and واحدWeekdays حقل
."Contract 400 weekdays · 500 weekend" + 7 nights · SAR"
"Weekdays · 5 nights ·) ← apart" weekend and (تحتهاWeekdays contract" your in as prices, حقلينTwo
."Weekend · 2 nights · SAR" وSAR"
apart"الافتراضي weekend and (مقترح)Weekdays بالغلط إند الويك فرق هيمسح ومش العقد زي لأنه ،
All 7 days 7 · BR-04-46 أكتر: أو ليالي يظهر days" these to بـApply منChips لـSu الأولSa في متعلّمين كلهم are،
. are." they as nights those leave to day a Untick ticked. دي الليالي يوم، شال لو النوعمابتتغيرش). أيام، يشيل ما بعد
"Price per Friday ←  على تاني بسبيتحسب المتعلّمة كلهاالأيام لو (زيWeekend: only كلهاFridays أو واحدWeekday) حقل
Only Fridays change: 2, 9, 16, 23 and 30 Oct )5. SAR" · nights 5 بين· والاختيار one/apart) بيقوليختفي السطر
nights). The other 26 nights stay as they are."
).Select cells. من:BR-04-47 أقل 7 ليالي: يستعملChipsمفيش أو ليلة ليلة يختار قصيرة، فترة في معينة أيام يختار (عشان
. لازم:BR-04-48 الـChip كل لو الأقل. على واحد ومعاهChips بيتقفل الزرار ← اتشالت day." one least at Tick الأيام(مقترح) ولو
."No night in this range can be changed"  فترة (مثلاً الفترة في أصلاً موجودة مش فاتت7المتعلّمة ليالي وكلها ليالي
 BR-04-49 كـPopup· بتظهر الحقول):Notes، فوق
"These nights are in 2 seasons · Ramadan 7 - 9 Mar )3 nights( and Last ten nights 10 - :) 04.6G ( موسمين
13 Mar (4 nights). The new prices replace both. Each night keeps the nationality rules of its own season."
."Ramadan 640 )7-9 Mar( · Last ten nights 1,000 )10, 13 Mar(" موسمhintوالـ كل سعر بيعرض الحقل تحت

---

**p. 164**

"3 nights already have their own price · Tue 22 )430(, Wed 23 )430( :) 04.6H ( كده قبل خاص سعر ليها ليالي
and Thu 24 (520). Saving replaces them with this price. Untick those days to keep them."
"2 nights are closed · Mon 21 and Fri 25 are closed. The price is :) 04.6H ( )Stop للبيع مقفولة saleليالي
them." open you until closed stay they and them on saved يعني والقفل المقفولة، الليالي على بيتحفظ السعر
مابيتشالش
Bookings already made keep their price · 12 rooms are booked on these nights. :) 04.6H ( موجودة حجوزات
Their price was locked when they were booked."
"These nights are not in a season, so every nationality pays the price above. Nationality الموسم برا :ليالي
prices are set inside a season."
"Edit for this night + "This room’s supplements · from the contract"  BR-04-50 لينكاتPopup· + (للقراية
nights" these for وEdit sold"، 48 · 50 of left 2 · "Pool + وBreakdown" sale"، Open · "Status + وChange" "Min،
 open" check-in · 4 · nights + rule" وOpen 18:00"، · before day 1 · "Release + change" فيهUndo (لو الـDraft على
الفتراتRelease في 29("). · 28 · )27 50 of left 20 · 14 · لحد16 كده3 وبعد ليالي، Oct(" 2 )Fri 50 of left 12 ،Lowest
."Open on 5 · closed on 2 )Mon 21, Fri 25(" 3"والحالة all on sale أوOpen
Below your BR-04-51 price· selling ):Minimum ← منه أقل السعر لو مسموح والحفظ :تحذير،
: 380." see will agents - save still can You )420(. price selling بيتلوّنminimum الحقل Warning التحذير(مقترح).
"GCC nationals would pay 340 - below your الجنسية مجموعات أسعار على كمان minimumبيتحسب
selling price (420)."
"Save N BR-04-52 · حفظ ومفيش :خطأ، 0" above price a بيتلوّنEnter الحقل وDanger. nights"،
بيتقفل
Prices are :BR-04-53 السعر صحيح ريال SAR( الـWhole في ريال لأقرب بيتقرّب ← كسور كتب لو blur). ويظهر(مقترح) whole،
قيمةSAR." أقصى 100,000 .(مقترح
."Save 5 nights" :BR-04-54 الـ بعد فعلاً هتتغير اللي الليالي عدد بيقول الحفظ زرار :Chips night" 1 وSave nights" 3 وSave
price Fixed · BR-04-55 ( واحد04.6K/L/L2/M حقل = (ليلة بالظبط المنطق نفس SAR"): · night this for price ،Full
 priceومختلط أوOne apart بس قسممفيش)، ولاsupplements night this for الـEdit :hint. 590" أوContract
.Contract 490 weekdays · 590 weekend"
. BR-04-56 prices· Change ( ):04.6N/O/G بتظهر بس مجموعات ليه موسم جوه ليالي فيه القسملو
"Open + "Nationality prices for these nights · From the Ramadan season · everyone else pays the price above"
.the season"
/ 620 قراية±مجموعة وبتتعرض الجديد السعر من بتتحسب 740": · price your on SAR 40 − · nationals (أوGCC
).weekday/weekend apart" يبقى740 لما
"Pakistan · Fixed price in the season - keep it or type) لوFixedمجموعة حقلين (أو حقل ليها الحاليةapart: بقيمتها
. 790" Season · 790 · one new هي.a ما زي بتفضل ماتغيرتش، لو
المجموعات نفس فيهم موسمين في الفترة groups"لو same the have nights ten Last and والـRamadan :Fixed،
both" replaces price one - season each in Fixed بموسم. بيتقسم القسم ← الموسمين بين مختلفة المجموعات لو
.(مقترح
 Supplements · لليلةBR-04-57 04.5E/ES/EW OV :) night" this for الـEdit نفس جوه فرعية شاشة بيفتح (مشPopup
Child 6 - 11 sharing · no تانيPopup supplement وRoom وB&B، Board، وHalf (للفرد)، sharing 5 - 0 وChild extra،
وbed bed، extra · 11 - 6 العقدChild قيمة = الفاضي الحقل value.". contract the keep to is it as ﬁeld a وقيمةLeave ،

---

**p. 165**

"+ Different weekend + "Supplement · same price on all 3 nights"). رمادي مكتوبة 45"العقد + الفترةcontract في
 لعمودينprice" (بيحوّل Sat" · وWeekdays Fri" Thu, · والرجوعWeekend nights"، all on price الأزرارSame وBack").
"+ 55 per person · this night )contract. nights" these for Use / night this for متغيرUse بيبان السطر الرجوع، بعد
"Room supplement · Base 45(" مع. بيحصل الفعلي nights"الحفظ N الـSave بتاع الأساسي.Popup الأساس الغرفة
 none" · بيتعدلroom ومش
2.7 التعديل الجماعي )Bulk( قواعد· مشتركة
. :BR-04-58 rates وBulk Request On / sale وStop Release بيستعملوا ونفس المنتقي الأيامChipsنفس بـ بتتضاف الفترة
."Delete" + )Edit بـAdd" قايمة في وبتظهر عدا🔒 ما جديد، من والإضافة بالمسح والتغيير للتعديل، (مقفولة فيهRelease
"28 Sep - 5 Oct overlaps 24 - 30 :Bulk rates :BR-04-59 الـ نفس جوه المضافة فيPopupالفترات تتداخل ماينفعش
Stop. ﬁrst." range added the delete or dates, other Pick added. already is which Sep, + dates" other فيPick
.)BR-04-84 وsale بيكسبRelease والأحدث مسموح كده قبل متسجل اللي مع التداخل  وBR-04-71(
"This changes 1,240 room-nights on Makkah ← (مقترحBR-04-60  Bulk من أكتر على بيأثر 500 room-night تأكيد
."Save 1,240 changes" Continue?" Block. Annual + back" وGo
"Retry + الـ:BR-04-61 نتيجة Bulk عنصر لكل ( 11.R فشلREF جزء لو failed"): 2 · saved مجموعة61 لكل السبب
.)idempotency key الـfailed" بنفس بس، فشل اللي (بيعيد
) 04.1AF/BF/OF/VF/IF Fixed 2.8 rates Bulk ( 04.1A/B/K/O/V/I OV و،
Price · incl. VAT ← )Pick nights + Add( Dates ← Fixed الأقسام:BR-04-62 Rooms rooms( أوAll اختيار) أو فيLines
.)Weekend · Thu, Fri | Weekdays · Sat - Wed | Room(جدول
Whole SAR · ﬁlls all 9: صف:BR-04-63 below" row every ﬁlls · rooms selected الصفوفAll كل بيملى فيه رقم
: Enter" press · .)rooms Toggle all" for price الغرفSame لكل واحد عمود
: BR-04-64 :)Base( contract(" the from supplement their )+ base the follow rooms متعلّمOther يكون لما
 وتعرضهالافتراضي( الباقي بتحسب الأساس سعر كتابة 670")، / 570 · base the follows · 120 + لماbase قراية. بتبقى وصفوفهم
 فاضية سابها اللي والغرفة اتكتب، اللي سعرها بتاخد غرفة كل .مابتتغيرشيتشال،
 الملخص:BR-04-65 publish." you until draft a as Held room-nights. 63 = Sep( 30 - )24 nights 7 × rooms والزرار9
."Save 56 changes" changes" 63 فيSave :Fixed. line-nights." 56 = Sep( 30 - )24 nights 7 × lines و8
"Nationality prices in a season follow these new prices by their own rules )for الجنسيات:BR-04-66 أسعار
example GCC − 40). Fixed nationality prices stay as they are - change them in the season. Nights outside a
.Change prices." nationality no have يعنيseason الـBulk المجموعات مابيلمسش بعكسFixed prices،
"2 things to ﬁx before you can hold saving before Fix · على:BR-04-67 الضغط نواقصSave وفيه فوقBanner
"Add at least one date + room." one least at for price a type and dates, the pick changes: قسمthese كل تحت
"Type a price for at least one room - or one price in ”All selected Add." press then To, and From pick - وrange
.rooms”"
) OV 04.4/4F Night status 2.9 Request On / sale Stop ( 04.2/2B/2D/2O/2I/2PD OV و،
← Dates ← )Delete الأقسام:BR-04-68 set" عليهاAlready اللي (الفترات sale أوStop Request واحدةOn ولكل دلوقتي،
← "On Request - the hotel conﬁrms each Rooms ← to" nights these :"Set sale أوStop sale، أوOpen booking"،
."Apply to every contract on this hotel"

---

**p. 166**

:BR-04-69 sale :Stop kept." are rooms and Price bookings. new No يعني بتتمسح حاجة الموجودةمفيش والحجوزات ،
مابتتلغيش
Bookings wait for the hotel to conﬁrm - within the contract :Allotment :BR-04-70 Request عقدOn في ليلة على
.)committed( طابورSLA." في مستني الحجز 03.23 / 05 Flow مستني اللي والطلب غرفه، بيحجز
"Quad Room · City View BR-04-71 · sale فترةStop فوق Request On ← sale بيكسبStop بتتقفل دي والليالي
is On Request on 26 - 27 Sep. Adding this turns those nights into Stop sale as well, so 25 - 28 Sep is closed."
 منعده مش .تحذير
 hotel this on contract every to Apply · :BR-04-72 في والغرف الليالي نفس على الحالة نفس بيطبّق عقد أوActiveكل
"Makkah Annual Block · Ramadan Block · Makkah Rooms Block will all close دهScheduled الفندق على ده للمورد
 picked." you rooms 2 the for nights بياخدthese عقد كل Draft نشر ومحتاج لوحده publish(مقترح & بيعرضهمReview
.  ويسأل contracts"مجمّعين 3 all on ده)Publish ويقول دي الغرفة بيتجاهل موجودة مش الغرفة فيه اللي العقد
Removed - Deluxe Room · City View is open :Open sale من:BR-04-73 فترة مسح set" "Already ← لـDraft للرجوع
 publish." you until draft a as Held Sep. 19 - 18 on again + Undo" في. فاتت اللي set"الفترات منAlready بتتعرض
(مقترح)Deleteغير بس الجاي الجزء منها بيتمسح فات نصها اللي والفترة ،
What happens to new bookings for this room on status Night · BR-04-74 ( 04.4 واحدة):OV لليلة
"No new bookings. Price and( Stop night." اختياراتthis ثلاث sale Open normal"( as pool the from وSells sale)،
"More .)"Bookings wait for the hotel to conﬁrm - within the contract SLA."( On kept." are وrooms Request)،
Fixed. toolbar" the in Request On / sale Stop Use rooms? or الأزرارnights وCancel". "Apply" ← فيDraft
."for this line" :( 04.4F )
On عقد:BR-04-75 في Request اختيارOn Request، On اللياليبيختفي (كل Request On والاختيارين أصلاً)، sale (يعنيOpen
وRequest العادي) sale Stop .(مقترح
"Sells from the pool as normal" عقد:BR-04-76 في sale sale،Free تحتهOpen مكتوب limit" a without بدلSells
.(مقترح
Set an answer time )SLA( in ← (مقترحBR-04-77  Request عقدOn على مالوشAllotment ومعاهSLA مقفول الاختيار
. ﬁrst" contract the + ↗" contract هتاخدOpen الليلة كده غير لأن CONFIRMATION_MODE_INVALID،
 عنده:BR-04-78 يوزر ومعندوشinventory.stop_sell rates.publish يعملReservations( يقدر ← البيعDraft) لحالة
 (مقترح) يقدر بسBatchينشر: بيع حالة تغييرات فيه  Request( On / Open / الـStop لو بيقولDraft). النشر زرار كمان، أسعار فيه
.)Q-04-01. changes" sale 2 عندهPublish حد مستنية الأسعار وبيسيب (شوفrates.publish
( OV 04.3/3B/3D/3E/3S/3O/3K/3I/3PD ) Release 2.10
"How many days before arrival unsold rooms go back to the hotel. The contract sets the الوصف:BR-04-79
default; change it here for some nights or rooms."
"Every night · All rooms · 3 days before · 18:00 · From the: :BR-04-80 set" Already العقد قيمة دايمًا سطر أول
"24 - 30 Sep 2026 · 1 day before · 18:00 · contract" + ↗" contract in التغييراتEdit بعده هنا). من بيتمسح (مش
."Delete" Abdullrahman" · Sep 14 Changed + وEdit"
"e.g. الحقول:BR-04-81 وDates وRooms، day"، أوSame days" of "Number arrival( before placeholder،Days
.)18:00 و2" الافتراضيAt")، (الساعة،
:BR-04-82 يوم30أقصى : arrival." before days 30 than more be can’t زرارRelease + 30" Use رقم. واليوم1أقل ،
."Same من بيتعمل day"نفسه

---

**p. 167**

"Same day: unsold rooms go back to the hotel at 14:00 on the arrival day. Agents can :BR-04-83 · Same day
 then." until book الافتراضيةstill الساعة وبتتغير14:00
"Overlaps your change on 24 - 30 Sep BR-04-84 · بيكسب منعالأحدث مش (تحذير بس المتداخلة الليالي على
(1 day before). The newest wins, so 24 Sep - 2 Oct will be 2 days before."
"Removed - Standard Room · City View goes back to the contract release (3 days before · :BR-04-85 · Delete
."Undo" + 18:00) on 24 - 30 Sep."
Edit · BR-04-86 ( 04.3E :) View" City · Room Standard · Sep 30 - 24 · مقفولةEdit التواريخ والساعة🔒: والأيام ،
بيتعدلوا
).Release · not used" :BR-04-87 Release موجود فيمش sale وFree Request والصفOn مابيترسمش، التولبار في (الزرار
"3 (مقترح):BR-04-88 الـ تعدّي قريبة ليالي بتخلي الجديدة القيمة لو (مثلاًRelease فورًا 7 بعدdays ليلة على تحذير3 ← أيام)
nights are already inside this release window. Once published, their unsold rooms go back to the hotel right
 مسموحaway." والحفظ
 الـ:BR-04-89 بعد بتاخدRelease والليلة للفندق، بترجع ماتباعتش اللي الغرف وسلوكRELEASE_PASSED، release" منAfter
.)On Request saleالعقد أوStop
2.11 المخزون والـ Committed ( 04.R REF 2 )1B،3،Rules
 pending Held + Conﬁrmed = Committed · طلب.BR-04-90 Request On رد مستني غرفه يتحلبيحجز ما لحد
released · 11 conﬁrmed 20. BR-04-91 الـ· تحت ينزل العقد) في (أو ليلة على الغرف عدد ماينفعش أمثلةCommitted
 ← held 0 الأرضية· ← و11 20. awaiting 3 · conﬁrmed 8 · الأرضيةreleased ← .11 sale أرضيةFree مفيش
 ← الـ:BR-04-92 انتهاء أو مستني طلب رفض فورًاSLA الطلب بعدد بتنزل الأرضية
BR-04-93 1B· ):Rule بيرجّعوا المنتهي الطلب أو المرفوض، الطلب أو الإلغاء، رقم
 بس لسهالمخزون العقد بيراجع: السيستم بعدها فيهActive. sale؟ الـStop الليلة؟ أو العقد على الـRelease أو الليلةCut-off عدّى؟
1 room back · still stopped"  صالح؟ سعر فيه المستقبل؟ في لألسه ولا بتتباع الليلة تقول لازم رجعت غرفة إن بتقول شاشة :أي
ومتكرر. عادي ناتج ده
The pool is full. The contract allows ← Overbooking :BR-04-94 الـOverbooking لما فيهPool: والعقد يخلص
"+2 · 0 selling." stops night the then bookings, more 2 to up - overbooking والـcontrolled بيعرضbreakdown
.used"
"Capped rooms · Deluxe City View · 12 of 12 ليها:BR-04-95 اللي الغرفة الـCap عند بتقف الـCap لو حتى غرفPool فيه
.sold"
2.12 محرك ("البيع ليه مش )"بتتباع
. كل:BR-04-96 ليهاroom-night blockers][ بتتباع. = فاضية :القايمة  0 === blockers.length = الشبكة،sellable
sold"و be cannot rooms these "Why ( 10.5 وUI night")، one on check full "The ( 10.4 والـOV والداشبورد، ،API)،
الـ Requestورد On كلهم القايمة، نفس بيقروا بنفسها.. السبب بتحسب شاشة مفيش
الـ:BR-04-97 بتعرضBadge الخلية علامة أو والـblockers]0[ Drawer، حسب متقسمين كلهم بيعرضهم يشيله يقدر :مين
أوYou أوHoteliana، .Structural،
) ← ثابت:BR-04-98 الترتيب 04.R والربطREF الوصول العقدROOM_NOT_MAPPED،ACCESS_NOT_APPROVED):
( CONTRACT_EXPIRED ) ← Hoteliana ( التجاريةHOTELIANA_PAUSED البيانات ← ،NO_RATE،NOT_ON_CONTRACT)
Q-04-09). الوقتSTOP_SALE،NO_INVENTORY ← الإقامةRELEASE_PASSED) قيود ← (شوفRESTRICTION_FAILED)
الـ مع الفرق ).baselineعن

---

**p. 168**

 الـ:BR-04-99 Blockers بتتحسب غرفةroom-nightلكل لكل مش أي ممنوعCache. الغرفة مستوى على
. :BR-04-100  وACCESS_NOT_APPROVED وHOTELIANA_PAUSED ROOM_NOT_MAPPED المورد إيد في بتقولمش الشاشة
."ﬁx your ومابتقولش هيحصل، اللي وإيه ماسكها setup"مين
No change sells until: الـ:BR-04-101 override مابيشيلشNight بسHOTELIANA_PAUSED مسموحين، والنشر التعديل
.the pause is lifted"
2.13 النشر والنسخ واللقطة ( 04.R REF 5 )7،6،Rules
 Batch · نشر:BR-04-102 كل برقمBatch واحد وPUB-YYYYMMDD-NNNN مكة، بتوقيت (التاريخ مستوىNNNN على يومي عدّاد
"Ahmed Saleh · 15 Sep 2026 · 11:04).  كلها مثلاً(مقترح)المنصة وإمتىPUB-20260920-0011، نشر مين معاه: بيتخزن
time" والنسخةMakkah والعقد v1.3")، version rate · وHTL-2026-0142 والوجبات، والغرف المتأثرة، والتواريخ القيمة)،
"1 period split into 3 لكل والجديدة room-nightالقديمة nights"( 2 → none stay minimum … 680 → والناتج620 ·)،
). created" period new نزاع.1 أي في بيه بيتردّ اللي ده
. BR-04-103 لكل· كلها الجديدة أو كلها القديمة النسخة بيشوف البحث النشرperiod ممكن
لـ periodsينجح والتقرير لغيرها، ويفشل .periodلكل
 -1 ← Sep · 480 / 620 · version 1 30 - 1. versioning Period · :BR-04-104 التقسيم الأصلية الفترة بيمسح ما مثالعمره
) 23 هيSep ما (زي 24 - 26 (جديدةSep 27 - 30 هيSep ما (زي 1 بتتقفلVersion بتتمسح،Closed ومش
  وهي اتأكدت اللي بيهاLiveوالحجوزات مربوطة بتفضل
snapshot Booking · :BR-04-105 والـ والغرفة والوجبة، ليلة، لكل المورد تكلفة بيتجمّد: التأكيد وقت وسياسةvariant والإشغال، ،
 والـ التأكيد، ونوع السارية، والـVATالإلغاء الإقامة، وقيود السعر، جوه ID والـContract version، والـRate ID، batch والـPublish ،
 والـRelease وCut-off الساريين، المجموعة) (اسم اتطبق اللي الجنسية سعر . أبدًا. حساب إعادة "أنهيمفيش بتسأل: الحجز قراية
 كانت Liveنسخة النهارده؟ إيه بيقول "الكالندر مش التأكيد؟"، وقت
اتنشر:BR-04-106 تغيير في الرجوع publish." and again night the change change, published a reverse To مفيش
.Batch لـRollback
"nothing is on sale until the :BR-04-107 contract بتبقىScheduled والقيم مسموح، النشر لوحدهاLive: البداية تاريخ من
start date, then everything published goes live on its own."
:BR-04-108 المورد أسعار تغييرات موافقة محتاجة نشرهHotelianaمش المورد سعر أي Live. ليه للسعرملزم تلقائي إيقاف ومفيش ،
.)Sep (قرار 24الغلط
Almost gone 2.14 الفلاتر والألوان، و،
:BR-04-109 الفلترChips وAll" N"، · out وSold N"، · fewer or حد4 = (الرقم gone وAlmost N")، · sale وStop "On،
Chip. N" · وrequest N"، · published وNot priced"، Not بس). سعر غير من غرف فيه لو (بيظهر (مقترح) المرة في واحد الـفلتر
. عليه ✕النشط
 :BR-04-110 عدد = العدّاد (أعمدة) الليالي مطابقة، الأقل على واحدة خلية فيها اللي جاي وأنت النهارده المعروضةمن الشهور وجوه
. للتصميم ومطابق 0(مقترح، · sale فيهStop إن رغم علىSS 17 - 18 فاتواSep اللي
WORTH DOING. :BR-04-111 النشط الفلتر صفوف مابيشيلش بيبهت والباقي عادية بتفضل المطابقة الخلايا كارت(مقترح).
 الفلترNOW" وقت بيختفي
"Showing only the 3 room types with no): :BR-04-112 priced" "Not ( بس04.1Uu سعر مفيهاش اللي الغرف بيعرض
. publish." you when live goes it - night any on rate a Set rate. + rooms" all العاديShow الوضع في دي والغرف
"6 of 9 room types priced · 3 left - they sit at the bottom of the grid. Nothing unpriced  الشبكةبتتحط ومعاهاآخر
.No rate yet · tap a night to set one". live." goes + →" unpriced only خلاياهاShow

---

**p. 169**

"4 rooms or fewer left · you choose( Almost gone key Colour · BR-04-113 ( 04.12 OV :) left وRooms (عادي)،
number" this + ›" number the وChange left)، rooms وNo publish"، you until live not - it changed وYou ،
"Guests can ask; you conﬁrm each( On through" struck shows night that price the - sale for وClosed Request،
وbooking" Weekend)، price"( weekend - Friday and Thursday العقد، إند ويك أيام من يتولّد لازم ده ووالنص .Today)،
"It applies to .rooms or fewer gone Almost · BR-04-114 ( 04.12T الاختيارات):OV 4،3،2 10،8،6،5)،default(
every hotel on your account. The yellow cells, the chip and its ﬁlter follow the new number right away -
changes." price no and published is nothing القيمة الحساب مستوى علىعلى بتتطبق pool". in فيLeft pool ،Shared
.On Request N"وعلى of فيLeft type room وعلىPer cap"، under Left في. معنى saleمالهاش وFree
"Prices for" 2.15 أسعار الجنسيات و
. :BR-04-115 الجنسيات أسعار بس المواسم السعرجوه نفس بتدفع الجنسيات كل الموسم برا
 إما:BR-04-116 المجموعة زي± الجديد، السعر مع (بتمشي GCC − أو40 60 + Malaysia & أوIndonesia علىFixed) (بتفضل
.) 03.12NX  Flow 03 زي تتغير، ما لحد Pakistanسعرها مجموعتين). في تبقى ماينفعش فيالدولة بيتفرض (ده
Guests from any other فلتر:BR-04-117 for" "Prices ( 04.1PN OV :) price" season · (افتراضي،Everyone
"Fixed price per room in قاعدتهاcountry" ومعاها مجموعة وكل countries")، 6 · price season the on SAR 40 the،−
"Nights outside a season show the same price for everyone."). وتحتseason"
"Only): جنسيات:BR-04-118 أسعار فيها المعروضة الشهور في ليلة ولا مفيش لو 04.1PN0 ومعاهاOV مقفولة بتظهر المجموعات
"No night in the months you show has nationality prices. They are nights" ten Last and Ramadan والسطرin set،
inside a season - open Ramadan to see them."
:Banner): مجموعة:BR-04-119 وضع في 04.1TGCC/TIM/TPK وUI الموسم، ليالي على المجموعة سعر بيعرض الأسعار صف
"Showing prices for GCC nationals: 40 SAR less than the season price in Ramadan and Last ten nights (1 - 19
Mar). From 20 Mar there is no season, so everyone pays the contract price."
) (مقترح):BR-04-120  المجموعة وضع بس بيفتحللعرض سعر خلية على الضغط prices. (سعرChange عادي وقسمEveryone
 عليها المختارة والمجموعة فيه والـHighlightالجنسيات الفلاتر والـExport. بيشتغلوا، ومكتوبExport المختارة المجموعة أسعار بيطلع
الملف. في اسمها
).Snapshot الـ:BR-04-121 (من اتطبق جنسية سعر أنهي بيعرض الحجز
"WORTH DOING NOW" 2.16 الاختيار Selection( و)
 cells Select · BR-04-122 ( خلايا):04.1VS تحديد أوRate بالسحب Shift+Click (مقترح) عائم شريط وليلة. غرفة من أكتر على
. Sep" 24 - 22 × rooms 3 · selected offer-nights "9 + rate" وSet ±" وAdjust stay" وMinimum اللياليClear"
التحديد من بتتشال والمقفولة الفاتت
 (مقترحBR-04-123  rate" "Set ← rates متعبيينBulk والتواريخ والغرف مفتوح ±" "Adjust ← مبلغPopup صغير:
 معاينة + %) offer-nights"(مش 9 on 600 → ."560 stay" "Minimum ← صغيرPopup nights الليلةMin مستوى على لـ1
).Rule 1 REF 04.R )30 + arrival" to وClosed departure" to Closed دي القيمة العقد. قيود ديبتكسب الليالي على
"The 24 - 25 Sep weekend is down to 2 and 0: :BR-04-124 NOW" DOING مثالWORTH اقتراح. بأهم واحد كارت
 closes." it before rooms more open or price weekend the raise - pool the in rooms + nights" those وSelect
. price" weekend Raise الـ(مقترح). في ليالي = القاعدة حد14: وصلت الجايين يوم gone يتعملAlmost لما بيختفي الكارت
بـ يتقفل أو فلتر✕الإجراء، يتطبق أو ،

---

**p. 170**

)Happy path( 3 الفلو. الأساسي
) السيناريو manager (عندهRevenue وrates.view وinventory.view وrates.edit_draft يرفعrates.publish عايز
 ليلة Sepسعر 24 علىThu View City · Room منStandard لـ500 الـ520 لأن ينشر.Pool وبعدين يخلص، قرب
. 1الدخول
 بار.يشوف: التوب
.Rates & Availability" يضغطيعمل:
Entry point السيستم: من يتأكد شوفrates.view الافتراضي، (أو اتفتحوا وشهور وعقد فندق آخر يحمّل الفندق. نطاق ومن
 تحميل1 أول (مشSkeleton). الشبكة بشكل النص).Spinner في
. UI 04.1  يروح
. 2.) UI الشبكة 04.1قراية
الهيدريشوف: Block" Annual وMakkah contract"، supply · HTL-2026-0142 · Hotel Makkah Noor ،Al
 Availability"و & وRates Badge، وActive" 6"، · list وWin publish"، & Review · published not changes (أو3
11:20" Sep, 14 · published changes المحدداتAll تحتهم وHotel). وContract، To، / وFrom for، وPrices ،
contracts ended شريطInclude بعدين CONTRACT". THE العرضFROM في والتحكم ROWS، وSHOW SHOW،
وROOMS والتولبارVIEW، rates)، وBulk Request، On / sale وStop وRelease، والـRestrictions، وChips)، Colour،
."GOOD TO وkey وكارتExport، NOW"، DOING وWORTH والشبكة، KNOW"،
.)No rooms left( Sep = 0 25) إنيعمل: يلاحظ 24 فيهSep pool" in "Left = (أصفر،2 gone وAlmost
الـالسيستم: من بتتلوّن خلية كل engine والـLeft( البيع، وحالة والـDraft، Blockers، من). غير الفرونت في ألوان حساب مفيش
السيرفر. من راجع اللي الحد
. 3.Change pricesفتح
 خليةيعمل: يضغط بتاعةRate View City · Room يومStandard Sep 24 زرارThu (أو price" weekend الكارت،Raise في
 الـ نفس بيفتح واللياليPopupوده 24 - 25 متحددة).Sep
.Terminated السيستم: من يتأكد مشrates.edit_draft العقد وإن المدة، برا ومش فاتت مش الليلة وإن أوEnded،
والـ الأسعار والـDraftيجيب الحالي والـPool والقيود والحالة Release الفتح .لحظة
يروح  04.6A OV :)Modal( contract(" your in Fri )Thu, night Weekend · night 1 · 2026 Sep 24 Thu · ،Nights
SAR"والحقل · night this for الحاليةPrice القيمة فيه وتحته500 500") والـContract الجنسيات، وسطر ،
Min nights · 4 وsupplements Breakdown"، · sold 48 · 50 of left 2 · وPool Change"، · sale Open · وStatus ·،
."Save 1 night" rule" Open · open وcheck-in 18:00"، · before day 1 · الأزرارRelease وCancel".
 .4الكتابة
.520 يكتبيعمل:
). السيستم Validation من أكبر صحيح رقم لحظي: بالـ0 ومقارنة price، selling تحذيرminimum ← أقل لو أوA15. فاضي لو
).E3 ← خطأ0
 .5 لليلةSupplement(اختياري
.Use for this night" ← Half Board = 100 ← يعمل night" this for "Edit ←  04.5E يكتبOV
للـالسيستم: يرجع بيقولPopup والسطر الأساسي، 90(" )contract night this · person per 100 + · Board Half لسه.
حفظ. مفيش

---

**p. 171**

 .6الحفظ
.Save 1 night" يعمل
). بيتحولالسيستم: الزرار يبعتLoading فيهBatch. key الخليةidempotency نسخة ورقم version يعملrecord السيرفر
ويكتبValidation تاني، السجلDraft في ويسجّل العقد، مستوى على وقتها،actor الدور الغرفة،rates.edit_draft، ،
.)source = 500الليلة، → 520 draft،draft 100 → 90 Manual،HB
.4 changes not published · Review & publish". يروح  04.1W الـUI علامةPopup: عليها الخلية يتقفل. الهيدرDraft
Saved as a draft - Standard Room · City View · Thu 24 Sep: 520, Half Board + 100 per person. :Toast
."Undo" + Nothing is live until you publish."
 .7المراجعة
 يضغطيعمل: publish" & الهيدر.Review في
 الـالسيستم: يجيب بالنوع.Draft متجمع للعقد، كله
Makkah Annual Block · Review & publish · Nothing reaches agents until you publish. : OV 04.7  يروح
Conﬁrmed bookings keep the price and rules they were booked with. To reverse a published change,
"Rate · Standard Room · City View · Thu 24 Sep · Room publish." and again night the مثلاًchange السطور
Undo" · 520 → 500 وonly Request"، On → sale Open · Sep 27 - 26 · View City · Room Quad · Request ،On
 18:00"و · before day 1 → days 3 · Sep 30 - 24 · View City · Room Standard · الأزرارRelease all". وDiscard
.Publish 3 changes" editing" وKeep
 .8النشر
.Publish N changes" يعمل
السيستم: من يتأكد يعملrates.publish ID. يعملBatch القديمSplit. يمسح ما غير من للفترات 6 النسخRule ويقفل )،
  الجديدة النسخة ويطبق لكلالقديمة، حسابperiodذرّيًا يعيد للـblockers][. لكلroom-nights سجل سطر يكتب المتأثرة.
.Batch) room-night new( → بالـold مربوط
 يروح  04.7L الزرارOV changes…": 3 والـPublishing مقفولة، التانية الأزرار وكل Popup، برامايتقفلش بالضغط
. 9اتنشر
.Popup الـالسيستم: يقفل
3 changes are live · PUB- يروح  04.1V الهيدرUI now": just · published changes وAll نجاحBanner،
20260920-0011 · agents see the new price on 24 Sep, On Request on 26 - 27 Sep and the 1-day release
.0 on." now الـfrom علامات وعدّادDraft بتختفي، published" بيبقىNot
.500 (+ علىبعدها: بيدوّر اللي الوكيل 24 بيشوفSep على520 فاضلة كده قبل المؤكدة الحجوزات الماركب).
)Alternative ﬂows( 4 الفلوهات. البديلة
: الشهورA1 أو العقد أو الفندق تغيير
.From / To على:Trigger الضغط أوHotel أوContract
الخطوات
. Hotel ←  04.10 OV hotel" Choose · hotels linked عقودهYour عدد ومعاه فندق كل contracts": 1"1،6
.Scheduled عقدcontract" أول ← الاختيار بعد فأولActive). مفيش ولو الفندق، على

---

**p. 172**

 .2"Active · Base +: Contract ←  04.9 OV contract" زيChoose والمخزون، والتسعير الحالة ومعاه عقد كل
"Active · … · 50" pool shared · Allotment · أوsupplements …"، · 2027 Feb 18 starts · أوScheduled On،
.Request · answer within 2 h"
 .3"HTL-2026-0091 · Al Noor Summer contracts" ended "Include ←  04.9B القايمةOV آخر المنتهية العقود بيضيف
.Block · Ended 19 Sep 2026 · read only"
 To / From ←  04.8 OV ends." and starts grid the where Pick · months Show الشهور بس العقد مدة .4جوه
."Done" ← "Tip: pick up to 3 months - the grid gets wide after term"( contract the وWithin that.")،
الـالنهاية: صغير. ومؤشر خفيفة شفافية الشبكة وعلى ظاهر يفضل الأعلى والجزء جديد، من تتحمّل الشبكة URL بيتحدّث. فيه Draftلو
 السيرفر على محفوظ بيفضل القديم، العقد على تأكيد. محتاج مش والتنقل
: العرض.A2 في التحكم
.) rows صفوف:Show يشيل 04.1N only" Inventory and عقدRates نوع ولكل 04.1Pr/Fr/Sr/Qr/Tr/Ur/Hr/Jr،
.)"2 rooms shown" rooms غرف:Show يختار 04.1R shown" 9 of و3 04.1Pk/Fk/Sk/Qk/Tk/Uk/Hk/Jk،
 + غرفة:meals تحت الوجبات يفتح و04.1M و04.1Pm/Sm/Qm/Tm/Um/Hm/Jm، meals")، hide بيقفلها−
.) 04.1VU ( Pickup · last 7 rows Compact ( و04.1VK nights)، past Hide ( و04.1VP days)،
عداالنهاية: (ما السيرفر من تحميل غير من فورًا بيتغير العرض بيتحفظPickup الاختيار أرقام). بيجيب اللي .)BR-04-06،
).UI 04.1P ( Per room type: عقدA3
."No restrictions on this contract" 8"الهيدر / 12 / 20 · type room per number a · وAllotment
 type"الصفوف room this for held rooms · 20 of والـLeft Release، contract" this on مفيش.none لو
This contract holds a set number of each room type - 20 Standard, 12 Deluxe City View, 8 :GOOD TO KNOW
"This contract has no restrictions )None was other." each from borrow not do Rooms Haram. Partial وDeluxe
chosen) - every night sells with a 1-night minimum and every day open."
."Rooms tonight · this room · floor = this room’s committed" ← Pool الـPopup
.) UI 04.1F ( Fixed price: عقدA4
:Linesالـ View" City · Only Room · Room وStandard View"، City · Breakfast & Bed · Room والـStandard …، ،
.Rate · full price · incl. Legend 500" weekend · 400 weekday · price والصفﬁxed VAT"،
"Fixed price: every line is one room with one meal and one view, priced in full. There are no :GOOD TO KNOW
supplements, so changing one line never moves another."
← prices Change ←  و04.6K/L/L2/M status، Night ←  و04.4F Pool، ←  fixed( · )Pool و04.6F Bulk،
. 04.1AF…
.)"1 change not published · Review & publish"( UI ليلة حفظ 04.1FWبعد
).UI 04.1S ( Free sale: عقدA5
."Release - not used )no rooms held(" away"الهيدر straight conﬁrm bookings - quantity no · sale وFree
.Release · not used" used"الصفوف not · وInventory
Free sale: no rooms are held, so there is no inventory and no release. Close a night with :GOOD TO KNOW
Stop sale when the hotel is full."
breakdownمفيش فلاترPool ولا fewer، or N / out زرارSold ولا .Release،

---

**p. 173**

.) UI 04.1Q ( On Request: عقدA6
."On Request · no rooms held · the hotel answers within 2 hours"الهيدر
.every night is On الحالة Request"صف
On Request: every booking waits for the hotel to conﬁrm within 2 hours. Prices and :GOOD TO KNOW
restrictions still apply; Stop sale closes a night completely."
.)On Request ولاReleaseمفيش فلترInventory، ولا request، (On الـمقترح اللياليChip: كل لأن بيختفي
).Summer مواسمA7 فيها شهور 04.1T: UI nights ten Last + وRamadan 04.1H، وHajj 04.1J،
"Last ten nights · 10 - 19 Mar والـSeasonصف الليالي، بيلوّن :Legend 740" / 640 · Mar 9 - Feb 18 · وRamadan ·،
.Contract rate · 400 / 1,100" / و1,000 500"،
."BASE · price follows the season on its dates"الصفوف
On season nights the room price comes from the season, not the base. Supplements for :GOOD TO KNOW
rooms and meals stay the same. Tap a season band to open it."
 في الموسم صفحة ← الشريط على 03الضغط Flow فيه. Draftلو الـ تأكيد، مفيش ← الشبكة في السيرفرDraft على محفوظ
).UI 04.1U  · Scheduled: مابدأشA8 لسه عقد
"This contract starts on 18 Feb 2027. Prepare prices, stop Badge 2027" Feb 18 starts · وScheduled :Banner،
sales and release now - nothing is on sale until the start date, then everything published goes live on its own."
."Outside the contract البداية قبل الليالي البداية. شهر من تبدأ المتاحة الشهور شغالين. والنشر التعديل term"كل
.UI 04.1Uu  ← "Show only unpriced →" + "6 of 9 room types priced · 3 left سعر غير من غرف فيه …"لو
).9 البداية مكة:00:00يوم بتبقى الحالة إشعارActive لوحدها. (شوفInfo
).UI 04.1E  · Ended: منتهيA9 عقد
"This contract ended on 19 Sep 2026. You can see what Badge 2026" Sep 19 وEnded only" وRead :Banner،
was sold and at what price, but nothing can be changed. Export still works."
مرسومة: مش التعديل أزرار التولباركل rates وBulk Request، On / sale وStop وRelease، وRestrictions، cells)، ،Select
publishو & وكارتReview NOW"، DOING وWORTH list، راسمWin لسه (التصميم rates". فيBulk 04.1E في، غلط ده
.)Q-04-11: شوفالتصميم
والـ اتباع، واللي (القيمة، بس قراية عرض ← خلية على Batchالضغط نشرها) اللي .(مقترح)
 بعد 19الليالي :Sep Sep" 19 on ended contract the · rate ورمادي.Contract
).Not published الفلاترA10 04.1Fa: out وSold 04.1Fb، 4 fewer وor 04.1Fc، request وOn 04.1Fd،
.Chip على:Trigger الضغط
 الـالخطوات: يبقىChip وعليهActive بتبهت✕ مطابقة مش اللي والخلايا علىBR-04-111، الضغط أو✕). العرضAll" بيرجّع
Clear ﬁlter" + "Nothing matches in the months you show."  العدّاد الـ:0لو سطرChip بيعرض عليه والضغط ظاهر، بيفضل
.(مقترح)
.Almost gone key Colour حدA11: وتغيير
."Save" ← )rooms or fewer 6 ← key" "Colour ←  04.12 OV ← ›" number the "Change ←  04.12T (مثلاًOV يختار

---

**p. 174**

)"6 or fewer"( Chip). السجل في وبيسجل الحساب، مستوى على بيحفظ 6السيستم → 4 والـalmost_gone_threshold الخلايا
 اليوزرز لكل فورًا بيتحدّثوا تحميل)وعدّاده أقرب (عند أسعار.. تغيير ولا نشر مفيش
 للـCancel" يرجع ← key تغيير.Colour غير من
.( OV 04.11 ) A12: Export
"Export this view · September 2026 · 9 rooms · Makkah Annual Block · Exactly what you see: the ← "Export"
months, the rooms and the rows you have switched on."
release"الاختيارات restrictions, sale, stop inventory, rate, · room per sheet One · ).xlsx( workbook وExcel "CSV،
PDF ).pdf( · The grid as it looks now, for sending system" own your for - room-night per row One · وcsv( or،
"Unpublished changes are marked in the ﬁle so you can tell them apart from what agents can. وتحتprinting"
see."
. HTL-2026-0142_rates_2026-09_2026-09.xlsx  Download" الملف اسم بيتنزل. الملف ← :(مقترح
 (مقترح) من أكتر لو 5,000 :room-night minutes." few a in you to ﬁle the email يخلصWe’ll لما وإشعار
 و النشط، for"الفلتر وPrices nights، past معندوشHide اللي اليوزر الملف. على بيتطبقوا مابيطلعلوشinventory.view
المخزون. صفوف
: CSV الأعمدة(مقترح)
 raft), sale_status, left, sold, cap, min_nights, cta, ctd, release_days, release_time, blockers
.) 04.6F )Pool · breakdown Pool A13: ( 04.6 وOV fixed(،
"Fri 25 Sep 2026 · Every room type sells from ← )Change prices خلية على pool"الضغط in (أوLeft فيBreakdown"
these 50 rooms."
"Capped rooms · Deluxe City View · poolالأرقام the in وRooms وLeft، used"، 0 · +2 · allowed وOverbooking 12،
The pool is full. The contract allows controlled overbooking - up to 2 sold" 12 الحالةof حسب والجملة more،
."Close" ← bookings, then the night stops selling."
"Change + مرسوم) مش سطر(مقترح، :Committed answer" your awaiting 3 · conﬁrmed 45 · 48 زرارCommitted
.inventory.edit) rooms" عندهA27( لو
.) status Night A14: ( 04.4 وOV 04.4F،
On خلية على RQ"الضغط / sale (أوStop جنبChange" فيStatus prices يختارChange ← sale) أوOpen sale أوStop
.Apply" ← Request
بيكتب Draftالسيستم sale"( Stop → sale خطOpen عليه السعر بتتعلم: والخلية sale")، for أوClosed .RQ)،
جوه من اتفتح pricesلو بعدChange للـApply": بيرجع Popup بيحصل وحفظها متحدّثة، والحالة كـ (مقترح)Draftفورًا لوحدها ،
.Save N nights"ومابتستناش
).OV 04.6I: prices Change الأدنىA15: الحد من أقل السعر
← "Below your minimum selling price )420(. You can still save - agents will see 380." ← 420 والحد380يكتب
 night" 1 شغالSave عادي.Draft
علامةReviewفي عليه ده السطر ومعاهWarning، minimum" Below مسموح(مقترح) والنشر ،
).04.6C prices Change فترةA16: بسWeekdays: أو04.6B بسWeekend)
."Price per night · weekdays · SAR" Sep"المنتقي 29 - 27 الـUse ← واحدPopup بحقل بيبان

---

**p. 175**

"1 :Poolالـ 29(" · 28 · )27 50 of left 20 · 14 · والحالة16 3"، all on sale وOpen nights، Min 3" all on و4 Release،
.Save 3 nights" ← day before · 18:00 on all 3"
.)apart prices Change مختلطةA17: فترة 04.6D: price وOne 04.6E،
."5 weekdays · 2 weekend nights )Thu 1, Fri 2(" :Sun 27 Sep - Sat 3 Oct ليالي7
.540 / 420 ← "Weekdays and weekend night"يختار every for price حقلOne ← أو450 apart"،
.Save 7 nights" إنها ليالي7بما ظاهرةChips الأيام
  (مقترح): كتب ما بعد الاختيارين بين بدّل رجع.لو لو ومابتضيعش لوحدها، وضع كل في بتتحفظ كتبها اللي الأرقام
).OV 04.6F · Change prices · Fridays: prices Change معينةA18: وأيام شهر
"Thu 1 - Sat 31 Oct 2026 · 31 nights · 22 weekdays · 9 Popup ← nights"المنتقي 30 منNext أو لـ1 31 الـOct
.Fr ← nights" عداweekend ما الأيام كل يشيل
 are."السطر they as stay nights 26 other The nights(. )5 Oct 30 and 23 16, 9, 2, change: Fridays والحقلOnly
.Save 5 nights" ← "Price per Friday · 5 nights · SAR"
.) OV 04.6G: prices Change موسمينA19:
."Ramadan 640 )7-9 Mar( · Last ten nights 1,000 )10, 13 Mar(" 7 - 13 2027 Mar ← seasons" 2 والـ· :hints،
:Noteالـ …" seasons 2 in are nights الجنسياتThese وقسم GCC. 860" / و1,060 I&M"، 960" / و1,160 Pakistan"،
.1,150 · Weekend · season 1,150" Fixed 1,050" / 690 season · Weekdays · و700
 nights :Min nights" ten Last in 5 · Ramadan in موسم3 كل من بتفضل (القيم
بتاخد:Save ليلة كل Override تابعة بتفضل ليلة وكل الجديد، بالسعر موسمها جنسيات .لقواعد
.) OV 04.6H: prices Change حجوزاتA20: عليها أو مقفولة، أو كده، قبل متغيرة ليالي
.)BR-04-49( Notes ← 20 - 26 التلاتSep
."Save 4 nights") ← المتغيرة: الليالي على يحافظ عايز الـلو من أيامهم يشيل Chips الزرارTh،We،Tu(
مقفولة. وبتفضل السعر بتاخد المقفولة الليالي
.Open on 5 · closed on 2 )Mon 21, Fri تحت 25("الحالة
).apart prices Change جنسياتA21: أسعار فيه موسم في 04.6N وOV ليلة، 04.6O ليالي7
2027ليلة Feb 25 Thu season"( Ramadan · night السعرWeekend 780)، hint( 740" وRamadan GCC)، و740" "،
).Season 790"( 790 I&M و840" حقلPakistan"،
.790 / 690 الـ7 ليالي: 620 / و740 720" / و840 حقلينPakistan"،
 ←  سعر غيرّ بيتحفظPakistanلو ← الـOverride المجموعة لسعر بسFixed دي الليالي على season" the الموسمOpen صفحة
 03( والـFlow Popup)، بتأكيد بيتقفل changes?" كتابة.Discard فيه لو
.) 04.5EW  ← OV 04.5ES Supplements مختلفA22: إند ويك بسعر لفترة
 ← nights" these for "Edit ← nights" 3 · Sep 26 - 24 · "Supplements ← price" weekend عمودينDifferent
."Save 3 nights" ← Popup ← nights" these for للـUse يرجع
 :A23 for" الجنسياتPrices (أسعار

---

**p. 176**

"Indonesia &). for" "Prices ←  04.1PN يختارOV ← nationals" "GCC ←  04.1TGCC والـUI Banner أوBR-04-119(
"the ﬁxed prices you set in Ramadan and Last ten nights )1 -( 04.1TPK  ← Malaysia" ←  أو04.1TIM "Pakistan"،
.(19 Mar)"
."Everyone · season price"الرجوع
).BR-04-118( OV المعروضة الشهور في مجموعات فيها مواسم مفيش 04.1PN0لو
الـ في بيتحفظ ده (مقترح)URLالاختيار كتفضيل ومابيتحفظش  دايمًا والافتراضي .Everyone،
(.Base) A24: Bulk rates
 .1"Makkah Annual Block · Base + supplements · Bulk rates · Set or adjust the room : OV 04.1A  ← "Bulk rates"
price for many nights at once. Meals keep their per-person supplement from the contract."
 .2 :Rooms rooms" يختارAll أو
 .3" 🔒  24 - ← :Dates nights" "Pick ←  04.1PD OV ← Sep" 30 - 24 الحقلUse في تبان الفترة ← القايمةAdd" في تتضاف
. Delete" · 25( Fri 24, )Thu weekend 2 + Wed( - )Sat weekdays 5 · nights 7 · 2026 Sep تانية30 فترات يضيف يقدر
متداخلة مش
. 4"follows the base") ← فيPrice يكتب 550: / 450 room فيBASE (أو rooms" selected "All + بتتحسبEnter التانية الغرف
.)"Whole SAR · ﬁlls all 9 rooms · press Enter" ( الكتابة04.1K بيبين
 .5"Save 63 ← "9 rooms × 7 nights )24 - 30 Sep( = 63 room-nights. Held as a draft until you publish."الملخص
(.04.1B ) changes"
 .6"63 changes saved as a draft. Nothing is بيكتب عنصرDraftالسيستم لكل بالنتيجة ويعرضBR-04-61 ويقفل، :Toast)،
publish." you until live + Undo" .(مقترح)
.( 04.1AF/BF/OF/VF/IF  · Fixed) A25: Bulk rates
"Al Noor Fixed · HTL-2026-0155 · ﬁxed price · Set the full price for many nights at once. :Lines بالـA24نفس
ﬁxed price · supplements." no are there - view one and meal one with room one is line والـEach بتتعرضLines
."Save 56 changes" ← ."follows the 590" weekend · 490 weekday base"مفيش.
 Request On / sale Stop جماعيA26:
 .1"Close or open nights for many dates and rooms at once. Prices and : OV 04.2  ← "Stop sale / On Request"
"26 - 27 Sep 2026 · are." they as stay held وrooms set" :"Already Delete" · sale Stop · 2026 Sep 19 - و18 On،
.Request · Delete"
 .2." 🔒  01 - 03 Oct 2026 · 3 nights · every day" ← "Add" ← "Use 1 - 3 Oct" ← OV 04.2PD  ← Dates
 .3 ← غرفتينRooms يختار
 .4.Stop sale ← "Set these nights to"
 .5"Makkah Annual Block · Ramadan Block · Makkah : 04.2B  ← "Apply to every contract on this hotel"(اختياري
Rooms Block will all close these nights for the 2 rooms you picked."
 .6.Toast changes" "Save ← اختارDraft لو العقود كل (على
 ليلةA27 على الغرف عدد تغيير مرسوم): (مش
:Trigger rooms" فيChange breakdown Pool pool( صفShared في أو 20") of "Left type( room عندهPer لو )،
. inventory.edit

---

**p. 177**

"Rooms for Standard Room (مقترحPopup صغير  Sep" 25 Fri on حقلRooms ← tonight" pool the in (أوRooms
← "Contract 50 · committed 48 )45 conﬁrmed · 3 awaiting your answer(" hint ← 50) العقدtonight" بقيمة
."Save" وCancel"
"You can’t go below 48 - 45 rooms are conﬁrmed and 3 are waiting for ← الـ:Validation من أقل خطأCommitted
"More than the contract )50(. Make sure the :Note answer." your ← العقد من أكبر حفظ. ومفيش (مقترح) معمسموح
hotel gave you these rooms."
الناتج نوعهDraft نشرRooms ومحتاج ،
 Release جماعي.A28:
 .1."Already set" "Release" ←  04.3 بقايمةOV
 .2." 🔒  01 - 15 Oct 2026 · 15 nights · every day" ← "Add" ← "Use 1 - 15 Oct" ← OV 04.3PD  ← Dates
 .3."Save changes" ← At = وRooms days"، of "Number = و2 18:00،
 .4 day Same ( بتبقى04.3S الساعة ← بيظهر14:00) والشرح
 .5."Save changes") ← موجودةEdit فترة على 04.3E الساعة أو الأيام يغيرّ
 .6+ "Removed - … goes back to the contract release (3 days before · 18:00) on 24 - 30 Sep." ← ( 04.3D ) Delete
."Undo"
.Discard Undo وA29:
الـUndo في آخر:Toast بيرجّع Save بينزلBR-04-32( والعدّاد )،
سطرUndo في Review ( 04.7 الـOV من ده السطر بيشيل الـDraft): ← سطر آخر كان لو بينزل. والعدّاد للمنشورة، ترجع والقيمة ،
."All changes published · 14 Sep, 11:20" والهيدرPopup بيتقفل
"Discard 3 changes? · They were never live. Agents keep seeing the all" Discard تأكيد ← مرسوم مش :(مقترح،
prices." published + them" وKeep changes" 3 الـDiscard ← السجلDraft في ويتسجل كله، بيتمسح ،draft_discarded
.(items 3
 change" جوهUndo prices (جنبChange للمنشورRelease لوحده ده البند بيرجّع السعر): أو
 editing" الـKeep يقفل ← تغييرReview غير من
.A30: Select cells
"Adjust ±" cells" علىSelect سحب ← يتفعل الوضع ← غرف3 22 - 24 العائمSep الشريط ← 04.1VS ) ← rate" أوSet
← "Select cells" ← stay"أو "Minimum الحفظBR-04-123( ← .Draft) أوClear" علىEsc تاني الضغط التحديد. يلغي
الوضع. يقفل
.WORTH DOING NOW": كارتA31
 nights" those وضعSelect ← cells وخلاياSelect مفعّل 24 - 25 الغرفSep لكل متحددة
.)"Both are weekend nights"( Sep 25 - 24 price" weekend "Raise ← prices واللياليChange الأساس الغرفة على
 Restrictions التولبارA32: من
بيفتحRestrictions" ← center العقدRule بتاع 03 Flow  كـ03.RS* Drawer) الشبكة فوق الشهور(مقترح) على مفلتر ،
 صف هناك، الحفظ بعد nightsالمعروضة. بيتحدثMin

---

**p. 178**

rule" فيOpen prices خليةChange على الضغط أو nights، الـMin نفس ← Drawer دي. الليلة بتغطي اللي القاعدة على تعديل
مساره العقد 03قيود Flow Edit( ← publish & النسخةReview نفس ،
: الشبكة.A33 من بتتباع" مش "ليه
عليها اللي (زيBlockerالخلية علامة عليها yet" rate أوNo السعر، على خط أو in"، الـno رمادي أو .)Release،
Not selling · Release الـ ← الخلية على المناسبPopupالضغط prices أوChange status Night سطر فوق وفيه :(مقترح)،
Clearing the passed" date + why" "See ←  10.4 OV night" one on check full "The 10( الشروطFlow بكل و✕)
missing rate on its own will not put this night on sale - the hotel-level pause has to be lifted too."
 الـ الموردBlockerلو بتاع مش ROOM_NOT_MAPPED،ACCESS_NOT_APPROVED،HOTELIANA_PAUSED ) ← علىBanner
(شوف الصف أو الشبكة ).6مستوى
 Hoteliana A34: بالنيابة. تغييرات حضرّت
.Draft موظف:Trigger كـHoteliana أسعار دخل
"12 إشعارالخطوات: action عندهمRequires اللي اليوزرز لكل الفندقrates.publish على link الهيدرdeep ← للشبكة
Hoteliana prepared 12 changes publish" & Review · published not وchanges معلوماتيBanner، أزرقInfo for،
Undo) ← publish." you before them Check you. (مقترح ← عمودReview فيه "By" M."( Sara · بيعملHoteliana المورد
بينشر أو سطر لأي
.Hoteliana والـالنهاية: نشر، اللي المورد باسم بيتسجل النشر باسمDraft
 منA35 الدخول link: معينة.deep ليلة على
وبتعمل الشهر، على بتفتح وبتعملScrollالشبكة للعمود، أفقي لمدةHighlight للخلية 3 ثواني فيه(مقترح) ولو ،
.Popup الـopen=change-prices بيفتح
)Exception ﬂows( 5 الاستثناءات. والأخطاء
. rates.view: صلاحيةE1 مفيش
. المباشر اللينك بار. التوب في مش 11.4العنصر UI : rates.view" needs screen بتتحملThis بيانات أي مفيش
: اليوزر.E2 نطاق برا الفندق
 11.5 UI : hotel" this for not but Rates, have You الرسالة الفندقماتذكرش. اسم
 04.10في OV النطاق برا اللي الفنادق موجودة، أصلاًمش
).Fixed صفرE3 أو فاضي السعر و04.6J: في04.6M،
0" above price a والحقلEnter الفتراتDanger، في مقفول. والزرار بسapart، الفاضي الحقل على الخطأ ،
بتتحفظ حاجة مفيش
 فوقE4 أو سالب، أو رقم، مش سعر (مقترح).100,000:
مستحيل السالب حروف). (مفيش بس أرقام بيقبل الحقل
.Enter a price up to الحد 100,000"فوق
 أوE5 (شبكة، الحفظ فشل أوxx5: 15، (مقترح)).Timeout ثانية

---

**p. 179**

Popupالـ تفضلمايتقفلش والقيم ،
.Try again" + "We couldn’t save. Your changes are still here." :Popup الـBanner جوه
Refresh كـ محليًا يتحفظ الشغل ← قفل اليوزر بعلامةunsaved_localلو الشبكة في ويتعلم saved" الـNot بعد ويفضل
(.UI 11.8 )
الـRetry بنفس key idempotency يعني تكرار، .مفيش
.)stale version: E6 الخلية نفس غيرّ تاني حد تعارض:
 ومابيدمجشالسيرفر الحاليةبيرفض القيمة ويرجّع ،
 11.10/11.11 UI : خليةdiff خلية 520." typed You 11:02. at 540 to Sep 24 Thu changed )"Sara ← mine" أوKeep
 theirs" خليةKeep لكل
الـ نفس في تعارض مالهاش اللي Batchالتغييرات .بتتحفظ
. Roomsالمخزون كتابة بآخر أبدًا مابيتحلّش يختار.) شخص لازم
).Publish failed / The draft is safe" UI 11.9: كلهE7 فشل النشر
"Publishing failed. Nothing changed for agents - they still see :Banner Danger 04.7L لـOV بيرجع 04.7 ومعاهOV
."Try again" + PUB-20260915-0042. Your 3 changes are safe."
 إشعارDraftالـ هو. ما زي action الصفحةRequires قفل (لو نشر للي
).periods: الـE8 (بعض جزئيًا نجح النشر
." - Not published" ✕ 04.7 سطرOV لكل بيعرض أوLive"
."Try again for 1" + "2 of 3 changes are live · PUB-20260920-0011. 1 change didn’t publish." :Bannerالـ
. بيفضل فشل الـDraftاللي ID. بتاخدBatch التانية والمحاولة نجح، للي واحد ID جديدBatch
).OV 11.15: شغالE9 وهو اتسحبت الصلاحية
"Only someone who can publish can make زرار:rates.publishسحب بيترفض. الجاي الطلب ومكانهPublish بيختفي،
.rates.edit_draft draft." a as saved are changes Your live. والـthese عندهDraft لسه لو بيتحفظ
 الـ:rates.edit_draftسحب المفتوحPopup prices." change longer no can You changed. access والشغلYour
 مابيتحفظشالمكتوب للنسخ ويتعرض .(مقترح)
.UI 11.4 rates.viewسحب : لـRedirect
 الـE10 في ليلة Draft: النشر. قبل عدّت
فتح بيتعلمReviewعند السطر dropped."، be will change this - passed has Sep 24 Thu (مقترح
1 change was for a night that has passed and was not والرسالة بيتشال، ده البند النشر، published."عند
 بقىE11 العقد منPaused: شغال.Hoteliana وهو
"Hoteliana paused new bookings on this contract since 14 Sep. You can keep Info (مايتقفلشBanner أزرق
. UI 10.4  ← "Open the pause" + editing and publishing - no change sells until the pause is lifted."
. عليها الخلايا وكل مسموحين، والنشر HOTELIANA_PAUSEDالتعديل
.Draft) اتنهىE12 أو انتهى العقد عندهTerminated: أو فاتح وهو
"This contract has expired - nobody can edit it." :) بيترفض entity_readonlyالحفظ

---

**p. 180**

"Draft closed - لـ بتتحول الـ04.1Eالشبكة Draft. مانتشرش اللي ومابيتنشرش كـبيتقفل السجل في ظاهر وبيفضل contract،
ended" .(مقترح)
 Terminated المستقبلE13: في بتاريخ
.)"Outside the contract (رمادي، بتتقفل الإنهاء تاريخ بعد term"الليالي
 بيتعلمDraftالـ دي الليالي على date" termination the after - publish النشر.Can’t عند وبيتشال
).04.1OF  / 04.1O: rates Bulk متداخلةE14: فترة
. بالرسالةAddالـ بيترفض وBR-04-59 dates") other بتفضلPick كده قبل اتضافت اللي الفترة
).04.1VF  / 04.1V: rates Bulk الحفظE15: عند نواقص
في BR-04-67الرسايل حفظ. مفيش
).04.3I  / 04.2I  / 04.1IF  / 04.1I: Bulk ومااتضافتشE16: اتختارت تواريخ
."No dates added yet …" فيه nights"الحقل 7 · 2026 Sep 30 Wed - 24 ولسهThu
Add Saveعند تحت(مقترح) رسالة :Dates: it." clear or Add, Press it. add didn’t but Sep 30 - 24 picked وزرارYou
Primaryبيتلوّن لوحده.. مابيضيفهاش السيستم
).04.3K Release فوقE17: يوم30
). 45كتب ← arrival." before days 30 than more be can’t "Release + 30" (بيحطUse يتصلح30 ما لحد حفظ مفيش
 0 = Release كسر.E18: أو
. 0 ← day." arrival the on release for day Same Use بس(مقترح) صحيحة (أرقام ممنوع الكسر
.Committed: الـE19 تحت الغرف تقليل
 في حفظA27الرسالة مفيش sale(. ديFree الحالة مفيهوش
 طلبE20 Request: مقفولة.On والليلة اتلغى، حجز أو انتهى، أو اترفض
.Stop sale). بيزيد "Left"الرقم بتفضل1+ الخلية
Info. breakdown Pool :(مقترح stopped" still · cancelled( BK-2026-0931 )booking today back room إشعار1
.(9§)
.Popup: الـE21 فاتح وهو جه حجز
.)Draft الـ في الـPopupالأرقام على ماتأثرش (الحجوزات عادي بيتحفظ السعر الحفظ، عند قديمة. بتبقى
 في الحفظ A27لو والـRooms( خطأCommitted) ← القيمة فوق زاد الجديد.E19 بالرقم
كل بتتحدث الـ60الشبكة رجوع وعند ثانية focus للتاب .(مقترح)
).OV 11.12: خلصتE22 الجلسة
الـ ونفس الشبكة لنفس ويرجع دخول ترجعPopupيسجل المحلية والكتابة ،
.Stay signed in" security_logout ( 11.13 بيتمسحOV المحلي الشغل ← 11.30) ومعاهOV بدقيقتين قبلها بيحذّر
.) UI 11.14: اتقفلE23 الحساب

---

**p. 181**

.Sign بترجع الطلبات غيرaccount_suspendedكل من والشاشة in،
: الشبكة.E24 تحميل في خطأ
. الشبكة 2026."مكان September for rates load couldn’t "We + again" شغالينTry بيفضلوا والمحددات الهيدر
: اتعدل).E25 العقد أو قديم، (لينك العقد مدة برا المختارة الشهور
"This contract runs 01 Jan - 31 Dec 2026. We moved you سطر ومعاها المدة، جوه شهر لأقرب بترجع toالشبكة
2026." December (مقترح)
.Draft) العقدE26 من اتشالت الغرفة وعليهاAmend:
"Deluxe Room is no longer on this contract - 2 changes :Review الـ بيختفي. فيDraftالصف ويظهر بيتقفل بتاعه
dropped." (مقترح)
:E27 list" my أوGet مرتينExport، اتضغط النشر أو ،
. بيستعمل النشر ضغطة. أول بعد بيتقفل keyالزرار idempotency يعني مكررBatchمفيش،
contract every to Apply بيتعدلE28: مش فيهم عقد فيه).Ended: مش الغرفة أو النطاق، برا أو ،
  الحفظ :(مقترحقبل skipped." is it - Room Quad have doesn’t Block فيRamadan ماتظهرش هتتعدل مش اللي والعقود
 أصلاً. القايمة
عقد. لكل النتيجة الحفظ، بعد
: العقد.E29 نفس فاتح تاني تاب
.E6 الخليةDraftالـ نفس على التعديل تحديث. أقرب عند الجديد العدّاد بيعرض التاني التاب السيرفر. على واحد
).Popup ماE30 بعد اتغير السعر list: فتحWin ما بعد (أو اقترح
.E6 Popupالـ الحفظ عند التعارض الفتح. ساعة الحالية القيمة على دايمًا بيفتح
6 حالات. مش موجودة في التصميم
السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
الشبكة onceمكان open Rates · yet linked hotel مربوطNo فندق ولا مالوش 1المورد
Open Hotel + Hoteliana approves your access to a hotel."
 (أوLibrary" hotels" مخفيةMy المحددات مستني). طلب فيه لو
/ UI 11.16
UI 11.19
a Create · yet Hotel Makkah Noor Al on contract عقدNo ولا عليه ومفيش مربوط 2فندق
 rooms." and prices load to contract + contract" (لوCreate
"Ask your Owner سطرcontracts.editعنده كده وغير or،
(.an Admin to create one"
UI 03.0A
3 الفندق على العقود (لسهDraftكل
مااتفعلتش)
Draft · activate it 04.9 الـOV بيعرض ومعاهاDrafts مقفولة
"This hotel has. rates" open لينكto + draft" الشبكةOpen
only draft contracts. Activate one to see rates here."
OV 04.9
4Include و منتهية العقود endedكل
مقفول
Include ended + "No active contract on this hotel."
."Create contract" الخيارcontracts" (بيفعّل
OV 04.9B

---

**p. 182**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
والـ04.1Eزي بالظبط، Badge 2026" Sep 10 5TerminatedعقدTerminated
This contract was terminated on 10 والنصDanger( Sep)،
2026. Bookings already made are still served. Nothing
can be changed. Export still works."
UI 04.1E
6Hoteliana أزرقBanner .)E11 العقدBadge "Paused" كلWarning( منPausedعقد).
 علامة عليها والـPausedالخلايا الفلتر خفيفة. شغالينExport
UI 10.4  + UI 04.1
7 بالفندق المورد أوSuspendedعلاقة
Terminated
"Your access to this hotel is not Danger الشبكةBanner فوق
. sell." can it on Nothing active. + hotel" the التعديلOpen
(مقترح مقفول ( والـRELATIONSHIP_INACTIVE والقراية )،
 شغالين.Export
UI 10.5
عليه كله Badgeالصف yet" mapped "Not رمادي.Info( والخلايا عليها)، 8ROOM_NOT_MAPPEDغرفة
Hoteliana is mapping this room to الغرفة اسم تحت theسطر
.Follow up" + hotel catalogue. It can’t sell until then."
 كـ(مقترح) مسموح التعديل لحدDraft: بيع مفيش بس مسموح، والنشر
الربط.
UI 10.5
دي الوجبة مع العقد على مش 9غرفة
(NOT_ON_CONTRACT )
+ "Not offered on this contract" في الوجبة بيبانmealsصف
.Open Rooms ↗"
UI 04.1M
04.8 فيOV 04.8مايظهرش منOV جه لو URL. ← العقد.E25 مدة برا كامل 10شهر
و رمادي المدة برا term"الليالي contract the "Outside المدة)،tooltip( برا نصه 11شهر
العدّادات. في بتتحسب ومش بتتحدد ومش
UI 04.1E
12 الشبكة ثابتScrollمسموح. الغرف وعمود أفقي، sticky :(مقترح)). من أكتر شهور3اختيار
Up to في12أقصى مقفولة الشهور وبعدها شهر، 04.8 ومعاهاOV
.12 months at a time"
OV 04.8
13OV 04.8 04.8 يبقىOV (الأبكر تلقائي بيبدّلهم الأول قبل التاني قبلTo.)Fromالاختيار فيFrom
04.1R ROOMSUI بيعرضSHOW 1" ومقفول.All واحدة غرفة فيه 14عقد
ROOMS SHOW بحث فيه وهي(مقترح) الصفوف بتحمّل والشبكة ، من (أكتر كتير غرف فيه 15)15عقد
.)virtualized( Scrollبتعمل
UI 04.1R
من اتشالت الصفوف 16SHOWكل
ROWS
.)BR-04-05 04.1N مايتقفلشToggleآخرUI
17 04.1VP فيUI nights.BR-04-10الرسالة past فاتHide كله والشهر
18 04.1VU وسطرUI أصفار، days."الصف 7 past the in sold rooms مبيعاتPickup"No فيه مفيش
19Free sale / On معPickup
Request
 04.1VU موجودSoldشغالUI
04.1Fa عدّاده.A10UI 200فلتر
21 pricedفلتر منNot غرف ومفيش
سعر غير
 04.1U ظاهر.ChipالـUI مش
22 + غيرmeals وجبات مفيهوش عقد في
Room only
 04.1M ظاهرmeals"الزرارUI مش

---

**p. 183**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
232 + مشmeals الافتراضي والإشغال
)Single(غرفة
guest" 1 بدلfor guests" 2 والحسبةfor 1، :(مقترح).
العقد من للغرفة الأساسي = الإشغال
UI 04.1M
24 سعرRateخلية غير من
(NO_RATE )
."No rate yet · tap a night to set one" tooltip"—" و رمادي
No contract hint pricesالضغط والـChange فاضي والحقل
.price for this night"
UI 04.1U
25 prices مشChange غرفة على
)Baseالأساس
Contract VIEW"العنوان CITY · ROOM والـDELUXE hint،
This price replaces base + 160(" + )base وسطر560 160،
 change." don’t rooms Other nights. these الـon
"Room supplement · + 160 · this قسمهاsupplements
 وبيتعدلroom"
OV 04.6A
26 prices الـChange بعد النهارده لليلة
Cut-off الـRelease أو
"Release has passed for وسطر مسموح، :Warningالحفظ
tonight - this price only helps if you open the night again."
(مقترح
OV 04.6I
27 prices لياليChange كلها والفترة
المدة برا أو فاتت
No night in this ← من جت لو المنتقي. من Selectمستحيل
 changed" be can مقفول.range والزرار
OV 04.6H
28 prices موسمChange في ليالي فيها
المواسم برا وليالي
Ramadan 640 )7-9 Mar( · Contract 400 جزءhintالـ لكل
Nationality prices apply only. Mar(" الجنسيات10-13 قسم
on the 3 Ramadan nights."
OV 04.6G
بيتقسم الجنسيات …"قسم · 40 − GCC · وRamadan مختلفةLast جنسيات بمجموعات 29موسمين
 …" · 60 − GCC · nights الـten المجموعة ليهاFixed. موسم كل في
حقلها
OV 04.6G
30مجموعة
minimum selling price
04.6I المجموعةOV سطر على مسموحBR-04-51تحذير والحفظ )،
31 priceخطأ the Raise less. or 0 pay would nationals أقل0مجموعةGCC أو
 season." the in group the change حفظ.or ومفيش
OV 04.6J
32 prices المتعلّمةChange الأيام وكل
الفترة في مش
.BR-04-48OV 04.6F (Fridays)
33Chips prices شالChange ما بعد
إند ويك كلها المتبقية الليالي خلّت
Price per night · واحدone/apartالاختيار وحقل يختفي،
 رجّعweekend" لو كتبهاChip. اللي والأرقام يرجع الاختيار داي، ويك
ترجع
OV 04.6F (Fridays)
34Change prices أوEscضغط في✕
كتابة وفيه
 +Discard changes? · You typed a price that isn’t saved."
."Discard" editing" وKeep
OV 03.11
35  خصم؟ فيه لو (مقترح)مسموح الـلأ supplement: ≤ رسالة0 سالبةSupplement. قيمة لليلة:
.Enter 0 or more"
OV 04.5E
36: قيمةSupplement حذف
Override
."+ 45 per 04.5E يرجعOV والسطر العقد، قيمة = الفاضي person"الحقل
37Fixed 04.6K أصلاًOV موجود مش فيSupplementالقسم
38 04.4 والخليةOV onlyمايتفتحش، status.read فاتتNight ليلة على
39 Request On status علىNight
 والـAllotmentعقد فاضيPool
The pool is empty سطر الفندق. رد بتستنى الطلبات -مسموح.
room." a ﬁnd to hotel the needs request each (مقترح)
OV 04.4

---

**p. 184**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
40On sale طلباتStop فيها ليلة على
 مستنيةRequest
"2  المستنية سطرمابتتلغيشالطلبات الرد. تستنى وبتفضل
requests are still waiting for your answer on these nights."
OV 04.2B
41Stop sale Request فوقOn
) 04.2O(عكس
Quad Room · City View is closed بيكسب )Stopالأحدث
sale) on 26 - 27 Sep. Adding this turns those nights into
On Request."
OV 04.2O
42 الحفظ وعند بتتضاف، -الفترة open already are nights sale"These أصلاًOpen مفتوحة ليالي على
 change." to ومفيشnothing فاضي.Draft
OV 04.2
43 set" Already (أكتر كتير فترات فيه
)10من
. بعد بتتطوي و5القايمة 14"، all الآخرShow في الفاتت الفترات
ورمادي.
OV 04.2
44 الـRelease عدّى ويومها ليلة على
Release
.BR-04-88OV 04.3
45 04.3E فيOV مقفولة الغرفEditالغرف تغيير جديدةDelete. إضافة + Edit Release الغرف وغيرّ
46Release مالوشRelease عقد في
(None)
"Every night · All rooms · No :"Already في سطر set"أول
.release · From the contract"
OV 04.3
47 rates موسمBulk فيها فترة على
الموسم برا ليالي
7 nights · 3 in Ramadan · 4 at الملخص theمسموح.
Fixed price" الـcontract الـNote. إن بيوضح الجنسيات بتاع
مابتتلمسش
OV 04.1B
48Draft الحفظDraftالـ قبل سطر بيتستبدل. القديم room-nights rates"12 عليهاBulk ليالي على
already have an unpublished change - saving replaces it."
OV 04.1B
49"Other rates وBulk rooms،
 base" the ومفيشfollow متشال،
الأساس غير غرفة في اتكتب سعر ولا
1 room ×  التانية بسمابتتغيرشالغرف الأساس بيعد والملخص 7،
.nights = 7 room-nights"
OV 04.1B
50room- 500 Bulk من أكتر على
night
.BR-04-60OV 04.1B
51 :BR-04-61 Room Deluxe on nights 2 · failed 2 · saved جزئيةBulk"61 نتيجة
."Retry failed" + are outside the contract term now."
UI 11.8
52Rate cells مشSelect خلايا على
)Release أوSold(
 04.1VS صفUI على مابيحددشRateالتحديد تاني صف على السحب بس.
53 cells غرفSelect فيها وغرفFixed
Base
واحد— نوع (العقد مستحيل
54± Adjust
0يساوي
3 offer-nights would drop to 0 or المعاينة في less."خطأ
حفظ. ومفيش
UI 04.1VS
55 publish & Review من أكتر وفيه
 سطر20
."Show 18 more" بعد متطوي نوع وكل بالنوع، و5متجمع سطور
.Publish 43 changes"الزرار
OV 04.7
56 (ليلةReview هتتنشر مش سطور فيه
اتشالت غرفة المدة، برا فاتت،
 04.7 العدّاد.✕متعلّمةOV في داخلة ومش السبب، ومعاها
57Discard all 03.3D A29OV مرسوم مش (تأكيد

---

**p. 185**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
publish"زرار & لـReview بيتحول changes" الـReview معندوش. 58rates.publishيوزر
Only someone who غيرReview من سطرPublish ومكانه can،
"Ask to publish" live." these make can publish :(مقترح
. عندهم للي إشعار rates.publishبيبعت
OV 04.7
11.6 فيUI والسطر مرسوم، مش التعديل 59Auditorيوزر.1كل
60 غيرFinance (من
( inventory.view
.)1 04.1N وUI وفلاترها المخزون مرسومينPickupصفوف مش
61 again." Try ﬁle. the create couldn’t "We + again" والـTry فشلExport،
 مفتوحPopup بيفضل
OV 04.11
62 04.11 فيهOV سطر وأول الملف out"اسم Sold فلترExport."Filter: فيه والعرض
63"Prices for" 04.11 nationals"الملفOV GCC for: وضعExport."Prices في
64 04.12T الـOV تحميل أقرب اسمهChipعند بيتغير fewer" or goneحد).6 تانيAlmost يوزر من اتغير
65Per room breakdownالـ فيPool
type
 علىPoolمفيش الضغط 20". of بيفتحLeft للغرفةBreakdown
Standard Room · Fri 25 Sep · 20 rooms held · 14 sold · 2
.awaiting your answer · 4 left"
OV 04.6
66 breakdown والـPool
 اتستعملOverbooking
"1 more booking can come in used" 1 · والجملة2 above،
the pool, then the night stops selling."
OV 04.6
67On outالليلة بيحوّلهاSold والعقد
Request
"The pool is full. New "0الخلية + والـRQ :breakdown،
bookings become requests you conﬁrm."
OV 04.6
68Stop sell والـ0الخلية أحمر، :breakdown" night The full. is pool outالليلةThe والعقدSold
stopped selling."
OV 04.6
04.6 مقفولة.E20OV والليلة رجعت 69غرفة
70 سعرScheduled غير من غرف وفيه
جه البداية ويوم
 عليها دي الغرف عادي. بتحصل وإشعار:NO_RATEالبداية
Ramadan Block started. 3 room types have no price and
are not selling."
UI 04.1U
71Win list N · list والـWin الهيدر في
Off
 04.W0 list"الزرارUI رقمWin غير من
72Ended 04.1E فيUI ظاهر مش 04.1Eالزرار list. والعقدWin
73 NOW" DOING مفيشWORTH
اقتراح
04.1 ظاهر.UI مش الكارت
العقد في إند الويك 74)Amendتغيير
فيه ما Overridesبعد
 الويكOverridesالـ تظليل بتعيد الشبكة هي. ما زي الليالي على بتفضل
 pricesإند الجديد.Change إند الويك بيقرا
UI 04.1
الـ ديLabelsكل بالعملة USD" فيها· اللي النصوص وكل مشSAR")، العقد 75SARعملة
العملة. من بتتولد
UI 04.1
76 فيه nightsموسم فيMin مختلف
الفترة نص
3 in :Change prices nightsصف وMin بقيمتها، ليلة كل بيعرض
.Ramadan · 5 in Last ten nights"
OV 04.6G
شاشة أو موبايل على اتفتحت 77الشبكة
من (أقل )px1024صغيرة
 +Rates work best on a larger screen." :Banner (مقترح
.Popups Full-screen الـScrollالشبكة ثابت. الغرف وعمود أفقي،
UI 04.1VK

---

**p. 186**

)State machine( 7 الحالات.
× line) = تغيير7.1 بند item نوعChange
Badge / السببعلامة / منإلىمين
—unsaved_local في كتب ناجحPopupاليوزر حفظ غير من وقفل
شبكة) (فشل
) saved"علامة "Not علىDanger(
الخلية
— /
unsaved_local
ناجحSave prices saved_draftNight،Bulk،Change
Apply،Release،status list Hoteliana،Win
(on behalf
"You changed it - not live until
(Neutral) Draft · you publish"
saved_draftsaved_draft بتتستبدلSave— (القيمة البند نفس على تاني
all— Discard / saved_draft(محذوفUndo
saved_draftpublishingPublish"Publishing…"
"Live" الـSuccess( لمدة publishingpublishedنجح،Banner)
علامة مفيش وبعدها
published" "Not فيDanger( publishingpublish_failedفشل)
Review
publish_failedpublishingTry again—
"Dropped" فيNeutral( اتشالتReview) الغرفة أو انتهى، العقد أو عدّت، saved_draftdroppedالليلة
والسجل
)Sale status لليلة7.2 البيع حالة
منإلىمينالعلامة
Open saleStop sale) النفادinventory.stop_sellالمورد (سلوك السيستم أو النشر، بعد
(Stop sell =
خط عليه "SS"السعر
Open saleOn
Request
After release = النفاد (سلوك السيستم أو Requestالمورد، أوOn On،
(Request
Warning · "RQ"
Stop sale / On
Request
Open النشر— بعد saleالمورد
On is night Requestعقدevery اللياليOn كل Request: On دايمًا حالة— أي
Request"
.)Hoteliana التلقائيactorالـ للتغيير (مشsystem
)engine لـ7.3 البيع قابلية الـroom-night (من
): Sellable ( ][ = علامةblockers بدون
Blocked ( ][ ≠ منblockers العلامة إلغاء،blockers]0[): حجز، (نشر، يتغير شرط أي لما لوحدها بتتغير ،Pause،Release.
الوقت العقد، انتهاء
)00.S (من7.4 الشبكة في يبان كما العقد 10.R وREF

---

**p. 187**

تعديل بيعفي الحالةBadgeجديد
الشبكة
نشر
Scheduled"Scheduled · starts 18 Feb 2027" ✓ البدايةLive( من البداية✓ لحد Neutralلأ،
Active"Active" Success✓✓✓
 (منPaused
(Hoteliana
"Paused" Warning✗✓✓
الرفع
Expired"Read + "Ended 19 Sep 2026" Neutral
only"
 النهاية✗✗✗ بعد
Terminated"Terminated" Danger تاريخ✗ من
الإنهاء
✗✗
Draft— هنا✗—— بيتفتح (مش
Active → .)Hoteliana( Active → Paused → Active Active → Scheduled البدايةTransitions: يوم (السيستم، مكة00:00
.)Hoteliana ليلةExpired آخر بعد (السيستم، Terminated → بـActive (المورد أوcontracts.lifecycle
Publish batch 7.5
منإلىالسببBadge
—PublishingPublish"Publishing…" Info
PublishingPublished Success الـLive" نجحتperiodsكل
PublishingPartly published Warning live" 3 of الـ2 فشلتperiodsبعض
Danger failed" (ومفيشPublish فشل IDكله Batch بيتحجز) PublishingFailed(مقترح
Rate period version 7.6
 Live →  (مشClosed لماDeleted يعملBatch) الـSplit الفترة. يستبدل أو Closed اتأكدت اللي بالحجوزات مربوطة بتفضل
.)Neutral( "Superseded") مفيشLiveوهي فيBadge. بتظهر للمورد. versions" & "Activity ( 03.3A كـOV
)Badges (مش7.7 الخلية ألوان
:Draft. Closed for sale: left عاديRooms gone: Almost أصفرWarning≥( Draft Danger. left: rooms علامةNo
.Neutral: السعر على Warningخط Request: On ."RQ" تظليلWeekend إطارToday: past: / term رماديOutside
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
)OV 04.10 ( بس) المسموح فيها (القايمة اليوزر— نطاق وجوه مربوط Hotel✓فندق
Contract
( OV 04.9 )
أوActive أوScheduled وPaused ✓،
"Include لوEnded/Terminated
ended contracts"
—
From / To
( OV 04.8 )
العقد؛ مدة Fromجوه ≥ أقصىTo ✓12؛
 (مقترح)شهر
Up to 12 months at a time"

---

**p. 188**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Prices for✓
(Everyone
المعروضة الشهور في المواسم مجموعات
بس
—
Show row" one least at الأقلKeep على واحد rows✓صف
Show room" one least at الأقلKeep على واحدة rooms✓غرفة
Almost gone
threshold
أو2 أو3 أو4 أو5 أو6 أو8 ✓؛10
الحساب4الافتراضي مستوى على ؛
—
 (المنتقي)Nights✓ليلة
366 ليلة (مقترح)
"Days before today are closed."
Apply to these days
(Chips)
+ المتعلّمةChip الأيام الأقل؛ على واحد ليالي7✓
للتعديل قابلة ليلة تغطي لازم
No night in this range can / "Tick at least one day."
be changed"
One price / apart✓
مختلطة
واحد— اختيار
 /Price (ليلة
weekdays /
weekend / all
(nights
صحيح؛ 100,000؛0رقم ✓؛(مقترح)
 = الـ من بسminimumأقل تحذير
Enter a price up to / "Enter a price above 0"
"Below your minimum selling :Warning / 100,000"
price (420). You can still save - agents will see
380."
Fixed nationality
group price
 (فاضي✗
ما زي يفضل
هو)
0" above price a صحيحEnter 0رقم
Night supplements
،HB،B&B،Room(
(… Child
 (فاضي✗
العقد قيمة
صحيح 0رقم 10,000؛(مقترح)
(مقترح)
Enter 0 or more"
Different weekend
price
(supplements)
الرسايل القواعدنفس بنفس ✗عمودين
Sale status
( 04.4 ،OV
( OV 04.2
✓Open sale / Stop sale / On
 Request Request( فيOn ظاهر مش
Requestعقد غيرOn من ومقفول ،
SLA )(مقترح)
"Set an answer time (SLA) in the contract ﬁrst"
Bulk / Stop) Rooms
(sale / Release
✓"All الأقل؛ على واحدة rooms"غرفة
افتراضي
room" one least at Pick (مقترح)
added) Dates
(ranges
✓Bulk في الأقل؛ على واحدة ratesفترة
تتضاف لازم المختارة تداخل؛ مفيش
Add at least one date range - pick From and To,
"28 Sep - 5 Oct overlaps 24 - 30 / then press Add."
Sep, which is already added. Pick other dates, or
"You picked 24 - 30 / delete the added range ﬁrst."
it." clear or Add, Press it. add didn’t but Sep (مقترح
Bulk prices per
"All selected / room
rooms"
✓
الأقل
in price one or - room one least at for price a صحيحType 0رقم
“All selected rooms”"
Same price for all✗Toggle—

---

**p. 189**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Other rooms follow
the base
الافتراضيToggle— ✗،
Apply to every
contract on this
hotel
✗ العقودCheckbox وActive؛
 الغرفةScheduled نفس فيها اللي
—
Release · Same day
/ Number of days
✓30 before days 30 than more be can’t day"Release منSame صحيح رقم أو لـ1،
"Use Same day for release on the arrival / arrival."
day." (مقترح
Release · At✓ خطوةHH:MM مكة؛ بتوقيت دقيقة30
 الافتراضي(مقترح) و18:00؛ في14:00،
Same day
"Pick a time"
Rooms on a night
مقترحA27( ،
conﬁrmed are rooms 45 - 48 below go can’t صحيحYou ✓Committedرقم
and 3 are waiting for your answer."
± Adjust✓ صحيح من0رقم لـ9,999،
الناتج9,999+ 0؛
"3 offer-nights / "Enter an amount other than 0"
would drop to 0 or less."
 stay علىMinimum
(مقترح الليلة
✓Closed من صحيح لـ1رقم to؛30
arrival / departure
"Enter 1 to 30 nights"
Export format✓xlsx / csv / pdf—
9 الإشعارات. والإيميلات والسجل
الإشعارات
action مينالقناة؟Requires الحدثيستلم
 بقالهDraft ومانتشرش موجود
24 ساعة (مقترح
عندهم rates.publishاللي
الفندق على
In-app"3 changes on Makkah Annual) ✓
) published" not are ماBlock لحد
يتمسح أو يتنشر
 Hoteliana تغييرات حضرّت
بالنيابة
✓ 12( prepared Email"Hoteliana + عندهمIn-app rates.publishاللي
(changes for you to review"
In-app +( لوEmail ضغط منهPublishاللي جزء أو كله فشل النشر
 الصفحة )(مقترحقفل
Publish failed - the draft is) ✓
(safe"
الـ إشعار. نجح—Bannerمفيش النشر
كفاية الصفحة في
✗
 عندهم علىrates.viewاللي بدأScheduledعقد
الفندق
In-app). ✗ سعرInfo( غير من غرف فيه لو
مقفولة لسه والليلة رجعت غرفة
1 room back · still)
(stopped"
عندهم اللي
inventory.stop_sell
In-app ✗ .)Info( ليلةThread لكل واحد
 outالليلة وصلتSold أو
 gone الـAlmost في يوم14
 (مقترحالجايين
In-app✗ عندهم)Dashboard( inventory.viewاللي

---

**p. 190**

action مينالقناة؟Requires الحدثيستلم
 النهاردهReleaseالـ هيعدّي
 غرف فيه (مقترح)ولسه
عندهمIn-app✗ inventory.editاللي
 عملتHoteliana أوPause
رفعته
 + Admin + عندهمOwner اللي
rates.view
In-app + Email (الـ✗ الموردPause إيد في مش
 Email✗ + طلبهIn-app جاهزExportاللي كبير
Almost بس— —سجل حد goneغيرّ
والـ والقراية الحساب، بتاع الحدث العامة: منdismissالقواعد بيخرج البند اليوزر. بتاعة you" Needs لما يتعمل لماالإجراء مش ،
 الكيان نفس على التكرار اللحظة. نفس في اليوزرز ولكل المنطقة.Threadيتقري، على صلاحية مالوش ليوزر إشعار مفيش واحد.
 logالسجل :)Activity فيه.append-only سطر كل id actor والدور الحدث، ووقت timestamp، وUTC مكة)، بتوقيت (بيتعرض
Manual / Bulk / Selection / Win list / Hoteliana on behalf /( key وaction type/id، وentity new، → وold source،
 وSystem id)، فيهbatch لو
new  → (old الحدثActorAction)مثال
/ سعرsupplier_user Draftحفظ
hoteliana_user
rates.draft_savedStandard Room · 24 Sep · Room only ·
(draft) 500 → 520
supplementحفظ
Draft
supplier_userrates.draft_savedHB per person · 24 Sep · 90 → 100
(draft)
Bulk ratessupplier_userrates.bulk_draft_savedroom-nights · 24 - 30 Sep · base 63
400/500 → 450/550
On → sale Open · Sep 27 - 26 · بيعsupplier_userinventory.stop_sell_draftQuad Draftحالة
(draft) Request
Release Draftsupplier_userinventory.release_draftStandard · 24 - 30 Sep · 3 days 18:00
(draft) → 1 day 18:00
Rooms Draft
(مقترح
supplier_userinventory.rooms_draft(draft) Pool · 25 Sep · 50 → 52
Undo / Discardsupplier_userrates.draft_discardeditems 3
Draft droppedsystemrates.draft_droppedSep · reason: night passed 24
Publishsupplier_userrates.published· PUB-20260920-0011 · 3 changes
room-night old → لكل newسطر
Publish failed /
partial
systemrates.publish_failedof 3 failed · reason 1 · …-PUB
Split periodsystemrates.period_splitSep v1 → closed · 3 new 30 - 1
periods
Sold-out rulesysteminventory.auto_stop_sellSep · Open sale → Stop sale 25
Room returnedsysteminventory.room_returnedSep · Left 0 → 1 · still stopped 25

---

**p. 191**

new  → (old الحدثActorAction)مثال
Almost gone
threshold
supplier_usersettings.almost_gone_changed6 → 4
Exportsupplier_userrates.exportedxlsx · Sep 2026 · 9 rooms
)Acceptance criteria( 10 معايير. القبول
 .1 يوزرGiven ofﬁce غيرFront (من البوابة،When)،rates.view يفتح Then Availability" & بار،Rates التوب في موجود مش
."This screen needs rates.view" UI 11.4 فتح يشوفratesولو مباشرة
. 2 يوزرGiven (عندهFinance ومعندوشrates.view الشبكة،When)،inventory.view يفتح صفوفThen pool وContract
 pool in وLeft وخيارSold وفلاترPickup out وSold 4 fewer مرسومينor مش
 Given الشبكة،When،Auditor يفتح تعديلThen زرار ولا مفيش rates وBulk Request، On / sale وStop وRelease، .3،
 cells وSelect publish، & مابيفتحشReview خلية على والضغط تعديلPopup)،
 .4"Contract pool · 50 rooms a night · +2 overbooking · عقدGiven 2 + 50 pool تفتح،When،Shared الشبكة يظهرThen
"Left under it" from sells room غرفةevery كل وتحت cap" no · pool the from · عليهاSold اللي والغرفة 12، لهاCap يظهر
.cap · of 12 a night"
 .5 عقدGiven sale تفتح،When،Free الشبكة Then used" not · وInventory used" not · وزرارRelease مشRelease
موجود
. 6 عقدGiven price When،Fixed سعر يغيرّ ويحفظ،line واحدة ولاThen قسمline ومفيش تتغير، تانية الـsupplements في
.Popup
 .7"Price for this night · SAR" واحدةGiven ليلة Sep 24 إند)،Thu (ويك يفتحWhen prices واحدThen،Change حقل يظهر
اختيار .weekday/weekendومفيش
. 8"Price per night · weekdays · فترةGiven 27 - 29 كلهاSep يفتحWhen،Weekdays prices واحدThen،Change حقل
.Chips ومفيشSAR"
 .9"One price فترةGiven 27 Oct 3 - Sep 5( weekend 2 + يفتحWhen)،weekdays prices بينThen،Change الاختيار يظهر
 night" every وfor apart" weekend and وتظهرWeekdays لأنهاChips، الأيام ليالي7
 .10"Price per Friday · 5 Given كله، أكتوبر فترة عداWhen ما الأيام كل يشيل الاختيارThen،Fr يبقىone/apart والحقل يختفي،
 SAR" · والزرارnights nights"، 5 الـSave الحفظ وبعد مايتغيروش26، التانيين ليلة
 فيهGiven السعر حقل فاضي،0 أو يحفظ،When يحاول يظهرThen 0" above price a ومفيشEnter مقفول، والزرار .11Draft،
بيتكتب
. 12"Below your minimum selling price )420(. You الـGiven 420 price selling يكتبWhen،minimum يظهرThen،380
380." see will agents - save still كـcan ينجح والحفظ .Draft،
 .13 فترةGiven 20 - 26 فيهاSep وليلتين3 خاص بسعر ليالي sale وStop محجوزة،12 غرفة سعرWhen يحفظ الليالي،450 لكل
 الـThen الليالي ياخدوا3 المقفولين والليلتين تتستبدل، الـ450 والحجوزات مقفولين، ويفضلوا القديم12 بسعرها تفضل
 .14 فترةGiven 7 - 13 فيMar وRamadan nights ten يحفظ،When،Last ومجموعاتThen الجديد، السعر تاخد ليلة كل
 الـ والمجموعة الجديد، السعر من تتحسب جديدةFixedموسم قيمة كتب لو إلا ماتتغيرش
. 15"These nights are not in a season, so every موسم،Given أي برا ليلة يفتحWhen prices يظهرThen،Change
 season." a inside set are prices Nationality above. price the pays مجموعاتnationality قسم ومفيش

---

**p. 192**

 .16 Given prices لليلةChange الأساس الغرفة على 24 يحفظWhen،Sep Then،520 View Haram · Room علىStandard
 تفضل الليلة الأساس620نفس مع (مابتمشيش
. 17Standard Haram Then Given rates وBulk base" the follow rooms متعلّم،Other يكتبWhen 450 / للأساس،550
."9 rooms × 7 nights )24 - 30 Sep( = 63 تبقىView 570 / ومكتوب670 base" the والملخصfollows room-nights"،
 .18"28 Sep - 5 فترةGiven 24 - 30 فيSep متضافة rates يضيفWhen،Bulk 28 Oct 5 - بالرسالةThen،Sep تترفض الإضافة
Oct overlaps 24 - 30 Sep, which is already added. Pick other dates, or delete the added range ﬁrst."
 .19"2 things to ﬁx before you can hold these changes: pick Given rates فاضي،Bulk يضغطWhen يظهرThen،Save
 room." one least at for price a type and dates, حفظthe ومفيش
 .20 Given Request On Room علىQuad 26 - 27 يضيفWhen،Sep sale علىStop 25 - 28 الغرفة،Sep لنفس يظهرThen
 closed."تحذير is Sep 28 - 25 so well, as sale Stop into nights those turns this النشرAdding وبعد مسموح، والحفظ
.Stop الأربعة saleالليالي
. 21 Given hotel" this on contract every to متعلّم،Apply يحفظWhen sale لغرفتين،Stop عقدThen كل أوActive
."skipped" ياخدScheduled الغرفتين فيه الفندق على لهDraft يتسجل الغرفة مفيهوش اللي والعقد الليالي، بنفس
 Given يكتبWhen،Release يوم،45 يظهرThen arrival." before days 30 than more be can’t "Release + 30" .22،Use
تبقى ما لحد حفظ .30ومفيش
. 23"The newest wins, so Given day 1 علىRelease 24 - 30 يضيفWhen،Sep 2 علىdays 24 Oct 2 - يظهرThen،Sep
 before." days 2 be will Oct 2 - Sep ينجح24 والحفظ
 .24"Same day: unsold rooms go back to the Given day يختاره،When،Same تبقىThen الافتراضية الساعة ويظهر14:00
hotel at 14:00 on the arrival day. Agents can still book until then."
 .25 Given 20 وreleased 8 وconﬁrmed 3 Request مستنيين،On لـWhen الغرف ينزّل يحاول الأرضيةThen،10 برسالة يترفض
لـ11 تنزل الأرضية يترفض طلب ولما .10،
 ليلةGiven sale اتلغى،Stop عليها وحجز ترجع،When الغرفة Then يزيدLeft" تفضل1 والليلة sale، بتقولStop شاشة وأي .26"1،
 stopped" still · back بتتباعroom إنها بتقول ومش
 .27 Given الـ3 في تغييرات يضغطWhen،Draft changes" 3 وينجح،Publish يظهرThen 04.1V برقمUI بصيغةBatch
 والهيدرPUB-YYYYMMDD-NNNN now"، just · published changes الـAll وعلامات وكلDraft، تختفي، ليهاroom-night اتغيرت
.Batch السجل في newسطر → بالـold مربوط
. 28 لـGiven فشل النشر منperiod واحد ترجع،When،3 النتيجة الناجحينThen الاتنين بـLive ID يفضلBatch والتالت ومعاهDraft،
 و again"السبب أيTry مايشوفش والوكيل متطبقperiod، نصه
. 29 Given على اتأكد حجز 24 بسعرSep من500 قديم،Batch يتنشرWhen السعر يفضلThen،520 الحجز بالـ500 مربوط ويفضل
 version والـrate تبقىBatch القديمة والفترة القديمين، ممسوحةClosed ومش
 .30 العقد،Given نفس فاتحين يوزرين يحفظWhen التاني 540 لـ غيرّها الأول خلية على فتح،520 ما بعد كـThen يترفض الأول حفظ
 ويظهرstale الـdiff نفس في التانية والتغييرات خلية، خلية تتحفظBatch تعارض مالهاش اللي
 .31Draft الحفظ،Given عند شبكة فشل يعملWhen اليوزر كـThen،Refresh موجودة الكتابة saved" وNot مابيعملشRetry،
مكرر
. 32Feb 18 عقدGiven يبدأScheduled 18 2027 أسعار،When،Feb ينشر قبلThen بيع مفيش 18 ومنFeb يوم00:00، مكة
 تبقى إجراءLiveالأسعار أي غير من
. 33"This contract ended on 19 Sep Banner عقدGiven بـWhen،Ended يفتحه contracts" ended الـThen،Include
 …" و2026 تعديل، أداة أي ومفيش يظهر، شغالExport

---

**p. 193**

 .34"no change sells until the عقدGiven منPaused وينشر،When،Hoteliana يعدّل والـThen ينجح، النشر يقولBanner
. lifted" is عليهاpause الليالي وكل HOTELIANA_PAUSED،
 .35 عليهاGiven ليلة وNO_RATE يفتحWhen،HOTELIANA_PAUSED why" Then،See  10.4 والـOV الاتنين، يعرض فيBadge
مايختلفوش والشاشتين الثابت، الترتيب حسب الأول ياخد الشبكة
. حدGiven 4 = gone When،Almost لـ يغيرّه فيهاThen،6 اللي الخلايا و5 والـ6 فورًا، صفرا تبقى يبقىChip fewer" or 36،6
نشر ولا اتغير سعر أي ومفيش
. Given for" "Prices = nationals فيGCC 2027 تتعرض،When،March الشبكة لياليThen 1 - 19 الموسمMar بسعر 37،40
 20وليالي والـMar العقد، بسعر وبعدها دهBanner بيقول
. 38"No night in المعروضة،Given الشهور في بمجموعات مواسم مفيش يفتحWhen for" والرسالةThen،Prices مقفولة المجموعات
.the months you show has nationality prices…"
 .39 Given xlsx وصفين،Export غرفتين فيه والعرض الملف،When ينزّل والصفينThen بس الاتنين من غرفة لكل شيت فيه الملف
 والقيم عليهاDraftبس، متعلّم
. 40"GOOD TO KNOW · past nights Given nights past النهاردهWhen،Hide 20 منThen،Sep تبدأ الشبكة 20 ويظهرSep
.are hidden - the grid starts today"
 .41 Given days 7 last · يتفعل،When،Pickup صفThen يعرضSold week" past the in sold ليلةrooms لكل
 .42"9 offer-nights selected · 3 rooms × Given cells علىSelect غرف3 22 - 24 يخلص،When،Sep التحديد يظهرThen
."Clear" Sep" 24 - و22 rate" وSet ±" وAdjust stay" وMinimum
 .43 Given ليلةDraft على 24 مانتشرش،Sep ولسه ييجيWhen 25 ويفتحSep النشرThen،Review وعند هيتشال، إنه متعلّم السطر
ده بتقول والرسالة مابيتنشرش
. 44 يوزرGiven (عندهReservations ومعندوشinventory.stop_sell يعملWhen)،rates.publish sale الـThen،Stop
 قرارDraft حسب يمشي النشر وسلوك يتحفظ، بسQ-04-01 البيع حالة تغييرات ينشر (الاقتراح:
 .45 Given الـUndo في بعدToast خلالWhen،Save في يضغطه ثواني،10 الـThen قبل لما ترجع القيم ينزلSave والعدّاد ده،
 .46 مسعّرة،Given كلها غرفه عقد تفتح،When الشبكة Then Chip priced" ظاهرNot مش Given من3 سعر،9 غير من يظهرThen
 priced" types room 9 of الشبكة6 آخر دي والغرف
11 أسئلة. مفتوحة
تتاخد لازم قرارات
Draft. Reservations · وQ-04-01 sale عنده:Stop ومعندوشinventory.stop_sell يعملrates.publish يقدر يعني
 saleلـ يخليهاStop مايقدرش بس Live دلوقتي". اتملى "الفندق وقت الصلاحية فايدة بيضيّع وده عنده):BR-04-78الاقتراح، اللي
.inventory.publish_sale_status ينشرinventory.stop_sell جديدBatch مفتاح البديل: بس. البيع حالة تغييرات فيه
Flow price selling Minimum · فين؟:Q-04-02 بيتحدد بيقول04.6I و420 04.WA، بيقولOV في500 شاشة ومفيش 03،
 وهل12أو موسم؟ لكل ولا غرفة، لكل ولا عقد، لكل هو هل بتدخله.) بتحطه؟Hoteliana اللي هي
Your price will. Q-04-03 380"· see will ماركب:agents + المورد سعر بيشوف الوكيل مشHoteliana الأدق380،
be 380."
"Pool rooms tonight · floor = Q-04-04 ·  04.R REF 2B الـRule بيقول panel فيهone-night
 وcommitted" بسinventory.edit، معرّف. prices الجديدChange الـ04.6A بيعرض شاشةPool) أي ومفيش بس، قراية
 12في Flow ليلة على الغرف بتغيرّ وتصميمA27 موافقة ومحتاج كاقتراح، اتكتب

---

**p. 194**

.)room-nights( "Save 63 changes" Q-04-05 سطور· بيعد الهيدر Review changes"( والـ3 بيقولBulk)،
الـالاقتراح: زرار يبقىBulk room-nights" 63 بالسطورSave يفضل الهيدر في والعدّاد ،
Q-04-06 1"· · published فيNot 04.1 معUI متسق مش published" not changes على3 (التلاتة 24 وSep 26،
 - 27 وSep 24، - 30 .)Sep BR-04-110 يتأكد ولازم الليالي، بعدد عرّفه
.Q-04W-02 line list Win a Apply · إند:Q-04-07 ويك على شوف
status Night · جوهQ-04-08 prices بعد:Change فيApply" 04.4 منOV اتفتح اللي prices فورًاChange بتتحفظ الحالة ،
مع nights"ولا N فورًاSave (الاقتراح: ؟
 Q-04-09 :Blockers·  04.R بيحطREF بعدHOTELIANA_PAUSED ←CONTRACT_EXPIRED العقد ← (الوصول
 الـHoteliana الأولbaseline). بيحطوه كانوا القديم والتلخيص علىBR-04-98 ماشي 04.R (الـREF بيكسبREF
Supplements · الأطفالQ-04-10  ( 04.5E OV : 5 - 0 11،Child - 6 الـChild في موجودة سؤالPopup) الأطفال تسعير إن مع ،
الأطفالC9مفتوح وعدسة decision" الـPending في تتبني دي الحقول هل ؟MVP.
التصميم): في تتصلح (لازم والقواعد الشاشات بين تعارضات
. Q-04-11 ·  04.1E (عقدUI التولبار)Ended راسم لسه rates" وBulk cells وSelect key يشيلColour لازم التصميم
.)A9 الـ التعديل. مخفيةspecأدوات بيقول ده
Night-level stop sell only · the contract itself has sale Stop · العقدQ-04-12 مستوى على   03.R REF 2 بيقولstep
status" sell لكنno 04.R. REF 1 بيقولRule night" the outranks sell stop وContract inventory.stop_sell،
 contract"بيقول whole the وor 03، فيهFlow 03.0D OV كله. العقد بيع لإيقاف قرار: فيهلازم sale لوStop لأ؟ ولا العقد على
 تعرض لازم الشبكة Bannerفيه، contract" whole the on stopped is مقفولة.Sale الخلايا وكل
Booking window closed )120 days(" window Booking · وQ-04-13 :MaxLOS  10.5 وUI 10.4 بيعرضواOV
"No 21"و Max · MaxLOS / بينماMinLOS 04.R، بيقولREF window الـBooking في مش MVP وC8( 03.R)، بيقولREF
.MVP stay" غيرmaximum من القيود قرر والعميل window، Booking شاشاتBlockersالـ. من تتشال لازم دي 10 الـFlow في
"The ﬁrst step that fails decides the answer; later Engine · لأ؟Q-04-14 ولا خطأ أول عند بيقف   03.R بيقولREF
"A run." never بينماsteps 10.4 بيقولOV evaluated" is condition every - nothing at stops وIt 04.R، بيقولREF
 both" reports checks two fails that night هنا:. المعتمد الـالفهم الـengine كل بيحسب الحجزBlockers وقرار للتشخيص،
. REF في كده يتكتب لازم أولهم. 03.Rبياخد
. Q-04-15 ·  04.R بيقولREF 04.12" OV in live severities conflict بسthe 04.12، هوOV دلوقتي key محركColour
كل في التداخل بقواعد واتبدل اتلغى (غالبًا فين يتحدد لازم حالية. شاشة مالوش الخطورة بدرجات .)Popupالتعارضات
Change prices · October Q-04-16 ·  04.6F مرتينOV مستعمل price ﬁxed · breakdown وPool ·،
Pool only وFridays 04.1V). UI published( وJust 04.1V) OV saving( before ﬁx · rates Bulk الكود. نفس الاقتراح)
. OV 04.1X  ← Bulk ﬁxed ←  04.6PF وOV ﬁx،
OV Q-04-17 · 04.5" اتلغى":OV الـ فيSection 12 بيقولFlow states" its and 04.5 OV بسreplaces 04.5E/ES/EW،
. منsupplements( مستعملين لسه night") this for الـEdit جوهspec. فرعية كخطوة بيعاملهم ده prices محتاجينChange
.) OV (مثلاً تاني 04.6S/SS/SWيتسموا
Add at Q-04-18 :Bulk· Add." then days, the choose To, and From pick - yet added dates وNo
."Pick Add." press then To, and From pick - range date one عنleast بيتكلموا بقىFrom/To المنتقي إن مع nights"،
"No dates added yet - pick nights, then Add." الاقتراح
Contract pool · 50 Q-04-19 ·  04.1U بيقول:UI الشريط night" a 40 pool shared · بتقولAllotment والشبكة rooms،
. overbooking" +2 · night يتصلحa لازم واحد رقم

---

**p. 195**

 Q-04-20 ·  و04.6K/L fixed( · )Pool 04.6F عقدOV في Fixed Noor Al 30( = بيعرضواPool 50") of left و2
.30. rooms" 50 these from sells line المفروضEvery
 Q-04-21 ·  04.2D بيعرضOV لـDelete sale علىStop 18 - 19 (النهاردهSep فاتت ليالي وهي 20 .)Sep بيمنعBR-04-73
الفاتت الفترات مسح
Sun - Label · Q-04-22 Wed" - Sat · فيWeekdays إندBulk الويك (لو العقد إند ويك من يتولد لازم ثابت. Sat يبقىFri,
.(Thu"
) Q-04-23 · hotel" this on contract every to بيعرضApply Block" "Ramadan Scheduled( إن متأكدين العقود. ضمن
 sale (الـStop مقصود؟ مابدأش لسه عقد على بيسمحspec
behalf on Hoteliana · الـ:Q-04-24 نفس على الأدمن من ولا المورد، بحساب بيدخل الموظف يفرّقDraft لازم السجل ؟
. hoteliana_user

---

**p. 196**

