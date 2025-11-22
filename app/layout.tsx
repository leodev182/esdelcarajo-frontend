import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/src/lib/providers/QueryProvider";
import { AuthProvider } from "@/src/context/AuthContext"; // 👈 AGREGAR
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Del Carajo - Devotos del Arte",
  description: "Ropa urbana venezolana con actitud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {" "}
          {/* 👈 AGREGAR */}
          <QueryProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </QueryProvider>
        </AuthProvider>{" "}
        {/* 👈 AGREGAR */}
      </body>
    </html>
  );
}
