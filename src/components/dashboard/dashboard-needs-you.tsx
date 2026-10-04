import { Link } from "@tanstack/react-router";
import { BarChart3, Building2, CheckCircle2, Clock3, LockKeyhole, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatusPill } from "@/components/layout/page-shell";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { arrivingToday, lastPayment, leavingToday, lockedNeeds, moneyTiles, needItems, pendingPeople, roleIntro, roleNames, roleNamesAr, roleNeeds, supplyTiles, type DashboardRole, type DeskGuest, type NeedItem, type NeedTone, type SupplyTile } from "@/lib/dashboard-data";
import { useLanguage } from "@/lib/i18n";

/** A count reads in the digits of the language around it. */
const num=(value:number,lang:string)=>value.toLocaleString(lang==="ar"?"ar-EG":"en-US");

const pillTone = { problem:"danger", answer:"warning", watch:"warning", info:"info" } as const;

function toneLabel(tone:NeedTone, t:ReturnType<typeof copy>){ return tone==="problem"?t.toneProblem:tone==="answer"?t.toneAnswer:tone==="watch"?t.toneWatch:t.toneInfo }
function copy(lang:"en"|"ar"){ return dashboardCopy[lang] }

export function DashboardNeedsYou({role,setRole,onAnalytics,clear=false}:{role:DashboardRole;setRole:(r:DashboardRole)=>void;onAnalytics:()=>void;clear?:boolean}){
  const {lang}=useLanguage();
  const t=dashboardCopy[lang];
  const intro=roleIntro[role];
  const rows=clear?[]:roleNeeds[role].map(k=>needItems[k]);
  const locked=lockedNeeds[role];
  const desk=role==="frontOffice";
  return <>
    <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-[26px] font-semibold leading-[34px] text-text-primary">{t.goodMorning}, {lang==="ar"?roleNamesAr[role]:roleNames[role]}</h1>
        <p className="mt-1 text-[13px] leading-5 text-text-secondary">{lang==="ar"?intro.contextAr:intro.context}</p>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <div className="w-[190px]"><Select value={role} onChange={(v)=>setRole(v as DashboardRole)} searchable={false} options={(["owner","revenue","reservations","finance","frontOffice"] as DashboardRole[]).map(v=>({value:v,label:t[v]}))}/></div>
        <Button variant="outline" onClick={onAnalytics}><BarChart3 className="h-4 w-4"/>{t.showAnalytics}</Button>
        {intro.today&&<Link to="/bookings"><Button variant="outline"><Clock3 className="h-4 w-4"/>{t.today}</Button></Link>}
        <p className="w-full text-end text-[11px] text-text-muted">{t.fresh}</p>
      </div>
    </header>

    {desk&&<DeskDay/>}

    <section className="mb-[18px] rounded-xl border border-border-subtle bg-surface-default p-[22px] shadow-card">
      <div className="mb-[14px] flex flex-wrap items-start justify-between gap-3">
        <div>
          {clear&&<StatusPill tone="success" className="mb-2"><CheckCircle2 className="h-3.5 w-3.5"/>{t.allClear}</StatusPill>}
          <h2 className="text-lg font-semibold text-text-primary">{clear?t.nothingTitle:(lang==="ar"?intro.titleAr:intro.title)}</h2>
          <p className="mt-1 max-w-[860px] text-xs leading-5 text-text-secondary">{clear?t.nothingBody:(lang==="ar"?intro.bodyAr:intro.body)}</p>
        </div>
        {!clear&&<Button variant="outline" size="sm">{t.order}</Button>}
      </div>
      {rows.length>0&&<div className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle">
        {rows.map((item,index)=><NeedRow key={item.key} item={item} rank={index+1} lang={lang} t={t} locked={locked?.key===item.key?locked:undefined}/>)}
      </div>}
      <div className="mt-[14px] rounded-lg bg-surface-subtle px-4 py-3 text-[11px] leading-5 text-text-secondary">{t.sameNumber}</div>
    </section>

    <div className="grid gap-[18px] xl:grid-cols-2">
      {!desk&&role!=="finance"&&<SupplyCard clear={clear}/>}
      {(role==="owner"||role==="finance")&&<MoneyCard/>}
      {role!=="frontOffice"&&<TeamCard clear={clear}/>}
    </div>
  </>;
}

function NeedRow({item,rank,lang,t,locked}:{item:NeedItem;rank:number;lang:"en"|"ar";t:ReturnType<typeof copy>;locked?:{action:string;actionAr:string;permission:string}|undefined}){
  return <div className="grid gap-3 p-4 sm:grid-cols-[26px_44px_minmax(0,1fr)_auto] sm:items-start">
    <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface-subtle font-data text-xs">{rank}</span>
    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-subtle font-data text-xl font-semibold text-brand-deep">{num(item.count,lang)}</span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{lang==="ar"?item.titleAr:item.title}</h3>
        <StatusPill tone={pillTone[item.tone]}>{toneLabel(item.tone,t)}</StatusPill>
      </div>
      <p className="mt-1 inline-flex rounded-md bg-surface-subtle px-2 py-1 font-data text-[11px] text-text-secondary">{lang==="ar"?item.metaAr:item.meta}</p>
      <p className="mt-1 text-xs leading-5 text-text-secondary">{lang==="ar"?item.detailAr:item.detail}</p>
      {locked&&<p className="mt-1 flex items-center gap-1 text-[11px] text-text-muted"><LockKeyhole className="h-3 w-3"/>{locked.permission}</p>}
    </div>
    {locked
      ? <Button size="sm" variant="outline" disabled>{lang==="ar"?locked.actionAr:locked.action}</Button>
      : <Link to={item.to}><Button size="sm" variant="outline">{lang==="ar"?item.actionAr:item.action}</Button></Link>}
  </div>;
}

function SupplyCard({clear}:{clear:boolean}){
  const {lang}=useLanguage();
  const t=dashboardCopy[lang];
  const tiles:SupplyTile[]=clear?supplyTiles.filter(tile=>tile.tone==="watch"||tile.tone==="info"):supplyTiles;
  return <section className="rounded-xl border border-border-subtle bg-surface-default p-[22px] shadow-card xl:col-span-2">
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{t.supply}</h2>
        <p className="mt-1 max-w-[760px] text-xs leading-5 text-text-secondary">{t.supplySub}</p>
      </div>
      <Link to="/rate-calendar" search={{}}><Button variant="outline" size="sm">{t.openCalendar}</Button></Link>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map(tile=><Link key={tile.label} to="/rate-calendar" search={{}} className="rounded-lg border border-border-subtle p-4 transition-colors hover:bg-surface-subtle">
        <div className="flex items-center justify-between"><span className="font-data text-2xl font-semibold">{num(tile.count,lang)}</span><StatusPill tone={pillTone[tile.tone]}>{toneLabel(tile.tone,t)}</StatusPill></div>
        <p className="mt-2 text-sm font-medium text-text-primary">{lang==="ar"?tile.labelAr:tile.label}</p>
        <p className="mt-1 text-xs text-text-muted">{lang==="ar"?tile.detailAr:tile.detail}</p>
        <p className="mt-3 text-xs font-medium text-text-link">{lang==="ar"?tile.actionAr:tile.action}</p>
      </Link>)}
    </div>
  </section>;
}

function MoneyCard(){
  const {lang}=useLanguage();
  const t=dashboardCopy[lang];
  return <section className="rounded-xl border border-border-subtle bg-surface-default p-[22px] shadow-card">
    <h2 className="text-lg font-semibold">{t.money}</h2>
    <p className="mt-1 text-xs leading-5 text-text-secondary">{t.moneySub}</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {moneyTiles.map(tile=><div key={tile.label} className="rounded-lg border border-border-subtle p-4">
        <p className="text-overline text-text-muted">{lang==="ar"?tile.labelAr:tile.label}</p>
        <p className="font-data mt-1 text-xl font-semibold">{lang==="ar"?tile.valueAr:tile.value}</p>
        <p className="mt-1 text-[10px] leading-4 text-text-secondary">{lang==="ar"?tile.noteAr:tile.note}</p>
      </div>)}
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="font-data text-xs text-text-muted">{lastPayment[lang]}</p>
      <Link to="/finance" search={{}}><Button variant="outline" size="sm">{t.openAccount}</Button></Link>
    </div>
  </section>;
}

function TeamCard({clear}:{clear:boolean}){
  const {lang}=useLanguage();
  const t=dashboardCopy[lang];
  const people=clear?pendingPeople.filter(p=>!p.open):pendingPeople;
  return <section className="rounded-xl border border-border-subtle bg-surface-default p-[22px] shadow-card">
    <div className="flex items-center gap-3">
      <UsersRound className="h-5 w-5 text-brand-deep"/>
      <div><h2 className="text-lg font-semibold">{t.team}</h2><p className="text-xs leading-5 text-text-secondary">{t.teamSub}</p></div>
    </div>
    <div className="mt-4 grid gap-2">
      {/* UI 09.1 — the whole row is the link, the way the prototype has it. */}
      {people.map(person=><Link key={person.initial} to={person.to} className="flex items-center gap-3 rounded-lg border border-border-subtle p-3 transition-colors hover:bg-surface-subtle">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-deep text-xs text-text-inverse">{person.initial}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{lang==="ar"?person.nameAr:person.name}</p>
          <p className="text-xs text-text-muted">{lang==="ar"?person.pendingAr:person.pending}</p>
        </div>
        {person.open?<span className="inline-flex h-9 shrink-0 items-center rounded-[10px] border border-border-default bg-surface-default px-3 text-[13px] font-medium text-text-primary">{t.open}</span>:<span className="text-xs text-text-muted">{t.none}</span>}
      </Link>)}
    </div>
    <p className="mt-4 text-[11px] leading-5 text-text-secondary">{t.teamFooter}</p>
    <Link to="/team" search={{}} className="mt-3 flex justify-end"><Button variant="outline" size="sm"><Building2 className="h-4 w-4"/>{t.teamAccess}</Button></Link>
  </section>;
}

function DeskDay(){
  const {lang}=useLanguage();
  const t=dashboardCopy[lang];
  return <section className="mb-[18px] rounded-xl border border-border-subtle bg-surface-default p-[22px] shadow-card">
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{t.deskTitle}</h2>
        <p className="mt-1 max-w-[820px] text-xs leading-5 text-text-secondary">{t.deskBody}</p>
      </div>
      <Link to="/bookings"><Button variant="outline" size="sm">{t.wholeDay}</Button></Link>
    </div>
    <p className="text-overline text-text-muted">{t.arriving}</p>
    <div className="mt-2 grid gap-2">{arrivingToday.map(guest=><GuestRow key={guest.reference} guest={guest} lang={lang} action={t.open}/>)}</div>
    <p className="mt-5 text-overline text-text-muted">{t.leaving}</p>
    <div className="mt-2 grid gap-2">{leavingToday.map(guest=><GuestRow key={guest.name} guest={guest} lang={lang}/>)}</div>
  </section>;
}

function GuestRow({guest,lang,action}:{guest:DeskGuest;lang:"en"|"ar";action?:string}){
  return <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle p-3">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-text-primary">{lang==="ar"?guest.nameAr:guest.name}</p>
      <p className="mt-0.5 text-xs text-text-secondary">{lang==="ar"?guest.stayAr:guest.stay}</p>
      {guest.reference&&<p className="font-data mt-0.5 text-[11px] text-text-muted">{guest.reference}</p>}
      {guest.flag&&<p className="mt-1 text-[11px] text-status-warning">{lang==="ar"?guest.flagAr:guest.flag}</p>}
    </div>
    {action&&<Link to="/bookings"><Button size="sm" variant="outline">{action}</Button></Link>}
  </div>;
}
