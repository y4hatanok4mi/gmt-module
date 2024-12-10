import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ClientDndProvider from "@/components/dnd-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GeomeTriks",
    description: "Interactive E-Learning Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ClientDndProvider>
                            <div className="min-h-screen flex flex-col justify-center">
                                <main>{children}</main>
                            </div>
                        </ClientDndProvider>
                    </ThemeProvider>
                </body>
            </html>
        </SessionProvider>
    );
}
