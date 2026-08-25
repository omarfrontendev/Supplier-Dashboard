import { useEffect, useState } from "react";
import { flexRender } from "@tanstack/react-table";
import {
    Building2,
    Calendar,
    LayoutGrid,
    List,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DataGrid } from "../ui/data-grid";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { DataGridTable } from "../ui/data-grid-table";
import { ScrollBar } from "../ui/scroll-area";
import { DataGridPagination } from "../ui/data-grid-pagination";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";

const VIEW_MODE_KEY = "main-table-view-mode";

function normalizeText(value: unknown) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "True" : "False";

    return "";
}

function isBadgeLike(id: string) {
    const key = id.toLowerCase();
    return ["role", "type"].some((segment) => key.includes(segment));
}

function getIconForField(id: string) {
    const key = id.toLowerCase();

    if (key.includes("email") || key.includes("mail")) return Mail;
    if (key.includes("phone") || key.includes("mobile") || key.includes("tel")) return Phone;
    if (key.includes("area") || key.includes("region") || key.includes("mall") || key.includes("booth") || key.includes("location")) return MapPin;
    if (key.includes("vendor") || key.includes("company") || key.includes("branch")) return Building2;
    if (key.includes("created") || key.includes("date") || key.includes("joined") || key.includes("start") || key.includes("end")) return Calendar;
    if (key.includes("name") || key.includes("user")) return User;

    return null;
}

function formatFieldLabel(label: string) {
    if (!label) return "-";

    const lastDotSegment = label.split(".").pop() || label;
    const cleaned = lastDotSegment
        .replace(/[_-]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim();

    if (!cleaned) return "-";

    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function getStatusBadgeVariant(value: string) {
    const normalized = value.toLowerCase();

    if (["active", "activated", "true", "enabled"].some((entry) => normalized.includes(entry))) {
        return "activate";
    }

    if (["inactive", "deactivated", "false", "disabled", "suspended"].some((entry) => normalized.includes(entry))) {
        return "deactivate";
    }

    return "outline";
}

function getInitials(title: string) {
    const tokens = title
        .split(" ")
        .map((token) => token.trim())
        .filter(Boolean)
        .slice(0, 2);

    if (!tokens.length) return "NA";

    return tokens.map((token) => token[0]?.toUpperCase()).join("");
}

function hasDisplayValue(value: unknown) {
    if (value === null || value === undefined) return false;
    if (typeof value === "number") return true;
    if (typeof value === "boolean") return true;
    if (typeof value === "string") return value.trim().length > 0;

    return true;
}

function MainTableCards({ table, loading }) {
    const { t } = useTranslation();
    const rows = table?.getRowModel?.().rows || [];
    const skeletonCount = table?.getState?.()?.pagination?.pageSize || 6;

    const headerLabels = table
        ?.getFlatHeaders?.()
        ?.reduce((acc, header) => {
            const renderedHeader = flexRender(
                header.column.columnDef.header,
                header.getContext(),
            );

            acc[header.column.id] =
                typeof renderedHeader === "string" || typeof renderedHeader === "number"
                    ? String(renderedHeader)
                    : header.column.id;

            return acc;
        }, {});

    if (loading) {
        return (
            <div className="grid gap-4 p-4">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <Card key={index} className="gap-4 p-6">
                        <div className="flex items-center gap-3">
                            <div className="size-12 animate-pulse rounded-full bg-muted" />
                            <div className="w-full">
                                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="h-3 w-full animate-pulse rounded bg-muted" />
                            <div className="h-3 w-full animate-pulse rounded bg-muted" />
                            <div className="h-3 w-full animate-pulse rounded bg-muted" />
                            <div className="h-3 w-full animate-pulse rounded bg-muted" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!rows.length) {
        return <div className="py-10 text-center text-sm text-muted-foreground">{t("common.noDataAvailable")}</div>;
    }

    return (
        <div className="grid gap-4 p-4">
            {rows.map((row) => {
                const visibleCells = row.getVisibleCells();
                const actionsCell = visibleCells.find((cell) => cell.column.id.toLowerCase().includes("action"));
                const hasRoleCell = visibleCells.some((cell) => cell.column.id.toLowerCase().includes("role"));

                const firstName = normalizeText(row.original?.firstName || row.original?.name || row.original?.title);
                const lastName = normalizeText(row.original?.lastName);
                const fallbackName = normalizeText(
                    row.original?.nameAr ||
                    row.original?.nameEn ||
                    row.original?.fullName ||
                    row.original?.displayName ||
                    row.original?.email ||
                    row.id,
                );

                const cardTitle = [firstName, lastName].filter(Boolean).join(" ") || fallbackName;

                const badgeCells = visibleCells.filter((cell) => {
                    if (cell.column.id === actionsCell?.column.id) return false;
                    return isBadgeLike(cell.column.id);
                });

                const statusText =
                    typeof row.original?.isActive === "boolean"
                        ? row.original.isActive
                            ? t("buttons.activated")
                            : t("buttons.deactivated")
                        : normalizeText(row.original?.status)
                            ? formatFieldLabel(normalizeText(row.original?.status))
                            : "";

                const statusVariant =
                    typeof row.original?.isActive === "boolean"
                        ? row.original.isActive
                            ? "activate"
                            : "deactivate"
                        : getStatusBadgeVariant(normalizeText(row.original?.status));

                const showStatusBadge = hasRoleCell && Boolean(statusText);

                const detailCells = visibleCells.filter((cell) => {
                    const key = cell.column.id.toLowerCase();
                    if (cell.column.id === actionsCell?.column.id) return false;
                    if (isBadgeLike(cell.column.id)) return false;
                    if (hasRoleCell && (cell.column.id === "isActive" || cell.column.id === "status" || key.includes("active") || key.includes("status"))) return false;
                    if (["firstName", "lastName", "name", "fullName", "displayName", "title"].includes(cell.column.id)) return false;
                    if (key.includes("id")) return false;

                    const rawValue = row.original?.[cell.column.id];

                    if (hasDisplayValue(rawValue)) return true;

                    const renderedValue = flexRender(cell.column.columnDef.cell, cell.getContext());

                    if (typeof renderedValue === "string" || typeof renderedValue === "number") {
                        return String(renderedValue).trim().length > 0;
                    }

                    // JSX cells are often composed components; if present, we keep the field.
                    return renderedValue !== null && renderedValue !== undefined;
                });

                return (
                    <Card key={row.id} className="gap-5 p-6 transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-1 gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-blue-600 text-sm font-semibold text-white">
                                    {getInitials(cardTitle || "N A")}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <h3 className="truncate text-base font-bold text-foreground">
                                            {cardTitle || "-"}
                                        </h3>

                                        {badgeCells.map((cell) => {
                                            const rawValue = row.original?.[cell.column.id];
                                            const renderedValue = flexRender(cell.column.columnDef.cell, cell.getContext());
                                            const textValue = normalizeText(rawValue);

                                            if (typeof renderedValue === "string" || typeof renderedValue === "number") {
                                                return (
                                                    <Badge
                                                        key={cell.id}
                                                        variant={getStatusBadgeVariant(String(renderedValue))}
                                                        className="px-2 py-1"
                                                    >
                                                        {renderedValue}
                                                    </Badge>
                                                );
                                            }

                                            if (typeof rawValue === "boolean" || textValue) {
                                                const printable =
                                                    typeof rawValue === "boolean"
                                                        ? (rawValue ? t("buttons.activated") : t("buttons.deactivated"))
                                                        : textValue;

                                                return (
                                                    <Badge
                                                        key={cell.id}
                                                        variant={getStatusBadgeVariant(printable)}
                                                        className="px-2 py-1"
                                                    >
                                                        {printable}
                                                    </Badge>
                                                );
                                            }

                                            return (
                                                <div key={cell.id} className="[&>div]:contents">
                                                    {renderedValue}
                                                </div>
                                            );
                                        })}

                                        {showStatusBadge && (
                                            <Badge
                                                variant={statusVariant}
                                                className="px-2 py-1"
                                            >
                                                {statusText}
                                            </Badge>
                                        )}
                                    </div>

                                    {detailCells.length > 0 && (
                                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                                            {detailCells.map((cell) => {
                                                const Icon = getIconForField(cell.column.id);
                                                const label = formatFieldLabel(headerLabels?.[cell.column.id] || cell.column.id);

                                                return (
                                                    <div key={cell.id} className="grid gap-1">
                                                        <p className="text-xs text-muted-foreground">{label}</p>
                                                        <div className="flex items-start gap-2 text-muted-foreground">
                                                            {Icon && <Icon className="mt-0.5 size-4 shrink-0" />}
                                                            <div className="min-w-0 text-foreground *:truncate">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {actionsCell && (
                                <div className="flex shrink-0 items-center gap-2 [&>div]:flex [&>div]:items-center [&>div]:gap-2">
                                    {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
                                </div>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

export default function MainTable({ table, loading, totalCount, errorMsg = null, TableFilters = null }) {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window === "undefined") return "table";

        const savedMode = localStorage.getItem(VIEW_MODE_KEY);
        return savedMode === "grid" ? "grid" : "table";
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem(VIEW_MODE_KEY, viewMode);
    }, [viewMode]);

    if (errorMsg) return (
        <div className="w-full flex items-center justify-center">
            <ErrorMessage message={errorMsg} />
        </div>
    )

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">{TableFilters}</div>

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant={viewMode === "table" ? "default" : "outline"}
                        onClick={() => setViewMode("table")}
                        aria-label={t("ui.tableView")}
                    >
                        <List />
                    </Button>

                    <Button
                        type="button"
                        size="icon"
                        variant={viewMode === "grid" ? "default" : "outline"}
                        onClick={() => setViewMode("grid")}
                        aria-label={t("ui.gridView")}
                    >
                        <LayoutGrid />
                    </Button>
                </div>
            </div>

            <DataGrid
                table={table}
                isLoading={loading}
                loadingMode="skeleton"
                recordCount={totalCount || 0}
                tableLayout={{
                    columnsPinnable: true,
                    columnsMovable: true,
                    columnsVisibility: true,
                    cellBorder: true,
                }}
            >
                <Card>
                    {viewMode === "table" ? (
                        <ScrollArea>
                            <DataGridTable />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    ) : (
                        <MainTableCards table={table} loading={loading} />
                    )}

                    {totalCount > 0 && <CardFooter className="border-t">
                        <DataGridPagination />
                    </CardFooter>}
                </Card>
            </DataGrid>
        </div>
    )
}