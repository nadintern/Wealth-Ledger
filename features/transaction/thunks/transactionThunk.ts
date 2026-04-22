import {createAsyncThunk} from "@reduxjs/toolkit";
import {simulateTxnFetchFromDb} from "@/features/transaction/utils/transactionFetchSimulation";

export const simulateTxnFetch = createAsyncThunk(
    "transaction/simulateTxnFetch",
    async () => {
        return await simulateTxnFetchFromDb();
    }
);