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
            <div className="max-w-sm mx-auto mt-20 p-6 border border-border rounded-xl bg-surface">
                <p className="mb-4 text-sm text-muted">Logged in as <span className="text-foreground font-medium">{username}</span></p>
                <button
                    type="button"
                    onClick={() => dispatch(logout())}
                    className="w-full py-2 bg-surface-raised text-foreground rounded-lg border border-border text-sm hover:border-muted transition-colors"
                >
                    Log out
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-sm mx-auto mt-20 p-8 border border-border rounded-xl bg-surface flex flex-col gap-5"
        >
            <div>
                <p className="text-xs uppercase tracking-widest text-muted mb-1">Personal Finance</p>
                <h1 className="text-2xl font-semibold">WealthLedger</h1>
            </div>

            <label className="flex flex-col gap-1.5">
                <span className="text-xs text-muted uppercase tracking-widest">Username</span>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={loading}
                    className="bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted transition-colors disabled:opacity-50"
                />
            </label>

            <label className="flex flex-col gap-1.5">
                <span className="text-xs text-muted uppercase tracking-widest">Password</span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-muted transition-colors disabled:opacity-50"
                />
            </label>

            <button
                type="submit"
                disabled={loading}
                className="py-2.5 bg-foreground text-background rounded-lg text-sm font-medium disabled:opacity-40 transition-opacity"
            >
                {loading ? "Signing in..." : "Sign in"}
            </button>

            {loginError && <p className="text-accent-red text-xs text-center">{loginError}</p>}
        </form>
    );
}
