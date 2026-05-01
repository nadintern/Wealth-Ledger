import type {ReactNode} from "react";

interface PageHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
}

export default function PageHeader({eyebrow, title, description, actions}: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8 border-b border-border">
            <div className="flex flex-col gap-2">
                {eyebrow && (
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted">
                        {eyebrow}
                    </p>
                )}
                <h1 className="font-display text-3xl sm:text-[2.5rem] sm:leading-[1.1] font-semibold">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted max-w-xl">{description}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
