"use client";

import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import type {AppDispatch, RootState} from "@/features";
import {persistor} from "@/features";
import {
    selectTransactionsLoading,
    selectTransactionsError,
    selectTotalBalance,
} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {selectConvertedFilteredTransaction} from "@/features/transaction-and-filters/selectors/filterSelectors";
import {selectUsername} from "@/features/auth/selectors/authSelectors";
import {selectPreferredCurrency} from "@/features/multi-currency-converter/selectors/currencySelectors";
import {logout} from "@/features/auth/slices/authSlice";
import FilterBar from "@/components/FilterBar";
import CryptoPortfolio from "@/components/CryptoPortfolio";
import NotificationsPanel from "@/components/NotificationsPanel";
import CurrencyPicker from "@/components/CurrencyPicker";

export default function HomePage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const username = useSelector((state: RootState) => selectUsername(state));
    const transactions = useSelector((state: RootState) => selectConvertedFilteredTransaction(state));
    const loading = useSelector((state: RootState) => selectTransactionsLoading(state));
    const error = useSelector((state: RootState) => selectTransactionsError(state));
    const totalBalance = useSelector((state: RootState) => selectTotalBalance(state));
    const preferred = useSelector((state: RootState) => selectPreferredCurrency(state));

    const handleLogout = async () => {
        dispatch(logout());
        await persistor.purge();
        router.push("/");
    };

    return (
        <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
            {/* Header / balance card */}
            <header className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm px-6 py-6 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Welcome back</p>
                    <h1 className="text-xl font-semibold tracking-tight">{username}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Total balance</p>
                        <span
                            className={`text-2xl font-numeric font-medium tabular-nums ${
                                totalBalance >= 0 ? "text-foreground" : "text-accent-red"
                            }`}
                        >
                            {preferred} {totalBalance.toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs font-medium hover:bg-surface-hover transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <CurrencyPicker/>

            <NotificationsPanel/>

            <CryptoPortfolio/>

            {/* Transactions card */}
            <section className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted">Transactions</h2>
                    <FilterBar/>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <p className="px-6 py-8 text-sm text-muted text-center">Loading transactions…</p>
                    ) : error ? (
                        <p className="px-6 py-8 text-sm text-accent-red text-center">{error}</p>
                    ) : !transactions || transactions.length === 0 ? (
                        <p className="px-6 py-10 text-sm text-muted text-center">No transactions found.</p>
                    ) : (
                        transactions.map((txn) => (
                            <div
                                key={txn.id}
                                className="flex items-center justify-between px-6 py-4 hover:bg-surface-hover transition-colors"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium capitalize">{txn.description}</span>
                                    <span className="text-xs text-muted capitalize">
                                        {txn.category} · {txn.date}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-0.5">
                                    <span
                                        className={`font-numeric text-sm font-medium tabular-nums ${
                                            txn.type === "credit" ? "text-accent-green" : "text-accent-red"
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
        </main>
    );
}
