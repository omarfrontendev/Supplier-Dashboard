import { useMemo, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";

import { fetchUsers } from "@/app/store/features/users/usersThunk";
import type { AppDispatch, RootState } from "@/app/store";
import { userStatus } from "@/constants/userStatus";
import { useUsersColumns } from "../components/UsersColumns";
import type { User, UsersTableOptions } from "@/types/users";
import { dashboardUserRoles } from "@/constants/userRoles";

export const useUsersTableLogic = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [statusDialog, setStatusDialog] = useState(null);

    // Select users state from Redux store
    const { users, loading, total } = useSelector((state: RootState) => state.users);

    // Local state to trigger manual refresh
    const [refreshData, setRefreshData] = useState(false);
    

    // Table options state: pagination, search, and status filter
    // @@TODO FIX TO USE GetUsersPayload
    const [tableOptions, setTableOptions] = useState<UsersTableOptions>({
        pageIndex: 0,
        pageSize: 10,
        search: "",
        isActive: null,
        isFirstActivationPending: null,
        // roles: dashboardUserRoles.map(role => role.value)
    });

    // Fetch users whenever table options or refreshData changes
    useEffect(() => {
        const { pageIndex, pageSize, search, isActive, isFirstActivationPending, role } = tableOptions;

        // Convert filter string to boolean for API
        const isActiveBoolean =
            typeof isActive === "string"
                ? isActive === "Active"
                    ? true
                    : false
                : null;

                console.log(tableOptions)

        dispatch(
            fetchUsers({
                page: pageIndex + 1, // API expects 1-based page
                limit: pageSize,
                search: search || undefined,
                isActive: isActiveBoolean,
                isFirstActivationPending,
                role
            })
        );
    }, [dispatch, tableOptions, refreshData]);

    // Debounced search function to reduce API calls
    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                setTableOptions((prev) => ({
                    ...prev,
                    search: value,
                    pageIndex: 0, // reset to first page
                }));
            }, 500),
        []
    );

    const onSearch = useCallback(
        (value: string) => debouncedSearch(value),
        [debouncedSearch]
    );

    const onClearSearch = useCallback(() => {
        setTableOptions((prev) => ({
            ...prev,
            search: "",
            pageIndex: 0,
        }));
    }, []);

    const onStatusFilter = useCallback((value: string | null) => {
        if (value === "Invited") {
            setTableOptions((prev) => ({
                ...prev,
                isActive: null,
                isFirstActivationPending: true,
                pageIndex: 0,
            }));

        } else {
            setTableOptions((prev) => ({
                ...prev,
                isFirstActivationPending: null,
                isActive: value,
                pageIndex: 0, // reset page on filter change
            }));
        }
    }, []);

    const onRoleFilter = useCallback((value: string | null) => {
        setTableOptions((prev) => ({
            ...prev,
            role: value,
            pageIndex: 0, // reset page on filter change
        }));
    }, []);


    // Memoized current selected status value for UI display
    const statusFilter = useMemo(
        () => {
            if (tableOptions.isFirstActivationPending) return "Invited"
            return userStatus.find((option) => option.value === tableOptions.isActive)?.value
        },
        [tableOptions.isActive]
    );

    // Memoized current selected status value for UI display
    const roleFilter = useMemo(
        () => tableOptions.role && dashboardUserRoles.find((option) => option.value === tableOptions.role)?.value,
        [tableOptions.role]
    );

    // Table columns definition
    const columns: ColumnDef<User>[] = useUsersColumns(setRefreshData, setStatusDialog);

    // Initialize react-table instance with server-side pagination
    const table = useReactTable({
        columns,
        data: users,
        pageCount: Math.ceil((total || 0) / tableOptions.pageSize),
        state: {
            pagination: {
                pageIndex: tableOptions.pageIndex,
                pageSize: tableOptions.pageSize,
            },
        },
        onPaginationChange: (updater) => {
            setTableOptions((prev) => {
                const newPagination =
                    typeof updater === "function"
                        ? updater({
                            pageIndex: prev.pageIndex,
                            pageSize: prev.pageSize,
                        })
                        : updater;

                return {
                    ...prev,
                    pageIndex: newPagination.pageIndex,
                    pageSize: newPagination.pageSize,
                };
            });
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true, // server-side pagination
    });

    return {
        table,
        totalCount: total,
        loading,
        statusFilter,
        statusList: userStatus,
        statusDialog,
        roleFilter,
        onSearch,
        onClearSearch,
        onStatusFilter,
        setStatusDialog,
        onRoleFilter
    };
};
