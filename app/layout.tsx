import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/src/lib/providers/QueryProvider";
import { AuthProvider } from "@/src/context/AuthContext";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { zuumeRough } from "@/src/lib/fonts/fonts";
import { Toaster } from "sonner";

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
    <html lang="es" className={zuumeRough.variable}>
      <body className="antialiased">
        <AuthProvider>
          <QueryProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </QueryProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
