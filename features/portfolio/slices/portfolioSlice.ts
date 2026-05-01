import {createSlice} from "@reduxjs/toolkit";
import {
    fetchCryptoPrices,
    type CryptoPrices,
} from "@/features/portfolio/thunks/cryptoThunk";

interface IPortfolioState {
    holdings: CryptoPrices; // units owned (e.g. 0.5 BTC)
    prices: CryptoPrices | null; // latest fetched USD prices
    loading: boolean;
    error: string | null;
}

/**
 * Mock holdings (hardcoded ).
 */
const initialState: IPortfolioState = {
    holdings: {bitcoin: 0.5, ethereum: 2, solana: 10},
    prices: null,
    loading: false,
    error: null,
};

const portfolioSlice = createSlice({
    name: "portfolio",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCryptoPrices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCryptoPrices.fulfilled, (state, action) => {
                // Only the new prices are persisted. previousPrices in the
                // payload exists for OTHER slices (notifications) — this slice
                // does not need to remember it.
                state.prices = action.payload.prices;
                state.loading = false;
            })
            .addCase(fetchCryptoPrices.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch crypto prices";
            });
    },
});

export default portfolioSlice.reducer;
