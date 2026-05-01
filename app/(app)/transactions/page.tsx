"use client";

import {useSelector} from "react-redux";
import type {RootState} from "@/features";
import {
    selectTransactionsLoading,
    selectTransactionsError,
} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {selectConvertedFilteredTransaction} from "@/features/transaction-and-filters/selectors/filterSelectors";
import {selectPreferredCurrency} from "@/features/multi-currency-converter/selectors/currencySelectors";
import PageHeader from "@/components/PageHeader";
import FilterBar from "@/components/FilterBar";

export default function TransactionsPage() {
    const transactions = useSelector((s: RootState) => selectConvertedFilteredTransaction(s));
    const loading = useSelector((s: RootState) => selectTransactionsLoading(s));
    const error = useSelector((s: RootState) => selectTransactionsError(s));
    const preferred = useSelector((s: RootState) => selectPreferredCurrency(s));

    return (
        <>
            <PageHeader
                eyebrow="Activity"
                title="Transactions"
                description="Filter your full ledger and see each entry converted to your preferred currency."
            />

            <section className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted">
                        Ledger
                    </h2>
                    <FilterBar/>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <p className="px-6 py-10 text-sm text-muted text-center">
                            Loading transactions…
                        </p>
                    ) : error ? (
                        <p className="px-6 py-10 text-sm text-accent-red text-center">{error}</p>
                    ) : !transactions || transactions.length === 0 ? (
                        <p className="px-6 py-12 text-sm text-muted text-center">
                            No transactions match the current filters.
                        </p>
                    ) : (
                        transactions.map((txn) => (
                            <div
                                key={txn.id}
                                className="flex items-center justify-between px-6 py-4 hover:bg-surface-hover transition-colors"
                            >
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-sm font-medium capitalize truncate">
                                        {txn.description}
                                    </span>
                                    <span className="text-xs text-muted capitalize">
                                        {txn.category} · {txn.date}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5 shrink-0">
                                    <span
                                        className={`font-numeric text-sm font-medium tabular-nums ${
                                            txn.type === "credit"
                                                ? "text-accent-green"
                                                : "text-accent-red"
                                        }`}
                                    >
                                        {txn.type === "credit" ? "+" : "−"}
                                        {txn.currency} {txn.amount.toFixed(2)}
                                    </span>
                                    {txn.currency !== preferred && (
                                        <span className="text-xs text-muted font-numeric tabular-nums">
                                            ≈ {preferred} {txn.convertedAmount.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    );
}
