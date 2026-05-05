"use client";

import "@/lib/chartjs";
import {Bar} from "react-chartjs-2";
import type {MonthlyTotalItem} from "@/features/transaction-and-filters/selectors/insightsSelectors";

interface Props {
    months: MonthlyTotalItem[];
    currency: string;
}

export default function MonthlySpendChart({months, currency}: Props) {
    if (months.length === 0) {
        return (
            <div className="h-56 flex items-center justify-center text-sm text-muted">
                No monthly spend data yet.
            </div>
        );
    }

    const data = {
        labels: months.map((m) => m.label),
        datasets: [
            {
                label: "Total spend",
                data: months.map((m) => m.total),
                backgroundColor: "#60a5fa",
                borderRadius: 6,
                barThickness: 28,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {display: false},
            tooltip: {
                callbacks: {
                    label: (ctx: {parsed: {y: number | null}}) =>
                        `${currency} ${(ctx.parsed.y ?? 0).toFixed(2)}`,
                },
            },
        },
        scales: {
            x: {
                grid: {display: false},
                ticks: {color: "#7a7f8a"},
            },
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
