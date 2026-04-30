import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {fetchRatesThunk} from "@/features/multi-currency-converter/thunks/fetchRatesThunk";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "JPY";

interface ICurrencyState {
    base: CurrencyCode;
    preferred: CurrencyCode;
    rates: Record<CurrencyCode, number> | null;
    loading: boolean;
    error: string | null;
}

const initialState: ICurrencyState = {
    base: "USD",
    preferred: "USD",
    rates: null,
    loading: false,
    error: null,
};

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        setPreferredCurrency: (state,action: PayloadAction<CurrencyCode>) => {
            state.preferred = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRatesThunk.fulfilled, (state, action) => {
                // action.payload is typed as FetchRatesPayload because the
                // thunk was declared with createAsyncThunk<FetchRatesPayload>.
                state.base = action.payload.base;
                state.rates = action.payload.rates;
                state.loading = false;
            })
            .addCase(fetchRatesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch FX rates";
            });
    },
});

export const {setPreferredCurrency} = currencySlice.actions;
export default currencySlice.reducer;
