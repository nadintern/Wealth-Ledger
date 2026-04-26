import {configureStore, createListenerMiddleware} from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import transactionReducer from "@/features/transaction-and-filters/slices/transactionSlice";
import filterReducer from "@/features/transaction-and-filters/slices/filterSlice"
import portfolioReducer from "@/features/portfolio/slices/portfolioSlice";
import notificationsReducer from "@/features/notifications/slices/notificationsSlice";
import {loginUser} from "@/features/auth/thunks/authThunk";
import {simulateTxnFetch} from "@/features/transaction-and-filters/thunks/transactionThunk";
import {fetchCryptoPrices} from "@/features/portfolio/thunks/cryptoThunk";


const listnerMiddleware = createListenerMiddleware();

listnerMiddleware.startListening({
    actionCreator: loginUser.fulfilled, // which action to watch
    effect: async (_action, listnerApi) => {
        listnerApi.dispatch(simulateTxnFetch());
        listnerApi.dispatch(fetchCryptoPrices());
    }
});

/**
 * The purpose of configureStore is to create a features from which we can fetch the state from
 *
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        filter: filterReducer,
        portfolio: portfolioReducer,
        notifications: notificationsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listnerMiddleware.middleware),
});

/**
 * RootState is a type that will be later used in the project .
 * This contains the type which returned by the function getState
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;