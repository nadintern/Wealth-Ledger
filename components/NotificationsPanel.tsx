"use client";

import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "@/features";
import {selectRecentNotifications} from "@/features/notifications/selectors/notificationsSelectors";
import {dismissNotification} from "@/features/notifications/slices/notificationsSlice";

export default function NotificationsPanel() {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector((s: RootState) => selectRecentNotifications(s));

    if (items.length === 0) return null;

    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-1">Alerts</h2>
            {items.map((n) => (
                <div
                    key={n.id}
                    className={`flex items-center justify-between px-4 py-2 rounded-lg border ${
                        n.severity === "warn"
                            ? "bg-surface border-accent-red text-accent-red"
                            : "bg-surface border-border"
                    }`}
                >
                    <span className="text-sm">{n.message}</span>
                    <button
                        onClick={() => dispatch(dismissNotification(n.id))}
                        className="text-xs text-muted hover:text-foreground ml-3"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </section>
    );
}
