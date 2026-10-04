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

# Flow 01 · Access & Account

Account & Access 01: (Flow الدخول )والحساب
 01المصادر Flow section Figma ( و523:3209 شاشاته، بكل 00.E) وREF الإيميل)، (مداخل 08.R كسطحREF (الدعوة
و وbank.changeأمني، 11.R)، وREF (الجلسة)، module Supply ( SUP-2 /  SUP-5 /  SUP-6 /  SUP-7 /  )،SUP-10
 الـ البنك).POوقرارات وتغيير الجزئي، والتغيير (الرخصة،
1 الهدف. والنطاق
 موجود: ده الفلو سرقه،ليه حد أو الباسورد نسي لو حسابه ويسترجع بأمان، يوم كل دخول ويسجّل بأمان، مرة لأول البوابة يدخل المورد
مع واتفاقيته شركته بيانات فيHotelianaويشوف وصل فين ويعرف مستند، أو بيانة أي تغيير ويطلب الاتفاقية، من الجديدة النسخ ويقبل ،
البداية. خطوات
الأجزاء:
الكودالجزءالشاشات
01.1 UI /  01.1A /  01.1B /  01.1B2 /  الدعوة01.1C من الحساب A.01تفعيل
بالإيميل والتحقق B.01الدخول
(FA2)
01.2C  / 01.2B3  / 01.2B2  / 01.2B  / 01.2D  / 01.2A  / UI 01.2
01.3 UI /  01.3A /  01.3B /  01.4 /  الباسورد01.4A C.01نسيت
D.01: me" استرجاعNot
مسروق حساب
(OV 11.13  +) 01.4D2  / 01.4D  / 01.4N  / UI 01.3N
E.01)Getting 01.5 UI +(  11.19 startedالبداية)UI
والاتفاقية الشركة F.01صفحة
(للقراية)
 /OV 01.6A) 01.6 (عاديUI revealed وdetails 01.6) OV preview( Document × و3
01.6B  / 01.6A2
01.6N UI /  01.6N-R /  و01.6P 01.6L OV /  01.6L1 /  01.6L2 /  /01.6L3 المورد اتفاقية G.01نسخ
01.6M  / 01.6A2-L  / 01.6A-L  / 01.6L4
01.6C UI /  01.6C2 /  01.6D /  01.6E /  01.6F /  01.6G /  و01.6H /01.6C-* الشركة بيانات تغيير H.01طلب
OV 01.6K 01.6D-* /  01.6E-* و11( نوع)
01.6J OV /  01.6J2 +(  07.36 وUI 07.20H منUI 12 البنكي)Flow الحساب I.01تغيير
ورخصة المستندات J.01انتهاء
السياحة
(بانرات) مرسوم مش
 النطاق فوق.):MVPجوه اللي كل
النطاق: برا
).A.01 وإدارتهم الفريق أعضاء 08دعوة Flow بس التفعيل). هناشاشة هي المدعو الفريق لعضو
 ←Flow 12 Row B  السياحة وزارة للفندقرخصة licence( MoT :)Hotel بسHoteliana للقراية بيشوفها والمورد وبتدخلها، بتملكها
 02 Flow هو هنا اللي المورد). شركة بتاعة السياحة الشركة).رخصة مستندات من (مستند

---

**p. 38**

. المخزون وموديل والتسوية، (المدة، نفسها الاتفاقية شروط correction"تغيير data a not is agreement commercial دهThe
 من جديدة تغيير.Hotelianaنسخة طلب مش
).P2 الـ في مش لمستخدم: الشخصي الدخول إيميل مقترحMVPتغيير دعاه، اللي بيحدده (الإيميل
 وتطبيقSSO P2 الـAuthenticator: الـFA2. في بس.MVP بالإيميل
العربي .P2الواجهة
بيستخدمه: مين
(مين الأكشن)المفتاح
Not مفتاح) محتاج (مش حساب أو دعوة عنده مستخدم وأي الباسورد، ونسيت والدخول، meالتفعيل،
Getting started UI خطوة كل صلاحية حسب بتظهر الأزرار 01.5يشوفالكل.
UI (مقترح company.viewالكل الحساسة البيانات الأدوار). كل في الـمقنّعة لغير صفحةOwner 01.6يشوف
Adminوالـ
)details وOwner يتحدد)Admin المفتاح ما لحد (مقترح الحساسة البيانات revealed"يكشف
بسOwner  ( تاني)agreement.accept لحد مايتدّاش مقترح، اتفاقية نسخة يقبل
الـ غير مستخدم للـOwnerأي النسخة Ownerيبعت
وOwner Admin ( مقترح)company.request_change الـ وبيانات البنك (غير الشركة بيانات تغيير )Ownerيطلب
 الـ بيانات تغيير والإيميل،Ownerيطلب والتليفون، (الاسم،
والهوية)
 وأمان)Owner استرجاع بيانات لأنها (مقترح، بس
بسOwner  ( قرارbank.change الـ)PO، تغيير IBANيطلب
الـ أو بعته، طلبOwnerاللي يسحب
(للقراية) وقراراتهاالكل الطلبات يشوف
):Entry pointsالمداخل
 الدعوة إيميل ←  01.1 (أوUI 01.1B /  اللينك).01.1C حالة حسب
.UI 01.2 مباشرة البوابة جلسةرابط غير من داخلي لينك أي أو
.UI 01.3  ← UI 01.2D** password?" فيForgot 01.2 وUI password"، فيReset
 Resetإيميل ←  01.4 (أوUI منتهي01.3B لو
This. changed"إيميل was password أوYour sign-in" لينكNew ← me" not was "This ←  01.3N زرارUI وكمان
.OV 11.13 me" not فيwas
. UI للـ دخول Ownerأول ←  01.5 الحسابUI منيو من كده وبعد started". ومنGetting الداشبورد، كارت ومن 11.19،
.Company & agreement" ← الحساب منيو agreement" & "Company ←  01.6 ومنUI تابProperty".
 عام بانر waiting…" is version agreement new "A ←  01.6L OV أوOwner( 01.6N-R) (غيره).UI
 إشعار / إيميل agreement" new the (للـAccept منOwner زميلHoteliana من أو 01.6L مباشرة.OV
).REF 00.E ( 01.6H  / 01.6G  / UI 01.6F  ← التغيير طلب قرار إشعار
.Company change" Requests" in "See ← تابProperty ← نوعRequests" على متفلتر
) 07.36 UI change" a "Request Finance( ← terms payment & )Bank ←  01.6C والـUI متختارIBAN أوOwner
(غيره الرفض شاشة

---

**p. 39**

 replacement" فيRequest preview Document ←  01.6C متختارUI والمستند
 الرخصة / مستند انتهاء بانر ←  01.6C متختارUI والمستند
).H.01 ←  جديد إيميل تأكيد إيميل مرسومة، (مش عامة تأكيد صفحة
2 قواعد. البيزنس
A.01 التفعيل
: SUP-2 (الـBR-01-01 الشركة في حساب أول )Owner دعوتهHoteliana وبتبعت بتعمله اللي هي المورد بيانات تكمّل ما بعد
"Set by Hoteliana - it cannot be Draft ← بيحددهInvited الشغل إيميل وHoteliana). التفعيل شاشة من :مايتغيرش
changed here."
.)6 الـBR-01-02 بيدعوهم الفريق أعضاء أوOwner منAdmin 08 Flow من وبيفعّلوا الشاشة، (شوفنفس مختلف بنص
 الدعوةBR-01-03 لينك وصالحSingle-use أيام7، يتقبل ما قبل صلاحية أي بيدّي ومش الإرسال، وقت من 08.R قاعدةREF
). القديم12 اللينك بتلغي الدعوة إرسال إعادة
 الباسوردBR-01-04 الأقل8 على واحد ورقم الأقل، على واحد وحرف الأقل، على حروف  ( 01.4 أقصىUI (مقترح128). حرف
عربي وحروف ورموز مسافات مسموح (مقترح). @ قبل جزء أو الإيميل نفس هو مايبقاش
 بتتعلّمBR-01-05 القواعد بيكتب زراروهو account". Activate يطابق. والتأكيد تتحقق القواعد كل لما بيتفتح
 الحسابBR-01-06 بيعمل: التفعيل يتحفظActive والباسورد وHash، يتحرق، واللينك كود)، غير من طول على تبدأ لأنFA2جلسة
.) SUP-2 ( Owner تبقى المورد وحالة (مقترح)، الإيميل على وصل نفسه الـOnboardingاللينك ده لو
). منBR-01-07 جديدة دعوة طلب 01.1B للـUI Owner: بيروح Hotelianaلـ day"( working one within … لعضوusually
  بيروح دعاهالفريق (والـللي كلOwner واحد طلب أقصى اتقفل). دعاه اللي لو ساعة24 (مقترح الإيميل لنفس
B.01 الدخول والتحقق
.Trim BR-01-08 الإيميل الباسورد. + الشغل بإيميل الدخول الحروف لحالة حساس لهمش ومعمول
. BR-01-09 رسالة ← الباسورد أو الإيميل في غلط عامة :واحدة password" or email إنIncorrect ولا غلط، فيهم أنهي مانقولش
موجود مش الإيميل
). BR-01-10 غلط5 محاولات يتقفل الدخول ← الإيميل نفس على بعض ورا دقيقة15  ( 01.2D يظهرUI الغلط التانية المحاولة من
." الباقي العدد minutes 15 for locks sign-in before left يخلصattempts القفل ما بعد أو صح دخول بعد بيتصفّر العداد
 BR-01-11 بيتعامل موجود مش اللي الإيميل بالظبط الشكل تقريبًا)بنفس الرد زمن ونفس الظاهري العداد ونفس الرسالة (نفس
حساب عنده مين يعرف محدش عشان
).reset your password now and sign in straight away"( BR-01-12 Reset ← مقفول وهو الباسورد فورًا القفل يفك
. منBR-01-13 كود ← صح باسورد بعد أرقام6 صالح الإيميل، على دقايق10 مقنّع بيظهر الإيميل
. o•••••••@jewaralsafwah.com
. BR-01-14 بيتحقق الكود الـ ما أول يكتملوا6لوحده أرقام اللصق من بتتشال والمسافات الحروف كله. للكود بيشتغل اللصق
"You have 2 more tries on this code - after that, request a BR-01-15 محاولات3 يموت الكود بعدها الواحد. الكود على
new one below."
BR-01-16 code" بعدResend بيتفتح ثانية60 (عداد 00:45" in code new a request can You الجديد الكود القديم). بيلغي
 works."( longer no code earlier أقصىThe 5). في أكواد دقيقة15 (مقترح
 BR-01-17 غلط10 كود محاولات في الباسورد15 قفل نفس ← الأكواد) كل (على دقيقة (مقترح15 دقيقة

---

**p. 40**

: BR-01-18 time" next here code the skip - days 30 for device this دهTrust والمتصفح ده الجهاز على بس الكود بيسقط
يوم30 أو الباسورد، تغيير مع بيتلغي الباسورد. مابيسقطش me، أوNot أمني، خروج أو .Deactivate،
بعدBR-01-19 FA2 ←  موجودnext لو وإلاP5.5 ماخلصشOwner)، لسه started Getting ←  01.5 كدهUI غير ،
الداشبورد
New sign-in to your Hoteliana account" BR-01-20 من دخول جديد (مشجهاز إيميلTrusted ← كده) قبل شافه ومش
 والوقت والمدينة الجهاز me"فيه not was (مقترحThis
). الـBR-01-21 المستخدم Deactivated باسورد كتب اللي صح ←  11.14 (مشUI password" or email لوIncorrect
حالته (مانكشفش العامة الرسالة ← غلط الباسورد
C.01 نسيت الباسورد
".has a supplier account, a link is on its way If BR-01-22 ← اللينك طلب  دايمًا  01.3A UI sent" link بنصReset
لأ أو موجود الإيميل سواء
 الـBR-01-23 لينك Reset صالحSingle-use دقيقة30، قبله اللي كل بيلغي جديد لينك link". another بعدSend ثانية60
 وأقصى الساعة5(مقترح)، في لينكات تظهر الشاشة ونفس بصمت بتتجاهل الزيادة (مقترح،
. مستخدمBR-01-24 أو موجود، مش إيميل لـ: بيتبعت مش الإيميل بيتبعتDeactivated ← ماتفعّلش لسه اللي المدعو للمستخدم
  جديدله من الدعوة الـإيميل بدل (مقترحReset
 قواعدBR-01-25 بنفس الجديد الباسورد وBR-01-04 آخر، من واحد باسوردات3مايبقاش (مقترح).
تقفلBR-01-26 التانية الجلسات كل بيعمل: الجديد الباسورد حفظ device." other every on out you signs وكلSaving )،
."This was not me" وإيميل يتفك، المحاولات وقفل تتلغي، الموثوقة changed"الأجهزة was password Hoteliana فيهYour
D Not me.01
 لينكBR-01-27 me" not was وThis جديد، جهاز من الدخول وإيميل الباسورد، تغيير إيميل في: موجود 11.13 صالحOV أيام7.
و .Single-use(مقترح)
علىBR-01-28 الضغط me" Not بيعمل تقفلفورًا الأجهزة كل على الجلسات كل (مقترح): والأجهزةsecurity_logout )،
 و تتلغي، يتقفلالموثوقة الحالي بالباسورد ولينكالدخول جديد، باسورد يتعمل ما لحد يتبعتReset 01.3N UI .)  الشاشة⚠ نص
).Q-01-06 it" choose you until changes account your on الأمانnothing مش البيانات معناه
 الجديدBR-01-29 الباسورد بعد 01.4N UI ) ←  01.4D UI قايمة مسجّلة كانت اللي الأجهزة والمدينة،كل والنظام، (المتصفح
."devices Sign out the other). وعلامة نشاط، device"وآخر "This / password" the Changed · " / واحدUnknown" زرار
 BR-01-30 me لـNot إشعار بيبعت الأمان)Hoteliana (فريق وللـ الـOwner، هو مش المستخدم لو فيOwner وبيتسجل (مقترح).
عملهم ومين الباسورد، وتغيير الخروج، السجل:
E Getting started.01
 BR-01-31 8 خطوات الحساب مستوى للكلعلى اتعملت مرة اتعملت اللي الخطوة مستخدم). لكل (مش
 الخطوةBR-01-32 حالات action Next / متعملةComplete مش مفتوحة خطوة (أول Locked / next سببUp (وجنبها
Hotelianaالقفل for Waiting (أزرق، زرار .)مش
Steps 6-8 unlock once at least one hotel is :Linked الخطواتBR-01-33 يبقى8-6 الأقل على واحد فندق ما لحد مقفولة
) وخطوةapproved." 8 live( متقبلةGo تكون الحالية الاتفاقية محتاجة كمان
You are live. الـBR-01-34 لما و8 الحساب، منيو من يختفي والعنصر الداشبورد، من يختفي الكارت يخلصوا: واحدةToast مرة
.Complete book now can Agents الـ من تفتح تفضل نفسها الصفحة (مقترح). الخطواتURL." وكل

---

**p. 41**

 BR-01-35 المكتملة الخطوة مابترجعش الـ بعد التغييرات جديدة). اتفاقية نسخة (مثلاً بعدين اتغيرت حاجة لو بانراتهاOnboarding ليها
.(P1.5)
F.01 صفحة الشركة والاتفاقية
"Read Chip "Hoteliana keeps these; you request changes." : BR-01-36 كلها البيانات بسHotelianaملك وللقراية
 الهيدرonly" في
الحساسةBR-01-37 البيانات number وPhone email، · phone وOwner ID، owner وCompany IBAN، Bank مقنّعة)
"shown until you( .افتراضيًا وOwner يكشفوهاAdmin يقدروا revealed" details مكشوفة وبتفضل الصفحة)، يسيب ما لحد
).UI 01.6N-R ( page" this leave الباقيين (مقترح). السجل في بيتسجل الكشف يكشفوها). مايقدروش
Company owner ID +( Tourism المستنداتBR-01-38 جدول registration وCommercial certiﬁcate، وTax license،
Expired / Change letterو guarantee الحالةBank موجودين). لو soon Expiring / (منValid يوم90 مقترح الانتهاء، قبل
.pending
.)in-app + email( Admins الانتهاءBR-01-39 تذكير و90 و30 أيام7 للـ التاريخ، قبل والـOwner
:API BR-01-40 المستند انتهاء أثر من مستندHotelianaبيتحدد نوع لكل  ( بتقراSUP-6 والبوابة الـeffect) من
"An expired document pauses new supply contracts until a الشاشةpauses_new_contracts على الحالي (النص
warn_only: approved." is أوreplacement أوblocks_selling)، warn_only، بقرار. السياحةPOاستثناء رخصة
.)BR-01-72( يقرر والأدمن
 (مقترح).BR-01-41 السجل في بيتسجل التحميل الصفحة. يشوف اللي لكل مسموحين والتحميل المعاينة
G.01 الاتفاقية
"it is BR-01-42 Hoteliana قبول. وميعاد سريان بتاريخ جديدة نسخة بتنشر بصمت بتتطبق ما عمرها الجديدة :النسخة
published, you review it, and you accept it."
"Accepting the agreement binds the company, so only the BR-01-43 بسOwnerالـ الشركة بيلزم القبول لأن يقبل،
account Owner … can do it."
"Open the full document ﬁrst - acceptance unlocks after) بالترتيبBR-01-44 بيحتاج القبول الكامل1 المستند فتح
it." seen have علامة2)،you )3) version" Accept الـ لحدCheckbox". مقفول لحد1 مقفول والزرار وكل2)، )،
السبب جنبه واحد
 والوقتBR-01-45 والتاريخ والدور، الاسم، القبول: سجل والـUTC+3 وIP)، المستند، فتح ووقت والجهاز، نسخةSHA-256، للملف.
 على بتتبعت للشركةموقّعة المسجّل .الإيميل
. BR-01-46 الجديدة النسخة بس الجديدة الحجوزات على :بتطبق only" bookings new for v1.3 بيفضلreplaces حجز كل
 تأكيده وقت سارية كانت اللي النسخة على
Version 1.3 stays in force until then." BR-01-47 القديمة النسخة القبول، لحد :سارية
 قبولBR-01-48 غير من القبول ميعاد بعد accepted" is it until paused is contracts يعنيpublishing الشاشة). (نص
 بسبب بيترفض مخزون أو أسعار تغيير أي ونشر جديد عقد agreement_not_acceptedتفعيل . بيكمّل الحالي وبعدالبيع يوم14.
14 سماح ( SUP-10 ) بتعملHoteliana hold Distribution accepted"( not يقفAgreement والبيع الـ⚠) ماذكرتش الشاشة
).Q-01-02يوم
.email + )Needs you( in-app الـBR-01-49 تذكير بـOwner الميعاد قبل و7 و3 يوم1 (مقترح)،
 الـBR-01-50 غير للـOwner النسخة يبعت يقدر كلOwner مرة مباشر. بلينك إشعار + إيميل ساعة24: (مقترح مستخدم لكل
 تبقىBR-01-51 القديمة ← اتقبلتش ما لسه والقديمة اتنشرت أحدث نسخة بسSuperseded الأحدث قبول والمطلوب قبول، غير من
(مقترح

---

**p. 42**

H.01 طلب التغيير
"One open request per detail - a detail already under review stays locked BR-01-52 بيانة لكل واحد مفتوح :طلب
 decides." Hoteliana البياناتuntil من عدد أي يضم ممكن الواحد الطلب
الـBR-01-53 البيانات :14 COMPANY name( company number،City،Country،Legal address،Phone )،Email
DOCUMENTS registration( certiﬁcate،Commercial license،Tax letter،Tourism guarantee Bank ))،optional(
BANKING & OWNER name( owner number،Company phone email،Owner ID،Owner owner Bank،Company
.(IBAN
"Current records remain active until Hoteliana BR-01-54 الحالية القيمة سارية مابتفضل لحد توافقHoteliana
approves it."
.)PO BR-01-55 Hoteliana لوحدها بيانة لكل النتيجةبتقرر أوApproved. (كله)، أوRejected (كله)، approved (قرارPartly
  مكتوبالرفض سبب معاه بيانةلازم لكل
 المستنداتBR-01-56 أوPDF أوJPG لحدPNG 10، MB ومعاها انتهاء، وتاريخ إصدار البنكتاريخ خطاب أوPDF. لحدJPG بس،
.MB 10
 BR-01-57 address وEmail email Owner للإيميل بيتبعت تأكيد لينك ماالجديد: قبل صالحHoteliana تراجع. ساعة24
)  خلال اتأكدش ما لو أيام7(مقترح). بتنتهي دي البيانة (مقترح) يكمّلExpired والباقي
Hoteliana ← BR-01-58 number phone كودOwner بيقول التصميم الجديدSMS: للرقم الـSMS في مقفول القرارMVP لحد
.)Q-01-04( "Hoteliana calls the new number to conﬁrm  يبقى والسطر المراجعة، وقت بمكالمة الرقم it."بتأكد
Owner BR-01-59 name company وLegal التجاري، السجل يطابق لازم name owner الـCompany هوية يطابق لازم
.) SUP-7 يدوي،Hoteliana( بتتحقق
 تغييرBR-01-60 بيطلبCountry بعضCity مع (البيانتين تلقائيًا كمان الجديدCity البلد مدن قايمة من بيتختار
) السحبBR-01-61 الحاليةWithdraw والقيم البيانات، قفل بيفك السحب الطلب. في بيانة أي على قرار مفيش ما طول مسموح
 تموت التأكيد ولينكات تفضل،
BR-01-62 المقبولة القيم القرار، بعد فورًا فيبتظهر 01.6 بيتحفظ.UI القديم والتاريخ ،
. CHG-00043 السيرفرBR-01-63 من الطلب رقم
 BR-01-64 Review" عادة عمل2خلال أيام مش معلومة ده الشاشة). (نص ملزمSLA
I.01 تغيير البنك
 BR-01-65 بسOwnerالـ  ( والـbank.change تاني، لحد مايتدّاش مايقدرشAdmin).
 BR-01-66 معاه لازم الطلب البنك خطاب الحساب صاحب اسم وفيه: بالظبط القانوني الشركة اسم والـزي وختمIBAN، كامل،
.  إصدار وتاريخ آخرالبنك، يوم30خلال
BR-01-67 يتبعت: الطلب ما أول تتوقف المدفوعات hold( الموردPayment مستحقات كل على SUP-5) /  L11 البيع).
.)"Your bookings and statements keep counting - nothing is lost." : UI 07.20H بتكمّلمابيقفش والكشوفات
≠ Maker BR-01-68 Hoteliana بتتصل عندها المسجّل بيوافقبالرقم سجّل اللي غير تاني وموظف الطلب)، في اللي الرقم (مش
 Checker والإيميل للـالقديم)، بالتغييرOwner إشعار له بيتبعت
الجديدBR-01-69 الحساب الموافقة: بعد الرفضVeriﬁed بعد دورة. أقرب في بتتدفع المتأخرة والمدفوعات يتشال، والإيقاف ،
تاني سبب مفيش لو يتشال والإيقاف يفضل، القديم الحساب
 بيتسجل.BR-01-70 وده تاني)، سبب مفيش (لو يتشال الإيقاف ← القرار قبل البنك طلب سحب

---

**p. 43**

J.01 انتهاء المستندات والرخصة
.BR-01-40 بـBR-01-71 بيمشي انتهاء تاريخ له مستند كل وBR-01-39
): BR-01-72 في والأدمن يبيع، بيفضل المورد تنتهي: لما المورد بتاعة السياحة يقررHotelianaرخصة اللي هو (قرار يسيبهPO يا
  الجديدة. الحجوزات يوقف يا مراجعة، تاريخ لحد أوتوماتيكيبيع إيقاف البوابةمفيش من
:Tourism license expired") دهBR-01-73 الجديدة، الحجوزات وقف الأدمن لو منPause Hoteliana 10( بسببFlow
يعدّل يفضل والمورد حجوزات، ومابيلغيش مخزون، ولا أسعار مابيمسحش
 عاديBR-01-74 تغيير طلب = جديدة رخصة رفع ظاهرة01.6C-TL بتفضل القديمة الموافقة.Expired). لحد
)Happy path( 3 الفلو. الأساسي
3.1 أول دخول للـ Owner من: الدعوة لحد قبول الاتفاقية
 الدعوة .1إيميل
 +Activate account" + منيشوف: إيميل :Hoteliana ready" is account supplier Hoteliana زرارYour + الشركة اسم
." This invitation expires on"
 الزراريعمل: يضغط
.Deactivated: الـالسيستم: من يتحقق مشToken والمستخدم ملغية، مش والدعوة منتهي، ومش مستعمل، ومش موجود،
.UI 01.1  كده بعد
. 2.) UI الباسورد 01.1إنشاء
 /Create your password" / " :Invitation veriﬁed by Hoteliana · Supplier" / "Welcome to Hoteliana." يشوف
 /New password / Conﬁrm password / )"Set by Hoteliana - it cannot be changed للقراية الشغل here."إيميل
.Need a new one? Contact Hoteliana support" / ".days This invitation expires in" / "Activate account"
) القواعديعمل: الباسورد. يكتب letter one least At / number one least At / characters 8 least بتتعلّمAt
). الباسورد تكشف العين أيقونة 01.1Aبيكتب. UI التأكيد. يكتب
Meet all the rules above to السيستم account" كلهاActivate القواعد ما لحد مقفول
الـcontinue." يحفظ الضغط: بعد والمستخدمHash). اللينك، ويحرق والموردActive، Invited، ← جلسة،Onboarding ويبدأ ،
. السجل user.activatedويكتب
Your account is active." Getting started + Toast UI 01.5  كده بعد
. 3.( UI 01.5 ) Getting started
"v1.3 · SUPPLIER يشوف ,Welcome" " / كروت3 ACCOUNT on" 2FA · veriﬁed Access · وActive AGREEMENT،
1 of 8 acceptance" your for وWaiting HOTELS، begin" to hotels Select · linked قايمة0 / خطوات8
."NEXT BEST ACTION") / كارتcomplete"
.)2 يضغطيعمل: proﬁle" company your الخطوةReview (أو
 حاجة.السيستم: لا
.UI 01.6  كده بعد
. 4.) UI الشركة بيانات 01.6مراجعة
SUPPLIER LEGAL PROFILE / "Request changes" / "Read only" Chip / "Company & agreement" يشوف
.COMPLIANCE DOCUMENTS / HOTELIANA SUPPLIER AGREEMENT / )"Show و مقنّعة الحساسة details"(البيانات

---

**p. 44**

 يضغطيعمل: details" يضغطShow ويقرا. (اختياري) مستندView" أي على
 السيستم details" السجلShow في ويكتب بيكشف منcompany.details_revealed للصفحة فتح أول أوOwner.
.Document preview OV 01.6  ← "View" خطوةAdmin ← 2 (مقترحComplete
 كده: الصفحةبعد في يفضل
. 5.) OV مستند 01.6معاينة
ISSUE DATE / EXPIRY DATE / / " Issued by / يشوف DOCUMENT" COMPANY المستندVERIFIED اسم
View-only document. Any replacement requires a change request / "Current ﬁle" / الملفSTATUS اسم
."Request replacement" / and Hoteliana approval."
. ✕ ← يعمل ﬁle" أوCurrent (مقترح). جديد تاب في يفتح الملف
 الـالسيستم: لما الإجبارية3 مستندات وحدValid خطوةOwner/Admin ← الصفحة فتح 4) (مقترح).Complete
.UI 01.6 كده: يرجعبعد
. 6.) OV القبول 01.6Lفتح
Review and accept the Supplier خطوةيشوف: أو البانر من :3 version" new the accept and (أوReview
 نسخةAgreement" لأول Published · by accept "… / CHANGED وعددWHAT الملف / نسخة) أول في ظاهر (مش
of the and I accept version I am an authorized representative of / document"الصفحات full الإقرارRead
Owner. This acceptance is recorded with my · Hoteliana Supplier Agreement on its behalf. Signing as
"Open the full document ﬁrst - acceptance unlocks device and time date, role, ".name, مقفولCheckbox(
" it." seen have you after / later" "Decide / version" Accept (مقفول
."Read full document" يعمل
كده بعد  01.6A-L OV النسخة (معاينة ).الجديدة
. 7.) 01.6A2-L  / OV المستند 01.6A-Lقراية
" / يشوف ONLY" READ · SUMMARY الملفAGREEMENT اسم / on Hoteliana by Uploaded / الصفحات
 + PDF" "Download / 2" of 1 أسهم.Page
.) ✕ ويقفليعمل: يقرا
يسجّلالسيستم: لـagreement.document_opened الرجوع بالوقت. 01.6L1 OV : 10:14" Sep 15 Opened والـ✓ ،
 بيتفتح.Checkbox
 .8.) 01.6L2  ← OV والقبول 01.6L1الإقرار
" يعلّميعمل: version Accept يضغطه. ← يتفتح
المستخدمالسيستم: يتحقق: القبولOwner يسجّل اتفتح. والمستند والمنشورة، الأحدث هي لسه والنسخة ).BR-01-45،
. تبقى الجديدة (أوActiveالنسخة والقديمةScheduled بعدين) السريان لو للإيميلSuperseded الموقّعة النسخة يبعت
 عنصر يقفل الكل. عند من البانر يشيل youالمسجّل. خطوةNeeds 3. Hoteliana لوComplete. المورد. سجل في القبول تشوف
والمستندات قبول أول منValidده يقرب المورد ← Active ( قرارSUP-2 ).Hoteliana،
accepted · your acceptance record is stored below and a signed Version كده بعد  01.6P الأخضرUI بالبانر
."copy was sent to your registered email
 .9Flow 02). منالفنادق. started خطوةGetting 5 hotels" request / "Select ← Library Hotel 02( فيFlow الخطوات باقي
.Flow 04 03و وFlow

---

**p. 45**

3.2 الدخول اليومي
 .1.Login UI 01.2
"Need help / "Sign in" / "Forgot password?" (+ يشوف back" "Welcome / Password / email عينWork
.accessing your supplier account?"
.)Enter ويضغطيعمل: يكتب in" (أوSign
 والجهازالسيستم: صح لو يتحقق. ومشTrusted صح لو طول. على جلسة ← ينTrusted ← كود.Challenge ويبعت
).Trusted كده بعد  01.2B لوUI مباشرة الوجهة (أو
. 2.Email 2FA UI 01.2B
"We sent a 6-digit code to o•••••••@… It works for 10 / "ONE MORE STEP · Check your email" يشوف
Trust this / "Paste the whole code or type it - it checks itself once all 6 digits are in." minutes." / خانات6
."Back to sign in" / "You can request a new code in 00:45" / "Verify and sign in" / device for 30 days…"
 ويعلّميعمل: يكتبه، أو الكود يلصق device" this عايزTrust لو
auth.signed_in متعلّمالسيستم: (لو + جلسة ← صح السادس. الرقم عند لوحده يتحقق 30 token سجلDevice + يوم
).BR-01-20( "New sign-in" وIP( والجهاز، إيميلtrusted، ← جديد جهاز لو نعم/لأ).
.BR-01-19 كده بعد
3.3 طلب تغيير (بيانات مثال إيميل: الـ Owner + شهادة )الضريبة
 .1."Request changes" ← UI 01.6
). الصلاحيةالسيستم: من يتحقق مفتوحةOwner/Admin بطلبات المقفولة البيانات يجيب
.UI 01.6C  كده بعد
. 2 01.6C البياناتUI اختيار
"Select only the details you need to change. One open request per / "Request company changes" يشوف
3 details are locked detail…" / DETAILS CHOOSE · 1 (قايمةSTEP فيCheckboxes بانر3 قفل: فيه لو / مجموعات)
"Withdraw that request from Requests if you need to change them now." + by request CHG-00042"
"The commercial agreement is not a data عليها دي CHG-00042"والبيانات · سطرPending / ومقفولة
Review changes" / "Cancel" / "Nothing selected yet · Tick a detail on the left…" :STEP 2 / correction…"
.)"Pick at least one وجنبه detail."(مقفول،
.Tax certiﬁcate" يعلّميعمل: email" وOwner
.UI 01.6C2  كده بعد
. 3 01.6C2 الجديدةUI القيم إدخال
"A veriﬁcation link is sent to the new address before" + بيانةيشوف: لكل Current القاعدة: سطر + الجديد حقل
. it." reviews والانتهاءHoteliana الإصدار تاريخ + رفع منطقة للمستند: send"). to "Ready + عام:Remove" سطر
"Document changes accept PDF, JPG or PNG up to 10 MB and need issue and expiry dates. The current
."Review 2 changes" / "Cancel" / approved ﬁle stays active until Hoteliana approves the replacement."
 التاريخينيعمل: ويكتب الملف، ويرفع الجديد، الإيميل يكتب
). السيستم (قسمValidation حقل لكل فورية السيرفر8 على مؤقتًا بيتحفظ والملف تقدم)، (شريط طول على بيتعمل الرفع
 attachment( بعدDraft يتمسح ساعة24، مقترح). اتبعتش، ما لو

---

**p. 46**

. UI 01.6D  ← "Review 2 changes" كده بعد
. 4 01.6D المراجعةUI
"Check every new value before sending it to Hoteliana. Nothing / "Review requested changes" يشوف
All / FIELD / CURRENT RECORD / REQUESTED VALUE / EVIDENCE / approved." is it until جدولchanges
"Submit / "Back to edit" unchanged…" remain records unselected / PROCESS APPROVAL خطوات4(
.request"
."Submit request" يعمل
البيانةالسيستم: نفس على مفتوح طلب مفيش السيرفر: من تاني يتحقق ينشئRace موجودة. والملفات والصلاحية، )،
بحالةCHG-00043 Pending للـ ويبعت الجديد، للإيميل التأكيد لينك ويبعت البيانتين، ويقفل queue، Supply ،Hoteliana
. company_change.submittedويسجّل
Request CHG-00043 sent to Hoteliana." Toast + UI 01.6E  كده بعد
. 5 01.6E اتبعتUI
"CHANGE REQUEST / "PENDING REVIEW · Submitted just now" / "Your changes are under review" يشوف
) /Pending" / "waiting for the owner to conﬁrm this email" / DETAILS" 2 · وحالتهاCHG-00043 القيمة بيانة لكل
/ Supplier notiﬁed ← Decision per detail ← (In progress) Hoteliana review ← ✓ Review timeline: Submitted
 request" "Withdraw / agreement" & Company to "Return / Library" Hotel to خطوةContinue لو (بس في5
 started ماخلصتشGetting
  الجديد الإيميل صندوق (من الجديد الإيميل .6تأكيد
.Conﬁrm email" + "on Hoteliana Conﬁrm this email for إيميليشوف:
 يضغط.يعمل:
 دخولالسيستم: غير (من عامة صفحة change." the review now will Hoteliana conﬁrmed. ←Email البيانة
.company_change.email_verified سجلPending للمراجعة). (جاهزة
 .7.Hotelianaقرار
 بيانةالسيستم: كل أوApproved إشعارRejected فورًا. سارية تبقى المقبولة القيم بسبب. email + وللـin-app الطلب لصاحب
).9 (قسمOwner
 كده: الإشعاربعد يضغط المستخدم 01.6F اتقبلUI (كله اترفض01.6G (كله (جزء01.6H
)Alternative ﬂows( 4 الفلوهات. البديلة
Owner. الـA1 من دعوة بيفعّل فريق عضو
.) OV 08.1 ( Flow 08 المحرّك أوOwner منAdmin دعاه
": Supplier · Invitation from الخطوات إيميل1 ) to you invited Hoteliana الدورon + )2"  01.1 مختلفUI بنص
)4) asو invited were You و by." Set · email Work - here changed be cannot ".it ← الباسورد3 قواعد نفس
.Activate account"
). النهاية Active ويروح وجلسة، (مشالداشبورد، started دعاهGetting للي وإشعار )، team your "joined حالةInformation(
.Active في 08الدعوة تبقىFlow
. جديدةA2 دعوة طلب ← انتهت الدعوة

---

**p. 47**

 عليهالمحرّك: عدّى اللينك أيام7
Invitations stay valid for 7 days. Your account is still / "This invitation has expired" UI 01.1B  )1 الخطوات
Request a / )"The new invitation goes to this address." / link." new a send to Hoteliana ask - الإيميلwaiting
) invitation" new ← يضغط2 لـ3) ويبعته الطلب يسجّل السيستم (للـHoteliana) والنصOwner فريق، (لعضو دعاه للي أو
"…It usually arrives within one working / "New invitation requested" UI 01.1B2  (4 ← ("to send a new link ask"
"Nothing arrived? Check your spam folder before asking again." / "Back to sign in" / day."
asks  عندالنهاية: مفتوح طلب Hoteliana Flag( expired" المورد،Invite على إشعارSUP-2 أو you) دعاهNeeds اللي عند
 invitation new a "for + invitation" خلالResend تاني الضغط نفس24). ساعة: تاني.01.1B2 طلب ومابيتبعتش
. كدهA3 قبل مستعمل دعوة لينك
 كدهالمحرّك: قبل اتفعّل اللينك
Sign in with the . This invitation link was used on" / "This account is already active" UI 01.1C  الخطوات
Forgot your password? Reset it from then set you الإيميلpassword / in"." "Sign ←  01.2 مكتوبUI والإيميل
the sign-in screen."
 العاديالنهاية: الدخول
. موثوقA4 الجهاز
 المحرّك token المتصفحDevice نفس على صالح
.UI 01.2B الخطوات غيرLogin من طول على الوجهة ← صح
.trusted_device = true السجلالنهاية: جلسة. بـauth.signed_in
. الكودA5 إرسال إعادة
 انتهىالمحرّك: أو ماوصلش الكود
)4) الخطوات بعد1 ويظهر60) يختفي العداد ثانية code" "Resend ( 01.2B2 UI ) ← يضغط2 يموت3) والقديم جديد كود
01.2B3 UI : works." longer no code earlier The o•••…. Check · sent code منNew يبدأ والعداد والخانات00:59 ،
تتمسح
.E9 بعدالنهاية: الجديد. الكود مستني 5 في أكواد دقيقة15
. الباسوردA6 نسيت
. UI 01.2D المحرّك password?" فيForgot 01.2 أوUI password" فيReset
Enter the work email on your supplier account. We will send a / "Reset your password" UI 01.3  )1 الخطوات
)2 ← "Back to sign in" / "Send reset link" / )Login / minutes." 30 for works that منlink جاي لو (متكتب الإيميل
has a supplier account, a link is on its way. It works once, for 30 minutes - If" / "Reset link sent" UI 01.3A
"Reset) too folder spam the ".check / in" sign to "Back / link" another Send it? get (بعدDidn't ثانية60 إيميل3
New / ". Choose a new password · For" UI 01.4  (4 ← "Choose a new password" + your Hoteliana password"
"This link / "Save password" / "Saving signs you out on every other device." / Conﬁrm + القواعدpassword
."Save password" (5 ← works once."
. auth.password_reset + الحفظ عند السيستم سجلBR-01-26
FA2 ← النهاية  01.2 أخضرUI بانر + مكتوب والإيميل password." new your with in Sign changed. دخولPassword
 اتلغت).إجباري الموثوقة (الأجهزة

---

**p. 48**

 .A7 me" Not الباسورد غيرّ تاني (حد
. OV 11.13 لينكالمحرّك: me" not was فيThis زرار أو الجديد، الدخول أو الباسورد تغيير إيميل في
الخطوات:
. 1 يتفتح اللينك ما (أول يتقفل،BR-01-28السيستم الحالي بالباسورد والدخول تتلغي، الموثوقة والأجهزة تقفل، الجلسات (كل
 يتبعت).Resetولينك
. 2Someone else changed your password." / "SECURE YOUR ACCOUNT · Take the account back" UI 01.3N
 to link reset a sent We - trust you device a on it "…open / email" the from link the مشOpen تعليمات، (مجرد
."Didn't get it? Send another link" / "Back to sign نص يبقى أو يتشال مقترح ← فعلي in"لينك
. 3"Next you see every device that was signed in, and you + "Choose a new password" UI الإيميل 01.4Nمن
.Save password" ← remove the ones that are not yours."
 .4devices had this account open. " / "NEW PASSWORD SAVED · Where your account is signed in" UI 01.4D
Remove the ones that are not yours - they are signed out at once and cannot come back without the new
"The sign-out and the password change are both / "devices Sign out the other." / الأجهزةpassword قايمة
in the activity log."
 .5/ "Signed out" + 01.4D2يضغط UI in" signed is device this Only · SECURED عليهاACCOUNT الأجهزة
.Continue to the portal"
 لـالنهاية: إشعار الداشبورد. ← مقترح) الإيميل، ملكية أثبت (اللينك ده الجهاز على جلسة وللـHoteliana (أمان) المستخدمOwner لو
).n( سجل هو. وauth.not_me_reportedمش وauth.password_reset، session.devices_signed_out،
 الخطوةملاحظة: في الأجهزة 1 الخطوة زرار السيرفر. من أصلاً اتقفلت 4  مرئي المستخدمتأكيد إن ويسجّل كده بعد بدأت جلسة أي بيقفل
 من مشي المستخدم لو (مقترح). 01.4Dشافها مقفولة.UI برضه الأجهزة يضغط، ما غير من
Owner. الـA8 مش والمستخدم جديدة اتفاقية نسخة
 المحرّك الـHoteliana غير ومستخدم نسخة، نشرت البانرOwner أو الصفحة فتح
الخطوات )1  01.6N-R بزرارUI الجديدة النسخة بانر نفس Owner": the to send & مقنّعةReview الحساسة والبيانات )2،
You 01.6L3 OV version" this accept can Owner the التغييراتOnly ملخص + document" full (مسموحRead
can do it. Send - - Accepting the agreement binds the company, so only the account Owner . · are signed in as
)4) link direct a with notiﬁcation a and email an gets he him: to ".it + "Close" / to" Send ")Owner( ← يضغط3
was emailed and notiﬁed just now. Nothing changes until he accepts. If " / "Sent to the Owner" OV 01.6L4
/ ".v1.4 is not accepted by 30 Sep, publishing contracts pauses - you will see his acceptance in Version history
."Done"
. الـالنهاية: إشعارOwner عنده you Needs لـ بلينك إيميل + أصلاً) موجود مش (لو 01.6L سجلOV
.E24 خلالagreement.sent_to_owner بعت تاني حد لو ساعة24.
"Decide later" .A9
 الـالمحرّك: فتحOwner 01.6L وقفلOV
 كده،النهاية: قبل المستند فتح لو يفضل. البانر تغيير. مفيش تاني).Opened" يفتحه (مايحتاجش دي للنسخة محفوظ بيتفضل
. والتحميلA10 والمعاينة النسخ سجل
. UI 01.6 المحرّك history" أوVersion أوPreview" PDF" فيDownload

---

**p. 49**

الخطوات
history" "Version ←  01.6M وOV اتغير، اللي وإيه السريان، وتاريخ النشر، وتاريخ والحالة، الرقم، نسخة: لكل ومينSHA-256: ،
Waiting for your acceptance) بحالة فوق المستنية النسخة المستند. فتح ووقت وامتى :P7قبلها answer" an وNeeds
 by accept · وزرار accept"" & "Review أوOwner( Owner") the to علىSend الضغط مرسوم). مش (مقترح، (غيره)
معاينتها ← قديمة نسخة
.01.6A2  / OV 01.6A  ← "Preview"
PDF" ينزلDownload الملف ← 01.6B OV started" download "Contract / (مقترحDone" الـToast. بدل ،Modal
(.Q-01-09
 سجلالنهاية: للقراية. (مقترحagreement.downloaded
. نوع)A11 (كل واحدة بيانة فيه تغيير طلب
. UI 01.6C المحرّك فيCheckbox واحد
):01.6E-*  ← 01.6D-*  ← نوع لكل والشكل 01.6C-*الخطوات
السطر في  EVIDENCE01.6E-* في  الإدخال01.6D-* في  النوع01.6C-*
Legal company
(LN) name
"Must match + "New legal company name"نص
the name on your commercial registration -
Hoteliana checks the two together."
"Checked against
commercial registration"
checked against · "
your commercial
"registration
(CO) Country"Pick from the list. + "New country" Dropdown
Hoteliana conﬁrms the new country with your
BR- documents." registration + لوحدهCity يتضاف
(01-60
"Checked against
registration documents"
checked against · "
your registration
"documents
(CI) City"Your hotels keep their + "New city" Dropdown
own addresses - this is the company address
only."
"Address check by
Hoteliana"
company address · "
"only
Phone number
(PH)
"Hoteliana checks مرسوم مش ← الدولةTel بكود
this number with your registration."
"Checked by Hoteliana"""
Email address
(EM)
"A veriﬁcation link is + "New company email"إيميل
sent to the new address before Hoteliana reviews
it."
"Veriﬁcation link · sent to
new address"
waiting for this · "
email to be
"conﬁrmed
Commercial
(CR) registration
"Annual ← مرسوم الإصدارمش تاريخ + رفع
 due" مالوشconﬁrmation التجاري السجل لأن (مقترح،
بقانون )2025انتهاء
" due · · PDF"" due · "
Tax certiﬁcate
(TC)
" · .exp exp"" · MB 1.1 · PDF تاريخين". + رفع
Tourism license
(TL)
تاريخيننفسهنفسه + رفع
Bank guarantee
(BG) letter
"Current: Not uploaded yet تاريخين + ·رفع
optional"
 ← ﬁle"نفسه on الملفNone
Company owner
(ON) name
"Must match the owner ID on ﬁle. If theنص
owner changed, request the owner ID too."
"Checked against owner
ID"
checked against · "
"the owner ID

---

**p. 50**

السطر في  EVIDENCE01.6E-* في  الإدخال01.6D-* في  النوع01.6C-*
Owner phone
(OP) number
(BR-01-58) + Tel"Hoteliana calls to
"SMS code · (بدلconﬁrm"
(sent to new number"
Hoteliana will call · "
"to conﬁrm
Owner email
(OE)
to sent · link Veriﬁcation تأكيد لينك + إيميل
new address"
waiting for the · "
owner to conﬁrm this
"email
Company owner
(OI) ID
" · .exp exp"" · MB 0.8 · PDF تاريخين". + رفع
Bank IBANA13——
one open request per detail: this detail is now locked until · -Request reference CHG النهاية  01.6E-* بـUI
".decided
. الطلبA12 قرار
 المحرّك المراجعةHoteliana خلّصت
الخطوات:
The new values are now the active / "Your company record has been updated" :( UI 01.6F ) Approved
"The approved / Complete record." supplier / information" (القيمApproved )Approved / كلهاTimeline
"Continue / UI 01.6  ← "View updated company record" / values are now visible on the Agreement page."
.)Onboarding Library" Hotel الـto في (بس
"Your existing approved company / "The requested changes were not approved" :( UI 01.6G ) Rejected
 / resubmit." and details, the correct below, reason the Review active. remains السببdata وجنبها بيانة كل
.A14 ← "Edit and resubmit" / "Return to Company & agreement" / "Rejection reason: …"
OF " / "Decision by detail" / "Two changes approved, one rejected" :( UI 01.6H ) Partly approved
 "APPROVED / record" company updated "View / detail" rejected the "Resubmit ← بسA14 بالمرفوضة
 ساريالنهاية: القديم المرفوض ساري. المقبول يتشال. البيانات على القفل
 البنكيA13 الحساب تغيير بس)Owner.
. UI 07.36 المحرّك IBAN" فيBank 01.6C أوUI change"، a فيRequest
الخطوات:
. 1"Current: SA03 8000 ···· ···· ···· 4417 · Al Rajhi Bank" 01.6C والـUI متعلّمIBAN 2 مقترحSTEP مرسوم، (مش
"Must match the legal / IBAN" "New / name" holder سطرAccount مع ومقفول، القانوني الشركة باسم مسبقًا (مكتوب
"Upload the bank + "Bank letter" / )IBAN exactly." name )company / الـBank" في البنك كود من لوحده (بيتملى
"Payments to you pause from the moment you send this until Hoteliana conﬁrms it by / ثابتletter" سطر
calling the owner on the number already on ﬁle."
 .2"Hoteliana / "BANK IBAN · EVIDENCE · Upload the bank letter" : OV 01.6J  ← "Upload the bank letter"
needs a stamped letter from the bank to change the IBAN. A person checks it, so the details below must
/ "Drop the letter here or browse · PDF or JPG · up to 10 MB" / match - usually within 2 working days."

---

**p. 51**

/ "Cancel" SHOW" MUST LETTER والـTHE الشركة، اسم زي الاسم خلالIBAN: إصدار وتاريخ والختم كامل، يوم30
 letter" يتختارAttach ملف ما لحد (مقفول
 .3"Attach ← "Replace ﬁle" + "Remove" + "✓ bank-letter-sep-2026.pdf · 240 KB" : OV ملف 01.6J2يختار
 يرجعletter" ← 2 ظاهر.STEP والخطاب
 .4"Payments pause while this is checked. Selling does changes" "Review ←  01.6D خفيفUI أحمر سطر وفيه
."Submit request" ← not."
 .5A bank"( والـCHG-السيستم وIBAN، مقفول، hold الـPayment لإيميل وإيميل المستحقات، كل على Owner القديم
for requested was change account . now Hoteliana contact you, not was this لـIf وإشعار Hoteliana.")،
 وسجلFinance bank_change.requested، مقنّعIBAN(
 .6+ "Bank IBAN · SA•• ···· 9012 · Hoteliana will call the owner on the number on ﬁle" 01.6E بسطرUI
."…reason: bank account check · Payments to you are paused · Since" UI 07.20H overview يعرضFinance
 .7call-back by · · Veriﬁed تانيHoteliana (موظف وتوافق تتصل 01.6F UI +  07.36 الجديدUI بالحساب
" + دفعHoteliana دورة أقرب تدخل المستحقات + يتشال الإيقاف
.)BR-01-69. زيالنهاية: يتشالA12 والإيقاف ساري القديم الحساب اترفض: لو
. المرفوضA14 إرسال وإعادة تعديل
."Resubmit the rejected detail" المحرّك resubmit" and أوEdit
 الخطوات  01.6C UI المرفوضة والبيانات اترفضت اللي بالقيمة ومليانة سطرمتعلّمة بيانة كل وفوق يبدّله)، ويقدر متعلّق، (والملف
.Submit request" ← "Review changes"" ← onأحمر Rejected  يعدّل:
النهاية: طلب بالقديمجديد ومربوط جديد، برقم CHG-00042" from مقترح).Resubmitted ،
. الطلبA15 سحب
.Requests المحرّك request" فيWithdraw 01.6E تابUI من أو
.Hoteliana stops reviewing it" / "?-Withdraw change request CHG" OV 01.6K  الخطوات
Details
: الطلبالسيستم: Withdrawn فيه ولو تموت، التأكيد ولينكات تتفك، والبيانات لـIBAN، إشعار تاني). سبب مفيش (لو يتشال الإيقاف
.company_change.withdrawn. سجلHoteliana
." النهاية  01.6 UI + Toast -CHG" يختفيwithdrawn الطلب بتاع والبانر
 started Getting الأولىA16. الأيام بعد
 فتحالمحرّك: المستخدم 01.5 وقتUI أي في
 = كـالخطوات: متخزنة (مش مرة كل الحقيقية الحالة من بتتحسب الخطوات .)Checkbox ACTION" BEST مشNEXT خطوة أول
Nothing needs you right now." :Hoteliana. ومشComplete ومشLocked Hoteliana for مستنيWaiting المفتوح كل لو
". Hoteliana is reviewing
 هيالنهاية: ما زي
. انتهتA17 / تخلص قربت السياحة رخصة
 المحرّك 90 / 30 / الانتهاء7 ويوم قبل، أيام
الخطوات:

---

**p. 52**

 .1."Upload the new license" + ". Your tourism license expires on" Admins للـ إيميل + إشعار الانتهاء: والـOwnerقبل
.Expiring الجدول في soon"الحالة
. 2You . Your tourism license expired on الحالة الانتهاء: للـExpired"يوم أصفر بانر والـOwner. الصفحاتAdmins كل في
 ←Upload the new license" + ".can keep selling while Hoteliana reviews it - upload the new license
01.6C-TL UI مايقفش. البيع
 .3You keep selling .)-CHG( Your new tourism license is with أزرق يبقى البانر مفتوح: رفع طلب فيه Hotelianaلو
."meanwhile
 .4while your renewal is Hoteliana allowed selling until:  (أ) الأدمن قرار مراجعة تاريخ لحد البيع البانريكمّل في سطر
Tourism license) checked (ب) الجديدة." الحجوزات :يوقف منPause Hoteliana 10( 10.2،Flow بسببUI
. Hoteliana paused new bookings on your account: your tourism license expired للكلexpired" أحمر وبانر on،
"Only the Owner or) lifted it have to license new the ".Upload + license" new the "Upload أوOwner/Admin(
 it." upload can Admin (غيرهمan
 .5 الحالة الجديدة: الرخصة على الموافقة والـValidبعد يختفي، والبانر موجودPause، (لو تشيلهHoteliana اللي هي (مش
 ويظهر مقترح) Hoteliana"أوتوماتيك، for يتشال.Waiting ما لحد
.Valid النهاية
. A18 مثلاً) الضريبة (شهادة انتهى تاني مستند
 الانتهاءالمحرّك: يوم
: زيالخطوات: خطوةA17 و1 حسب2 الأثر بس منeffect، Hoteliana معBR-01-40( البانرpauses_new_contracts).
."New supply contracts cannot be activated until a replacement is approved . Your tax certiﬁcate expired on"
.)Flow 04/10 معActivate"وزرار السبب. نفس ومكانه يتشال الجديدة العقود في blocks_selling : العروضBlocker كل على
: بس.warn_onlyمع البانر
Uploading a valid replacement lifts the hold : SUP-6 لوحدهاالنهاية: حاجة كل بترجّع البديل على الموافقة
(.automatically after staff veriﬁcation"
. السريانA19 تاريخ قبل اتقبلت الاتفاقية نسخة
 الـالمحرّك: قبلOwner أسبوعv1.4 بعد والسريان
 النهاية حالتهاv1.4 وScheduled" from force in و تفضلv1.3"، تبقىActive وبعدين ده، اليوم لحد لوحدها.Superseded
." Version 1.4 accepted · in force الأخضر fromالبانر
)Exception ﬂows( 5 الاستثناءات. والأخطاء
اللي يتحفظ الليأو يظهر copy( #كّالمحر)English
يترجع
إزاي يكم لّ
عند للقواعد مطابق مش E1الباسورد
الـ أو Resetالتفعيل
 غير من تفضل الناقصة أوblurالقاعدة
Use at least الحقل تحت الزرار: 8ضغط
characters, with a letter and a number."
حاجة مفيش
اتبعتت
يصلّح
 التأكيد retypeتحت - match don't Passwords الباسورد زي مش E2التأكيد
(UI 01.4A ) the password in both ﬁelds."
الكتابة —يعيد
الحقل notتحت have you password a آخرChoose من الجديد E33الباسورد
used before."
غيره —يختار

---

**p. 53**

اللي يتحفظ الليأو يظهر copy( #كّالمحر)English
يترجع
إزاي يكم لّ
الفورم فوق أحمر orبانر email غلطIncorrect باسورد أو E4إيميل
 password" + again." try and both ومنCheck
attempts left before sign-in التانية المحاولة
). minutes 15 for ".locks ( 01.2A الباسوردUI
يفضل والإيميل يتمسح
أو تاني 1العداديحاول
Forgot
password?"
01.2D UI · locked temporarily الغلطAccount الخامسة E5المحاولة
There" / Sign-in is paused for 15 minutes"
were 5 incorrect attempts. Try again after
or reset your password now and sign - hh:mm
"Back / "Reset password" / ".in straight away
to sign in"
 دقيقة15القفل
للمستخدم إيميل
Your sign-in
was locked
after 5
+ attempts"
"This was not
 (مقترحme"
 (يفكReset
يستنى أو القفل)
بباسورد (حتى القفل أثناء دخول E6محاولة
صح)
 مابيتمدّش 01.2Dنفسالقفل الباقيUI بالوقت
(مقترح)
أو Resetيستنى
01.2C UI work" didn't code "That / may" منتهيIt أو غلط E7الكود
have expired or been mistyped. You have
more tries on this code - after that, request a
." below one لأولهاnew والفوكس تتمسح الخانات
 code" new a العدادResend لو حتى يظهر
(مقترح ماخلصش
 على1محاولة
الكود
أو تاني يكتب
كود يطلب
E8 new a Request works. longer no code الكود3"This نفس على غلط محاولات
 كودone." يطلب ما لحد مقفولة والخانات
code" ماتResend الكود
E9 5 في أكواد أو15 دقيقة محاولات10
غلط
Too many attempts. 01.2يرجع ببانرUI
Sign-in is paused for 15 minutes."
زييستنى E5قفل
E1015 عليهChallengeالـ عدّى نفسه
(مقترح) دقيقة
Your sign-in timed out. Sign : UI 01.2يرجع
in again."
الأول من —يدخل
العداد60بعد تحت ثانية Check yet? اتأخرNothing (الكود) E11الإيميل
your spam folder, or ask the Owner to conﬁrm
your email address."
—Resend
E12 باسوردDeactivatedالمستخدم وكتب
صح
)P5.3( UI the جلسةContact 11.14مفيش
Owner
E13 (الـ ملغي دعوة أوOwnerلينك
 لغوه)Hoteliana
"This invitation تخطيط 01.1Bنفس بعنوانUI
cancelled this invitation on " + was cancelled"
." . access need still you if them غيرAsk من
"Request a new invitation"
دعاه اللي —يكلّم
اتعمله لإيميل دعوة E14Deactivateلينك
التفعيل قبل
This access was turned off 11.14 بنصUI
before it was activated."
——
E15 the from again it Open valid. not is link دعوةThis مقطوعTokenلينك أو غلط
"Contact + email, or ask for a new invitation."
Hoteliana support"
——

---

**p. 54**

اللي يتحفظ الليأو يظهر copy( #كّالمحر)English
يترجع
إزاي يكم لّ
E16 01.3B UI works" longer no link reset مستعملResetلينكThis أو منتهي
"Password reset links work once and only /
for 30 minutes. Your account is ﬁne - ask for a
"Send a / new link, it takes a few seconds."
link" الـnew من معروف (الإيميل علىToken فيبعت ،
"Back to sign in" / ) UI 01.3Aطول
جديد —لينك
E17 لينكResetلينك اتبعت ما بعد قديم
أحدث
UI الأحدث 01.3Bنفس—يفتح
E18 is else someone If expired. has link me"لينكThis مستعملNot أو منتهي
using your account, reset your password
UI 01.3  ← "Reset password" + now."
— عاديReset
E19 التفعيل/الـ في فشل (نتResetالحفظ
سيرفر) أو
We could not save your الزرار password.فوق
Try again."
 مابيتحرقشاللينك
الحفظ نجاح بعد إلا
Try again"
مسجّل تاني مستخدم وفيه اتفتح E20اللينك
المتصفح نفس على
Sign out to . You are signed in الفورم asقبل
Sign out and + ".continue with this link
"Cancel" / continue"
بتقفل التاني جلسة
ضغط لو بس
—
المعاينة load."جوه not could document +The فشل القبول في المستند E21فتح
.Download PDF instead" + "Try again"
 كـ يحسب الناجح (مقترحOpened"التحميل
Opened"
لحد مايتسجلش
النجاح
Try again /
Download
الأزرار recorded.فوق not was acceptance (نت/سيرفرYour فشل E22القبول
 again." والـTry
اتسجلت حاجة ولا
الطلب
Idempotent
Accept"
" version تاني
E23 و نسخةHotelianaالقبول نشرت
النص في أحدث
a moment was replaced by version Version"
Review" + ".ago. Review the new version
" version
الأحدث مااتسجلشيفتح القبول
E24 Owner" the to خلالSend واتبعت
 ساعة24
sent this to the  01.6L3في الزرارOV بدل
 on Owner ". + reminder" a (بعدSend ساعة24
بس
—يستنى
E25 غير القبولOwnerمستخدم لينك فتح
) ( 01.6L مباشرةOV
01.6L للـ 01.6L3—Ownerيبعته بدلOV
E26 لسهOwnerالـ والنسخة الملكية نقل
مستنية
.01.6N-R) (بقىOwnerالـ القديم يشوفAdmin
Needs و البانر يشوف youالجديد
 بتاعOpened"
 مابيتنقلشالقديم
للجديد
يفتح الجديد
ويقبل
للكل أحمر Versionبانر by accepted not was قبول. غير من عدّى E27الميعاد
Publishing contracts is paused until the
." + it accepts أيOwner الدور. حسب زرار
409 أوActivate" بيرجعPublish"
:Modal ← agreement_not_accepted
Publishing is paused until the Owner accepts"
+ ".of the Supplier Agreement version
"Send to the / (Owner) "Review & accept"
"Save as a draft" (غيرهOwner"
 بيتحفظDraftالـ
عادي
قبول

---

**p. 55**

اللي يتحفظ الليأو يظهر copy( #كّالمحر)English
يترجع
إزاي يكم لّ
E28 Blocker  كلAGREEMENT_NOT_ACCEPTED على خلصوا14الـ سماح يوم
Selling is paused:) 04/10العروض والبانرFlow
of the Supplier Agreement is not version
".accepted
والمخزون الأسعار
هم ما زي
الـ يشيل القبول
 مراجعةHold بعد
 (أوHoteliana
Q-أوتوماتيك،
(01-02
E29 request" بعتSubmit تاني وحد
ثواني من البيانة نفس على طلب
It is locked .-in CHG was just sent by " :Modal
"Remove it and + ".until Hoteliana decides
"Cancel" / send the rest"
تفضل البيانات باقي
الفورم في
الباقي يبعت
الرفع منطقة ﬁle."تحت PNG or JPG PDF, a (نوعUse مقبول مش E30ملف
)Use a PDF or JPG البنك ﬁle."(خطاب
تاني مايتضافشملف الملف
E31MB is"—— ﬁle This MB 10 is limit The ."MB. من أكبر 10ملف
a Upload opened. be cannot ﬁle بباسوردThis أو تالف أو فاضي E32ملف
readable copy."
——
أحمر التقدم failed."شريط "Upload + /Retry" النص في وقف E33الرفع
Remove"
التانية الملفات
مابتتأثرش.
Review
 مقفولchanges"
يتم الكل ما لحد
Retry
issue the after be must date expiry فاتThe أو الإصدار قبل الانتهاء E34تاريخ
"This document has already expired. / date."
Upload a current one."
——
E35 22 by followed SA IBAN: Saudi a غلطIBAN"Enter صيغته
"This IBAN is not digits." / غلطchecksum
valid. Check the digits."
——
E36 IBAN."—— your already is الحاليIBAN"This نفس هو
E37 (منIBAN تاني مورد على موجود
السيرفر
This IBAN cannot be used. Contact
Risk لـHoteliana." حدث + التاني) المورد (مانكشفش
مااتبعتشHotelianaيكلّم الطلب
E38 أوAdmin Finance الـ يغيرّ حاول
IBAN
 01.6Cفي UI : Checkbox IBAN" مقفولBank
Only the Owner can change the bankوجنبه
Request a وفيaccount." 07.36 زرارUI
 السطرchange" نفس ومكانه موجود مش
الـ من —يطلب
Owner
مالوش E39مستخدم
company.request_change
/company/changesفتح
UI 11.4——
عامة hasصفحة link conﬁrmation This منتهي الجديد الإيميل تأكيد E40لينك
to send it again from request Ask" + expired."
".-CHG
—من
:UI 01.6E
"Resend the
conﬁrmation
 (مقترحlink"
E41 دي إشعارExpiredالبيانة يكمّل. والباقي The، خلال اتأكدش ما الجديد أيام7الإيميل
expired because the -email change in CHG
".new address was not conﬁrmed
القديمة القيمة
سارية
جديد طلب

---

**p. 56**

اللي يتحفظ الليأو يظهر copy( #كّالمحر)English
يترجع
إزاي يكم لّ
دخول كإيميل مستعمل الجديد E42الإيميل
تانية شركة على أو تاني لمستخدم
This email الحقلSubmitبعد تحت السيرفر): (من
cannot be used. Pick a different one."
——
E43 و الطلب فيHotelianaسحب قررت
اللحظة نفس
.-Hoteliana already decided on CHG" :Modal
"See the decision" + ".See the decision
القرار مااتعملشيشوف السحب
طلب نص في وهو اتشالت E44الصلاحية
التغيير
You can no longer request 11.15 بنصOV
company changes. Copy what you entered to
"Copy my changes" + hand it over."
Draftمفيش
للطلبات
لزميل يسلّمها
11.12 الدخولOV بعد بترجع الملفات) (مش القيم التغيير. طلب نص في خلصت E45الجلسة
الـ في لسه لو بترجع المرفوعة الملفات الجهاز. نفس على
 (مقترح)24 ساعة
ويكمّل —يدخل
E46 :P3—— load." not could "This + again" 01.6الصفحةTry مابتحمّلشUI
E47 Toast again." Try details. the show not details""Could فشلShow
مقنّعة تفضل والبيانات
——
بيعمل المسجّل الشركة E48Bounceإيميل
الموقّعة النسخة نبعت ومحتاجين
accepted. We القبول بعد الأخضر Versionالبانر
- could not email the signed copy to
"Download PDF" + ".download it here
سارييحمّل القبول
6 حالات. مش موجودة في التصميم
أقرب شاشة يتبني السلوكعليها المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
01-
01
(مش فريق عضو تفعيل
(Owner
Set" + ". You were invited as" + " :Supplier · Invitation from"
". by - here changed be cannot ".it + one" new a ?Need Ask بعد
الداشبورد ← التفعيل
UI 01.1
01-
02
invitation" new a Request لـ بيروح الـ اتقفل):Owner(أو المدعو لو منتهية فريق عضو دعوة
".to send you a new invitation We asked"
01.1B2  / UI 01.1B
01-
03
01.1B ملغيةE13UI الدعوة
01-
04
11.14 لإيميلE14UI Deactivatedالدعوة
01-
05
01.1B سليمE15UI مش دعوة لينك
01-
06
 01.1 continue."جنبهUI to above rules the all account""Meet مقفولActivate
01-
07
UI فيه characters"التصميم 8 least الـAt في بس لازمPlaceholder في. الباسورد 01.1قواعد
 الـ القايمة في3نفس اللي 01.4 وتتعلّمUI الحقل تحت تظهر
UI 01.4
01-
08
نفس على مسجّل تاني مستخدم
أو دعوة لينك وفتح المتصفح
Reset
E20UI 01.1

---

**p. 57**

أقرب شاشة يتبني السلوكعليها المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
01-
09
السيرفر بس اتفعّل الحساب
والمستخدم (نت) مارجّعش
تاني ضغط
. اتحرق:Idempotentالطلب اللينك لو طول. على يدخله اتفعّل: لو
UI 01.1C
UI 01.1C
01-
10
password" or email "Incorrect + again." try and both الدخولCheck في الغلط الأولى المحاولة
عدد غير من
UI 01.2A
01-
11
 Lock حقلCaps في شغال
الباسورد
Caps Lock is 01.2 الحقلUI تحت رمادي on."سطر
01-
12
وضغط فاضي الدخول فورم
Sign in
"Enter your الإيميل email."تحت work your الباسوردEnter وتحت
password."
UI 01.2
01-
13
01.2 address."UI email valid a غلطEnter صيغته إيميل
01-
14
account"إيميل Hoteliana your to sign-in والمدينة،New الجهاز، جديد: جهاز من الدخول
This was not me"والوقت
إيميل
01-
15
"Need help accessing
your supplier account?"
Locked :Modalيفتح it." Reset password? your (لينكForgot
Contact Hoteliana support at ?out or lost access to your email
"Close" / ".help@hoteliana.com
 01.6K (شكلOV
(Modal
01-
16
: فيهFA2كود كود لصق
شرطة أو مسافات
 01.2B منUI أقل لو تتاخد. بس الأول6الأرقام من الخانات في تتحط أرقام:
01-
17
 01.2C 32كودE8UI خلصتFA: محاولات
01-
18
: أوFA2كود الأكواد حد
المحاولات
E9UI 01.2D
01-
19
 01.2 انتهىChallengeE10UI
01-
20
01.2B اتأخرE11UI الإيميل
01-
21
Deactivatedمستخدم
صح بباسورد
UI 11.14UI 11.14
01-
22
10.2 الأحمرUI البانر + عادي 00الدخول من)28-00،Flow موقوفة Hotelianaالشركة
01-
23
 الاتفاقيةOwnerالـ ولسه دخل
ماتقبلتش الأولى
 01.5 FA2بعدUI ←  01.5 UI ما لحد دايمًا started يخلصGetting
01-
24
 ولسهReset مدعو لإيميل
ماتفعّلش
)BR-01-24 01.3A 01.3AUI جديدةUI دعوة هو بيوصل اللي والإيميل عادي،
01-
25
 link" another قبلSend
 ثانية60
 01.3A مكتوبUI 0:42"اللينك in link another للضغطSend قابل ومش
01-
26
01.2 أخضرUI بانر + your with in Sign changed. الباسوردPassword حفظ )Resetبعد
 password." مكتوبnew والإيميل
UI 01.2

---

**p. 58**

أقرب شاشة يتبني السلوكعليها المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
01-
27
01.4A آخرE3UI من جديد 3باسورد
01-
28
"Open the link from the
UI 01.3N فيemail"
زرار أو عادي، بخط تعليمات لسطر يتحول يفتحها). حاجة (مفيش زرار مش
 email" my يتشالOpen ← وجهة غير من
UI 01.3N
01-
29
 01.4D بسUI واحد جهاز
(الحالي
Continue to the portal" in." signed is device this والزرارOnly
طول على
UI 01.4D2
01-
30
 01.4D مشUI المدينة
معروفة
Unknown location"UI 01.4D
01-
31
 me" مشNot مستخدم من
Owner
reported that someone else used their " للـ :Ownerإشعار
account. Their password was reset and every device was
(Information) ".signed out
OV 11.1
01-
32
 started لمستخدمGetting
Ownerمش
ومكانه يتشال الزرار عليها: مايقدرش اللي الخطوات الصفحة. Onlyنفس
Only the Owner or / the Owner can accept the agreement."
an Admin can …"
UI 01.5
01-
33
: started خطوةGetting
Waiting for Hoteliana
"Hoteliana usually + أزرقBadge Hoteliana" for سطرWaiting
 days." working 2 within زرارdecides ومفيش
UI 01.5
01-
34
: started الخطواتGetting
Locked 8-6
"Unlocks once a hotel is approved." + "Locked" 01.5 رماديBadgeUI
01-
35
8: started خطوةGetting
متقبلة مش والاتفاقية
Unlocks once the Owner accepts the Supplier + Locked
Agreement."
UI 01.5
01-
36
: الخطوات فوقCompleteكل سطر + live." are "You + the to started"Go خلصGetting كله
. يختفواdashboard" والمنيو الكارت
UI 01.5
01-
37
 01.5 startedP3UI بيحمّلGetting مش
01-
38
 01.6 للـUI مقنّعة بيانات
 الكشفOwner (قبل
 (زي مقنّع حساس حقل زرار01.6N-Rكل + details") فوقShow
Hide الضغط بعد details"القسم.
UI 01.6N-R
01-
39
: 01.6 UI طلب من أكتر
مفتوح
 + Hoteliana"البانر with are requests change طلب2 لكل سطر
See in والتاريخ والبيانات، Requests"(الرقم،
UI 01.6
01-
40
Expired: STATUS الجدولExpired" تحت أحمر سطر + القاموس) حسب (رمادي 01.6 مستندUI
"Upload the new one" + )BR-01-40بالأثر
UI 01.6
01-
41
: 01.6 عليهUI مستند
بديل طلب
"-Change pending · CHG" Tag 01.6 UI الحاليSTATUSPhone(
"Change number
(pending"
01-
42
Bank : UI 01.6
 letter مشguarantee
موجود
 + request" change a with it add - optional · provided لينكNot
UI 01.6C-BG  ← "Add it"
UI 01.6
01-
43
Payment hold : UI 01.6
البنك تغيير بسبب
Change pending · payments paused until :Bank IBANجنب
Hoteliana conﬁrms"
UI 01.6
01-
44
 preview لمستندDocument
Expired
"Request + ". This document expired on" + STATUS Expired
replacement"
OV 01.6

---

**p. 59**

أقرب شاشة يتبني السلوكعليها المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
01-
45
Document ﬁle" فيCurrent
preview
 صالح موقّع (رابط جديد تاب في الملف فشل5يفتح لو مقترح). دقايق،
The ﬁle could not open. Try again."
OV 01.6
01-
46
القبول من الاتفاقية معاينة
الغلط النسخة بتعرض
 01.6A-L OV يعرض لازم الجديدة النسخة مشv1.4( زيv1.3)،
التصميم
OV 01.6A-L
01-
47
 01.6A2 فيهOV مكتوب
"8.4 Stop sell"
."Stop sale" ملف من جاي نص الـHotelianaده في بنولّدهUI. اللي
)Hoteliana الـ مسؤوليةPDF(ملف نفسه
OV 01.6A2
01-
48
(مفيش اتفاقية نسخة أول
قبلها) نسخة
.replaces …" 01.6L غيرOV من CHANGED" غيرWHAT ومن
"Review and accept the Supplier Agreement"العنوان
OV 01.6L
01-
49
قرّب القبول ميعاد الاتفاقية:
 أيام)7
, days - after in Accept النص بس أصفر يفضل versionالبانر
."publishing contracts is paused
UI 01.6N
01-
50
01.6N عدّىE27UI الميعاد الاتفاقية:
01-
51
10.2 خلصتE28UI السماح فترة الاتفاقية:
01-
52
01.6P بعدينA19UI وسريانها اتقبلت الاتفاقية:
01-
53
 سحبتHotelianaالاتفاقية
منشورة نسخة
v1.4 · Withdrawn by Hoteliana" :Version في يختفي. historyالبانر
 on غير من (رمادي عنصرBadge" you). يقفلNeeds
OV 01.6M
01-
54
فوق أحدث نسخة الاتفاقية:
مستنية نسخة
Superseded · not Version history: v1.4. فيBR-01-51
accepted"
OV 01.6M
01-
55
: history Version أكشن زرار
المستنية النسخة على
 01.6M accept"OV & "Review )Owner( / Owner" the to (غيره)Send
01-
56
"Download PDF""The download did. (التصميم + ينزل 01.6Bالملف فشلOV لو
not start. Try again."
OV 01.6B
01-
57
 Owner" the to اتبعتSend
كده قبل
E24OV 01.6L4
01-
58
 مرسوم مش (افتراضيTelالإدخال دولة بكود )966 + number"Hoteliana (الشركةPhone
checks this number with your registration."
UI 01.6C-OP
01-
59
Commercial registration"Annual الإصدار تاريخ + رفع مرسوم: مش conﬁrmationالإدخال
due"
UI 01.6C-TC
01-
60
STEP 2 01.6C-OE UI خطوةA13+ IBAN1 فيBank
OV 01.6J
01-
61
 سطرCity لوحده: ومايتشالش للطلب تلقائيًا يتضاف country new اتغيرCountry"A
needs a new city too."
UI 01.6C-CI
01-
62
 name غيرLegal من اتغير
جديد تجاري سجل
A new legal name usually comes with مانع (مش أصفر aسطر
Add commercial + new commercial registration. Add it too?"
registration"
UI 01.6C-LN
01-
63
 name غيرOwner من اتغير
جديدة هوية
 +If the owner changed, request the owner ID أصفر too."سطر
Add owner ID"
UI 01.6C-ON

---

**p. 60**

أقرب شاشة يتبني السلوكعليها المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
01-
64
اتشالت وبعدين اتعلّمت البيانة
قيمة وفيها
." + Removed" Toast من تتشال 2القيمة STEP و (مقترح)، تأكيد غير من
Undo"
UI 01.6C2
01-
65
UI 01.6C فيCancel"
إدخال وفيه
)Draft 03.11 التغييراتOV غيرP2.4حارس من
01-
66
بطلبات مقفولة البيانات كل
مفتوحة
Every detail is already with Hoteliana. 1 مقفولSTEP كله
"See in Requests" + Withdraw a request to change it."
UI 01.6C
01-
67
 الجديد الإيميل تأكيد لينك
النجاح صفحة
Hoteliana will" + "Email conﬁrmed" بلوجو عامة :Hotelianaصفحة
." to change the review now for دخول زرار أي غير من
 01.1B2 (نفسUI
التخطيط
01-
68
01.3B E40UI منتهي التأكيد لينك
01-
69
01.6Eفي البيانةUI جنب link" conﬁrmation the (مرةResend  التأكيد لينك إرسال إعادة
." Sent to" Toast مقترح10كل دقايق،
UI 01.6E
01-
70
بيانة غير ومن اتبعت الطلب
 تأكيد محتاجة
 01.6E-TC 01.6EUI والبيانةUI التصميم، زي طولPending" على
01-
71
مفتوح الحالة: 01.6Eحسب اتقبلUI ←01.6F، اترفض تاب، من طلب Requestsفتح
Withdrawn" جزء01.6G اتسحب01.6H، بحالة01.6E،
"Expired" انتهى أزرار، غير بحالة01.6Eمن
UI 01.6E
01-
72
UI 01.6E فيTimeline
السحب بعد
Hoteliana review"" 01.6E by"UI Withdrawn on بدل
01-
73
"Continue to Hotel
 القبولLibrary" أو الإرسال بعد
 01.6E UI /  خطوة01.6F لو بس في5يظهر started يتشالGetting كده غير ماخلصتش.
01-
74
 بيانة فيه (إيميلExpiredطلب
 اتقرر والباقي اتأكدش) ما
Email address · expired - the new address 01.6H بسطرUI
 conﬁrmed" not (رماديwas
UI 01.6H
01-
75
جهة من Hotelianaممنوع حصلBR-01-55( لو did). نصHoteliana غير من بسبب رفض
 ←Ask Hoteliana" + not give a reason. Ask Hoteliana."
 11.22 بالطلبOV مربوط
UI 01.6G
01-
76
 Hoteliana" صفحةAsk من
طلب
Company بـ مربوطة وتصنيف-CHGالقضية else" (أوSomething
)Q-01-10 اتضاف،change" لو
OV 11.22
01-
77
 07.20H فيUI + 07.36 جنبUI :IBAN ·" pending holdChange البنكPayment (تغيير
" payments paused since · -CHG
UI 07.20H
01-
78
مانفعتش المكالمة البنك:
رد) (مفيش
Hoteliana could : UI يفضل فيPendingالطلب وسطر 01.6E،
not reach the owner on the number on ﬁle. We will try again."
 المورد على أكشن غير (من
UI 01.6E
01-
79
01.6G UI + current the on resume you to اترفضPayments الطلب البنك:
account."
UI 01.6G
01-
80
واحد وفيه تاني طلب البنك:
مفتوح
"-Pending · CHG 01.6C مقفولCheckboxUI
01-
81
بـ الانتهاء قبل السياحة: رخصة
90/30/7
1 خطوةA17إشعار

---

**p. 61**

أقرب شاشة يتبني السلوكعليها المطلوب (بالتفصيل شكل #الحالة)الأزرار/الرسالة/الشاشة
01-
82
خطوةA17بانر انتهت2 السياحة: رخصة
01-
83
سمح الأدمن السياحة: رخصة
تاريخ لحد
 خطوةA17بانر (أ)4
01-
84
وقف الأدمن السياحة: رخصة
الجديدة الحجوزات
 10.2 خطوةA17UI (ب)4
01-
85
اتقبل البديل السياحة: رخصة
 موجودPauseوالـ لسه
Your new tourism license was approved. Hoteliana willالبانر
pause." the lift Hoteliana( for أزرق)Waiting ،
UI 10.2
01-
86
(حسب انتهى تاني مستند
(effect
A18بانر
01-
87
غير Owner/Adminمستخدم
منتهي مستند بانر شاف
البيع)— محرك في (بيشوفه البيع وقف الأثر لو إلا (مقترح)، مايشوفوش
)State machine( 7 الحالات.
:)Invitation الدعوة7.1
منإلىكّالمحرBadge
—sentOwner/Admin) Hoteliana أوOwner(
(فريق
(Warning) Invited
Active للمستخدمSuccess( sentacceptedالتفعيل)
sentexpired invitation Expired أيام7)Danger(
/ sent
expired
 يموتResendInvited القديم (اللينك (جديدةsent
sentcancelled غير مقترحBadgeمن القايمة، من (تتشال لغاهاOwner/Admin/Hoteliana
expiredrenewal_requested"Request a new invitation""New link + Expired invitation
requested"
 الدخول7.2 ناحية (من المستخدم
منإلىكّالمحرBadge
invitedactiveالتفعيلActive
activelocked Locked لـNeutral( دقيقة15) الأكواد5 حد / غلط محاولات
lockedactiveUnlock أو15Active دقيقة، أوReset عملتHoteliana،
activesecurity_hold me"Locked مقفولNot الحالي (الباسورد
جديدActive security_holdactiveباسورد
activedeactivatedOwner/Admin/Hoteliana(Neutral) Deactivated
deactivatedactive(Flow 08) ReactivateActive

---

**p. 62**

 7.3 الـChallenge :FA2  issued ←  verified |  failed_attempt )3≥( ←  dead غلط3( جديدreplaced (كود
.Badge expired مالوش10( دقايق).
.Badge. الـ7.4 لينك me Not / Reset الإيميل تأكيد /   issued ←  used |  expired |  مالوشreplaced
الموثوق7.5 الجهاز   trusted ←  expired يوم30( (باسورد،revoked me أمني،Not خروج .)Deactivate،
من7.6 هنا، بيأثر اللي (الجزء المورد SUP-2 :)  Invited ←  دخولOnboarding (أول Active القبولHoteliana( بعد ،
Suspended / )Success( Active : UI 01.5 Suspendedوالمستندات بتعرضHoteliana( البوابة فيBadge). الحساب
).Getting started .)Danger( مالوشOnboarding كـBadge (بيظهر
 مورد7.7 (لكل الاتفاقية نسخة
منإلىكّالمحرBadge
—awaiting_acceptance answer an Needs نشرتHoteliana)Warning(
Pending. للباقيينOwnerللـ
(Warning)
answer an أحمرNeeds سطر + عدّى awaiting_acceptanceoverdueالميعاد
"Overdue"
overdueoverdue_hold Problem سماح14)Danger( يوم
/ overdue  / awaiting_acceptance
overdue_hold
accepted_scheduled قبلOwner
بعدين والسريان
(Neutral) Scheduled
/ overdue  / awaiting_acceptance
accepted_scheduled  / overdue_hold
active قبلOwner
جه والسريان
(Success) Active
بقت أحدث activesupersededنسخة
Active
(Neutral) Superseded
أحدث awaiting_acceptancesupersededنسخة
قبل اتنشرت
القبول
not + Superseded
accepted"
awaiting_acceptancewithdrawnHoteliana
سحبتها
غير Badgeمن
):Item) التغيير7.8 طلب والبيانةRequest
الكيانمنإلىكّالمحرBadge
تليفون أو Item—awaiting_verificationإيميل
جديد
waiting for + Pending
conﬁrmation"
Pending )Warning( Itemawaiting_verificationpendingالتأكيد
Itemawaiting_verificationexpired Expired أيام7)Neutral(
عند الأنواع Item—pendingباقي
الإرسال
Pending
ItempendingapprovedHoteliana(Success) Approved
Itempendingrejected + Rejected سببHoteliana)Danger(

---

**p. 63**

الكيانمنإلىكّالمحرBadge
Request—submittedSubmit(Warning) Pending
Requestsubmittedin_review Hoteliana for Waiting فتحتهHoteliana)Info(
Requestin_review  / غير Badgeمن + قرارWithdrawn" أي (قبل submittedwithdrawnالمورد
البيانات Requestin_reviewapprovedكل
Approved
Approved
البيانات Requestin_reviewrejectedكل
Rejected
Rejected
Approved + " of Requestin_reviewpartly_approvedخليط"approved
 من البيانة: ديsubmittedقفل للبيانة نهائية حالة أي لحد
 (فوق7.9 البنك تغيير :)7.8  requested ON( hold )Payment ←  ←callback_done نتيجة) + وقت + رقم + (موظف
.)Hold OFF( withdrawn approved OFF،Veriﬁed( القديمHold للإيميل إيميل rejected، OFF( تانيHold سبب مفيش لو
."Change pending" / )P7: Valid( "Veriﬁed" + Active : UI في البنكي الحساب 07.36حالة
 المستند:7.10
منإلىكّالمحرBadge
validexpiring_soon soon Expiring قبل90)Warning( يوم
Expired الأثرNeutral( سطر + مكة) بتوقيت الليل (منتصف الانتهاء expiring_soonexpiredيوم
الحالية pending"الحالة اتبعتChange بديل حالةreplacement_pendingطلب أي
Valid اتقبل)Success( replacement_pendingvalidالبديل
Problem )Danger( + موجودMissing" مش إجباري —missingمستند
· Warning( next_action  ← )Badge خطوة7.11 started :Getting  locked Locked( · )Neutral ←  غيرup_next (من
.(Success · Complete) complete  ← (Info) waiting_for_hoteliana  ← ("Next action"
 الأدمن7.12 قرار الانتهاء، (بعد السياحة رخصة   expired ←  شغالallowed_until البيع مراجعة، (تاريخ
.)Hoteliana paused_new_bookings منPause( )Hoteliana ←  الـvalid البديل؛ قبول (بعد منPause يتشال
8 الحقول. والتحقق
رسالة الخطأ الحقل؟إجباريالقواعد)English(
Work email
(Activation)
— الدعوة— (للقرايةمن
New password
Activation / Reset /)
(Not me
حرف8-128 واحد128 حرف مقترح)، نعم
مش الأقل، على واحد رقم الأقل، على
 آخر من مش (مقترح)3الإيميل،
Use at least 8 characters, with a letter and
/ "Use 128 characters or fewer." / a number."
"Your password cannot be your email
"Choose a password you have / address."
not used before."

---

**p. 64**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
Conﬁrm the retype - match don't ="Passwords password passwordنعمNew
password in both ﬁelds."
)Login( Work email." work your "Enter / valid a إيميلEnter lowercaseصيغة + emailنعمTrim
email address."
)Login( password." your (غلطEnter / PasswordنعمTrimمايتعملوشIncorrect
email or password"
Veriﬁcation عند6 تتشال الحروف بالظبط. أرقام codeنعم
اللصق
It may have" + "That code didn't work"
more expired or been mistyped. You have
"…tries on this code
Trust this device for
30 days
مش (افتراضي لا
متعلّم)
Checkbox—
Forgot) Work email
(password
address." email valid a إيميلEnter نعمصيغة
Agreement
declaration
checkbox
-(جنبه ﬁrst document full the يتفتحOpen المستند ما لحد للقبولمقفول نعم
acceptance unlocks after you have seen it."
Details to change
(Step 1)
عليها مايتعلّمش المقفولة الأقلIBANالبيانة على (واحد نعم
 الـ للـOwnerوبيانات بسOwner
Pick at least one detail."
New legal company
name
(مقترح2-200 حرف متعلّم لو نعم
& . , - ) و ومسافات (وأرقام
This / "Enter the new legal company name."
is already your legal company name."
New country." a "Pick / your already is القايمةThis متعلّمCityمن لو countryنعم
country."
New city." a اتغيرPick لو (الجديد البلد مدن متعلّممن لو cityنعم
New phone number
(company)
للسعوديةE.164 و966. تبدأ9 أرقام متعلّم لو نعم
 صحيح5بـ أرضي رقم أو (موبايل)
الحالي
Enter a valid phone number with the
country code."
New company
email
إيميل، متعلّمصيغة لو نعم
(سيرفر) تاني لحد دخول كإيميل
This is / "Enter a valid email address."
"This email / already your company email."
cannot be used. Pick a different one."
CR /) Document ﬁle
Tax / Tourism / BG
(letter / Owner ID
متعلّم لو BGنعم
كبيانة) اختياري
PNG / JPG / 10،PDF مشMB ،
واحد ملف بباسورد، ولا فاضي
This ﬁle is" / "Use a PDF, JPG or PNG ﬁle."
"This ﬁle cannot / ".MB. The limit is 10 MB
be opened. Upload a readable copy."
Issue date
(document)
date." issue the "Enter / date issue المستقبلThe في الملفمش مع نعم
cannot be in the future."
Expiry date
(document)
(للـ الملف مع :CRنعم
Annual
(conﬁrmation due"
date." expiry the "Enter / date expiry النهاردهThe وبعد الإصدار، تاريخ بعد
"This / must be after the issue date."
document has already expired. Upload a
current one."
New owner name." full owner's the (مقترح)،2-100"Enter حرف متعلّم لو nameنعم

---

**p. 65**

رسالة الخطأ الحقل؟إجباريالقواعد)English(
New owner the with number phone valid a الشركةEnter تليفون متعلّمزي لو phoneنعم
country code."
New owner الشركة إيميل الشركةزي إيميل متعلّمزي لو emailنعم
New متعلّم لو IBANOwnerنعم
بس)
 SA + رقم22 مسافات24 حرف)،
وبتتشال، Checksumمسموحة
) صح،mod-97(
(سيرفر تاني مورد
Enter a Saudi IBAN: SA followed by 22
"This IBAN is not valid. Check the / digits."
"This / "This is already your IBAN." / digits."
IBAN cannot be used. Contact Hoteliana."
Account holder
name
— ومقفول (مكتوب
القانوني) الشركة اسم
——
Bank— الـ من (بيتملى
(IBAN
نص حقل معروف: مش البنك كود لو
إجباري
Enter the bank name."
Bank ﬁle." JPG or PDF a "Use / is" ﬁle This JPGMB. / 10،PDF الـMB مع letterIBANنعم
"Attach the." / MB 10 is limit ملفThe (مفيش
bank letter."
9 الإشعارات. والإيميلات والسجل
مينالقناةRequires الحدثيستلمه
؟action
)actor · action · old →  new( سطر السجل
hoteliana_user ·  invitation.sent · — المدعوOwnerالـemail—→ Ownerدعوة
sent
عضو دعوة
فريق
supplier_user ·  invitation.sent · — المدعوemail—→
 (+ الدورsent
دعوة طلب
جديدة
(Owner)
)Supply( Hoteliana system عند· داخليqueueHotelianaنعم
invitation.renewal_requested
دعوة طلب
(عضو جديدة
فريق)
email"Resendنعم + دعاهin-app اللي
(invitation"
· system
invitation.renewal_requested
supplier_user ·  user.activated · → فريق)in-appلاinvited (عضو دعاه التفعيلاللي
active
system ·  الكودauth.2fa_code_sent غير (من (إجباري)email— FA2كودالمستخدم
supplier_user ·  auth.signed_in · ناجح———ip, دخول
device, trusted
من دخول
جديد جهاز
+email (إجباري) المستخدم
"This was not
me"
system ·  لاauth.new_device
system ·  الباسورد)auth.failed غير (من غلط——— محاولة
بعد 5القفل
محاولات
system ·  auth.locked · locked → (مقترح)emailلاactive المستخدم

---

**p. 66**

مينالقناةRequires الحدثيستلمه
؟action
)actor · action · old →  new( سطر السجل
system ·  موجود)email—auth.reset_requested (لو Resetطلبالمستخدم
اتغير الباسورد
(Reset)
+email (إجباري) المستخدم
"This was not
me"
supplier_user ·  auth.password_reset لا·
المقفولة )n(الأجهزة
Not (لينك me)Resetالمستخدم
 + +Hoteliana أمان
 المستخدمOwner (لو
هو مش
email + supplier_user ·  +auth.not_me_reported in-appلا
(all) session.security_logout
التانية الأجهزة
اتقفلت
———· supplier_user
n · session.devices_signed_out
الموثوق الجهاز
اتلغى
———reason · device.trust_revoked  · system
البيانات كشف
الحساسة
———· supplier_user
company.details_revealed
اتفاقية نسخة
جديدة
Owner: in-app
.email + (Needs you)
in-appالباقيين
(Information)
in-app + email للـ (ليهOwnerنعم
(Deadline
· agreement.published  · hoteliana_user
(awaiting) v1.3 → v1.4
القبول تذكير
 يوم)7/3/1(
Owner الـin-app (نفس
+ (Thread
email
system ·  نعمagreement.reminder
مستند فتح
الاتفاقية
———· supplier_user
version, · agreement.document_opened
time
للـ إرسال
Owner
Ownerin-app + email
بلينك
OV 01.6L
supplier_user نعم·
agreement.sent_to_owner
المسجّل: (الإيميل القبولالشركة
موقّعة Adminsنسخة
(in-app Information)
Hoteliana +
email + supplier_user )Owner( in-appلا·
awaiting → · agreement.accepted
active/scheduled · ip, device, sha256
+ Admins + عدّىOwner الميعاد
Revenue managers
بينشروا (اللي
in-app + system ·  للـagreement.overdue emailOwnerنعم
 بعدHold
السماح
معاه اللي الكل
rates.view
in-app + system ·  للـagreement.hold_applied emailOwnerنعم
تغيير طلب
اتبعت
) +Toastصاحبه
 صاحبهOwner (لو
in-app،Admin
+ (Information
Hoteliana
supplier_user in-appلا·
→ — · company_change.submitted
 (البياناتpending

---

**p. 67**

مينالقناةRequires الحدثيستلمه
؟action
)actor · action · old →  new( سطر السجل
 تأكيد لينك
جديد إيميل
system الجديدemail—· الإيميل
company_change.verification_sent
الجديد الإيميل
 اتأكد
الطلبin-app صاحب
(Information)
اللينكsystem (من لا
company_change.email_verified
من انتهت بيانة
 تأكيد غير
system ·  emailلاcompany_change.item_expired + الطلبin-app صاحب
الطلب قرار
Approved /)
Rejected /
(Partly
email + الطلبin-app Ownerصاحب
(بيفتح
(01.6F/G/H
(المرفوض لا
 +Information
("Resubmit"
· hoteliana_user
old →· company_change.decided
rejected + reason أوnew
Owner + (لوHoteliana الطلب سحب
هو مش سحب اللي
supplier_user in-appلا·
pending → · company_change.withdrawn
withdrawn
تغيير طلب
البنك
 الإيميلOwner على
Hoteliana + القديم
Finance + Finance
in- الشركةusers في
"Payments are :app
paused for a bank
(account check"
email + supplier_user )Owner( in-appلا·
IBAN ····4417 · bank_change.requested
→ ····9012 · payment_hold on
مكالمة
Hoteliana
———· bank_change.callback  · hoteliana_user
number on ﬁle, outcome
Finance + اتقبلOwner البنك
users
in-app + hoteliana_user )checker( emailلا·
hold off · bank_change.approved
Finance + اترفضOwner البنك
users
in-app + hoteliana_user ·  bank_change.rejected emailلا·
reason, hold off
قرّب مستند
ينتهي
(90/30/7)
Owner + Adminsin-app + email7 في و30نعم
(مقترح)
days · document.expiring  · system
system ·  document.expired · → emailنعمvalid + Adminsin-app + انتهىOwner مستند
expired
رخصة
قرار السياحة:
الأدمن
 )+Owner + Admins
لو )Pauseالكل
in-app + email: للـPauseلا نعم
:Owner/Admin
"Upload the new
(license"
· licence.decision  · hoteliana_user
pause_new_bookings / allow_until
Getting
started
خلص
خطوة آخر عمل اللي
(Toast)
system ·  in-appلاonboarding.completed
التحميل
المعاينة
———document.downloaded  · supplier_user
(مقترح

---

**p. 68**

)Acceptance criteria( 10 معايير. القبول
التفعيل
. 1 صالحةGiven دعوة اللينكWhen يفتح المدعو يشوفThen 01.1 وUI للقراية، والإيميل account" ماActivate لحد مقفول
التلاتة القواعد
. 2 الحسابGiven فعّل المستخدم تانيWhen اللينك نفس يفتح يشوفThen 01.1C وUI التفعيل، بتاريخ in" بيودّيهSign
 01.2 مكتوبUI والإيميل
 .3Hoteliana عليهاGiven عدّى دعوة أيام7 يفتحهاWhen يشوفThen 01.1B وUI invitation"، new a لـRequest بيوصل
 ويظهرOwner( فريق)، (عضو دعاه للي أو 01.1B2) خلالUI تاني والضغط جديد24، طلب مابيعملش ساعة
 .4 تانيGiven اتبعتت دعوة القديمWhen اللينك يفتح المستخدم شاشةThen يشوف valid" not is link مشThis المنتهية، أو
الفورم
. Given حسابهOwner فعّل ينجحWhen التفعيل غيرThen من طول على يدخل علىFA2 01.5 تبقىUI المورد وحالة 5،
 وسطرOnboarding السجلuser.activated، في
 والـ FA2الدخول .6 موجودGiven مش إيميل يدخلWhen يحاول نفسThen يشوف password" or email العدادIncorrect بنفس
 الموجود الإيميل من قريب رد .7وبزمن Given غلط4 محاولات الخامسةWhen يغلط يشوفThen 01.2D بتوقيتUI الفتح بوقت
 خلال صح) (حتى محاولة وأي الشاشة15مكة، نفس تعرض دقيقة .8 مقفولGiven الحساب يعملWhen جديدReset باسورد ويحفظ
 طولThen على يدخل ويقدر يتفك القفل .9 اتبعتGiven كود يلصقWhen المستخدم 123 "456 الـThen والكود6 تتملى خانات
"Resend زرار ضغط غير من لوحده .10يتحقق Given 3 الكود نفس على غلط أكواد الرابعWhen يكتب ولازمThen مقفولة الخانات
Trust this Given .12 . UI 01.2C .code" .11 اتطلبGiven جديد كود القديمWhen الكود يكتب المستخدم برسالةThen يترفض
Given .13 متعلّمdevice" خلالWhen المتصفح نفس على تاني يدخل يوم30 تانيThen يتطلب الباسورد تغيير وبعد كود، مايتطلبش
Then Deactivatedمستخدم صحWhen باسورد يكتب يشوفThen 11.14 زرارUI غير من in Sign غلطWhenو. باسورد يكتب
 العامة الرسالة .14يشوف إيميلGiven في داخلي لينك الـWhen ويعدّي يدخل FA2 الداشبورد.Then مش نفسه للينك يروح
 و الباسورد meنسيت Not .15 إيميلGiven أي يطلبWhen Reset يشوفThen 01.3A UI النص بنفس دايمًا .16 لينكGiven
Given .17 عليهReset عدّى اتستعمل30 أو دقيقة يفتحهWhen يشوفThen 01.3B وUI link" new a طولSend على يبعت
 جهازين على مسجّل Whenمستخدم بالـ الباسورد يغيرّ تالتReset جهاز من بـThen يطلعوا الجهازين 11.13 الجاي،OV الطلب في
password changed" إيميل changed"ويوصل was password Hoteliana فيهYour me" not was ."This .18 إيميلGiven
يضغطWhen المستخدم me" not was "This ويشوفThen مايدخلش، الحالي والباسورد فورًا، تقفل الجلسات كل 01.3N ويوصلهUI ،
 .Resetلينك .19 منGiven جديد باسورد حفظ المستخدم me Not يوصلWhen 01.4D UI بعلاماتها،Then الأجهزة كل يشوف
 otherو the out Sign "devices ←  01.4D2 وUI portal"، the to التلاتة.Continue الأحداث فيه والسجل الداشبورد، يدخّله
 started Getting .20 Given جديدOwner يفتحWhen 01.5 UI خطوةThen 1 والخطواتComplete 8-6، بسببLocked
 وكارت ACTIONمكتوب، BEST مفتوحةNEXT خطوة أول على .21 Given manager Revenue يفتحWhen 01.5 UI خطوةThen
 ومكانه3 زرار غير من agreement." the accept can Owner the "Only .22 مستنيGiven جديد فندق طلب Hoteliana يفتحWhen
 01.5 UI خطوةThen عليها5 Hoteliana" for زرارWaiting ومش أزرق .23 متقبلةGiven والاتفاقية اتنشر عقد أول آخرWhen
 تكتمل الحسابThenخطوة منيو من يختفي والعنصر الداشبورد من يختفي الكارت
 والاتفاقية الشركة صفحة .24 Given manager Revenue يفتحWhen 01.6 UI والـThen والهوية التليفونات ومفيشIBAN مقنّعين
.25 "Only the Owner or an Admin can request changes." details" وزرارShow changes"، ومكانهRequest موجود مش
 Given Owner يضغطWhen details" ويرجعShow تانية صفحة ويروح وسطرThen مقنّعة، ترجع البيانات
 السجلcompany.details_revealed في .26 منشورةGiven جديدة نسخة الـWhen يفتحOwner 01.6L OV الـThen
Owner يظهرCheckbox المستند فتح وبعد مقفولين، والزرار Opened والـ وبعدCheckbox" يتفتح، .27 الـGiven

---

**p. 69**

 ينجحWhenقبل القبول Then  01.6P الجديدةUI والنسخة الأخضر، بالبانر والقديمةActive فيSuperseded 01.6M بسجلOV
والوقت والدور، (الاسم، وUTC+3القبول الفتح، ووقت كلSHA-256، عند من يختفي والبانر المسجّل، للإيميل تتبعت موقّعة ونسخة )،
 .28المستخدمين مشGiven مستخدم Owner يضغطWhen to Send ")Owner( يشوفThen 01.6L4 والـOV يوصلهOwner،
 وإشعار youإيميل يفتحNeeds بلينك 01.6L مباشرةOV .29 قبولGiven غير من عدّى الميعاد When manager يضغطRevenue
…" أسعارPublish" على بـThen يترفض Modal version" accepts Owner the until paused is Publishing تتحفظ والتغييرات
.v1.3 مايتأثرشDraft الحالي والبيع .30، Given و اتأكد حجز ساريةv1.3 When تتقبلv1.4 بـThen مربوط يفضل الحجز
 التغيير طلب .31 علىGiven مفتوح طلب number Phone When يفتحAdmin 01.6C UI Then number وعليهPhone مقفول
Owner CHG" · يسحبه-Pending إزاي بيقول والبانر .32" Given Admin يفتحWhen 01.6C UI Then IBAN الـBank وبيانات
 وجنبهم …"مقفولين change can Owner the ."Only .33 Given علّمOwner Country جديدWhen بلد يختار Then يتضافCity
waiting for the يختاره ولازم .34تلقائيًا Given email واتبعتOwner اتغير When مااتأكدش الجديد الإيميل حالتهاThen البيانة
DOCX email" this conﬁrm to وبعدowner للمراجعة، بتروح ومش تبقى7 أيام يكمّلExpired والباقي .35 ملفGiven 12 أوMB
 يرفعهWhen مايتضافشThen والملف الحجم أو النوع برسالة يترفض .36 فاتحينGiven الفريق من اتنين 01.6D البيانةUI نفس على
 يضغطWhen التاني الأولSubmit بعد يشوفThen بسE29 الباقي يبعت ويقدر .37 فيهGiven طلب بيانات3 When تقبلHoteliana
وترفض2 بسبب1 Then  01.6H يعرضUI APPROVED" 3 OF في2 فورًا ساريين والاتنين 01.6، القديمةUI القيمة والمرفوض ،
 و detail"ساري، rejected the يفتحResubmit 01.6C فوقهاUI والسبب ومليانة متعلّمة بالبيانة .38 قرارGiven غير من مفتوح طلب
 منWhen يسحبه صاحبه 01.6K OV Then وسطر يموت، التأكيد ولينك تتفك، البيانات السجل.company_change.withdrawn في
البنك .39 Given Owner يبعتWhen وخطابIBAN جديد تتوقفThen المدفوعات 07.20H القديمUI والإيميل مايتأثرش، والبيع )،
Then UI 07.36 وOwnerللـ تنبيه، يوصله 07.36 يعرضUI pending" ."Change .40 Given user Finance يفتحWhen
 change" a ومكانهRequest موجود مش account." bank the change can Owner the "Only .41 Given والـIBAN صح صيغته
When غلطChecksum يكمّلWhen Then digits." the Check valid. not is IBAN "This .42 المكالمةGiven بعد اتقبل بنك طلب
يتسجل الجديدThenالقرار الحساب دورةVeriﬁed" أقرب تدخل والمستحقات يتشال، والإيقاف ،
 والرخصة المستندات .43 بعدGiven بتخلص السياحة رخصة يوم30 ييجيWhen اليوم Then وOwner وإيميل،Admins إشعار يوصلهم
 soon"والحالة ."Expiring .44 انتهتGiven السياحة رخصة التقويمWhen يفتح حد أي مفيشThen بتتباعBlocker والليالي جديد
 والـ بزرارOwner/Adminعادي، الأصفر البانر يشوفوا license" new the ."Upload .45 بسببGiven الجديدة الحجوزات وقف الأدمن
.46 البوابةWhenالرخصة يفتح المورد بانرThen يشوف ماتتأثرشPause القديمة والحجوزات ومخزون، أسعار يعدّل ويقدر بالسبب، أحمر
 والـGiven انتهت الضريبة شهادة pauses_new_contracts = effect الـWhen جديدOwner عقد يفعّل يحاول التفعيلThen زرار
"New supply contracts cannot be activated until your tax certiﬁcate replacement is ومكانه موجود approved."مش
11 أسئلة. مفتوحة
الوضع الحالي / #السؤالالاقتراح
Q-
01-
01
الاتفاقية يقبل "Owner"مين ( 01.6L3 ولاOV والقرار) "authorised،
someone authorised to 3 signatory" وSupply( 01.5، خطوةUI
)؟sign"
 الـOwnerاتكتب لو بس. بالتوقيعOwner المفوّض مش
 حقل محتاجين signatory"قانونيًا، الشركةAuthorised في
Q-
01-
02
بتقول البوابة القبول: ميعاد paused"بعد is contracts ،publishing
.Distribution hold Supplyو  بيقولSUP-10 وبعدين14 سماح يوم
 الـ القبول وبعد بعض؟ مع بمراجعة؟Holdالاتنين ولا أوتوماتيك يتشال
بالترتيب الاتنين عندBR-01-48اتكتب أوتوماتيك والشيل )،
(مقترح) القبول
Q-
01-
03
8 started: خطواتGetting 01.5 ولاUI 4) ( 11.19 ومنيوUI ،
done"الحساب 1 · steps )؟4
8 و8الـ القايمة، هي 11.19 الـUI من يقرا المنيو ملخص.

---

**p. 70**

الوضع الحالي / #السؤالالاقتراح
Q-
01-
04
MVP من المراجعةHotelianaمكالمة وقت )BR-01-58 الـ تليفون بـOwnerتأكيد والـSMS الـSMS في مقفول
Q-
01-
05
بتقول5خطوة days" working 2 within usually decides, ،Hoteliana
 Supplyو بتتربط المكتبة فنادق إن قرر محتاجأوتوماتيك بس الجديد والفندق
موافقة
Pick hotels from the library - يتغير لازم accessالنص
is immediate. A hotel we do not have yet needs
Hoteliana's approval."
Q-
01-
06
"nothing on your account changes until you: me" بيقولNot النص
. it" صاحبchoose ما لحد شغال يفضل التاني الشخص بتاع الباسورد هل
باسورد؟ يختار الحساب
فورًا يتقفل الأمان: )BR-01-28اقتراح
Q-
01-
07
"Settlement · Monthly statement · net 30 → بتقول netالاتفاقية
after check-( يوم21" الدفع والقرار: 16، 15( الدفع وشروط يوم) عقد لكل
(out / on arrival / on booking
اللي بتعرض البوابة المالية. قرار مع يتوحد لازم الاتفاقية في النص
الملف في
Q-
01-
08
 contracts" supply new pauses document expired علىAn
 01.6 وUI يكمّل) (البيع الرخصة قرار مقابل التجاريSUP-6 (السجل
البيع يوقف
)BR-01-40 حسب يبقى مستندeffectالنص لكل
Q-
01-
09
 Toastاقتراح 01.6B"Downloading OV Modal( بسيط أكشن على تقيل التحميل) بعد
Modal الـSupplier_Agreement_v1.3.pdf" بدل
Q-
01-
10
القرار else"لحد بـSomething الربط مع Hoteliana"CHG تصنيفAsk محتاجين تغيير: طلب من change" ؟Company
Q-
01-
11
01مفاتيح :Flow  ،company.view
وcompany.request_changeو ومينagreement.accept، ،
الحساسة البيانات يكشف
قسم في 1الاقتراح
Q-
01-
12
) OV 01.6J ( "within 2 working البنك خطاب المراجعة: days"مدة
 07.36و UI day" working 1 وusually مقابلstamped"،
signed"
واحد نص على يتوحد
Q-
01-
13
بقانون انتهاء تاريخ مالوش التجاري 2025السجل بتعرضSupply( والصفحة )،
EXPIRES 14 Mar 27"
"Annual conﬁrmation يبقى الحقل due"اقتراح:
Q-
01-
14
 01.6 بيعرضUI ID-1043998217" · ID owner (رقم)،Company
) ملف01.6C-OIوالتغيير
جدول في الملف + مقنّع الرقم تعرض الصفحة اقتراح:
المستندات
Q-
01-
15
 غير من التفعيل بعد وبعدFA2الدخول me، غيرNot من أثبتFA2 (اللينك
الإيميل)
 عايز الأمان لو FA2مقترح. يضاف دايمًا،
Q-
01-
16
 #15 الـCross-module معاهمMFA: واللي الحسابات لأصحاب إجباري
فريق أو فلوس صلاحيات
 FA2الإيميل إجباري الـلكل المطلوب). من (أقوى المستخدمين
Authenticator P2
Q-
01-
17
01.6F الـ في يظهر إنه بسOnboardingاتكتب Library" Hotel to فيContinue 01.6E وUI

---

**p. 71**

الوضع الحالي / #السؤالالاقتراح
Q-
01-
18
"SUPPLIER AGREEMENT · CHANGE 01.6Dهيدر مكتوبUI
COMPANY & AGREEMENT" 3" STEP · والباقيREQUEST
"COMPANY & AGREEMENT · على CHANGEيتوحد
REQUEST"

---

**p. 72**

