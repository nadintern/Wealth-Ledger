import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {
    EXPENSE_CATEGORIES,
    type ExpenseCategory,
} from "@/features/transaction-and-filters/slices/transactionSlice";

// Budgets only apply to expense categories. Income categories don't get budgets.
export type BudgetCategory = ExpenseCategory;
export const BUDGET_CATEGORIES = EXPENSE_CATEGORIES;

interface IBudgetsState {
    // Stored as USD (the internal base currency, same as crypto prices).
    // Selectors convert into the user's preferred currency for display.
    amounts: Record<BudgetCategory, number>;
}

const initialState: IBudgetsState = {
    amounts: {
        food: 600,
        transport: 300,
        entertainment: 200,
        utilities: 400,
        shopping: 500,
        health: 300,
        education: 200,
        rent: 1500,
    },
};

const budgetsSlice = createSlice({
    name: "budgets",
    initialState,
    reducers: {
        setBudget(
            state,
            action: PayloadAction<{category: BudgetCategory; amount: number}>
        ) {
            state.amounts[action.payload.category] = action.payload.amount;
        },
    },
});

export const {setBudget} = budgetsSlice.actions;
export default budgetsSlice.reducer;
