"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;
  
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    console.log(" Added 'dark' class");
  } else {
    root.classList.remove("dark");
    console.log(" Removed 'dark' class");
  }
  console.log(" Current classes:", root.className);
};

const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
};

const setCookie = (name: string, value: string, days = 365) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const storedTheme = getCookie("theme") as Theme | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = storedTheme || systemTheme;
        console.log("📂 Initial theme:", initialTheme);
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === "light" ? "dark" : "light";
            setCookie("theme", newTheme);
            console.log("🔄 Toggle:", prev, "→", newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};

export const ThemeClientWrapper = ({ children }: { children: ReactNode }) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};