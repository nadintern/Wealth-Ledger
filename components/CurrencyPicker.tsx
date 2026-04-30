"use client";

import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "@/features";
import {
    setPreferredCurrency,
    type CurrencyCode,
} from "@/features/multi-currency-converter/slices/currencySlice";
import {fetchRatesThunk} from "@/features/multi-currency-converter/thunks/fetchRatesThunk";
import {
    selectPreferredCurrency,
    selectRates,
    selectCurrencyLoading,
    selectCurrencyError,
    SUPPORTED_CURRENCIES,
} from "@/features/multi-currency-converter/selectors/currencySelectors";

export default function CurrencyPicker() {
    const dispatch = useDispatch<AppDispatch>();

    const preferred = useSelector((s: RootState) => selectPreferredCurrency(s));
    const rates = useSelector((s: RootState) => selectRates(s));
    const loading = useSelector((s: RootState) => selectCurrencyLoading(s));
    const error = useSelector((s: RootState) => selectCurrencyError(s));

    return (
        <section
            className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                    Preferred currency
                </p>
                {rates && (
                    <span className="text-xs text-muted font-numeric tabular-nums">
                        1 USD = {rates[preferred].toFixed(4)} {preferred}
                    </span>
                )}
                {loading && (
                    <span className="text-xs text-muted">Refreshing…</span>
                )}
                {error && (
                    <span className="text-xs text-accent-red">{error}</span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={preferred}
                    onChange={(e) =>
                        dispatch(
                            setPreferredCurrency(e.target.value as CurrencyCode)
                        )
                    }
                    className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm font-medium"
                >
                    {SUPPORTED_CURRENCIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => dispatch(fetchRatesThunk())}
                    disabled={loading}
                    className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs font-medium hover:bg-surface-hover disabled:opacity-50"
                >
                    Refresh
                </button>
            </div>
        </section>
    );
}
