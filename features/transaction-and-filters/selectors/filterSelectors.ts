import {RootState} from "@/features";
import {createSelector} from "@reduxjs/toolkit";
import {selectTransactions} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {Transaction} from "@/features/transaction-and-filters/slices/transactionSlice";

export const selectTypeFilter = (state: RootState) => state.filter.type;
export const selectCategoryFilter = (state: RootState) => state.filter.category;
export const selectCurrencyFilter = (state: RootState) => state.filter.currency;

export const selectFilteredTransaction = createSelector(
    [
        selectTransactions,
        selectTypeFilter,
        selectCategoryFilter,
        selectCurrencyFilter
    ],
    (transactions, type, category, currency) => {
        if (!transactions) return null;

        return transactions.filter((txn: Transaction) => {
            const typeMatch = type === null || txn.type === type;
            const categoryMatch = category === null || txn.category === category;
            const currencyMatch = currency === null || txn.currency === currency;

            return typeMatch && categoryMatch && currencyMatch;
        });
    }
);