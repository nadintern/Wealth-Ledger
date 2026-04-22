import {createSlice} from "@reduxjs/toolkit";
import {simulateTxnFetch} from "@/features/transaction/thunks/transactionThunk";

export type Transaction = {
    id: number;
    date: string;
    amount: number;
    type: "credit" | "debit";
    category:
        | "food"
        | "transport"
        | "shopping"
        | "bills"
        | "salary"
        | "entertainment";
    description: string;
    currency: "INR" | "USD" | "EUR";
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

export const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
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


export default transactionSlice.reducer;