// import { Badge } from "@/components/ui/badge";
import { UserActionsCell } from "./UserActionCell";
import { useTranslation } from "react-i18next";

export const useUsersColumns = (setRefreshData: any) => {

  const { t, i18n: { language } } = useTranslation();

  return [
    {
      id: 'name',
      header: () => t("fields.name.label"),
      cell: ({ row }: any) => (
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-mono hover:text-primary-active mb-px truncate block">
            {row.original?.[language === "ar" ? "nameAr" : "nameEn"]}
          </div>
        </div>
      ),
      enableSorting: false,
      meta: {
        headerClassName: '',
        skeleton: <div className="h-5 w-full bg-muted rounded" />,
      },
    },
    // {
    //   id: 'assignedCount',
    //   header: () => t("fields.assignedCount"),
    //   cell: ({ row }: any) => <div className="truncate block">{row.original.assignedCount || "0"}</div>,
    //   enableSorting: false,
    //   meta: {
    //     headerClassName: '',
    //     skeleton: <div className="h-5 w-full bg-muted rounded" />,
    //   },
    // },
    {
      id: 'createdAt',
      header: () => t("fields.createdAt"),
      cell: ({ row }: any) => {
        const date = row.original.createdAt;

        return (
          <div className="truncate block">
            {date ? new Date(date).toLocaleDateString() : "--"}
          </div>
        );
      },
       enableSorting: false,
      meta: {
        headerClassName: '',
        skeleton: <div className="h-5 w-full bg-muted rounded" />,
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <UserActionsCell
          row={row}
          setRefreshData={setRefreshData}
        />
      ),
      enableSorting: false,
      size: 50,
      meta: {
        headerClassName: '',
        skeleton: <div className="h-5 w-full bg-muted rounded" />,
      },
    },
  ];
};
