"use client";

import {useSelector} from "react-redux";
import type {RootState} from "@/features";
import {selectPreferredCurrency} from "@/features/multi-currency-converter/selectors/currencySelectors";
import {
    selectCurrentMonthCategorySpend,
    selectMonthlyTotalSpend,
    selectBudgetUtilization,
} from "@/features/transaction-and-filters/selectors/insightsSelectors";
import PageHeader from "@/components/PageHeader";
import SpendByCategoryChart from "@/components/SpendByCategoryChart";
import MonthlySpendChart from "@/components/MonthlySpendChart";
import BudgetUtilizationChart from "@/components/BudgetUtilizationChart";
import NotificationsPanel from "@/components/NotificationsPanel";

export default function InsightsPage() {
    const preferred = useSelector((s: RootState) => selectPreferredCurrency(s));
    const categorySpend = useSelector((s: RootState) => selectCurrentMonthCategorySpend(s));
    const monthlyTotals = useSelector((s: RootState) => selectMonthlyTotalSpend(s));
    const utilization = useSelector((s: RootState) => selectBudgetUtilization(s));

    return (
        <>
            <PageHeader
                eyebrow="Spending"
                title="Insights"
                description="Where your money goes — by category, by month, and against your budgets."
            />

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="This month by category">
                    <SpendByCategoryChart slices={categorySpend} currency={preferred}/>
                </Card>
                <Card title="Last 6 months">
                    <MonthlySpendChart months={monthlyTotals} currency={preferred}/>
                </Card>
            </section>

            <section>
                <Card title="Budget utilization">
                    <BudgetUtilizationChart items={utilization} currency={preferred}/>
                </Card>
            </section>

            <NotificationsPanel/>
        </>
    );
}

interface CardProps {
    title: string;
    children: React.ReactNode;
}

function Card({title, children}: CardProps) {
    return (
        <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted">{title}</h2>
            </div>
            <div className="px-6 py-6">{children}</div>
        </div>
    );
}
