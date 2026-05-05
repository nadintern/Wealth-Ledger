import type {RootState} from "@/features";
import {createSelector} from "@reduxjs/toolkit";
import {selectTransactions} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {Transaction} from "@/features/transaction-and-filters/slices/transactionSlice";
import {
    selectRates,
    selectPreferredCurrency,
} from "@/features/multi-currency-converter/selectors/currencySelectors";

export const selectTypeFilter = (state: RootState) => state.filter.type;
export const selectCategoryFilter = (state: RootState) => state.filter.category;

export const selectFilteredTransaction = createSelector(
    [
        selectTransactions,
        selectTypeFilter,
        selectCategoryFilter,
    ],
    (transactions, type, category) => {
        if (!transactions) return null;

        return transactions.filter((txn: Transaction) => {
            const typeMatch = type === null || txn.type === type;
            const categoryMatch = category === null || txn.category === category;

            return typeMatch && categoryMatch;
        });
    }
);

export type ConvertedTransaction = Transaction & {convertedAmount: number};

export const selectConvertedFilteredTransaction = createSelector(
    [selectFilteredTransaction, selectRates, selectPreferredCurrency],
    (filtered, rates, preferred): ConvertedTransaction[] | null => {
        if (!filtered) return null;
        return filtered.map((txn) => {
            const fx =
                rates && rates[txn.currency]
                    ? rates[preferred] / rates[txn.currency]
                    : 1;
            return {...txn, convertedAmount: txn.amount * fx};
        });
    }
);