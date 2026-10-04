import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  BedDouble,
  Clock3,
  Search,
  SlidersHorizontal,
  Timer,
} from "lucide-react";
import {
  BackLink,
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { onRequestQueue } from "@/lib/contract-data";
import { FilterPanel } from "@/components/contracts/contract-overlays";
import { AnswerOverlay } from "@/components/contracts/lifecycle-overlays";
import { queuePanel } from "@/lib/contract-overlay-data";

export const Route = createFileRoute("/rate-contracts/$contractId/queue")({
  head: () => ({
    meta: [
      { title: "On Request queue · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Answer the On Request bookings waiting under this supply contract before their SLA expires.",
      },
      {
        property: "og:title",
        content: "On Request queue · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Every waiting request, the room it holds and the time left to answer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QueuePage,
});

/** Figma UI 03.23 — the contract's On Request queue and its SLA clock. */
function QueuePage() {
  const { contractId } = Route.useParams();
  const { lang } = useLanguage();
  const { contracts } = usePortal();
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState("all");
  const [stay, setStay] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [sort, setSort] = useState("timeLeft");

  const contract = contracts.find((item) => item.id === contractId);
  if (!contract) throw notFound();

  const ar = lang === "ar";
  const t = ar
    ? {
        overline: "عقد التوريد · طابور الطلبات",
        title: "طابور الطلبات",
        subtitle:
          "٦ طلبات بالانتظار · ٣٠ دقيقة للرد على كل واحد · مرتّبة حسب الوقت المتبقي. كل طلب يحجز غرفة واحدة حتى تجيب أو تنتهي المهلة؛ والطلبات المنتهية تُرفض تلقائيًا وتتولاها هوتيليانا.",
        waiting: "بالانتظار",
        waitingHint: "في الطابور",
        past: "تجاوز المهلة",
        pastHint: "رفض تلقائي خلال ٠٠:٠٠ ← تتولاها هوتيليانا",
        answered: "أُجيب اليوم",
        answeredHint: "متوسط ١١ دقيقة",
        heldRooms: "الغرف المحجوزة",
        heldHint: "غرفة لكل طلب",
        search: "بحث",
        searchPh: "ابحث برقم الحجز أو الوكيل أو النزيل",
        room: "الغرفة",
        allRooms: "كل الغرف",
        stay: "تاريخ الإقامة",
        anyDate: "أي تاريخ",
        sort: "الترتيب",
        sortValue: "الوقت المتبقي · تصاعدي",
        colRequest: "الطلب",
        colAgent: "الوكيل",
        colStay: "الإقامة",
        colRoom: "الغرفة · الوجبة · الإطلالة",
        colGuests: "الضيوف",
        colCost: "التكلفة",
        colHeld: "محجوز",
        colLeft: "الوقت المتبقي",
        answer: "الرد",
        pastSla: "تجاوز المهلة",
        note: "تُحتسب المهلة بتوقيت السعودية (UTC+3) من لحظة وصول الطلب. والطلب الذي يتجاوز مهلته يُرفض تلقائيًا ويُعلَّم هنا وفي «تحتاج انتباهك».",
        back: "عقود توريد الفنادق",
      }
    : {
        overline: "SUPPLY CONTRACT · ON REQUEST QUEUE",
        title: "On Request queue",
        subtitle:
          "6 requests waiting · 30 minutes to answer each · sorted by time left. Each request holds one room until you answer or the SLA expires; expired requests are auto-rejected and Hoteliana takes it from there.",
        waiting: "Waiting",
        waitingHint: "in the queue",
        past: "Past SLA",
        pastHint: "auto-reject in 00:00 → Hoteliana takes over",
        answered: "Answered today",
        answeredHint: "avg 11 min",
        heldRooms: "Held rooms",
        heldHint: "1 per request",
        search: "Search",
        searchPh: "Search booking ID, agent or guest",
        room: "Room",
        allRooms: "All rooms",
        stay: "Stay date",
        anyDate: "Any date",
        sort: "Sort",
        sortValue: "Time left · ascending",
        colRequest: "Request",
        colAgent: "Agent",
        colStay: "Stay",
        colRoom: "Room · meal · view",
        colGuests: "Guests",
        colCost: "Cost",
        colHeld: "Held",
        colLeft: "Time left",
        answer: "Answer",
        pastSla: "Past SLA",
        note: "SLA is measured in Saudi time (UTC+3) from the moment the request arrives. A request past its SLA is auto-rejected and flagged here and in Need attention.",
        back: "Hotel supply contracts",
      };

  const rows = onRequestQueue.filter((request) => {
    const hay = `${request.id} ${request.agent} ${request.agentAr}`.toLowerCase();
    if (query && !hay.includes(query.toLowerCase())) return false;
    if (room !== "all" && !request.room.startsWith(room)) return false;
    return true;
  });

  const rooms = Array.from(
    new Set(onRequestQueue.map((request) => request.room.split(" · ")[0]!))
  );

  return (
    <PageShell>
      <BackLink to="/rate-contracts" label={t.back} />
      <PageHeader
        overline={t.overline}
        title={t.title}
        subtitle={t.subtitle}
        right={
          <Link to="/rate-contracts/$contractId" params={{ contractId }}>
            <Button variant="outline">
              {ar ? contract.nameAr : contract.name}
            </Button>
          </Link>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<Clock3 />} label={t.waiting} value="6" hint={t.waitingHint} />
        <Stat
          icon={<AlertTriangle />}
          label={t.past}
          value="1"
          hint={t.pastHint}
          warning
        />
        <Stat icon={<Timer />} label={t.answered} value="9" hint={t.answeredHint} />
        <Stat icon={<BedDouble />} label={t.heldRooms} value="6" hint={t.heldHint} />
      </div>

      <SectionCard className="mb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">
              {t.search}
            </span>
            <span className="relative block">
              <Search
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPh}
                className="h-[50px] w-full rounded-lg border border-border-default bg-surface-default ps-10 pe-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:outline-none"
              />
            </span>
          </label>
          <Select
            label={t.room}
            value={room}
            onChange={setRoom}
            options={[
              { value: "all", label: t.allRooms },
              ...rooms.map((name) => ({ value: name, label: name })),
            ]}
          />
          <Select
            label={t.stay}
            value={stay}
            onChange={setStay}
            searchable={false}
            options={[{ value: "all", label: t.anyDate }]}
          />
          <Select
            label={t.sort}
            value={sort}
            onChange={setSort}
            searchable={false}
            options={[{ value: "timeLeft", label: t.sortValue }]}
          />
        </div>
        {/* OV 03.23B — the full filter the design opens over the queue. */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {ar ? "تصفية الطابور" : "Filter the queue"}
          </Button>
        </div>
      </SectionCard>

      {filterOpen && (
        <FilterPanel panel={queuePanel} onClose={() => setFilterOpen(false)} />
      )}
      {answerOpen && (
        <AnswerOverlay
          onClose={() => setAnswerOpen(false)}
          onSend={() => setAnswerOpen(false)}
        />
      )}

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="text-overline text-text-muted">
                {[
                  t.colRequest,
                  t.colAgent,
                  t.colStay,
                  t.colRoom,
                  t.colGuests,
                  t.colCost,
                  t.colHeld,
                  t.colLeft,
                  "",
                ].map((cell, index) => (
                  <th
                    key={`${cell}-${index}`}
                    className="py-2 text-start font-semibold"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-border-subtle align-middle"
                >
                  <td className="font-data py-3 pe-3 text-text-primary">
                    {request.id}
                  </td>
                  <td className="py-3 pe-3 text-text-secondary">
                    {ar ? request.agentAr : request.agent}
                  </td>
                  <td className="py-3 pe-3 text-text-secondary">
                    {ar ? request.stayAr : request.stay}
                  </td>
                  <td className="py-3 pe-3 text-text-primary">
                    {ar ? request.roomAr : request.room}
                  </td>
                  <td className="py-3 pe-3 text-text-secondary">
                    {ar ? request.guestsAr : request.guests}
                  </td>
                  <td className="font-data py-3 pe-3 text-text-primary">
                    {request.cost}
                  </td>
                  <td className="font-data py-3 pe-3 text-text-secondary">
                    {request.held}
                  </td>
                  <td className="py-3 pe-3">
                    {request.pastSla ? (
                      <StatusPill tone="danger">{t.pastSla}</StatusPill>
                    ) : (
                      <span className="font-data text-text-primary">
                        {request.timeLeft}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAnswerOpen(true)}
                    >
                      {t.answer}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-text-muted">{t.note}</p>
      </SectionCard>
    </PageShell>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  warning = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default px-[18px] py-4">
      <span
        className={
          warning
            ? "flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-status-warning-bg text-status-warning [&>svg]:h-[18px] [&>svg]:w-[18px]"
            : "flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-primary-subtle text-brand-deep [&>svg]:h-[18px] [&>svg]:w-[18px]"
        }
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-overline text-text-muted">{label}</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <strong className="font-data text-xl text-text-primary">{value}</strong>
          <span className="text-xs text-text-muted">{hint}</span>
        </div>
      </div>
    </div>
  );
}
