import {createAsyncThunk} from "@reduxjs/toolkit";
import type {RootState} from "@/features";
import {simulateTxnFetchFromDb} from "@/features/transaction-and-filters/utils/transactionFetchSimulation";

export const simulateTxnFetch = createAsyncThunk(
    "transaction-and-filters/simulateTxnFetch",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        // Fall back to "guest" if username isn't set yet — keeps the thunk
        // safe to dispatch from REHYDRATE before auth has populated.
        const userId = state.auth.username ?? "guest";
        return await simulateTxnFetchFromDb(userId);
    }
);
