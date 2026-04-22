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
            <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
                <p className="mb-4">Welcome, {username}</p>
                <button
                    type="button"
                    onClick={() => dispatch(logout())}
                    className="w-full py-2 bg-gray-800 text-white rounded"
                >
                    Log out
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-sm mx-auto mt-10 p-6 border rounded flex flex-col gap-3"
        >
            <label className="flex flex-col gap-1">
                <span>Username</span>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={loading}
                    className="border rounded px-2 py-1"
                />
            </label>

            <label className="flex flex-col gap-1">
                <span>Password</span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="border rounded px-2 py-1"
                />
            </label>

            <button
                type="submit"
                disabled={loading}
                className="py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
                {loading ? "Logging in…" : "Log in"}
            </button>

            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
        </form>
    );
}
