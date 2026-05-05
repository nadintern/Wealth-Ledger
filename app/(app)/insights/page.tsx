"use client";

import {useSelector} from "react-redux";
import type {RootState} from "@/features";
import {selectPreferredCurrency} from "@/features/multi-currency-converter/selectors/currencySelectors";
import {
    selectCurrentMonthCategorySpend,
    selectMonthlyTotalSpend,
    selectBudgetUtilization,
    selectMonthlyIncomeVsExpense,
    selectCurrentMonthSummary,
    selectTopExpensesThisMonth,
} from "@/features/transaction-and-filters/selectors/insightsSelectors";
import PageHeader from "@/components/PageHeader";
import SpendByCategoryChart from "@/components/SpendByCategoryChart";
import MonthlySpendChart from "@/components/MonthlySpendChart";
import BudgetUtilizationChart from "@/components/BudgetUtilizationChart";
import IncomeVsExpenseChart from "@/components/IncomeVsExpenseChart";
import MonthSummaryStats from "@/components/MonthSummaryStats";
import TopExpensesList from "@/components/TopExpensesList";
import NotificationsPanel from "@/components/NotificationsPanel";

export default function InsightsPage() {
    const preferred = useSelector((s: RootState) => selectPreferredCurrency(s));
    const categorySpend = useSelector((s: RootState) => selectCurrentMonthCategorySpend(s));
    const monthlyTotals = useSelector((s: RootState) => selectMonthlyTotalSpend(s));
    const utilization = useSelector((s: RootState) => selectBudgetUtilization(s));
    const incomeVsExpense = useSelector((s: RootState) => selectMonthlyIncomeVsExpense(s));
    const summary = useSelector((s: RootState) => selectCurrentMonthSummary(s));
    const topExpenses = useSelector((s: RootState) => selectTopExpensesThisMonth(s));

    return (
        <>
            <PageHeader
                eyebrow="Spending"
                title="Insights"
                description="Where your money goes — by category, by month, and against your budgets."
            />

            <section>
                <Card title="This month at a glance">
                    <MonthSummaryStats summary={summary} currency={preferred}/>
                </Card>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="This month by category">
                    <SpendByCategoryChart slices={categorySpend} currency={preferred}/>
                </Card>
                <Card title="Income vs expense (last 6 months)">
                    <IncomeVsExpenseChart months={incomeVsExpense} currency={preferred}/>
                </Card>
                <Card title="Last 6 months — total spend">
                    <MonthlySpendChart months={monthlyTotals} currency={preferred}/>
                </Card>
                <Card title="Top 5 expenses this month">
                    <TopExpensesList items={topExpenses} currency={preferred}/>
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
