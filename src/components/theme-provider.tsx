"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderState>({
  theme: "light",
  setTheme: () => null,
});

/**
 * Site uses an authored light/studio palette with intentional dark bands.
 * Do not flip html.dark from OS preference or localStorage — that breaks
 * contrast and fights the homepage design.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  }, []);

  const value = React.useMemo(
    () => ({
      theme: "light" as Theme,
      setTheme: () => {
        // Theme toggle disabled for the redesign visual system.
      },
    }),
    []
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
