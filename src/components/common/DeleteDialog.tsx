"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  loading = false,
  onConfirm,
}: DeleteDialogProps) {

  const { t } = useTranslation();
  const resolvedTitle = title || t("ui.deleteItem");
  const resolvedDescription = description || t("ui.deleteConfirmation");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-140">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            {resolvedTitle}
          </DialogTitle>
          <DialogDescription className="my-2">
            {resolvedDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("buttons.cancel")}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t("buttons.deleting") : t("buttons.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
