"use client";

import LoginForm from "@/components/LoginForm";
import {useSelector} from "react-redux";
import {selectIsAuthenticated} from "@/features/auth/selectors/authSelectors";
import {redirect} from "next/navigation";
import {RootState} from "@/features";

export default function Home() {
    /**
     *  can use useSelectoe(selectIsAuthenticated) instead of useSelector((state:RootState) => selectIsAuthenticated(state)) because TS can infer the type
     *  thanks to selectors that i've defined previously.
     */
    const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
    console.log(isAuthenticated);
    return isAuthenticated ? (redirect("/dashboard")) : <LoginForm/>;
}
