"use client";

import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import type {AppDispatch, RootState} from "@/features";
import {persistor} from "@/features";
import {selectUsername} from "@/features/auth/selectors/authSelectors";
import {logout} from "@/features/auth/slices/authSlice";
import PageHeader from "@/components/PageHeader";
import CurrencyPicker from "@/components/CurrencyPicker";

export default function SettingsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const username = useSelector((s: RootState) => selectUsername(s));

    const handleLogout = async () => {
        dispatch(logout());
        await persistor.purge();
        router.push("/");
    };

    return (
        <>
            <PageHeader
                eyebrow="Preferences"
                title="Settings"
                description="Manage how WealthLedger displays your data and account session."
            />

            <section className="flex flex-col gap-3">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted px-1">
                    Display currency
                </h2>
                <CurrencyPicker/>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted px-1">
                    Account
                </h2>
                <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                            Signed in as
                        </span>
                        <span className="text-sm font-medium tracking-tight">{username}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs font-medium hover:bg-surface-hover transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </section>
        </>
    );
}
