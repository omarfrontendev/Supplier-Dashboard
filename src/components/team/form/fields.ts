import { useLanguage } from "@/lib/i18n";

export const profileFields = () => {

    const { c } = useLanguage();

    return [
        {
            name: "nameEn",
            label: c.common.nameEnLabel,
            placeholder: c.common.nameEnPlaceholder,
            colSpan: "col-span-6",
            required: true,
            type: "text"
        },
        {
            name: "nameAr",
            label: c.common.nameArLabel,
            placeholder: c.common.nameArPlaceholder,
            colSpan: "col-span-6",
            required: true,
            type: "text",
            
        },
    ];
}
