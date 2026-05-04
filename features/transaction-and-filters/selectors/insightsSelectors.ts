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



export interface MonthlyIncomeExpenseItem {
    month: string;     // "YYYY-MM" — sortable key
    label: string;     // "Apr '26"
    income: number;    // in preferred currency
    expense: number;
    net: number;       // income − expense (positive = saved, negative = overspent)
}

/**
 * Buckets every transaction by month, separating income from expense,
 * then converts each bucket into the user's preferred currency.
 * Returns the most recent 6 months.
 */
export const selectMonthlyIncomeVsExpense = createSelector(
    [selectTransactions, selectRates, selectPreferredCurrency],
    (transactions, rates, preferred): MonthlyIncomeExpenseItem[] => {
        if (!transactions) return [];

        const fx = rates ? rates[preferred] : 1;
        const buckets: Record<string, {income: number; expense: number}> = {};

        for (const txn of transactions) {
            const month = monthKey(txn.date);
            if (!month) continue;
            const usd = txnAmountInUsd(txn, rates);
            if (!buckets[month]) buckets[month] = {income: 0, expense: 0};
            if (txn.type === "income") buckets[month].income += usd;
            else buckets[month].expense += usd;
        }

        const recent = Object.keys(buckets).sort().slice(-6);
        return recent.map((m) => {
            const {income, expense} = buckets[m];
            const [year, mm] = m.split("-");
            return {
                month: m,
                label: `${MONTH_NAMES[Number(mm) - 1]} '${year.slice(-2)}`,
                income: income * fx,
                expense: expense * fx,
                net: (income - expense) * fx,
            };
        });
    }
);

export interface CurrentMonthSummary {
    income: number;
    expense: number;
    net: number;
    savingsRate: number; // 0..1 — share of income kept this month
}

/**
 * One-liner KPIs for the current (latest) month. savingsRate clamps to
 * 0 when there's no income, otherwise it's net / income (can go negative
 * if the user overspent against income).
 */
export const selectCurrentMonthSummary = createSelector(
    [selectMonthlyIncomeVsExpense],
    (months): CurrentMonthSummary => {
        const latest = months[months.length - 1];
        if (!latest) return {income: 0, expense: 0, net: 0, savingsRate: 0};
        const savingsRate = latest.income > 0 ? latest.net / latest.income : 0;
        return {
            income: latest.income,
            expense: latest.expense,
            net: latest.net,
            savingsRate,
        };
    }
);

export interface TopExpenseItem {
    id: string;
    description: string;
    category: string;
    date: string;
    amount: number; // in preferred currency
}

/**
 * The five biggest single expense transactions in the current (latest)
 * month, in the user's preferred currency. Useful for spotting outliers
 * the category breakdown can hide.
 */
export const selectTopExpensesThisMonth = createSelector(
    [selectTransactions, selectRates, selectPreferredCurrency],
    (transactions, rates, preferred): TopExpenseItem[] => {
        if (!transactions || transactions.length === 0) return [];

        // Find the latest month present in the data so this works even
        // if "today" is in a month with no transactions yet.
        const months = new Set<string>();
        for (const t of transactions) {
            const k = monthKey(t.date);
            if (k) months.add(k);
        }
        const latest = [...months].sort().pop();
        if (!latest) return [];

        const fx = rates ? rates[preferred] : 1;

        return transactions
            .filter((t) => t.type === "expense" && monthKey(t.date) === latest)
            .map((t) => ({
                id: t.id,
                description: t.description,
                category: t.category,
                date: t.date,
                amount: txnAmountInUsd(t, rates) * fx,
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
    }
);
