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

const ASSET_LABEL: Record<"bitcoin" | "ethereum" | "solana", { ticker: string; name: string }> = {
    bitcoin: {ticker: "BTC", name: "Bitcoin"},
    ethereum: {ticker: "ETH", name: "Ethereum"},
    solana: {ticker: "SOL", name: "Solana"},
};

export default function CryptoPortfolio() {
    const holdings = useSelector((state: RootState) => selectHoldings(state));
    const prices = useSelector((state: RootState) => selectPrices(state));
    const values = useSelector((state: RootState) => selectHoldingsValue(state));
    const total = useSelector((state: RootState) => selectPortfolioTotal(state));
    const loading = useSelector((state: RootState) => selectPortfolioLoading(state));
    const error = useSelector((state: RootState) => selectPortfolioError(state));

    return (
        <section className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted">Crypto Portfolio</h2>
                <span className="text-sm font-numeric font-medium tabular-nums">
                    ${total.toFixed(2)}
                </span>
            </div>

            {loading && (
                <p className="px-6 py-8 text-sm text-muted text-center">Loading prices…</p>
            )}
            {error && (
                <p className="px-6 py-8 text-sm text-accent-red text-center">{error}</p>
            )}

            {!loading && !error && prices && values && (
                <div className="divide-y divide-border">
                    {(Object.keys(holdings) as Array<keyof typeof holdings>).map((asset) => (
                        <div
                            key={asset}
                            className="flex items-center justify-between px-6 py-4 hover:bg-surface-hover transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-surface-raised border border-border flex items-center justify-center text-[10px] font-semibold tracking-wider text-muted-strong">
                                    {ASSET_LABEL[asset].ticker}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{ASSET_LABEL[asset].name}</span>
                                    <span className="text-xs text-muted font-numeric tabular-nums">
                                        {holdings[asset]} {ASSET_LABEL[asset].ticker} · ${prices[asset].toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <span className="font-numeric text-sm font-medium tabular-nums">
                                ${values[asset].toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
