import { CheckCircle2, Clock3, Hourglass, XCircle } from "lucide-react";
import type { ChangeRequest } from "@/lib/change-request-data";
import { useLanguage } from "@/lib/i18n";

export function ChangeRequestStatus({ request }: { request: ChangeRequest }) {
  const { lang } = useLanguage();
  const values = {
    waiting: { label: lang === "ar" ? "بانتظارك" : "Waiting on you", cls: "bg-status-warning-bg text-status-warning", Icon: Clock3 },
    agent: { label: lang === "ar" ? "بانتظار الوكيل" : "Waiting on agent", cls: "bg-status-info-bg text-status-info", Icon: Hourglass },
    handled: { label: lang === "ar" ? "تمت المعالجة" : "Handled", cls: "bg-surface-subtle text-text-secondary", Icon: CheckCircle2 },
    approved: { label: lang === "ar" ? "معتمد" : "Approved", cls: "bg-status-success-bg text-status-success", Icon: CheckCircle2 },
    declined: { label: lang === "ar" ? "مرفوض" : "Declined", cls: "bg-status-danger-bg text-status-danger", Icon: XCircle },
    cancelled: { label: lang === "ar" ? "ملغى" : "Cancelled", cls: "bg-surface-inverse text-text-inverse", Icon: CheckCircle2 },
  } as const;
  const item = values[request.state];
  return <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.cls}`}><item.Icon className="h-3.5 w-3.5" />{item.label}</span>;
}
