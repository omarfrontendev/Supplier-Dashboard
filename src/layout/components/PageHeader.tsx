import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    loading?:boolean;
    children?: ReactNode;
}

export function PageHeader({ title, subtitle, children, loading }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl text-gray-900 mb-2">{title}</h1>                
                {subtitle && loading ? <Skeleton className="w-20 h-6 rounded-sm"  /> :  <p className="text-gray-600">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}
