"use client";

import type {BudgetUtilizationItem} from "@/features/transaction-and-filters/selectors/insightsSelectors";

interface Props {
    items: BudgetUtilizationItem[];
    currency: string;
}

/**
 * Plain CSS bar — Chart.js is overkill for a 5-row utilization view.
 * Each row's fill width = min(pct, 1) * 100%. Over-budget rows go red
 * and grow past the 100% mark visually via a separate "overflow" segment.
 */
export default function BudgetUtilizationChart({items, currency}: Props) {
    return (
        <ul className="flex flex-col gap-4">
            {items.map((item) => {
                const filled = Math.min(item.pct, 1) * 100;
                const overflow = Math.max(item.pct - 1, 0) * 100;
                const over = item.pct >= 1;
                return (
                    <li key={item.category} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2 w-2 rounded-sm"
                                    style={{backgroundColor: item.color}}
                                    aria-hidden
                                />
                                <span className="font-medium">{item.label}</span>
                                {over && (
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent-red">
                                        Over
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 font-numeric text-muted tabular-nums">
                                <span>
                                    {currency} {item.spent.toFixed(0)} / {item.budget.toFixed(0)}
                                </span>
                                <span className={over ? "text-accent-red" : "text-muted-strong"}>
                                    {(item.pct * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                        <div className="relative h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{
                                    width: `${filled}%`,
                                    // White by default; over-budget keeps red so
                                    // the warning state remains visually distinct.
                                    backgroundColor: over ? "var(--accent-red)" : "#ffffff",
                                }}
                            />
                            {overflow > 0 && (
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full opacity-40"
                                    style={{
                                        width: `${Math.min(filled + overflow, 200)}%`,
                                        backgroundColor: "var(--accent-red)",
                                    }}
                                />
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
