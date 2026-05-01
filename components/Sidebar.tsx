"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const NAV = [
    {href: "/dashboard", label: "Dashboard"},
    {href: "/transactions", label: "Transactions"},
    {href: "/portfolio", label: "Portfolio"},
    {href: "/settings", label: "Settings"},
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 lg:border-r lg:border-border lg:h-screen lg:sticky lg:top-0 px-5 py-8 gap-10">
            <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-accent-green" aria-hidden/>
                <span className="font-display text-lg font-semibold">
                    WealthLedger
                </span>
            </div>

            <nav className="flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted px-3 mb-2">
                    Workspace
                </p>
                {NAV.map((item) => {
                    const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                active
                                    ? "bg-surface-raised text-foreground border border-border"
                                    : "text-muted hover:text-foreground hover:bg-surface/40 border border-transparent"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto text-[10px] uppercase tracking-[0.2em] text-muted">
                v1.0 · Personal Finance
            </div>
        </aside>
    );
}
