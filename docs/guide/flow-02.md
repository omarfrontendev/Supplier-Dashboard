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

# Flow 02 · Hotels & Access

Access & Hotels 02: (Flow الفنادق )والوصول
) الشاشات مصدر Section  523:3210 02( وشاشاتFlow في02.*)، 12 Flow ( وبتكسب3662:62744 الأحدث هي
02.2 وOV 02.2L، وUI 02.8، وUI 02.8H، وUI 02.8B، وUI 02.8B2، وUI 02.5B2، وOV 02.5C3، ،OV
 02.5D2و وOV 02.5E2، وOV later، · rooms New · 02.5 UI الشاشات:. بين الربط أوقاعدة حالة اسم في تغيير أي
والإشعارات). والداشبورد، الفندق، وبروفايل وفنادقي، والطلبات، (المكتبة، بتعرضه اللي الشاشات كل في يتطبق لازم هنا عمود أو مدة
القديمة. بالنسخة تفضل شاشة مفيش
1 الهدف. والنطاق
موجود ده الفلو ليه
توريد عقد يعمل مايقدرش 03المورد Flow الفندق لو إلا فندق، على ليلة أي يبيع ولا بيه) .)Linkedمربوط
. ملك الرسمية والغرف هيHotelianaالفنادق proﬁle". Hotelian بطلب،Ofﬁcial بتتطلب ناقصة حاجة وأي فيها، مابيعدّلش المورد
 بتقرر.Hotelianaو اللي هي
 بيغطي ده حاجات:5الفلو
. 1): الفنادق Libraryمكتبة Hotel أكتر أو لفندق وصول وطلب سريعة، ونظرة وفلترة، وبحث، تصفح،
. 2) لـRequestsالطلبات بعته المورد اللي لكل واحدة قايمة ودرجHoteliana): حالةDrawer، بكل تفاصيل
. 3): Hotelsفنادقي الغرفMy وكتالوج الفندق وبروفايل العقد، حالة حسب متقسمة المربوطة الفنادق
. مربوط لفندق ناقصة غرفة 4إضافة
. 5 (ويزارد المكتبة من ناقص فندق خطوات3إضافة
النطاق ):MVPجوه
Partly الطلب حالات بكل فوق، اللي وWaitingكل you، وNeeds وApproved، وLinked، وRejected، وWithdrawn، approved،
بس). الشركة (لطلبات
الطلب علىWithdrawسحب والرد الغرفة.Hoteliana)، طلب سؤال على والرد إرساله، وإعادة الفندق طلب وتصحيح ،
بحالاتها الصور وUploadingرفع وFailed، Retry، الصور. حقوق وتأكيد )،
) التكرار checkفحص وللغرفة.Duplicate للفندق
النطاق: برا
. الحق rightإثبات of التحقق:Proof ومكالمة الـ) بقرار اتلغوا فيPO 24 الفندق.Sep مع عقده مابيرفعش المورد
Read السياحة: رخصة المورد بيدخلها ما .عمره بيشوفهاHoteliana المورد الفندق. على توافق لما انتهائها وتاريخ الرخصة رقم بتضيف
).Row فيonly 02.2 وOV 02.2L UI 12( B،Flow
. الشركة: بيانات تغيير فيفورم بيتبني 01 للتفاصيلFlow ولينك الطلبات، قايمة في كصف بس بيظهر هنا
.Discard changes?". الناقص: الفندق لويزارد مسودة الـحفظ في مش MVP تأكيد = الخروج
بالجملة فنادق استيراد أو مباشرة، رسمي فندق بيانات الـExcelتعديل برا كلها مربوط: مش لفندق غرفة طلب أو .MVP)،
الـ من صلاحية شاشةOwnerطلب من (زرار allowed" موجودةNot الشاشة 11.7): نفسهUI الطلب بس .P2)،
(من والصلاحيات بيستخدمه 08.Rمين الدور):REF باسم مش بالمفتاح والفحص ،

---

**p. 73**

الأدوار الجاهزة الأكشنالمفتاحاللي
عندها المفتاح
السبعة الأدوار وغرف)hotels.viewكل (فنادق الطلبات وقايمة الفندق، وبروفايل وفنادقي، المكتبة، يشوف
 ناقص فندق أو ناقصة، غرفة يضيف أو لفندق، وصول علىيطلب مقترح الناقص (الفندق
المفتاح) الإرسالنفس ويعيد يصحح أو يرد، أو طلب، يسحب أو ،
وOwner hotels.request،Admin،
Revenue managerو
)Continue draft" وOwner (زرارcontracts.edit،Admin، فنادقي من عقد contract"يعمل supply أوCreate
Revenue managerو
وOwner صفوفusers.view،Admin، change"يشوف Company الطلبات في (مقترح)
Auditorو
مابيتديشOwner (والمفتاح bank.change بنكي حساب تغيير فيه صف تفاصيل (مقترح)يشوف
تاني لحد
معاهوش :hotels.requestاللي
  بس عادي، بتظهر اختيارCheckboxمفيشالمكتبة الكروت. على
Only the Owner, an Admin or a Revenue manager access"زرار سطرRequest ومكانه بيتشال، السريعة النظرة في
can request access."
 hotel"زرار missing وAdd room" missing المناسبةAdd بالصيغة السطر نفس ومكانهم بيتشالوا،
 زرار شرح.Disabledممنوع غير من
 :Auditorالـ أكشن أي ومايعملش حاجة، كل يشوف state_readonly ←  11.6 UI مباشر). أكشن لينك فتح لو
):Entry الدخول pointsنقط
يّبيود #منينعلى
1"Hotel Library" ← 02.1 أوUI مرة) (أول 02.7 بارUI تابProperty"التوب
علاقات عنده (مورد
2"Requests" ← 02.5 (أوUI 02.5A أولUI لو بار تابProperty"التوب
طلبات
3"My Hotels" ← 02.6 (أوUI 11.16 مفيشUI لو بار تابProperty"التوب
متقبل فندق
02.1 startedUI Getting ( 01.5 خطوةUI hotels")، your Choose الخطوة اسم 4(مقترح
5"Browse Hotel Library" ← UI 02.1 الجديدUI 11.19الحساب
6"View requests" 02.1 أوUI 02.5 11.16UI فاضيةUI (فنادقي Library" Hotel أوBrowse
7"Requests need you": 02.5?status=needs_you you"الداشبوردUI needs كارتWhat
8 فوق نفسه، الطلب بتاع 02.5الدرج أوUI اتاخد، القرار إيميل: أو تذكيرHotelianaإشعار أو سألت،
9"Open the request" ← "Hotel access not approved yet" : UI الطلب 10.5درج
10"Follow up" ← "Room is not mapped yet" : UI 10.5 10 (قضيةFlow
11"Hotel not in your list? Find it in the) العقد 03ويزارد القايمةFlow في مش الفندق لما
Library" Hotel (مقترح)
UI 02.1

---

**p. 74**

يّبيود #منينعلى
02.R1 الفندقOV بروفايل فوق العقد 03ويزارد الغرفFlow قسم في room") missing a Add missing? Room 12(مقترح
02.8 لينكUI found?"المكتبة: not زرارHotel أو hotel"، missing نتايجAdd غير من البحث أو 13،
link الـDeep شكل (مقترح مباشر :)URL  14،property/library
،property/library?hotel=HTL-1048و
وproperty/requests/ACC-04831و ،property/hotels/HTL-1048،
،property/hotels/HTL-1048/rooms/newو
property/library/new-hotel?step=1و
 فيه ولو نفسها، بيفتحDrawerالشاشة
الأم الصفحة فوق
2 قواعد. البيزنس
المكتبة
).Only hotels Hoteliana already works with appear here"(  BR-02-01 بتعرض المكتبة بسHotelianaفنادق الرسمية
) الهيدر في hotels"العدد بالفلتر128 بيتأثر ومش المكتبة، في النشطة الفنادق عدد هو
 BR-02-02 علاقة عن بتعبرّ واحدة حالة عليه فندق كارت كل دي بالفندق:الشركة
الليينفع تحت الحالةالشرطالحالة
؟يتختار
مفتوح—أيوه طلب ولا علاقة Availableمفيش
RequestedNeeds وصول طلب أوWaitingفيه
you
"View request" + "Sent }n{ days ago"لأ
Hotels"لأ My in نشطةOpen والعلاقة متقبل Linkedالوصول
…" "Reason: + }date{" from again "Request + المنعSee فترة جوه ولسه اترفض، طلب Rejectedآخر
decision"
لأ
Suspended paused"لأ contracts "All + why" العلاقةHoteliana"See وقفت
). BR-02-03 الرفض بعد المنع فترة القرار90 التصميم: (من القرار تاريخ من يوم 11 Sep ← Dec" 10 from again ديRequest
. عندSetting اسمهاHoteliana access_rerequest_after_days الاسم) الافتراضية(مقترح والقيمة الكارت90، ده التاريخ بعد
رماديAvailableيرجع سطر الاسم وتحت }date{"، on Rejected .(مقترح
الـBR-02-04 المتعدد: الاختيار حالتهاCheckbox اللي الكروت على بيظهر الأقصىAvailable الحد بس. المرة20 في فندق  .(مقترح)
). BR-02-05  التأكيد قبل بتتبعت حاجة مفيش conﬁrm"( you until sent is وأسماءnothing العدد، بيعرض تحت الاختيار شريط
."Request و selection"الفنادق، وClear access"،
 BR-02-06 ينجح. الإرسال ما بعد أو المكتبة، من خرج لو بيتمسح الصفحة. أو البحث أو الفلتر غيرّ لو محفوظ بيفضل الاختيار
 البحثBR-02-07 02.10 OV في بيدور كله) الرسمي الرسميالكتالوج الكود أو المدينة، أو العربي، أو الإنجليزي، بالاسم
( HTL-xxxx حرفين من بيبدأ البحث بس. المورد فنادق في مش مع(مقترح))، قدرهDebounce، ms300 .(مقترح
. الفلترBR-02-08 02.9 فيهOV مجموعات4) وCity وCountry، وCategory، relationship، وزرارYour العدد، اختيار كل جنب
). يطبّق ما قبل النتيجة بيقول hotels"التطبيق 64 · Apply بالفندق العلاقة مابيغيرّش الفلتر
 BR-02-09 المورد السرية: يشوف ما تاني.عمره مورد اسم مايذكرش كمان الرفض سبب طلبه. مين ولا الفندق، بيبيع تاني مين

---

**p. 75**

)Hotel الوصول accessطلب
BR-02-10 بيبقى فندق كل لوحده بمرجع لوحده طلب ( ACC-xxxxx واحد. تأكيد في اتبعتوا لو حتى لوحده، وبيتراجع )،
 BR-02-11 التأكيد 02.3 وOV واحد، لفندق 02.1B فيهOV لأكتر) 4 وبيتسجل عليهم، الموافقة هو نفسه التأكيد ثابتة. إقرارات
.)  الإقرار نص ونسخة والوقت والتاريخ المستخدم ack_version(مقترحباسم
. المتوقعةBR-02-12 المراجعة مدة 2 days working مكة بتوقيت للخميس الأحد من العمل أيام بس،(مقترح). للعرض رقم ده
عدّى لو أوتوماتيك حاجة أي بيعمل ومش
 BR-02-13 الفندق. نفس على الشركة لنفس مفتوح وصول طلب من أكتر فيه يبقى مينفعش
فيBR-02-14 يظهر الفندق اتقبل: لو Hotels بحالةMy contract" supply قبولNo غير من تتفتح. ده للفندق التوريد وعقود ،
عقد مفيش
BR-02-15 اترفض: لو مكتوب سبب فيه يكون الدرج.لازم في تنصيص علامتي بين وبيظهر ،
. السحبBR-02-16 الطلبWithdraw ما طول متاح أوWaiting) you وNeeds المراجعة، بيلغي السحب منع. فترة يقدرمالوش
طول على تاني الفندق نفس يطلب
الطلبات قايمة
لـBR-02-17 واحدة قايمة أنواع4 access Hotel ( وACC- hotel)، New ( وHOT- room)، New ( وROM- Company)،
.( CHG- ) change
ثابتBR-02-18 الترتيب you الانتظارNeeds في الأقدم وبعدها الأول،  الأول قرارًا الأحدث اتقرر، اللي وبعدها الأخير، للجزء .(مقترح
الـBR-02-19 فوق4 اللي كروت Hoteliana for وWaiting you، وNeeds وApproved، approved، Not بيفلتر) فيهم واحد كل
.)Row 5 حاجةالقايمة ومايعملش بيتداس الشاشة على عنصر مفيش عليه. يتداس لما
).the reference stays the same" BR-02-20 المرجع الإرسالمابيتغيرش إعادة أو التصحيح مع
: BR-02-21 approved" is it until data current your changes never decision بعدA غير مابتتغيرش الحالية المورد بيانات
القبول
 الـBR-02-22 في بتتكتب للطلب بتحصل حاجة كل والسحب.Timeline والقرار، والتصحيح، والرد، والسؤال، والمراجعة، الإرسال، بتاعه:
علىBR-02-23 الرد Hoteliana Hoteliana"( to للـReply بيتضاف وTimeline) Hoteliana، الرد إشعار. بيوصلها حالة مابيغيرش
 لوحدهالطلب
BR-02-24 you" Needs عليه عدّى أيام3 رد غير من الافتراضيةcorrection_reminder_after القيمة و3، Hoteliana،
 تذكير يتبعت فيها): ويظهرin-appبتتحكم وإيميل، تابDot على أحمر كلRequests" بيتكرر التذكير النوع. تاب وعلى أيام،3 مرات3
بالكتير .(مقترح)
the 1-day clock is. الموردBR-02-25 عند الانتظار وقت you Needs ساعة) الشاشةHotelianaبيوقف في المكتوب
.paused"
الفندق وبروفايل فنادقي
BR-02-26 بيتباع الفندق منشور توريد عقد خلال من .بس Hotels متقسمةMy مجموعات3 contract supply وNo Draft،
 وcontract .Selling، attention" مجموعةNeeds مش الفندق، على إضافية علامة
 BR-02-27 attention" جوهNeeds بينتهي عقد الفندق: على دول من حاجة فيه إن معناها
 منcontract_expiry_warning_threshold إيقاف أو أوHoteliana، منشورة، مش تغييرات أو out، أوSold قريبة، ليلة على
required" information غرفةMore طلب أو you، Needs بيقول الكارت تحت اللي السطر سبب. حلهأهم مكان على بيودّي والزرار ،
.)"Review expiring contract"( أوOpen draft"، أوContinue contract"،

---

**p. 76**

"Tourism licence · 7010231144 كلهاBR-02-28 الرسمية الفندق بيانات only انتهائهاRead وتاريخ الرخصة رقم ومنها ·،
.)"Licence expiry · 12 Mar 2027 · Tourism" of وMinistry valid"،
"Expired" Badge BR-02-29 انتهت: لو الرخصة الفندق يتباع (قراربيفضل سطرPO البروفايل، في expiry"). بيبقىLicence
. سطر it."ومعاه pauses Hoteliana unless continues Selling up. this following is Hoteliana النص) لو(مقترح
بيبقىHoteliana ده البيع، توقف قررت منPause 10 Flow ( الفندق).HOTELIANA_PAUSED ونطاقه ،
). ليهاBR-02-30 غرفة كل الغرف: كتالوج واحدةView room" the of part is view فيThe مش العقد، في والأسعار الوجبات
الكتالوج
 بحالةBR-02-31 الكتالوج في بتظهر مستنية لسه طلبها اللي الغرفة Hoteliana" for وWaiting تتباع، ولا تتسعّر أيمينفعش في
عقد
ناقصة غرفة إضافة
Drawer) BR-02-32 متاحة بسLinkedلفندق الفندق بروفايل من 02.2L، UI ← room" missing وبتفتحAdd
.( OV 02.R1 )
 BR-02-33 room" own its is view يعنيEach View: City وDeluxe View Haram واحدةDeluxe وكل منفصلين، غرفتين
بطلب
BR-02-34 التكرار الغرفةفحص اسم يكتب ما أول بس، ده الفندق على بيشتغل 400ms Debounce الإشغالمقترح لما وتاني )،
). لحد بيعرض 3يتغير. شبهها غرف الشبه(مقترح) سبب واحدة كل وجنب 100%"، match أوname match" الحدoccupancy
الاسم تطابق شبه: بيعتبره الـ80اللي ونفس الإشغال نفس أو View%، .(مقترح)
.Send as a different room" منBR-02-35 بيتغير الأساسي الزرار شبهها، غرفة فيه لو review" Hoteliana for لـSubmit
 لـ وبيظهر الطلب على بيتسجل ده Hotelianaالاختيار التكرارHoteliana. ترفض وممكن تاني، الفحص نفس بتعمل
).Cover BR-02-36 الصور: حاجة حاجة2أقل وأقصى 20، .(مقترح أوJPG وPNG 10، الغلافMB هي صورة أول للصورة. بالكتير
 BR-02-37 الصور حقوق إقرار الإرسالإجباري قبل
الغرفةBR-02-38 مراجعة مدة 1 day working 12( منFlow اتغيرت .)2،
 BR-02-39 الغرفة بس4لطلب نتايج
 .1. :Approved catalogue" ofﬁcial to دهAdded الفندق على عقد كل في الغرف قايمة وفي الكتالوج في تظهر الغرفة
 .2"Waiting. :Linked catalogue" the in صفAlready اتضافت. جديدة غرفة ومفيش موجودة، غرفة على بيشاور بقى الطلب
 Hoteliana" الكتالوجfor من بيختفي
 .3. info your من:Needs سؤال يردHoteliana ما لحد بتقف الساعة
 .4 approved موجود:Not لو بديل اقتراح ومعاه مكتوب، بسبب
التطبيعBR-02-40 بعد الاسم بنفس الفندق نفس على مفتوحين طلبين فيه يكون مينفعش name صغيرةNormalized حروف يعني ،
 زيادة) مسافات غير .(مقترحومن
ناقص فندق إضافة
. BR-02-41 على ويزارد واحدة، بالترتيب3صفحة خطوات  details Hotel ← amenities & Photos ← الليReview الخطوة
 عليها أوBack"خلصت الخطوةEdit" رقم من أو
الخطوةBR-02-42 في الإجبارية الحقول سبعة1 name Hotel وEnglish( name)، Hotel وArabic( rating)، وStar ،Country،
Country وCityو وAddress، location، العدادMap left". }n{ · required are * marked بيتملاFields حقل كل مع بيتحدّث
.5 بـCityو افتراضيًا متعبّيين Arabia وSaudi البدايةMakkah كده علشان left"،
).Flow 12 BR-02-43 رخصة حقل مفيش توافقHoteliana لما بتضيفها

---

**p. 77**

BR-02-44 للفندق: التكرار الـفحص وعلى وعربي) (إنجليزي الاسم على بيشتغل اسمهاPin تطابق اللي المكتبة فنادق بيعرض %،80.
Pin. الـ منPinأو أقرب بتاعها 500 m القيمتين) الـ(مقترح من والمسافة والكود، والنجوم، والحي، والمدينة، الاسمين، فندق: كل جنب
الاسم. تطابق ونسبة بتاعه،
 BR-02-45 المورد تشابه، فيه لو يختار اتنين:لازم من واحدة
 instead" access Request تأكيد (بعد الويزارد بيقفل ده الموجودين. من فندق على وبيفتحDiscard 02.3)، الفندقOV على
ده
.It is a different hotel - continue"أو
.Hoteliana) المراجعة في ويظهر بيتسجل …"الاختيار - hotels similar 2 past continued وعندYou
 BR-02-46 الفندق: صور حاجة حاجة3أقل وأقصى 30، .(مقترح أوJPG وPNG 10، بيتغيرMB والترتيب غلاف، الأولى للصورة. بالكتير
  بتفضل(مقترح)بالسحب الصور يتقبلPending. الفندق ما لحد
Hoteliana may ask for proof of المرافقBR-02-47 :)Amenities 12 الاختيار ثابت. اختيار اختياري صفر) الأدنى (الحد .(مقترح
any amenity."
"I conﬁrm these details are accurate under the active Supplier. الخطوةBR-02-48 في إجباري الصور حقوق إقرار إقرار2
."Submit for approval" الخطوةAgreement." في إجباري قبل3
."Decision within 2 working days". للفندقBR-02-49 المتوقعة المراجعة مدة 3 days الإرسالworking إعادة بعد
 BR-02-50 اتقبل لو Hoteliana والفندق الرخصة، وتضيف المكتبة في الفندق بتعمل طلبه اللي بالمورد أوتوماتيك غيربيتربط (من
. في ويظهر منفصل)، وصول Hotelsطلب بحالةMy contract" supply فيNo يشوفوه يقدروا التانيين الموردين دي اللحظة من
المكتبة.
Everything else BR-02-51 youالتصحيح :)Needs كنقطHoteliana المطلوب بتكتب needs" Hoteliana وWhat you)،
kept" is متعبيّentered تاني الفورم بيفتح المورد ﬁx". to form the كـOpen السيرفر على بيتحفظ والتعديل وبيعدّل، )،
. ready" بيعملCorrections وبعدين ثابتResubmit"، المرجع
الـBR-02-52 في الجديد للويزارد مسودة حفظ مفيش النصMVP في الخروج changes?". منDiscard بتتمسح المرفوعة والصور ،
بعد المؤقت 24التخزين ساعة .(مقترح
BR-02-53 الشركة نفس من مفتوح تاني طلب وفيه المدينة ونفس الإنجليزي الاسم بنفس جديد فندق طلب يبعت مينفعش .(مقترح)
عام
مكةBR-02-54 بتوقيت التواريخ كل منUTC+3 أقل نسبي7). تتكتب أيام ago" days 2 وSent now"، Just كده من وأكتر )،
تاريخ Sep"تتكتب 12 للحد) .(مقترح
.Esc كلBR-02-55 Drawer ده الفلو في بـ بس✕بيتقفل الـ Modals. بـ بتتقفل والإرسال) (التأكيد أوCancel أو✕
عليهBR-02-56 إرسال زرار أي key Idempotency طلبين مايعملوش بعض ورا الضغطتين علشان .(مقترح،
)Happy path( 3 الفلو. الأساسي
A.3 طلب وصول لفندق من المكتبة
 .1. يشوف  selected nothing · 02.1 فيهUI الهيدر Library". وHotel hotels"، وزرار128 hotel"، missing تحتهAdd
. Hotelsالتابات وMy contracts، supply وHotel Library، وHotel (نشط)، وRequests agreement، & بعدهاCompany

---

**p. 78**

. والفلاتر البحث name"شريط hotel by وSearch وCountry، وCity، وCategory، status، الاسم،My الكروت: جريد بعدها
Hotel not found? Add it and Hoteliana. المدينة Badgeو"الحي، سطرAvailable" خالص تحت
reviews it before it becomes available."
 نفسهيعمل: الكارت على يدوس
.URL يفتحالسيستم: 02.2 OV view( كـQuick ويحطDrawer) المكتبة، فوق الـhotel=HTL-1048 في
. 2"Al Aziziyah, Makkah · 4 stars · Hoteliana يشوف  02.2 OV : VIEW" QUICK · LIBRARY وHOTEL الفندق، واسم ID،
: وHTL-1048" Badge، request" to بعدهاAvailable ONLY". READ · PROFILE HOTELIANA العربي،OFFICIAL الاسم
و للحرم، والمسافة والوصف، 2027"والعنوان، Mar 12 until valid · 7010231144 · licence بعدهاTourism ،AMENITIES".
Once Hoteliana approves, you can create a supply 4"و · CATALOGUE تحتROOM والمساحة. والسرير بالإشغال
.Request access" hotel." this for وزرارcontract
."Request access" يعمل
 يفتحالسيستم: 02.3 الدرج.OV فوق
. 3"Hoteliana approval is يشوف  02.3 OV : REQUEST" وCONFIRM hotel?"، this to access وRequest required،
BY CONFIRMING, YOU created." be can contract supply a تحتbefore الأربعة والإقرارات الفندق، وكارت CONFIRM،
:THAT"
"Your company can supply this hotel."
"Published rates, inventory and conditions are contractually binding."
"Failure to fulﬁl an accepted booking is handled under the supplier agreement."
"The request is recorded under your name with the date and time."
."Conﬁrm & send 1 request" وCancel"والزراير
.Conﬁrm & send 1 request" يعمل
السيستم:
 يبقى ويتقفل.Loadingالزرار
عنده المستخدم إن لسهhotels.requestيتحقق الفندق وإن مفتوح.Available، طلب مفيش وإن ،
طلب بحالةACC-04831يعمل ويسجلwaiting وrequested_by وrequested_at، .ack_version،
.Activity الـ في logيسجل
).Hotel access ‹ Supply لـ إشعار فيHotelianaيبعت الوصول (مراجع
 إشعار ولأصحابin-appيبعت للمستخدم الشركة.hotels.request في
. 4"WHAT يشوف  02.4 OV : SENT" وREQUEST Hoteliana"، to sent request وAccess والفندق، والمرجع، HAPPENS،
بـNEXT" خطوات3 name" your under now وSent days("، working 2 )usually relationship the reviews ،Hoteliana
"No action is needed. contract"و supply ﬁrst its for ready Hotels, My in appears hotel the → بعدهاApproved
unless Hoteliana asks for veriﬁcation. You will be notiﬁed either way."
."View requests" يعمل library" to أوBack
.UI 02.5 السيستم library" to لـBack يرجع 02.1D وUI requests"، يفتحView 02.5A أوUI
. 5"}n{ access requests are with Hoteliana · Usually decided within 2 working days - you: يشوف  02.1D بانرUI
way." either notiﬁcation a get وزرارwill requests" بقىView الكارت Badge. وRequested" now"، just وSent View،

---

**p. 79**

 الـrequest" اختفىCheckbox.
 .6 توافقHoteliana الأدمن (من
. linked) يبقىالسيستم: الطلب والعلاقةapproved link، تبقىSupplier-hotel
.Access approved · Al Noor Makkah Hotel" إشعار وإيميلin-appيبعت
.Open in My Hotels" + يبقى المكتبة في "Linked"الكارت
.No supply contract" في يظهر Hotelsالفندق تحتMy
.hoteliana_user الـ في logيسجل بفاعلActivity
. 7"Rawdah :"WHAT CHANGED" يعمل: الإشعار. يفتح يشوف  02.5C فيهOV Sep" 08 on · والـApproved وTimeline، كامل،
Open in My Hotels" Hotels." My in appears وSuites unlocked." are hotel this for contracts supply وزرارHotel
 على 02.2Lبيودّي للفندقUI
B.3 طلب لكذا فندق مرة واحدة
 .1"- nothing is 02.1في يعلّمUI Checkbox كارتين. على تحتالسيستم: شريط يظهر selected" hotels و2 والأسماء، sent،
).UI 02.1 · 2 selected ( "Request conﬁrm" you وuntil selection"، وClear access"،
 .2"Each hotel is access"يدوس Request يفتحالسيستم:. 02.1B OV : hotels?" 2 to access وRequest reviewed،
.Conﬁrm 2 Hoteliana." to it sending before selection the Conﬁrm وseparately. والإقرارات، والفندقين، requests"،
 .3.  السيستم:يأكد. يعمل طلبين ( وACC-04831 فيACC-04832 Transaction) واحد ولا يا يتعملوا، الاتنين يا واحدة. بعدها(مقترح)
 02.4 المرجعين.OV فيه
 .4.4 زي الخطوةA.3يكمّل من
C.3 متابعة الطلبات
 .1"Everything you sent to Hoteliana - hotel access, new hotels, new rooms يشوف  02.5 UI : وRequests" and،
company changes. Rows that need you come ﬁrst."
.Company بالأعداد وAllالتابات access، وHotel hotels، وNew rooms، وNew changes،
 كروت:4
"WAITING FOR HOTELIANA · usually 2 working days"
"NEEDS YOU · answer to keep them moving"
"APPROVED · linked or added"
"NOT APPROVED · reason in detail"
بالأعمدة وREQUESTالجدول وTYPE، وWHAT، (التاريخSENT، وSTATUS UPDATE، وLATEST ."Open"،
One list for waiting"الفوتر oldest then ﬁrst, you needs by: sorted · requests 8 of 8 وShowing everything،
you sent to Hoteliana. A decision never changes your current data until it is approved."
 .2). يعمل Open" كله. الصف على يدوس أو صف، أي على القسمالسيستم: في (الجدول والحالة النوع حسب التفاصيل درج يفتح الـ7
.property/requests/}ref{ يبقىURL
 .3.Scroll بـيعمل: الدرج يقفل ✕ والـالسيستم:. والفلتر التاب بنفس للقايمة يرجع

---

**p. 80**

D.3 فنادقي  ← بروفايل الفندق  ← أول عقد
 .1"Approved hotels appear here. A hotel becomes bookable only through يشوف  02.6 UI : Hotels" وMy a،
 contract." supply وpublished كروت:3،
"NO SUPPLY CONTRACT · Hotel with no contract yet"
"DRAFT CONTRACT · Not published yet"
"SELLING · {n} need attention"
. البحث hotels"بعدها linked وفلترSearch وCity، state، تنبيه،Contract أهم وسطر العقود، وعدد الحالة، فيه: فندق كارت كل
المناسب. والزرار
. 2 يعمل: الفندق. اسم على يدوس يفتحالسيستم: 02.2L تاباتUI غير من كاملة، (صفحة
.Create supply Hotels" My to وBack والكود، والاسم، Badges، وLinked" وزرارSelling" contract"،
.)"1 / 12 images"الصور
details" "Hotel only وانتهاؤها.Read الرخصة ومنها ،
المرافق
catalogue" بعنوانRoom PENDING" 1 · ROOMS 4 · CATALOGUE وزرارOFFICIAL room"، missing وجدولAdd ،
وROOMبالأعمدة وOCCUPANCY، وGUESTS، AGE، وCHILD وBED، وSIZE، وVIEW، .STATUS،
. 3) يعمل contract" supply (محتاجCreate contracts.edit العقدالسيستم:). ويزارد يفتح 03 ومقفولFlow متختار والفندق
E.3 إضافة غرفة ناقصة
 .1 02.2Lمن يدوسUI room" missing Add يفتحالسيستم:. 02.R1 كـOV خالصDrawer فاضي
.Add a missing CATALOGUE" ROOM · HOTEL MAKKAH NOOR وAL room"،
"Enter the room exactly as the hotel sells it. Each view is its own room - Deluxe City View and Deluxeالشرح
Haram View are two rooms."
كلها فاضية الحقول
.)6 required ﬁelds review"الزرار Hoteliana for Submit الناقصة الحقول بعدد سطر وجنبه مقفول، left"(مقترح
. 2"No name"يكتب Room بعدالسيستم:. رماديms400 سطر (أو حاجة يشوف ماحدش تشابه مفيش لو التكرار. فحص يعمل
hotel" this in room similar ).مقترح
 occupancyيملا وMax وAdults، وChildren، age، child وMax type، وBed size، وRoom .3.View،
.1 ≤ إنالسيستم يتحقق Children + Adults ≥ occupancy وإنMax Adults،
. 4).  أكتر أو صورتين 2"يرفع minimum · images وRoom cover"، the is image ﬁrst · each MB 10 to up · PNG or كلJPG
.02.8A-F سلوك بنفس لوحدها، رفع حالة ليها 02.8A-Uصورة وUI
. 5"I conﬁrm we own or hold the rights to these images and allow Hoteliana to display them on the platformيعلّم
and partner channels."
 review"يدوس Hoteliana for Submit .6السيستم.
الحقول. كل من يتحقق
.waiting بحالةROM-20481يعمل
.Waiting for بحالة الفندق كتالوج في صف Hoteliana"يضيف

---

**p. 81**

.)Room requests ‹ Content( لـ Hotelianaيبعت
.Activity الـ في logيسجل
.OV 02.R3يفتح
. 7"It stays out of the يشوف  02.R3 OV : SUBMITTED" وROOM review"، Hoteliana for sent وRoom catalogue،
Back to approved." until contract supply every of out وand والمرجع، NEXT"، HAPPENS وزرايرWHAT hotel"،
."View requests"و
 تعديل: الخطوةمطلوب تبقى2 لازم الشاشة في day(" working 1 والخطوةusually زي3، الأربعة النتايج تعدد لازم
.11. 02.5B2 القسمOV انظر
 .8.)A10 الأربعةHoteliana النتايج من واحدة ← تقرر لحدA7
F.3 إضافة فندق ناقص
 .1 المكتبة hotel"من missing أوAdd found?" not Hotel يفتحالسيستم:. 02.8 كاملةUI صفحة
Enter the hotel exactly as licensed. We check the Library" Hotel to وBack hotel"، missing a وAdd library،
for duplicates as you type the name and place the pin."
.Review 1الخطوات details وHotel (نشطة)، 2 amenities & وPhotos 3،
.LOCATION · Address and map" category"قسم and Name · IDENTITY وقسمHOTEL
.Continue to left"تحت 5 · required are * marked وFields وCancel"، photos"،
. والـ والعنوان، (اختياري)، والوصف والنجوم الاسمين locationيملا لينكMap (يلزق Maps الـGoogle يحط الخريطة على يدوس أو 2،
(.Pin
."Pin conﬁrmed · }district{, الـالسيستم: ويحط اللينك، من الإحداثيات يطلّع ويكتبPin }city{"،
.Pin) الاسم كتابة بعد بيشتغل التكرار 400msفحص الـDebounce تثبيت وبعد
. 3 تشابه مفيش لو photos" to صفرContinue يوصل العداد لما متاح يبقى
. 4. UI 02.8A يعمل photos" to Continue الخطوةالسيستم:. من يتحقق الـ1 في ويحفظها ويفتحState، للصفحة، المحلي
. 5"At least يشوف  02.8A UI : amenities" and وPhotos UPLOADED"، }n{ · IMAGES ومنطقةHOTEL وDrop، 3،
Avoid logos, screenshots and cover" the is ﬁrst the · each MB 10 to up · PNG or JPG · وimages duplicate،
"HOTEL AMENITIES · hotel." the approves Hoteliana until pending stay Images وangles. الحقوق، وإقرار }n{،
"Only select amenities currently available to guests. Hoteliana may ask for proof (الـSELECTED" 12 وChip of)،
."Continue to review" amenity." وزرايرany وBack"،
  الصور. تقدمالسيستم:يرفع بشريط يترفع وبعدين والحجم)، (النوع الرفع قبل منه بيتحقق ملف كل 02.8A-U UI : .6،Uploaded"
62%"و · وUploading upload"، to بيحصلWaiting الرفع 3). بالكتير الوقت نفس في ملفات .(مقترح)
. 7."Remove" دفعة أول بعد صور يضيف 02.8A2لما فيهاUI بيظهر MB" 3.1 · added photos more 2 و✓
. 8."Continue to الحقوق إقرار 02.8A3يعلّم ويدوسUI المرافق، ويختار review")،
 فيهالسيستم: إن يتحقق متعلّم.3 الإقرار وإن ماتشالتش، ولسه فشلت أو بتترفع لسه صورة مفيش وإن اترفعت، صور
. 9:"Review the submission" : UI 02.8B  يشوف
.Edit" DETAILS" HOTEL · 1 ومعاهSTEP
."Edit" amenities" 10 · images 6 · AMENITIES & PHOTOS · 2 ومعاهSTEP
 check"سطر تشابهDuplicate عدّى لو

---

**p. 82**

"I conﬁrm these details are accurate under the active Supplier Agreement."الإقرار
).UI 02.8B2. وBack"زراير approval" for يتعلّمSubmit الإقرار ما لحد مقفول الزرار
. approval"يدوس for Submit 10السيستم.
بحالةHOT-10492يعمل التكرار.waiting فحص ونتيجة والمرافق الصور ومعاه ،
).Content ← Hotel access ‹ Supply( لـ Hotelianaيبعته
.Activity الـ في logيسجل
.OV 02.8Cيفتح
. 11"Hoteliana checks يشوف  02.8C OV : SUBMITTED" وHOTEL review"، Hoteliana for sent وHotel duplicates,،
Sent now - }n{ images library." the enters hotel the before entered you details the and وlocation والمرجع، and،
"Approved → the attached" amenities و}n{ days("، working 3 )usually hotel the veriﬁes وHoteliana hotel،
"If Hoteliana asks for corrections, the request contract" supply ﬁrst its for ready Hotels, My in وappears shows،
."View requests" you" reference."Needs its keeps and Requests وزرايرin library"، to وBack
.10  ده السطر في نفسهالأرقام الطلب من تيجي كاتبلازم التصميم amenities". 8 and images فيها4 كان المراجعة بينما و6
. 12.A6. توافقHoteliana تصحيحBR-02-50 تطلب أو ترفضA5. أو
)Alternative ﬂows( 4 الفلوهات. البديلة
) OV 02.10: مباشرةA1 البحث من الطلب
."Search hotels" علىالتريجر: يدوس
الخطوات:
. 1"A hotel name, a city, or the ofﬁcial code Hoteliana :Modalيفتح library" hotel the وSearch uses."،
. يظهرnoor"يكتب matches". تحت3 MATCHES" وأكشنها حالتها عليها نتيجة وكل 2،
).UI 02.2L Linked ← علىOpen" (يودّي
 مطلوب access"مش (يفتحRequest 02.3 طولOV على
 Pending ← request" الدرج).View (يفتح
 .3"Search reads the ofﬁcial catalogue, not your own list. A result you are not linked to still shows -تحت
access." for ask you how is it وopening .Close"،
.3 زيالنهاية: الخطوةA.3 من
)UI 02.7: علاقاتA2 وعنده راجع المورد
.Suspended فنادقالتريجر: وعنده المكتبة يفتح أوLinked أوRequested أوRejected
الخطوات:
. 1"Linked hotels are managed from My بحالاتها بتظهر سطرBR-02-02الكروت وتحت Hotels.")،
. 2. UI 02.2L  ← "Open in My Hotels"
 .3 ← request" الدرجView
 .4. OV 02.5E  ← "See decision"
 .5) why" علىSee Suspended ←  10.1 OV details( الفندقPause بنطاق

---

**p. 83**

 البياناتالنهاية: في بتتغير حاجة مفيش
)OV 02.2D: السريعةA3 النظرة وفتح كده، قبل متطلب الفندق
.Requested يفتحالتريجر: view حالتهQuick لفندق
الخطوات:
. 1."Available to request" Badge مكانRequested"
 .2"You already asked for access on 12 Sep. Hoteliana is reviewing it - sending يظهر الطلب زرار anotherمكان
.See your request" faster." it make not would وزرارrequest
 .3 request" your الـSee يقفل view الطلبQuick درج ويفتح
 جديدالنهاية: طلب مفيش
)Withdraw request" ← OV 02.5B: وصولA4 طلب سحب
. الطلبالتريجر: عندهWaiting والمستخدم hotels.request،
الخطوات:
. 1."Withdraw request"يدوس
. 2"Hoteliana stops reviewing Al Noor Modal شكل بنفس تأكيد 01.6K OV : request?" this وWithdraw Makkah،
time." any at again it request can You وزرايرHotel. request"، وKeep "Withdraw" Danger( النص) .(مقترح
 .3.Available.  يبقىالسيستم:يأكد. الطلب لـwithdrawn إشعار ويبعت الـHoteliana، في ويسجل يرجعLog، المكتبة في الكارت
. يتحدث Badgeالدرج "Withdrawn" وNeutral( }date{")، · }name{ by Withdrawn واحد وزرار أكشن، زراير ومفيش 4،
.OV 02.3 again" Request بيفتح(مقترح)
النهاية ودهWithdrawn .Final،
)02.5F2  ← 02.5F  ← OV 02.5D: تصحيحA5 محتاج جديد فندق طلب
 التريجر عملتHoteliana corrections" مطلوبةRequest وبنقط بنص
الخطوات:
. 1"Needs. وإيميلin-appإشعار Hotel" Gate Makkah · corrections needs بحالةHoteliana الأول يطلع القايمة في الصف
.Map pin and Arabic name need correcting" Latest update وyou"
 .2"Corrections 3 02.5Dالدرج OV : Badge Sep" 04 requested corrections · you والـNeeds (الخطوةTimeline،
تنصيصrequested" علامتي بين النص ومعاها same." the stays reference the - resubmit and both )،Fix
"REPLY NEEDS"و HOTELIANA بالنقطWHAT kept" is entered you else وصندوقEverything TO،
.Open the form to ﬁx" وزرايرHOTELIANA" وWithdraw"،
 .3 ﬁx" to form the يفتحOpen 02.8 UI اتبعتت نسخة بآخر متعبيّ
سطر وتحتها أصفر، بإطار عليها متعلّم تصحيحها المطلوب this"الحقول correct to you asked Hoteliana .(مقترح
عليه يتعلّم المطلوب برا اتعدّل حقل أي بس برضه، للتعديل مفتوحة الحقول Changed"باقي المراجعة في .(مقترح)
. لحد الخطوات في ويمشي اسمهReviewيعدّل التصحيح وضع في الأخير الزرار corrections". Save 4.(مقترح
. جديدةالسيستم: كنسخة السيرفر على التصحيح يحفظ يفضلDraft والطلب الطلب، نفس على you للدرجNeeds يرجع
.OV 02.5F

---

**p. 84**

 .5"Map location moved to the 02.5F OV : resubmit" to ready - corrections التغييرYour وملخص hotel،
licence" tourism the matches now name Arabic · وentrance again")، form the ونصEdit والرد،Hoteliana، ،
."Resubmit" request"وزراير وWithdraw
. 6 Resubmit" يرجعالسيستم:. الطلب ويتسجلwaiting Sep"، 15 · وResubmitted ومعاهHoteliana، إشعار يوصلها
.working days بـDiffالفرق تاني تشتغل والساعة 2)،
. 7"What you changed · Hoteliana checks the 02.5F2 OV : Badge Sep" 15 resubmitted · وWaiting two،
 accepted" as stays else everything - again وdetails name"، Arabic · location Map وزرار✓ الدرجDone"، بيقفل
النهاية قرارWaiting مستني والفندق ،
: اترفضA6 جديد فندق طلب
 التريجر عملتHoteliana Reject" مكرر فندق (مثلاً مكتوب بسبب
):OV 02.5E علىالخطوات: بيتبني مرسوم، (مش الدرج
Badge تنصيص.Rejected" علامتي بين والسبب ،
:"WHAT YOU CAN DO"
 تكرار السبب }hotel{"لو to access الموجودRequest للفندق بلينك
Ask Hoteliana if you believe the decision is wrong."
."Back to library" Hoteliana"زراير وAsk
. النهاية ودهRejected جديد.Final، بمرجع جديد طلب يبعت يقدر
)OV 02.5C2 ( Approved: غرفةA7 طلب
الخطوات
. 1."Room added · Superior King · Al Noor Makkah Hotel"إشعار
. 2 تبقى دهOfﬁcial"الغرفة الفندق على عقد كل في الغرف قايمة في وتظهر الكتالوج، في وDraft الـLive العقد في بتظهرLive). الغرفة
وينشر. يسعّرها ما لحد بتتباع ومش سعر، غير من
. 3"Superior King is an ofﬁcial room of Al :"WHAT catalogue"الدرج ofﬁcial to Added · وApproved CHANGED"،
.Open hotel Hotel." Makkah وNoor ready." are you when contract supply a inside it وزرارPrice proﬁle"،
) OV 02.5C3 ( Linked: غرفةA8 طلب
الخطوات
. 1."Room linked to an existing room · Deluxe King Haram → Deluxe · Haram view"إشعار
. 2 Hoteliana"صف for جديدةWaiting غرفة مفيش الكتالوج. من يختفي
. 3"The same room is already in the catalogue Badgeالدرج catalogue" the in Already · وLinked under،
No new roomDeluxe · Haram view"Your request now points to " :"WHAT name." وanother CHANGED"،
" in your supply contract."Deluxe · Haram view"Price " added." وwas
 .4 عقد في للغرفة اسمه حاطط كان المورد الـDraftلو الغرفة لأن حاليًا، ممكن (مش أثرPending مفيش مابتتسعّرش):
 النهاية ودهLinked الـFinal، أخضر.Badge.
)OV 02.5D2 ( Needs your info: غرفةA9 طلب

---

**p. 85**

الخطوات
. 1."Hoteliana has a question · Deluxe · Partial Haram view"إشعار
. Badgeالدرج paused" is clock 1-day the · Sep 24 asked question · you تنصيص،Needs علامتي بين والسؤال 2،
.Open the form to ﬁx" NEEDS"و HOTELIANA وزرايرWHAT الرد، وصندوق بالنقط، وWithdraw"
. بس: نص الإجابة فيلو يكتب Hoteliana" to ويدوسReply reply" Send التصميم في ظاهر مش لأنه الزرار، اسم 3.(مقترح
للـالسيستم: الرد يضيف يرجعTimeline والطلب تاني.waiting، تشتغل والساعة ،
.Resubmit طول. على للمراجعة الطلب بيرجّع الرد الغرفة، طلب فيهفي لازم اللي الفندق، طلب عكس ده
. 4 حقل تعديل أو صورة محتاج لو ﬁx" to form the يفتحOpen 02.R1 OV الزرار صور. بإضافة وبيسمح القديمة، بالقيم متعبيّ
ده الوضع Hoteliana"في to Send يرجع(مقترح) الطلب حاجةwaiting. ومفيش جديدة، (نسخة بتفضل القديمة والصور ،
بتتمسح).
.Waiting النهاية
)OV 02.5E2 ( Not approved: غرفةA10 طلب
الخطوات
. 1."Room not approved · Triple Room"إشعار
. 2 Hoteliana"صف for الكتالوجWaiting من يختفي
. و السبب، DO"الدرج: CAN YOU (زيWHAT bed." extra an with room Double your on guests 3 وPrice 3"Ask)،
.Open hotel proﬁle" wrong." is decision the believe you if وزرايرHoteliana Hoteliana"، وAsk
التاني الزرار التصميم library"في to لـBack يتغير والمفروض proﬁle"، hotel مربوطOpen فندق تبع الغرفة لأن ،
النهاية ودهRejected .Final،
)UI 02.8H ( "Request access instead": موجودA11 فندق شبه الفندق
الخطوات
. 1"Creating a duplicate splits the بلوك adding"يظهر are you one the like look library the in hotels و2 same،
.Request access instead" records." two across عليهhotel فندق وكل وView"،
 .2 يفتحView" 02.2 مايتقفلشOV والويزارد الويزارد، فوق ده للفندق
 .3:"Request access instead"
اتكتبت بيانات فيه changes?"لو بنصDiscard saved." be not will details hotel new Your .(مقترح
  ويفتح المكتبة يروح التأكيد 02.3بعد ده.OV الفندق على
Open in حالته ده الفندق أوRequestedلو أوLinked الحالةRejected حسب بيتغير الزرار request"، أوView My،
.Rejected · request again from ومكانهHotels" يتشال أو }date{"،
 جديدالنهاية: فندق طلب بدل وصول طلب
)OV 02.R2: موجودةA12 غرفة شبه الغرفة
الخطوات
. 1 hotel"يظهر this in exists already room similar السببA ومعاها المشابهة الغرف وتحته

---

**p. 86**

 .2 room" existing the بعدOpen الدرج يقفل changes?": ويعملDiscard فيScroll، ده للصف 02.2L ويعملهUI
Highlight لثانيتين .(مقترح
 .3"Continue only if the room is genuinely بقى الزرار يكمّل: room"أو different a as وتحتهSend different.،
Hoteliana runs the same check again and rejects a duplicate at approval."
. duplicate_override = true عليهالنهاية: متعلّم طلب يا طلب، مفيش يا
)OV 02.5E ( Hoteliana: يسألA13 ← اترفض وصول طلب
الخطوات
. Dec"الدرج 10 from again it request can you · وRejected تنصيص، علامتي بين والسبب DO"، CAN YOU 1،WHAT
.Back to library" Hoteliana"وزراير وAsk
. Hoteliana" يفتحAsk 11.22 UI Hoteliana( Ask نوع متعبيّ: السياق ومعاه decision") access والمرجع،Hotel 2،
والفندق
. 3.)Flow 11( "Your cases") قضية يعمل فيCaseالإرسال
 يفضلالنهاية: والطلب مفتوحة، قضية لوRejected Hoteliana. يبقى والطلب الأدمن، من بتوافق رأيها، غيرّت بـApproved
row Timeline reversed" Decision .(مقترح)
: المنعA14 فترة بعد تاني الفندق نفس يطلب
."Request again from }date{" عدّىالتريجر: التاريخ
.Rejected. يرجعالخطوات: الكارت Available مرجع ويتعمل عادي، يطلب القايمةجديد. في يفضل القديم الطلب
: القايمةA15 في الشركة بيانات تغيير طلب
الخطوات
. وCHG-00042الصف change"، والحالةCompany والبيانات، Hoteliana، for أوWaiting you، أوNeeds أوApproved، 1،
approved أوPartly ).Rejected،
 .2 منOpen" الطلب تفاصيل يفتح 01 Flow ( 01.6F أوUI أو01.6G، كـ01.6H، القايمةDrawer) فوق
 حالة approved"في الـPartly update: المرفوضةLatest البيانة بيقول detail" one that resubmit - rejected .3)،IBAN
.Flow 01 again"والزرار فيRequest متعبّية البيانة نفس بيفتح
. 4.Hoteliana للـ البنك منOwnerتغيير مكالمة ومعاه بس،
.Flow 01 حسبالنهاية:
)OV 02.11: فنادقيA16 فلترة
الخطوات
. 1"Your three linked hotels, by where their supply actually hotels" your وFilter stands."،
 STATE"مجموعة :"CONTRACT وEverything وSelling، contract، وDraft yet، contract supply وNo .2Needs،
. ومجموعةattention :"ROOMS". وAny catalogue، the in rooms وHas request، room a on اختيارWaiting كل جنب
وأمثلة العدد
. 3.URL. all" وClear hotel" 1 · الـApply في يتحفظ الفلتر
 .4 الـ في3الكروت فوق اللي 02.6 عليهاUI يتداس لما برضه بتفلتر
 فندقA17 اهتمامLinked: ومحتاج

---

**p. 87**

 دهالخطوات: بالترتيب سبب، أهم بيعرض الكارت تحت اللي السطر
. 1)"}contract{ is paused"( من Hotelianaإيقاف
. 2More information required
 .3)"Umrah Q3 ends in 14 بينتهي days"عقد
. منشورة مش 4تغييرات
. 5 out قريبSold
الحل مكان على بيودّي والزرار
UI 10.2الإيقاف
UI 10.9  ← More information required
)"Review expiring contract"( UI بينتهي اللي 10.0العقد
Flow 04التغييرات
Continue draft" ← Draftالـ
.)REF مستويات على مقترح، 09.R(الترتيب
)Exception ﬂows( 5 الاستثناءات. والأخطاء
)Concurrency: الوقتE1 نفس في زميل من اتطلب الفندق
 التريجر: اللحظة نفس في الفندق نفس على طلب أكدوا الشركة نفس في مستخدمين
Sara already requested access to Al Noor Makkah Hotel on 12 بيظهر: يرجّعاللي التاني الطلب والـ409 يعرضModal،
.View request" instead." request that follow can You وزرارSep.
 التأكيد: نفس في فندقين كانوا الـلو وزرارModal كده، قبل اتطلب اللي الفندق يعرض request" 1 other the Send .(مقترح
 بس.المحفوظ: الأول الطلب
)Stale: الصفحةE2 فتح ما ساعة من اتغيرت حالته الفندق
 أوالحالات: بيه، اتربط تانيHoteliana فندق في اتدمج أو المكتبة، من شالته
  التأكيد عند بيظهر اللي refreshed." been has library The request. to available longer no is hotel يتحدث.This والكارت
.Request }name{" اتدمج لو )HTL-xxxx(." }name{ into merged was hotel وزرارThis
 بس.المحفوظ: ده الفندق منه بيتشال الاختيار مفيش.
Conﬁrm" رجّعE3 السيرفر أو وقعت الشبكة وقتxx5:
"We could not send your request. Nothing was sent - try again." بيظهر: الـاللي رسالةModal الزراير وتحت مفتوح، يفضل
شغال. يرجع والزرار
الـالمحفوظ: بنفس المحاولة إعادة مفيش. key بيتكرر.Idempotency طلب فمفيش ،
: شغالE4 وهو اتسحبت الصلاحية
. hotels.request والـالتريجر: المكتبة، فاتح المستخدم منهOwner شال
). بيظهر: بيظهراللي الإرسال عند 11.15 OV working"( were you while changed access تتحدثYour المكتبة القفل، بعد
غير .Checkboxesمن

---

**p. 88**

 إرسالالمحفوظ: مفيش
 ←missing_permission الفندق: ويزارد نص في كان ممنوعلو الإرسال بس يقفلها، ما لحد الصفحة في بتفضل البيانات
(.UI 11.4
: الغرفةE5 أو الفندق ويزارد نص في خلصت الجلسة
. OV 11.12  بيظهر اللي
فيالمحفوظ: بتتحفظ النصية الحقول sessionStorage التاب. نفس في الدخول تسجيل بعد وبترجع محليًا، اترفعت اللي الصور
السيرفر على بالـ24بتفضل ومربوطة ساعة session Upload برضه فبترجع .(مقترح)،
 تاني: بمستخدم كان التسجيل يتمسح.لو المحلي
)UI 02.8A-F: مقبولE6 مش ملف
.MB غيرالتريجر: نوع وJPG PNG من أكبر أو 10،
الملف: تحت بيظهر اللي
Not uploaded - TIF ﬁles are not accepted and the limit is 10 MB. Save it as JPG غلط الاتنين وحجم orنوع
PNG."
"Not uploaded - }EXT{ ﬁles are not accepted. Save it as JPG or بس PNG."النوع
Not uploaded - }size{ MB is over the 10 MB بس limit."الحجم
.Retry زرار ومفيشRemove"ومعاه بس،
 ماتتأثرش.المحفوظ: الصور باقي
Remove the ﬁles that could not be uploaded to سطر:Continue ومعاه تتشال، الغلط الملفات ما لحد مقفول بيفضل
continue." .(مقترح
) UI 02.8A-F: النصE7 في وقع الرفع
."Remove" بيظهر اللي lost." was else Nothing dropped. connection the - uploaded ومعاهNot again" وTry
 خلصت.المحفوظ: اللي الصور
 الحل again" بس.Try ده الملف بيرفع
خالص: فصل النت بتبقىلو الطابور في اللي الملفات كل upload" to يرجع.Waiting النت لما لوحدها وبتكمّل ،
: الأدنىE8 الحد من أقل الصور
 التريجر review" to منContinue أقل والصور من3 أقل (أو الغرفة2 في
Add at least 2 room بيظهر: الرفعاللي منطقة تحت رسالة 2." have you - continue to photos 3 least at (والغرفةAdd
 1." have you - تعملimages والصفحة هناك.Scroll)، لحد
: متعلّمE9 مش الحقوق إقرار
 بيظهر اللي continue." to images these to rights the hold you الـConﬁrm تحت بالأحمرCheckbox
Continue: ودوسE10 بتترفع لسه الصور
بيظهر: وجنبهاللي مقفول، الزرار ﬁnish." to uploads 2 for Wait .(مقترح

---

**p. 89**

 لينكE11 Maps: غلطGoogle
"We could not read a location from this link. Paste a Google Maps link or drop the pin on the map." بيظهر اللي
 الـE12 المختارةPin: المدينة برا
الـالتريجر: Pin من أكتر بعد على 50 km المدينة مركز من .(مقترح
 بيظهر: أصفراللي تحذير pin." the move or city the Check Makkah. outside is pin بيمنع.The ومش
: ناقصةE13 إجبارية حقول
 بيظهر: عنداللي photos" to (القسمContinue بتاعته الرسالة تحته بيطلع ناقص حقل كل تعمل8، والصفحة حقلScroll)، لأول
.}n{ يوضح والعداد left"غلط،
Submit: علىE14 ضغطتين
. بيحصل: ومعاهاللي يتداس، ما أول بيتقفل الزرار key المرجعIdempotency نفس بيرجّع المفتاح، بنفس طلبين استقبل السيرفر لو
 وE15 طلب سحب الوقتHoteliana: نفس في قررت
 بيظهر: بعداللي يرجّعWithdraw" السيرفر :409 Approved." ago: moment a request this decided والدرجHoteliana
الجديدة. للحالة يتحدث
 مايتنفذش.المحفوظ: السحب القرار.
: مفتوحE16 والدرج وصل القرار
بيظهر: الدرجاللي فوق صغير شريط now." just updated was request وزرارThis Refresh" سلوك(مقترح) بنفس ،
. moved" فيSomething لوحده.09.4 يتحدث الدرج الرد، صندوق في حاجة كاتب مش المستخدم لو
: موجودE17 مش المرجع أو شركته، بتاع مش طلب لينك فاتح
."Back to requests" بيظهر اللي account." another to belong may It ACC-04899. request ﬁnd not could وزرارWe
يرجّع مش404السيرفر موجود.403، الطلب إن مايكشفش علشان ،
: فاضيE18 أو طويل الرد
 مقفولفاضي: الإرسال زرار
 من (مقترح):2,000أكتر حرف عداد 2,000 / زيادة.2,000 كتابة ومايقبلش "،
: مستنيE19 لسه الاسم بنفس غرفة طلب
" on 12 Sep )ROM-20481(. It is still withFamily Suite"You already asked for " بيظهر: الغرفةاللي اسم تحت
ولينكHoteliana." request" مقفول.View والإرسال ،
 لهE20 اتعمل الفندق غرفةSuspend: بيضيف وهو
"Al Noor Makkah Hotel is suspended for your account. Room requests are closed until it بيظهر: الإرسالاللي عند
 again." active إرسال.is ومفيش
 يقفلهالمحفوظ: ما لحد بالبيانات بيفضل والدرج مفيش،
: (مقترح)E21 بايظ الملف أو الفيروسات فحص من اترفض الصورة رفع

---

**p. 90**

.Remove بيظهر اللي copy." another Try read. be not could ﬁle this - uploaded ومعاهNot
: القايمةE22 أو المكتبة تحميل فشل
. بيظهر: الجريداللي مكان رسالة library." hotel the load not could وزرارWe again" ظاهرينTry بيفضلوا والتابات الهيدر
: البروفايلE23 في الفندق صور تحميل فشل
 بيظهر اللي والعدادPlaceholder أيقونة، فيه رمادي images" 12 / يفضل1
: (مقترح)E24 رد غير من اتقفل الطلب
 فضلالتريجر: غرفة أو فندق طلب 30 you ردNeeds غير من يوم
بيحصل: اللي
This request closes in 7 days without your answer." اليوم أخير23في تحذير يتبعت
.Closed · no answer" اليوم يبقى30في الطلب بسببwithdrawn
 الـ الغرفة الكتالوج.Pendingصف من يتشال
مفتوح )6(سؤال
6 حالات. مش موجودة في التصميم
السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
الجريد "مكان matches hotel حاجةCheck}query{"No مالقاش المكتبة في 1البحث
the spelling, try the Arabic name or the Hoteliana code -
"Add a missing hotel." the add وزرارينor search" وClear
) hotels.request معاهhotel" (لو
Nothing) UI 03.0B
(matches
ﬁlters." these matches "Nothing + ﬁlters" زرارClear حاجة. مالقاش 2الفلتر
 فيApply" 02.9 بيبقىOV hotels" 0 · مقفولApply ومش
OV 02.9
3 في 02.10البحث مالقاشOV
حاجة
Add + " matches hotel library."}query{"No the لينكin
 hotel" missing الـa بيقفل ويفتحModal 02.8 واسمUI
متكتب الفندق
OV 02.10
4 رقمCheckboxالـ و21 مايتعلّمش، :Toast hotels 20 to الاختيار20عدّىUp في فندق
per request. Send these ﬁrst."
UI 02.1 · 2 selected
5 فيhotels.requestمالوش
المكتبة
 غير من زرارCheckboxالكروت hotel". missing فيAdd متشال.
Only the viewالـ مكانQuick access" سطرRequest
Owner, an Admin or a Revenue manager can request
access."
OV 02.2
6 فيhotels.requestمالوش
الفندق بروفايل
 room"زرار missing بالصيغةAdd السطر نفس ومكانه متشال،
المناسبة
UI 02.2L
7 فيcontracts.editمالوش
فنادقي
 contract"زراير supply وCreate draft" بتتشال،Continue
Only the Owner, an Admin or a Revenueومكانها
manager can create contracts."
UI 02.6
8 المنعRejectedالكارت وفترة
خلصت
Rejected on 11. Badge رماديAvailable" سطر الاسم تحت
 الـSep" متاحCheckbox.
UI 02.7

---

**p. 91**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
9"See ← Suspendedالكارت
why"
 10.1يفتح بنطاقOV الليHotel والسبب كتبته،Hoteliana،
Follow up with Hoteliana"و
OV 10.1
اتنهت 10علاقة
(Ended/Offboarded)
. من يختفي Hotelsالفندق يرجعMy المكتبة وفي العقودAvailable،
Read في بتفضل contracts"القديمة supply بحالتها،Hotel
. بتفضلonly المؤكدة الحجوزات
UI 02.7
11Linked Badge الطلبLinked" زرار مكان this. to linked are view"You لفندقQuick
"Open in My Hotels" وhotel."
OV 02.2D
12Rejected Badge تنصيصRejected" علامتي بين السبب can. view"You لفندقQuick
"See decision" Dec." 10 from again it وrequest
OV 02.2D
13Suspended Badge ."Suspended" on supply your paused view"Hoteliana لفندقQuick
"See why" hotel." وthis
OV 02.2D
14 }date{"يتضاف until valid · }no{ · licence زيTourism 02.2D الرخصةOV سطر ناقصه
 02.2 فيOV البيانات الشاشات). كل في ينعكس التغيير إن (قاعدة
 02.2D تانيOV لفندق عربي (اسم غلط التصميم في
OV 02.2
في مسجلة رخصة مالوش 15الفندق
المكتبة
Tourism licence · Not on ﬁle - Hoteliana is addingالسطر
. الطلبit" مابيمنعش
OV 02.2
2027" Mar 12 expired · 7010231144 · licence منتهيةTourism 16الرخصة
Badgeو "Expired" فيNeutral( 02.2L). السطرUI ،
Hoteliana is following this up. Selling continues unless
Hoteliana pauses it."
UI 02.2L
02.2 عدادPlaceholderOV غير ومن والمدينة، الفندق اسم فيه صور مالوش 17الفندق
الـ في فاضي الغرف 18Quickكتالوج
view
"Hoteliana has not added + "ROOM CATALOGUE · 0"
rooms yet. Once you are linked you can add a missing
room."
OV 02.2
 request?"تأكيد this "Withdraw / stops طلبHoteliana 19سحب
 /reviewing {hotel}. You can request it again at any time."
Withdrawn. request" "Keep · بحالةWithdraw" الدرج بعدها
"Request و زراير، غير again"من
OV 02.5B  + OV 01.6K
Badge "Withdrawn" الـNeutral( خطوةTimeline). آخر فيه طلب 20Withdrawnدرج
"Closed ·. }date{" · }name{ by لوحدهWithdrawn اتقفل لو
no answer"
OV 02.5B
21 you (سؤالNeeds وصول لطلب
)Hotelianaمن
. شكل 02.5D2بنفس وOV والرد، السؤال، مفيشWithdraw":
ﬁx" to form the فورمOpen مفيش لأن ،
OV 02.5D2
22 تابDot على أحمر عليهRequests" الصف النوع. وتاب you عليهNeeds عدّى أيام3
in-app. you" on waiting days 3 · sent إشعارReminder
وإيميل
UI 02.5
والحالة يفضل، والـWithdrawn"الصف update، اتسحبLatest طلب بعد 23القايمة
. Sep" 14 · Sara by منWithdrawn كارت أي في مايتحسبش
الأربعة
UI 02.5

---

**p. 92**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
الجدول yet."في requests hotel new ولينكNo a فاضيAdd نوع 24تاب
hotel" التابmissing (وحسب Library" Hotel أوBrowse ،
)"Request a company Hotels" My أوOpen change"،
UI 02.5A
yet." Hoteliana to anything sent not have +You خالص فاضية 25القايمة
"Browse Hotel Library"
UI 11.16
26 Pagination 1" page · requests 61 of 25 الفلترShowing . من طلب25أكتر
الـ في URLوالصفحة
UI 02.5
27= "Needs الأصفر you"الكارت
صفر
" يظهر لقايمة0الكارت ويفلتر عادي ويتداس فرعي، سطر غير ومن
Nothing needs فيها you."فاضية
UI 02.5A
عليه وبيتعلّم الحالة، حسب الجدول بيفلتر كارت تتداس،Activeكل لما الأربعة 28الكروت
الفلتر بتشيل التانية والضغطة
UI 02.5
29 فندقWaitingتفاصيل لطلب
جديد
Hoteliana veriﬁes the hotel · usually 3 02.5Bزي بـOV
The hotel is :"WHILE IT IS PENDING" .working days"
 it." see can else Nobody yet. library the in وزرارnot
"Withdraw request"
OV 02.5B2
Badge library" the to Added · ."Approved جديدWHAT فندق 30Approvedطلب
"Makkah Gate Hotel is in the Hoteliana :CHANGED"
"You are linked to it - create its HTL-xxxx." as وlibrary
"Open in My Hotels" contract." supply وزرارﬁrst
OV 02.5C
02.5E جديدA6زيOV فندق 31Rejectedطلب
ما بعد اتقبل جديد فندق 32طلب
 فيهHoteliana بيانات عدّلت
"Hoteliana adjusted: star rating 4 :"WHAT CHANGED"في
 حقل3." حقل بالفرق
OV 02.5C
33 ready" بعدCorrections
Refresh
 02.5F فبيرجعOV السيرفر، على متحفظ 02.5Fالتصحيح هوOV ما زي
من التصحيح وضع في الفورم 34يقفل
Saveغير
Your corrections are not saved. / "Discard changes?"
· "Keep editing" / "."Needs youThe request stays with "
"Discard"
OV 03.11
35 بعدHoteliana تانية مرة سألت
Resubmit
"Corrections requested · جديدةTimelineالـ دورة فيه
Version 1. ظاهرة}date{" بتفضل القديمة والنسخ ثابت، المرجع
(· Version 2"
OV 02.5D
تصحيح فاتحين الشركة من 36اتنين
الطلب نفس
Sara saved يشوف التاني يكسب. الأول يحفظ correctionsاللي
View her ago." minutes 2 request this وزرارينto
"Replace with mine" وcorrections"
UI 11.10
37 STATUS = Hoteliana" for "Waiting فيهInfo( الصف أزرق). الكتالوجPendingالغرفة، في
 كاتبROM-20481"لينك التصميم review". كاتبIn والدرج
)REF Hoteliana" دهPending للاسم يتغيروا والاتنين 00.S،
UI 02.2L
38 العقدPendingالغرفة ويزارد في
(Flow 03)
"Waiting for Hoteliana سطر ومعاها رمادي، تظهر ·الغرفة
yet" priced be تتختارcannot ومينفعش ،
Flow 03 Rooms
39 الكتالوج you"صف "Needs ولينكWarning( infoبعدAnswer)، your للغرفةNeeds
 الدرجHoteliana" بيفتح
UI 02.2L

---

**p. 93**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
40 :2الخطوة hotel the against room the veriﬁes 02.R3"Hoteliana المدةOV تغيير بعد
Hoteliana adds it, :3. day(" working 1 الخطوةusually
links it to a room that already exists, asks you a
question, or does not approve it"
OV 02.5B2
41 room" existing the فيOpen
OV 02.R2
  تأكيد بعد الدرج يعملDiscardيقفل فيScroll. للصف
 02.2L وUI لثانيتينHighlight
UI 02.2L
42Max Children + Adults من أكبر
occupancy
"Adults and children cannot be more الحقل thanتحت
the max occupancy (6)."
OV 02.R1
43Children = 0"No children" 02.R1 age"حقلOV child جنبهMax ويتكتب يتقفل،
متبعت لسه الاسم بنفس 44الفندق
الشركة نفس من
You already sent Makkah Gate Hotel on الاسم 02تحت
View + Sep (HOT-10391). It is with Hoteliana."
. بالمتابعةrequest" مابيسمحش
UI 02.8H
أصلاً هو فندق مع 45Linkedتشابه
للمورد
You are :"Request access مكان التشابه، بلوك instead"في
linked to this hotel · Open in My Hotels"
UI 02.8H
ما بعد وده بيتداس، اللي هو بس الجاية الخطوة رقم ماوصلهاشمايتنقلش. لسه خطوة رقم 46يدوس
تبقى Validالحالية
UI 02.8
47 يبقى الأساسي والزرار للخطوة، review"يرجع to Back المراجعةEdit"(مقترح من
طول على يرجع علشان
UI 02.8B
drop & عليهاDrag صورة أول Badge. زرارينCOVER" بالكيبورد: الصور. ويرتب 48يسحب
"Move right" left" وMove
UI 02.8A2
49 ماتترفعش الزيادة ﬁlesالملفات 4 hotel. per photos 30 صورة30عدّىOnly
were not added."
UI 02.8A-F
50  و تأكيد، غير من طول على Toastبتتشال · removed اترفعتRemove"Photo لصورة
 لمدةUndo" ثواني5
UI 02.8A2
51 02.8A-U القايمةUI من يتشال والملف يقف، بيترفعCancel"الرفع لسه ملف على
52Back to الويزارد من Hotelخروج
أوLibrary أوCancel، تاني، تاب أو ،
(Refresh
"This hotel is not saved as a draft. / "Discard changes?"
· "Keep editing" / Leave and lose what you entered?"
لوDiscard" المتصفحRefresh. بتاع التحذير ،
OV 03.11
53"No حالة supplyفنادقي،
contract"
. Badge yet" contract سطرNo Sep". 08 on زرارLinked
"Create supply contract"
UI 02.6
Badge "Suspended" الكارتDanger( في بانر الفندقHoteliana). 54Suspendedفنادقي،
". Your bookings{reason}paused supply on this hotel: "
OV 10.1  ← "See why" valid." وزرارstay
UI 02.6
55More عليه informationفنادقي،
required
"Answer) Badge needed" info "More والزرارWarning(
UI 10.9  ← Hoteliana"
UI 02.6
02.6 بيختفيUI كارت ومفيش عادي، بتظهر صفر فيها اللي واحدالكروت ماعدا أصفار الكروت كل 56فنادقي،
57 02.11بيانات عنOV مختلفة
 02.6 التصميمUI في
 الـ نفس من يتحسبوا لازم والتصنيف APIالعدد Haram( فيCentral
 الأولى الفلترSellingالشاشة وفي contract دهNo البيانات،Bug). في
سلوك مش
OV 02.11

---

**p. 94**

السلوك المطلوب (بالتفصيل شكل #الحالة/الرسالة/الشاشة
)الأزرار
أقرب شاشة يتبني عليها
واحد عقدين: فيه 58Sellingفندق
Draftوواحد
1 02.6 مجموعةUI في فيهSellingالفندق والسطر draft"،
59 والموردHoteliana فندقين دمجت
بالاتنين مربوط
إشعار: فضل. اللي للفندق تتنقل العقود يختفي. اتشال اللي الفندق
Hoteliana merged {A} into {B}. Your contracts moved
with it - nothing else changed."
UI 02.6
60 عليهمHoteliana غرفتين دمجت
عقود
Hoteliana merged }room A{ into }room B{ atإشعار
 unchanged." are prices Your الغرفة}hotel{. الكتالوج وفي
تختفي القديمة
UI 02.2L
61)Split action"إشعار :"Requires and }A{ into split was غرفةHoteliana"}room{ قسمت
 sells." contract each one which Choose للعقد}B{. ولينك
UI 02.2L
62 0.4 الجدولSkeletonREF أو الكروت بشكل مرةLoading أول
63Company change row
مالوش والمستخدم
users.view
 02.5 وتابUI خالص، مايظهرش changesالصف مايظهرشCompany
)State machine( 7 الحالات.
) ACC- الوصول7.1 طلب
الـ Badge الحالةاللي
بيظهر
منين إزاييخرج اللونبيدخلها
waitingWaiting for
Hoteliana
 على رد أو أكد، Infoالمورد
سؤال
needs_you  / rejected  / approved  ←
 (الموردwithdrawn)،Hoteliana(
needs_you (مقترح،
مرسوم مش
Needs youWarning ←  (الرد)،waiting أوwithdrawn (المورد، سألتHoteliana30
 )مقترحيوم
approvedApprovedSuccess العلاقةFinal بتكمّل7.5. اللي هي وافقتHoteliana)
rejectedRejectedDanger رفضتHoteliana
بسبب
Final
أو سحب، withdrawnWithdrawnNeutralالمورد
قفله السيستم
Final
) HOT- جديد7.2 فندق طلب
الـاللونالتريجر الحالةBadge
waiting"Waiting :Resubmit Hoteliana for (وبعدWaiting
(· resubmitted {date}"
Info أو (الموردResubmitإرسال
needs_you{date} Needs you · corrections requestedWarningHoteliana: Request
corrections
+ needs_you
corrections_ready
) OV 02.5F ولسه تصحيح حفظ youWarningالمورد (والدرجNeeds
Resubmitماعملش

---

**p. 95**

الـاللونالتريجر الحالةBadge
Approve ماHoteliana: بعد approvedApprovedSuccess،
الرخصة تضيف
rejectedRejectedDanger Reject بسببHoteliana:
withdrawnWithdrawnNeutral السيستم أو يوم30المورد،
)مقترح
)ROM- غرفة7.3 طلب
الأثر على الـاللونالتريجرالكتالوج الحالةBadge
waitingWaiting for Hoteliana · within 1 working
day
forصف ردWaiting أو Infoإرسال،
Hoteliana"
needs_youthe · {date} Needs you · question asked
1-day clock is paused
WarningHoteliana: Ask the supplier for
info
"Needs you"صف
approvedApproved · Added to ofﬁcial catalogueSuccessHoteliana: Create library يبقى room"Ofﬁcial"الصف
linkedLinked · Already in the catalogueSuccessHoteliana: Point to an existing
room
يختفي الصف
كاتبRejected (التصميم approved" rejected،Not
) REF حسب 00.Sويتغير
DangerHoteliana: Reject with يختفي reasonالصف
withdrawnWithdrawnNeutral"Withdrawing removes theالمورد
(pending room."
يختفي الصف
الشركة7.4 تغيير طلب في):CHG- بالتفصيل 01 الحالاتFlow Hoteliana. for Waiting وInfo( you)، Needs )،Warning(
Approvedو وSuccess( approved)، Partly Warning( مقترح و أكشن)، ومحتاجة مرفوضة لسه بيانة فيه لأن Rejected، )،Danger(
).Neutral( Withdrawnو
)Supplier-hotel link بالفندق7.5 المورد علاقة
الـاللونالتريجرالأثر الحالةBadge
قبول أو الوصول، طلب linkedLinkedSuccessقبول
جديد فندق طلب
متاحة العقود
suspendedSuspendedDangerSuspend) Hoteliana
الموردlink إيقاف أو ،
 Blocker  كلSUPPLIER_HOTEL_INACTIVE على
بتفضل المؤكدة والحجوزات العقود،
 (بعدlinked
(Resume
LinkedSuccessHoteliana: Resume
بسبب
 يتشالBlockerالـ
في ended(مايظهرش
فنادقي)
منOffboarding إنهاء أو —،
Hoteliana
 onlyالعقود يرجعRead والفندق المكتبةAvailable، في
متخزنة7.6 مش (مشتقة، المكتبة في الكارت حالة  Available وNeutral( Requested)، وWarning( Linked)، )،Success(
.)Danger( Rejectedو وDanger( Suspended)،

---

**p. 96**

Waiting for الكتالوج7.7 في الغرفة  Ofﬁcial كاتبSuccess( التصميم بدونOfﬁcial"، Badge ملون مقترح وSuccess Hoteliana)،
.)Warning( Needs وInfo( you)،
(مشتقة7.8 فنادقي في الفندق حالة  yet contract No وNeutral( contract)، Draft وNeutral( Selling)، )،Success(
 Suspendedو وDanger( attention"). إضافيةNeeds علامة
uploaded  ← )"Uploading · }n{%"( uploading  ← )"Waiting to upload"( waiting   الرفع7.9 في صورة ملف
 أوUploaded"( غيرfailed_type_size) (من أوRetry (فيهfailed_network) أوRetry (بيتشالcancelled)
 ألوان ملاحظة you" وNeeds وWithdrawn"، approved"، وPartly yet"، contract وNo وSelling"، مشOfﬁcial"،
Needs في 00.Sموجودين للـREF تتضاف ولازم مقترحة، فوق اللي الألوان اسمGlossary. you". معNeeds يتوحّد لازم نفسه
).4 answer" الـan في اللي مفتوحGlossary (سؤال
8 الحقول. والتحقق
 والفلتر8.1 والبحث المكتبة
رسالة الخطأ الحقل؟إجباريالقواعد)English(
 name hotel by (فيSearch
الصفحة
و حرفين، 100من بالكتير حرف في(مقترح) بيدور لأ.
 وENالاسم والكودAR
— مابيدورش) حرفين من (أقل
Search the hotel library
( OV 02.10 )
letters." 2 least at كمانType والمدينة فوق، اللي لأنفس
Country / City / Category / My
status
السيرفر— من والأعداد الشريط، في فلتر لكل واحد لأاختيار
 Send request. per hotels 20 to وAvailable"Up بس، 20 بالكتير فندقCheckboxلأ(مقترح) اختيار
these ﬁrst."
) OV 02.R1 ناقصة8.2 غرفة إضافة
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Room لـ3من 80 حرف إنجليزي.(مقترح) nameأيوه،
نفس على مفتوح طلب مع مايتكررش
الفندق
You / "Enter the room name as the hotel sells it."
" on {date}."{name}already asked for "
Max occupancy
(Guests)
)1–12(." takes room the guests many how منEnter صحيح لـ1رقم 12 أيوه(مقترح)
adult." 1 least "At / more be cannot children and صحيحAdults و1رقم occupancy، AdultsأيوهMax
than the max occupancy ({n})."
children." no takes room the if 0 صحيحEnter Childrenأيوه0رقم
Max child ageلو
 <Children
0
)1–17(." child a as counts that age oldest the لـ1منEnter 17 سنة (مقترح

---

**p. 97**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Bed قايمة من وkingاختيار typeأيوه،queen،
وtwinو وsingle، وdouble، )mixed،
 + العدد(مقترح)
Choose the bed type."
Room m²." 500 and 8 between size a منEnter لـ8رقم 500 m² (مقترح) size(مقترحلأ
واحد وCityاختيار وHaram، ViewأيوهPartial،
وHaram وKaaba، وGarden، No،
view (مقترح)
"Choose the view - each view is its own room."
Room لـ2 صورة،20 أوJPG وPNG 10، imagesأيوهMB
للصورة
Not / "Add at least 2 room images - you have {n}."
"Not uploaded / uploaded - {EXT} ﬁles are not accepted."
- {size} MB is over the 10 MB limit."
Image to images these to rights the hold you rightsأيوهCheckbox"Conﬁrm
continue."
) UI 02.8 ( 1 الخطوة8.3 ناقص، فندق إضافة
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Hotel name
(English)
لـ3من 120 حرف حروف(مقترح) أيوه،
لاتيني
Enter the hotel name in English."
Hotel name
(Arabic)
لـ3من فيه120 يكون ولازم حرف، أيوه
عربي حروف
Enter the hotel name in Arabic, exactly as licensed."
Star rating." star the 5–1"Choose Ofﬁcial · أوstars ratingأيوهUnrated،
Description
(English)
characters." 1,000 under description the 1,000"Keep بالكتير حرف لأ(مقترح)
Description
(Arabic)
الرسالة بالكتير1,000نفس حرف لأ
Arabia فيSaudi المتاحة (الوحيدة Countryأيوه
)MVPالـ
Choose the country."
city." the القايمةChoose Cityأيوهمن
المدينة— أحياء قايمة Areaلأمن
building." and district street, the لـ5منEnter 200 حرف Addressأيوه(مقترح)
Map Mapsلينك إحداثيات،Google فيه locationأيوه
 الخريطةPinأو على
We / "Paste a Google Maps link or drop the pin on the map."
could not read a location from this link. Paste a Google Maps
link or drop the pin on the map."
فيه لو التشابهأيوه اختيار
تشابه
Request يختار accessلازم
It is a different أوinstead"
hotel - continue"
 photos"(زرار to التانيContinue للاختيار بيتغير نفسه
)UI 02.8A ( 2 الخطوة8.4

---

**p. 98**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Hotel
photos
لـ3 أوJPG،30 وPNG 10، أيوهMB
الأولى Coverللصورة.
Only 30 / "Add at least 3 photos to continue - you have {n}."
photos per hotel. {n} ﬁles were not added."
Image
rights
continue." to images these to rights the hold you أيوهCheckbox"Conﬁrm
Amenitiesلأ
(مقترح)
Chip الـ— 12من
)UI 02.8B ( 3 الخطوة8.5
رسالة الخطأ الحقل؟إجباريالقواعد)English(
I conﬁrm these details are accurate under the
active Supplier Agreement."
.Checkbox approval" for أيوهSubmit
يتعلّم ما لحد مقفول
Conﬁrm the details to
submit."
 الدرج8.6
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Reply to
Hoteliana
لـ حرف 2,000من حرف اختياري(مقترح) مرفق لأPDF.
أوJPGأو وPNG 10، MB (مقترح)
Replies are / "Write a reply before sending."
limited to 2,000 characters."
9 الإشعارات. والإيميلات والسجل
مينالقناةRequires الحدثبيستقبل
؟action
سطر الـ log (Activity الفاعل
الأكشن قديم·  ← )جديد
أصحاب + access_request.sentالفاعل
hotels.request
الشركة :Hotelianaفي
Supplyمراجع
· in-appلأsupplier_user
← — · hotel_access.request
(…-ACC) waiting
أصحاب access_request.approvedكل
 فيhotels.view
الشركة
in-app +
email
· لأhoteliana_user
 el_access.approve · waiting
← والعلاقةapproved ،
linked
access_request.rejectedأصحاب
hotels.request
in-app +
email
· لأhoteliana_user
 otel_access.reject · waiting
(reason) rejected
access_request.questionأصحاب (مقترح
hotels.request
in-app +
email
· أيوهhoteliana_user
← hotel_access.ask · waiting
needs_you
request.withdrawnأصحاب
hotels.request
Hoteliana +
supplier_user · in-appلأhdraw.}type{
withdrawn ← {old} ·

---

**p. 99**

مينالقناةRequires الحدثبيستقبل
؟action
سطر الـ log (Activity الفاعل
الأكشن قديم·  ← )جديد
أصحاب + hotel_request.sentالفاعل
.hotels.request
Hoteliana:
Supply/Content
· in-appلأsupplier_user
← — · new_hotel.submit
waiting -…،HOT(
 plicate_override=true/false
hotel_request.corrections_requestedأصحاب
hotels.request
in-app +
email
· أيوهhoteliana_user
 w_hotel.request_corrections
needs_you ← · waiting
hotel_request.corrections_saved———supplier_user ·
 ew_hotel.save_corrections ·
n+1 ← version n
hotel_request.resubmittedHotelianain-app
(عند
(Hoteliana
—supplier_user ·
new_hotel.resubmit ·
(diff) waiting ← needs_you
أصحاب hotel_request.approvedكل
hotels.view
in-app +
email
· لأhoteliana_user
 ew_hotel.approve · waiting
 stem · link.create؛approved
linked ← — ·
hotel_request.rejectedأصحاب
hotels.request
in-app +
email
· لأhoteliana_user
← new_hotel.reject · waiting
rejected
أصحاب + room_request.sentالفاعل
hotels.request
· in-appلأsupplier_user
← — · new_room.submit
(…-ROM) waiting
room_request.approvedأصحاب
 +hotels.view
contracts.edit
in-app +
email
· لأhoteliana_user
 ew_room.approve · waiting
approved
+ فوقin-app اللي room_request.linkedنفس
email
· لأhoteliana_user
← new_room.link · waiting
(room id →) linked
room_request.questionأصحاب
hotels.request
in-app +
email
· أيوهhoteliana_user
← new_room.ask · waiting
needs_you
room_request.rejectedأصحاب
hotels.request
in-app +
email
· لأhoteliana_user
← new_room.reject · waiting
rejected
request.reply_added (المراجعHoteliana
المسؤول
 عندin-app
Hoteliana
— upplier_user · request.reply
—
 (بعدrequest.reminderأصحاب أيام3
hotels.request
in-app +
email
(نفس أيوه
)Threadالـ
· system · request.remind

---

**p. 100**

مينالقناةRequires الحدثبيستقبل
؟action
سطر الـ log (Activity الفاعل
الأكشن قديم·  ← )جديد
link.resumed  / أصحاب link.suspendedكل
hotels.view
in-app +
email
والـ (إجباري،
Toggle
مقفول
· link.suspend · لأeliana_user
 eason) suspended ← linked
/ room.merged  / hotel.merged
room.split
أصحاب
contracts.edit
in-app +
email
: أيوه،Split
لأ والباقي
hoteliana_user ·
B ← content.merge · A
.) REF 11.R بتبقى الطلب نفس على الأحداث واحدThreadكل حالة آخر على وبيفتح الإشعارات، في
من بتخرج you"الحاجة Needs يتعمل الأكشن أولما (رد، أوResubmit فيWithdraw، الناس لكل وبتخرج يتقري، الإشعار لما مش )،
اللحظة. نفس في الشركة
لينك فيه linkالإيميل للدرجDeep بعدproperty/requests/}ref{ للّينك بيرجع دخول مسجل مش المستخدم ولو )،
التسجيل.
Append-onlyالـ وفيهLog .actor_role_at_time،
)Acceptance criteria( 10 معايير. القبول
 .1 عندهلما مستخدم hotels.request مرة، لأول المكتبة يفتح يشوف فندق128 والزرارAvailable access"، ظاهرRequest مش
فندق. يختار ما لحد
. 2 لما فندقين، يختار فيهيظهر تحت شريط selected" hotels و2 والاسمين selection" وClear access" وRequest أيمفيش،
بيتبعت. طلب
. 3 يدوسلما selection" Clear يختفي، والـالشريط تتشالCheckboxes
. 4 لما في يأكد 02.1B OV حالتهيتعمل، واحد وكل مختلفين، بمرجعين طلبين Hoteliana for وWaiting 02.4، المرجعينOV يعرض
. لما فاصلة، والشبكة يأكد تظهر again." try - sent was Nothing request. your send not could We والإعادة 5مابتعملش،
طلبين.
. إن فندقبفرض Requested الـلما، يفتح view Quick يشوف،  02.2D وOV الطلب بتاريخ request" your زرارSee ومفيش 6،
طلب.
. 7 إن فندقبفرض قرارRejected بتاريخ 11 المنعSep وفترة 90 يوم، يشوف Dec" 10 from again والـRequest مشCheckbox،
.Dec لحد 10موجود
. إن بفرض خلصت، المنع فترة يرجعالكارت وتحتهAvailable Sep" 11 on جديدRejected بمرجع يطلبه ويقدر 8،
. 9 لما اللحظة، نفس في الفندق نفس يطلبوا الشركة نفس في مستخدمين ومعاهايتعمل طلبه زميله إن رسالة يشوف والتاني بس، واحد طلب
.View request"
 لما Hoteliana وصول، طلب على توافق يظهر فيالفندق Hotels تحتMy contract" supply يبقىNo المكتبة في والكارت .10،
 إشعارLinked ويوصل وإيميل.in-app،
 .11 لما Hoteliana ترفض، يعرض والدرج تنصيص، علامتي بين السبب Hoteliana" المرجعAsk فيها قضية بيفتح
. 12 طلبلما يسحب Waiting يتطلب، الحالة وبعده تأكيد، يرجعWithdrawn والفندق منعAvailable، فترة غير من
. 13 ولما يسحب Hoteliana اللحظة، نفس في قررت يكسب بالقرارالقرار رسالة وتظهر
. إن مالوشبفرض مستخدم hotels.request لما، المكتبة، يفتح مايشوفش ولاCheckboxes hotel" missing ويشوفAdd 14،
 الـ viewفي يطلب.Quick يقدر مين سطر

---

**p. 101**

 لما الطلبات، قايمة يفتح صفوف you Needs الأول الانتظارتطلع في الأقدم وبعدها .15،
. كارتلما على يدوس YOU" NEEDS يتفلتر، علىالجدول you الفلترNeeds تشيل التانية والضغطة 16،
. 17 إن فضلبفرض طلب 3 you Needs أيام، تذكيريوصل ويظهرin-app وإيميل، التابDot على أحمر
. 18 يفتحلما room" missing فندقAdd بروفايل من Linked خالص، فاضي يفتح افتراضيةالدرج قيم أي غير ومن
. 19"Send as لما موجودة، غرفة شبه غرفة اسم يكتب يظهر hotel" this in exists already room similar لـA يتغير والزرار a،
.different room"
 .20 لما واحدة، بصورة الغرفة يبعت يظهر 1." have you - images room 2 least at إرسالAdd ومفيش
. 21 لما تتبعت، الغرفة بحالةتظهر الكتالوج في Hoteliana" for وWaiting عقدماتظهرش، أي في للتسعير قابل كاختيار
. 22 لما تعملHoteliana room" existing an to Point يبقى، الطلب الـLinked الغرفة وصف اسمPending، يقول والدرج يختفي،
الموجودة. الغرفة
. 23.Waiting لما Hoteliana غرفة، طلب على تسأل يقول يرجعالدرج الطلب الرد وبعد واقفة، الواحد اليوم ساعة إن
. 24"It is a لما المكتبة، في فندق شبه فندق اسم يكتب يختاريظهر لما غير يكمّل ومايقدرش والمسافة، التطابق بنسبة التشابه بلوك
.different hotel - continue"
 .25 يدوسلما instead" access Request يظهر، changes?" وبعدهDiscard 02.3، الموجودOV الفندق على
. 26"Not uploaded - TIF ﬁles are not accepted and the limit is 10 MB. Save ملفلما يرفع حجمهTIF 18.6 MB تحتهيظهر،
 PNG." or JPG as ومعاهit ماتتأثرش.Remove" التانية والصور بس،
 .27"Try again" لما صورة، رفع أثناء يقع الاتصال تظهر lost." was else Nothing dropped. connection the - uploaded وNot
بس. دي الصورة بيرفع
. 28."Add at least 3 photos to continue - you have 2." يدوسلما review" to Continue بصورتين، خطأيظهر
. 29 لما الإقرار، يعلّم ما غير من للمراجعة يوصل يفضل approval" for مقفولSubmit
. 30 لما الفندق، يبعت يظهر  02.8C OV والمرافق الصور وعدد بالمرجع، فعلاًبيطابق اتبعت اللي
. 31 لما Hoteliana تصحيح، تطلب يعرض والدرج المطلوبة، النقط ﬁx" to form the Open متعلّم المطلوبة والحقول متعبيّ الفورم يفتح
عليها.
. 32."Your corrections - ready to resubmit" ويعمللما التصحيح يحفظ Refresh يرجع،  02.5F بـOV
. يعمللما Resubmit تبقىالحالة، }date{" resubmitted · مايتغيرشWaiting والمرجع 33،
. 34Read لما Hoteliana جديد، فندق على توافق يظهر فيالفندق Hotels الرخصةMy رقم وفيه وصول، طلب غير من بالمورد مربوط
.only
 لما النص، في الفندق ويزارد من يخرج يظهر changes?" Discard بتتحفظ حاجة مفيش أكد ولو .35،
. 36 إن فندقبفرض رخصة Linked انتهت، يفضل الفندق يعرضSelling والبروفايل Badge، مستمرExpired" البيع إن وسطر
. 37 إن بفرض عملتHoteliana Suspend لعلاقة، يبقىالفندق فنادقي في عليهاSuspended عقوده وكل السبب، ومعاه
بتفضل.SUPPLIER_HOTEL_INACTIVE المؤكدة والحجوزات ،
 .38.404 لما تانية، شركة تبع طلب لينك يفتح يشوف …" request ﬁnd not could يرجّعWe والسيرفر

---

**p. 102**

11 أسئلة. مفتوحة
الوضعالاقتراح الحالي / #السؤالالتعارض
يتراجع الوصول 1طلب
أوتوماتيك؟ يتقبل ولا
 )reviewed( module قرارSupply Sep 24 رقمPO بيقول:1
"Hotel access = the supplier picks hotels from the Hoteliana
library and access is granted automatically. Only a new hotel
approval." Supply شاشاتneeds كل لكن Figma ( 02.1D ،UI
 02.4و وOV 02.5B/C/E، وOV 02.7، وUI 10.C، بكودREF
) بسبب.ACCESS_NOT_APPROVED ورفض عمل بيومين مراجعة بتعرض
 12و Flow دي الشاشات ماغيرّش
لو الشاشات. على مبني ده الملف
الصح: هو الأوتوماتيك القبول
Access 02.4 يبقىOV
والحالةgranted" Waiting،
 و المنعRejectedتتشال، وفترة
 تفضل. والإقرارات لازميتشالوا،
التنفيذ قبل يتحسم
12 واحدFlow عمل يوم 02.R3: كاتبOV لسه working 2 الغرفةusually مراجعة 2مدة
 وكارتdays" HOTELIANA"، FOR فيWAITING 02.5 كاتبUI
 days" working 2 للكلusually
. 02.R3يتصلّح يبقىOV الكارت
days" working 1–3 ،usually
صف كل على تبقى المدة أو
00.S REF 20( :)Sep approved" "Not ← لكنRejected المرفوضة. الحالة 3اسم
 02.5E2 والكارتOV APPROVED"، وعنوانNOT 02.5E، لسهOV
"Not approved"بيقولوا
 على كلRejected"يتوحّد في
مكان
4"Needs you"
"Pendingو
In وHoteliana"
review"
."Waiting for Hoteliana" فيهGlossaryالـ answer" an وNeeds
Pending بتستخدم you"الشاشات وNeeds Hoteliana"،
)UI 02.2L ( "In ( 02.5B2 وOV 02.R3، وOV review")،
"Waiting الكتالوج في forالصف
Needs. قرارHoteliana" ولازم
للـyou" تتضاف ولاGlossary ،
"Needs an لـ answer"تتغير
5Companyصفوف
 مينchanges
يشوفها؟
REF البنكusers.view وتفاصيل في، محدد مفتاح 08.Rمفيش
bank.changeلـ بس (مقترح
فضل 6Needsطلب
 ردyou غير من
بعد بـ30يتقفل وقبلها يوم، أيام7 قاعدة مفيش
 (مقترح)تحذير
الجديد الفندق 7طلب
إيه؟ بمفتاح
access to a hotel, or for a missing موصوفhotels.request
 بسroom"
 المفتاح (مقترحنفس
8OV 02.5Dنص
Arabic nameبيقول
does not match the
licence"
 رخصة مابيدخلش 12المورد بتعملهاFlow هنا المقارنة بالرخصةHoteliana).
معاها اللي
من كنص مشHotelianaمقبول ،
المورد عند حقل
9 02.5E2 زرارOV
"Back to library"
proﬁle" hotel مربوطOpen فندق تبع الغرفة
10 02.8C بيقولOV
"4 images and 8
 والمراجعةamenities"
10 و6فيها
الطلب من تتحسب Prototypeبياناتالأرقام
11 02.11 بيعرضOV
"No Central Haram
supply contract"
 02.6و بيعرضهUI
Selling"
للبيانات واحد Prototypeبياناتمصدر
التصميم3 زي كاتبBaselineالـ، كان 5 كاتب(مقترح) والتصميم images"، 3 least الفندقAt لصور الأدنى 12الحد

---

**p. 103**

الوضعالاقتراح الحالي / #السؤالالتعارض
الرفض بعد المنع 13فترة
 يوم)90(
"decided 11 Sep → request again from 10  وتبقى منSettingتتأكد، Dec"مستنتجة
 مكة بتوقيت للخميس مكتوبة(مقترح)الأحد للـمش العمل 14SLAأيام

---

**p. 104**

