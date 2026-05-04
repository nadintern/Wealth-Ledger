import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Transaction} from "@/features/transaction-and-filters/slices/transactionSlice";

interface IFilterState {
    type: Transaction["type"] | null;
    category: Transaction["category"] | null;
}

const initialState: IFilterState = {
    type: null,
    category: null,
}

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setTypeFilter: (state, action: PayloadAction<Transaction["type"] | null>) => {
            state.type = action.payload;
        },
        setCategory: (state, action: PayloadAction<Transaction["category"] | null>) => {
            state.category = action.payload;
        },
        clearFilters: () => initialState,
    }
})

export const {setTypeFilter, setCategory, clearFilters} = filterSlice.actions;
export default filterSlice.reducer;