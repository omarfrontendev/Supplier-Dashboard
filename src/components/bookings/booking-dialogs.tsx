import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, Clock3, FileWarning } from "lucide-react";
import { DataRow, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Timeline } from "@/components/layout/overlay";
import { incidentClosedCase, incidentEntry, incidentReviewCase } from "@/lib/business-exception-data";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { fill } from "@/lib/i18n";
import { ConfirmationNumbers, blocks, checkNumber, type ConfirmationValue } from "./confirmation-numbers";
import { useLanguage } from "@/lib/i18n";
import { incidentCopy, incidentReasons } from "@/lib/incident-reasons";
import { bookingCopy } from "@/lib/booking-copy";
import { usePortal } from "@/lib/portal-store";
import { RejectReasonOverlay } from "@/components/bookings/booking-overlays";

export function FulfilmentIncident({booking,ar,closeIssue}:{booking:ReturnType<typeof usePortal>["bookings"][number];ar:boolean;closeIssue:()=>void}){
  const closed=booking.incidentState==="closed";
  const steps=closed?incidentClosedCase:incidentReviewCase;
  return <section className={`mb-6 rounded-2xl border p-6 ${closed?"border-border-subtle bg-surface-default":"border-status-warning/30 bg-status-warning-bg"}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={closed?"danger":"warning"}>{closed?(ar?"ألغته هوتيليانا":"Cancelled by Hoteliana"):(ar?"مشكلة تنفيذ · قيد المراجعة":"Fulfilment issue · under review")}</StatusPill>
          {closed&&<StatusPill tone="neutral">{ar?"قيد مُسجّل":"Entry posted"}</StatusPill>}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-text-primary">{closed?(ar?"أُغلقت الحالة. ألغت هوتيليانا الحجز وحجز الوكيل الفندق مباشرة.":"The case is closed. Hoteliana cancelled the booking and the agent booked the hotel directly."):(ar?"تعمل هوتيليانا على هذا الحجز.":"Hoteliana is working on this booking.")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{closed
          ?(ar?"ولأن الغرف لم تُقدَّم، سُجّل قيد بقيمة ١٬٢٤٠ ر.س على حسابك مقابل الغرف التي لم تُقدَّم. والقيد مرفق بهذه الحالة، فيسافر السبب مع المال.":"Because the rooms were not provided, an entry of SAR 1,240 was posted against your account for the rooms that were not provided. The entry is attached to this case, so the reason travels with the money.")
          :(ar?"أُبلغ عنه في ١٥ سبتمبر ٢٠٢٦ · السبب: الفندق محجوز فوق طاقته. ويرى الوكيل أن الحجز قيد المراجعة. فلا تلغه ولا ترسل رقم تأكيد جديدًا حتى تُغلق الحالة.":"Reported 15 Sep 2026 · reason: the hotel is overbooked. The agent can see that the booking is under review. Do not cancel it and do not send a new confirmation number until the case closes.")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {closed
          ?<><Link to="/finance"><Button variant="outline">{ar?"فتح القيد":"Open the entry"}</Button></Link><Link to="/finance"><Button variant="ghost">{ar?"فتح كشوف الحساب":"Open statements"}</Button></Link></>
          :<><Button variant="outline">{ar?"إضافة معلومات":"Add information"}</Button><Button variant="ghost" onClick={closeIssue}>{ar?"فتح محادثة الوكيل":"Open the agent thread"}</Button></>}
      </div>
    </div>

    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="rounded-xl border border-border-subtle bg-surface-default p-4">
        <p className="text-overline text-text-muted">{ar?"الحالة":"The case"}</p>
        <div className="mt-3">
          <Timeline items={steps.map(step=>({title:ar?step.titleAr:step.title,note:`${ar?step.noteAr:step.note} · ${ar?step.whenAr:step.when}`,state:step.state}))}/>
        </div>
      </div>
      <div className="rounded-xl border border-border-subtle bg-surface-default p-4">
        <p className="text-overline text-text-muted">{closed?(ar?"كيف وصل المال إلى هنا":"How the money got here"):(ar?"ما دامت الحالة مفتوحة":"While the case is open")}</p>
        <div className="mt-3 space-y-3">{(closed?[
          ["info","The entry was not typed by hand. It was created from this case, and it stays linked to it.","لم يُكتب القيد يدويًا. بل أُنشئ من هذه الحالة ويبقى مرتبطًا بها."],
          ["info","The reason is on the record: the hotel was overbooked.","والسبب مسجّل: الفندق كان محجوزًا فوق طاقته."],
          ["yes","If you disagree, open the entry in Finance and use Dispute this entry - the record is updated with what is agreed.","وإن اختلفت، افتح القيد في المالية واستخدم «الاعتراض على القيد» - ويُحدَّث السجل بما يُتفق عليه."],
          ["info","A closed case with no fault on your side closes with no entry at all.","والحالة المغلقة دون خطأ من جهتك تُغلق بلا قيد إطلاقًا."],
        ]:[
          ["yes","Your other bookings, rates and inventory are untouched.","حجوزاتك الأخرى وأسعارك ومخزونك كما هي."],
          ["yes","The stop sale on 24 - 26 Nov is on, tagged \"auto · from incident\".","إيقاف البيع في ٢٤ - ٢٦ نوفمبر مفعّل، ووسمه «تلقائي · من حادثة»."],
          ["no","No new confirmation number goes out on this booking.","لا يخرج رقم تأكيد جديد على هذا الحجز."],
          ["info","Talk to Hoteliana directly if it is faster - the case stays the record either way.","تحدث إلى هوتيليانا مباشرة إن كان أسرع - وتبقى الحالة هي السجل في الحالتين."],
        ]).map(([mark,en,arabic])=><div key={en} className="flex gap-3 text-sm text-text-primary">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="no"?"bg-status-danger-bg text-status-danger":mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="no"?"✕":mark==="info"?"i":"✓"}</span>
          <span className="leading-5">{ar?arabic:en}</span>
        </div>)}</div>
      </div>
    </div>

    {closed&&<div className="mt-5 rounded-xl border border-border-subtle bg-surface-default p-4">
      <p className="text-overline text-text-muted">{ar?"القيد":"The entry"}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{incidentEntry.map(row=><div key={row.label} className="rounded-lg bg-surface-subtle p-3">
        <p className="text-[11px] text-text-muted">{ar?row.labelAr:row.label}</p>
        <p className="mt-1 text-sm text-text-primary">{ar?row.valueAr:row.value}</p>
      </div>)}</div>
    </div>}
  </section>;
}

export function Outcome({booking,t,requestResolved,onNumber}:{booking:ReturnType<typeof usePortal>["bookings"][number];t:typeof bookingCopy.en|typeof bookingCopy.ar;requestResolved:boolean;onNumber:()=>void}){if(requestResolved)return <Banner tone="success" title={t.requestResolved}/>;if(booking.status==="expired")return <div className="mb-6 rounded-2xl border border-border-subtle bg-surface-default p-6"><p className="text-overline text-text-muted">{t.result}</p><h2 className="mt-2 text-xl font-semibold text-text-primary">{t.expiredTitle}</h2><p className="mt-2 text-sm text-text-secondary">{t.expiredBody}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Mini title={t.untouched} body="12 · 9 · 7 rooms remain available"/><Mini title={t.prevent} body={t.alerts}/></div></div>;if(booking.status==="rejected")return <Banner tone="neutral" title={t.rejectedTitle} body={booking.reason ?? t.noAvailability}/>;if(booking.status!=="confirmed")return null;return <div className="mb-6 rounded-2xl border border-status-success/25 bg-status-success-bg p-6"><p className="text-overline text-status-success">{t.result}</p><h2 className="mt-2 text-xl font-semibold text-text-primary">{booking.confirmationNumber?t.savedNumber.replace("{number}",booking.confirmationNumber):t.confirmedAt}</h2><p className="mt-1 text-sm text-text-secondary">{booking.confirmationNumber?t.everything:t.toldAgent}</p>{booking.task==="reference"&&<div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-status-warning/25 bg-surface-default p-4"><div><p className="text-overline text-status-warning">{t.oneLeft}</p><p className="mt-1 font-semibold text-text-primary">{t.waitingNumber}</p><p className="text-xs text-text-muted">{t.reminder}</p></div><Button onClick={onNumber}>{t.addNumber}</Button></div>}</div>}
export function Banner({tone,title,body}:{tone:"success"|"neutral";title:string;body?:string}){return <div className={`mb-6 rounded-2xl border p-6 ${tone==="success"?"border-status-success/25 bg-status-success-bg":"border-border-subtle bg-surface-default"}`}><h2 className="text-xl font-semibold text-text-primary">{title}</h2>{body&&<p className="mt-2 text-sm text-text-secondary">{body}</p>}</div>}
export function Mini({title,body}:{title:string;body:string}){return <div className="rounded-xl bg-surface-subtle p-4"><p className="text-overline text-text-muted">{title}</p><p className="mt-1 text-sm font-medium text-text-primary">{body}</p></div>}
export function CalendarImpact({t}:{t:typeof bookingCopy.en|typeof bookingCopy.ar}){const nights=[[t.night1,12,10],[t.night2,9,7],[t.night3,7,5]] as const;return <SectionCard icon={<CalendarDays className="h-5 w-5"/>} overline={t.calendar.toUpperCase()} title={t.calendarBody}><div className="grid gap-3 sm:grid-cols-3">{nights.map(([label,before,after])=><div key={label} className="rounded-xl bg-surface-subtle p-4"><p className="text-overline text-text-muted">{label}</p><p className="font-data mt-2 flex items-center gap-2 text-sm text-text-muted"><span>{before}</span><ArrowRight className="h-3.5 w-3.5 rtl:rotate-180"/><b className="text-xl text-text-primary">{after}</b><small>{t.left}</small></p></div>)}</div></SectionCard>}
/**
 * OV 05.2 — confirming, with the hotel numbers Flow 12 Row E made per room.
 * The old sheet asked "do you have it?" and took one number for the whole
 * booking; a hotel issues one per room, so that is what it collects.
 */
export function ConfirmSheet({booking,open,onOpenChange,t,value,setValue,onConfirm,taken}:{booking:ReturnType<typeof usePortal>["bookings"][number];open:boolean;onOpenChange:(v:boolean)=>void;t:typeof bookingCopy.en|typeof bookingCopy.ar;value:ConfirmationValue;setValue:(v:ConfirmationValue)=>void;onConfirm:()=>void;taken?:Record<string,string>}){
  const rooms=booking.rooms;
  /* Pending is allowed to be empty; the other modes are not. */
  const problems=value.mode==="pending"?[]:(value.mode==="same"?[value.numbers[0]??""]:Array.from({length:rooms},(_,i)=>value.numbers[i]??"")).map(n=>checkNumber(n,{taken:taken??{}}));
  const stop=problems.some(blocks);
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="right" className="w-full max-w-[760px] overflow-y-auto border-border-subtle bg-surface-default p-0 sm:max-w-[760px]"><div className="flex min-h-full flex-col p-6 sm:p-7"><SheetHeader className="text-start"><p className="text-overline text-text-muted">{booking.id} · {booking.guest.toUpperCase()} · {booking.rooms} {t.rooms.toLowerCase()} · {booking.rate.toLocaleString()} {t.SAR}</p><SheetTitle className="text-2xl text-text-primary">{t.confirmTitle}</SheetTitle><SheetDescription>{t.confirmIntro}</SheetDescription></SheetHeader><div className="mt-6"><ConfirmationNumbers rooms={rooms} value={value} onChange={setValue} taken={taken??{}}/></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><Input label={t.ownRef} placeholder="PMS-10492"/><div><Input label={t.note} placeholder={t.special}/><p className="mt-1.5 text-[11.5px] text-text-muted">{t.noteHint}</p></div></div><div className="mt-4"><CalendarImpact t={t}/></div><div className="mt-4 flex gap-3 rounded-xl border border-status-warning/25 bg-status-warning-bg p-4 text-sm text-text-secondary"><AlertTriangle className="h-4 w-4 shrink-0 text-status-warning"/><span>Confirming is final. A cancellation after this follows the policy on the booking - Non-refundable on this one.<span className="mt-1 block text-xs text-text-muted">{t.recordedNote}</span></span></div><div className="flex-1 min-h-6"/><SheetFooter className="mt-6 border-t border-border-subtle pt-5"><Button variant="outline" onClick={()=>onOpenChange(false)}>{t.detail.cancelCta}</Button><Button onClick={onConfirm} disabled={stop} reason={stop?t.detail.cancelCta:undefined}>{value.mode==="pending"?t.confirmLater:t.confirmNow}</Button></SheetFooter></div></SheetContent></Sheet>}

export function RejectDialog({open,setOpen,t,booking,reason,setReason,stopSale,setStopSale,onReject}:{open:boolean;setOpen:(v:boolean)=>void;t:typeof bookingCopy.en|typeof bookingCopy.ar;booking:ReturnType<typeof usePortal>["bookings"][number];reason:string;setReason:(v:string)=>void;stopSale:boolean;setStopSale:(v:boolean)=>void;onReject:()=>void}){
  const d=t.detail;
  const [note,setNote]=useState("");
  /* OV 05.3A — the reason is picked on its own frame. */
  const [picking,setPicking]=useState(false);
  if(picking) return <RejectReasonOverlay value={reason} onPick={setReason} onClose={()=>setPicking(false)}/>;
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-h-[90vh] max-w-[660px] overflow-y-auto rounded-2xl border-border-subtle bg-surface-default">
      <DialogHeader>
        <p className="text-overline text-text-muted">{fill(d.rejectOverline,{id:booking.id,guest:booking.guest.toUpperCase(),rooms:booking.rooms,nights:booking.nights})}</p>
        <DialogTitle>{d.rejectTitle}</DialogTitle>
        <DialogDescription>{fill(d.rejectBody,{rooms:booking.rooms})}</DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <div>
          <p className="text-overline text-text-muted">{d.rejectReasonLabel}</p>
          <button type="button" onClick={()=>setPicking(true)} className="mt-2 flex h-11 w-full items-center justify-between gap-2 rounded-[10px] border border-border-default bg-surface-default px-3.5 text-start text-[13px] font-medium text-text-primary transition-colors hover:border-border-strong">{reason}<span className="text-text-muted" aria-hidden="true">▾</span></button>
          <p className="mt-1.5 text-xs leading-5 text-text-muted">{d.rejectReasonsNote}</p>
        </div>

        <div className="rounded-xl border border-status-warning/25 bg-status-warning-bg p-4">
          <p className="text-sm font-semibold text-text-primary">{d.rejectDisagree}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">{d.rejectDisagreeBody}</p>
          <label className="mt-3 flex cursor-pointer items-start gap-2.5">
            <Checkbox checked={stopSale} onCheckedChange={()=>setStopSale(!stopSale)}/>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-text-primary">{d.rejectStopSale}</span>
              <span className="mt-0.5 block text-xs text-text-muted">{d.rejectStopSaleNote}</span>
            </span>
          </label>
        </div>

        <div>
          <p className="text-overline text-text-muted">{d.rejectNoteLabel}</p>
          <Textarea className="mt-2" placeholder={d.rejectNotePh} value={note} onChange={(e)=>setNote(e.target.value)}/>
        </div>

        <p className="text-xs leading-5 text-text-muted">{d.rejectRecorded}</p>
      </div>

      <DialogFooter>
        <span className="me-auto text-xs text-text-muted">{d.rejectKeep}</span>
        <Button variant="outline" onClick={()=>setOpen(false)}>{d.cancelCta}</Button>
        <Button variant="danger" onClick={onReject}>{d.rejectCta}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}
/** OV 05.10 — adding the numbers after the booking was confirmed. */
export function NumberDialog({open,setOpen,t,rooms,value,setValue,onSave,taken}:{open:boolean;setOpen:(v:boolean)=>void;t:typeof bookingCopy.en|typeof bookingCopy.ar;rooms:number;value:ConfirmationValue;setValue:(v:ConfirmationValue)=>void;onSave:()=>void;taken?:Record<string,string>}){
  const fields=value.mode==="same"?[value.numbers[0]??""]:Array.from({length:rooms},(_,i)=>value.numbers[i]??"");
  const stop=value.mode==="pending"||fields.map(n=>checkNumber(n,{taken:taken??{}})).some(blocks);
  return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-[620px] rounded-2xl border-border-subtle bg-surface-default"><DialogHeader><span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-brand-deep"><CheckCircle2 className="h-5 w-5"/></span><DialogTitle className="text-2xl">{t.numberTitle}</DialogTitle><DialogDescription>{t.numberHelp}</DialogDescription></DialogHeader><ConfirmationNumbers rooms={rooms} value={value} onChange={setValue} taken={taken??{}}/><Input label={t.ownRef} placeholder="PMS-10492"/><DialogFooter><Button variant="outline" onClick={()=>setOpen(false)}>{t.detail.cancelCta}</Button><Button disabled={stop} onClick={onSave} reason={stop?t.numberHelp:undefined}>{t.saveNumber}</Button></DialogFooter></DialogContent></Dialog>}
export function IssueSheet({booking,open,setOpen,t,onSend}:{booking:ReturnType<typeof usePortal>["bookings"][number];open:boolean;setOpen:(v:boolean)=>void;t:typeof bookingCopy.en|typeof bookingCopy.ar;onSend:()=>void}){const {lang}=useLanguage();const ar=lang==="ar";const [reason,setReason]=useState("");const [alternative,setAlternative]=useState("none");const [stop,setStop]=useState(false);const alternatives:Array<[string,string,string]>=[["room",t.sameNights,t.sameNightsHint],["dates",t.sameRoom,t.sameRoomHint],["none",t.none,""]];return <Sheet open={open} onOpenChange={setOpen}><SheetContent side="right" className="w-full max-w-[700px] overflow-y-auto border-border-subtle bg-surface-default p-0 sm:max-w-[700px]"><div className="flex min-h-full flex-col p-6 sm:p-7"><SheetHeader className="text-start"><p className="text-overline text-text-muted">{booking.id} · {t.confirmed.toUpperCase()}</p><SheetTitle className="text-2xl text-text-primary">{t.issueTitle}</SheetTitle><SheetDescription>{t.issueLead}</SheetDescription></SheetHeader><div className="mt-6 space-y-5">{/* OV 10.6 - the four reasons Flow 12 settled on, each with what it
    means, because “no availability” hid three different problems. */}
<div><p className="text-overline text-text-muted">{incidentCopy.pick[ar?"ar":"en"]}</p><RadioGroup className="mt-2" value={reason} onValueChange={setReason}>{incidentReasons.map(item=><label key={item.code} className="flex cursor-pointer gap-3 rounded-[10px] border border-border-subtle p-3.5"><RadioGroupItem value={item.code} className="mt-0.5"/><span className="min-w-0"><span className="block text-[12.5px] font-semibold text-text-primary">{item.label[ar?"ar":"en"]}</span><span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">{item.means[ar?"ar":"en"]}</span></span></label>)}</RadioGroup></div><div><p className="text-overline text-text-muted">{t.describe}</p><Textarea className="mt-2 min-h-28 border-border-default bg-surface-default" placeholder={t.describePh}/></div><div><p className="text-overline text-text-muted">{t.alternative}</p><RadioGroup className="mt-2" value={alternative} onValueChange={setAlternative}>{alternatives.map(([value,label,hint])=><label key={value} className="flex cursor-pointer gap-3 rounded-[10px] border border-border-subtle p-3.5"><RadioGroupItem value={value} className="mt-0.5"/><span className="min-w-0"><span className="block text-[12.5px] font-semibold text-text-primary">{label}</span>{hint&&<span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">{hint}</span>}</span></label>)}</RadioGroup></div><label className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface-subtle p-4"><Checkbox checked={stop} onCheckedChange={(v)=>setStop(v===true)} className="mt-0.5"/><span className="min-w-0"><span className="block text-[12.5px] text-text-primary">{t.stopSaleIssue}</span><span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">{t.stopSaleIssueNote}</span></span></label><p className="text-[11.5px] leading-4 text-text-muted">{t.issueStays}</p><p className="text-[11.5px] leading-4 text-text-muted">{t.issueSla}</p></div><div className="flex-1 min-h-8"/><SheetFooter className="border-t border-border-subtle pt-5"><Button variant="outline" onClick={()=>setOpen(false)}>{t.detail.cancelCta}</Button><Button onClick={onSend} disabled={!reason} reason={!reason?incidentCopy.pick[ar?"ar":"en"]:undefined}>{t.send}</Button></SheetFooter></div></SheetContent></Sheet>}