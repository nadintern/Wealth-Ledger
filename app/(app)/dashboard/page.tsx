"use client";

import {useSelector} from "react-redux";
import type {RootState} from "@/features";
import {selectUsername} from "@/features/auth/selectors/authSelectors";
import {selectTotalBalance} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {selectPortfolioTotal} from "@/features/portfolio/selectors/portfolioSelectors";
import {selectPreferredCurrency} from "@/features/multi-currency-converter/selectors/currencySelectors";
import {
    selectNetWorth,
    selectAssetAllocation,
    type AllocationSlice,
} from "@/features/dashboard/selectors/dashboardSelectors";
import PageHeader from "@/components/PageHeader";
import NotificationsPanel from "@/components/NotificationsPanel";
import AllocationDonut from "@/components/AllocationDonut";

export default function DashboardPage() {
    const username = useSelector((s: RootState) => selectUsername(s));
    const netWorth = useSelector((s: RootState) => selectNetWorth(s));
    const totalBalance = useSelector((s: RootState) => selectTotalBalance(s));
    const portfolioTotal = useSelector((s: RootState) => selectPortfolioTotal(s));
    const allocation = useSelector((s: RootState) => selectAssetAllocation(s));
    const preferred = useSelector((s: RootState) => selectPreferredCurrency(s));

    return (
        <>
            <PageHeader
                eyebrow={`Welcome back, ${username}`}
                title="Overview"
                description="A snapshot of your cash, crypto, and net position — all in your preferred currency."
            />

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Net worth" amount={netWorth} currency={preferred} accent/>
                <StatCard label="Cash balance" amount={totalBalance} currency={preferred}/>
                <StatCard label="Crypto holdings" amount={portfolioTotal} currency={preferred}/>
            </section>

            <section className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted">
                        Asset allocation
                    </h2>
                </div>
                <div className="px-6 py-6 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <AllocationDonut slices={allocation}>
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                                Net worth
                            </span>
                            <span className="font-display text-lg font-semibold tabular-nums">
                                {preferred} {netWorth.toFixed(0)}
                            </span>
                        </div>
                    </AllocationDonut>

                    <ul className="flex-1 w-full flex flex-col gap-3">
                        {allocation.map((s) => (
                            <AllocationLegendRow key={s.key} slice={s} currency={preferred}/>
                        ))}
                    </ul>
                </div>
            </section>

            <NotificationsPanel/>
        </>
    );
}

interface StatCardProps {
    label: string;
    amount: number;
    currency: string;
    accent?: boolean;
}

function StatCard({label, amount, currency, accent}: StatCardProps) {
    const positive = amount >= 0;
    return (
        <div
            className={`rounded-2xl border bg-surface/60 backdrop-blur-sm px-6 py-6 flex flex-col gap-3 ${
                accent ? "border-border-strong" : "border-border"
            }`}
        >
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-numeric text-muted">{currency}</span>
                <span
                    className={`font-display text-3xl font-medium tabular-nums ${
                        positive ? "text-foreground" : "text-accent-red"
                    }`}
                >
                    {amount.toFixed(2)}
                </span>
            </div>
        </div>
    );
}

interface AllocationLegendRowProps {
    slice: AllocationSlice;
    currency: string;
}

function AllocationLegendRow({slice, currency}: AllocationLegendRowProps) {
    return (
        <li className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors">
            <div className="flex items-center gap-3 min-w-0">
                <span
                    className="h-2.5 w-2.5 rounded-sm shrink-0"
                    style={{backgroundColor: slice.color}}
                    aria-hidden
                />
                <span className="text-sm font-medium">{slice.label}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
                <span className="font-numeric text-xs text-muted tabular-nums">
                    {(slice.pct * 100).toFixed(1)}%
                </span>
                <span className="font-numeric text-sm tabular-nums">
                    {currency} {slice.value.toFixed(2)}
                </span>
            </div>
        </li>
    );
}
