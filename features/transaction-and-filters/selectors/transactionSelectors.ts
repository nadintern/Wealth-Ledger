import {RootState} from "@/features";
import {Transaction} from "@/features/transaction-and-filters/slices/transactionSlice";
import {createSelector} from "@reduxjs/toolkit";
import {
    selectRates,
    selectPreferredCurrency,
} from "@/features/multi-currency-converter/selectors/currencySelectors";

// Base selectors — read raw state directly
export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectTransactionsError = (state: RootState) => state.transactions.error;

export const selectTotalBalance = createSelector(
    [selectTransactions, selectRates, selectPreferredCurrency],
    (transactions: Transaction[] | null, rates, preferred) => {
        if (!transactions) return 0;
        return transactions.reduce((acc, txn) => {
            const fx = rates ? rates[preferred] / rates[txn.currency] : 1;
            const converted = txn.amount * fx;
            return txn.type === "credit" ? acc + converted : acc - converted;
        }, 0);
    }
);
