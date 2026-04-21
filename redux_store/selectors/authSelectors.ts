import {RootState} from "@/redux_store";

export const selectUsername = (state: RootState) => state.auth.username;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectLoginError = (state: RootState) => state.auth.loginError;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
