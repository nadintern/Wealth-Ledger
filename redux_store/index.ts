import {configureStore} from "@reduxjs/toolkit";
import authReducer from "@/redux_store/slices/authSlice";

/**
 * The purpose of configureStore is to create a redux_store from which we can fetch the state from
 *
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});

/**
 * RootState is a type that will be later used in the project .
 * This contains the type which returned by the function getState
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;