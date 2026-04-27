"use client";

import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "@/features";
import {
    selectIsAuthenticated,
    selectLoading,
    selectLoginError,
    selectUsername,
} from "@/features/auth/selectors/authSelectors";
import {loginUser} from "@/features/auth/thunks/authThunk";
import {logout} from "@/features/auth/slices/authSlice";

export default function LoginForm() {
    const dispatch = useDispatch<AppDispatch>();
    const username = useSelector((state: RootState) => selectUsername(state));
    const loading = useSelector((state: RootState) => selectLoading(state));
    const loginError = useSelector((state: RootState) => selectLoginError(state));
    const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({userName, password}));
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-sm p-8 border border-border rounded-2xl bg-surface/60 backdrop-blur-sm flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Signed in</p>
                        <p className="text-lg font-semibold tracking-tight">{username}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => dispatch(logout())}
                        className="w-full py-2.5 bg-surface-raised text-foreground rounded-lg border border-border text-sm hover:border-border-strong transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm p-8 border border-border rounded-2xl bg-surface/60 backdrop-blur-sm flex flex-col gap-6"
            >
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent-green" aria-hidden/>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Personal Finance</p>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">WealthLedger</h1>
                    <p className="text-xs text-muted">Sign in to view your dashboard.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Username</span>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={loading}
                            autoComplete="username"
                            className="bg-surface-raised border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-border-strong transition-colors disabled:opacity-50"
                        />
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            autoComplete="current-password"
                            className="bg-surface-raised border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-border-strong transition-colors disabled:opacity-50"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
                >
                    {loading ? "Signing in…" : "Sign in"}
                </button>

                {loginError && (
                    <p className="text-accent-red text-xs text-center -mt-2">{loginError}</p>
                )}
            </form>
        </div>
    );
}
