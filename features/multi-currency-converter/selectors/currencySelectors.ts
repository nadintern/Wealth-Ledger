import type {RootState} from "@/features";
import type {CurrencyCode} from "@/features/multi-currency-converter/slices/currencySlice";


export const selectPreferredCurrency = (s: RootState): CurrencyCode =>
    s.currency.preferred;

export const selectRates = (s: RootState) => s.currency.rates;

export const selectCurrencyLoading = (s: RootState) => s.currency.loading;

export const selectCurrencyError = (s: RootState) => s.currency.error;


export const SUPPORTED_CURRENCIES: readonly CurrencyCode[] = [
    "USD",
    "EUR",
    "GBP",
    "INR",
    "JPY",
] as const;
