import {createSlice, PayloadAction, nanoid} from "@reduxjs/toolkit";
import {simulateTxnFetch} from "@/features/transaction-and-filters/thunks/transactionThunk";

export type TransactionType = "income" | "expense";

// Expense categories (debited from balance) + income sources (credited).
// Mirrors the faker generator's two source lists.
export type ExpenseCategory =
    | "food"
    | "transport"
    | "entertainment"
    | "utilities"
    | "shopping"
    | "health"
    | "education"
    | "rent";

export type IncomeCategory = "salary" | "freelance" | "investment";

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
    "food",
    "transport",
    "entertainment",
    "utilities",
    "shopping",
    "health",
    "education",
    "rent",
] as const;

export const INCOME_CATEGORIES: readonly IncomeCategory[] = [
    "salary",
    "freelance",
    "investment",
] as const;

export type Transaction = {
    id: string;            // UUID from faker
    date: string;          // ISO 8601, e.g. "2026-04-21T15:30:00.000Z"
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    description: string;
    currency: "USD";       // Generator emits USD only; FX still applies via rates
};

interface ITransactionState {
    transactions: Transaction[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: ITransactionState = {
    transactions: null,
    loading: false,
    error: null,
};

// Payload accepted by the addTransaction reducer. id + currency are
// filled in by the reducer itself so the caller (form) stays small.
export type NewTransactionInput = Omit<Transaction, "id" | "currency">;

export const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        addTransaction: (
            state,
            action: PayloadAction<NewTransactionInput>
        ) => {
            const txn: Transaction = {
                ...action.payload,
                id: nanoid(),
                currency: "USD",
            };
            // Prepend so newest entries surface first in the ledger view.
            state.transactions = state.transactions
                ? [txn, ...state.transactions]
                : [txn];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(simulateTxnFetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(simulateTxnFetch.fulfilled, (state, action) => {
                state.transactions = action.payload;
                state.loading = false;
            })
            .addCase(simulateTxnFetch.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch transactions";
            });
    },
});


export const {addTransaction} = transactionSlice.actions;

export default transactionSlice.reducer;
