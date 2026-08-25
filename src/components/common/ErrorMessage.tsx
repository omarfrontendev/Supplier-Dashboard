import { useId } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/utils";

type ErrorMessageProps = {
    message?: string;
    title?: string;
    className?: string;
};

export default function ErrorMessage({
    message,
    title,
    className,
}: ErrorMessageProps) {
    const { t } = useTranslation();
    const gradientId = useId();
    const shieldHighlightId = useId();

    return (
        <div
            role="alert"
            aria-live="polite"
            className={cn(
                "relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-destructive/25 bg-card p-5 shadow-sm sm:p-6",
                className,
            )}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-destructive/55" />

            <div className="relative flex items-start gap-4">
                <div className="shrink-0 rounded-xl border border-destructive/20 bg-destructive/5 p-2.5 sm:p-3">
                    <svg
                        viewBox="0 0 64 64"
                        className="size-10 sm:size-11"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fb7185" />
                                <stop offset="55%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#b91c1c" />
                            </linearGradient>
                            <linearGradient id={shieldHighlightId} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                                <stop offset="100%" stopColor="#fee2e2" stopOpacity="0.9" />
                            </linearGradient>
                        </defs>

                        <circle cx="32" cy="32" r="29" fill={`url(#${gradientId})`} opacity="0.12" />
                        <circle cx="32" cy="32" r="22" fill="none" stroke="#ef4444" strokeOpacity="0.2" strokeWidth="1.6" />
                        <path
                            d="M32 12L50 22V33C50 44 42.8 53.3 32 56C21.2 53.3 14 44 14 33V22L32 12Z"
                            fill={`url(#${shieldHighlightId})`}
                            stroke="#dc2626"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <path d="M24 25.5C28.5 23 35.5 22.6 40 25.5" stroke="#fecaca" strokeWidth="2" strokeLinecap="round" />
                        <rect x="30" y="22" width="4" height="16" rx="2" fill="#dc2626" />
                        <circle cx="32" cy="44" r="2.5" fill="#dc2626" />
                    </svg>
                </div>

                <div className="min-w-0 space-y-1.5">
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {title || t("common.errorTitle")}
                    </h3>
                    <p className="wrap-break-word text-muted-foreground text-sm leading-relaxed sm:text-[15px]">
                        {message || t("common.errorFallback")}
                    </p>
                </div>
            </div>
        </div>
    );
}