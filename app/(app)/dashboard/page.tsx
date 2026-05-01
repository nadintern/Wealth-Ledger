"use client";

import {useSelector} from "react-redux";
import type {RootState} from "@/features";
import {selectUsername} from "@/features/auth/selectors/authSelectors";
import {selectTotalBalance} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {selectPortfolioTotal} from "@/features/portfolio/selectors/portfolioSelectors";
import {selectPreferredCurrency} from "@/features/multi-currency-converter/selectors/currencySelectors";
import PageHeader from "@/components/PageHeader";
import NotificationsPanel from "@/components/NotificationsPanel";

export default function DashboardPage() {
    const username = useSelector((s: RootState) => selectUsername(s));
    const totalBalance = useSelector((s: RootState) => selectTotalBalance(s));
    const portfolioTotal = useSelector((s: RootState) => selectPortfolioTotal(s));
    const preferred = useSelector((s: RootState) => selectPreferredCurrency(s));

    const netWorth = totalBalance + portfolioTotal;

    return (
        <>
            <PageHeader
                eyebrow={`Welcome back, ${username}`}
                title="Overview"
                description="A snapshot of your cash, crypto, and net position — all in your preferred currency."
            />

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Net worth"
                    amount={netWorth}
                    currency={preferred}
                    accent
                />
                <StatCard
                    label="Cash balance"
                    amount={totalBalance}
                    currency={preferred}
                />
                <StatCard
                    label="Crypto holdings"
                    amount={portfolioTotal}
                    currency={preferred}
                />
            </section>

            <NotificationsPanel/>

            <section className="rounded-2xl border border-border bg-surface/40 px-6 py-10 flex flex-col items-center gap-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                    Coming next
                </p>
                <h2 className="font-display text-xl font-semibold">
                    Net-worth dashboard with live polling
                </h2>
                <p className="text-sm text-muted max-w-md">
                    Feature 5 will render historical net-worth here, sparkline included.
                </p>
            </section>
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
