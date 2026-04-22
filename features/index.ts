import {configureStore, createListenerMiddleware} from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import transactionReducer from "@/features/transaction/slices/transactionSlice";
import {loginUser} from "@/features/auth/thunks/authThunk";
import {simulateTxnFetch} from "@/features/transaction/thunks/transactionThunk";


const listnerMiddleware = createListenerMiddleware();

listnerMiddleware.startListening({
    actionCreator: loginUser.fulfilled, // which action to watch
    effect: async (_action, listnerApi) => {
        listnerApi.dispatch(simulateTxnFetch())
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