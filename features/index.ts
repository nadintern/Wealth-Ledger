import {configureStore, createListenerMiddleware} from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import transactionReducer from "@/features/transaction-and-filters/slices/transactionSlice";
import filterReducer from "@/features/transaction-and-filters/slices/filterSlice"
import portfolioReducer from "@/features/portfolio/slices/portfolioSlice";
import notificationsReducer from "@/features/notifications/slices/notificationsSlice";
import currencyReducer from "@/features/multi-currency-converter/slices/currencySlice";
import budgetsReducer from "@/features/budgets/slices/budgetsSlice";
import {loginUser} from "@/features/auth/thunks/authThunk";
import {simulateTxnFetch} from "@/features/transaction-and-filters/thunks/transactionThunk";
import {fetchCryptoPrices} from "@/features/portfolio/thunks/cryptoThunk";
import {fetchRatesThunk} from "@/features/multi-currency-converter/thunks/fetchRatesThunk";
import {selectOverBudgetCategories} from "@/features/transaction-and-filters/selectors/insightsSelectors";
import {addNotification} from "@/features/notifications/slices/notificationsSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist";

//Preffered Currency Config
//This configuration is what we will be using to configure how persisting logic would work for currencySlice
const currencyPersistConfig = {
    key: "currency", // the local storage key name (in local-storage, datas are stored as key-val pairs and this auto-gens a key called persist:currency internally)
    storage,
    whitelist: ["preferred"] //onlt this state field is persisted , while others aren't
}

const persistedCurrencyReducer = persistReducer(currencyPersistConfig, currencyReducer);

//Auth status config
const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["username", "isAuthenticated"]
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Budgets — persist the entire amounts map so user-set thresholds survive reloads
const budgetsPersistConfig = {
    key: "budgets",
    storage,
    whitelist: ["amounts"],
};

const persistedBudgetsReducer = persistReducer(budgetsPersistConfig, budgetsReducer);

const listnerMiddleware = createListenerMiddleware();
listnerMiddleware.startListening({
    actionCreator: loginUser.fulfilled, // which action to watch
    effect: async (_action, listnerApi) => {
        listnerApi.dispatch(simulateTxnFetch());
        listnerApi.dispatch(fetchCryptoPrices());
        listnerApi.dispatch(fetchRatesThunk());
    }
});

listnerMiddleware.startListening({
    type: REHYDRATE,
    effect : async (_action, listnerApi) => {
        listnerApi.dispatch(simulateTxnFetch());
        listnerApi.dispatch(fetchCryptoPrices());
        listnerApi.dispatch(fetchRatesThunk());
    }
})

/**
 * Feature 6 — Budget alert listener.
 * Fires whenever transactions arrive (login or rehydrate). Reads the
 * over-budget categories selector against the post-action state and
 * dispatches one notification per offender. The notifications slice
 * de-dupes on id so re-fetches don't multiply alerts.
 */
listnerMiddleware.startListening({
    actionCreator: simulateTxnFetch.fulfilled,
    effect: async (_action, listenerApi) => {
        const state = listenerApi.getState() as RootState;
        const offenders = selectOverBudgetCategories(state);
        for (const cat of offenders) {
            listenerApi.dispatch(
                addNotification({
                    id: `budget-${cat}`,
                    message: `${cat[0].toUpperCase()}${cat.slice(1)} spend has exceeded its monthly budget.`,
                    severity: "warn",
                })
            );
        }
    },
});

/**
 * The purpose of configureStore is to create a features from which we can fetch the state from
 *
 */
export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        transactions: transactionReducer,
        filter: filterReducer,
        portfolio: portfolioReducer,
        notifications: notificationsReducer,
        currency: persistedCurrencyReducer,
        budgets: persistedBudgetsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).prepend(listnerMiddleware.middleware),
});

export const persistor = persistStore(store);

/**
 * RootState is a type that will be later used in the project .
 * This contains the type which returned by the function getState
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;