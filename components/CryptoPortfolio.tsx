"use client";

import {useSelector} from "react-redux";
import type {RootState} from "@/features";
import {
    selectHoldings,
    selectPrices,
    selectHoldingsValue,
    selectPortfolioTotal,
    selectPortfolioLoading,
    selectPortfolioError,
} from "@/features/portfolio/selectors/portfolioSelectors";

const ASSET_LABEL: Record<"bitcoin" | "ethereum" | "solana", string> = {
    bitcoin: "BTC",
    ethereum: "ETH",
    solana: "SOL",
};

export default function CryptoPortfolio() {
    const holdings = useSelector((state: RootState) => selectHoldings(state));
    const prices = useSelector((state: RootState) => selectPrices(state));
    const values = useSelector((state: RootState) => selectHoldingsValue(state));
    const total = useSelector((state: RootState) => selectPortfolioTotal(state));
    const loading = useSelector((state: RootState) => selectPortfolioLoading(state));
    const error = useSelector((state: RootState) => selectPortfolioError(state));

    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs uppercase tracking-widest text-muted">Crypto Portfolio</h2>
                <span className="text-sm font-numeric font-medium">
                    ${total.toFixed(2)}
                </span>
            </div>

            {loading && <p className="text-muted text-sm">Loading prices...</p>}
            {error && <p className="text-accent-red text-sm">{error}</p>}

            {!loading && !error && prices && values && (
                <div className="flex flex-col gap-2">
                    {(Object.keys(holdings) as Array<keyof typeof holdings>).map((asset) => (
                        <div
                            key={asset}
                            className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface border border-border"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium">{ASSET_LABEL[asset]}</span>
                                <span className="text-xs text-muted font-numeric">
                                    {holdings[asset]} units · ${prices[asset].toFixed(2)}
                                </span>
                            </div>
                            <span className="font-numeric text-sm font-medium">
                                ${values[asset].toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
