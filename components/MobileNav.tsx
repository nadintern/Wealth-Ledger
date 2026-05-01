"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const NAV = [
    {href: "/dashboard", label: "Overview"},
    {href: "/transactions", label: "Txns"},
    {href: "/portfolio", label: "Crypto"},
    {href: "/settings", label: "Settings"},
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden flex items-center gap-1 px-4 py-2 border-b border-border bg-surface/40 overflow-x-auto">
            {NAV.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                            active
                                ? "bg-surface-raised text-foreground border border-border"
                                : "text-muted hover:text-foreground border border-transparent"
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
