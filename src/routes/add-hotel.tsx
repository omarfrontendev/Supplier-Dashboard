import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Upload,
} from "lucide-react";
import { arDigits } from "@/lib/arabic-count";
import { RequestSentOverlay } from "@/components/hotels/library-overlays";
import { hotelSubmitted } from "@/lib/library-overlay-data";
import {
  BackLink,
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import { notify, wait } from "@/lib/notify";
import { usePortal } from "@/lib/portal-store";

export const Route = createFileRoute("/add-hotel")({
  head: () => ({
    meta: [
      { title: "Add a missing hotel · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Send a hotel that is missing from the Hoteliana library for verification and approval.",
      },
      {
        property: "og:title",
        content: "Add a missing hotel · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Submit hotel details, photos and amenities for Hoteliana review.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AddHotelPage,
});

/** Figma UI 02.8 uses three steps: details, photos & amenities, review. */
type Step = 0 | 1 | 2 | 3;

/** The two library matches Figma UI 02.8H shows against Makkah Gate Hotel. */
const DUPLICATES = [
  {
    name: "Makkah Gate Towers Hotel · فندق أبراج بوابة مكة",
    meta: "Makkah · Ajyad · 4 stars · HTL-3317",
    metaAr: "مكة · أجياد · ٤ نجوم · HTL-3317",
    distance: "120 m",
    distanceAr: "١٢٠ م",
    match: "91%",
    matchAr: "٩١٪",
  },
  {
    name: "Bab Makkah Hotel · فندق باب مكة",
    meta: "Makkah · Jarwal · 3 stars · HTL-2213",
    metaAr: "مكة · جرول · ٣ نجوم · HTL-2213",
    distance: "380 m",
    distanceAr: "٣٨٠ م",
    match: "82%",
    matchAr: "٨٢٪",
  },
];

/** UI 02.8A-U / 02.8A-F — the upload queue and its two failure reasons. */
type UploadState = "uploaded" | "uploading" | "queued" | "rejected" | "failed";
interface UploadRow {
  file: string;
  size: string;
  state: UploadState;
  percent?: number;
  reason?: string;
  reasonAr?: string;
}

const UPLOAD_QUEUE: UploadRow[] = [
  { file: "lobby.jpg", size: "2.1 MB", state: "uploaded" },
  { file: "pool-deck.jpg", size: "3.4 MB", state: "uploading", percent: 62 },
  { file: "room-view.jpg", size: "4.0 MB", state: "queued" },
];

const UPLOAD_FAILED: UploadRow[] = [
  { file: "lobby.jpg", size: "2.1 MB", state: "uploaded" },
  { file: "pool-deck.jpg", size: "3.4 MB", state: "uploaded" },
  {
    file: "facade-night.tif",
    size: "18.6 MB",
    state: "rejected",
    reason:
      "Not uploaded - TIF files are not accepted and the limit is 10 MB. Save it as JPG or PNG.",
    reasonAr:
      "لم تُرفع - ملفات TIF غير مقبولة والحد الأقصى ١٠ ميجابايت. احفظها بصيغة JPG أو PNG.",
  },
  {
    file: "room-view.jpg",
    size: "4.0 MB",
    state: "failed",
    reason: "Not uploaded - the connection dropped. Nothing else was lost.",
    reasonAr: "لم تُرفع - انقطع الاتصال. لم يُفقد أي شيء آخر.",
  },
];

function AddHotelPage() {
  const { c, lang } = useLanguage();
  const navigate = useNavigate();
  const { submitHotel } = usePortal();
  const a = c.addHotel;

  const [step, setStep] = useState<Step>(0);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    stars: "4",
    descEn: "",
    descAr: "",
    country: "Saudi Arabia",
    city: "Makkah",
    area: "",
    address: "",
    map: "",
  });
  const [amenities, setAmenities] = useState<string[]>(
    a.amenityList.slice(0, 10)
  );
  const [photos, setPhotos] = useState(4);
  const [rights, setRights] = useState(false);
  const [accurate, setAccurate] = useState(false);
  const [queue, setQueue] = useState<UploadRow[] | null>(null);
  const [pastDuplicates, setPastDuplicates] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const requiredLeft = [
    form.name.trim(),
    form.nameAr.trim(),
    form.stars,
    form.address.trim(),
    form.map.trim(),
  ].filter((value) => value === "").length;
  const detailsReady = requiredLeft === 0;
  const duplicatesFound = form.name.trim().length > 2;

  const steps = [a.stepDetails, a.stepMedia, a.stepReview];

  const pinned = form.map.trim() !== "";

  return (
    <PageShell>
      <BackLink
        to="/hotels"
        label={
          step === 0 ? a.backToLibrary : step === 1 ? a.backDetails : a.backMedia
        }
      />
      <PageHeader
        overline={
          step === 0
            ? a.overline
            : `${a.overline} · ${form.name.trim().toUpperCase() || "MAKKAH GATE HOTEL"}`
        }
        title={step === 0 ? a.title : step === 1 ? a.mediaTitle : a.reviewTitle}
        subtitle={
          step === 0
            ? a.subtitle
            : step === 1
              ? a.mediaSubtitle
              : a.reviewSubtitle
        }
      />

      <ol className="mb-6 flex flex-wrap items-center gap-2">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
              index === step
                ? "bg-surface-inverse text-text-inverse"
                : index < step
                  ? "bg-status-success-bg text-status-success"
                  : "bg-surface-subtle text-text-muted"
            )}
          >
            {index < step ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <span className="font-data">{index + 1}</span>
            )}
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-6">
          {duplicatesFound && !pastDuplicates && (
            <SectionCard>
              <div className="flex gap-3">
                <AlertTriangle
                  className="mt-0.5 h-5 w-5 shrink-0 text-status-warning"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {fill(
                      DUPLICATES.length === 1
                        ? a.duplicateTitleOne
                        : DUPLICATES.length === 2
                          ? a.duplicateTitleTwo
                          : DUPLICATES.length <= 10
                            ? a.duplicateTitleFew
                            : a.duplicateTitleMany,
                      {
                        n:
                          lang === "ar"
                            ? arDigits(DUPLICATES.length)
                            : String(DUPLICATES.length),
                      }
                    )}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {a.duplicateBody}
                  </p>
                  <div className="mt-4 space-y-3">
                    {DUPLICATES.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-surface-default p-4"
                      >
                        {/* The library's own picture, so the row is
                            recognised before it is read. */}
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-deep text-text-inverse"
                        >
                          <Building2 className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {item.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-text-muted">
                            {lang === "ar" ? item.metaAr : item.meta}
                          </p>
                          <p className="mt-1 text-xs text-text-secondary">
                            {fill(a.matchNote, {
                              distance:
                                lang === "ar" ? item.distanceAr : item.distance,
                              match: lang === "ar" ? item.matchAr : item.match,
                            })}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {a.view}
                        </Button>
                        <Link to="/hotels">
                          {/* The closest match is the likely answer, so the
                              frame fills its button and leaves the rest
                              quiet. A list of equals would decide nothing. */}
                          <Button
                            variant={index === 0 ? "default" : "outline"}
                            size="sm"
                          >
                            {a.requestInstead}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-text-muted">
                    {a.duplicateNote}
                  </p>
                </div>
              </div>
            </SectionCard>
          )}

          <SectionCard overline={a.identityOverline} title={a.identityTitle}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={a.name}
                placeholder={a.namePh}
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
              />
              <Input
                label={a.nameAr}
                placeholder={a.nameArPh}
                value={form.nameAr}
                onChange={(e) => set("nameAr")(e.target.value)}
              />
              <Select
                label={a.stars}
                value={form.stars}
                onChange={set("stars")}
                options={[5, 4, 3, 2, 1].map((n) => ({
                  value: String(n),
                  label: fill(c.library.stars, { count: n }),
                }))}
              />
              <div className="space-y-2">
                <span className="block text-[13px] font-medium leading-[1.3] text-text-primary">
                  {a.descEn}
                </span>
                <Textarea
                  placeholder={a.descEnPh}
                  value={form.descEn}
                  onChange={(e) => set("descEn")(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <span className="block text-[13px] font-medium leading-[1.3] text-text-primary">
                  {a.descAr}
                </span>
                <Textarea
                  placeholder={a.descArPh}
                  value={form.descAr}
                  onChange={(e) => set("descAr")(e.target.value)}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard overline={a.locationOverline} title={a.locationTitle}>
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label={a.country}
                value={form.country}
                onChange={set("country")}
                options={[
                  {
                    value: "Saudi Arabia",
                    label: lang === "ar" ? "السعودية" : "Saudi Arabia",
                  },
                ]}
              />
              <Select
                label={a.city}
                value={form.city}
                onChange={set("city")}
                options={["Makkah", "Madinah", "Jeddah", "Riyadh"].map(
                  (city) => ({ value: city, label: city })
                )}
              />
              <Input
                label={a.area}
                placeholder={a.areaPh}
                value={form.area}
                onChange={(e) => set("area")(e.target.value)}
              />
              <Input
                label={a.address}
                placeholder={a.addressPh}
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
              />
              <div className="md:col-span-2">
                <Input
                  label={a.map}
                  placeholder={a.mapPh}
                  hint={a.mapHint}
                  value={form.map}
                  onChange={(e) => set("map")(e.target.value)}
                />
                <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-border-default bg-surface-subtle">
                  {pinned ? (
                    <span className="inline-flex items-center gap-2 text-sm text-status-success">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {a.pinConfirmed}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-text-muted">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {a.mapHint}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              {fill(a.required, { count: requiredLeft })}
            </p>
            <div className="flex gap-3">
              <Link to="/hotels">
                <Button variant="ghost">{c.common.cancel}</Button>
              </Link>
              <Button
                disabled={!detailsReady}
                onClick={() => {
                  setPastDuplicates(true);
                  setStep(1);
                }}
              >
                {duplicatesFound && !pastDuplicates ? a.continueAnyway : a.next}
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <SectionCard
            overline={fill(a.mediaOverline, { count: photos })}
            title={a.mediaTitle}
          >
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-default bg-surface-subtle p-8 text-center">
              <ImagePlus className="h-8 w-8 text-text-muted" aria-hidden="true" />
              <p className="text-sm font-medium text-text-primary">
                {a.dropzone}
              </p>
              <p className="text-xs text-text-muted">{a.dropzoneHint}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setQueue(UPLOAD_QUEUE);
                    setPhotos(1);
                  }}
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  {a.browse}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setQueue(null);
                    setPhotos(6);
                  }}
                >
                  {a.addMore}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setQueue(UPLOAD_FAILED);
                    setPhotos(2);
                  }}
                >
                  {a.tryAgain}
                </Button>
              </div>
            </div>

            {queue ? (
              <div className="mt-4">
                <p className="text-xs text-text-muted">
                  {fill(a.uploadSummary, {
                    count: queue.length,
                    detail: queue.some((row) => row.state === "uploading")
                      ? "1 uploaded, 1 uploading, 1 waiting"
                      : "2 uploaded, 2 need you",
                  })}
                </p>
                <ul className="mt-3 space-y-2">
                  {queue.map((row) => (
                    <li
                      key={row.file}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-data truncate text-sm text-text-primary">
                          {row.file} · {row.size}
                        </p>
                        <p
                          className={cn(
                            "mt-0.5 text-xs",
                            row.state === "rejected" || row.state === "failed"
                              ? "text-status-danger"
                              : "text-text-muted"
                          )}
                        >
                          {row.state === "uploaded"
                            ? a.uploaded
                            : row.state === "uploading"
                              ? fill(a.uploading, { percent: row.percent ?? 0 })
                              : row.state === "queued"
                                ? a.queued
                                : lang === "ar"
                                  ? row.reasonAr
                                  : row.reason}
                        </p>
                      </div>
                      {row.state === "failed" && (
                        <Button variant="outline" size="sm">
                          {a.tryAgain}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        {row.state === "uploading" || row.state === "queued"
                          ? a.cancelUpload
                          : a.remove}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: photos }).map((_, index) => (
                  <div
                    key={index}
                    className="relative flex h-24 items-center justify-center rounded-lg bg-surface-subtle"
                  >
                    {index === 0 && (
                      <StatusPill tone="brand">{a.cover}</StatusPill>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {a.mediaNote}
            </p>

            <label className="mt-4 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={rights}
                onChange={(e) => setRights(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--brand-deep)]"
              />
              <span className="text-[13px] leading-[1.5] text-text-secondary">
                {a.rights}
              </span>
            </label>
          </SectionCard>

          <SectionCard
            overline={fill(a.amenitiesOverline, { count: amenities.length })}
            title={a.amenitiesTitle}
          >
            <div className="flex flex-wrap gap-2">
              {a.amenityList.map((amenity) => {
                const active = amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() =>
                      setAmenities((prev) =>
                        prev.includes(amenity)
                          ? prev.filter((item) => item !== amenity)
                          : [...prev, amenity]
                      )
                    }
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-sm transition-colors",
                      active
                        ? "border-brand-deep bg-primary-subtle text-text-primary"
                        : "border-border-default text-text-secondary hover:bg-surface-subtle"
                    )}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {a.amenitiesNote}
            </p>
          </SectionCard>

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={() => setStep(0)}>
              {a.back}
            </Button>
            <Button disabled={!rights} onClick={() => setStep(2)}>
              {a.nextMedia}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <SectionCard
            overline={a.reviewStep1}
            title={`${form.name || "Makkah Gate Hotel"} · ${form.nameAr || "فندق بوابة مكة"}`}
            right={
              <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
                {a.edit}
              </Button>
            }
          >
            <dl>
              {[
                /* The frame names where the rating comes from, because a
                   star count nobody issued is just a claim. */
                [
                  a.fieldStars,
                  `${fill(c.library.stars, { count: Number(form.stars) })} · ${a.starsSource}`,
                ],
                [
                  a.fieldCountry,
                  `${form.country} · ${form.city}${form.area ? ` · ${form.area}` : ""}`,
                ],
                [a.fieldAddress, form.address],
                [a.fieldMap, `${a.pinConfirmed}`],
                [
                  a.fieldDuplicate,
                  fill(a.duplicateSummary, { count: DUPLICATES.length }),
                ],
                [a.fieldDescEn, form.descEn || "—"],
                [a.fieldDescAr, form.descAr || "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b border-border-subtle py-3 last:border-b-0 sm:flex-row sm:gap-3"
                >
                  <dt className="text-sm text-text-secondary sm:w-48 sm:shrink-0">
                    {label}
                  </dt>
                  <dd
                    className={cn(
                      "min-w-0 flex-1 text-sm text-text-primary",
                      /* Continuing past a duplicate is the one line on this
                         page that someone may have to answer for. */
                      label === a.fieldDuplicate &&
                        "font-medium text-status-warning"
                    )}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          <SectionCard
            overline={a.reviewStep2}
            title={fill(a.reviewMedia, {
              images: photos,
              amenities: amenities.length,
            })}
            right={
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                {a.edit}
              </Button>
            }
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: photos }).map((_, index) => (
                <div
                  key={index}
                  className="relative flex h-24 items-center justify-center rounded-lg bg-surface-subtle"
                >
                  {index === 0 && (
                    <StatusPill tone="brand">{a.cover}</StatusPill>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-surface-subtle px-3 py-1.5 text-xs text-text-secondary"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </SectionCard>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={accurate}
              onChange={(e) => setAccurate(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--brand-deep)]"
            />
            <span className="text-sm leading-[1.5] text-text-secondary">
              {a.reviewLegal}
            </span>
          </label>

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}>
              {a.back}
            </Button>
            <Button
              loading={sending}
              disabled={!accurate}
              onClick={() => {
                setSending(true);
                void (async () => {
                  await wait(650);
                  submitHotel(form.name || "Makkah Gate Hotel");
                  notify.success(c.toast.hotelSubmitted, {
                    description: c.toast.hotelSubmittedDesc,
                  });
                  setSending(false);
                  setStep(3);
                })();
              }}
            >
              {a.submit}
            </Button>
          </div>
        </div>
      )}

      {/* OV 02.8C — the hotel is with Hoteliana, on the 660 shell. */}
      {step === 3 && (
        <RequestSentOverlay
          copy={{
            ...hotelSubmitted,
            steps: [
              {
                en: fill(hotelSubmitted.steps[0]!.en, {
                  images: photos,
                  amenities: amenities.length,
                }),
                ar: fill(hotelSubmitted.steps[0]!.ar, {
                  images: photos,
                  amenities: amenities.length,
                }),
              },
              hotelSubmitted.steps[1]!,
              hotelSubmitted.steps[2]!,
            ],
          }}
          refs="HOT-10492"
          names={`${form.name || a.reviewHotel} · ${form.city} · ${a.submittedJustNow}`}
          onClose={() => navigate({ to: "/hotels" })}
          onViewRequests={() => navigate({ to: "/requests" })}
        />
      )}
    </PageShell>
  );
}
