import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import Navbar from '@/components/global/navbar';
import { Suspense } from "react";
import Loading from "@/components/global/Loading";
import Footer from "@/components/global/Footer";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="min-h-screen">
                        <Navbar />
                        <Suspense fallback={<Loading />}>
                            {children}
                        </Suspense>
                        <Footer />
                        <Toaster />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
