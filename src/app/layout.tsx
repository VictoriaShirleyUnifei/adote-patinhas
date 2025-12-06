import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeModeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";

const quicksand = Quicksand({
  variable: "--font-quicksand", 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Adote Patinhas",
  description: "Adoção é um ato de amor!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} antialiased`}
      >
        <ThemeModeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeModeProvider>
      </body>
    </html>
  );
}
