import {createSlice} from "@reduxjs/toolkit";
import {loginUser} from "@/features/auth/thunks/authThunk";

interface IAuthState {
    username: string | null;
    loading: boolean;
    loginError: string | null;
    isAuthenticated: boolean;
}

const initialState: IAuthState = {
    username: null,
    loading: false,
    loginError: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.username = null;
            state.loading = false;
            state.loginError = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.loginError = "Login failed";
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.loginError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.username = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
    }

});
/**
 * Actions declared inside reducers are accesible via authSlice.actions thanks to creatSlice method from RTK
 */
export const {logout} = authSlice.actions;
export default authSlice.reducer;
