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
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted px-1">Alerts</h2>
            <div className="flex flex-col gap-1.5">
                {items.map((n) => (
                    <div
                        key={n.id}
                        className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-surface/60 border border-border hover:border-border-strong transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <span
                                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                    n.severity === "warn" ? "bg-accent-red" : "bg-accent-blue"
                                }`}
                                aria-hidden
                            />
                            <span className="text-sm truncate">{n.message}</span>
                        </div>
                        <button
                            onClick={() => dispatch(dismissNotification(n.id))}
                            aria-label="Dismiss"
                            className="text-xs text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
