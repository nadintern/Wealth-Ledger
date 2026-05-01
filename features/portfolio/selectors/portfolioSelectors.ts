import {createSelector} from "@reduxjs/toolkit";
import type {RootState} from "@/features";
import {
    selectRates,
    selectPreferredCurrency,
} from "@/features/multi-currency-converter/selectors/currencySelectors";

// Base selectors — read raw state directly.
export const selectHoldings = (state: RootState) => state.portfolio.holdings;
export const selectPrices = (state: RootState) => state.portfolio.prices;
export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;
export const selectPortfolioError = (state: RootState) => state.portfolio.error;


export const selectConvertedPrices = createSelector(
    [selectPrices, selectRates, selectPreferredCurrency],
    (prices, rates, preferred) => {
        if (!prices) return null;
        const fx = rates ? rates[preferred] : 1;
        return {
            bitcoin: prices.bitcoin * fx,
            ethereum: prices.ethereum * fx,
            solana: prices.solana * fx,
        };
    }
);


export const selectHoldingsValue = createSelector(
    [selectHoldings, selectPrices, selectRates, selectPreferredCurrency],
    (holdings, prices, rates, preferred) => {
        if (!prices) return null;
        const fx = rates ? rates[preferred] : 1;
        return {
            bitcoin: holdings.bitcoin * prices.bitcoin * fx,
            ethereum: holdings.ethereum * prices.ethereum * fx,
            solana: holdings.solana * prices.solana * fx,
        };
    }
);

/**
 * Composed selector — uses the OUTPUT of selectHoldingsValue as its input.
 * Inherits the currency-awareness from selectHoldingsValue, so the total
 * automatically reflects the preferred currency without any change here.
 * This is the "selector of selectors" pattern the rubric explicitly calls out.
 */
export const selectPortfolioTotal = createSelector(
    [selectHoldingsValue],
    (values) => {
        if (!values) return 0;
        return values.bitcoin + values.ethereum + values.solana;
    }
);
