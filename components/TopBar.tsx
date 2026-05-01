"use client";

import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import type {AppDispatch, RootState} from "@/features";
import {persistor} from "@/features";
import {selectUsername} from "@/features/auth/selectors/authSelectors";
import {selectPreferredCurrency} from "@/features/multi-currency-converter/selectors/currencySelectors";
import {logout} from "@/features/auth/slices/authSlice";

export default function TopBar() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const username = useSelector((s: RootState) => selectUsername(s));
    const preferred = useSelector((s: RootState) => selectPreferredCurrency(s));

    const handleLogout = async () => {
        dispatch(logout());
        await persistor.purge();
        router.push("/");
    };

    return (
        <header className="flex items-center justify-between gap-4 px-6 lg:px-10 h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3 min-w-0">
                <div className="lg:hidden flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent-green" aria-hidden/>
                    <span className="font-display text-base font-semibold">
                        WealthLedger
                    </span>
                </div>
                <div className="hidden lg:flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                        Signed in as
                    </span>
                    <span className="text-sm font-medium tracking-tight">{username}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-raised">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                        Currency
                    </span>
                    <span className="font-numeric text-xs font-medium">{preferred}</span>
                </span>
                <button
                    onClick={handleLogout}
                    className="rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-medium hover:bg-surface-hover transition-colors"
                >
                    Log out
                </button>
            </div>
        </header>
    );
}
