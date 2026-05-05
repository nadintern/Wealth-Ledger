"use client";

import "@/lib/chartjs";
import {Bar} from "react-chartjs-2";
import type {MonthlyIncomeExpenseItem} from "@/features/transaction-and-filters/selectors/insightsSelectors";

interface Props {
    months: MonthlyIncomeExpenseItem[];
    currency: string;
}

export default function IncomeVsExpenseChart({months, currency}: Props) {
    if (months.length === 0) {
        return (
            <div className="h-56 flex items-center justify-center text-sm text-muted">
                No income/expense data yet.
            </div>
        );
    }

    const data = {
        labels: months.map((m) => m.label),
        datasets: [
            {
                label: "Income",
                data: months.map((m) => m.income),
                backgroundColor: "#ffffff",
                borderRadius: 6,
                barThickness: 18,
            },
            {
                label: "Expense",
                data: months.map((m) => m.expense),
                // Same hue, lower alpha so the two bars stay distinguishable
                // without introducing a non-white accent color.
                backgroundColor: "rgba(255, 255, 255, 0.35)",
                borderRadius: 6,
                barThickness: 18,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {color: "#a1a5ad", boxWidth: 10, boxHeight: 10},
            },
            tooltip: {
                callbacks: {
                    label: (ctx: {dataset: {label?: string}; parsed: {y: number | null}}) =>
                        `${ctx.dataset.label}: ${currency} ${(ctx.parsed.y ?? 0).toFixed(2)}`,
                },
            },
        },
        scales: {
            x: {grid: {display: false}, ticks: {color: "#7a7f8a"}},
            y: {
                beginAtZero: true,
                grid: {color: "#23262d"},
                ticks: {color: "#7a7f8a"},
            },
        },
    };

    return (
        <div className="h-56">
            <Bar data={data} options={options}/>
        </div>
    );
}
