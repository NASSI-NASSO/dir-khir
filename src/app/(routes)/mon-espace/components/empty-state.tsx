import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    actionLabel?: string;
    actionUrl?: string;
}

export function EmptyState({
    title,
    description,
    icon: Icon,
    actionLabel,
    actionUrl,
}: EmptyStateProps) {
    return (
        <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                {Icon && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {description}
                </p>
                {actionLabel && actionUrl && (
                    <Button asChild variant="outline" size="sm">
                        <Link href={actionUrl}>{actionLabel}</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
