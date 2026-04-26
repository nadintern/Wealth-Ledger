import {createAsyncThunk} from "@reduxjs/toolkit";
import {simulateTxnFetchFromDb} from "@/features/transaction-and-filters/utils/transactionFetchSimulation";

export const simulateTxnFetch = createAsyncThunk(
    "transaction-and-filters/simulateTxnFetch",
    async () => {
        return await simulateTxnFetchFromDb();
    }
);