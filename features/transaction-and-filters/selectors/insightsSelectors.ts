import {createSelector} from "@reduxjs/toolkit";
import type {RootState} from "@/features";
import {selectTransactions} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {
    selectRates,
    selectPreferredCurrency,
} from "@/features/multi-currency-converter/selectors/currencySelectors";
import {
    BUDGET_CATEGORIES,
    type BudgetCategory,
} from "@/features/budgets/slices/budgetsSlice";
import type {Transaction} from "@/features/transaction-and-filters/slices/transactionSlice";

export const selectBudgets = (state: RootState) => state.budgets.amounts;

export const CATEGORY_COLORS: Record<BudgetCategory, string> = {
    food: "#34d399",
    transport: "#60a5fa",
    entertainment: "#a78bfa",
    utilities: "#f59e0b",
    shopping: "#f472b6",
    health: "#22d3ee",
    education: "#fb923c",
    rent: "#facc15",
};

const OVER_BUDGET_THRESHOLD = 1.0;

/**
 * Convert a transaction's amount into USD (internal base unit).
 * Generator only emits USD currently, but this stays generic so a
 * multi-currency seed file would still work.
 */
function txnAmountInUsd(
    txn: Transaction,
    rates: Record<string, number> | null
): number {
    if (!rates) return txn.amount;
    const r = rates[txn.currency];
    return r ? txn.amount / r : txn.amount;
}

/** ISO date string → "YYYY-MM" bucket (sortable). */
function monthKey(iso: string): string | null {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
}

/**
 * Buckets expense-only transactions by month then category, in USD.
 * Income (salary/freelance/investment) is excluded.
 */
export const selectMonthlyCategorySpend = createSelector(
    [selectTransactions, selectRates],
    (transactions, rates) => {
        const out: Record<string, Partial<Record<BudgetCategory, number>>> = {};
        if (!transactions) return out;

        for (const txn of transactions) {
            if (txn.type !== "expense") continue;
            if (!BUDGET_CATEGORIES.includes(txn.category as BudgetCategory)) continue;
            const month = monthKey(txn.date);
            if (!month) continue;

            const usd = txnAmountInUsd(txn, rates);
            const cat = txn.category as BudgetCategory;
            if (!out[month]) out[month] = {};
            out[month][cat] = (out[month][cat] ?? 0) + usd;
        }
        return out;
    }
);

export interface CategorySliceItem {
    category: BudgetCategory;
    label: string;
    value: number;
    color: string;
}

export const selectCurrentMonthCategorySpend = createSelector(
    [selectMonthlyCategorySpend, selectRates, selectPreferredCurrency],
    (monthly, rates, preferred): CategorySliceItem[] => {
        const months = Object.keys(monthly).sort();
        const latest = months[months.length - 1];
        const fxToPreferred = rates ? rates[preferred] : 1;

        return BUDGET_CATEGORIES.map((cat) => {
            const usd = latest ? (monthly[latest]?.[cat] ?? 0) : 0;
            return {
                category: cat,
                label: cat[0].toUpperCase() + cat.slice(1),
                value: usd * fxToPreferred,
                color: CATEGORY_COLORS[cat],
            };
        });
    }
);

export interface MonthlyTotalItem {
    month: string;
    label: string;
    total: number;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const selectMonthlyTotalSpend = createSelector(
    [selectMonthlyCategorySpend, selectRates, selectPreferredCurrency],
    (monthly, rates, preferred): MonthlyTotalItem[] => {
        const fxToPreferred = rates ? rates[preferred] : 1;
        const months = Object.keys(monthly).sort();
        const recent = months.slice(-6);

        return recent.map((m) => {
            const cats = monthly[m] ?? {};
            const usd = Object.values(cats).reduce<number>((acc, v) => acc + (v ?? 0), 0);
            const [year, mm] = m.split("-");
            return {
                month: m,
                label: `${MONTH_NAMES[Number(mm) - 1]} '${year.slice(-2)}`,
                total: usd * fxToPreferred,
            };
        });
    }
);

export interface BudgetUtilizationItem {
    category: BudgetCategory;
    label: string;
    spent: number;
    budget: number;
    pct: number;
    color: string;
}

export const selectBudgetUtilization = createSelector(
    [selectMonthlyCategorySpend, selectBudgets, selectRates, selectPreferredCurrency],
    (monthly, budgets, rates, preferred): BudgetUtilizationItem[] => {
        const months = Object.keys(monthly).sort();
        const latest = months[months.length - 1];
        const fxToPreferred = rates ? rates[preferred] : 1;

        return BUDGET_CATEGORIES.map((cat) => {
            const spentUsd = latest ? (monthly[latest]?.[cat] ?? 0) : 0;
            const budgetUsd = budgets[cat];
            return {
                category: cat,
                label: cat[0].toUpperCase() + cat.slice(1),
                spent: spentUsd * fxToPreferred,
                budget: budgetUsd * fxToPreferred,
                pct: budgetUsd > 0 ? spentUsd / budgetUsd : 0,
                color: CATEGORY_COLORS[cat],
            };
        });
    }
);

export const selectOverBudgetCategories = createSelector(
    [selectBudgetUtilization],
    (items): BudgetCategory[] =>
        items.filter((i) => i.pct >= OVER_BUDGET_THRESHOLD).map((i) => i.category)
);
