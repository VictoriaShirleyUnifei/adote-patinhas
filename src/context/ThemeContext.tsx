"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Extensão do Palette do MUI
declare module "@mui/material/styles" {
  interface Palette {
    card: {
      default: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
    };
  }
  interface PaletteOptions {
    card?: {
      default: string;
    };
    status?: {
      success: string;
      warning: string;
      error: string;
    };
  }
}

const ThemeContext = createContext<{
  mode: "light" | "dark";
  toggleMode: () => void;
} | null>(null);

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode deve ser usado dentro do ThemeModeProvider");
  }
  return ctx;
}

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#516953" },
                secondary: { main: "#CD8C52" },
                background: { default: "#B7D1A3", paper: "#FFFFFF" },
                card: { default: "#F2F1EB"},
                text: { primary: "#5E3929", secondary: "#A9A9A9" },
                status: {
                  success: "#66E36E",
                  warning: "#E3CA66",
                  error: "#CD5252",
                },
              }
            : {
                primary: { main: "#3A4A3C" },
                secondary: { main: "#A86A3F" },
                background: { default: "#101411", paper: "#101411" },
                card: {default: "#252525"},
                text: { primary: "#F2F1EB", secondary: "#A9A9A9" },
                status: {
                  success: "#4FAF57",
                  warning: "#D0B84F",
                  error: "#B74A4A",
                },
              }),
        },
        typography: {
          fontFamily: "var(--font-quicksand), sans-serif",
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
