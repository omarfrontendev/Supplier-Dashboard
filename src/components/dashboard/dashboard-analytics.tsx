import { Fragment, useState } from "react";
import { ArrowLeft, ArrowRight, Download, TrendingUp } from "lucide-react";
import { Area,AreaChart,Bar,BarChart,CartesianGrid,Cell,Line,LineChart,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { dashboardMonths,heatmapBlockedNights,heatmapNights,heatmapRooms,kpis,leadTimeData,insightCards,lostNights,pickupData,requestOutcomes } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import { arNum } from "@/lib/rate-overlay-data";
import { fill, useLanguage } from "@/lib/i18n";
import { ChartDataDialog,PeriodDialog } from "./dashboard-overlays";

/** UI 09.0 - the seven steps of the occupancy ramp, empty to full. */
const HEAT_STEPS=["bg-heat-1","bg-heat-2","bg-heat-3","bg-heat-4","bg-heat-5","bg-heat-6","bg-heat-7"] as const;
const HEAT:Record<number,string>={1:HEAT_STEPS[0],2:HEAT_STEPS[1],3:HEAT_STEPS[2],4:HEAT_STEPS[3],5:HEAT_STEPS[4],6:HEAT_STEPS[5],7:HEAT_STEPS[6]};
const chartColors={green:"var(--brand-mid)",mint:"var(--status-success-bg)",blue:"var(--status-info)",orange:"var(--status-warning)",red:"var(--status-danger)",grid:"var(--border-subtle)"};
export function DashboardAnalytics({onBack}:{onBack:()=>void}){const {lang,dir}=useLanguage();const ar=lang==="ar";const t=dashboardCopy[lang];const [periodOpen,setPeriodOpen]=useState(false);const [dataOpen,setDataOpen]=useState(false);const Back=dir==="rtl"?ArrowRight:ArrowLeft;const exportAll=()=>{const csv=dashboardMonths.map(m=>`${m.month},${m.nights},${m.rate}`).join("\n");const url=URL.createObjectURL(new Blob([`month,nights,rate\n${csv}`]));const a=document.createElement("a");a.href=url;a.download="hoteliana-analytics.csv";a.click();URL.revokeObjectURL(url)};return <>
<Button variant="outline" size="sm" onClick={onBack} className="mb-[18px]"><Back className="h-4 w-4"/>{t.back}</Button><header className="mb-[18px] flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="max-w-[820px]"><p className="text-overline text-text-muted">{t.analytics}</p><h1 className="mt-1 text-[26px] font-semibold leading-[34px] text-text-primary">{t.analyticsTitle}</h1><p className="mt-1 text-[13px] leading-5 text-text-secondary">{t.analyticsBody}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={()=>setPeriodOpen(true)}>{t.period}⌄</Button><Button variant="outline" size="sm" onClick={exportAll}><Download className="h-4 w-4"/>{t.export}</Button><p className="w-full text-end text-[11px] text-text-muted">{t.readAt}</p></div></header>
<div className="mb-[18px] grid gap-[14px] sm:grid-cols-2 xl:grid-cols-5">{kpis.map((k,i)=><button key={k.key} onClick={()=>setDataOpen(true)} className="min-h-[136px] rounded-xl border border-border-subtle bg-surface-default p-[18px] text-start shadow-card transition-colors hover:bg-surface-subtle"><p className="text-overline text-text-muted">{t[k.key]}</p><p className="font-data mt-1 text-[26px] font-semibold leading-8 text-text-primary">{k.value}</p><p className={`mt-2 text-[11px] ${k.positive?"text-status-success":"text-status-warning"}`}>{k.positive?"↑":"↓"} {k.delta}</p><svg viewBox="0 0 220 32" className="mt-2 h-8 w-full" aria-hidden="true"><polyline fill="none" stroke={i===2?chartColors.blue:chartColors.green} strokeWidth="1.5" points={dashboardMonths.map((m,x)=>`${x*20},${30-(i===2?(m.rate-330)/5:m.nights/7)}`).join(" ")}/></svg></button>)}</div>
<div className="grid gap-[18px] lg:grid-cols-2"><ChartCard title={t.roomNightsTitle} desc={lang==="ar"?"كمية التوريد التي بيعت فعليًا.":"How much you actually supplied. Ramadan and the ten nights are the whole shape of the year."} action={()=>setDataOpen(true)}><ResponsiveContainer width="100%" height={232}><BarChart data={dashboardMonths}><CartesianGrid vertical={false} stroke={chartColors.grid}/><XAxis dataKey={lang==="ar"?"monthAr":"month"} tickLine={false} axisLine={false} fontSize={10}/><YAxis domain={[0,170]} ticks={[0,57,113,170]} tickLine={false} axisLine={false} fontSize={10}/><Tooltip/><Bar dataKey="nights" radius={[4,4,0,0]}>{dashboardMonths.map(m=><Cell key={m.month} fill={m.month==="Mar"?chartColors.green:"var(--primary-subtle-border)"}/>)}</Bar></BarChart></ResponsiveContainer></ChartCard>
<ChartCard title={t.rateTitle} desc={lang==="ar"?"سعرك أنت، وليس السعر الذي دفعه النزيل.":"The same twelve months, your own rate - not what the agent charged the guest."} action={()=>setDataOpen(true)}><ResponsiveContainer width="100%" height={232}><LineChart data={dashboardMonths}><CartesianGrid vertical={false} stroke={chartColors.grid}/><XAxis dataKey={lang==="ar"?"monthAr":"month"} tickLine={false} axisLine={false} fontSize={10}/><YAxis domain={[330,470]} ticks={[330,377,423,470]} tickLine={false} axisLine={false} fontSize={10}/><Tooltip/><Line dataKey="rate" stroke={chartColors.blue} strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></ChartCard>
<ChartCard className="lg:col-span-2 xl:col-span-1" title={t.pickupTitle} desc={t.pickupDesc}><ResponsiveContainer width="100%" height={230}><LineChart data={pickupData}><CartesianGrid vertical={false} stroke={chartColors.grid}/><XAxis dataKey="night" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false}/><Tooltip/><Line dataKey="now" stroke={chartColors.green} dot={false}/><Line dataKey="last" stroke={chartColors.blue} strokeDasharray="4 3" dot={false}/></LineChart></ResponsiveContainer></ChartCard>
<ChartCard title={t.leadTitle} desc={lang==="ar"?"ليالي الغرف حسب بُعد الحجز عن الوصول.":"Room-nights by how many days before arrival the booking came in."}><ResponsiveContainer width="100%" height={230}><BarChart data={leadTimeData}><XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={9}/><YAxis hide/><Tooltip/><Bar dataKey="value" fill={chartColors.green} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></ChartCard>
</div>
{/*
  UI 09.0 - the occupancy heatmap, as the frame draws it: a 38px cell
  with a 6px radius on a seven-step ramp, the day under each column, the
  scale and what cannot be sold beside it, and a sentence underneath.

  A blocked night is not a low number - it is not a number at all. The
  frame takes it off the ramp and draws it white with a pink outline,
  which is the point the description is making.
*/}
<ChartCard className="mt-[18px]" title={t.heatTitle} desc={t.heatDesc}>
  <div className="overflow-x-auto">
    {/* The frame's 200px name column is a 1300px-wide number; it narrows
        with the card, and the nights scroll rather than shrink away. */}
    <div className="min-w-[540px] [--heat-label:104px] sm:[--heat-label:150px] lg:[--heat-label:200px]">
      <div className="grid gap-x-[3px] gap-y-[6px] [grid-template-columns:var(--heat-label)_repeat(14,minmax(0,1fr))]">
        {heatmapRooms.map(r=>(
          <Fragment key={r.room}>
            <span className="self-center truncate pe-[7px] text-[11px] font-medium leading-[17px] text-text-body">{ar?r.roomAr:r.room}</span>
            {r.values.map((v,i)=>(
              <span
                key={i}
                title={v==="blocked"?t.heatBlockedOne:`${v}/7`}
                className={cn(
                  "h-[38px] rounded-[6px]",
                  v==="blocked"
                    ? "border border-heat-blocked bg-surface-default"
                    : HEAT[v]
                )}
              />
            ))}
          </Fragment>
        ))}
        {/* The night each column stands for. */}
        <span aria-hidden="true"/>
        {heatmapNights.days.map(d=>(
          <span key={d} className="pt-1.5 text-center text-[10px] leading-[15px] text-text-muted">{ar?arNum(d):d}</span>
        ))}
      </div>
      <p className="ps-[calc(var(--heat-label)+3px)] text-[10px] leading-[15px] text-text-muted">
        {ar
          ?`${heatmapNights.fromAr} ← ${heatmapNights.toAr}`
          :`${heatmapNights.from} → ${heatmapNights.to}`}
      </p>
    </div>
  </div>
  <div className="mt-3 flex flex-wrap items-center gap-x-[10px] gap-y-2">
    <span className="text-[11px] leading-[17px] text-text-muted">{t.heatEmpty}</span>
    {HEAT_STEPS.map(step=><span key={step} className={cn("h-[10px] w-[26px] shrink-0 rounded-[3px]",step)}/>)}
    <span className="text-[11px] leading-[17px] text-text-muted">{t.heatFull}</span>
    {/* Off the ramp, and pushed away from it - the frame separates them
        with a spacer because they are not the same kind of thing. */}
    <span className="flex items-center gap-[7px] sm:ms-auto">
      <span className="h-[10px] w-[10px] shrink-0 rounded-[3px] border border-heat-blocked bg-surface-default"/>
      <span className="text-[11.5px] leading-[17px] text-status-danger">
        {fill(t.heatBlocked,{count:ar?arNum(heatmapBlockedNights):heatmapBlockedNights})}
      </span>
    </span>
  </div>
  <p className="mt-3 text-xs leading-[17px] text-text-body">{t.heatNote}</p>
</ChartCard>
<div className="mt-[18px] grid gap-[18px] lg:grid-cols-2"><ChartCard title={t.lostTitle} desc={lang==="ar"?"ليالٍ لم تتمكن من الوصول إلى الوكيل.":"Twelve months. Every one of these is a night you had a room for and nobody could buy it - grouped by the blocker the engine returned."}><ResponsiveContainer width="100%" height={250}><BarChart data={lostNights} layout="vertical"><XAxis type="number" hide/><YAxis dataKey="label" type="category" width={130} fontSize={9} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="value" fill={chartColors.green} radius={[0,3,3,0]}/></BarChart></ResponsiveContainer></ChartCard><ChartCard title={t.outcomesTitle} desc={lang==="ar"?"نتيجة طلبات عند الطلب.":"On Request bookings only - the ones where an agent had to wait for your yes."}><div className="flex h-[250px] items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip/><Pie data={requestOutcomes} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92}>{requestOutcomes.map((_,i)=><Cell key={i} fill={[chartColors.green,chartColors.orange,chartColors.red][i]}/>)}</Pie></PieChart></ResponsiveContainer></div></ChartCard></div>
<ChartCard className="mt-[18px]" title={t.moneyChart} desc={t.moneyChartDesc}><ResponsiveContainer width="100%" height={260}><AreaChart data={dashboardMonths}><CartesianGrid vertical={false} stroke={chartColors.grid}/><XAxis dataKey={lang==="ar"?"monthAr":"month"} axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Area dataKey="cash" stroke={chartColors.green} fill="var(--primary-subtle)"/></AreaChart></ResponsiveContainer></ChartCard>
<section className="mt-[18px] rounded-xl border border-border-subtle bg-surface-default p-[22px] shadow-card"><h2 className="text-lg font-semibold">{t.insights}</h2><p className="mt-1 max-w-[760px] text-xs leading-5 text-text-secondary">{t.insightsSub}</p><div className="mt-4 grid gap-3 lg:grid-cols-3">{insightCards.map((card,index)=><article key={card.title} className="rounded-lg border border-border-subtle p-4"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-subtle font-data text-xs text-brand-deep">{index+1}</span><h3 className="mt-3 text-sm font-semibold text-text-primary">{lang==="ar"?card.titleAr:card.title}</h3><p className="mt-2 text-xs leading-5 text-text-secondary">{lang==="ar"?card.bodyAr:card.body}</p><Link to={card.to} search={{}} className="mt-3 inline-block"><Button size="sm" variant="outline">{lang==="ar"?card.actionAr:card.action}</Button></Link></article>)}</div><p className="mt-4 rounded-lg bg-surface-subtle p-4 text-[11px] leading-5 text-text-secondary">{t.analyticsFooter}</p></section><PeriodDialog open={periodOpen} setOpen={setPeriodOpen}/><ChartDataDialog open={dataOpen} setOpen={setDataOpen}/></>}
function ChartCard({title,desc,children,className="",action}:{title:string;desc:string;children:React.ReactNode;className?:string;action?:()=>void}){const {lang}=useLanguage();return <section className={`min-w-0 rounded-xl border border-border-subtle bg-surface-default p-[22px] shadow-card ${className}`}><div className="mb-[14px] flex items-start justify-between gap-3"><div><h2 className="text-[15px] font-semibold leading-6 text-text-primary">{title}</h2><p className="mt-0.5 text-xs leading-[17px] text-text-muted">{desc}</p></div>{action&&<Button variant="ghost" size="icon-sm" aria-label={dashboardCopy[lang].chartData} title={dashboardCopy[lang].chartData} onClick={action}><TrendingUp className="h-4 w-4"/></Button>}</div>{children}</section>}
