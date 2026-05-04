"use client";

import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/features";
import {
    setTypeFilter,
    setCategory,
    clearFilters,
} from "@/features/transaction-and-filters/slices/filterSlice";
import {
    selectTypeFilter,
    selectCategoryFilter,
} from "@/features/transaction-and-filters/selectors/filterSelectors";
import {
    Transaction,
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,
} from "@/features/transaction-and-filters/slices/transactionSlice";

const SELECT_CLASS =
    "px-3 py-1.5 rounded-md bg-surface-raised border border-border text-xs text-foreground hover:border-border-strong focus:border-border-strong transition-colors cursor-pointer";

export default function FilterBar() {
    const dispatch = useDispatch<AppDispatch>();

    const type = useSelector((state: RootState) => selectTypeFilter(state));
    const category = useSelector((state: RootState) => selectCategoryFilter(state));

    const hasFilter = type !== null || category !== null;

    return (
        <div className="flex gap-2 flex-wrap items-center">
            <select
                value={type ?? ""}
                onChange={(e) => {
                    const v = e.target.value;
                    dispatch(setTypeFilter(v === "" ? null : (v as Transaction["type"])));
                }}
                className={SELECT_CLASS}
            >
                <option value="">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <select
                value={category ?? ""}
                onChange={(e) => {
                    const v = e.target.value;
                    dispatch(setCategory(v === "" ? null : (v as Transaction["category"])));
                }}
                className={SELECT_CLASS}
            >
                <option value="">All categories</option>
                <optgroup label="Expense">
                    {EXPENSE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c[0].toUpperCase() + c.slice(1)}
                        </option>
                    ))}
                </optgroup>
                <optgroup label="Income">
                    {INCOME_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c[0].toUpperCase() + c.slice(1)}
                        </option>
                    ))}
                </optgroup>
            </select>

            {hasFilter && (
                <button
                    onClick={() => dispatch(clearFilters())}
                    className="px-3 py-1.5 rounded-md text-xs text-muted hover:text-foreground transition-colors"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
