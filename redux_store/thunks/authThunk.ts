import {createAsyncThunk} from "@reduxjs/toolkit";

/**
 * Normally for synchronous actions, reducers are created first and then actions are declared inside.
 * But for async Thunks , thunks are usually created first .
 * Also, name should be given in the format <sliceName>/<thunkName>
 */
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({userName, password}: { userName: string, password: string }) => {
        //simulates one second for asyn login
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (userName == "nadeem" && password == "nadeem") {
            return userName;
        } else {
            throw new Error("Invalid login credentials");
        }
    }
);
