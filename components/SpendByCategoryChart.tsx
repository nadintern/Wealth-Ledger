"use client";

import "@/lib/chartjs";
import {Doughnut} from "react-chartjs-2";
import type {CategorySliceItem} from "@/features/transaction-and-filters/selectors/insightsSelectors";

interface Props {
    slices: CategorySliceItem[];
    currency: string;
}

export default function SpendByCategoryChart({slices, currency}: Props) {
    const allZero = slices.every((s) => s.value === 0);

    if (allZero) {
        return (
            <div className="h-56 flex items-center justify-center text-sm text-muted">
                No spending recorded for the latest month.
            </div>
        );
    }

    const data = {
        labels: slices.map((s) => s.label),
        datasets: [
            {
                data: slices.map((s) => s.value),
                backgroundColor: slices.map((s) => s.color),
                borderWidth: 0,
                hoverOffset: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right" as const,
                labels: {color: "#a1a6b0", boxWidth: 10, padding: 12},
            },
            tooltip: {
                callbacks: {
                    label: (ctx: {parsed: number; label: string}) =>
                        `${ctx.label}: ${currency} ${ctx.parsed.toFixed(2)}`,
                },
            },
        },
        cutout: "65%",
    };

    return (
        <div className="h-56">
            <Doughnut data={data} options={options}/>
        </div>
    );
}
