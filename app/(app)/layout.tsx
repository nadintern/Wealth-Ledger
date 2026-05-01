"use client";

import {useSelector} from "react-redux";
import {redirect} from "next/navigation";
import type {RootState} from "@/features";
import {selectIsAuthenticated} from "@/features/auth/selectors/authSelectors";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileNav from "@/components/MobileNav";

export default function AppLayout({children}: {children: React.ReactNode}) {
    const isAuthenticated = useSelector((s: RootState) => selectIsAuthenticated(s));
    if (!isAuthenticated) redirect("/");

    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar/>
                <MobileNav/>
                <main className="flex-1 px-6 lg:px-10 py-8 lg:py-12">
                    <div className="mx-auto w-full max-w-6xl flex flex-col gap-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
