import {RootState} from "@/features";
import {Transaction} from "@/features/transaction/slices/transactionSlice";
import {createSelector} from "@reduxjs/toolkit";

// Base selectors — read raw state directly
export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectTransactionsError = (state: RootState) => state.transactions.error;

/**
 * Derived selector — computes total balance from raw transactions.
 * createSelector memoizes: only recomputes when selectTransactions output changes.
 * Assignment: all derived values must live in selectors, never in components.
 */
export const selectTotalBalance = createSelector(
    selectTransactions,
    (transactions: Transaction[] | null) => {
        if (!transactions) return 0;
        return transactions.reduce((acc, txn) => {
            return txn.type === "credit" ? acc + txn.amount : acc - txn.amount;
        }, 0);
    }
);
