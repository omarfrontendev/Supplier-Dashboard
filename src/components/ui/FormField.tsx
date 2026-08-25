import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, get } from "react-hook-form";
import SelectMenu from "./SelectMenu";
import { MapEditor } from "./MapEditor";
import { useTranslation } from "react-i18next";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Textarea } from "./textarea";

export default function FormField({ form, label, name, placeholder, colSpan, required, type, list, isLoading, selectedCoords, isMulti, ...props }: any) {

    const { t } = useTranslation();

    if (type === "spacer") {
        return <div className={colSpan} />;
    };

    if (type === "uploadPhoto") {
        return (
            <div className={`space-y-2 ${colSpan}`}>
                <Label className="text-slate-700">{t(`fields.${label}`)}{required ? " *" : ""}</Label>
                <ProfilePhotoUpload />
            </div>
        )
    }

    if (type === "map") {
        return (
            <div className={`h-[80vh] space-y-2 ${colSpan} mb-[40px]`}>
                <Label className="text-slate-700">{t(`fields.${label}`)}{required ? " *" : ""}</Label>
                <MapEditor
                    setShapes={(e: any) => form.setValue(name, e[0]?.[name])}
                    shapes={[{
                        coords: form.watch(name) || [],
                        type: "polygon"
                    }] as any}
                    selectedCoords={selectedCoords}
                />
                <div
                    data-slot="form-message"
                    className={"text-xs font-normal text-destructive"}
                >
                    {form?.formState?.errors?.[name] && t(`validation.${form?.formState?.errors?.[name]?.message}`)}
                </div>
            </div>
        )
    }

    if (type === "select") {

        return (
            <div className={`space-y-2 ${colSpan} position-relative`}>
                <Label className="text-slate-700">{t(`fields.${label}`)}{required ? " *" : ""}</Label>
                <Controller
                    name={name}
                    control={form.control}
                    render={({ field }) => (
                        <SelectMenu
                            // placeholder={t(`fields.${placeholder}`)}
                            options={list}
                            value={
                                isMulti
                                    ? list.filter((item: any) => field.value?.includes(item.value))
                                    : list.find((item: any) => item.value === field.value) || null
                            }
                            onChange={(selected: any) => {
                                if (isMulti) {
                                    field.onChange(selected ? selected : []);
                                } else {
                                    field.onChange(selected);
                                }
                            }} onBlur={field.onBlur} isLoading={isLoading} isMulti={isMulti}
                            {...props}
                        />
                    )}
                />
                <div
                    data-slot="form-message"
                    className={"text-xs font-normal text-destructive"}
                >
                    {form?.formState?.errors?.[name] && t(`validation.${form?.formState?.errors?.[name]?.message}`)}
                </div>
            </div>
        )
    }

    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`space-y-2 ${colSpan}`}>
            <Label className="text-slate-700">
                {t(`fields.${label}`)}
                {required ? " *" : ""}
            </Label>

            <div className="relative">
                {type === "textarea" ? (
                    <>
                        <Textarea
                            {...props}
                            {...form.register(name)}
                            type={inputType}
                            placeholder={t(`fields.${placeholder}`)}
                            // autoComplete="new-password"
                            className="
                            h-11
                            px-4
                            border-0
                            outline-none
                            ring-0
                            focus:border-0
                            focus:outline-none
                            focus:ring-0
                            focus-visible:outline-none
                            focus-visible:ring-0
                            placeholder:text-slate-500
                            pr-10
                        "
                        />
                    </>
                ) : (
                    <Input
                        {...props}
                        {...form.register(name)}
                        type={inputType}
                        placeholder={t(`fields.${placeholder}`)}
                        // autoComplete="new-password"
                        className="
                h-11
                px-4
                border-0
                outline-none
                ring-0
                focus:border-0
                focus:outline-none
                focus:ring-0
                focus-visible:outline-none
                focus-visible:ring-0
                placeholder:text-slate-500
                pr-10
              "
                    />
                )}

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}

                {get(form.formState.errors, name) && (
                    <p className="text-xs font-normal text-destructive">
                        {t(
                            `validation.${(get(form.formState.errors, name)?.message as string) ?? ""
                            }`
                        )}
                    </p>
                )}
            </div>
        </div>
    )
}