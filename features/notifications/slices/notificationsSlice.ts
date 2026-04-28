import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {fetchCryptoPrices} from "@/features/portfolio/thunks/cryptoThunk";

export type Severity = "info" | "warn";

export interface INotification {
    id: string;
    message: string;
    createdAt: number;
    severity: Severity;
}

interface INotificationsState {
    items: INotification[];
}

const initialState: INotificationsState = {
    items: [],
};

const PRICE_MOVE_THRESHOLD = 0.05; // ±5% — assignment requirement

const ASSET_LABEL: Record<"bitcoin" | "ethereum" | "solana", string> = {
    bitcoin: "Bitcoin",
    ethereum: "Ethereum",
    solana: "Solana",
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        dismissNotification(state, action: PayloadAction<string>) {
            state.items = state.items.filter((n) => n.id !== action.payload);
        },
        clearAll(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        // Cross-slice listener: same action that portfolioSlice listens to.
        builder.addCase(fetchCryptoPrices.fulfilled, (state, action) => {
            const {prices, previousPrices} = action.payload;

            // First fetch — nothing to compare against, so no alerts.
            if (!previousPrices) return;

            (Object.keys(prices) as Array<keyof typeof prices>).forEach((asset) => {
                const prev = previousPrices[asset];
                const next = prices[asset];
                if (prev === 0) return;

                const delta = (next - prev) / prev;
                if (Math.abs(delta) > PRICE_MOVE_THRESHOLD) {
                    const direction = delta > 0 ? "rose" : "dropped";
                    const pct = (Math.abs(delta) * 100).toFixed(1);
                    state.items.push({
                        id: `${asset}-${Date.now()}`,
                        message: `${ASSET_LABEL[asset]} ${direction} ${pct}%`,
                        createdAt: Date.now(),
                        severity: "warn",
                    });
                }
            });
        });
    },
});

export const {dismissNotification, clearAll} = notificationsSlice.actions;
export default notificationsSlice.reducer;
