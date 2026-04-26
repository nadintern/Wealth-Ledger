import {createSelector} from "@reduxjs/toolkit";
import type {RootState} from "@/features";

export const selectNotifications = (state: RootState) => state.notifications.items;

/**
 * Memoized: returns the most recent N notifications, sorted newest-first.
 * Recomputes only when `selectNotifications` returns a new array reference
 * (i.e. the underlying items array actually changed).
 */
export const selectRecentNotifications = createSelector(
    [selectNotifications],
    (items) => {
        const MAX = 5;
        // slice() avoids mutating the Redux array (sort() is in-place).
        return items.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, MAX);
    }
);
