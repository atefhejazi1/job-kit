"use client";

import { ReactNode } from "react";
import { ThemeClientWrapper, useTheme } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function ClientAppWrapper({ children }: { children: ReactNode }) {
    return (
        <ThemeClientWrapper>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    {children}
                </div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { background: "#fff", color: "#363636", borderRadius: 8 },
                    }}
                />
            </AuthProvider>
        </ThemeClientWrapper>
    );
}
