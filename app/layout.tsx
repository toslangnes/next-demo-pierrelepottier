import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {Toaster} from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Memecoin Explorer | Discover and Track Memecoins",
    description: "Explore, track, and create memecoins on our platform. Get real-time price data and detailed information about popular memecoins.",
    keywords: ["memecoin", "cryptocurrency", "blockchain", "trading", "crypto"],
    authors: [{name: "Memecoin Explorer Team"}],
    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: "https://memecoin-explorer.example.com",
        title: "Memecoin Explorer | Discover and Track Memecoins",
        description: "Explore, track, and create memecoins on our platform. Get real-time price data and detailed information about popular memecoins.",
        siteName: "Memecoin Explorer",
    },
    twitter: {
        card: "summary_large_image",
        title: "Memecoin Explorer | Discover and Track Memecoins",
        description: "Explore, track, and create memecoins on our platform. Get real-time price data and detailed information about popular memecoins.",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
        <Header/>
        <main className="p-4 flex flex-col mx-4 flex-grow">{children}</main>
        <Footer/>
        <Toaster richColors position="top-center" closeButton/>
        </body>
        </html>
    );
}
