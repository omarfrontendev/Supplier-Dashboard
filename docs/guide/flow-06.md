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

# Flow 06 · Change requests

requests Change 06: (Flow طلبات )التغيير
1 الهدف. والنطاق
 موجود: ده الفلو ليه الرئيسي الضيف اسم زي تجارية مش حاجة يغيرّ أو منه) جزء أو (كله يلغيه يطلب ممكن الوكيل يتأكد، الحجز ما بعد
Hoteliana ( للمورد الطلب بتوصّل مباشرة المورد بيكلم ما عمره والمورد:الوكيل )،
  الإلغاءفي هو بيقرره اللي السياسة). في ده الحق اشترى (الوكيل يرفض مايقدرش ياخد: إيه أقل،قد أو كامل، بيه: بتسمح السياسة اللي من
بسبب. يعفي أو
:  فلوس.التعديلفي ولا غرفة مابيحرّكش التعديل بسبب. يرفض أو يوافق
النطاق ):MVPجوه
 /06.0B  / 06.0A ( All · Cancellations · Amendments · Waiting on the agent · Handled 06.0الطابور بالتاباتUI
.OV 06.0C /  والفلتر06.0D 06.11)، والبحثOV 06.12، والـOV Export،  06.13 الصفOV وأوامر 06.14،
. UI كله الحجز 06.1إلغاء الحجزUI من غرف إلغاء 06.7، الإقامةUI تقصير 06.8،
.06.1B3  / 06.1B2  / OV كامل السعر: 06.1Cقرار أقلOV 06.1A، بسببOV إعفاء 06.1B،
 ← 06.2النتايج UI pending( 06.2W)،Charge UI 06.2X)،Waived( فيUI رد (مفيش 24 اتطبقت).h السياسة
التجاري غير 06.10التعديل UI ←  اتراجعت06.10B (الهوية 06.4 UI الرفضApproved( 06.3B)؛ OV ←  06.6 ؛UI
.UI 06.6X  ← h في رد 48مفيش
في بس للمعلومة بيظهر المجانية: الفترة جوه .Handledالإلغاء
النطاق: برا
. التجاري التعديل الـ في مش السعر): بتغيرّ جنسية إشغال، وجبة، غرفة، (تواريخ، جديد.MVP من ويحجز بيلغي الوكيل
: الديزاين.التمديد من اتشالت التمديد طلبات تغيير). طلب (مش الوكيل من جديد حجز
موجود. هيبقى ومش موجود مش نفسه: الإلغاء رفض
).Report an (شوف ممنوع إلغاء: يبدأ issueالمورد
في التسوية: بعد الفلوس على 07(الاعتراض )Flow هنا.Finance مش ،
).11 agentتاب the on الـWaiting في فلو مفيش بس الديزاين في موجود (شوفMVP" حاجة فيه بيحط
بيستخدمه: مين
الأدوار الغرضالمفتاحالجاهزة
bookings.view_operational الطابورأو يشوف
bookings.view_financial صفحة شرط نفس (مقترح:
(Bookings
،
Auditor
(السقف، المبالغ يشوف
الـ )write-offالمبلغ،
bookings.view_financial،
Auditor (optional)
والهوية الضيف اسم يشوف
الوكيل وسبب والجنسية
guest.pii،
Front ofﬁce
bookings.cancellationReservations الكامل بالمبلغ إلغاء يأكد

---

**p. 232**

الأدوار الغرضالمفتاحالجاهزة
أو السياسة من أقل ياخد
يعفي
+ bookings.cancellation
bookings.charge_override
Admin
bookings.amendment +  guest.pii الأسماء غير من تعديل(مقترح: يرفض أو يوافق
يراجع مايقدرش والهوية
Reservations
الدخول نقاط
بيوصل على منفين فين
لينك/تابBookingsصفحة N: · requests Change الصفحة عنوان جنب إزاي" مرسوم مش — (مقترح
الـ من للطابور )navبيوصل
All 06.0 تابUI
UI 06.0" 05.0 العكسي)UI (الاتجاه bookingsزرار هيدرAll في
"Cancellation to priceالداشبورد
( awaiting_charge = state · cancellation = المفتاحtype ،
( bookings.cancellation
UI 06.0A
"Amendments to decideالداشبورد
( awaiting_supplier = state · amendment = المفتاحtype ،
( bookings.amendment
UI 06.0B
 الطلب 06.1صفحة /  /06.7 askedإشعار "Amendment / asked" "Cancellation إيميلin-app( أو
06.8 /  على06.10 بتفتح اتقفل، لو )؛
النتيجة
"Amendment asked" ← "Review" الطلب قايمةصفحة في عليهBookingsصف asked أوCancellation
Cancellation asked · respond by tomorrow 09:40" بانر مفتوح: طلب عليها مؤكد حجز +صفحة
request the Review (مقترح)"
الطلب صفحة
الطلب linkصفحة Deep  change-requests/}booking_ref{/}request_id{ (مقترح)
2 قواعد. البيزنس
عام
". منBR-06-01 بيوصل طلب كل بتقولHoteliana الصفحة 09:40. today · Hoteliana · by on علىPassed مابيردش المورد
 بتبلّغهHotelianaالوكيل؛ اللي هي
Cancellation · الـBR-06-02 في الطلب أنواع partial · Cancellation / booking whole the · Cancellation (غرفMVP:
.Not supported" )§6(. (لياليshortened non-commercial · تانيAmendment نوع أي
 المبالغBR-06-03 وكل مكة، بتوقيت الأوقات كل كسورSAR غير ومن الضريبة شاملة
التعديلBR-06-04 مرجع: ليه طلب كل الديزاينAMD-NNN (زي حجز لكل والإلغاءAMD-001 CXL-NNN")، .(مقترح
. BR-06-05 الوقت نفس في الحجز على بس واحد مفتوح طلب لوحده(مقترح) بيتقفل التعديل مفتوح، تعديل وفيه وصل كامل إلغاء لو
."Withdrawn · the booking is being cancelled"
الإلغاء

---

**p. 233**

Cancelled inside BR-06-06 ونهائي فوري المجانية الفترة جوه تابالإلغاء في بيظهر للمورد. طلب ومابيعملش بسHandled،
". settled · nothing charged You · window free فورًاthe بترجع الغرف
 علىBR-06-07 (أو المجانية الفترة بعد الإلغاء Non-refundable = ومهلتهطلب) للمورد، ساعة24 الطلب وقت من
).BR-06-19. h 24 + asked_at = شوفrespond_by القريب، الوصول حالة (مع
" BR-06-08 الإلغاء. يرفض مايقدرش زرارالمورد مفيش مكانRefuse أي في
BR-06-09 الـ)Ceilingالسقف في ويتحسب بيه، بتسمح السياسة مبلغ أقصى = backend من اللقطة في المحفوظة السياسة
. v1.2"( contract · 2026 September 2 on locked Policy على بس")، الملغي العقدالجزء في تعديل أي مابيحسبش. الفرونت
للحجز مابيوصلش البيع بعد
Sep · 00:00 · المجانيةBR-06-10 الفترة بيتعرض: السياسة لاين تايم 2 - 9 cancellation free · الموعدSeptember 10")،
"). deadline ودلوقتيthe charge")، stay full · 09:40 · now بتظهر شريحة كل شريحة، من أكتر فيها السياسة لو
 قراراتBR-06-11 ثلاث
 .1. SAR" X full the "Charge ( 06.1C والـOV السقف، = المبلغ 0): = الافتراضيwrite-off ده
 .2. less" "Charge ( 06.1A والفرقOV المبلغ، يكتب المورد اختياريwrite-off): السبب
 .3Guest emergency · Hotel's own nothing" charge - it "Waive ( 06.1B المبلغOV 0): إجباري، ثابتةالسبب قايمة من
. Other · re-sold was Room · relationship agent the Keeping · اختياريةerror الملاحظة
. less "Charge وBR-06-12 Waive" خالص" مالوشمابيترسموش المستخدم لو مكانهمbookings.charge_override
".Only the Owner or an Admin can charge less or waive a chargeسطر
 ← less "Charge منBR-06-13 بياخد (السقف1" لحد 1 كـ(مقترح)) يتعامل ← السقف = المبلغ كتب لو كتبFull. لو رسالة0.
سبب لازم الإعفاء (عشان للإعفاء توجّهه
" BR-06-14 السقف متسجل يظهريفضل الفرق أقل؛ أخد لو حتى الحجز على off بيتسجلwritten الإعفاء وبيتعدGoodwill".
 التقارير. في تانيبالسبب حجز أي على بيسري ولا العقد في السياسة مابيغيرش ده القرار
% ← BR-06-15 الوكيل على بيتطبق المورد قرار النسبة بنفس BK-5( الوكيلBookings رسوم ← إعفاء تخفيض0): الوكيلx؛ رسوم
 Hotelianaتنزل x%. المورد معفاة. رسوم على هامش ماتاخدش الوكيلمابيشوفش مبلغ
لحدBR-06-16 رد مفيش لو respond_by النظام كامل: السقف يطبّق policy"( · ترجع.Auto-applied والغرف يتلغي، والحجز ")،
."System · deadline reachedالسجل
24 instead issue an "Report BR-06-17 التبليغ عدّى). تاريخ غلط، (حجز غلط شكله نفسه الإلغاء لو متاح الـمابيوقفش" عدّاد
  Hoteliana؛(مقترح)ساعة غلط فعلاً الإلغاء لو الطلب تسحب اللي هي
the next settlement" BR-06-18 الحجزالفلوس: على بيتسجل المبلغ لحد. فاتورة مابيعملش المورد pending ويدخلCharge
" الـrun شهر في الإلغاء رسوم بيشيل الشهري الكشف check-out". للحجز الأصلي الدفع(مقترح) شرط لو booking. والموردOn
الجاية الدفعة من بيتخصم المورد على مستحق مبلغ بيبقى والرسوم المدفوع بين الفرق كده، قبل اتدفعله
 منBR-06-19 أقرب الوصول لو الطلب:24 وقت من ساعة
12:00( date check-in h, 24 + min)asked_at = respond_by تتباع(مقترح) وتلحق ترجع الغرفة عشان ،
الإقامة وتقصير جزئي إلغاء
": Partial (غرف):BR-06-20 الباقية الغرف are they as exactly الغرفstay على السقف والتسوية. والسياسة السعر نفس
 8,600الملغية the of 3,440 to يفضلUp الحجز ويتكتبConﬁrmed"). v2 الغرف تأكيد أرقام الباقية. بالغرف
بتبقى .Voidالملغية
." Shortened (لياليBR-06-21  amendment" an not nights, two last the of cancellation a is اللياليThis على السقف
. الـ بس. اتشالت بيتغيرcheck-outاللي September 23 Wednesday → September 25 والحجزFriday v2")، التأكيد رقم

---

**p. 234**

."Masar update يوصله والوكيل هو، ما زي يفضل neededللغرفة
BR-06-22 تكون لازم بتتشال اللي الليالي متصلة متأخر)، (وصول أولها من أو بدري) (مغادرة الإقامة آخر من النص من مش .(مقترح)
ماتتشالش الماضي) (في عدّت ليلة
."A longer stay is a new booking, never an amendment" BR-06-23 التمديد تغيير طلب بيبقى ما :عمره
بترجع اللي الغرف
BR-06-24 للـ بترجع الغرف الأوتوماتيك) التطبيق (أو الإلغاء تأكيد بعد Allotment ملغية ليلة كل على اللحظة نفس .في
 شروطBR-06-25 كل لو بس تتباع ترجع الليلة بس. المخزون رقم = الغرفة رجوع 04.R REF 1B بتتعرضRule ليلة كل متحققة.
" 0بحالتها → 1 again open · out sold was · free أوrooms 8" → 9 · again أوopen 1" stopped still · back أوroom
back · contract ended". "Inventory" release" inside · أوback started" already night · أوback rate" no · أوback
".and sellability are two different questions
)Amendmentالتعديل
Nothing about the: الـBR-06-26 في MVP التعديل بس تجاري الهويةغير رقم (ومعاه الرئيسي الضيف اسم تغيير فيه الديزاين
".stay, the rate, the policy or your rooms changes
 BR-06-27 المجانية الفترة بيقصرّ ولا ومابيجددش قيود، ولا سعر ولا إتاحة فحص أي مابيشغّلش التعديل
I checked that the new ID number 1081 4460 matches BR-06-28 الموافقة بيتغير، الهوية رقم لو بعلامةمشروطة
). agent's the not problem, hotel's the is check-in at ID wrong A Al-Harbi. ".Faisal ( 06.10 ←  غير06.10B من
".Tick the ID check to approve" زرار nameالعلامة new the سطرApprove ومعاه مايشتغلش
the name stays exactly المهلةBR-06-29 ساعة48 الطلب ← رد مفيش الطلب. وقت من هوExpired ما زي يفضل والحجز
.("as it was
 بتكتبBR-06-30 الموافقة (الجديدةv2 والقديمةLive Superseded والانتهاء الرفض نسخة). .مابيكتبوش بيتمسح،v1 ما عمره
 كانت اللي النسخة بيقروا اعتراض وأي وقتهاLiveوالتسوية
. ثابتةBR-06-31 قايمة من سبب لازم الرفض Other · Operational · Policy · mismatch معID (إجبارية اختيارية الملاحظة
".Declining an amendment is not declining the booking" Other .)(مقترح
.)AMD-002 جديدBR-06-32 طلب وده تاني، يطلب يقدر الوكيل الانتهاء، أو الرفض بعد
 BR-06-33 الجنسية تغيير تجاري غير تعديل مش يلغي الوكيل ← السعر) يغيرّ (ممكن جنسيات مجموعات فيه موسم جوه الإقامة لو
 .(مقترحويحجز
. الـBR-06-34 يوم لحد مسموح التعديل الساعةcheck-in 00:00 للمورد.(مقترح) مايوصلش الطلب كده بعد
الطابور
). you on "waiting الموردBR-06-35 من رد محتاجة اللي الطلبات = awaiting_charge" +  دهawaiting_supplier العدد
.) REF 11.R ( ده اختلفوا ولو الداشبورد، رقم نفس Bugهو
ماBR-06-36 لحد الرد بعد الطابور في يفضل الطلب settled is side money يروحthe بعدها اتلغى. الحجز لو حتى .Handled"،
 بيروحوا فلوس) (مفيش والتعديلات طولHandledالإعفاء على
UI 06.0" Handled منBR-06-37 مستخبي افتراضيًاAll 06.11 لوOV إلا requests) handled (الديزاينInclude متعلّم.
في شوفAllبيعرضه ).11،
Oldest ﬁrst / Newest. الافتراضيBR-06-38 الترتيب top"( the at sits longest waiting one )"the ﬁrst" الخياراتOldest
.Deadline - soonest ﬁrst low to high - stake at Money / (معﬁrst بسview_financial
الجدولBR-06-39 فوق الكروت you on waiting are requests N بـ مترتبة مهلة") ولحدأقرب 3، كروت .(مقترح

---

**p. 235**

URL. "The row menu never answers the request - it 20 الـBR-06-40 في والصفحة والترتيب والتاب والفلتر الصفحة، في صف
".only takes you to the place where you can
)Happy path( 3 الفلو. الأساسي
 كاملةالسيناريو: الرسوم ياخد والمورد المجانية، الفترة بعد كامل حجز إلغاء
. (نظام يوصل 1الطلب
.Sep 00:00 علىHoteliana إلغاء طلب تبعت الساعةHTL-88191 خلصت09:40 المجانية والفترة 10،
طلب يعمل السقفawaiting_chargeالنظام: ويحسب 1,420، وSAR 09:40، Sep 11 = الحجزrespond_by ويعلّم ،
).Conﬁrmed" asked" لسهCancellation (الحجز
 email(إشعار + )in-app action لأصحابrequires الفندقbookings.cancellation على
.Cancellation asked · CXL-001 → — · change_request.created  · hoteliana_userالسجل
. 2.) UI الطابور يفتح 06.0المستخدم
What agents want changed youيشوف on waiting والشرحN on"،
".Export" conﬁrmed already are that وbookings bookings…"، وAll
Cancel the whole booking · Yousef Rahman · HTL-88191 · Cancellation · ROOM · STAY · BOOKINGالكروت
VALUE · INCL. VAT 1,420 SAR · The free window closed at midnight - the policy lets you charge up to
."1,420 SAR · respond by tomorrow 09:40 · 20 h left" + "Review
REFERENCE | GUEST | WHAT THEY ASK | STAY | WHAT IT MEANS FOR YOU | RESPOND BY |الجدول
".Review"/"View
Hoteliana settles the money with the agent once you answer. A cancellation cannot be refused -الفوتر
…"only priced
 .3. UI 06.1  ← "Reviewيضغط
Hoteliana asked to cancel yetالهيدر charge No · conﬁrmed still is Booking · asked وCancellation this"،
…".You cannot refuse a وbooking cancellation"،
."SAR · the most the policy allows you الكبير 1,420الرقم
" BOOKING" THIS ONTO LOCKED POLICY لاين.THE بالتايم
Charge the full?" take" you do 1,420 the of much How · DECISION متعلّمYOUR (الافتراضي اختيارات بالتلات
.("1,420 SAR
FINANCIAL STATUS · No charge yet → Charge"
."WHO SETTLES IT · Hoteliana, with the agent
Respond by tomorrow 09:40 - 24 h from the request. If you do not answer, the full المهلة policyسطر
…"charge of 1,420 SAR applies automatically
You cannot refuse, but you can": DOES" CONFIRMING وWHAT والفلوس، بيعها، وحالة ليلة لكل هترجع اللي الغرف
."flag
.Rebooking"(" DETAILS" وBOOKING
" insteadالأزرار issue an وReport (ثانوي) cancellation" the (أساسيConﬁrm

---

**p. 236**

 .4. OV 06.1C  ← "Conﬁrm the cancellation" fullيسيب the ويضغطCharge
FINANCIAL STATUS"
."…Taking the full amount is the default, not a pending وCharge والتفاصيل، penalty"،
."Cancel" / "Conﬁrm at 1,420 SARالأزرار
. 5."Conﬁrm at 1,420 SARيضغط
لسهbackendالـ الطلب يتحقق: وawaiting_charge respond_by، < معاهnow والمستخدم ،
 السقف.bookings.cancellation = والمبلغ الفندق، على
 الطلب write_off=0(يحفظ: amount=1,420, )outcome=full, الحجزanswered النسخةCancelled؛ تتقفلv1؛
 Sep 10 on الماليةcancelled pending"؛ علىCharge ترجع الغرف و12"؛ 13 1B؛Sep Rule التأكيد أرقام ليلة؛ لكل يتقيّم
.Void
 منHotelianaيبلّغ يخرج الإشعار الوكيل)؛ مع (تسوّي you للكلNeeds
Cancellation asked → Answered · full 1,420 / · change_request.answered  · supplier_userالسجل
Deluxe Room · inventory.returned  · 0 booking.cancelled؛write-off · Cancelled → system؛Conﬁrmed
.City View · 12 Sep 0 → 1 · 13 Sep 8 → 9
THE" : UI على 06.2يروح
CLOSED · Nothing left 10:12 at all things, Three · HAPPENED وWHAT versions"، وBooking to"،
."Back to change requests" والأزرارdo issue"، an وReport
 .6You charged 1,420 SAR بعدين). (نظام، يروحالتسوية الطلب وتتسوى، الكشف تدخل الرسوم لما يبقىHandled والصف ·،
".settled
خريطة الأزرار
بعد الزرارالمكانبيفتحالحفظ
"All bookings"UI 05.0— 06.0هيدرUI
"Export"UI 06.13ملف 06.0هيدرOV
All / Cancellations /تابات
Amendments / Waiting on the agent /
Handled
UI 06.0/ 06.0C  / 06.0B  / 06.0A  / 06.0
06.0D
—
06.12— الفلاترOV "Search"شريط
Hotel" / "Type" / "Respond by" /"
""Sort
results" N · 06.11"Apply (أوOV واحد)popover لكل الفلاتر شريط
الطلب— مفتوحصفحة صف / "Review"كارت
النتيجة 06.2صفحة /  06.2W /  "View"Handledصف06.2X
(06.6X  / 06.6  / 06.4  /
—
06.14— ⋯صفOV
"Review the request"OV الطلب— 06.14صفحة
"Open the booking"OV 06.14Flow في— الحجز 05صفحة

---

**p. 237**

بعد الزرارالمكانبيفتحالحفظ
"See the policy that applies"OV 06.14THE على ومسكرول الطلب POLICYصفحة
BOOKING THIS ONTO LOCKED (مقترح)"
—
"Copy the reference"OV 06.14—Toast "Reference
"copied
Report an issue to Hoteliana" /"
""Report an issue instead
/ OV 06.14
الطلب صفحة
The cancellation looks 05.12 بنوعOV
wrong متختار (مقترح"
05.13 والطلبOV ،
مفتوح يفضل
"Back to change 06.0— الفلاترUI بنفس طلب صفحة requests"أي
Full" cancellation" the (والـConﬁrm
متختار
 /06.7  / 06.1
06.8
OV 06.1C 06.2 نسخةUI (أو
(§6
Charge" cancellation" the (والـConﬁrm
 متختارless
06.1AChargedصفحة نفسهمOV
less" (§6 #3)
Waive" cancellation" the (والـConﬁrm
متختار
06.2W 06.1BUI نفسهمOV
" ▾  Pick a reason"OV 06.1BOV 06.1B2OV 06.1B3
Conﬁrm at X SAR" / "Waive the"
"charge and cancel
النتيجة Overlaysالـ—صفحة
"Approve the new name"UI 06.10B (مفيش Overlay— الـ تأكيد، هوcheckbox
 التأكيد)
UI 06.4
"Decline the change"/ UI 06.10
06.10B
OV 06.3BUI 06.6
"Decline the change"OV 06.3B—UI 06.6
"Report an 05.13 05.12OV النتيجةOV issue"صفحات
)Alternative ﬂows( 4 الفلوهات. البديلة
bookings.charge_override — السياسةA1 من أقل ياخد — 06.1A يحتاج)OV
 .1."Conﬁrm the cancellation" يختار06.1في off written is rest the - amount the set you · less ويضغطCharge
. 06.1A OV : take" you do much خانةHow 2AMOUNT?"،
" VAT INCL. · CHARGE وتحتهاYOU booking" this on ceiling policy the - 1,420 and 0 لـBetween يتعدل (النص
1,419" and 1 شوفBetween .)11"،
 .3FINANCIAL STATUS Charge" بيكتب SARوهو 720 OFF WRITE وYOU لحظيًا، بيتحدثوا
".pending
 .4."WHY LESS THAN THE POLICY · OPTIONAL"
 .5."Conﬁrm at 700 المبلغ مع بيتغير SARالزرار
. write_off=720الحفظ amount=700, الحجزoutcome=reduced, ترجعCancelled. والغرف 6،
. 7THE MONEY · You charged 700 of زي صفحة 06.2النهاية: بسUI 700 pending Charge · charged وSAR the"،
).3# 6" off written SAR 720 · SAR مرسومة،1,420 (مش

---

**p. 238**

bookings.charge_override — يعفيA2 — 06.1B OV ←  06.1B2 ←  يحتاج)06.1B3
 .1."Conﬁrm the cancellation" bookingيختار the on recorded goodwill, · nothing charge - it ويضغطWaive
. 2Financial" : OV 06.1B
."Recorded as Goodwill · with your name and the time
 .3"Guest emergency) ← reason" a "Pick ← required" · it? waiving you are Why  القايمة▾ يفتح يختار06.1B2"
."Waived · Guest emergency · with your name and the time" ( والـ06.1B3 as)، يبقىRecorded
 .4.Note · optional" ("e.g. repeat agent, guest will rebook in October")"
 .5.Waive the charge and cancel" ← outcome=waived, amount=0, write_off=1,420, reason=guest_emergency"
 .6 06.2Wالنهاية يروحUI الطلب تتسوىHandled. فلوس (مفيش فورًا
)UI 06.7 — الحجزA3 من غرف إلغاء
 .1Cancel 2 of the 5 rooms · Cancellation · partial · 4 nights · 5 → 3 rooms · Up to 3,440 SAR on theالصف
".cancelled rooms only
 areالصفحة they as exactly stay rooms 3 other السقفThe .2"،
".rooms × 4 nights 2 على3,440
 .3" cancelled" 5 of 2 · غرفةRooms كل أوstays": ضيوفهاcancelled" بأسماء
 الـ بنفس قرارات التلات الملغيOverlaysنفس الجزء على والمبالغ .4،
. 5–20 يفضل الحجز الحفظ: بنسخةConﬁrmedبعد v2 أرقامهم3( الملغيين والغرفتين غرف)، وVoid 2، Rooms علىStandard ترجع
.Sep 23
 .6."rooms stay conﬁrmed and are still owed to you in full 3 نتيجة صفحة #4(النهاية: )§6 وفيهاpartial
)UI 06.8 — الإقامةA4 تقصير
 .1Leave two nights early, out on 23 Sep · Cancellation · shortened · 5 → 3 nights · Policy applies to the 2الصف
".removed nights only
 .2Check-out · Friday 25 September earlyالصفحة nights two leave to wants guest السقفThe ليلتين،1,760"، على
".Nights · rooms · 5 nights → 3 nights · 1 room
 .3".The money is on the removed nights only" + "New supplier payable: 2,640 for the three nights kept"
 .4 الحفظ بـv2بعد والليلتين3 ليالي، و23 والـ24 غرفة، فيهم ترجع الغرفةHCN على يفضل
. 5.shortened )§6 نتيجة صفحة #5(النهاية:
)UI 06.2X فيA5 رد مفيش — ساعة24
 .1 = الـrespond_byعند بيطبّقjob amount السقفoutcome=auto_applied,
. 2.Needs you (أوCancelledالحجز منv2 يخرج والإشعار ترجع، والغرف جزئي)، لو
. 3."in-app + email "No answer in 24 h - the policy was applied on HTL-88191إشعار
. 4cancelled on 11 Sep at 09:40 ·الصفحة
".Recorded by System · 11 Sep at 09:40 · deadline reached
 .5.Cancellation asked → Auto-applied · 1,420 · change_request.auto_applied  · systemالسجل
 — بس)A6 (معلومة المجانية الفترة جوه إلغاء

---

**p. 239**

 .1 الحجز ← الموعد قبل يلغي طلبCancelledالوكيل ومفيش ترجع، والغرف فورًا،
. 2HTL-88154 was cancelled inside the free window. No charge. 1 room is back infoإشعار اختياريemail؛in-app(
."on 2 - 3 Sep
 .3Handled: "Cancelled inside the free window · Handled · You charged nothing · settled · answered في 1الصف
).§11" (النصSep لـanswered" يتغير
 .4SAR 0" زيView" صفحة ← 06.2" بالعنوانUI answer to nothing was there - window free the inside وCancelled
.· free window" (§6 #6)
) 06.4  ← 06.10B  ← 06.10 — الاسمA7 تغيير على الموافقة
 .1Change the lead guest name · Amendment · non-commercial · No cost change · nothing to re-check ·الصف
".tomorrow 17:20 · 28 h left
 .2The agent wants" : UI 06.10
."to change the lead guest name
 .3WHAT YOU ARE OWED 1,120 → GUEST" LEAD MOVES": WHAT جديد،EXACTLY → قديم NUMBER جديد،ID → قديم
."1,120
 .4."… checkbox "I checked that the new ID number … matches" ANSWER" والـYOUR احتمالات، بالتلات
 .5."v2 "Not yet · exists only if you approve"
 .6" الـ nameيعلّم new the "Approve ← ( 06.10B ) يشتغلcheckbox
. 7 الـ ← Approvedيضغط الفاوتشرid_checked=true،AMD-001 تبلّغHoteliana،
الوكيل.
. 8ROOMS" : UI 06.4النهاية
The booking reads Faisal Al-Harbi
."everywhere
 .9lead_guest: Bader Al-Harbi → Faisal Al-Harbi · id: 1049 8823 · amendment.approved  · supplier_userالسجل
.v1 → v2 · id_checked=true · 4460 booking.version_created؛1081
) 06.6  ← OV 06.3B — الاسمA8 تغيير رفض
 .1Decline the change" ← OV 06.3B،"
…".Nothing on the booking moves
 .2."Note to Hoteliana · optional"
 .3What theملخص
…".Can it come back? · The agent can ask again
 Declined" AMD-001 ← change" the ومفيشDecline .4.v2،
 .5Declined" : UI 06.6النهاية
".by
 .6.Amendment asked → Declined · reason=id_mismatch · amendment.declined  · supplier_userالسجل
)UI 06.6X — ردA9 غير من انتهى التعديل
Closed by System · 11 Sep at 17:20 · hعند 48 + asked_at : Expired هو،AMD ما زي الحجز الوكيلHoteliana، تبلّغ
.amendment.expired  · system". reached السجلdeadline

---

**p. 240**

" instead issue an "Report — إلغاءA10 طلب على
 .1 06.1من / 06.7 / 06.8 ←  05.12 بنوعOV wrong looks cancellation The إجباري(مقترح)" والوصف
. 2."…-chip "Issue open · ISS.  والطلب تتفتح، القضية شغال والعدّاد مفتوح يظهريفضل الطلب صفحة في
. يروحHotelianaلو الطلب: سحبت ISS · Hoteliana by "Withdrawn يفضلHandled والحجز 3.Conﬁrmed-…"،
. 4 خلصت والمهلة ماسحبتش عاديA5لو
Export — والـA11 والفلترة البحث
." 06.12البحث OV : requests" handled and open across - agency or name guest صفحةReference, بتفتح النتايج
".Close", و panelالطلب، this behind ﬁlter the change not does وSearching
WHAT THE AGENT ASKED FOR )All types / Cancellation · the whole booking / : OV 06.11الفلتر
ASKED (Today / Yesterday and today / Last 7 days /
SHOW ("Only what is waiting on me" / "Include handled requests"). "Clear all" / "Cancel" /
" results N · لحظيًاApply بيتحدث (العدد
Export OV 06.13 : "The N requests in view" / "Every request still waiting on someone" / "Everything,الـ
Reference · Guest · Agency · What was asked · Type · Stay included PDF"؛handled / Excel / الأعمدةCSV ·؛
.Rooms · nights · Money at stake · Asked at · Your answer · Amount charged · Answered at · Financial status
The money columns show what you decided… They are not what Hoteliana has settled with the agent;السطر
."that lives in Finance
)Exception ﬂows( 5 الاستثناءات. والأخطاء
Overlay — الـE1 أو الصفحة فاتح وهو خلصت المهلة
. UI 06.2X لـ يتحول البانر 09:40الإلغاء: at applied was policy the - h 24 in answer تعملNo والصفحة وتبقىrefetch."
Overlay "Too late - the deadline passed at 09:40 and في كان وضغطOverlayلو request_closed الـ409 جوه ورسالة
".the full policy charge was applied. Your choice was not saved." + "See what happened
. UI 06.6X  ← ".This change expired at 17:20. The name stays Bader Al-Harbiالتعديل
 الملاحظة) السبب، (المبلغ، كتبه .مابيتحفظشاللي
 — الوقتE2 نفس في رد الفريق من تاني حد
Mariam Zaki already answered this request at 10:05 - charged 700 SAR." + "See the" : 409 already_answered
". قرارهresult على تعديل أي مفيش
Hoteliana) اتسحبE3 الطلب — أوWithdrawn الوكيل من
 conﬁrmed" stays booking The 11:20. at request this withdrew يروحHoteliana الصف تتشال. والأزرار بـHandled."
."Withdrawn"
 منE4 اتلغى الحجز — مفتوحHoteliana والطلب قضية) (بعد
This booking was cancelled by Hoteliana under ISS-2026-0184. There is nothing لوحده يتقفل toالطلب
".answer." + "Open the issue

---

**p. 241**

OV 06.1A — فيE5 الحدود برا المبلغ
 …"  السقف من SAR(أكبر )1,420 allows policy the than more charge cannot والزرارYou at." ومعاهConﬁrm مقفول
الرسالة.
.OV 06.1B" = :0 reason" a needs it - Waive use nothing, charge لينكTo + instead." لـWaive بيحوّل
.)Full يبقى الزرار السقف: SAR= 1,420 at والـConﬁrm 0" (يتسجلwrite-off
."Enter a whole amount in كسور فيه أو رقم مش أو SARفاضي
 — سببE6 غير من الإعفاء
" charge" the waive to reason a والزرارPick cancel." and charge the مايتبعتشWaive
 — الهويةE7 علامة غير من التعديل على الموافقة
 جنبه والسطر مايشتغلش approveالزرار to check ID the (مشTick بـDisabled." الطلب بعت حد لو شرح). غير من غيرAPI من
.422 id_check_requiredالعلامة
 — شغالE8 وهو اتسحبت الصلاحية
You" : OV 06.1A missing_permission 403 ←  11.15 اتسحبOV لو فيbookings.charge_override. وهو بس
can no longer charge less or waive. You can still conﬁrm the full 1,420 SAR." + "Conﬁrm at 1,420 SAR" /
.""Cancel
 — الحفظE9 وقت السيرفر / الشبكة فشل
." اتكتبOverlayالـ اللي بكل مفتوح يفضل again try - saved was Nothing Hoteliana. reach not الـCould بنفس والإعادة
.idempotency key
 الـ عدّت: المهلة وبعدين اتأخر الرد backendلو لو الطلب بيقبل قبلوصل respond_by الحَكَم هو السيرفر عند الاستلام (توقيت
 — مزدوجE10 ضغط
السجل في سطرين ومفيش ضغطة، أول من يتقفل الزرار
 — المخزونE11 تحديث فشل بس رجعت الغرف
Cancelled. Returning).  والفلوس الخلفيةيتسجلواالإلغاء في نفسه بيعيد المخزون وتحديث الأساس)، (هما تعرضretry الصفحة
minutes few a within show will they - usual than longer taking is calendar your to rooms the (مقترح)." مفيش.
 للإلغاءrollback
 — البيعE12 بعد اتنهى أو انتهى العقد
.)Rule 1B" الغرف عادي. endedالإلغاء contract · تتباعback ومابترجعش
 — خلصتE13 الجلسة
11.12 دهOV الوقت في عدّت المهلة لو المحلي. التخزين من يرجعوا والسبب والمبلغ والاختيار الطلب، لنفس يرجع الدخول بعد .E1؛
 — التحميلE14 فشل
."Back to change requests". againالطابور "Try + load." not could requests الشكلChange نفس الطلب: صفحة
 — بالغلطE15 وصل تجاري تعديل طلب

---

**p. 242**

Read only: "This change is not supported in the portal. Hoteliana will ask the agent to cancel andالصفحة
" منrebook يتقفل والطلب أزرار، غير من الطابورHoteliana." في supported. رمادي.Not
 منE16 اتغير الطلب — Hoteliana فاتحه وهو لتلاتة) غرفتين من (مثلاً
Hoteliana updated this request at 11:02 - it now cancels 3 rooms. Review it again."" : 409 request_replaced
Reload العدّاد جديد". من مايبدأش .(مقترح
 Export — كبيرE17 / فشل
Nothing قواعد )E19(نفس 05 Flow من أكتر 5,000: بالإيميل صف والفشل(مقترح) سطرToast، مع مقفول زرار والصفر to،
."export with this ﬁlter
6 حالات. مش موجودة في التصميم
السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة
يتبني عليها
قبل اتعمل طلب ولا (مفيش خالص فاضي 1الطابور
كده)
No change request needs you" + "When الجدول anمكان
agent asks to cancel or change a conﬁrmed booking,
." dashboard your on and here it passes الكروتHoteliana
مابتترسمش
UI 06.0C
الرد بعد طلبات فيه بس مستنياه حاجة 2مفيش
(Charge pending)
youالهيدر on waiting is مابتترسمش،Nothing والكروت "،
".View اللي الطلبات يعرض pendingوالجدول بزرارCharge
UI 06.0
3"Charge 06.2زي الهيدرUI ·: charged SAR 700 · lessنتيجةCancelled
SAR · recorded against the pending الرقمCharge 700"،
THE MONEY · You charged 700 of the 1,420
You charged 700 SAR ·
."Why less: {note or —}
UI 06.2
chargedالهيدر SAR 3,440 · cancelled rooms 2 · (غرفConﬁrmed جزئي إلغاء 4نتيجة
· Charge pending". "WHAT CAME BACK TO YOU": 20–23
WHAT STAYS": "3 rooms stay". ليلةSep كل 2 قسمrooms
conﬁrmed · 5,160 SAR still owed to you". "Booking
versions: v1 · 5 rooms · 8,600 → v2 · 3 rooms · 5,160
Open the booking" / "Back to change". الأزرارlive(
."requests
UI 06.2
SARالهيدر 1,760 · removed nights 2 · الإقامةConﬁrmed تقصير 5نتيجة
Sep "+1". "The 24 23 BACK": CAME "WHAT وcharged".
guest now checks out on Wednesday 23 September." v1
.→ v2
UI 06.2
6)Handled" to" nothing was there - window free the inside المجانيةCancelled الفترة جوه منViewإلغاء
WHAT CAME BACK TO
" قرارYOU قسم ومفيش الشكل، بنفس
UI 06.2
واحدة نقطة لاين 28التايم · booking from 7Non-refundableسياسةNon-refundable
The policy on this booking is non-refundable وAug -"،
." part cancelled the of نفسها100% الاختيارات
UI 06.1

---

**p. 243**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة
يتبني عليها
8  قبل واحدة ليلة (مثلاً بشرايح كامل7سياسة أيام،
يومين) قبل
" والنقطة الشرايح، كل فيه لاين الحالية،nowالتايم الشريحة على
The policy". منها 1والسقف SAR 790 · charge النصnight
."allows up to one night
UI 06.1
9) نسبة ثابتPERCENTالشريحة مبلغ أو
(AMOUNT)
of the cancelled part · 710 SAR" / "Fixed 500 SAR 50%"
."per room · 1,000 SAR
UI 06.1
10 الليالي بين مختلفة overrideالسياسة زيDate
)NRFرمضان
Sep · non-refundable · 790" / السقف تحت صغير 12جدول
" 0 · free · Sep السقف.13 هو والإجمالي
UI 06.8
11Stop stopped" still night · back room · 1 → 0 · SEP 12 +SAT عليها" رجعت اللي من saleليلة
Open the night in Rates & Availability if you want toالسطر
."sell it
UI 06.2
12cut- الـ جوه وهي رجعت الـReleaseليلة بعد أو
off
."back · inside release, not bookable"UI 06.2
وهو بدري (مغادرة دخل الضيف ما بعد 13In-الإلغاء
(house
The العنوان بترجع. ولا مابتتشالش عدّت اللي guestالليالي
". Sep 23 on leave to wants and Sep 20 on in اللياليchecked
بس المستقبلية هي بترجع اللي
UI 06.8
14 المهلة isسطر check-in - 12:00 today by منRespond أقرب ساعة24الوصول
.danger." h 24 than less have you so والعدّادtomorrow,
UI 06.1
06.0 والعدّادUI leftالكارت m 35 · 15:40 today by "respond ساعة".danger: من أقل 15المهلة
مالوش 16مستخدم
bookings.charge_override
(Reservations)
Charge the full" DECISIONفي متعلّمYOUR بس واحد خيار
Only the Owner or an Admin SAR والسطر1,420 can"،
You conﬁrm." charge a waive or less يبقىcharge العنوان
."the full 1,420 SAR
UI 06.1
مالوش 17مستخدم
Front) bookings.cancellation
(ofﬁce / Finance / Auditor
Only the Owner, an Admin or. onlyالصفحة الأزرارRead مكان
Reservations can answer this cancellation. If nobody
answers by tomorrow 09:40, the full policy charge
applies." Auditor: "You are an Auditor - change requests
".are read-only for you
UI 06.1
عنده 18مستخدم
 ومالوشbookings.cancellation
 (دورbookings.view_financial
مخصص
You need المبالغ يشوف ما غير من يسعّر ﬁnancialمايقدرش
." Admin an Ask cancellation. this price to ومفيشaccess
 .(مقترحأزرار
UI 06.1
مالوش 19مستخدم
 (عرض)bookings.view_financial
Policy" YOUعمود FOR MEANS IT بسWHAT النوع بيعرض
" rooms 2 to مبالغ؛applies غير من stake") at فيMoney مش
الـ في مش الفلوس أعمدة .Exportالترتيب؛
UI 06.0
hiddenالجدول الطلبGuest صفحة في &"؛ مالوشGUESTS 20guest.piiمستخدم
" ويبقىREASON يتشال مايكونشREASON" الوكيل (سبب بس
You need).  كله يتشال فيه، لو — أسماء التعديل(مقترح)فيه في
." change name a check to access أزرار.guest ومفيش
UI 06.10
وcheckboxالـ مابيظهرش، · 8823 1049 NUMBER إملاءID (تصحيح نفسه الهوية ورقم الاسم 21تعديل
" name new the "Approve طول.unchanged". على شغال
UI 06.10

---

**p. 244**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة
يتبني عليها
أو خاص طلب أو الرئيسي غير ضيف اسم 22تعديل
تجاري) (غير وصول وقت
" قالب 06.10نفس : MOVES" WHAT القديمEXACTLY بالحقل
checkbox. 0والجديد، change cost no · والـSAR 48"، مفيشh
 بتتغير الهوية لو إلا .(مقترح)هوية
UI 06.10
" جنسيات: مجموعات فيه موسم جوه الإقامة الضيف،لو جنسية تغيير 23طلب
A nationality change can change the price. Hoteliana will
." rebook and cancel to agent the قالبask المواسم: برا لو
06.10 عادي .(مقترح
UI 06.10
06.6 رماديUI supportedصف صفحةNot + )E15(" only إشغال.Read / وجبة / غرفة / (تواريخ تجاري 24طلب
بـHandled )Neutral( Hoteliana" by والصفحةWithdrawn الرد، قبل اتسحب 25الطلب
Hoteliana withdrew this request at 11:20. The booking"
".stays conﬁrmed
UI 06.6X
نفس على مفتوح تعديل وفيه وصل كامل 26إلغاء
الحجز
يتقفل cancelledالتعديل being is booking the · "،Withdrawn
عادي. يتعرض والإلغاء
UI 06.6X
وtaskالـ فورًا، بيتشالوا رقمها بتوع والتذكير M of علىN يتحسب رقمها" كان الملغية والغرفة غرف 27Pendingإلغاء
الباقية. الغرف
UI 05.11C
06.2 لـUI الحجز بيحوّل جزئي إلغاء واحدة.Cancelledآخر واحدة الغرف كل 28إلغاء
of" instead Sep 22 on - late nights two arrives guest متأخرThe (وصول الإقامة أول من 29تقصير
 Sep والـ20 بيتغيرcheck-in."
UI 06.8
30" دفع بشرط bookingحجز للموردOn واتدفع
كده قبل
THE MONEY": "You were paid 1,420 on 2 Sep. Keepingفي
700 means 720 is owed back and is taken from your next
".payment
UI 06.2
 وسطر (اللقطة)، فعلاً اتدفع اللي السعر على محسوب جنسيةGCCالسقف بسعر 31حجز
" used price التفاصيل.nationals في
UI 06.1
Octالصف 16 · settled · SAR 1,420 charged اتسوّت"،You 32)Handledالرسوم
"See it in )Success(و Paid" · status وFinancial Finance،
 للكشف .(مقترح)لينك
UI 06.0D
33"Waiting on the  الـ في دايمًا المرسومMVPفاضي بالنص the on waiting is agentتابNothing
".agent
UI 06.0C
34"Only what is waiting on pendingبيخفي وCharge agent the on الـWaiting meفلترchips".
بتتحدث.
OV 06.11
in" looks also "Search + "88199"" matches request مالقاشNo 35البحث
".handled requests
OV 06.12
36 06.0 والجدولSkeletonUI للكروت مرةLoading أول
37" 06.14 السياسةOV قسم على الطلب صفحة applies"يفتح that policy the الصفSee من
38)Deep 11.5 11.5UI تفصيلة.UI أي غير من النطاق برا فندق على linkطلب
39 عدّىHoteliana الحجز ما بعد إلغاء طلبت
 فاتcheck-out(
Not supported - the بالغلط وصل لو كطلب. stayمايوصلش
."has ended. Contact Hoteliana through Finance
UI 06.6

---

**p. 245**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة
يتبني عليها
40) الإشعار status(جنب )delivery bounced" … to والتنبيهEmail رجع، إلغاءbouncedالإيميل لطلب
The cancellation alert for HTL-88191 did الطابور notفي
."reach mariam@… by email
UI 11.0
)State machine( 7 الحالات.
)Cancellation الإلغاء طلب requestأ)
BadgeمنلـTrigger / الحالةالمفتاحلون
Cancellation
asked
awaiting_chargeCancellation asked" ·"
Warning
الفترة بعد طلب
المجانية
Answered /
Auto-applied /
Withdrawn
 عندsystemالمورد
 /respond_by
Hoteliana
Answered ·
full
answered_fullCharge pending" ·"
Warning
(التسويةFinance الموردSettled قرار
Answered ·
reduced
answered_reducedCharge pending" ·"
Warning
الموردSettledFinance قرار
WaivedwaivedHandled" · Neutral +"
""Waived · {reason}
(نهائي)— المورد— قرار
Auto-appliedauto_appliedCharge pending" ·"
Warning + "Auto-
"applied · policy
systemSettledFinance
SettledsettledHandled" · Neutral"
Paid" ·(المالية
(Success
التسوية——
WithdrawnwithdrawnHandled" · Neutral +"
""Withdrawn
/Hoteliana
الوكيل
——
Free windowfree_windowHandled" · ألغى Neutral"الوكيل
الموعد قبل
——
الطلب على المالية ب)  no_charge_yet yet"( charge )"No →  charge_pending pending"( )"Charge →  ("paid ،
أوSuccess no_charge)؛ waived"( · charge الـNo فيbadges"). مش دي 00.S شوفREF .11،
الإلغاء بسبب الحجز ج)
.Conﬁrmed )+ tag "Cancellation asked"( → Cancelled )Danger(كامل
تقصير أو )v2(جزئي Conﬁrmed → بتتعلّم.Conﬁrmed الملغية والغرف/الليالي ،
التعديل طلب )Amendmentد)

---

**p. 246**

BadgeمنلـTrigger / الحالةالمفتاحلون
Amendment
asked
awaiting_supplierAmendment"
asked" · Warning
HotelianaApproved / Declined /
Expired / Withdrawn
systemالمورد
h / 48عند
Hoteliana
ApprovedapprovedApproved" ·"
Success
المورد——
DeclineddeclinedDeclined" · Danger"المورد——
ExpiredexpiredExpired" · Neutral"system——
WithdrawnwithdrawnHandled" · Neutral"Hoteliana——
تاب بتروح المقفولة التعديلات يفضلHandledكل نفسه الحجز (الديزاينConﬁrmed. كاتب06.4" الـAmended في ومش "،
(.glossary
. الحجز نسخ هـ) Live تقصيرv1 / جزئي إلغاء / تعديل (موافقة → Superseded وv1 Live الحاليةv2 النسخة بيقفل الكامل الإلغاء
". }date{ on بتتمسح.cancelled ما عمرها النسخ
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Search
( OV 06.12 )
2 الأقل على حروف اسم(مقترح) (جزئي)، المرجع لا؛
(مع والـguest.piiالضيف المفتوح في )؛
Handled
—
Hotel بس— النطاق ﬁlterلافنادق
Type amendment— / part / whole / ﬁlterلاAll
Asked days 7 Last / today and Yesterday / ﬁlterلاToday
/ Any time
—
خيارات؛4 stake at معMoney Orderلا"
 بسview_financial
—
"Include" / me" on waiting is what ShowلاOnly
"handled requests
—
) 06.1 ( من الافتراضي3واحد معLess/Waive؛Full؛ Decisionنعم
 بسcharge_override
—
Amount you
charge
( OV 06.1A )
صحيح 1؛SARرقم ≥ 1 − ceiling ≤ نعمamount
يتحول(مقترح) السقف = Full؛
You cannot charge more than the policy"
allows (1,420 SAR)." / "To charge nothing,
use Waive - it needs a reason." / "Enter a
".whole amount in SAR
Why less than the
policy
characters" 500 under note the 500أقصى."Keep حرف لا(مقترح)

---

**p. 247**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Waive reason
( OV 06.1B )
من :5واحد own Hotel's · emergency نعمGuest
error · Keeping the agent relationship ·
Room was re-sold · Other
".Pick a reason to waive the charge"
Waive  لولا، noteنعم
Other
(مقترح
 characters" 10 least at - why Hoteliana إجباري500–10".Tell لو حرف
ID check
( 06.10 )
رقم لو نعم
بيتغير الهوية
checkbox".Tick the ID check to approve"
Decline reason
( OV 06.3B )
decline" to reason a Other".Pick · Operational · Policy · mismatch نعمID
Decline  لولا، noteنعم
Other
(مقترح
 characters" 10 least at - why Hoteliana حرف500–10".Tell
Export scope /
format / columns
column" one least at 05زي."Pick 500؛Flow ≤ PDF صف نعم(مقترح)
9 الإشعارات. والإيميلات والسجل
سطر السجل old( · action · actionactor مينالقناة؟Requires الحدثيستلم
(→  new
طلب
إلغاء
جديد
(بعد
الفترة
المجانية)
أصحاب
bookings.cancellation
الفندق على
in-app +
email
:إجباري(
فيه
(deadline
due_at = hoteliana_user respond_byنعم،·
→ — · change_request.created
Cancellation asked · type, ceiling
تذكير
الإلغاء
4عند
ساعات
باقية
(مقترح)
+ نفسهمin-app
email
الـ (نفس
(thread
system نعم·
change_request.reminder
رد المورد
Full /)
Less /
(Waive
 supplier_user من——· يخرج youالإشعار للكلNeeds
· change_request.answered
Cancellation asked → Answered ·
outcome, amount, write_off, reason
الحجز
اتلغى
أصحاب
view_operational
supplier_user / system in-appلا·
Conﬁrmed · booking.cancelled
أوCancelled ؛
/ booking.rooms_cancelled
v1 · booking.nights_removed
→ v2

---

**p. 248**

سطر السجل old( · action · actionactor مينالقناة؟Requires الحدثيستلم
(→  new
الغرف
رجعت
———inventory.returned  · system
 · new → old night: لكلroom, (سطر
ليلة
أرقام
 تأكيد
اتلغت
———booking.hcn_voided  · system
Room N: value → void ·
السياسة
اتطبقت
أوتوماتيك
أصحاب
bookings.cancellation
in-app +
email
system لا·
change_request.auto_applied
Cancellation asked → Auto-applied ·
· amount
جوه إلغاء
الفترة
المجانية
أصحاب
view_operational
in-app
email)
اختياري
hoteliana_user / api لا·
Conﬁrmed · booking.cancelled
→ Cancelled · free_window
الرسوم
اتسوّت
system finance.viewأصحابin-appلا·
· change_request.settled
Charge pending → Paid
طلب
تعديل
جديد
أصحاب
bookings.amendment
in-app +
email
)إجباري(
نعم،
due_at = asked_at + 48 h
· hoteliana_user
→ — · amendment.created
Amendment asked · ﬁeld
تذكير
التعديل
24عند
ساعة
باقية
(مقترح)
نفسهمin-app
الـ (نفس
(thread
system ·  نعمamendment.reminder
التعديل
اتوافق
عليه
———· supplier_user
ﬁeld: old · amendment.approved
→ new · id_checked
التعديل
اترفض
———· supplier_user
reason, · amendment.declined
note
التعديل
انتهى
أصحاب
bookings.amendment
system ·  amendment.expired  in-appلا
Amendment asked → Expired
الطلب
اتسحب
hoteliana_user الطلبin-appلا· مستلمي نفس
change_request.withdrawn
Export———· supplier_user
· change_requests.exported
scope, format, rows, pii
.Flow 05 الحجز نفس على الأحداث أحداثthreadكل مع واحد
  الضيف اسم مافيهوش (لأصحاب(مقترح)الإيميل والسقف المهلة، النوع، المرجع، فيه بس).view_financial؛
 من youالخروج Needs لما بيحصل يتعمل يتقري.الأكشن الإشعار لما مش سحب)، أوتوماتيك، تطبيق (رد،

---

**p. 249**

)Acceptance criteria( 10 معايير. القبول
 .1SAR · the most 1,420 بسقفGiven المجانية الفترة بعد إلغاء طلب Owner،1,420 يفتحWhen 06.1 يشوفThen،UI
you allows policy والافتراضيthe اختيارات، والتلات SAR" 1,420 full the رفضCharge زرار أي ومفيش "،
 .2"Waive" مستخدمGiven غيرReservations (من الطلب،When)،charge_override نفس يفتح less "Charge وThen
." والسطر مرسومين، chargeمش a waive or less charge can Admin an or Owner the ظاهرOnly
. Owner اختارGiven ،When يضغط ،Then الحجز والماليةCancelled pending، 3"،Charge
 والصفحة ليلة، كل على ترجع 06.2والغرف منUI يخرج والطلب you، الكلNeeds عند
. 4You cannot charge more than the policy allows Owner فيGiven 06.1A يكتبWhen،OV يظهرThen،1,500
." SAR( 1,420 يأكد ومايقدرش
 .5." Owner فيGiven 06.1A يكتبWhen،OV يظهرThen،0 reason a needs it - Waive use nothing, charge ولينكTo
للإعفاء يحوّله
. 6 Owner كتبGiven When،700 يأكد، المسجلThen 720 السقفwrite-off والزرار1,420، الحجز، على يفضل
."Conﬁrm at 700 عليه مكتوب SARكان
. 7 Owner اختارGiven سبب،Waive غير من يضغطWhen ،Then ويظهر مايتبعتش الطلب
".Pick a reason to waive the charge"
 .8SAR · waived · Guest 0 Owner بسببGiven أعفى ،When يتم، الحفظ الصفحةThen 06.2W بـUI
 يروحemergency والطلب ماتتغيرشHandled"، العقد في والسياسة فورًا،
 .9Recorded by لحدGiven رد مفيش الـWhen،respond_by يشتغل،job والصفحةThen يتطبق، كامل السقف 06.2X بـUI
 reached deadline · وإشعارSystem يتبعتauto-applied"،
 .10Too late - the deadline passed at فاتحGiven المستخدم 06.1C عدّت،OV والمهلة يضغطWhen ،Then ياخد
".09:40 and the full policy charge was applied. Your choice was not saved
 .11Mariam Zaki already الطلب،Given نفس على مستخدمين When بـ يأكد الأول يضغط700 والتاني ،Then ياخد التاني
." SAR 700 charged - 10:05 at request this تغييرanswered ومفيش
 منGiven غرفتين إلغاء طلب 5 ليالي4( يفتحWhen)،430 06.7 السقفThen،UI مش3,440 الباقية8,600 والغرف .12،
عليها ."staysمكتوب
. 13 Given اتأكد، جزئي إلغاء فيWhen الحجز يفتح ،Then الحجز بنسخةConﬁrmed بـv2 الملغيين3 الغرفتين وأرقام غرف،
.Sep 23–20 وVoid على2، رجعت غرف
 منGiven إقامة تقصير لـ5 ليالي،3 When يتأكد، الـThen يبقىcheck-out 23 واللياليSep بس، ليلتين على والسقف .1422–20،
ماتتلمسش
. 15room back · night still عليهاGiven رجعت اللي من ليلة ،When يتم، الإلغاء تقولThen والصفحة يزيد المخزون
" مابتتباعشstopped والليلة
 .16You المجانية،Given الفترة جوه ألغى الوكيل الطابور،When يفتح المورد فيThen يظهر والإلغاء مستنيه، طلب مفيش بـHandled
nothing رجعتcharged والغرف "،
 .17Then "Approve the بيتغير،Given الهوية ورقم اسم تغيير طلب يفتحWhen المستخدم 06.10 الهوية،UI على يعلّم ما غير من
".Tick the ID check to approve" name وجنبهnew شغال مش
 ووافق،Given الهوية على علّم يتم،When الحفظ Live v2 الجديد،Then بالاسم Superseded ماv1 زي والسياسة والسعر الغرف .18،
."ID checked والصفحة 06.4هما، بـUI
. 19".Pick a reason to decline سبب،Given غير من التعديل رفض يضغطWhen ،Then يظهر

---

**p. 250**

 بسببGiven رفض ،When يتم، الحفظ يفضلThen الحجز ومفيشv1 القديم، بالاسم والطلبv2 .20،Declined،
. UI 06.6والصفحة
. 21. UI عليهGiven عدّى تعديل طلب ساعة،48 الـWhen يشتغل،job الطلبThen والصفحةExpired مايتغيرش، والحجز 06.6X،
 .22 عندهGiven مستخدم ومالوشbookings.amendment اسم،When،guest.pii تغيير طلب يفتح ولاThen الأسماء مايشوفش
." ويظهر changeالهوية name a check to access guest need أزرارYou ومفيش
. 23Only the Owner, an مستخدمGiven ،When إلغاء، طلب يفتح والسطرThen يرد، ومايقدرش والسياسة المبالغ يشوف
…" cancellation this answer can Reservations or ظاهرAdmin
 4 مفتوحة،Given طلبات يفتحWhen 06.0 الهيدرThen،UI 4 you on والكروتwaiting الداشبورد، كارت في نفسه والرقم .24"،
مهلة بأقرب مترتبة
. 25 فلترGiven requests handled متعلّم،Include مش تابWhen" يفتح ،Then الـ الطلبات ظاهرةHandled مش
 .26waiting on والرسومGiven عليه رد طلب ،When الطابور، على يبص فيThen ظاهر لسه الطلب فيAll (مش
يروحyou تتسوى الرسوم ولما .Handled")،
 .27Amount Export حاليGiven بفلتر طلبات،5 يصدّرWhen ،Then فيه الملف المورد5 قرار بتعرض الفلوس وأعمدة صفوف،
) الوكيلcharged مبلغ مش
 .28 مفتوح،Given إلغاء طلب يختارWhen المستخدم instead issue an ويبعت،Report مفتوحThen" يفضل والطلب تتفتح، القضية
" و شغال، openوالعدّاد "Issue الطلبchip على يظهر
. 29Hoteliana withdrew this request at Hoteliana فاتحه،Given والمستخدم الطلب سحبت زرار،When أي يضغط ياخدThen
.Handled." conﬁrmed stays booking The يروح11:20. والطلب
 .30 جنسيةGiven بسعر حجز على إلغاء طلب ،When الطلب، يفتح مشThen (اللقطة) بيه اتباع اللي السعر على محسوب السقف
الحالي السعر
11 أسئلة. مفتوحة
اقتراحي الوضعالمؤقت في #السؤالالمصادر
1"waiting on 06.0 الهيدرUI 2 you on فيهwaiting والجدول طلبات4" youعدد
HTL-88191 )20 إلغاء3مفتوحة بتعرض1 والكروت تعديل)،
 وh( h( )6 ومشHTL-88166 m( 40 h )2 الأقرب.HTL-88159
المفتوح كل = )،BR-06-35العدد
مهلة بأقرب ).BR-06-39والكروت
2All 06.0 بيعرضUI )Handled( فيHTL-88154 تابHandled،All في
Handled requests are hidden by 06.11و بيقولOV
".default
والتاب افتراضيًا، Handledمستخبي
مكانه. هو
مكتوب المجانية الفترة جوه 3الإلغاء
"answered 1 Sep"
: يبقى ·النص Sep 1 B-L9cancelled ردBookings ومفيش ونهائي فوري المجاني الإلغاء
".no answer needed
4UI 1,420الهيدر charged وSAR SAR" 0 ceiling علىPolicy في" 06.2Wأخطاء
اتعفى. حجز
SAR charged · 0الهيدر
والسقفWaived .1,420"،
5arrives" 06.6X  / UI 06.6
"on 22 September
.Sep leftover لـcopy يتصلح 29–27الإقامة.27؛
6"Charge لحد1 والـ1,419 0، = 06.1AWaive OV : 1,420" and 0 lessمدى".Between
بسبب

---

**p. 251**

اقتراحي الوضعالمؤقت في #السؤالالمصادر
الكشفDECISIONS in: out checked that bookings كشف؟for أنهي في الإلغاء 7رسوم
.check-out". month مالوشthe الإلغاء
 الـ للحجز؛check-outشهر الأصلي
 تأكيد .Financeمحتاج
من أقرب الوصول لو 824المهلة
ساعة
check-in h, 24 + مذكور.min)asked مش
.12:00) (BR-06-19)
9"Waiting on the لحد يتشال أو وفاضي، ظاهر الـيفضل في فلو ومفيش فاضي، حاجة.MVPمرسوم فيه بيحط agentتاب
.P2
10REF 00.S ·" فيBadgesWaived مش
Amendment
Non-
."No cost change
الـ من الأساسية glossaryالحالة
Pending / Handled /
Approved / Declined /
 والباقيExpired( منtags، نصية
للـ نضيفهم أو حالة، لون غير
 رسميًا.glossary
اسم غير التجاري غير التعديل 11أنواع
الرئيسي الضيف
: بس الاسم moduleالديزاين: الجنسية،Bookings الأسماء،
ملاحظات. الوصول، وقت الخاصة، الطلبات
الأسماء باقي + (مرسوم) الاسم
الوصول ووقت الخاصة والطلبات
تعديل مش الجنسية القالب؛ بنفس
السعر. على بتأثر لو
12 منbookings.amendment
guest.piiغير
 08.R مابيربطهمشREF دورReservations بس الاتنين، معاه
لأ ممكن مخصص
).20# الاتنين تتطلب 6الموافقة
13"Report an issue instead"
الـ عدّاد 24بيوقف ؟h
و شغال، العدّاد مذكور.Hotelianaلأ، مش
غلط. لو الطلب تسحب
06.2 UI : against" Finance, in handled are الفلوسDisputes على 14الاعتراض
the settlement". REF 09.R : "The portal has no
: REF 08.R: قرارdispute كاملD4". اعتراض مسار
the amount is held"." finance.dispute
."DECISIONS: "Disputing a line never holds the rest
07المرجع بسFlow لينك هنا ؛
 بين وR.09التعارض وR.08 لازمD4
.Flow في 07يتقفل
عنصر requestsمفيش الـChange في )Dashboard" nav الـTop من للطابور 15navالوصول
· Bookings · Rates & Availability · Property · Finance ·
.Team & Access)
Change requests ·تاب/لينك
.Bookings" هيدرN في
16Export" والـAgency" البحث في
( 06.13  / OV 06.12 )
.7 سؤاليتشال. 05نفس رقمFlow
17"88198 06.12 بحثOV
HTL-88191بيرجع
أوله. من جزئي بالمرجع الديزاين.البحث في غلط مثال

---

**p. 252**

