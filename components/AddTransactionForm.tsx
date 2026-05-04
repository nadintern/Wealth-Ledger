"use client";

import {useState} from "react";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "@/features";
import {
    addTransaction,
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,
    type TransactionType,
    type TransactionCategory,
    type ExpenseCategory,
    type IncomeCategory,
} from "@/features/transaction-and-filters/slices/transactionSlice";

const FIELD_CLASS =
    "bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-border-strong transition-colors w-full";

export default function AddTransactionForm() {
    const dispatch = useDispatch<AppDispatch>();

    const [open, setOpen] = useState(false);
    const [type, setType] = useState<TransactionType>("expense");
    const [category, setCategory] = useState<TransactionCategory>("food");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(
        // default to today in YYYY-MM-DD for the <input type="date">
        new Date().toISOString().slice(0, 10)
    );
    const [error, setError] = useState<string | null>(null);

    // When type flips, reset the category to the first valid option for that
    // type — otherwise an "expense" could be left with category "salary".
    const handleTypeChange = (next: TransactionType) => {
        setType(next);
        setCategory(
            next === "income"
                ? INCOME_CATEGORIES[0]
                : EXPENSE_CATEGORIES[0]
        );
    };

    const reset = () => {
        setType("expense");
        setCategory("food");
        setAmount("");
        setDescription("");
        setDate(new Date().toISOString().slice(0, 10));
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numeric = Number(amount);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            setError("Amount must be a positive number.");
            return;
        }
        if (!description.trim()) {
            setError("Description is required.");
            return;
        }

        dispatch(
            addTransaction({
                type,
                category,
                amount: numeric,
                description: description.trim(),
                // Store full ISO so it sorts/filters consistently with the
                // generator's existing entries.
                date: new Date(date).toISOString(),
            })
        );

        reset();
        setOpen(false);
    };

    const categoryOptions: readonly TransactionCategory[] =
        type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
            >
                + Add transaction
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setOpen(false)}
                >
                    <form
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                        className="w-full max-w-md p-6 rounded-2xl border border-border bg-surface flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold tracking-tight">
                                New transaction
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-xs text-muted hover:text-foreground transition-colors"
                            >
                                Close
                            </button>
                        </div>

                        {/* Type toggle — two pill buttons so it reads at a glance */}
                        <div className="grid grid-cols-2 gap-2">
                            {(["expense", "income"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => handleTypeChange(t)}
                                    className={`py-2 rounded-lg text-xs uppercase tracking-[0.2em] border transition-colors ${
                                        type === t
                                            ? "border-border-strong bg-surface-raised text-foreground"
                                            : "border-border text-muted hover:text-foreground"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                                Category
                            </span>
                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value as
                                            | ExpenseCategory
                                            | IncomeCategory
                                    )
                                }
                                className={FIELD_CLASS + " cursor-pointer"}
                            >
                                {categoryOptions.map((c) => (
                                    <option key={c} value={c}>
                                        {c[0].toUpperCase() + c.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                                Amount (USD)
                            </span>
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className={FIELD_CLASS + " font-numeric tabular-nums"}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                                Description
                            </span>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Groceries at Whole Foods"
                                className={FIELD_CLASS}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                                Date
                            </span>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={FIELD_CLASS}
                            />
                        </label>

                        {error && (
                            <p className="text-xs text-accent-red">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Save transaction
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
