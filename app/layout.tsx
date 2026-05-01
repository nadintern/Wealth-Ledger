import type {Metadata} from "next";
import {Inter, Inter_Tight, JetBrains_Mono} from "next/font/google";
import "./globals.css";
import {Providers} from "@/app/providers";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const interTight = Inter_Tight({
    variable: "--font-inter-tight",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "WealthLedger",
    description: "Personal Finance Dashboard",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
