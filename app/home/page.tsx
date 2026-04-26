"use client";

import {useSelector} from "react-redux";
import type {RootState} from "@/features";
import {
    selectTransactionsLoading,
    selectTransactionsError,
    selectTotalBalance,
} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {selectFilteredTransaction} from "@/features/transaction-and-filters/selectors/filterSelectors";
import {selectUsername} from "@/features/auth/selectors/authSelectors";
import FilterBar from "@/components/FilterBar";
import CryptoPortfolio from "@/components/CryptoPortfolio";
import NotificationsPanel from "@/components/NotificationsPanel";

export default function HomePage() {
    const username = useSelector((state: RootState) => selectUsername(state));
    const transactions = useSelector((state: RootState) => selectFilteredTransaction(state));
    const loading = useSelector((state: RootState) => selectTransactionsLoading(state));
    const error = useSelector((state: RootState) => selectTransactionsError(state));
    const totalBalance = useSelector((state: RootState) => selectTotalBalance(state));

    if (loading) {
        return <p className="p-6 text-muted">Loading transactions...</p>;
    }

    if (error) {
        return <p className="p-6 text-accent-red">{error}</p>;
    }

    return (
        <main className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-widest text-muted mb-1">Welcome back</p>
                    <h1 className="text-2xl font-semibold">{username}</h1>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-muted mb-1">Balance</p>
                    <span
                        className={`text-2xl font-numeric font-medium ${totalBalance >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                        ₹{totalBalance.toFixed(2)}
                    </span>
                </div>
            </div>

            <NotificationsPanel />

            <CryptoPortfolio />

            <FilterBar />

            <section className="flex flex-col gap-2">
                <h2 className="text-xs uppercase tracking-widest text-muted mb-2">Transactions</h2>
                {!transactions || transactions.length === 0 ? (
                    <p className="text-muted">No transactions found.</p>
                ) : (
                    transactions.map((txn) => (
                        <div
                            key={txn.id}
                            className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface border border-border"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium capitalize">{txn.description}</span>
                                <span className="text-xs text-muted capitalize">{txn.category} · {txn.date}</span>
                            </div>
                            <span
                                className={`font-numeric text-sm font-medium ${txn.type === "credit" ? "text-accent-green" : "text-accent-red"}`}>
                                {txn.type === "credit" ? "+" : "−"}{txn.currency} {txn.amount.toFixed(2)}
                            </span>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}
