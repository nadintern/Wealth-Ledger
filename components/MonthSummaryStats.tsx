"use client";

import type {CurrentMonthSummary} from "@/features/transaction-and-filters/selectors/insightsSelectors";

interface Props {
    summary: CurrentMonthSummary;
    currency: string;
}

export default function MonthSummaryStats({summary, currency}: Props) {
    const {income, expense, net, savingsRate} = summary;
    const netPositive = net >= 0;

    const stats: {
        label: string;
        value: string;
        tone: "neutral" | "good" | "bad";
    }[] = [
        {
            label: "Income",
            value: `${currency} ${income.toFixed(2)}`,
            tone: "good",
        },
        {
            label: "Expense",
            value: `${currency} ${expense.toFixed(2)}`,
            tone: "bad",
        },
        {
            label: "Net savings",
            value: `${netPositive ? "+" : "−"}${currency} ${Math.abs(net).toFixed(2)}`,
            tone: netPositive ? "good" : "bad",
        },
        {
            label: "Savings rate",
            // Negative savings rate (overspent) shows as e.g. "−12.4%"
            value: `${(savingsRate * 100).toFixed(1)}%`,
            tone: savingsRate >= 0 ? "good" : "bad",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="rounded-xl border border-border bg-surface-raised/50 px-4 py-3 flex flex-col gap-1"
                >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                        {s.label}
                    </span>
                    <span
                        className={`font-numeric text-lg font-semibold tabular-nums ${
                            s.tone === "good"
                                ? "text-accent-green"
                                : s.tone === "bad"
                                  ? "text-accent-red"
                                  : "text-foreground"
                        }`}
                    >
                        {s.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
