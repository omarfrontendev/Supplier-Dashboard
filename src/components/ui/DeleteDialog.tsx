import { useLanguage } from "@/lib/i18n";
import { Trash2, X } from "lucide-react";
import { Button } from "./button";

type DeleteDialogProps = {
  open: boolean;
  title: string;
  description: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteDialog({
  open,
  title,
  description,
  isPending = false,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  const { c } = useLanguage();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-white p-6 shadow-xl duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 size={24} />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5">
          <h2
            id="delete-dialog-title"
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h2>

          <p
            id="delete-dialog-description"
            className="mt-2 text-sm leading-6 text-gray-500"
          >
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-7 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            {c.common.cancel}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isPending}
            disabled={isPending}
          >
            {c.common.delete}
          </Button>
        </div>
      </div>
    </div>
  );
}