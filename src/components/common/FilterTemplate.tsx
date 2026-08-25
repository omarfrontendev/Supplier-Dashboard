import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import TableSearch from "@/components/ui/table-search";
import { Label } from "@radix-ui/react-label";
import { useTranslation } from "react-i18next";
import { Loader2Icon } from "lucide-react";

export default function FilterTemplate({ onSubmit, list, placeholder, title, description, selectedItem, setSelectedItem, searchTerm, setSearchTerm, backBtn = false, nextBtn = false, onBack, onSubmitting = false }) {

    const {
        t,
        i18n: { language },
    } = useTranslation();


    /**
     * Memoized filtered areas list
     * Filters by nameAr & nameEn based on search term
     */
    const filteredData = useMemo(() => {
        if (!searchTerm) return list;

        return list.filter((item: any) => {
            const nameAr = item?.nameAr?.toLowerCase() || "";
            const nameEn = item?.nameEn?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();

            return nameAr.includes(search) || nameEn.includes(search);
        });
    }, [list, searchTerm]);

    /**
     * Maps areas to display format based on current language
     */
    const filteredOptions = useMemo(() => {
        return filteredData.map((item: any) => ({
            label: language === "ar" ? item?.nameAr : item?.nameEn,
            value: item.id,
        }));
    }, [filteredData, language]);

    /**
     * Handles search input
     */
    const onSearchHandler = (value: string) => {
        setSearchTerm(value);
    };

    /**
     * Applies selected filter
     */
    const handleFilter = () => {
        onSubmit(selectedItem);
    };

    // /**
    //  * Clears selected filter
    //  */
    // const handleClear = () => {
    //     setSelectedItem(null);
    // };

    return (

        <>
            <DialogHeader className="mx-auto text-center">
                <DialogTitle>
                    {t(title)}
                </DialogTitle>
                <DialogDescription className="line-clamp-2">
                    {t(description)}
                </DialogDescription>
            </DialogHeader>

            <div className="mx-auto w-full">
                {/* Search Input */}
                <TableSearch
                    onSearch={onSearchHandler}
                    placeholder={t(placeholder)}
                />

                {/* Areas List */}
                <div className="mx-auto my-8 grid grid-cols-2 gap-5 h-[200px] overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((item) => (
                            <div
                                key={item.value}
                                className="flex items-start gap-2"
                            >
                                <Checkbox
                                    id={`item-${item.value}`}
                                    checked={item.value === selectedItem}
                                    onCheckedChange={(checked) =>
                                        checked && setSelectedItem(item.value)
                                    }
                                />

                                <Label
                                    htmlFor={`item-${item.value}`}
                                    className="cursor-pointer text-sm text-slate-500"
                                >
                                    {item.label}
                                </Label>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-sm text-gray-400 py-6">
                            {t("common.noDataAvailable")}
                        </div>
                    )}
                </div>
            </div>

            <DialogFooter className="flex items-center justify-between gap-2">

                <div className="flex items-center justify-start gap-2">
                    {backBtn ? (
                        <Button size="sm" variant="outline" onClick={onBack}>
                            {t("buttons.back")}
                        </Button>
                    ) :
                        <DialogClose asChild>
                            <Button size="sm" variant="outline">
                                {t("buttons.cancel")}
                            </Button>
                        </DialogClose>
                    }
                </div>
                <div className="flex items-center justify-end gap-2">
                    {nextBtn ?
                        <Button
                            size="sm"
                            onClick={handleFilter}
                            disabled={!selectedItem || onSubmitting}
                        >
                            {onSubmitting ? <Loader2Icon className="animate-spin" /> : t(`buttons.next`)}
                        </Button>
                        :
                        <DialogClose asChild>
                            <Button
                                size="sm"
                                onClick={handleFilter}
                                disabled={!selectedItem}
                            >
                                {t(`buttons.filter`)}
                            </Button>
                        </DialogClose>
                    }
                </div>
            </DialogFooter>
        </>
    );
}