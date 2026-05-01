import {createSelector} from "@reduxjs/toolkit";
import {selectTotalBalance} from "@/features/transaction-and-filters/selectors/transactionSelectors";
import {
    selectPortfolioTotal,
    selectHoldingsValue,
} from "@/features/portfolio/selectors/portfolioSelectors";

/**
 * Selector-of-selectors. Net worth = cash + crypto, both already in the
 * preferred currency thanks to Feature 4. The component reads this and
 * never does its own addition.
 */
export const selectNetWorth = createSelector(
    [selectTotalBalance, selectPortfolioTotal],
    (cash, crypto) => cash + crypto
);

export interface AllocationSlice {
    key: "cash" | "bitcoin" | "ethereum" | "solana";
    label: string;
    value: number;
    pct: number;
    color: string;
}

const COLORS = {
    cash: "#60a5fa",
    bitcoin: "#f59e0b",
    ethereum: "#a78bfa",
    solana: "#34d399",
} as const;

export const selectAssetAllocation = createSelector(
    [selectTotalBalance, selectHoldingsValue],
    (cash, holdings): AllocationSlice[] => {
        const slices: Omit<AllocationSlice, "pct">[] = [
            {key: "cash", label: "Cash", value: Math.max(cash, 0), color: COLORS.cash},
            {key: "bitcoin", label: "Bitcoin", value: holdings?.bitcoin ?? 0, color: COLORS.bitcoin},
            {key: "ethereum", label: "Ethereum", value: holdings?.ethereum ?? 0, color: COLORS.ethereum},
            {key: "solana", label: "Solana", value: holdings?.solana ?? 0, color: COLORS.solana},
        ];
        const total = slices.reduce((acc, s) => acc + s.value, 0);
        return slices.map((s) => ({...s, pct: total > 0 ? s.value / total : 0}));
    }
);
