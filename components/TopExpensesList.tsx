"use client";

import type {TopExpenseItem} from "@/features/transaction-and-filters/selectors/insightsSelectors";

interface Props {
    items: TopExpenseItem[];
    currency: string;
}

export default function TopExpensesList({items, currency}: Props) {
    if (items.length === 0) {
        return (
            <div className="h-32 flex items-center justify-center text-sm text-muted">
                No expenses this month.
            </div>
        );
    }

    return (
        <ul className="flex flex-col divide-y divide-border">
            {items.map((it, idx) => (
                <li
                    key={it.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] text-muted font-numeric tabular-nums w-4">
                            {idx + 1}
                        </span>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm truncate capitalize">
                                {it.description}
                            </span>
                            <span className="text-xs text-muted capitalize">
                                {it.category} · {new Date(it.date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <span className="font-numeric text-sm tabular-nums text-accent-red shrink-0">
                        −{currency} {it.amount.toFixed(2)}
                    </span>
                </li>
            ))}
        </ul>
    );
}
