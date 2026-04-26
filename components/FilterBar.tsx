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

export default function FilterBar() {
    const dispatch = useDispatch<AppDispatch>();

    const type = useSelector((state: RootState) => selectTypeFilter(state));
    const category = useSelector((state: RootState) => selectCategoryFilter(state));
    const currency = useSelector((state: RootState) => selectCurrencyFilter(state));

    return (
        <div className="flex gap-3 flex-wrap items-center">
            <select
                value={type ?? ""}
                onChange={(e) => {
                    const v = e.target.value;
                    dispatch(setTypeFilter(v === "" ? null : (v as Transaction["type"])));
                }}
                className="px-3 py-2 rounded-md bg-surface border border-border text-sm"
            >
                <option value="">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
            </select>

            <select
                value={category ?? ""}
                onChange={(e) => {
                    const v = e.target.value;
                    dispatch(setCategory(v === "" ? null : (v as Transaction["category"])));
                }}
                className="px-3 py-2 rounded-md bg-surface border border-border text-sm"
            >
                <option value="">All Categories</option>
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
                className="px-3 py-2 rounded-md bg-surface border border-border text-sm"
            >
                <option value="">All Currencies</option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select>

            <button
                onClick={() => dispatch(clearFilters())}
                className="px-3 py-2 rounded-md bg-surface border border-border text-sm hover:bg-border"
            >
                Clear
            </button>
        </div>
    );
}
