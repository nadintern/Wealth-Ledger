"use client";

import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/features";
import {
    setTypeFilter,
    setCategory,
    setCurrency,
    clearFilters,
} from "@/features/transaction-and-filters/slices/filterSlice";
import {
    selectTypeFilter,
    selectCategoryFilter,
    selectCurrencyFilter,
} from "@/features/transaction-and-filters/selectors/filterSelectors";
import {Transaction} from "@/features/transaction-and-filters/slices/transactionSlice";

const SELECT_CLASS =
    "px-3 py-1.5 rounded-md bg-surface-raised border border-border text-xs text-foreground hover:border-border-strong focus:border-border-strong transition-colors cursor-pointer";

export default function FilterBar() {
    const dispatch = useDispatch<AppDispatch>();

    const type = useSelector((state: RootState) => selectTypeFilter(state));
    const category = useSelector((state: RootState) => selectCategoryFilter(state));
    const currency = useSelector((state: RootState) => selectCurrencyFilter(state));

    const hasFilter = type !== null || category !== null || currency !== null;

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
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
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
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills</option>
                <option value="salary">Salary</option>
                <option value="entertainment">Entertainment</option>
            </select>

            <select
                value={currency ?? ""}
                onChange={(e) => {
                    const v = e.target.value;
                    dispatch(setCurrency(v === "" ? null : (v as Transaction["currency"])));
                }}
                className={SELECT_CLASS}
            >
                <option value="">All currencies</option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
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
