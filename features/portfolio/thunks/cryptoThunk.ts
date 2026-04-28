import {createAsyncThunk} from "@reduxjs/toolkit";
import type {RootState} from "@/features";

export type CryptoPrices = {
    bitcoin: number;
    ethereum: number;
    solana: number;
};

export interface FetchCryptoPricesPayload {
    prices: CryptoPrices;
    previousPrices: CryptoPrices | null;
}

const COINGECKO_URL =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd";

/**
 * Fetches BTC/ETH/SOL prices from CoinGecko.
 *
 * Returns BOTH the new prices and the previous prices that were in the store
 * at the moment the thunk started. This lets every slice that listens to
 * `fetchCryptoPrices.fulfilled` compute a price delta WITHOUT having to keep
 * its own duplicate snapshot of the previous fetch.
 *
 * Naming convention: "<sliceName>/<thunkName>" — RTK uses this string as the
 * action type prefix (pending/fulfilled/rejected).
 */
export const fetchCryptoPrices = createAsyncThunk<FetchCryptoPricesPayload>(
    "portfolio/fetchCryptoPrices",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const previousPrices = state.portfolio.prices;

        const res = await fetch(COINGECKO_URL);
        if (!res.ok) {
            // RTK automatically routes thrown errors into the .rejected case.
            throw new Error(`CoinGecko request failed: ${res.status}`);
        }

        const json = (await res.json()) as {
            bitcoin: { usd: number };
            ethereum: { usd: number };
            solana: { usd: number };
        };

        const prices: CryptoPrices = {
            bitcoin: json.bitcoin.usd,
            ethereum: json.ethereum.usd,
            solana: json.solana.usd,
        };

        return {prices, previousPrices};
    }
);
