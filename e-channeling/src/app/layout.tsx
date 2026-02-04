import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/providers/ReduxProvider";
import InitAuth from "@/components/auth/InitAuth";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "eChannelling - Your Health, Our Priority",
    description:
        "Find and book appointments with top doctors near you. eChannelling by SLT Mobitel - making healthcare accessible.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
                suppressHydrationWarning
            >
                <ReduxProvider>
                    <InitAuth />
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
