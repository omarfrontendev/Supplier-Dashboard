import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Bed, Check, Hash, Info, Plus, Upload, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { roomCatalogue, type RoomType } from "@/lib/demo-data";
import { drawerMotion, panelMotion, scrimMotion, useDismiss } from "@/components/layout/overlay";
import { cn } from "@/lib/utils";
import { useCreateRoom } from "@/api/modules/requests/useCreateRoom";
import { useUploadFile } from "@/api/modules/useUploads";
import { useHotelContractsMetadata } from "@/api/modules/hotel-contract/useHotelContractsMetadata";
import { ROOM_SIZES } from "@/lib/room-sizes";
import { RoomFormValues, roomSchema } from "@/components/hotels/add-missing-room/roomSchema";

/* ---------- OV 02.R1 / R2 — add a missing room ---------- */

export function AddRoomDrawer({
  hotelId,
  hotelName,
  onClose,
  refetchRooms,
}: {
  hotelId: string | number;
  hotelName: string;
  onClose: () => void;
  refetchRooms: () => void;
}) {
  const { c, dir, lang } = useLanguage();
  const dismiss = useDismiss({ onClose });
  const { submitRoom } = usePortal();
  const navigate = useNavigate();
  const d = c.roomDrawer;

  const [form, setForm] = useState({
    name: "",
    occupancy: "",
    adults: "",
    children: "",
    childAge: "",
    bed: "",
    size: "",
    view: "",
  });
  const [images, setImages] = useState(0);
  const [override, setOverride] = useState(false);
  const [rights, setRights] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const typed = form.name.trim().toLowerCase();
  const matches =
    typed.length > 2
      ? roomCatalogue
          .map((room) => {
            const nameMatch = room.name.toLowerCase().includes(typed);
            const occMatch =
              form.occupancy.trim() !== "" &&
              String(room.occupancy) === form.occupancy.trim().replace(/\D/g, "");
            if (!nameMatch && !occMatch) return null;
            return { room, match: nameMatch ? d.matchName : d.matchOccupancy };
          })
          .filter((item): item is { room: RoomType; match: string } => item !== null)
          .slice(0, 2)
      : [];

  const showDuplicates = !override && matches.length > 0;

  // const ready =
  //   form.name.trim().length > 2 &&
  //   form.occupancy.trim() !== "" &&
  //   form.adults.trim() !== "" &&
  //   form.childAge.trim() !== "" &&
  //   form.bed.trim() !== "" &&
  //   form.size.trim() !== "" &&
  //   form.view.trim() !== "" &&
  //   images >= 2 &&
  //   rights &&
  //   !showDuplicates;

  const roomName = form.name.trim();

  // const submit = async () => {
  //   setSending(true);
  //   await wait(600);
  //   submitRoom({ hotelId, name: roomName });
  //   notify.success(c.toast.roomSubmitted, {
  //     description: c.toast.roomSubmittedDesc,
  //   });
  //   setSending(false);
  //   setSent(true);
  // };

  const metadata = useHotelContractsMetadata();
  const roomSizes =
    metadata.data?.roomSizes ??
    ROOM_SIZES.map((size) => ({ id: size.id, nameEn: size.name_en, nameAr: size.name_ar }));
  const { mutateAsync: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const hookForm = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema()),
    defaultValues: {
      hotelId: Number(hotelId),
      maxOccupancy: 4,
      adults: 2,
      children: 2,
      maxChildAge: 12,
      bedTypeId: 1,
      roomSizeId: 2,
      areaSqm: 32.5,
      view: "",
      note: "",
    },
    mode: "all",
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = hookForm;

  type SelectedImage = {
    id: string;
    file: File;
    preview: string;
  };

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  const setField = (name: keyof RoomFormValues) => (value: string) => {
    const numericFields = [
      "maxOccupancy",
      "adults",
      "children",
      "maxChildAge",
      "bedTypeId",
      "roomSizeId",
      "areaSqm",
    ];

    const parsedValue = numericFields.includes(name)
      ? value === ""
        ? undefined
        : Number(value)
      : value;

    setValue(name, parsedValue as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const sending = isUploading || isCreating;
  const ready = hookForm.formState.isValid && selectedImages.length >= 2 && rights;

  const handleSelectImages = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = 8 - selectedImages.length;

    if (remainingSlots <= 0) return;

    const newImages: SelectedImage[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remainingSlots)
      .map((file) => {
        const preview = URL.createObjectURL(file);

        objectUrlsRef.current.push(preview);

        return {
          id: crypto.randomUUID(),
          file,
          preview,
        };
      });

    setSelectedImages((previous) => [...previous, ...newImages]);
  };

  const removeImage = (id: string) => {
    setSelectedImages((previous) => {
      const imageToRemove = previous.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);

        objectUrlsRef.current = objectUrlsRef.current.filter(
          (url) => url !== imageToRemove.preview,
        );
      }

      return previous.filter((image) => image.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    if (!rights || selectedImages.length === 0) return;

    try {
      const images = await Promise.all(
        selectedImages.map(async (image, index) => {
          const uploaded = await uploadFile({
            file: image.file,
            category: "room_image",
          });

          return {
            uploadId: uploaded.upload?.id,
            isCover: index === 0,
            captionEn: "",
            captionAr: "",
            sortOrder: index,
          };
        }),
      );

      const size = roomSizes.find((item) => item.id === values.roomSizeId);
      const view =
        values.view === "no_view"
          ? undefined
          : metadata.data?.roomViews.find((item) => item.value === values.view);
      await createRoom({
        ...values,
        nameEn: [size?.nameEn, view?.labelEn ?? (values.view === "no_view" ? "" : values.view)]
          .filter(Boolean)
          .join(" · "),
        nameAr: [size?.nameAr, view?.labelAr].filter(Boolean).join(" · "),
        images,
      });
      refetchRooms();
      onClose();
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  });

  if (sent) {
    return (
      <div
        dir={dir}
        {...dismiss.scrim}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(10,18,14,0.45)] p-4",
          scrimMotion,
        )}
      >
        <div
          {...dismiss.panel}
          className={cn(
            "w-full max-w-[660px] rounded-[16px] bg-surface-default px-7 pb-6 pt-[26px] shadow-overlay",
            panelMotion,
          )}
        >
          <div className="flex items-start gap-3.5">
            <span className="flex shrink-0 items-center justify-center rounded-[10px] bg-primary-subtle p-2.5 text-brand-deep">
              <Bed className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-mid">
                {d.sentOverline}
              </p>
              <h2 className="text-[20px] font-semibold leading-[1.45] text-text-primary">
                {d.sentTitle}
              </h2>
              <p className="text-[13px] leading-[1.45] text-text-body">{d.sentBody}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={c.common.close}
              className="shrink-0 rounded-lg bg-status-neutral-bg p-2 text-text-secondary transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4.5 flex items-center gap-3 rounded-[10px] bg-surface-subtle px-3.5 py-3">
            <span className="flex shrink-0 items-center justify-center rounded-[10px] bg-surface-default p-2.5 text-text-secondary">
              <Hash className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-data text-[13.5px] font-semibold leading-[1.45] text-text-primary">
                ROM-20481
              </p>
              <p className="truncate text-[12px] leading-[1.45] text-text-muted">
                {fill(d.sentRefMeta, { room: roomName, hotel: hotelName })}
              </p>
            </div>
          </div>

          <div className="mt-4.5 rounded-[10px] border border-primary-subtle-border bg-primary-subtle px-3.5 py-3">
            <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-deep">
              {d.nextOverline}
            </p>
            <ol className="mt-1.5 space-y-1.5">
              <li className="flex items-start gap-2 text-[12px] leading-[1.45] text-brand-deep">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-deep text-text-inverse">
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
                {fill(d.next1, { count: images })}
              </li>
              {[d.next2, d.next3].map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-2 text-[12px] leading-[1.45] text-brand-deep"
                >
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-surface-default text-[9.5px] font-semibold text-brand-deep">
                    {index + 2}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-4.5 flex items-start gap-2 text-[11.5px] leading-[1.45] text-text-muted">
            <Info className="mt-0.5 h-[13px] w-[13px] shrink-0" aria-hidden="true" />
            {d.meanwhile}
          </p>

          <div className="mt-4.5 flex justify-end gap-2.5">
            <Button
              variant="outline"
              className="h-11 rounded-[10px] px-5 text-sm"
              onClick={onClose}
            >
              {d.backToHotel}
            </Button>
            <Button
              className="h-11 rounded-[10px] px-5 text-sm"
              onClick={() => navigate({ to: "/requests" })}
            >
              {d.viewRequests}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn("fixed inset-0 z-50 flex bg-[rgba(10,18,14,0.45)]", scrimMotion)}
    >
      <div aria-hidden="true" className="flex-1" />
      <aside
        {...dismiss.panel}
        className={cn(
          "flex h-full w-full max-w-full flex-col gap-3.5 overflow-y-auto bg-surface-default px-7 py-6 shadow-overlay sm:w-[640px]",
          drawerMotion(dir),
        )}
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-mid">
              {fill(d.overline, { hotel: hotelName })}
            </p>
            <h2 className="text-[22px] font-semibold leading-[1.45] text-text-primary">
              {d.title}
            </h2>
            <p className="text-[12.5px] leading-[1.45] text-text-muted">{d.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.common.close}
            className="shrink-0 rounded-lg bg-status-neutral-bg p-2 text-text-secondary transition-colors hover:text-text-primary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* <Field label={d.name} value={form.name} placeholder={d.namePh} onChange={set("name")} /> */}

        {showDuplicates ? (
          <div className="rounded-xl border border-dup-border bg-dup-bg px-3.5 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-dup-title" aria-hidden="true" />
              <p className="text-[12.5px] font-semibold leading-[1.45] text-dup-title">
                {d.dupTitle}
              </p>
            </div>
            <div className="mt-2 space-y-2">
              {matches.map(({ room, match }) => (
                <div
                  key={Math.random()}
                  className="flex flex-wrap items-center gap-2.5 rounded-[10px] bg-surface-default py-2 pe-2.5 ps-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold leading-[1.45] text-text-primary">
                      {room.name}
                    </p>
                    <p className="text-[11px] leading-[1.45] text-text-muted">
                      {fill(d.dupSummary, {
                        guests: room.occupancy,
                        adults: room.adults,
                        children: room.children,
                        bed: room.beds,
                        size: room.size,
                        match,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-11 shrink-0 rounded-[10px] px-5 text-sm"
                    onClick={() => {
                      setForm({
                        name: room.name,
                        occupancy: fill(d.guestsSuffix, { count: room.occupancy }),
                        adults: String(room.adults),
                        children: String(room.children),
                        childAge: fill(d.yearsSuffix, { count: room.maxChildAge }),
                        bed: room.beds,
                        size: room.size,
                        view: room.view,
                      });
                      setImages(Math.max(room.images, 2));
                      setOverride(true);
                    }}
                  >
                    {d.dupUse}
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-[1.45] text-dup-note">{d.dupNote}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[10px] bg-surface-subtle px-3 py-2.5">
            <Info className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
            <p className="text-[11.5px] leading-[1.45] text-text-muted">
              {fill(d.dupHint, { hotel: hotelName })}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5">
          <Input
            label={d.occupancy}
            placeholder={d.occupancyPh}
            type="number"
            {...hookForm.register("maxOccupancy", { valueAsNumber: true })}
            error={hookForm.formState.errors.maxOccupancy?.message ?? ""}
          />

          <Input
            label={d.adults}
            placeholder={d.adultsPh}
            type="number"
            {...hookForm.register("adults", { valueAsNumber: true })}
            error={hookForm.formState.errors.adults?.message ?? ""}
          />

          <Input
            label={d.children}
            placeholder={d.childrenPh}
            type="number"
            {...hookForm.register("children", { valueAsNumber: true })}
            error={hookForm.formState.errors.children?.message ?? ""}
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <Input
            label={d.childAge}
            placeholder={d.childAgePh}
            type="number"
            {...hookForm.register("maxChildAge", { valueAsNumber: true })}
            error={hookForm.formState.errors.maxChildAge?.message ?? ""}
          />

          <Controller
            name="bedTypeId"
            control={hookForm.control}
            render={({ field, fieldState }) => (
              <Select
                label={d.bed}
                placeholder={d.bedPh}
                value={field.value ? String(field.value) : ""}
                onChange={(value) => field.onChange(value ? Number(value) : undefined)}
                loading={metadata.isLoading}
                error={fieldState.error?.message ?? ""}
                options={(metadata.data?.bedTypes ?? []).map((bed) => ({
                  value: String(bed.id),
                  label: lang === "ar" ? bed.nameAr : bed.nameEn,
                }))}
              />
            )}
          />

          <Controller
            name="roomSizeId"
            control={hookForm.control}
            render={({ field, fieldState }) => (
              <Select
                label={d.size}
                placeholder={d.sizeListPh}
                value={field.value ? String(field.value) : ""}
                onChange={(value) => field.onChange(value ? Number(value) : undefined)}
                loading={metadata.isLoading}
                error={fieldState.error?.message ?? ""}
                options={roomSizes.map((size) => ({
                  value: String(size.id),
                  label: lang === "ar" ? size.nameAr : size.nameEn,
                }))}
              />
            )}
          />
        </div>

        <Input
          label={d.areaSqm}
          placeholder={d.areaSqmPh}
          type="number"
          {...hookForm.register("areaSqm", { valueAsNumber: true })}
          error={hookForm.formState.errors.areaSqm?.message ?? ""}
        />

        {/* <Input
          label={d.view}
          placeholder={d.viewPh}
          {...hookForm.register("view")}
          error={hookForm.formState.errors.view?.message ?? ""}
        /> */}
        <Controller
          name="view"
          control={hookForm.control}
          render={({ field, fieldState }) => (
            <Select
              label={d.view}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message ?? ""}
              options={[
                { value: "sea", label: "Sea" },
                { value: "city", label: "City" },
                { value: "garden", label: "Garden" },
                { value: "pool", label: "Pool" },
                { value: "mountain", label: "Mountain" },
                { value: "courtyard", label: "Courtyard" },
                { value: "street", label: "Street" },
                { value: "landmark", label: "Landmark" },
                { value: "haram", label: "Haram" },
                { value: "no_view", label: "No View" },
              ]}
            />
          )}
        />

        {/* <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium leading-[1.45] text-text-body">{d.images}</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              handleSelectImages(event.target.files);
              event.target.value = "";
            }}
          />

          {selectedFiles.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-border-strong bg-surface-subtle px-4 py-6 transition-colors hover:border-border-focus"
            >
              <Upload className="h-4 w-4 text-text-secondary" aria-hidden="true" />

              <span className="text-[13px] font-semibold leading-[1.45] text-text-primary">
                {d.dropTitle}
              </span>

              <span className="text-[11.5px] leading-[1.45] text-text-muted">{d.dropHint}</span>
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="relative flex h-[74px] w-[100px] flex-col items-start justify-end overflow-hidden rounded-lg bg-surface-image p-1.5"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 z-10 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold leading-[1.45] text-brand-deep">
                      {d.cover}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove ${file.name}`}
                    className="absolute right-1 top-1 z-10 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ))}

              {selectedFiles.length < 8 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={d.dropTitle}
                  className="flex h-[74px] w-[100px] items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-subtle text-text-secondary transition-colors hover:border-border-focus"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div> */}

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium leading-[1.45] text-text-body">{d.images}</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              handleSelectImages(event.target.files);
              event.target.value = "";
            }}
          />

          {selectedImages.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-border-strong bg-surface-subtle px-4 py-6 transition-colors hover:border-border-focus"
            >
              <Upload className="h-4 w-4 text-text-secondary" aria-hidden="true" />

              <span className="text-[13px] font-semibold leading-[1.45] text-text-primary">
                {d.dropTitle}
              </span>

              <span className="text-[11.5px] leading-[1.45] text-text-muted">{d.dropHint}</span>
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative flex h-[74px] w-[100px] flex-col items-start justify-end overflow-hidden rounded-lg bg-surface-image p-1.5"
                >
                  <img
                    src={image.preview}
                    alt={image.file.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 z-10 rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold leading-[1.45] text-brand-deep">
                      {d.cover}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    aria-label={`Remove ${image.file.name}`}
                    className="absolute right-1 top-1 z-10 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ))}

              {selectedImages.length < 8 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={d.dropTitle}
                  className="flex h-[74px] w-[100px] items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-subtle text-text-secondary transition-colors hover:border-border-focus"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-[10px] border border-primary-subtle-border bg-primary-subtle px-3 py-2.5">
          <Info className="mt-0.5 h-[13px] w-[13px] shrink-0 text-brand-deep" aria-hidden="true" />

          <p className="min-w-0 flex-1 text-[11.5px] leading-[1.45] text-brand-deep">{d.info}</p>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={rights}
            onChange={(event) => setRights(event.target.checked)}
            className="mt-px h-4 w-4 shrink-0 rounded accent-[var(--brand-deep)]"
          />

          <span className="text-[12px] leading-[1.5] text-text-body">{d.rights}</span>
        </label>

        <div className="mt-auto flex justify-end pt-2">
          <Button
            type="button"
            className="h-11 rounded-[10px] px-5 text-sm"
            disabled={!rights || selectedImages?.length < 2}
            // disabled={!rights || images?.length < 2}
            loading={sending}
            onClick={hookForm.handleSubmit(onSubmit)}
          >
            {override ? d.submitDifferent : d.submit}
          </Button>
        </div>

        {/* 
        <Field label={d.name} value={form.name} placeholder={d.namePh} onChange={set("name")} />

        <div className="grid grid-cols-3 gap-2.5">
          <Field
            label={d.occupancy}
            value={form.occupancy}
            placeholder={d.occupancyPh}
            onChange={set("occupancy")}
          />
          <Field
            label={d.adults}
            value={form.adults}
            placeholder={d.adultsPh}
            onChange={set("adults")}
          />
          <Field
            label={d.children}
            value={form.children}
            placeholder={d.childrenPh}
            onChange={set("children")}
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <Field
            label={d.childAge}
            value={form.childAge}
            placeholder={d.childAgePh}
            onChange={set("childAge")}
          />
          <Field label={d.bed} value={form.bed} placeholder={d.bedPh} onChange={set("bed")} />
          <Field label={d.size} value={form.size} placeholder={d.sizePh} onChange={set("size")} />
        </div>

        <Field label={d.view} value={form.view} placeholder={d.viewPh} onChange={set("view")} />

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium leading-[1.45] text-text-body">{d.images}</p>
          {images === 0 ? (
            <button
              type="button"
              onClick={() => setImages(4)}
              className="flex flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-border-strong bg-surface-subtle px-4 py-6 transition-colors hover:border-border-focus"
            >
              <Upload className="h-4 w-4 text-text-secondary" aria-hidden="true" />
              <span className="text-[13px] font-semibold leading-[1.45] text-text-primary">
                {d.dropTitle}
              </span>
              <span className="text-[11.5px] leading-[1.45] text-text-muted">{d.dropHint}</span>
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: images }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-[74px] w-[100px] flex-col items-start justify-end rounded-lg bg-surface-image p-1.5"
                >
                  {index === 0 && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold leading-[1.45] text-brand-deep">
                      {d.cover}
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setImages((n) => Math.min(n + 1, 8))}
                aria-label={d.dropTitle}
                className="flex h-[74px] w-[100px] items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-subtle text-text-secondary transition-colors hover:border-border-focus"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-[10px] border border-primary-subtle-border bg-primary-subtle px-3 py-2.5">
          <Info className="mt-0.5 h-[13px] w-[13px] shrink-0 text-brand-deep" aria-hidden="true" />
          <p className="min-w-0 flex-1 text-[11.5px] leading-[1.45] text-brand-deep">{d.info}</p>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={rights}
            onChange={() => setRights((prev) => !prev)}
            className="mt-px h-4 w-4 shrink-0 rounded accent-[var(--brand-deep)]"
          />
          <span className="text-[12px] leading-[1.5] text-text-body">{d.rights}</span>
        </label>

        <div className="mt-auto flex justify-end pt-2">
          <Button
            className="h-11 rounded-[10px] px-5 text-sm"
            disabled={!ready}
            loading={sending}
            onClick={submit}
          >
            {override ? d.submitDifferent : d.submit}
          </Button>
        </div> */}
      </aside>
    </div>
  );
}
