import {createAsyncThunk} from "@reduxjs/toolkit";
import {CurrencyCode} from "@/features/multi-currency-converter/slices/currencySlice";

export interface FetchRatesPayload {
    base: CurrencyCode,
    rates : Record<CurrencyCode, number>;
}

const BASE_URL = "https://open.er-api.com/v6/latest/USD";
const MY_CURRENCIES: CurrencyCode[] = ["USD", "EUR", "GBP", "INR", "JPY"];

export const fetchRatesThunk = createAsyncThunk<FetchRatesPayload>(
    "currency/fetchRates",
    async () => {
        const res = await fetch(BASE_URL);
        const json = await res.json();

        // const rates: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>;
        // for(const currency of MY_CURRENCIES){
        //     rates[currency] = json.rates[currency];
        // }


        /**
         * This function is as same as the for loop above.
         * acc here is accumulator and the 2nd argument of reduce is the inital value
         * which in our case is an empty object of type Record<CurrencyCode, number>
         */
        const rates = MY_CURRENCIES.reduce(
            (acc,currency) => {
                acc[currency] = json.rates[currency];
                return acc;
            },
            {} as Record<CurrencyCode, number>
        );

        return {
            base: "USD",
            rates: rates,
        }
    }
);



