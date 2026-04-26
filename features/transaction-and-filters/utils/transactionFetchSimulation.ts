import MOCK_DATA from "@/data/MOCK_DATA.json"
import {Transaction} from "@/features/transaction-and-filters/slices/transactionSlice";

export const simulateTxnFetchFromDb = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return MOCK_DATA as Transaction[];
};