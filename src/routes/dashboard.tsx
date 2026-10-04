import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardAnalytics } from "@/components/dashboard/dashboard-analytics";
import { DashboardNeedsYou } from "@/components/dashboard/dashboard-needs-you";
import { PageShell } from "@/components/layout/page-shell";
import type { DashboardRole } from "@/lib/dashboard-data";

export const Route=createFileRoute("/dashboard")({
 validateSearch:(search:Record<string,unknown>):{state?:"clear";view?:"analytics"}=>({...(search["state"]==="clear"?{state:"clear" as const}:{}),...(search["view"]==="analytics"?{view:"analytics" as const}:{})}),
 head:()=>({meta:[
  {title:"Dashboard · Hoteliana Supplier Portal"},
  {name:"description",content:"Review priority work, hotel supply, team activity and selling analytics."},
  {property:"og:title",content:"Dashboard · Hoteliana Supplier Portal"},
  {property:"og:description",content:"Review priority work, hotel supply, team activity and selling analytics."},
  {property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},
 ]}),component:DashboardPage,
});
function DashboardPage(){const {state,view}=Route.useSearch();const [screen,setScreen]=useState<"needs"|"analytics">(view==="analytics"?"analytics":"needs");const [role,setRole]=useState<DashboardRole>("owner");return <PageShell>{screen==="analytics"?<DashboardAnalytics onBack={()=>setScreen("needs")}/>:<DashboardNeedsYou role={role} setRole={setRole} onAnalytics={()=>setScreen("analytics")} clear={state==="clear"}/>}</PageShell>}
