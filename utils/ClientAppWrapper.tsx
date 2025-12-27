"use client";

import { ReactNode } from "react";
import Script from "next/script";
import { ThemeClientWrapper } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function ClientAppWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Script
        id="theme-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                        (function() {
                            try {
                                function getCookie(name) {
                                    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                                    return match ? match[2] : null;
                                }
                                
                                var theme = getCookie('theme');
                                if (theme === 'dark') {
                                    document.documentElement.classList.add('dark');
                                } else if (theme === 'light') {
                                    document.documentElement.classList.remove('dark');
                                }
                            } catch (e) {
                                console.error('Error applying theme from cookie', e);
                            }
                        })();
                    `,
        }}
      />

      <ThemeClientWrapper>
        <AuthProvider>
          <div
            className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300"
            suppressHydrationWarning
          >
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
    </>
  );
}
