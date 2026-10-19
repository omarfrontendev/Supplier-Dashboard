import * as React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type ReusablePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  lang?: "ar" | "en";
  showBorder?: boolean;
};

export function ReusablePagination({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  lang = "en",
  showBorder = true,
}: ReusablePaginationProps) {
  const isArabic = lang === "ar";

  const visiblePages = React.useMemo(() => {
    const pages = new Set([1, totalPages, page - 1, page, page + 1]);

    return [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
  }, [page, totalPages]);

  if (isLoading || totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
        showBorder && "border-t border-border-subtle",
      )}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <p className="text-sm text-text-secondary">
        {isArabic ? `الصفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();

                if (page > 1 && !isLoading) {
                  onPageChange(page - 1);
                }
              }}
              aria-disabled={page <= 1 || isLoading}
              className={page <= 1 || isLoading ? "pointer-events-none opacity-50" : ""}
            >
              {isArabic ? "السابق" : "Previous"}
            </PaginationPrevious>
          </PaginationItem>

          {visiblePages.map((pageNumber, index) => {
            const previousPage = visiblePages[index - 1];

            return (
              <React.Fragment key={pageNumber}>
                {previousPage !== undefined && pageNumber - previousPage > 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(event) => {
                      event.preventDefault();

                      if (!isLoading && pageNumber !== page) {
                        onPageChange(pageNumber);
                      }
                    }}
                    aria-label={isArabic ? `الصفحة ${pageNumber}` : `Page ${pageNumber}`}
                    aria-current={pageNumber === page ? "page" : undefined}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();

                if (page < totalPages && !isLoading) {
                  onPageChange(page + 1);
                }
              }}
              aria-disabled={page >= totalPages || isLoading}
              className={page >= totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
            >
              {isArabic ? "التالي" : "Next"}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
